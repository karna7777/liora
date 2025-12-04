import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListings } from '../redux/slices/listingSlice';
import ListingCard from '../components/ListingCard';
import MapComponent from '../components/Map';
import { useSearchParams } from 'react-router-dom';

// Search page component
const Search = () => {
    // Hook to work with URL search parameters
    const [searchParams, setSearchParams] = useSearchParams();
    // Redux hook to dispatch actions
    const dispatch = useDispatch();
    // Get listings data from Redux store
    const { listings, loading, error } = useSelector((state) => state.listings);

    // State for search filters
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        type: searchParams.get('type') || '',
        bedrooms: searchParams.get('bedrooms') || '',
        bathrooms: searchParams.get('bathrooms') || '',
        maxGuests: searchParams.get('maxGuests') || '',
    });

    // State for pagination
    const [page, setPage] = useState(1);
    // State to toggle between list and map view
    const [showMap, setShowMap] = useState(false);

    // Load listings when filters or page change
    useEffect(() => {
        // Prepare parameters for API call
        const params = { ...filters, page };
        
        // Remove empty filter parameters
        Object.keys(params).forEach((key) => {
            if (params[key] === '') delete params[key];
        });
        
        // Update URL with current filters
        setSearchParams(params);
        
        // Dispatch action to fetch listings
        dispatch(getListings(params));
    }, [dispatch, filters, page, setSearchParams]);

    // Handle filter input changes
    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    // Reset all filters
    const handleReset = () => {
        setFilters({
            location: '',
            minPrice: '',
            maxPrice: '',
            type: '',
            bedrooms: '',
            bathrooms: '',
            maxGuests: '',
        });
        setPage(1);
    };

    // Get listings data (handle different data structures)
    const listingsData = Array.isArray(listings) ? listings : listings.listings || [];

    return (
        // Main container
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Filters sidebar */}
                <div className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-md h-fit sticky top-24">
                    {/* Filters header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button 
                            onClick={handleReset}
                            className="text-rose-600 hover:text-rose-800 text-sm font-medium"
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Location filter */}
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">Location</label>
                        <input 
                            type="text" 
                            name="location" 
                            value={filters.location} 
                            onChange={handleChange} 
                            placeholder="Where are you going?"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                        />
                    </div>

                    {/* Price range filters */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Min Price</label>
                            <input 
                                type="number" 
                                name="minPrice" 
                                value={filters.minPrice} 
                                onChange={handleChange} 
                                placeholder="$0"
                                min="0"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Max Price</label>
                            <input 
                                type="number" 
                                name="maxPrice" 
                                value={filters.maxPrice} 
                                onChange={handleChange} 
                                placeholder="$500"
                                min="0"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                            />
                        </div>
                    </div>

                    {/* Property type filter */}
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">Property Type</label>
                        <select 
                            name="type" 
                            value={filters.type} 
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                            <option value="">Any Type</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="hotel">Hotel</option>
                        </select>
                    </div>

                    {/* Bedrooms and bathrooms filters */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Bedrooms</label>
                            <input 
                                type="number" 
                                name="bedrooms" 
                                value={filters.bedrooms} 
                                onChange={handleChange} 
                                min="0"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Bathrooms</label>
                            <input 
                                type="number" 
                                name="bathrooms" 
                                value={filters.bathrooms} 
                                onChange={handleChange} 
                                min="0"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                            />
                        </div>
                    </div>

                    {/* Max guests filter */}
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">Max Guests</label>
                        <input 
                            type="number" 
                            name="maxGuests" 
                            value={filters.maxGuests} 
                            onChange={handleChange} 
                            min="1"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" 
                        />
                    </div>
                </div>

                {/* Results section */}
                <div className="w-full md:w-3/4">
                    {/* Header with results count and view toggle */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                                {listingsData.length > 0 ? `${listingsData.length} Properties Found` : 'Search Results'}
                            </h2>
                            {listingsData.length > 0 && (
                                <p className="text-gray-600">Discover your perfect stay</p>
                            )}
                        </div>
                        {/* Toggle between list and map view */}
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                        >
                            {showMap ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    Show List
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Show Map
                                </>
                            )}
                        </button>
                    </div>

                    {/* Loading, error, or empty states */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                            <div className="mt-4">
                                <button 
                                    onClick={handleReset}
                                    className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    ) : listingsData.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your filters or search criteria
                            </p>
                            <button 
                                onClick={handleReset}
                                className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Show map or list view */}
                            {showMap ? (
                                <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
                                    <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900">Properties on Map</h3>
                                        <button 
                                            onClick={() => setShowMap(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="h-[600px]">
                                        <MapComponent listings={listingsData} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Property listings grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {listingsData.map((listing, index) => (
                                            <div key={listing._id} className="card-hover" style={{ animationDelay: `${index * 0.05}s` }}>
                                                <ListingCard listing={listing} />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Pagination controls */}
                                    {listings.pages > 1 && (
                                        <div className="flex justify-center mt-8">
                                            <div className="flex space-x-2">
                                                {[...Array(listings.pages)].map((_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => setPage(i + 1)}
                                                        className={`px-4 py-2 rounded-lg ${
                                                            page === i + 1
                                                                ? 'bg-rose-600 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;