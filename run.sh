#!/bin/bash

# Activate Python virtual environment
echo "Activating Python virtual environment..."
source devzzz/bin/activate

# Start Node.js backend server
echo "Starting Node.js backend server..."
node src/backend/server.js &  # Adjust the path to your backend server file if necessary

# Run AI model (optional, uncomment if you want to run this)
echo "Running AI model..."
python src/ai/anomaly_detection.py  # Adjust the path to your AI script if necessary

# Keep the script running
echo "Project is running. Press Ctrl+C to stop."
wait

