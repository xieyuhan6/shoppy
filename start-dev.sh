#!/bin/bash

# Start Django Backend
echo "Starting Django Backend..."
cd ecommercesite
source .venv/bin/activate
python manage.py runserver 8000 &
BACKEND_PID=$!

# Start Next.js Frontend
echo "Starting Next.js Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

# If either process exits, kill the other
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT INT TERM
