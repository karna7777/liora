import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createListing } from '../redux/slices/listingSlice';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        type: 'apartment',
        bedrooms: '',
        bathrooms: '',
        maxGuests: '',
        amenities: '',
    });
    const [images, setImages] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.listings);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        for (const file of images) {
            data.append('images', file);
        }

        try {
            const result = await dispatch(createListing(data));
            if (!result.error) {
                navigate('/host/dashboard');
            }
        } catch (err) {
            console.error('Error creating listing:', err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Listing</h1>
            {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
                <div>
                    <label className="block mb-2 text-gray-700 font-semibold">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={onChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 text-gray-700 font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        rows="4"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={onChange}
                            min="0"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={onChange}
                            placeholder="City, Country"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={onChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                        >
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="hotel">Hotel</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Max Guests</label>
                        <input
                            type="number"
                            name="maxGuests"
                            value={formData.maxGuests}
                            onChange={onChange}
                            min="1"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Bedrooms</label>
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={onChange}
                            min="0"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Bathrooms</label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={onChange}
                            min="0"
                            step="0.5"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-2 text-gray-700 font-semibold">Amenities (comma-separated)</label>
                    <input
                        type="text"
                        name="amenities"
                        value={formData.amenities}
                        onChange={onChange}
                        placeholder="WiFi, Pool, Parking, etc."
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-gray-700 font-semibold">Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onFileChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">Upload up to 5 images</p>
                </div>
                <button
                    type="submit"
                    className="w-full bg-rose-600 text-white p-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>
            </form>
        </div>
    );
};

export default CreateListing;
