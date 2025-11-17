Liora – A Luxury Travel and Accommodation Platform
Finding premium accommodations and authentic local experiences often requires navigating multiple platforms, leading to inconsistent quality and limited personalization. Liora aims to solve this by offering a unified, luxury-focused web platform where travelers can easily discover and book high-end stays, and hosts can efficiently manage their exclusive listings — all in one seamless, secure environment.

3. System Architecture
Architecture Flow:
Frontend → Backend (API) → Database

Components:
Frontend: React.js with React Router for seamless navigation and Tailwind CSS for responsive design.
Backend: Node.js with Express.js for building RESTful APIs.
Database: MongoDB (non-relational) for scalable and flexible data storage.
Authentication: JWT-based login/signup with role-based access (Traveler, Host, Admin).
Payment Gateway: Stripe / Razorpay (sandbox mode).
Hosting:
Frontend → Vercel
Backend → Render / Railway
Database → MongoDB Atlas

5. Key Features
Category
Features
Authentication & Authorization
Secure JWT authentication for Traveler, Host, and Admin roles; session management; protected routes
CRUD Operations
Hosts can create, read, update, and delete property listings
Frontend Routing
Pages: Home, Login, Register, Listings, Property Details, Host Dashboard, Admin Dashboard, Profile
Pagination
Efficient display of listings with paginated results
Searching
Keyword and location-based property search using Google Maps API
Sorting
Sort by price, ratings, and popularity
Filtering
Filter by amenities, location, and price range
Booking System
Calendar-based booking with availability checks
Payments
Secure checkout using Stripe / Razorpay integration
Reviews & Ratings
Travelers can rate and review their stays
Admin Controls
Admin can manage users, verify properties, and moderate content
Hosting
Fully deployed full-stack application (Frontend + Backend + Database)


6. Tech Stack
Layer
Technologies
Frontend
React.js, React Router, Axios, Tailwind CSS
Backend
Node.js, Express.js
Database
MongoDB
Authentication
JWT (JSON Web Token)
APIs
Google Maps API, Stripe / Razorpay Payment Gateway
Hosting
Vercel (Frontend), Render / Railway (Backend), MongoDB Atlas (Database)


7. API Overview
Endpoint
Method
Description
Access
/api/auth/signup
POST
Register a new user (Traveler/Host)
Public
/api/auth/login
POST
Authenticate user and issue JWT
Public
/api/properties
GET
Retrieve all listed properties
Public
/api/properties/:id
GET
Get detailed info about a property
Public
/api/properties
POST
Add a new property (Host only)
Host
/api/properties/:id
PUT
Update a property listing
Host
/api/properties/:id
DELETE
Delete a property listing
Host/Admin
/api/bookings
POST
Create a new booking
Traveler
/api/payments
POST
Process payment via Stripe/Razorpay
Traveler
/api/reviews
POST
Submit review and rating
Traveler
/api/admin/users
GET
Manage all users
Admin


