import Review from '../models/Review.js';
import Listing from '../models/Listing.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { listingId, rating, comment } = req.body;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const review = await Review.create({
            listing: listingId,
            user: req.user._id,
            rating,
            comment,
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a listing
// @route   GET /api/reviews/:listingId
// @access  Public
const getListingReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ listing: req.params.listingId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createReview, getListingReviews };
