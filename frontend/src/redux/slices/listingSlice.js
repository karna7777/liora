import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    listings: [],
    listing: null,
    loading: false,
    error: null,
    success: false,
};

// Create new listing
export const createListing = createAsyncThunk(
    'listings/create',
    async (listingData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/listings', listingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Update existing listing
export const updateListing = createAsyncThunk(
    'listings/update',
    async ({ id, listingData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/listings/${id}`, listingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Delete listing
export const deleteListing = createAsyncThunk(
    'listings/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/listings/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get all listings
export const getListings = createAsyncThunk(
    'listings/getAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await axios.get('/listings', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get listing by ID
export const getListingById = createAsyncThunk(
    'listings/getById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/listings/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get host's listings
export const getHostListings = createAsyncThunk(
    'listings/getHostListings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/listings/host/my-listings');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const listingSlice = createSlice({
    name: 'listings',
    initialState,
    reducers: {
        reset: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createListing.pending, (state) => {
                state.loading = true;
            })
            .addCase(createListing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.listings.push(action.payload);
            })
            .addCase(createListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateListing.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateListing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Update the listing in the listings array
                const index = state.listings.findIndex(listing => listing._id === action.payload._id);
                if (index !== -1) {
                    state.listings[index] = action.payload;
                }
                // Also update the single listing if it's loaded
                if (state.listing && state.listing._id === action.payload._id) {
                    state.listing = action.payload;
                }
            })
            .addCase(updateListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteListing.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteListing.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                // Remove the listing from the listings array
                state.listings = state.listings.filter(listing => listing._id !== action.meta.arg);
            })
            .addCase(deleteListing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getListings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListings.fulfilled, (state, action) => {
                state.loading = false;
                state.listings = action.payload.listings || action.payload;
                state.pages = action.payload.pages;
                state.page = action.payload.page;
                state.total = action.payload.total;
            })
            .addCase(getListings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getListingById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListingById.fulfilled, (state, action) => {
                state.loading = false;
                state.listing = action.payload;
            })
            .addCase(getListingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getHostListings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getHostListings.fulfilled, (state, action) => {
                state.loading = false;
                state.listings = action.payload;
            })
            .addCase(getHostListings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { reset } = listingSlice.actions;
export default listingSlice.reducer;