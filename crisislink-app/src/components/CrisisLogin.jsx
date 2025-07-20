import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CrisisLogin.css";
import eye from "../assets/eye.png";
import eyeCrossed from "../assets/eye-crossed.png";
import axios from "axios";


const CrisisLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = "Email is required.";
    else if (!email.includes("@")) newErrors.email = "Enter a valid email.";

    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      axios.post("http://localhost:5000/login", {
        email,
        password,
      })
        .then((res) => {
          console.log("Login success:", res.data);
          // You can save token if any, then redirect or show message
        })
        .catch((err) => {
          if (err.response && err.response.data) {
            alert(err.response.data.message || "Login failed");
          } else {
            alert("Server error");
          }
        });
    }

  };

  return (
    <div className="signup-bg">
      <div className="signup-left">
        <div className="brand">
          <h1 className="crisis-logo">CrisisLink</h1>
          <p>Bridging help and humanity</p>
        </div>
      </div>
      <div className="signup-form-container">
        <div className="form-box">
          <h1 className="welcome-title text-center">Welcome Back</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="form-label label-light" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control input-light"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
            </div>

            <div className="position-relative mt-3">
              <label className="form-label label-light" htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control input-light"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="text-danger mt-1">{errors.password}</div>}

              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                <img className="eye" src={showPassword ? eyeCrossed : eye} alt="Toggle Password" />
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4">Log In</button>

            <div className="text-center m-2">
              <span className="label-light">New user? </span>
              <Link to="/signup" className="text-link">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrisisLogin;