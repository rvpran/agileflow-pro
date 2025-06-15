AgileFlow Pro
A full-stack kanban board application with React, Node.js, and MongoDB, fully containerized with Docker.
🛠️ Tech Stack
Frontend

React 19 with TypeScript
Vite for fast development and build
Material-UI (MUI) for UI components
@dnd-kit for drag and drop functionality
ESLint + Prettier for code quality

Backend

Node.js 22 with TypeScript
Express web framework
MongoDB with Mongoose
ESLint + Prettier for code quality

DevOps

Docker and Docker Compose for containerization

Prerequisites
Make sure you have the following installed:
Docker Desktop
Git

Quick Start
1 Clone the Repository
bashgit clone https://github.com/rvpran/agileflow-pro.git
cd agileflow-pro
2 Set Up Environment Variables
Create server .env file:
cp server/.env.example server/.env
Edit server/.env with the following values:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/agileflow-pro?authSource=admin


3 Start the Application
bash# Build and start all services (first time)
docker-compose up --build


4 Access the Application

Frontend: http://localhost:5173
Backend API: http://localhost:5000

🔧 Development Commands
Daily Development
bash# Start services (after first build)
docker-compose up