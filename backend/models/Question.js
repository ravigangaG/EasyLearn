const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Answer content is required'],
        maxlength: [5000, 'Answer cannot exceed 5000 characters']
    },
    answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        voteType: {
            type: String,
            enum: ['upvote', 'downvote']
        }
    }],
    isAccepted: {
        type: Boolean,
        default: false
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a question title'],
        trim: true,
        maxlength: [300, 'Title cannot exceed 300 characters']
    },
    content: {
        type: String,
        required: [true, 'Please provide question details'],
        maxlength: [5000, 'Content cannot exceed 5000 characters']
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
    askedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: [answerSchema],
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        voteType: {
            type: String,
            enum: ['upvote', 'downvote']
        }
    }],
    hasAcceptedAnswer: {
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

module.exports = mongoose.model('Question', questionSchema);
