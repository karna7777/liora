import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    reviews: [],
    loading: false,
    error: null,
    success: false,
};

// Create review
export const createReview = createAsyncThunk(
    'reviews/create',
    async (reviewData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get reviews for a listing
export const getListingReviews = createAsyncThunk(
    'reviews/getListingReviews',
    async (listingId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/reviews/${listingId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        resetReview: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.reviews.unshift(action.payload);
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getListingReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(getListingReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(getListingReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;
