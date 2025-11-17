import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/AuthService";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "traveler",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(formData);
      alert(data.msg);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data.msg);
      } else {
        alert("Cannot connect to backend. Check if backend is running.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="traveler">Traveler</option>
          <option value="host">Host</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;

