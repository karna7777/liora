import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ListingCard from '../components/ListingCard';
import axios from '../utils/axios';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await axios.get('/users/wishlist');
                setWishlist(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWishlist();
        }
    }, [user]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
            {loading ? (
                <p>Loading...</p>
            ) : wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
