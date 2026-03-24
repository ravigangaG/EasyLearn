const Resource = require('../models/Resource');
const User = require('../models/User');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
    try {
        const { category, tags, search, sort, difficulty, page = 1, limit = 10 } = req.query;

        // Build query
        let query = { isApproved: true };

        if (category) {
            query.category = category;
        }

        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        if (difficulty) {
            query.difficultyLevel = difficulty;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Sort options
        let sortOption = {};
        if (sort === 'newest') {
            sortOption = { createdAt: -1 };
        } else if (sort === 'popular') {
            sortOption = { downloads: -1 };
        } else if (sort === 'rating') {
            sortOption = { averageRating: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        // Pagination
        const skip = (page - 1) * limit;

        const resources = await Resource.find(query)
            .populate('uploadedBy', 'username profile.avatar reputation')
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Resource.countDocuments(query);

        res.json({
            success: true,
            count: resources.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: resources
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('uploadedBy', 'username profile.avatar reputation')
            .populate('ratings.user', 'username profile.avatar');

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Increment views
        resource.views += 1;
        await resource.save();

        res.json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
    try {
        const { title, description, category, tags, resourceType, fileUrl, difficultyLevel } = req.body;

        let resourceData = {
            title,
            description,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            resourceType,
            difficultyLevel,
            uploadedBy: req.user._id
        };

        // Handle file upload
        if (req.file) {
            resourceData.fileUrl = `/uploads/${req.file.filename}`;
            resourceData.fileName = req.file.originalname;
            resourceData.fileSize = req.file.size;
        } else if (fileUrl) {
            resourceData.fileUrl = fileUrl;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide a file or URL'
            });
        }

        const resource = await Resource.create(resourceData);

        // Update user reputation
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { reputation: 5 }
        });

        res.status(201).json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
const updateResource = async (req, res) => {
    try {
        let resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Check ownership
        if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this resource'
            });
        }

        const { title, description, category, tags, difficultyLevel } = req.body;

        resource = await Resource.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                category,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : resource.tags,
                difficultyLevel
            },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Check ownership
        if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this resource'
            });
        }

        await resource.deleteOne();

        res.json({
            success: true,
            message: 'Resource deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Rate a resource
// @route   POST /api/resources/:id/rate
// @access  Private
const rateResource = async (req, res) => {
    try {
        const { rating, review } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a rating between 1 and 5'
            });
        }

        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Check if user already rated
        const existingRating = resource.ratings.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.review = review;
        } else {
            // Add new rating
            resource.ratings.push({
                user: req.user._id,
                rating,
                review
            });
        }

        // Recalculate average rating
        resource.calculateAverageRating();
        await resource.save();

        res.json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Bookmark a resource
// @route   POST /api/resources/:id/bookmark
// @access  Private
const bookmarkResource = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const resourceId = req.params.id;

        const isBookmarked = user.bookmarkedResources.includes(resourceId);

        if (isBookmarked) {
            // Remove bookmark
            user.bookmarkedResources = user.bookmarkedResources.filter(
                id => id.toString() !== resourceId
            );
        } else {
            // Add bookmark
            user.bookmarkedResources.push(resourceId);
        }

        await user.save();

        res.json({
            success: true,
            bookmarked: !isBookmarked,
            message: isBookmarked ? 'Bookmark removed' : 'Resource bookmarked'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Download resource
// @route   GET /api/resources/:id/download
// @access  Private
const downloadResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Increment downloads
        resource.downloads += 1;
        await resource.save();

        // Update uploader reputation
        await User.findByIdAndUpdate(resource.uploadedBy, {
            $inc: { reputation: 1 }
        });

        res.json({
            success: true,
            data: {
                fileUrl: resource.fileUrl,
                fileName: resource.fileName
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    rateResource,
    bookmarkResource,
    downloadResource
};
