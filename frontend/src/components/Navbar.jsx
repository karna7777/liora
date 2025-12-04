import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl sticky top-0 z-50 border-b border-amber-500/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1SPmiPrS6ph6LbHlNnjUvpaF2Mwu00twygw&s" 
                                alt="Liora" 
                                className="h-16 w-auto object-contain hover:scale-110 transition-all duration-300 drop-shadow-2xl"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation - Airbnb Style */}
                    <div className="hidden md:flex items-center gap-2 lg:gap-6">
                        <Link to="/search" className="text-amber-100 hover:text-amber-400 transition-colors font-medium px-5 py-2.5 rounded-full text-sm tracking-wide hover:bg-white/10">
                            Search
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/wishlist" className="text-amber-100 hover:text-amber-400 transition-colors font-medium px-5 py-2.5 rounded-full text-sm tracking-wide hover:bg-white/10">
                                    Wishlist
                                </Link>
                                <Link to="/my-trips" className="text-amber-100 hover:text-amber-400 transition-colors font-medium px-5 py-2.5 rounded-full text-sm tracking-wide hover:bg-white/10">
                                    Trips
                                </Link>
                                <Link to="/host/dashboard" className="text-amber-100 hover:text-amber-400 transition-colors font-medium px-5 py-2.5 rounded-full text-sm tracking-wide hover:bg-white/10">
                                    Host
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-amber-100 hover:text-amber-400 transition-colors font-medium px-5 py-2.5 rounded-full text-sm tracking-wide hover:bg-white/10">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:from-amber-500 hover:to-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/50">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* User Menu */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center">
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center space-x-3 border-2 border-amber-500/30 rounded-full p-2 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 bg-white/5 backdrop-blur-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                    <img
                                        src={user?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400"
                                    />
                                </button>
                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-3 w-56 bg-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl py-3 z-50 border border-amber-500/20">
                                        <Link 
                                            to="/profile" 
                                            className="block px-5 py-3 text-amber-100 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-200"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link 
                                            to="/wishlist" 
                                            className="block px-5 py-3 text-amber-100 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-200"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            Wishlist
                                        </Link>
                                        <Link 
                                            to="/my-trips" 
                                            className="block px-5 py-3 text-amber-100 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-200"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            My Trips
                                        </Link>
                                        <Link 
                                            to="/host/dashboard" 
                                            className="block px-5 py-3 text-amber-100 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-200"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            Host Dashboard
                                        </Link>
                                        <hr className="my-2 border-amber-500/20" />
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowProfileDropdown(false);
                                            }}
                                            className="block w-full text-left px-5 py-3 text-amber-100 hover:bg-amber-500/20 hover:text-amber-300 transition-all duration-200"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="text-amber-100 hover:text-amber-400 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden pb-4 bg-slate-800/95 backdrop-blur-lg">
                        <Link to="/search" className="block py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all">
                            Search
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="block py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all">
                                    Profile
                                </Link>
                                <Link to="/wishlist" className="block py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all">
                                    Wishlist
                                </Link>
                                <Link to="/my-trips" className="block py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all">
                                    Trips
                                </Link>
                                <Link to="/host/dashboard" className="block py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all">
                                    Host Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all">
                                    Login
                                </Link>
                                <Link to="/register" className="block py-3 px-4 text-amber-100 hover:text-amber-400 hover:bg-white/10 transition-all">
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