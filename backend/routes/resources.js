const express = require('express');
const router = express.Router();
const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource,
    rateResource,
    bookmarkResource,
    downloadResource
} = require('../controllers/resourceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(getResources)
    .post(protect, upload.single('file'), createResource);

router.route('/:id')
    .get(getResource)
    .put(protect, updateResource)
    .delete(protect, deleteResource);

router.post('/:id/rate', protect, rateResource);
router.post('/:id/bookmark', protect, bookmarkResource);
router.get('/:id/download', protect, downloadResource);

module.exports = router;
