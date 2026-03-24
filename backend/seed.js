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

// Sample data
const seedData = async () => {
    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany();
        await Resource.deleteMany();
        await Question.deleteMany();
        await Discussion.deleteMany();
        console.log('✓ Existing data cleared');

        // Create users
        console.log('\nCreating users...');
        const users = await User.create([
            {
                username: 'john_doe',
                email: 'john@example.com',
                password: await bcrypt.hash('password123', 10),
                profile: {
                    bio: 'Full-stack developer passionate about teaching and learning',
                    interests: ['JavaScript', 'React', 'Node.js'],
                    expertise: ['Web Development', 'Programming'],
                    institution: 'Tech University',
                    yearOfStudy: 'Graduate'
                },
                reputation: 150
            },
            {
                username: 'jane_smith',
                email: 'jane@example.com',
                password: await bcrypt.hash('password123', 10),
                profile: {
                    bio: 'Data science enthusiast and Python lover',
                    interests: ['Python', 'Machine Learning', 'Data Analysis'],
                    expertise: ['Data Science', 'Statistics'],
                    institution: 'Data Institute',
                    yearOfStudy: '3rd Year'
                },
                reputation: 200
            },
            {
                username: 'mike_wilson',
                email: 'mike@example.com',
                password: await bcrypt.hash('password123', 10),
                profile: {
                    bio: 'Mathematics student helping others understand complex concepts',
                    interests: ['Mathematics', 'Physics', 'Calculus'],
                    expertise: ['Mathematics', 'Problem Solving'],
                    institution: 'Science College',
                    yearOfStudy: '2nd Year'
                },
                reputation: 180
            }
        ]);
        console.log(`✓ Created ${users.length} users`);

        // Create resources
        console.log('\nCreating resources...');
        const resources = await Resource.create([
            {
                title: 'Complete JavaScript Tutorial for Beginners',
                description: 'Learn JavaScript from scratch with this comprehensive guide covering variables, functions, objects, arrays, and more. Perfect for absolute beginners!',
                category: 'Computer Science',
                tags: ['javascript', 'programming', 'web development', 'beginner'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
                difficultyLevel: 'beginner',
                uploadedBy: users[0]._id,
                averageRating: 4.5,
                totalRatings: 12,
                downloads: 45,
                views: 120
            },
            {
                title: 'Python Programming Complete Guide',
                description: 'Master Python programming with examples and exercises. Covers basics to advanced topics including OOP, file handling, and libraries. Perfect for data science and automation.',
                category: 'Computer Science',
                tags: ['python', 'programming', 'data science', 'automation'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
                difficultyLevel: 'intermediate',
                uploadedBy: users[1]._id,
                averageRating: 4.8,
                totalRatings: 20,
                downloads: 78,
                views: 200
            },
            {
                title: 'Calculus Made Easy - Complete Course',
                description: 'Understanding calculus concepts with real-world examples and practice problems. Covers limits, derivatives, integrals, and applications.',
                category: 'Mathematics',
                tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
                difficultyLevel: 'intermediate',
                uploadedBy: users[2]._id,
                averageRating: 4.6,
                totalRatings: 15,
                downloads: 56,
                views: 150
            },
            {
                title: 'Data Structures and Algorithms Masterclass',
                description: 'Learn essential data structures including arrays, linked lists, trees, graphs, and hash tables. Includes implementation examples in multiple languages and complexity analysis.',
                category: 'Computer Science',
                tags: ['algorithms', 'data structures', 'coding', 'interview prep'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=8hly31xKli0',
                difficultyLevel: 'advanced',
                uploadedBy: users[0]._id,
                averageRating: 4.9,
                totalRatings: 25,
                downloads: 92,
                views: 280
            },
            {
                title: 'Introduction to Quantum Physics',
                description: 'Explore the fascinating world of quantum mechanics with clear explanations and examples. Covers wave-particle duality, uncertainty principle, and quantum states.',
                category: 'Physics',
                tags: ['physics', 'quantum mechanics', 'science', 'advanced'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=J3xLuZNKhlY',
                difficultyLevel: 'advanced',
                uploadedBy: users[2]._id,
                averageRating: 4.7,
                totalRatings: 18,
                downloads: 64,
                views: 175
            },
            {
                title: 'React.js Complete Tutorial',
                description: 'Build modern web applications with React. Learn components, hooks, state management, routing, and best practices for building scalable apps.',
                category: 'Computer Science',
                tags: ['react', 'javascript', 'web development', 'frontend'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
                difficultyLevel: 'intermediate',
                uploadedBy: users[0]._id,
                averageRating: 4.8,
                totalRatings: 22,
                downloads: 85,
                views: 230
            },
            {
                title: 'Linear Algebra Fundamentals',
                description: 'Master vectors, matrices, eigenvalues, and linear transformations. Essential for machine learning, computer graphics, and engineering.',
                category: 'Mathematics',
                tags: ['linear algebra', 'mathematics', 'matrices', 'vectors'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
                difficultyLevel: 'intermediate',
                uploadedBy: users[2]._id,
                averageRating: 4.5,
                totalRatings: 14,
                downloads: 48,
                views: 135
            },
            {
                title: 'Machine Learning Basics',
                description: 'Introduction to machine learning concepts, algorithms, and applications. Covers supervised and unsupervised learning with practical examples.',
                category: 'Computer Science',
                tags: ['machine learning', 'AI', 'python', 'data science'],
                resourceType: 'link',
                fileUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
                difficultyLevel: 'advanced',
                uploadedBy: users[1]._id,
                averageRating: 4.9,
                totalRatings: 30,
                downloads: 110,
                views: 320
            }
        ]);
        console.log(`✓ Created ${resources.length} resources`);

        // Create questions
        console.log('\nCreating questions...');
        const questions = await Question.create([
            {
                title: 'How do I learn JavaScript effectively?',
                content: 'I\'m a beginner trying to learn JavaScript. What\'s the best approach? Should I start with vanilla JS or jump into a framework like React? Also, what resources do you recommend?',
                category: 'Computer Science',
                tags: ['javascript', 'learning', 'beginner', 'advice'],
                askedBy: users[0]._id,
                votes: 15,
                views: 89,
                answers: []
            },
            {
                title: 'What\'s the difference between var, let, and const in JavaScript?',
                content: 'I\'m confused about when to use var, let, and const in JavaScript. Can someone explain the differences, scope rules, and best practices for each?',
                category: 'Computer Science',
                tags: ['javascript', 'variables', 'syntax', 'es6'],
                askedBy: users[1]._id,
                votes: 23,
                views: 145,
                answers: []
            },
            {
                title: 'How to solve calculus derivatives using chain rule?',
                content: 'I\'m struggling with understanding the chain rule in calculus. Can someone provide a simple explanation with step-by-step examples? Especially for composite functions.',
                category: 'Mathematics',
                tags: ['calculus', 'derivatives', 'mathematics', 'chain rule'],
                askedBy: users[2]._id,
                votes: 18,
                views: 102,
                answers: []
            },
            {
                title: 'Best resources for learning Python for data science?',
                content: 'I want to learn Python specifically for data science and machine learning. What are the best free resources, courses, and learning paths you recommend? Should I learn pandas first?',
                category: 'Computer Science',
                tags: ['python', 'data science', 'resources', 'learning path'],
                askedBy: users[0]._id,
                votes: 31,
                views: 178,
                answers: []
            },
            {
                title: 'How does binary search algorithm work?',
                content: 'I understand the concept of binary search but I\'m having trouble implementing it correctly. Can someone explain the algorithm step by step with pseudocode and common pitfalls to avoid?',
                category: 'Computer Science',
                tags: ['algorithms', 'binary search', 'coding', 'data structures'],
                askedBy: users[1]._id,
                votes: 20,
                views: 125,
                answers: []
            },
            {
                title: 'Understanding React hooks - useState vs useEffect',
                content: 'What\'s the difference between useState and useEffect hooks in React? When should I use each one? I\'m getting confused about their purposes and use cases.',
                category: 'Computer Science',
                tags: ['react', 'hooks', 'javascript', 'frontend'],
                askedBy: users[0]._id,
                votes: 27,
                views: 156,
                answers: []
            },
            {
                title: 'How to prepare for coding interviews?',
                content: 'I have coding interviews coming up. What topics should I focus on? How much time should I spend on data structures vs algorithms? Any tips for whiteboard coding?',
                category: 'Computer Science',
                tags: ['interview', 'coding', 'career', 'preparation'],
                askedBy: users[1]._id,
                votes: 42,
                views: 234,
                answers: []
            }
        ]);
        console.log(`✓ Created ${questions.length} questions`);

        // Create discussions
        console.log('\nCreating discussions...');
        const discussions = await Discussion.create([
            {
                title: 'Best Study Techniques for Exam Preparation',
                content: 'What study techniques do you find most effective when preparing for exams? I\'m looking for tips on time management, note-taking methods, retention strategies, and dealing with exam anxiety. Share your experiences!',
                category: 'Study Tips',
                tags: ['study', 'exams', 'productivity', 'tips'],
                createdBy: users[0]._id,
                views: 156,
                likes: [users[1]._id, users[2]._id],
                replies: []
            },
            {
                title: 'Career Path: Web Development vs Data Science',
                content: 'I\'m trying to decide between pursuing web development or data science as a career. What are the pros and cons of each? What\'s the job market like? Which one has better growth potential? Would love to hear from people in both fields!',
                category: 'Career Advice',
                tags: ['career', 'web development', 'data science', 'advice'],
                createdBy: users[1]._id,
                views: 203,
                likes: [users[0]._id],
                replies: [],
                isPinned: true
            },
            {
                title: 'Share Your Favorite Beginner-Friendly Project Ideas',
                content: 'Let\'s compile a list of beginner-friendly project ideas! I\'m looking for projects that will help build my portfolio and learn new skills. What projects did you build when you were starting out? What did you learn from them?',
                category: 'Project Ideas',
                tags: ['projects', 'beginner', 'portfolio', 'learning'],
                createdBy: users[2]._id,
                views: 189,
                likes: [users[0]._id, users[1]._id],
                replies: []
            },
            {
                title: 'Online Learning Platforms - Your Experiences',
                content: 'What are your experiences with different online learning platforms like Coursera, Udemy, edX, freeCodeCamp, etc.? Which ones do you recommend and why? Are paid courses worth it or are free resources enough?',
                category: 'General',
                tags: ['online learning', 'courses', 'education', 'platforms'],
                createdBy: users[0]._id,
                views: 167,
                likes: [users[2]._id],
                replies: []
            },
            {
                title: 'Tips for Staying Motivated While Learning to Code',
                content: 'How do you stay motivated when learning to code? I often start strong but lose motivation after a few weeks. What strategies work for you? How do you deal with imposter syndrome and feeling overwhelmed?',
                category: 'Study Tips',
                tags: ['motivation', 'coding', 'learning', 'mental health'],
                createdBy: users[1]._id,
                views: 198,
                likes: [users[0]._id, users[2]._id],
                replies: []
            },
            {
                title: 'Remote Learning Success Strategies',
                content: 'Remote learning can be challenging. Share your tips for staying focused, managing time effectively, and creating a productive study environment at home. What tools and techniques help you succeed?',
                category: 'Study Tips',
                tags: ['remote learning', 'productivity', 'focus', 'home study'],
                createdBy: users[2]._id,
                views: 142,
                likes: [users[1]._id],
                replies: []
            }
        ]);
        console.log(`✓ Created ${discussions.length} discussions`);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${users.length}`);
        console.log(`   Resources: ${resources.length}`);
        console.log(`   Questions: ${questions.length}`);
        console.log(`   Discussions: ${discussions.length}`);
        console.log('\n🌐 Visit your website to see the data:');
        console.log('   Resources: http://localhost:3000/resources');
        console.log('   Questions: http://localhost:3000/questions');
        console.log('   Discussions: http://localhost:3000/discussions');
        console.log('\n🔐 Login credentials for testing:');
        console.log('   Email: john@example.com');
        console.log('   Password: password123');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    }
};

// Run the seed
connectDB().then(() => {
    seedData();
});
