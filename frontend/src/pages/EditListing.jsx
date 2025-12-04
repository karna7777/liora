import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateListing, getListingById } from '../redux/slices/listingSlice';
import { useNavigate, useParams } from 'react-router-dom';

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

const EditListing = () => {
    const { id } = useParams();
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
    const [existingImages, setExistingImages] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { listing, loading, error } = useSelector((state) => state.listings);

    // Load listing data when component mounts
    useEffect(() => {
        dispatch(getListingById(id));
    }, [dispatch, id]);

    // Populate form when listing data is loaded
    useEffect(() => {
        if (listing && listing._id === id) {
            setFormData({
                title: listing.title || '',
                description: listing.description || '',
                location: listing.location || '',
                price: listing.price || '',
                type: listing.type || 'apartment',
                bedrooms: listing.bedrooms || '',
                bathrooms: listing.bathrooms || '',
                maxGuests: listing.maxGuests || '',
                amenities: listing.amenities ? listing.amenities.join(', ') : '',
            });
            setExistingImages(listing.images || []);
        }
    }, [listing, id]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFileChange = (e) => {
        setImages(e.target.files);
    };

    const removeExistingImage = (index) => {
        const newImages = [...existingImages];
        newImages.splice(index, 1);
        setExistingImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        // Append form fields
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        
        // Append existing images that weren't removed
        existingImages.forEach((img, index) => {
            data.append(`existingImage_${index}`, img);
        });
        data.append('existingImagesCount', existingImages.length);
        
        // Append new images
        for (const file of images) {
            data.append('images', file);
        }

        try {
            const result = await dispatch(updateListing({ id, listingData: data }));
            if (!result.error) {
                navigate(`/listings/${id}`);
            }
        } catch (err) {
            console.error('Error updating listing:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Listing</h1>
                <p className="text-gray-600">Update your property details</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                        <label className="block mb-2 text-gray-700 font-semibold">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={onChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-gray-700 font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        rows="5"
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Price per Night ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={onChange}
                            min="1"
                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-700 font-semibold">Property Type</label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

                <div className="mb-6">
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

                {/* Existing Images */}
                {existingImages.length > 0 && (
                    <div className="mb-6">
                        <label className="block mb-2 text-gray-700 font-semibold">Existing Images</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {existingImages.map((img, index) => (
                                <div key={index} className="relative">
                                    <img 
                                        src={getImageUrl(img)} 
                                        alt={`Property ${index + 1}`} 
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Images Upload */}
                <div className="mb-6">
                    <label className="block mb-2 text-gray-700 font-semibold">Add New Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onFileChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">Upload up to 5 images</p>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Listing'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/listings/${id}`)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditListing;