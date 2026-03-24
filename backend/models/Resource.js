const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Computer Science',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Biology',
            'Engineering',
            'Business',
            'Arts',
            'Languages',
            'Other'
        ]
    },
    tags: [{
        type: String,
        trim: true
    }],
    resourceType: {
        type: String,
        required: true,
        enum: ['pdf', 'document', 'link', 'video', 'other']
    },
    fileUrl: {
        type: String,
        required: [true, 'Please provide a file or link']
    },
    thumbnail: {
        type: String,
        default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    },
    fileName: String,
    fileSize: Number,
    difficultyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate average rating
resourceSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
        this.totalRatings = 0;
    } else {
        const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
        this.averageRating = (sum / this.ratings.length).toFixed(1);
        this.totalRatings = this.ratings.length;
    }
};

module.exports = mongoose.model('Resource', resourceSchema);
