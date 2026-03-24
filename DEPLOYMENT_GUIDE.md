# 🚀 DEPLOY EASYLEARN - COMPLETE GUIDE

## 📋 Deployment Overview

Your MERN stack needs 3 separate deployments:

1. **MongoDB** → MongoDB Atlas (Free Cloud Database)
2. **Backend** → Render (Free Node.js Hosting)
3. **Frontend** → Vercel (Free React Hosting)

---

## 🗄️ STEP 1: Deploy Database (MongoDB Atlas)

### **1.1 Create MongoDB Atlas Account:**

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or Email
3. Choose **FREE** tier (M0 Sandbox)

### **1.2 Create Cluster:**

1. Click "Build a Database"
2. Choose **FREE** (M0)
3. Select **AWS** as provider
4. Choose region closest to you
5. Cluster Name: `EasyLearn`
6. Click "Create"

### **1.3 Create Database User:**

1. Security → Database Access
2. Click "Add New Database User"
3. Authentication: Password
4. Username: `easylearn_admin`
5. Password: Generate secure password (SAVE IT!)
6. Database User Privileges: Read and write to any database
7. Click "Add User"

### **1.4 Whitelist IP Address:**

1. Security → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### **1.5 Get Connection String:**

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js
4. Copy connection string:
   ```
   mongodb+srv://easylearn_admin:<password>@easylearn.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. **SAVE THIS STRING!** You'll need it for backend deployment

---

## 🔧 STEP 2: Deploy Backend (Render)

### **2.1 Prepare Backend for Deployment:**

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### **2.2 Update package.json:**

Make sure `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### **2.3 Deploy to Render:**

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **New** → **Web Service**
4. **Connect Repository:** Select `EasyLearn`
5. **Configure:**
   - Name: `easylearn-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

6. **Environment Variables** (Click "Advanced"):
   ```
   MONGO_URI = mongodb+srv://easylearn_admin:YOUR_PASSWORD@easylearn.xxxxx.mongodb.net/peer-learning?retryWrites=true&w=majority
   JWT_SECRET = your_super_secret_jwt_key_here_change_this
   PORT = 5000
   NODE_ENV = production
   ```

7. **Click "Create Web Service"**

8. **Wait for deployment** (5-10 minutes)

9. **Copy your backend URL:**
   ```
   https://easylearn-backend.onrender.com
   ```

### **2.4 Seed Database (One Time):**

After backend deploys:
1. Go to Render Dashboard
2. Click on your service
3. Go to "Shell" tab
4. Run: `node seed.js`
5. This creates sample data

---

## 🎨 STEP 3: Deploy Frontend (Vercel)

### **3.1 Update Frontend Environment:**

Update `frontend/.env`:
```env
REACT_APP_API_URL=https://easylearn-backend.onrender.com
```

### **3.2 Commit Changes:**

```powershell
cd c:\Users\Aditya\OneDrive\Desktop\mernstack

git add .
git commit -m "Updated API URL for production"
git push origin main
```

### **3.3 Deploy to Vercel:**

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub
3. **New Project**
4. **Import** `EasyLearn` repository
5. **Configure:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

6. **Environment Variables:**
   ```
   REACT_APP_API_URL = https://easylearn-backend.onrender.com
   ```

7. **Click "Deploy"**

8. **Wait for deployment** (2-3 minutes)

9. **Your app is live!**
   ```
   https://easy-learn-xxxxx.vercel.app
   ```

---

## ✅ STEP 4: Test Your Deployment

### **4.1 Test Backend:**

Visit: `https://easylearn-backend.onrender.com`

Should see API response

### **4.2 Test Frontend:**

Visit: `https://easy-learn-xxxxx.vercel.app`

### **4.3 Test Full Flow:**

1. Register new account
2. Login
3. Browse resources
4. Ask question
5. Create discussion
6. Upload profile picture
7. Bookmark resources

---

