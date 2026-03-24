const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    profile: {
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        },
        avatar: {
            type: String,
            default: 'default-avatar.png'
        },
        interests: [{
            type: String
        }],
        expertise: [{
            type: String
        }],
        institution: String,
        yearOfStudy: String
    },
    reputation: {
        type: Number,
        default: 0
    },
    bookmarkedResources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    bookmarkedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    role: {
        type: String,
        enum: ['student', 'moderator', 'admin'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
