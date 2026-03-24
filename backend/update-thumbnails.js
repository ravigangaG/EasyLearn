const mongoose = require('mongoose');
const Resource = require('./models/Resource');
require('dotenv').config();

const updateThumbnails = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/peer-learning');
        console.log('MongoDB Connected');

        // Define category-specific images from Unsplash
        const categoryImages = {
            'Computer Science': [
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', // Code on screen
                'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', // Programming
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', // Developer coding
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', // Computer setup
                'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800', // Code editor
            ],
            'Mathematics': [
                'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800', // Math formulas
                'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', // Blackboard math
                'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800', // Geometry
                'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800', // Math equations
            ],
            'Physics': [
                'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800', // Physics lab
                'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', // Science
                'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800', // Laboratory
            ],
            'Chemistry': [
                'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800', // Chemistry lab
                'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800', // Test tubes
                'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=800', // Lab equipment
            ],
            'Biology': [
                'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800', // Microscope
                'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800', // Biology
                'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800', // DNA
            ],
            'Engineering': [
                'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', // Engineering
                'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800', // Blueprints
                'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', // Tools
            ],
            'Business': [
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', // Business meeting
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800', // Office work
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', // Analytics
            ],
            'Arts': [
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', // Art supplies
                'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', // Painting
                'https://images.unsplash.com/photo-1482245294234-b3f2f8d5f1a4?w=800', // Creative
            ],
            'Languages': [
                'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', // Books
                'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800', // Library
                'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', // Reading
            ],
            'Other': [
                'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', // Books
                'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800', // Study
            ]
        };

        // Get all resources
        const resources = await Resource.find({});
        console.log(`\nFound ${resources.length} resources to update`);

        let updated = 0;
        const categoryCounters = {};

        for (const resource of resources) {
            const category = resource.category;

            // Initialize counter for this category
            if (!categoryCounters[category]) {
                categoryCounters[category] = 0;
            }

            // Get images for this category
            const images = categoryImages[category] || categoryImages['Other'];

            // Get the next image for this category (cycle through available images)
            const imageIndex = categoryCounters[category] % images.length;
            const thumbnailUrl = images[imageIndex];

            // Update resource
            resource.thumbnail = thumbnailUrl;
            await resource.save();

            console.log(`✅ Updated: ${resource.title} → ${category} (Image ${imageIndex + 1})`);

            categoryCounters[category]++;
            updated++;
        }

        console.log(`\n✅ Successfully updated ${updated} resources with unique thumbnails!`);
        console.log('\nImages by category:');
        Object.keys(categoryCounters).forEach(cat => {
            console.log(`  ${cat}: ${categoryCounters[cat]} resources`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Done! Refresh your browser to see the new images.');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

updateThumbnails();
