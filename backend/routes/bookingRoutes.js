import express from 'express';
import {
    createBooking,
    getUserBookings,
    getHostBookings,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-trips', protect, getUserBookings);
router.get('/host', protect, getHostBookings);

export default router;
