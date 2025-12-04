import React from 'react';
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

// Component to display a property listing card
const ListingCard = ({ listing }) => {
    return (
        // Link to the listing details page
        <Link to={`/listings/${listing._id}`} className="block group">
            {/* Card container */}
            <div className="bg-white rounded-lg overflow-hidden transition-all duration-300">
                {/* Image section */}
                <div className="relative overflow-hidden aspect-[4/3] rounded-xl bg-gray-100">
                    {/* Show property image if available */}
                    {listing.images && listing.images[0] ? (
                        <>
                            <img
                                src={getImageUrl(listing.images[0])}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                    ) : (
                        // Show placeholder if no image
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-20 h-20 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <p className="text-xs text-gray-400">No image</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Property details section */}
                <div className="pt-3">
                    {/* Title and rating row */}
                    <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate text-base group-hover:underline">
                                {listing.location || listing.title}
                            </h3>
                        </div>
                        {/* Rating stars */}
                        <div className="flex items-center ml-2 flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-900 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            <span className="text-sm font-medium text-gray-900 ml-1">4.8</span>
                        </div>
                    </div>
                    
                    {/* Show title if different from location */}
                    {listing.title && listing.title !== listing.location && (
                        <p className="text-gray-500 text-sm mb-2 line-clamp-1">
                            {listing.title}
                        </p>
                    )}

                    {/* Property specs (bedrooms, bathrooms) */}
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                        {/* Show bedrooms if available */}
                        {listing.bedrooms && (
                            <span>
                                {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
                            </span>
                        )}
                        {/* Show bathrooms if available */}
                        {listing.bathrooms && (
                            <>
                                {listing.bedrooms && <span> · </span>}
                                <span>
                                    {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Price information */}
                    <div className="flex items-baseline mt-2">
                        <span className="text-base font-semibold text-gray-900">
                            ${listing.price}
                        </span>
                        <span className="text-gray-600 ml-1 text-sm">
                            night
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;