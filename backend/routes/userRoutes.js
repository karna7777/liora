import express from 'express';
import { toggleWishlist, getWishlist, updateUserProfile, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/wishlist', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);
router.put('/profile', protect, updateUserProfile);
router.get('/profile', protect, getUserProfile);

export default router;