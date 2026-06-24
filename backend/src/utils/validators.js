const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.length >= 2;
};

const validateGigInput = (data) => {
  const { title, description, category, price } = data;
  
  if (!title || title.length < 5) {
    return { valid: false, message: 'Title must be at least 5 characters' };
  }
  
  if (!description || description.length < 20) {
    return { valid: false, message: 'Description must be at least 20 characters' };
  }
  
  if (!category) {
    return { valid: false, message: 'Category is required' };
  }
  
  if (!price || isNaN(price) || price <= 0) {
    return { valid: false, message: 'Price must be a positive number' };
  }
  
  return { valid: true };
};

const validateOrderInput = (data) => {
  const { gigId } = data;
  
  if (!gigId) {
    return { valid: false, message: 'Gig ID is required' };
  }
  
  return { valid: true };
};

const validateReviewInput = (data) => {
  const { rating, comment } = data;
  
  if (!rating || rating < 1 || rating > 5) {
    return { valid: false, message: 'Rating must be between 1 and 5' };
  }
  
  if (!comment || comment.length < 3) {
    return { valid: false, message: 'Comment must be at least 3 characters' };
  }
  
  return { valid: true };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateGigInput,
  validateOrderInput,
  validateReviewInput,
};