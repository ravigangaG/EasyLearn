# 🚀 Peer-to-Peer Learning Platform - Setup Guide

## Quick Start

Follow these steps to get the application running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Backend Environment

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/peer-learning
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=30d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CLIENT_URL=http://localhost:3000
```

**Important:** 
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Change `JWT_SECRET` to a secure random string in production

### Step 3: Start MongoDB

If using local MongoDB:

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or manually start it:
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

If using MongoDB Atlas, skip this step.

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### Step 5: Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

### Step 6: Start Frontend Development Server

```bash
cd frontend
npm start
```

The application will open automatically at `http://localhost:3000`

## 🎉 You're All Set!

The application should now be running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api/health

## Testing the Application

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Explore Resources** - Browse and upload educational materials
4. **Ask Questions** - Post questions and help others
5. **Join Discussions** - Participate in community discussions

## Common Issues & Solutions

### MongoDB Connection Error

**Problem:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check if the connection string in `.env` is correct
- For Atlas, ensure your IP is whitelisted

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
- Change the PORT in backend `.env` file
- Or kill the process using that port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill -9
  ```

### CORS Errors

**Problem:** Cross-origin request blocked

**Solution:**
- Ensure backend is running
- Check `CLIENT_URL` in backend `.env` matches frontend URL
- Clear browser cache

## Project Structure

```
mernstack/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads directory
│   ├── .env                # Environment variables (create this)
│   ├── package.json
│   └── server.js           # Entry point
│
└── frontend/               # React frontend
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── context/       # React context
    │   ├── services/      # API services
    │   ├── App.js
    │   └── index.js
    ├── .env               # Frontend environment variables
    └── package.json
```

## Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/password` - Change password (Protected)

### Resources Endpoints

- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (Protected)
- `PUT /api/resources/:id` - Update resource (Protected)
- `DELETE /api/resources/:id` - Delete resource (Protected)
- `POST /api/resources/:id/rate` - Rate resource (Protected)
- `POST /api/resources/:id/bookmark` - Bookmark resource (Protected)
- `GET /api/resources/:id/download` - Download resource (Protected)

### Questions Endpoints

- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (Protected)
- `PUT /api/questions/:id` - Update question (Protected)
- `DELETE /api/questions/:id` - Delete question (Protected)
- `PUT /api/questions/:id/vote` - Vote on question (Protected)
- `POST /api/questions/:id/answers` - Post answer (Protected)
- `PUT /api/questions/:questionId/answers/:answerId/vote` - Vote on answer (Protected)
- `PUT /api/questions/:questionId/answers/:answerId/accept` - Accept answer (Protected)
- `POST /api/questions/:id/bookmark` - Bookmark question (Protected)

### Discussions Endpoints

- `GET /api/discussions` - Get all discussions
- `GET /api/discussions/:id` - Get single discussion
- `POST /api/discussions` - Create discussion (Protected)
- `PUT /api/discussions/:id` - Update discussion (Protected)
- `DELETE /api/discussions/:id` - Delete discussion (Protected)
- `POST /api/discussions/:id/replies` - Reply to discussion (Protected)
- `PUT /api/discussions/:id/like` - Like discussion (Protected)

### Users Endpoints

- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/resources` - Get user's resources
- `GET /api/users/:id/questions` - Get user's questions

## Features Implemented

✅ User Authentication (JWT)  
✅ Resource Sharing with File Upload  
✅ Q&A System with Voting  
✅ Discussion Forums  
✅ User Profiles & Reputation System  
✅ Bookmarking  
✅ Rating & Reviews  
✅ Search & Filtering  
✅ Responsive Design  
✅ Modern UI with Dark Theme  

## Next Steps

To extend this project, consider adding:

- Real-time notifications using Socket.io
- Email verification
- Password reset functionality
- Advanced search with Elasticsearch
- Video conferencing integration
- Mobile app with React Native
- Admin dashboard
- Analytics and reporting
- Social login (Google, GitHub)
- Content moderation tools

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check MongoDB connection
4. Ensure all environment variables are set correctly

## License

This project is licensed under the MIT License.

---

**Happy Learning! 🎓**
