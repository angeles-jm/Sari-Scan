import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState();

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <form onSubmit={registerUser}>
        <label htmlFor="">Name</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <label htmlFor="">Email</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <label htmlFor="">Password</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Enter your password"
        />
        <button type="submit">Register</button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
