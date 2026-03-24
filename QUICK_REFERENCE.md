# 🚀 Quick Reference Guide

## Starting the Application

### Method 1: Using Two Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Method 2: Quick Start
```bash
# From project root
cd backend && npm run dev
# Open new terminal
cd frontend && npm start
```

## Common Commands

### Backend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/peer-learning
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## API Testing Examples

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Get Resources
```bash
GET http://localhost:5000/api/resources
```

### Create Resource (Protected)
```bash
POST http://localhost:5000/api/resources
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "JavaScript Basics",
  "description": "Learn JavaScript fundamentals",
  "category": "Computer Science",
  "tags": "javascript,programming",
  "resourceType": "link",
  "fileUrl": "https://example.com/js-guide",
  "difficultyLevel": "beginner"
}
```

## MongoDB Commands

### Start MongoDB
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### Access MongoDB Shell
```bash
mongosh
```

### View Database
```javascript
use peer-learning
db.users.find()
db.resources.find()
db.questions.find()
db.discussions.find()
```

## Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset MongoDB Database
```javascript
use peer-learning
db.dropDatabase()
```

## File Structure Quick Reference

```
backend/
├── config/db.js          - Database connection
├── models/               - MongoDB schemas
├── controllers/          - Business logic
├── routes/              - API endpoints
├── middleware/          - Auth, upload, error
└── server.js            - Entry point

frontend/
├── src/
│   ├── components/      - Reusable components
│   ├── pages/          - Page components
│   ├── context/        - State management
│   ├── services/       - API calls
│   └── App.js          - Main component
```

## Git Commands (Optional)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MERN Learning Platform"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

## Useful URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health
- **MongoDB Compass:** mongodb://localhost:27017

## Keyboard Shortcuts

### VS Code
- `Ctrl + `` - Toggle terminal
- `Ctrl + P` - Quick file open
- `Ctrl + Shift + F` - Search in files
- `Ctrl + /` - Toggle comment

### Browser DevTools
- `F12` - Open DevTools
- `Ctrl + Shift + C` - Inspect element
- `Ctrl + Shift + J` - Console

## Development Tips

1. **Auto-save:** Enable in VS Code for instant updates
2. **Multiple Terminals:** Use VS Code's split terminal
3. **Browser DevTools:** Keep console open for errors
4. **MongoDB Compass:** Visual database management
5. **Postman/Thunder Client:** API testing

## Production Deployment Checklist

- [ ] Change JWT_SECRET to secure random string
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV to 'production'
- [ ] Build frontend: `npm run build`
- [ ] Configure CORS for production domain
- [ ] Set up environment variables on hosting
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

---

**Keep this guide handy for quick reference!**
