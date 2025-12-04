import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import HostDashboard from './pages/HostDashboard';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import ListingDetails from './pages/ListingDetails';
import Search from './pages/Search';
import Checkout from './pages/Checkout';
import MyTrips from './pages/MyTrips';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listings/:id" element={<ListingDetails />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/host/create-listing" element={<CreateListing />} />
          <Route path="/host/edit-listing/:id" element={<EditListing />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;