## 🔧 Configuration Files Needed

### **1. Create `backend/vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### **2. Update `backend/server.js` CORS:**

```javascript
const cors = require('cors');

// Update CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://easy-learn-xxxxx.vercel.app', // Your Vercel URL
    ],
    credentials: true
}));
```

### **3. Create `frontend/vercel.json`:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🌐 Alternative: Deploy Backend to Vercel

If you prefer to deploy backend to Vercel too:

### **Backend on Vercel:**

1. Go to Vercel
2. New Project
3. Import EasyLearn
4. Root Directory: `backend`
5. Framework: Other
6. Build Command: (leave empty)
7. Output Directory: (leave empty)
8. Install Command: `npm install`
9. Environment Variables:
   - MONGO_URI
   - JWT_SECRET
   - NODE_ENV=production

---

## 📊 Deployment Checklist

### **Before Deploying:**
- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string saved

### **Backend Deployment:**
- [ ] Render account created
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Database seeded

### **Frontend Deployment:**
- [ ] API URL updated in .env
- [ ] Changes committed to GitHub
- [ ] Vercel account created
- [ ] Repository imported
- [ ] Environment variables set
- [ ] Frontend deployed successfully

### **Testing:**
- [ ] Backend API accessible
- [ ] Frontend loads
- [ ] Can register/login
- [ ] Can view resources
- [ ] Can create questions
- [ ] Can create discussions
- [ ] Profile picture upload works
- [ ] Bookmarks work

---

## 🚨 Common Issues & Solutions

### **Issue 1: CORS Error**

**Solution:** Update backend CORS to include Vercel URL

```javascript
app.use(cors({
    origin: ['https://your-vercel-url.vercel.app'],
    credentials: true
}));
```

### **Issue 2: MongoDB Connection Failed**

**Solution:** 
- Check connection string
- Verify password is correct
- Ensure IP whitelist includes 0.0.0.0/0

### **Issue 3: Backend Cold Start**

**Solution:** 
- Render free tier sleeps after inactivity
- First request takes 30-60 seconds
- Consider upgrading to paid tier

### **Issue 4: Environment Variables Not Working**

**Solution:**
- Redeploy after adding env vars
- Check spelling and format
- No quotes needed in Vercel/Render

---

## 💰 Cost Breakdown

### **Free Tier Limits:**

**MongoDB Atlas (Free):**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Good for learning/portfolio

**Render (Free):**
- ✅ 750 hours/month
- ✅ Sleeps after 15 min inactivity
- ✅ 512 MB RAM

**Vercel (Free):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS

**Total Cost: $0/month** ✅

---

## 🎯 Post-Deployment

### **1. Update README.md:**

Add live links:
```markdown
## 🌐 Live Demo

- **Frontend:** https://easy-learn-xxxxx.vercel.app
- **Backend API:** https://easylearn-backend.onrender.com
```

### **2. Update GitHub Repository:**

```powershell
git add .
git commit -m "Added deployment links"
git push origin main
```

### **3. Share Your Live Project:**

```
🎉 EasyLearn is now live!

Frontend: https://easy-learn-xxxxx.vercel.app
GitHub: https://github.com/adityasingh1409/EasyLearn

Try it out and let me know what you think!
```

---

## 📞 Support

### **If You Need Help:**

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**Vercel Support:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**MongoDB Atlas:**
- Docs: https://docs.atlas.mongodb.com
- Support: https://support.mongodb.com

---

## 🎉 Summary

### **Deployment URLs:**

```
Database: MongoDB Atlas
Backend: https://easylearn-backend.onrender.com
Frontend: https://easy-learn-xxxxx.vercel.app
```

### **Total Time:** ~30-45 minutes
### **Total Cost:** $0 (Free tier)
### **Maintenance:** Minimal

---

**Ready to deploy? Follow the steps above!** 🚀

Start with MongoDB Atlas, then Backend, then Frontend!
