import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '../redux/slices/bookingSlice';
import { Link } from 'react-router-dom';

const MyTrips = () => {
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state) => state.bookings);

    useEffect(() => {
        dispatch(getUserBookings());
    }, [dispatch]);

    // Function to get image URL
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Trips</h1>
            {loading ? (
                <p>Loading...</p>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips booked yet</h3>
                    <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
                    <Link 
                        to="/search" 
                        className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                    >
                        Explore Properties
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => {
                        const listing = booking.listing || {};
                        return (
                            <div key={booking._id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {listing.images && listing.images[0] ? (
                                    <img
                                        src={getImageUrl(listing.images[0])}
                                        alt={listing.title || 'Listing'}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg truncate">{listing.location || listing.title || 'Unknown Location'}</h3>
                                    <p className="text-gray-500 text-sm mb-2">
                                        {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''} - {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ''}
                                    </p>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-semibold">
                                            Total: ${booking.totalPrice || 0}
                                        </div>
                                        <div className={`text-sm font-bold px-2 py-1 rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Hosted by {booking.host?.name || 'Unknown Host'}
                                    </div>
                                    {booking.status === 'confirmed' && (
                                        <div className="mt-3 text-sm text-green-600 font-medium">
                                            Booking confirmed!
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyTrips;