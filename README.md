# User Dashboard Application

A full-stack user dashboard app with authentication, profile management, and image upload.You can check/View the project video through this Links: https://drive.google.com/file/d/1ICUrusMZeAq6v6DHcQSCZWIyp-z9mNax/view?usp=sharing 
            https://drive.google.com/file/d/1txNkhpJYGSz_SSwVG31IvjBNE6196TKF/view?usp=sharing

## Project Overview

This repository is structured as two separate applications:

- `backend/` — Express + MongoDB API
- `frontend/` — React + Vite user interface

### Key features

- User registration and login with JWT authentication
- Protected dashboard access for authenticated users
- User profile and professional details management
- Profile image upload via multer
- API health and status endpoints
- Frontend routing with React Router and protected routes

## Backend

### Tech stack

- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- Bcrypt password hashing (`bcryptjs`)
- Multer file upload middleware
- CORS support
- dotenv environment config

### Important backend files

- `backend/server.js` — application entry point
- `backend/config/db.js` — MongoDB connection setup
- `backend/controllers/authController.js` — signup/login logic
- `backend/controllers/userController.js` — protected profile CRUD logic
- `backend/middleware/authMiddleware.js` — JWT auth guard
- `backend/routes/authRoutes.js` — auth routes
- `backend/routes/userRoutes.js` — profile routes and image upload handling
- `backend/models/User.js` — user model with password hashing
- `backend/models/UserDetail.js` — user detail model

### Backend environment variables

Create `backend/.env` with at least:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/user_dashboard
JWT_SECRET=your_jwt_secret
```

## Frontend

### Tech stack

- React
- Vite
- React Router DOM
- Axios
- ESLint

### Important frontend files

- `frontend/src/App.jsx` — application routes
- `frontend/src/pages/Login.jsx` — login page
- `frontend/src/pages/Signup.jsx` — signup page
- `frontend/src/pages/Dashboard.jsx` — protected dashboard view
- `frontend/src/components/ProtectedRoute.jsx` — authentication guard
- `frontend/src/components/Navbar.jsx` — top navigation with logout
- `frontend/src/components/UserDetailForm.jsx` — user details form and image upload
- `frontend/src/services/api.js` — Axios instance with token injection

### Frontend environment variables

You can optionally configure the frontend API base URL via `.env` or environment variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

## Installation

Install dependencies separately for backend and frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running the application

Start the backend server:

```bash
npm --prefix backend run dev
```

Start the frontend development server:

```bash
npm --prefix frontend run dev
```

Then open the frontend in your browser. The default Vite port is `5173` and the backend API uses port `5000`.

## Usage

1. Register a new account via `/signup`
2. Log in via `/login`
3. Access the dashboard at `/dashboard`
4. Add or update profile information and upload a profile image

## API Endpoints

### Authentication

- `POST /api/auth/signup` — register new user
- `POST /api/auth/login` — authenticate user

### Profile

- `GET /api/users/profile` — get user profile (requires JWT)
- `POST /api/users/details` — save or update profile details (requires JWT)

### Health

- `GET /api/health` — API and database status

## Notes

- The app stores auth tokens in `localStorage` for the frontend session.
- Uploaded images are served from the backend `uploads/` folder.
- If a port is already in use, Vite may automatically select a different frontend port.

## Troubleshooting

- Make sure MongoDB is running locally before starting the backend.
- If login/signup fails, verify `JWT_SECRET` is set and the backend can connect to MongoDB.
- Use the browser console and network tab to inspect API requests.

## License

This repository does not include a specified license.
