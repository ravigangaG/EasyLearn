const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Reply content is required'],
        maxlength: [2000, 'Reply cannot exceed 2000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a discussion title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide discussion content'],
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'General',
            'Study Tips',
            'Career Advice',
            'Project Ideas',
            'Exam Preparation',
            'Technology',
            'Research',
            'Other'
        ]
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replies: [replySchema],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isClosed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Discussion', discussionSchema);
