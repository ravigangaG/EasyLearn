const User = require('../models/User');
const Resource = require('../models/Resource');
const Question = require('../models/Question');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('bookmarkedResources', 'title category')
            .populate('bookmarkedQuestions', 'title category');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user statistics
        const resourcesCount = await Resource.countDocuments({ uploadedBy: user._id });
        const questionsCount = await Question.countDocuments({ askedBy: user._id });
        const answersCount = await Question.countDocuments({ 'answers.answeredBy': user._id });

        res.json({
            success: true,
            data: {
                user,
                stats: {
                    resources: resourcesCount,
                    questions: questionsCount,
                    answers: answersCount
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's resources
// @route   GET /api/users/:id/resources
// @access  Public
const getUserResources = async (req, res) => {
    try {
        const resources = await Resource.find({ uploadedBy: req.params.id })
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'username profile.avatar');

        res.json({
            success: true,
            count: resources.length,
            data: resources
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's questions
// @route   GET /api/users/:id/questions
// @access  Public
const getUserQuestions = async (req, res) => {
    try {
        const questions = await Question.find({ askedBy: req.params.id })
            .sort({ createdAt: -1 })
            .populate('askedBy', 'username profile.avatar');

        res.json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Bookmark a resource
// @route   POST /api/users/bookmark/resource/:resourceId
// @access  Private
const bookmarkResource = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const resourceId = req.params.resourceId;

        // Check if resource exists
        const resource = await Resource.findById(resourceId);
        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Check if already bookmarked
        if (user.bookmarkedResources.includes(resourceId)) {
            return res.status(400).json({
                success: false,
                message: 'Resource already bookmarked'
            });
        }

        user.bookmarkedResources.push(resourceId);
        await user.save();

        res.json({
            success: true,
            message: 'Resource bookmarked successfully',
            data: user.bookmarkedResources
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Unbookmark a resource
// @route   DELETE /api/users/bookmark/resource/:resourceId
// @access  Private
const unbookmarkResource = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const resourceId = req.params.resourceId;

        // Remove from bookmarks
        user.bookmarkedResources = user.bookmarkedResources.filter(
            id => id.toString() !== resourceId
        );
        await user.save();

        res.json({
            success: true,
            message: 'Resource removed from bookmarks',
            data: user.bookmarkedResources
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's bookmarked resources
// @route   GET /api/users/bookmarks/resources
// @access  Private
const getBookmarkedResources = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'bookmarkedResources',
                populate: {
                    path: 'uploadedBy',
                    select: 'username profile.avatar'
                }
            });

        res.json({
            success: true,
            count: user.bookmarkedResources.length,
            data: user.bookmarkedResources
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUserProfile,
    getUserResources,
    getUserQuestions,
    bookmarkResource,
    unbookmarkResource,
    getBookmarkedResources
};
