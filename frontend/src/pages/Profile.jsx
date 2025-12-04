import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, resetAuthError } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        avatar: '',
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || '',
            });
        }
    }, [user]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(updateProfile(formData));
            if (!result.error) {
                setIsEditing(false);
                // Show success message
            }
        } catch (err) {
            console.error('Profile update error:', err);
        }
    };

    const handleCancel = () => {
        // Reset form to original values
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                avatar: user.avatar || '',
            });
        }
        setIsEditing(false);
        dispatch(resetAuthError());
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your personal information</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <img
                            src={formData.avatar || user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        />
                        <div className="ml-6">
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block mb-2 text-gray-700 font-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={onChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-gray-700 font-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={onChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-gray-700 font-semibold">Profile Picture URL</label>
                                <input
                                    type="text"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={onChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-rose-500"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition duration-200 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block mb-2 text-gray-500 text-sm">Full Name</label>
                                    <p className="text-gray-900 font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block mb-2 text-gray-500 text-sm">Email Address</label>
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-gray-500 text-sm">Profile Picture</label>
                                <p className="text-gray-900 font-medium break-all">{user.avatar || 'No profile picture set'}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-gray-500 text-sm">Account Role</label>
                                <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 text-gray-500 text-sm">Member Since</label>
                                <p className="text-gray-900 font-medium">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition duration-200"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;