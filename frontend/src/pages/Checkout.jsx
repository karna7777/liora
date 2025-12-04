import React from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/my-trips`,
            },
        });

        if (result.error) {
            console.log(result.error.message);
        } else {
            // The payment has been processed!
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                disabled={!stripe}
                className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition duration-200 mt-6"
            >
                Pay Now
            </button>
        </form>
    );
};

const Checkout = () => {
    const { clientSecret, currentBooking } = useSelector((state) => state.bookings);

    if (!clientSecret || !currentBooking) {
        return <div>No booking in progress.</div>;
    }

    const options = {
        clientSecret,
    };

    return (
        <div className="max-w-4xl mx-auto p-4 flex gap-8">
            <div className="w-1/2">
                <h1 className="text-2xl font-bold mb-6">Confirm and Pay</h1>
                <div className="border p-4 rounded-lg shadow-sm">
                    <h2 className="font-bold text-lg mb-2">Your Trip</h2>
                    <div className="flex justify-between py-2">
                        <span>Dates</span>
                        <span>
                            {currentBooking.checkIn ? new Date(currentBooking.checkIn).toLocaleDateString() : ''} - {currentBooking.checkOut ? new Date(currentBooking.checkOut).toLocaleDateString() : ''}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t mt-2">
                        <span>Total Price</span>
                        <span>${currentBooking.totalPrice || 0}</span>
                    </div>
                </div>
            </div>
            <div className="w-1/2">
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    );
};

export default Checkout;
