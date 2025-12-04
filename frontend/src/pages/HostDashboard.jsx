import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHostListings, reset, deleteListing } from '../redux/slices/listingSlice';
import { Link } from 'react-router-dom';

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

const HostDashboard = () => {
    const dispatch = useDispatch();
    const { listings, loading, error } = useSelector((state) => state.listings);

    useEffect(() => {
        dispatch(reset());
        dispatch(getHostListings());
    }, [dispatch]);

    const myListings = Array.isArray(listings) ? listings : [];

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            dispatch(deleteListing(id));
        }
    };

    return (
        <div className="container mx-auto p-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Host Dashboard</h1>
                <Link
                    to="/host/create-listing"
                    className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                >
                    + Add New Listing
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
                </div>
            ) : myListings.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">No listings yet</h3>
                    <p className="text-lg text-gray-600 mb-8">
                        Get started by creating your first property listing
                    </p>
                    <Link 
                        to="/host/create-listing" 
                        className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                    >
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myListings.map((listing) => (
                        <div key={listing._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                            <Link to={`/listings/${listing._id}`}>
                                {listing.images && listing.images[0] ? (
                                    <img
                                        src={getImageUrl(listing.images[0])}
                                        alt={listing.title}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 truncate">{listing.title}</h3>
                                    <p className="text-gray-600 font-semibold mb-1">${listing.price} / night</p>
                                    <p className="text-sm text-gray-500">{listing.location}</p>
                                    <div className="mt-2 flex items-center text-sm text-gray-600">
                                        <span>{listing.bedrooms} bed</span>
                                        <span className="mx-2">·</span>
                                        <span>{listing.bathrooms} bath</span>
                                        <span className="mx-2">·</span>
                                        <span>{listing.maxGuests} guests</span>
                                    </div>
                                </div>
                            </Link>
                            <div className="px-4 py-3 bg-gray-50 flex justify-between">
                                <Link 
                                    to={`/host/edit-listing/${listing._id}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(listing._id)}
                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HostDashboard;