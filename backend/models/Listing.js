import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
    {
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [5000, 'Description cannot be more than 5000 characters'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        images: {
            type: [String],
            required: [true, 'Please add at least one image'],
        },
        amenities: {
            type: [String],
        },
        coordinates: {
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            },
        },
        type: {
            type: String,
            enum: ['apartment', 'house', 'villa', 'hotel'],
            default: 'apartment',
        },
        bedrooms: {
            type: Number,
            required: [true, 'Please add number of bedrooms'],
        },
        bathrooms: {
            type: Number,
            required: [true, 'Please add number of bathrooms'],
        },
        maxGuests: {
            type: Number,
            required: [true, 'Please add max guests'],
        },
    },
    {
        timestamps: true,
    }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
