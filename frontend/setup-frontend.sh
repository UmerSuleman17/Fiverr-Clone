#!/bin/bash

echo "🚀 Setting up Fiverr Clone Frontend..."

# Create project
npm create vite@latest frontend -- --template react
cd frontend

# Install core dependencies
echo "📦 Installing core dependencies..."
npm install

# Install Tailwind
echo "🎨 Installing Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install react-router-dom axios socket.io-client
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install react-hook-form @hookform/resolvers
npm install react-hot-toast react-icons date-fns

# Install dev dependencies
echo "🔧 Installing dev dependencies..."
npm install -D @types/node eslint prettier

echo "✅ Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy the configuration files from the documentation"
echo "2. Create your .env file"
echo "3. Run 'npm run dev' to start development"