const Discussion = require('../models/Discussion');
const User = require('../models/User');

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Public
const getDiscussions = async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;

        // Build query
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        let sortOption = {};
        if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        } else if (sort === 'popular') {
            sortOption = { 'likes.length': -1 };
        } else if (sort === 'views') {
            sortOption = { views: -1 };
        } else {
            sortOption = { isPinned: -1, createdAt: -1 };
        }

        // Pagination
        const skip = (page - 1) * limit;

        const discussions = await Discussion.find(query)
            .populate('createdBy', 'username profile.avatar reputation')
            .populate('replies.author', 'username profile.avatar reputation')
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Discussion.countDocuments(query);

        res.json({
            success: true,
            count: discussions.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: discussions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Public
const getDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id)
            .populate('createdBy', 'username profile.avatar reputation')
            .populate('replies.author', 'username profile.avatar reputation')
            .populate('likes', 'username profile.avatar');

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Increment views
        discussion.views += 1;
        await discussion.save();

        res.json({
            success: true,
            data: discussion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new discussion
// @route   POST /api/discussions
// @access  Private
const createDiscussion = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;

        // Handle tags - can be array or string
        let tagsArray = [];
        if (tags) {
            if (Array.isArray(tags)) {
                tagsArray = tags;
            } else if (typeof tags === 'string') {
                tagsArray = tags.split(',').map(tag => tag.trim());
            }
        }

        const discussion = await Discussion.create({
            title,
            content,
            category,
            tags: tagsArray,
            createdBy: req.user._id
        });

        // Update user reputation
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { reputation: 2 }
        });

        const populatedDiscussion = await Discussion.findById(discussion._id)
            .populate('createdBy', 'username profile.avatar reputation');

        res.status(201).json({
            success: true,
            data: populatedDiscussion
        });
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
const updateDiscussion = async (req, res) => {
    try {
        let discussion = await Discussion.findById(req.params.id);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Check ownership
        if (discussion.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this discussion'
            });
        }

        const { title, content, category, tags } = req.body;

        discussion = await Discussion.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                category,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : discussion.tags
            },
            { new: true, runValidators: true }
        ).populate('createdBy', 'username profile.avatar reputation');

        res.json({
            success: true,
            data: discussion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
const deleteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Check ownership
        if (discussion.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this discussion'
            });
        }

        await discussion.deleteOne();

        res.json({
            success: true,
            message: 'Discussion deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Reply to discussion
// @route   POST /api/discussions/:id/replies
// @access  Private
const replyToDiscussion = async (req, res) => {
    try {
        const { content } = req.body;

        const discussion = await Discussion.findById(req.params.id);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        if (discussion.isClosed) {
            return res.status(400).json({
                success: false,
                message: 'This discussion is closed'
            });
        }

        discussion.replies.push({
            content,
            author: req.user._id
        });

        await discussion.save();

        // Update user reputation
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { reputation: 1 }
        });

        const updatedDiscussion = await Discussion.findById(req.params.id)
            .populate('createdBy', 'username profile.avatar reputation')
            .populate('replies.author', 'username profile.avatar reputation');

        res.status(201).json({
            success: true,
            data: updatedDiscussion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Like/Unlike discussion
// @route   PUT /api/discussions/:id/like
// @access  Private
const likeDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        const isLiked = discussion.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike
            discussion.likes = discussion.likes.filter(
                id => id.toString() !== req.user._id.toString()
            );
        } else {
            // Like
            discussion.likes.push(req.user._id);
        }

        await discussion.save();

        res.json({
            success: true,
            liked: !isLiked,
            likesCount: discussion.likes.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Like/Unlike reply
// @route   PUT /api/discussions/:discussionId/replies/:replyId/like
// @access  Private
const likeReply = async (req, res) => {
    try {
        const { discussionId, replyId } = req.params;

        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        const reply = discussion.replies.id(replyId);

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            });
        }

        const isLiked = reply.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike
            reply.likes = reply.likes.filter(
                id => id.toString() !== req.user._id.toString()
            );
        } else {
            // Like
            reply.likes.push(req.user._id);
        }

        await discussion.save();

        res.json({
            success: true,
            liked: !isLiked,
            likesCount: reply.likes.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDiscussions,
    getDiscussion,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    replyToDiscussion,
    likeDiscussion,
    likeReply
};
