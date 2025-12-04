import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <div className="bg-rose-600 text-white font-bold text-xl w-8 h-8 rounded-full flex items-center justify-center">
                                L
                            </div>
                            <span className="text-xl md:text-2xl font-semibold text-gray-900 ml-2 group-hover:text-rose-600 transition-colors">Liora</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Airbnb Style */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-4">
                        <Link to="/search" className="text-gray-900 hover:bg-gray-100 transition-colors font-medium px-4 py-2 rounded-full text-sm">
                            Search
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/wishlist" className="text-gray-900 hover:bg-gray-100 transition-colors font-medium px-4 py-2 rounded-full text-sm">
                                    Wishlist
                                </Link>
                                <Link to="/my-trips" className="text-gray-900 hover:bg-gray-100 transition-colors font-medium px-4 py-2 rounded-full text-sm">
                                    Trips
                                </Link>
                                <Link to="/host/dashboard" className="text-gray-900 hover:bg-gray-100 transition-colors font-medium px-4 py-2 rounded-full text-sm">
                                    Host
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-900 hover:bg-gray-100 transition-colors font-medium px-4 py-2 rounded-full text-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-rose-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-rose-700 transition-colors">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* User Menu */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center">
                            <div className="relative group">
                                <button className="flex items-center space-x-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                    <img
                                        src={user?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                                    <Link to="/wishlist" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Wishlist</Link>
                                    <Link to="/my-trips" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Trips</Link>
                                    <Link to="/host/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Host Dashboard</Link>
                                    <hr className="my-2" />
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden pb-4">
                        <Link to="/search" className="block py-2 text-gray-700 hover:text-rose-600">
                            Search
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="block py-2 text-gray-700 hover:text-rose-600">
                                    Profile
                                </Link>
                                <Link to="/wishlist" className="block py-2 text-gray-700 hover:text-rose-600">
                                    Wishlist
                                </Link>
                                <Link to="/my-trips" className="block py-2 text-gray-700 hover:text-rose-600">
                                    Trips
                                </Link>
                                <Link to="/host/dashboard" className="block py-2 text-gray-700 hover:text-rose-600">
                                    Host Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 text-gray-700 hover:text-rose-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-2 text-gray-700 hover:text-rose-600">
                                    Login
                                </Link>
                                <Link to="/register" className="block py-2 text-gray-700 hover:text-rose-600">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;