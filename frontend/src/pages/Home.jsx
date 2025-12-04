import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListings } from '../redux/slices/listingSlice';
import { Link, useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

// Home page component
const Home = () => {
    // Redux hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get listings data from Redux store
    const { listings, loading, error } = useSelector((state) => state.listings);

    // Get listings data (handle different data structures)
    const listingsData = Array.isArray(listings) ? listings : listings.listings || [];

    // Load featured listings when component mounts
    useEffect(() => {
        dispatch(getListings({ limit: 8 }));
    }, [dispatch]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const location = formData.get('location');
        navigate(`/search?location=${encodeURIComponent(location)}`);
    };

    // Property categories for browsing
    const categories = [
        { name: 'Beachfront', icon: '🏖️', type: 'beachfront' },
        { name: 'Cabins', icon: '🏕️', type: 'cabins' },
        { name: 'Tiny homes', icon: '🏠', type: 'tiny-homes' },
        { name: 'Amazing views', icon: '🌄', type: 'amazing-views' },
        { name: 'Design', icon: '🎨', type: 'design' },
        { name: 'Amazing pools', icon: '🏊', type: 'amazing-pools' },
        { name: 'Lakefront', icon: '🌊', type: 'lakefront' },
        { name: 'Trending', icon: '🔥', type: 'trending' },
        { name: 'City', icon: '🏙️', type: 'city' },
        { name: 'Countryside', icon: '🌾', type: 'countryside' },
    ];

    return (
        // Main container
        <div className="min-h-screen">
            {/* Hero section with search */}
            <div className="relative bg-gradient-to-r from-rose-500 to-rose-700 text-white">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Find your perfect place to stay
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-rose-100">
                            Experience the world with unique accommodations
                        </p>
                        
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="bg-white rounded-full shadow-xl p-1 flex max-w-2xl">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Search destinations..."
                                    className="w-full px-6 py-4 text-gray-900 rounded-full focus:outline-none text-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-4 px-8 rounded-full flex items-center transition duration-200"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Categories browsing section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Explore by Category</h2>
                    <p className="text-lg text-gray-600">Find the perfect place for your next trip</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={`/search?type=${category.type}`}
                            className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-rose-300 hover:shadow-lg transition-all duration-300 bg-white"
                        >
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                                {category.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 text-center">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured listings section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Stays</h2>
                        <p className="text-lg text-gray-600">Handpicked properties for unforgettable experiences</p>
                    </div>
                    <Link 
                        to="/search" 
                        className="text-rose-600 hover:text-rose-800 font-semibold flex items-center"
                    >
                        See all
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Loading, error, or empty states */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        Error loading listings: {error}
                    </div>
                ) : listingsData.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">No listings available yet</h3>
                        <p className="text-lg text-gray-600 mb-8">
                            Be the first to list your property and start earning!
                        </p>
                        <Link 
                            to="/host/create-listing" 
                            className="inline-block bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                        >
                            List Your Property
                        </Link>
                    </div>
                ) : (
                    // Show featured listings
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {listingsData.map((listing, index) => (
                            <div 
                                key={listing._id} 
                                className="card-hover"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <ListingCard listing={listing} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;