#!/bin/bash

# Create project directories
echo "Creating project directories..."
mkdir -p src/ai
mkdir -p src/backend
mkdir -p contracts
mkdir -p migrations
mkdir -p test

# Initialize Node.js project
echo "Initializing Node.js project..."
npm init -y

# Install necessary Node.js packages
echo "Installing Node.js packages..."
npm install truffle @openzeppelin/contracts web3 express body-parser dotenv cors

# Set up Python virtual environment
echo "Creating Python virtual environment..."
python3 -m venv devzzz

# Activate virtual environment
echo "Activating virtual environment..."
source devzzz/bin/activate

# Install necessary Python packages
echo "Installing Python packages..."
pip install tensorflow  # or any other necessary packages, like PyTorch, Flask, etc.

echo "Setup completed successfully!"
