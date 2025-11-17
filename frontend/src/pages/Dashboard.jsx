import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Decode token to get user info (basic implementation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Liora Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="dashboard-content">
        <div className="user-info">
          <h2>User Information</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            {user.role === 'traveler' && (
              <>
                <div className="card">
                  <h3>Find Accommodations</h3>
                  <p>Search for places to stay</p>
                </div>
                <div className="card">
                  <h3>My Bookings</h3>
                  <p>View your reservations</p>
                </div>
              </>
            )}
            
            {user.role === 'host' && (
              <>
                <div className="card">
                  <h3>My Properties</h3>
                  <p>Manage your listings</p>
                </div>
                <div className="card">
                  <h3>Reservations</h3>
                  <p>View guest bookings</p>
                </div>
              </>
            )}
            
            <div className="card">
              <h3>Profile Settings</h3>
              <p>Update your information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;