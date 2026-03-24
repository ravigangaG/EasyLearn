const express = require('express');
const router = express.Router();
const {
    getDiscussions,
    getDiscussion,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    replyToDiscussion,
    likeDiscussion,
    likeReply
} = require('../controllers/discussionController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getDiscussions)
    .post(protect, createDiscussion);

router.route('/:id')
    .get(getDiscussion)
    .put(protect, updateDiscussion)
    .delete(protect, deleteDiscussion);

router.post('/:id/replies', protect, replyToDiscussion);
router.put('/:id/like', protect, likeDiscussion);
router.put('/:discussionId/replies/:replyId/like', protect, likeReply);

module.exports = router;
