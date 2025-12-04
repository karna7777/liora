import User from '../models/User.js';

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
    try {
        const { listingId } = req.body;
        const user = await User.findById(req.user._id);

        if (user.wishlist.includes(listingId)) {
            user.wishlist = user.wishlist.filter((id) => id.toString() !== listingId);
        } else {
            user.wishlist.push(listingId);
        }

        await user.save();

        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update provided fields
        const { name, email, avatar } = req.body;
        
        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;

        const updatedUser = await user.save();

        // Return updated user data (without password)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            wishlist: updatedUser.wishlist,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { toggleWishlist, getWishlist, updateUserProfile, getUserProfile };