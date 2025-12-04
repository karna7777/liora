import express from 'express';
import { createReview, getListingReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/:listingId', getListingReviews);

export default router;
