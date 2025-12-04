# Liora - Vacation Rental Platform

A full-stack vacation rental platform built with React, Node.js, Express, and MongoDB. Users can browse listings, book properties, manage their trips, and communicate with hosts.

## Features

- 🔐 User Authentication (Register, Login, Logout)
- 🏠 Listings Management (Create, Browse, Search)
- 📅 Booking System with Stripe Payment Integration
- ⭐ Reviews and Ratings
- 💬 Real-time Chat with Socket.io
- ❤️ Wishlist Functionality
- 🗺️ Interactive Maps with Mapbox
- 📱 Responsive Design

## Tech Stack

### Frontend
- React 19
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- Mapbox GL
- Stripe React
- Socket.io Client

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT Authentication
- Socket.io
- Stripe
- Cloudinary (Image Upload)
- Mapbox SDK

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- Mapbox account (for maps and geocoding)
- Stripe account (for payments)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd liora
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/liora
JWT_SECRET=your_jwt_secret_key_here
PORT=8000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAPBOX_TOKEN=your_mapbox_token_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:8000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (Protected)

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing (Protected)
- `GET /api/listings/host/my-listings` - Get host's listings (Protected)

### Bookings
- `POST /api/bookings` - Create booking and payment intent (Protected)
- `GET /api/bookings/my-trips` - Get user's bookings (Protected)
- `GET /api/bookings/host` - Get host's bookings (Protected)

### Reviews
- `POST /api/reviews` - Create review (Protected)
- `GET /api/reviews/:listingId` - Get reviews for a listing

### Users
- `POST /api/users/wishlist` - Toggle wishlist item (Protected)
- `GET /api/users/wishlist` - Get user's wishlist (Protected)

### Chat
- `POST /api/chat` - Send message (Protected)
- `GET /api/chat/conversations` - Get conversations (Protected)
- `GET /api/chat/:userId` - Get messages with user (Protected)

## Project Structure

```
liora/
├── backend/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & error middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utilities (token, upload)
│   └── server.js          # Server entry point
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── redux/         # Redux store & slices
    │   ├── services/      # API services
    │   └── utils/         # Utilities
    └── public/
```

## Key Features Implementation

### Authentication
- JWT tokens stored in HTTP-only cookies
- Protected routes on both frontend and backend
- Automatic user loading on app start

### Image Upload
- Cloudinary integration for image storage
- Multiple image upload support (up to 5 images per listing)
- Automatic image optimization

### Payments
- Stripe Payment Intents for secure payments
- Client-side payment confirmation
- Payment status tracking

### Real-time Chat
- Socket.io for real-time messaging
- Conversation management
- Message history

### Maps
- Mapbox integration for interactive maps
- Geocoding for address to coordinates conversion
- Marker display for listings

## Environment Variables

See `.env.example` files in both `backend` and `frontend` directories for required environment variables.

## Development

- Backend uses `nodemon` for auto-restart
- Frontend uses Vite for fast HMR
- Redux DevTools available for state debugging

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
