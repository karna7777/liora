import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListingById } from '../redux/slices/listingSlice';
import { createBookingIntent, resetBooking } from '../redux/slices/bookingSlice';
import { getListingReviews, createReview, resetReview } from '../redux/slices/reviewSlice';
import { toggleWishlist } from '../redux/slices/authSlice';
import MapComponent from '../components/Map';
import { useParams, useNavigate } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { differenceInCalendarDays, isSameDay, isBefore, addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// Function to get full image URL
const getImageUrl = (imagePath) => {
  // If it's already a full URL, return as is
  if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  if (imagePath && imagePath.startsWith('/uploads/')) {
    // Remove /api from the URL since uploads are served directly from backend root
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${backendUrl}${imagePath}`;
  }
  
  // Return the path as is for other cases
  return imagePath;
};

// Property details page component
const ListingDetails = () => {
    // Get listing ID from URL
    const { id } = useParams();
    // Redux hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get data from Redux store
    const { listing, loading, error } = useSelector((state) => state.listings);
    const { user } = useSelector((state) => state.auth);
    const { success: bookingSuccess, error: bookingError, loading: bookingLoading, currentBooking } = useSelector((state) => state.bookings);
    const { reviews, success: reviewSuccess, loading: reviewLoading } = useSelector((state) => state.reviews);

    // State for date selection
    const [dateRange, setDateRange] = useState([
        {
            startDate: addDays(new Date(), 1),
            endDate: addDays(new Date(), 2),
            key: 'selection',
        },
    ]);

    // State for review form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    // State for reservation errors
    const [reservationError, setReservationError] = useState('');
    // State for booking confirmation
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Load listing and reviews when component mounts
    useEffect(() => {
        dispatch(getListingById(id));
        dispatch(getListingReviews(id));
        dispatch(resetBooking());
        dispatch(resetReview());
    }, [dispatch, id]);

    // Handle successful booking
    useEffect(() => {
        if (bookingSuccess && currentBooking) {
            setShowConfirmation(true);
            // Auto redirect to trips page after 3 seconds
            setTimeout(() => {
                navigate('/my-trips');
            }, 3000);
        }
    }, [bookingSuccess, currentBooking, navigate]);

    // Handle successful review submission
    useEffect(() => {
        if (reviewSuccess) {
            setComment('');
            setRating(5);
            dispatch(resetReview());
            dispatch(getListingReviews(id)); // Refresh reviews
        }
    }, [reviewSuccess, dispatch, id]);

    // Show loading state
    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
        </div>
    );
    
    // Show error state
    if (error) return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md">
                {error}
            </div>
        </div>
    );
    
    // Show not found state
    if (!listing) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-gray-500">Listing not found</div>
        </div>
    );

    // Show booking confirmation
    if (showConfirmation) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-4">
                        Your reservation has been successfully confirmed. You're all set for your trip.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Redirecting to your trips page...
                    </p>
                </div>
            </div>
        );
    }

    // Calculate number of days and total price
    const days = differenceInCalendarDays(dateRange[0].endDate, dateRange[0].startDate);
    const totalPrice = days * listing.price;
    // Check if property is in user's wishlist
    const isWishlisted = user?.wishlist?.some(itemId => itemId.toString() === listing._id.toString()) || false;

    // Handle reservation button click
    const handleReserve = () => {
        setReservationError('');
        
        // Require user to be logged in
        if (!user) {
            navigate('/login');
            return;
        }

        // Validate date selection
        if (days <= 0) {
            setReservationError("Please select a valid date range");
            return;
        }

        // Ensure dates are in the future
        if (isBefore(dateRange[0].startDate, new Date())) {
            setReservationError("Please select dates in the future");
            return;
        }

        // Dispatch booking action
        dispatch(createBookingIntent({
            listingId: listing._id,
            checkIn: dateRange[0].startDate,
            checkOut: dateRange[0].endDate,
            totalPrice,
        }));
    };

    // Handle wishlist button click
    const handleWishlist = () => {
        // Require user to be logged in
        if (!user) {
            navigate('/login');
            return;
        }
        // Dispatch wishlist toggle action
        dispatch(toggleWishlist(listing._id));
    };

    // Handle review form submission
    const submitReview = (e) => {
        e.preventDefault();
        // Require user to be logged in
        if (!user) {
            navigate('/login');
            return;
        }
        // Dispatch review creation action
        dispatch(createReview({ listingId: listing._id, rating, comment }));
    };

    return (
        // Main container
        <div className="max-w-6xl mx-auto p-4">
            {/* Header with title and wishlist button */}
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{listing.title}</h1>
                <button onClick={handleWishlist} className="text-2xl focus:outline-none">
                    {isWishlisted ? '❤️' : '🤍'}
                </button>
            </div>

            {/* Rating and location info */}
            <div className="flex items-center text-sm text-gray-600 mb-6">
                <span className="mr-2">
                    ★ {reviews && reviews.length > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1) : 'New'}
                </span>
                <span className="mr-2">·</span>
                <span className="underline font-semibold">{listing.location}</span>
            </div>

            {/* Property images gallery */}
            {listing.images && listing.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden mb-8 h-[400px]">
                    <div className="h-full">
                        <img src={getImageUrl(listing.images[0])} alt={listing.title} className="w-full h-full object-cover" />
                    </div>
                    {listing.images.length > 1 && (
                        <div className="grid grid-cols-2 gap-2 h-full">
                            {listing.images.slice(1, 5).map((img, index) => (
                                <img key={index} src={getImageUrl(img)} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Main content layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left column - property details and reviews */}
                <div className="md:col-span-2">
                    {/* Host information */}
                    <div className="border-b pb-6 mb-6">
                        <h2 className="text-2xl font-semibold mb-2">Hosted by {listing.host?.name}</h2>
                        <p className="text-gray-600">
                            {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms
                        </p>
                    </div>

                    {/* Property description */}
                    <div className="border-b pb-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                    </div>

                    {/* Amenities section */}
                    {listing.amenities && listing.amenities.length > 0 && (
                        <div className="border-b pb-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {listing.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-rose-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Map section */}
                    {listing.coordinates?.lat && listing.coordinates?.lng && (
                        <div className="py-6">
                            <h3 className="text-xl font-semibold mb-4">Location</h3>
                            <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
                                <MapComponent
                                    listings={[listing]}
                                    center={{ lat: listing.coordinates.lat, lng: listing.coordinates.lng }}
                                    zoom={13}
                                />
                            </div>
                            <p className="mt-2 text-gray-600">{listing.location}</p>
                        </div>
                    )}

                    {/* Reviews section */}
                    <div className="py-6">
                        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                        {/* Review form (only for logged in users) */}
                        {user && (
                            <form onSubmit={submitReview} className="mb-8 border p-4 rounded-lg bg-gray-50">
                                <h4 className="font-semibold mb-2">Leave a Review</h4>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">Rating</label>
                                    <select
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Good</option>
                                        <option value="3">3 - Fair</option>
                                        <option value="2">2 - Poor</option>
                                        <option value="1">1 - Terrible</option>
                                    </select>
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm mb-1">Comment</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full border p-2 rounded"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={reviewLoading}
                                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        )}

                        {/* Display reviews */}
                        <div className="space-y-6">
                            {!reviews || reviews.length === 0 ? (
                                <p>No reviews yet.</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review._id || review.id} className="border-b pb-4">
                                        <div className="flex items-center mb-2">
                                            <div className="font-semibold mr-2">{review.user?.name || 'Anonymous'}</div>
                                            <div className="text-sm text-gray-500">
                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                            </div>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <div className="text-yellow-500">
                                                {'★'.repeat(review.rating || 0)}
                                                {'☆'.repeat(5 - (review.rating || 0))}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column - booking card */}
                <div className="md:col-span-1">
                    <div className="border rounded-xl shadow-xl p-6 sticky top-24">
                        {/* Price information */}
                        <div className="flex justify-between items-baseline mb-4">
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold">${listing.price}</span>
                                <span className="text-gray-600 ml-1">night</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold">
                                    ★ {reviews && reviews.length > 0 ? (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1) : 'New'}
                                </span>
                            </div>
                        </div>

                        {/* Date picker */}
                        <div className="mb-4">
                            <DateRange
                                editableDateInputs={true}
                                onChange={item => setDateRange([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                minDate={addDays(new Date(), 1)}
                                rangeColors={['#e11d48']}
                                showSelectionPreview={true}
                                showMonthAndYearPickers={true}
                            />
                        </div>

                        {/* Error messages */}
                        {reservationError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                {reservationError}
                            </div>
                        )}

                        {bookingError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                {bookingError}
                            </div>
                        )}

                        {/* Reserve button */}
                        <button
                            onClick={handleReserve}
                            disabled={bookingLoading}
                            className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition duration-200 disabled:opacity-50"
                        >
                            {bookingLoading ? 'Processing...' : 'Reserve'}
                        </button>

                        {/* Price breakdown */}
                        {days > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between mb-2">
                                    <span>${listing.price} x {days} nights</span>
                                    <span>${listing.price * days}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Service fee</span>
                                    <span>${Math.round(listing.price * days * 0.1)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                                    <span>Total</span>
                                    <span>${Math.round(listing.price * days * 1.1)}</span>
                                </div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            You won't be charged yet
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;