# University Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing university operations including students, faculty, departments, and courses.

## Features

- User Authentication (Login, Signup, Forgot Password)
- Student Management
- Faculty Management
- Department Management
- Course Management
- Dashboard with statistics

## Tech Stack

### Frontend
- React + Vite
- React Router
- Context API for state management
- Axios for HTTP requests

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Configure environment variables:
   - Create `.env` in backend with:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/university-mgmt
     JWT_SECRET=your-secret-key
     ```

5. Run the application:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`

## Project Structure

```
university-mgmt/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
└── backend/           # Express backend
    ├── config/
    ├── models/
    ├── controllers/
    ├── routes/
    ├── middleware/
    └── ...
```

## License

MIT