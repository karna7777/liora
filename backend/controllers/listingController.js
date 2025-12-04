import Listing from '../models/Listing.js';
import cloudinary from '../utils/upload.js';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Get Mapbox token from environment
const mapboxToken = process.env.MAPBOX_TOKEN;

// Variable to hold the geocoding client
let geocodingClient = null;

// Check if we have a valid Mapbox token
const isValidMapboxToken =
  mapboxToken &&
  mapboxToken.startsWith('pk.') &&
  mapboxToken !== 'pk.placeholder' &&
  mapboxToken.trim().length > 10;

// Setup geocoding client if we have a valid token
if (isValidMapboxToken) {
  geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
  console.log('Mapbox geocoding enabled');
} else {
  console.log('Mapbox geocoding disabled - no valid token provided');
}

// Helper function to normalize image paths
const normalizeImagePath = (filePath) => {
  // Return null if no file path
  if (!filePath) return null;
  
  // Return URL if it's already a full URL
  if (filePath.startsWith('http')) {
    return filePath;
  }

  // Normalize file path
  const normalized = filePath.replace(process.cwd(), '').replace(/\\/g, '/');
  
  // Return path if it's already in uploads folder
  if (normalized.startsWith('/uploads')) {
    return normalized;
  }
  
  // Extract uploads path if it's embedded
  if (normalized.includes('/uploads/')) {
    const index = normalized.indexOf('/uploads/');
    return normalized.substring(index);
  }
  
  // Default to uploads folder with filename
  return `/uploads/${path.basename(filePath)}`;
};

// Create a new listing
const createListing = async (req, res) => {
  try {
    // Get listing data from request
    const {
      title,
      description,
      location,
      price,
      type,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
    } = req.body;

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files
        .map((file) => normalizeImagePath(file.path || file.filename))
        .filter(Boolean); // Remove any null values
    }

    // Variable to hold coordinates
    let coordinates = null;

    // Try to get coordinates from Mapbox if available
    if (geocodingClient) {
      try {
        const geoResponse = await geocodingClient
          .forwardGeocode({
            query: location,
            limit: 1,
          })
          .send();

        // If we got results, extract coordinates
        if (geoResponse.body.features.length > 0) {
          const [lng, lat] = geoResponse.body.features[0].center;
          coordinates = { lat, lng };
        }
      } catch (geoError) {
        // Log error but continue without coordinates
        console.error('Geocoding failed:', geoError.message);
      }
    }

    // Fallback: use manual coordinates if provided
    if (
      !coordinates &&
      req.body.latitude &&
      req.body.longitude &&
      !isNaN(Number(req.body.latitude)) &&
      !isNaN(Number(req.body.longitude))
    ) {
      coordinates = {
        lat: Number(req.body.latitude),
        lng: Number(req.body.longitude),
      };
    }

    // Process amenities string into array
    let amenitiesArray = [];
    if (amenities) {
      amenitiesArray = amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean); // Remove empty items
    }

    // Create listing in database
    const listing = await Listing.create({
      host: req.user._id,
      title,
      description,
      location,
      price,
      images,
      type,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities: amenitiesArray,
      coordinates,
    });

    // Send success response
    res.status(201).json(listing);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Get listings with filtering
const getListings = async (req, res) => {
  try {
    // Get filter parameters from query
    const {
      location,
      minPrice,
      maxPrice,
      type,
      bedrooms,
      bathrooms,
      maxGuests,
    } = req.query;

    // Build query object
    let query = {};

    // Add location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Add price filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Add type filter
    if (type) {
      query.type = type;
    }

    // Add bedroom filter
    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Add bathroom filter
    if (bathrooms) {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Add guest filter
    if (maxGuests) {
      query.maxGuests = { $gte: Number(maxGuests) };
    }

    // Pagination setup
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get listings from database
    const listings = await Listing.find(query)
      .populate('host', 'name avatar') // Add host details
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Newest first

    // Get total count for pagination
    const total = await Listing.countDocuments(query);

    // Send response with pagination info
    res.json({
      listings,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Get a single listing by ID
const getListingById = async (req, res) => {
  try {
    // Find listing by ID and populate host details
    const listing = await Listing.findById(req.params.id).populate(
      'host',
      'name avatar'
    );

    // Send listing or 404 error
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Get listings for current host
const getHostListings = async (req, res) => {
  try {
    // Find listings for current host
    const listings = await Listing.find({ host: req.user._id })
      .populate('host', 'name avatar') // Add host details
      .sort({ createdAt: -1 }); // Newest first

    // Send listings data
    res.json(listings);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Update a listing
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the owner of the listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this listing' });
    }

    // Get listing data from request
    const {
      title,
      description,
      location,
      price,
      type,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
    } = req.body;

    // Process uploaded images if new ones are provided
    let images = listing.images; // Keep existing images by default
    if (req.files && req.files.length > 0) {
      images = req.files
        .map((file) => normalizeImagePath(file.path || file.filename))
        .filter(Boolean); // Remove any null values
    }

    // Variable to hold coordinates
    let coordinates = listing.coordinates; // Keep existing coordinates by default

    // Try to get coordinates from Mapbox if location changed
    if (geocodingClient && location && location !== listing.location) {
      try {
        const geoResponse = await geocodingClient
          .forwardGeocode({
            query: location,
            limit: 1,
          })
          .send();

        // If we got results, extract coordinates
        if (geoResponse.body.features.length > 0) {
          const [lng, lat] = geoResponse.body.features[0].center;
          coordinates = { lat, lng };
        }
      } catch (geoError) {
        // Log error but continue without coordinates
        console.error('Geocoding failed:', geoError.message);
      }
    }

    // Fallback: use manual coordinates if provided
    if (
      req.body.latitude &&
      req.body.longitude &&
      !isNaN(Number(req.body.latitude)) &&
      !isNaN(Number(req.body.longitude))
    ) {
      coordinates = {
        lat: Number(req.body.latitude),
        lng: Number(req.body.longitude),
      };
    }

    // Process amenities string into array
    let amenitiesArray = listing.amenities; // Keep existing amenities by default
    if (amenities) {
      amenitiesArray = amenities
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean); // Remove empty items
    }

    // Update listing in database
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        location,
        price,
        images,
        type,
        bedrooms,
        bathrooms,
        maxGuests,
        amenities: amenitiesArray,
        coordinates,
      },
      { new: true, runValidators: true }
    );

    // Send success response
    res.json(updatedListing);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Delete a listing
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the owner of the listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this listing' });
    }

    // Delete listing from database
    await Listing.findByIdAndDelete(req.params.id);

    // Send success response
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Export functions for use in routes
export { createListing, getListings, getListingById, getHostListings, updateListing, deleteListing };