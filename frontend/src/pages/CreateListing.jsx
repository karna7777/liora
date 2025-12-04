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
    const [imageUrls, setImageUrls] = useState(['']);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.listings);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrlField = () => {
        if (imageUrls.length < 5) {
            setImageUrls([...imageUrls, '']);
        }
    };

    const removeImageUrlField = (index) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls.length > 0 ? newUrls : ['']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Filter out empty URLs
        const validUrls = imageUrls.filter(url => url.trim() !== '');
        
        if (validUrls.length === 0) {
            alert('Please add at least one image URL');
            return;
        }

        const data = {
            ...formData,
            images: validUrls
        };

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
                    <label className="block mb-2 text-gray-700 font-semibold">Image URLs</label>
                    {imageUrls.map((url, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                                    required={index === 0}
                                />
                                {imageUrls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageUrlField(index)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            {/* Image Preview */}
                            {url && url.trim() !== '' && (
                                <div className="mt-2">
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                        onLoad={(e) => {
                                            e.target.style.display = 'block';
                                            if (e.target.nextElementSibling) {
                                                e.target.nextElementSibling.style.display = 'none';
                                            }
                                        }}
                                    />
                                    <div 
                                        className="w-full h-48 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-500"
                                        style={{ display: 'none' }}
                                    >
                                        <div className="text-center">
                                            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm">Invalid image URL</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {imageUrls.length < 5 && (
                        <button
                            type="button"
                            onClick={addImageUrlField}
                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            + Add Another Image URL
                        </button>
                    )}
                    <p className="text-sm text-gray-500 mt-2">Add up to 5 image URLs (e.g., from Unsplash, Imgur, etc.)</p>
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
