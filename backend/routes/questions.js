const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getQuestions)
    .post(protect, createQuestion);

router.route('/:id')
    .get(getQuestion)
    .put(protect, updateQuestion)
    .delete(protect, deleteQuestion);

router.put('/:id/vote', protect, voteQuestion);
router.post('/:id/answers', protect, postAnswer);
router.put('/:questionId/answers/:answerId/vote', protect, voteAnswer);
router.put('/:questionId/answers/:answerId/accept', protect, acceptAnswer);
router.post('/:id/bookmark', protect, bookmarkQuestion);

module.exports = router;
