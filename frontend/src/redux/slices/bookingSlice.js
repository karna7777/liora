import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
    bookings: [],
    currentBooking: null,
    clientSecret: null,
    loading: false,
    error: null,
    success: false,
};

// Create booking intent (get client secret)
export const createBookingIntent = createAsyncThunk(
    'bookings/createIntent',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get user trips
export const getUserBookings = createAsyncThunk(
    'bookings/getUserBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/bookings/my-trips');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        resetBooking: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.currentBooking = null;
            state.clientSecret = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBookingIntent.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBookingIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentBooking = action.payload.booking;
                state.clientSecret = action.payload.clientSecret;
            })
            .addCase(createBookingIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getUserBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(getUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
