const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

console.log('Connecting to database...');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected! Fetching users...\n');
        const users = await User.find({}).select('+password');
        
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log('--- ALL REGISTERED USERS ---');
            users.forEach((u, i) => {
                console.log(`   Username: ${u.username}`);
                console.log(`   Email:    ${u.email}`);
                if (u.password) {
                    console.log(`   Password: ${u.password.substring(0, 15)}... (Hashed)`);
                } else {
                    console.log(`   Password: [No Password Set]`);
                }
                console.log('---------------------------');
            });
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });
