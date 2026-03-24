const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import models
const User = require('./models/User');
const Resource = require('./models/Resource');
const Question = require('./models/Question');
const Discussion = require('./models/Discussion');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Add sample data WITHOUT deleting existing data
const addSampleData = async () => {
    try {
        console.log('\n🔍 Checking existing data...');

        const userCount = await User.countDocuments();
        const resourceCount = await Resource.countDocuments();
        const questionCount = await Question.countDocuments();
        const discussionCount = await Discussion.countDocuments();

        console.log(`Found ${userCount} users, ${resourceCount} resources, ${questionCount} questions, ${discussionCount} discussions`);

        // Only add sample users if there are less than 3 users
        let users = await User.find().limit(3);

        if (users.length < 3) {
            console.log('\n➕ Adding sample users...');
            const newUsers = await User.create([
                {
                    username: 'sample_user1',
                    email: 'sample1@example.com',
                    password: await bcrypt.hash('password123', 10),
                    profile: {
                        bio: 'Sample user for testing',
                        interests: ['Programming', 'Learning'],
                        expertise: ['Web Development'],
                        institution: 'Sample University',
                        yearOfStudy: 'Graduate'
                    },
                    reputation: 50
                },
                {
                    username: 'sample_user2',
                    email: 'sample2@example.com',
                    password: await bcrypt.hash('password123', 10),
                    profile: {
                        bio: 'Another sample user',
                        interests: ['Data Science', 'AI'],
                        expertise: ['Python', 'Machine Learning'],
                        institution: 'Tech Institute',
                        yearOfStudy: '3rd Year'
                    },
                    reputation: 75
                }
            ]);
            users = [...users, ...newUsers];
            console.log(`✓ Added ${newUsers.length} sample users`);
        } else {
            console.log('✓ Sufficient users exist, skipping user creation');
        }

        // Add a few sample resources if there are less than 5
        if (resourceCount < 5) {
            console.log('\n➕ Adding sample resources...');
            const newResources = await Resource.create([
                {
                    title: 'Node.js Complete Guide',
                    description: 'Learn Node.js from basics to advanced concepts. Build REST APIs, work with databases, and deploy applications.',
                    category: 'Computer Science',
                    tags: ['nodejs', 'backend', 'javascript', 'api'],
                    resourceType: 'link',
                    fileUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
                    difficultyLevel: 'intermediate',
                    uploadedBy: users[0]._id,
                    averageRating: 4.7,
                    totalRatings: 18,
                    downloads: 65,
                    views: 180
                },
                {
                    title: 'MongoDB Tutorial',
                    description: 'Master MongoDB database. Learn CRUD operations, aggregation, indexing, and best practices.',
                    category: 'Computer Science',
                    tags: ['mongodb', 'database', 'nosql', 'backend'],
                    resourceType: 'link',
                    fileUrl: 'https://www.youtube.com/watch?v=ExcRbA7fy_A',
                    difficultyLevel: 'beginner',
                    uploadedBy: users[0]._id,
                    averageRating: 4.6,
                    totalRatings: 22,
                    downloads: 72,
                    views: 195
                }
            ]);
            console.log(`✓ Added ${newResources.length} sample resources`);
        } else {
            console.log('✓ Sufficient resources exist, skipping resource creation');
        }

        console.log('\n✅ Sample data added successfully!');
        console.log('\n📊 Current database status:');
        console.log(`   Users: ${await User.countDocuments()}`);
        console.log(`   Resources: ${await Resource.countDocuments()}`);
        console.log(`   Questions: ${await Question.countDocuments()}`);
        console.log(`   Discussions: ${await Discussion.countDocuments()}`);
        console.log('\n💡 Your existing data has been preserved!');
        console.log('   All your accounts, questions, and answers are still there.');

    } catch (error) {
        console.error('Error adding sample data:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    }
};

// Run the script
connectDB().then(() => {
    addSampleData();
});
