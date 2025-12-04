import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Setup Stripe payment processing
let stripe = null;
const stripeKey = process.env.STRIPE_SECRET_KEY;

// Only initialize Stripe if we have a valid key
if (stripeKey && stripeKey !== 'sk_test_placeholder' && stripeKey.trim() !== '') {
  stripe = new Stripe(stripeKey);
  console.log('Stripe payment processing enabled');
} else {
  console.log('Stripe payment processing disabled - no valid key provided');
}

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Get booking data from request
    const { listingId, checkIn, checkOut, totalPrice } = req.body;
    
    // Verify the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if dates are available (simple overlap check)
    const existingBooking = await Booking.findOne({
      listing: listingId,
      $or: [
        { checkIn: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
      ],
    });

    // If there's a conflict, send error
    if (existingBooking) {
      return res.status(400).json({ message: 'Listing is not available for these dates' });
    }

    // Variables for payment processing
    let paymentIntent = null;
    let paymentIntentId = null;

    // Process payment if Stripe is configured
    if (stripe) {
      try {
        // Create payment intent with Stripe
        paymentIntent = await stripe.paymentIntents.create({
          amount: totalPrice * 100, // Convert to cents
          currency: 'usd',
          metadata: {
            listingId,
            userId: req.user._id.toString(),
          },
        });
        
        // Save payment intent ID
        paymentIntentId = paymentIntent.id;
      } catch (stripeError) {
        // Log error and send response
        console.error('Stripe error:', stripeError.message);
        return res.status(500).json({ message: 'Payment processing failed' });
      }
    }

    // Create the booking in database
    const booking = await Booking.create({
      listing: listingId,
      guest: req.user._id,
      host: listing.host,
      checkIn,
      checkOut,
      totalPrice,
      paymentIntentId,
      // Set status based on whether payment is needed
      status: paymentIntentId ? 'pending' : 'confirmed',
    });

    // Send success response
    res.status(201).json({
      booking,
      clientSecret: paymentIntent ? paymentIntent.client_secret : null,
    });
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for current user
const getUserBookings = async (req, res) => {
  try {
    // Find all bookings for the current user
    const bookings = await Booking.find({ guest: req.user._id })
      .populate('listing') // Add listing details
      .sort({ createdAt: -1 }); // Newest first
    
    // Send bookings data
    res.json(bookings);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for host
const getHostBookings = async (req, res) => {
  try {
    // Find all bookings for the current host
    const bookings = await Booking.find({ host: req.user._id })
      .populate('listing') // Add listing details
      .populate('guest', 'name email') // Add guest details
      .sort({ createdAt: -1 }); // Newest first
    
    // Send bookings data
    res.json(bookings);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Export functions for use in routes
export { createBooking, getUserBookings, getHostBookings };