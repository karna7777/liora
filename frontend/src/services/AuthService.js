import axios from "axios";

// Base URL for backend
const API_URL = "http://localhost:8000/api/auth/";

export const signup = async (userData) => {
  const res = await axios.post(API_URL + "signup", userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await axios.post(API_URL + "login", userData);
  return res.data;
};
