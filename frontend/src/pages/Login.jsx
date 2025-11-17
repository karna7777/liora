import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      // If err.response is undefined, network error occurred
      if (err.response && err.response.data) {
        alert(err.response.data.msg);
      } else {
        alert("Cannot connect to backend. Check if backend is running.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
