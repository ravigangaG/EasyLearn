const Question = require('../models/Question');
const User = require('../models/User');

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
    try {
        const { category, tags, search, sort, status, page = 1, limit = 10 } = req.query;

        // Build query
        let query = {};

        if (category) {
            query.category = category;
        }

        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        if (status === 'answered') {
            query.hasAcceptedAnswer = true;
        } else if (status === 'unanswered') {
            query['answers.0'] = { $exists: false };
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
        } else if (sort === 'votes') {
            sortOption = { votes: -1 };
        } else if (sort === 'views') {
            sortOption = { views: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        // Pagination
        const skip = (page - 1) * limit;

        const questions = await Question.find(query)
            .populate('askedBy', 'username profile.avatar reputation')
            .populate('answers.answeredBy', 'username profile.avatar reputation')
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Question.countDocuments(query);

        res.json({
            success: true,
            count: questions.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: questions
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
const getQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('askedBy', 'username profile.avatar reputation')
            .populate('answers.answeredBy', 'username profile.avatar reputation')
            .populate('answers.comments.user', 'username profile.avatar');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Increment views
        question.views += 1;
        await question.save();

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
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

        const question = await Question.create({
            title,
            content,
            category,
            tags: tagsArray,
            askedBy: req.user._id
        });

        // Update user reputation
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { reputation: 2 }
        });

        const populatedQuestion = await Question.findById(question._id)
            .populate('askedBy', 'username profile.avatar reputation');

        res.status(201).json({
            success: true,
            data: populatedQuestion
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = async (req, res) => {
    try {
        let question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check ownership
        if (question.askedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this question'
            });
        }

        const { title, content, category, tags } = req.body;

        question = await Question.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                category,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : question.tags
            },
            { new: true, runValidators: true }
        ).populate('askedBy', 'username profile.avatar reputation');

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check ownership
        if (question.askedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this question'
            });
        }

        await question.deleteOne();

        res.json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Vote on question
// @route   PUT /api/questions/:id/vote
// @access  Private
const voteQuestion = async (req, res) => {
    try {
        const { voteType } = req.body; // 'upvote' or 'downvote'

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user already voted
        const existingVote = question.votedBy.find(
            v => v.user.toString() === req.user._id.toString()
        );

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // Remove vote
                question.votedBy = question.votedBy.filter(
                    v => v.user.toString() !== req.user._id.toString()
                );
                question.votes += voteType === 'upvote' ? -1 : 1;
            } else {
                // Change vote
                existingVote.voteType = voteType;
                question.votes += voteType === 'upvote' ? 2 : -2;
            }
        } else {
            // Add new vote
            question.votedBy.push({
                user: req.user._id,
                voteType
            });
            question.votes += voteType === 'upvote' ? 1 : -1;
        }

        await question.save();

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Post an answer
// @route   POST /api/questions/:id/answers
// @access  Private
const postAnswer = async (req, res) => {
    try {
        const { content } = req.body;

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        if (question.isClosed) {
            return res.status(400).json({
                success: false,
                message: 'This question is closed for answers'
            });
        }

        question.answers.push({
            content,
            answeredBy: req.user._id
        });

        await question.save();

        // Update user reputation
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { reputation: 3 }
        });

        const updatedQuestion = await Question.findById(req.params.id)
            .populate('askedBy', 'username profile.avatar reputation')
            .populate('answers.answeredBy', 'username profile.avatar reputation');

        res.status(201).json({
            success: true,
            data: updatedQuestion
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Vote on answer
// @route   PUT /api/questions/:questionId/answers/:answerId/vote
// @access  Private
const voteAnswer = async (req, res) => {
    try {
        const { voteType } = req.body;
        const { questionId, answerId } = req.params;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        const answer = question.answers.id(answerId);

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // Check if user already voted
        const existingVote = answer.votedBy.find(
            v => v.user.toString() === req.user._id.toString()
        );

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // Remove vote
                answer.votedBy = answer.votedBy.filter(
                    v => v.user.toString() !== req.user._id.toString()
                );
                answer.votes += voteType === 'upvote' ? -1 : 1;
            } else {
                // Change vote
                existingVote.voteType = voteType;
                answer.votes += voteType === 'upvote' ? 2 : -2;
            }
        } else {
            // Add new vote
            answer.votedBy.push({
                user: req.user._id,
                voteType
            });
            answer.votes += voteType === 'upvote' ? 1 : -1;
        }

        await question.save();

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Accept an answer
// @route   PUT /api/questions/:questionId/answers/:answerId/accept
// @access  Private
const acceptAnswer = async (req, res) => {
    try {
        const { questionId, answerId } = req.params;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user is the question owner
        if (question.askedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the question owner can accept answers'
            });
        }

        const answer = question.answers.id(answerId);

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        // Unaccept all other answers
        question.answers.forEach(ans => {
            ans.isAccepted = false;
        });

        // Accept this answer
        answer.isAccepted = true;
        question.hasAcceptedAnswer = true;

        await question.save();

        // Update answerer reputation
        await User.findByIdAndUpdate(answer.answeredBy, {
            $inc: { reputation: 10 }
        });

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Bookmark a question
// @route   POST /api/questions/:id/bookmark
// @access  Private
const bookmarkQuestion = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const questionId = req.params.id;

        const isBookmarked = user.bookmarkedQuestions.includes(questionId);

        if (isBookmarked) {
            user.bookmarkedQuestions = user.bookmarkedQuestions.filter(
                id => id.toString() !== questionId
            );
        } else {
            user.bookmarkedQuestions.push(questionId);
        }

        await user.save();

        res.json({
            success: true,
            bookmarked: !isBookmarked,
            message: isBookmarked ? 'Bookmark removed' : 'Question bookmarked'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
    postAnswer,
    voteAnswer,
    acceptAnswer,
    bookmarkQuestion
};
