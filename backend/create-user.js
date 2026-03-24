const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/peer-learning');
        console.log('MongoDB Connected');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'adityasingh28240@gmail.com' });

        if (existingUser) {
            console.log('\n✅ User already exists!');
            console.log('Email:', existingUser.email);
            console.log('Username:', existingUser.username);
            console.log('\nYou can login with:');
            console.log('Email: adityasingh28240@gmail.com');
            console.log('Password: password123');
        } else {
            // Create new user
            const newUser = await User.create({
                username: 'aditya',
                email: 'adityasingh28240@gmail.com',
                password: 'password123',
                profile: {
                    bio: 'Just a Teaching',
                    interests: ['education', 'technology'],
                    expertise: ['web development'],
                    institution: 'YIT',
                    yearOfStudy: '2'
                }
            });

            console.log('\n✅ User created successfully!');
            console.log('Email:', newUser.email);
            console.log('Username:', newUser.username);
            console.log('\nYou can now login with:');
            console.log('Email: adityasingh28240@gmail.com');
            console.log('Password: password123');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createUser();
