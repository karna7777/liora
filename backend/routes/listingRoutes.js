import express from 'express';
import {
    createListing,
    getListings,
    getListingById,
    getHostListings,
    updateListing,
    deleteListing,
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router
    .route('/')
    .get(getListings)
    .post(protect, upload.array('images', 5), createListing);

router.get('/host/my-listings', protect, getHostListings);

router
    .route('/:id')
    .get(getListingById)
    .put(protect, upload.array('images', 5), updateListing)
    .delete(protect, deleteListing);

export default router;