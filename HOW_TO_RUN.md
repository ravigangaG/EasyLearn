# 🚀 How to Run the Peer-to-Peer Learning Platform

## 📋 Quick Start (If Everything is Already Set Up)

If you've already installed dependencies and MongoDB is running:

### **Option 1: Using Two Terminals**

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

### **Option 2: Using PowerShell Script**
```powershell
.\setup.ps1
```

Then manually start both servers as shown in Option 1.

---

## 🔧 Complete Setup (First Time or Fresh Start)

### **Prerequisites**

1. **Node.js** (v14 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **MongoDB** (Local or Atlas)
   - Check: `mongod --version`
   - Download: https://www.mongodb.com/try/download/community

3. **npm** (comes with Node.js)
   - Check: `npm --version`

---

## 📦 Step-by-Step Installation

### **Step 1: Navigate to Project**
```bash
cd c:\Users\Aditya\OneDrive\Desktop\mernstack
```

### **Step 2: Install Backend Dependencies**
```bash
cd backend
npm install
```

**Expected output:**
```
added 150 packages in 30s
```

### **Step 3: Install Frontend Dependencies**
```bash
cd ..\frontend
npm install
```

**Expected output:**
```
added 1500 packages in 60s
```

### **Step 4: Check Environment Files**

**Backend `.env` file should exist at:**
`backend\.env`

**Should contain:**
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

**Frontend `.env` file should exist at:**
`frontend\.env`

**Should contain:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🗄️ Step 5: Start MongoDB

### **Windows:**

**Method 1: As a Service (Recommended)**
```bash
# MongoDB should start automatically if installed as a service
# Check if it's running:
mongosh
```

**Method 2: Manual Start**
```bash
mongod
```

**Verify MongoDB is Running:**
```bash
mongosh
# You should see: "Connected to MongoDB"
# Type: exit
```

---

## 🎯 Step 6: Seed the Database (Optional but Recommended)

Add sample data to see the platform in action:

```bash
cd backend
node seed.js
```

**Expected output:**
```
MongoDB Connected...
Clearing existing data...
✓ Existing data cleared

Creating users...
✓ Created 3 users

Creating resources...
✓ Created 8 resources

Creating questions...
✓ Created 7 questions

Creating discussions...
✓ Created 6 discussions

✅ Database seeded successfully!
```

---

## 🚀 Step 7: Start the Application

### **Terminal 1 - Start Backend**

```bash
cd backend
npm run dev
```

**Expected output:**
```
[nodemon] starting `node server.js`
Server running in development mode on port 5000
MongoDB Connected: localhost
```

**✅ Backend is running on:** http://localhost:5000

---

### **Terminal 2 - Start Frontend**

**Open a NEW terminal window:**

```bash
cd frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled with warnings
```

**✅ Frontend is running on:** http://localhost:3000

**Your browser should automatically open to:** http://localhost:3000

---

## 🌐 Access the Application

### **Main Pages:**
- **Home:** http://localhost:3000/
- **Resources:** http://localhost:3000/resources
- **Questions:** http://localhost:3000/questions
- **Discussions:** http://localhost:3000/discussions
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Profile:** http://localhost:3000/profile

### **Backend API:**
- **API Root:** http://localhost:5000/
- **Health Check:** http://localhost:5000/api/health

---

## 🔐 Test Login Credentials

If you ran the seed script, you can login with:

**User 1:**
- Email: `john@example.com`
- Password: `password123`

**User 2:**
- Email: `jane@example.com`
- Password: `password123`

**User 3:**
- Email: `mike@example.com`
- Password: `password123`

---

## 🛑 How to Stop the Application

### **Stop Backend:**
In the backend terminal, press: `Ctrl + C`

### **Stop Frontend:**
In the frontend terminal, press: `Ctrl + C`

### **Stop MongoDB:**
If you started it manually:
```bash
# In MongoDB terminal, press: Ctrl + C
```

---

## 🔄 Restart the Application

Just repeat Step 7:

1. Start MongoDB (if not running as service)
2. Start Backend: `cd backend && npm run dev`
3. Start Frontend: `cd frontend && npm start`

---

## 📁 Project Structure

```
mernstack/
├── backend/                 # Backend (Node.js/Express)
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, upload, error handling
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── uploads/            # Uploaded files
│   ├── utils/              # Helper functions
│   ├── .env                # Environment variables
│   ├── seed.js             # Database seed script
│   ├── server.js           # Entry point
│   └── package.json        # Dependencies
│
├── frontend/               # Frontend (React)
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # State management
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   ├── App.jsx        # Main component
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
│
├── README.md              # Project overview
├── SETUP.md               # Detailed setup guide
├── QUICK_REFERENCE.md     # Command reference
└── DATA_ADDED.md          # Seed data info
```

---

## 🐛 Troubleshooting

### **Problem: "Cannot find module"**
**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### **Problem: "MongoDB connection error"**
**Solution:**
1. Check if MongoDB is running:
   ```bash
   mongosh
   ```
2. If not running, start it:
   ```bash
   mongod
   ```
3. Check connection string in `backend\.env`

### **Problem: "Port 5000 already in use"**
**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Problem: "Port 3000 already in use"**
**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Problem: Frontend shows "Network Error"**
**Solution:**
1. Check if backend is running on port 5000
2. Check `frontend\.env` has correct API URL
3. Check CORS settings in `backend\server.js`

### **Problem: "No data showing on pages"**
**Solution:**
1. Run the seed script:
   ```bash
   cd backend
   node seed.js
   ```
2. Refresh the browser

### **Problem: ESLint warnings**
**Solution:**
These are just warnings, not errors. The app still works fine.
You can ignore them or fix them later.

---

## 📝 Available Scripts

### **Backend Scripts:**
```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start normally
node seed.js     # Seed database with sample data
```

### **Frontend Scripts:**
```bash
npm start        # Start development server
npm run build    # Create production build
npm test         # Run tests
```

---

## ✅ Verification Checklist

After starting the application, verify:

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Frontend terminal shows "Compiled successfully"
- [ ] Browser opens to http://localhost:3000
- [ ] Home page loads correctly
- [ ] Resources page shows data (if seeded)
- [ ] Questions page shows data (if seeded)
- [ ] Discussions page shows data (if seeded)
- [ ] Can register a new account
- [ ] Can login with test credentials
- [ ] Profile page works after login

---

## 🎯 Quick Commands Summary

### **First Time Setup:**
```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ..\frontend
npm install

# 3. Seed database (optional)
cd ..\backend
node seed.js
```

### **Every Time You Run:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### **Stop Everything:**
```
Ctrl + C in both terminals
```

---

## 🌟 Pro Tips

1. **Keep both terminals open** while developing
2. **Backend auto-restarts** when you change code (nodemon)
3. **Frontend hot-reloads** when you change code
4. **Check browser console** for any errors
5. **Check terminal logs** for backend errors
6. **Use MongoDB Compass** to view database visually

---

## 📚 Additional Resources

- **Full Setup Guide:** `SETUP.md`
- **Quick Reference:** `QUICK_REFERENCE.md`
- **API Documentation:** `POSTMAN_GUIDE.md`
- **Seed Data Info:** `DATA_ADDED.md`
- **Features List:** `FEATURES.md`

---

## 🎉 You're Ready!

Your Peer-to-Peer Learning Platform is now running!

**Access it at:** http://localhost:3000

**Enjoy your fully functional MERN stack application!** 🚀
