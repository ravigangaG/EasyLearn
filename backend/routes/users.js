const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    getUserResources,
    getUserQuestions,
    bookmarkResource,
    unbookmarkResource,
    getBookmarkedResources
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/:id', getUserProfile);
router.get('/:id/resources', getUserResources);
router.get('/:id/questions', getUserQuestions);

// Bookmark routes (protected)
router.post('/bookmark/resource/:resourceId', protect, bookmarkResource);
router.delete('/bookmark/resource/:resourceId', protect, unbookmarkResource);
router.get('/bookmarks/resources', protect, getBookmarkedResources);

module.exports = router;
