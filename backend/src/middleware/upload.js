const multer = require('multer');
const multerStorageCloudinary = require('multer-storage-cloudinary');
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;
const cloudinary = require('../services/cloudinary');

let storage;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  try {
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'fiverr-clone',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto:good' }
        ],
      },
    });
  } catch (err) {
    console.warn('Cloudinary storage setup failed, falling back to memory storage:', err.message);
    storage = multer.memoryStorage();
  }
} else {
  storage = multer.memoryStorage();
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

upload.uploadSingle = upload.single('avatar');
upload.uploadMultiple = upload.array('images', 5);
upload.upload = upload;

module.exports = upload;