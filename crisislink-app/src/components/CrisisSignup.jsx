import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CrisisSignup.css";
import eye from "../assets/eye.png";
import eyeCrossed from "../assets/eye-crossed.png";

const CrisisSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    fetch("/data/states.json")
      .then((res) => res.json())
      .then((data) => setStates(data));
  }, []);

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setErrors((prev) => ({ ...prev, state: "" }));
    const res = await fetch("/data/districts.json");
    const data = await res.json();
    setDistricts(data[state] || []);
    setSelectedDistrict("");
    setCities([]);
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setErrors((prev) => ({ ...prev, district: "" }));
    setSelectedCity("");
    try {
      const res = await fetch("/data/cities.json");
      const data = await res.json();
      setCities(data[selectedState]?.[district] || []);
    } catch (err) {
      console.error("Error loading cities:", err);
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = {};

  const fname = document.getElementById("fname").value.trim();
  const lname = document.getElementById("lname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const termsChecked = document.getElementById("terms").checked;

  if (!fname) newErrors.fname = "First name is required.";
  else if (!/^[A-Za-z]+$/.test(fname)) newErrors.fname = "First name must contain only alphabets.";

  if (!lname) newErrors.lname = "Last name is required.";
  else if (!/^[A-Za-z]+$/.test(lname)) newErrors.lname = "Last name must contain only alphabets.";

  if (!email.includes("@")) newErrors.email = "Enter a valid email.";
  if (!/^[0-9]{10}$/.test(phone)) newErrors.phone = "Enter a valid 10-digit number.";
  if (!dob) newErrors.dob = "Date of birth is required.";
  if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
  if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
  if (!gender) newErrors.gender = "Gender is required.";
  if (!selectedState) newErrors.state = "Please select a state.";
  if (!selectedDistrict) newErrors.district = "Please select a district.";
  if (!selectedCity) newErrors.city = "Please select a city.";
  if (!termsChecked) newErrors.terms = "You must agree to the Terms and Conditions.";

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    // If all validations pass, send data to backend
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fname + " " + lname,  // combine first and last name
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Signup failed.");
      } else {
        alert("Signup successful!");
        // Optionally redirect to login
        window.location.href = "/";
      }

    } catch (error) {
      console.error("Signup failed:", error);
      alert("Something went wrong. Please try again.");
    }
  }
};


  const maxDOB = new Date().toISOString().split("T")[0];

  return (
    <div className="signup-bg">
      <div className="signup-left">
        <div className="brand">
          <h1 className="crisis-logo">CrisisLink</h1>
          <p>Bridging help and humanity</p>
        </div>
      </div><div className="signup-form-container">
        <div className="form-box">
          <h1 className="welcome-title text-center">Welcome</h1>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label label-light" htmlFor="fname">First Name</label>
                <input type="text" id="fname" className="form-control input-light" placeholder="Enter your first name" pattern="[A-Za-z]+" title="First name must contain only alphabets."
                />
                {errors.fname && <div className="text-danger mt-1">{errors.fname}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label label-light" htmlFor="lname">Last Name</label>
                <input type="text" id="lname" className="form-control input-light" placeholder="Enter your last name" pattern="[A-Za-z]+" title="Last name must contain only alphabets."
                />
                {errors.lname && <div className="text-danger mt-1">{errors.lname}</div>}
              </div>
            </div>

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

            <div className="row space">
              <label className="form-label label-light">Gender</label>
              <div className="d-flex gap-4 align-items-center">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gender"
                    id="genderMale"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label label-light" htmlFor="genderMale">Male</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gender"
                    id="genderFemale"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label label-light" htmlFor="genderFemale">Female</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="gender"
                    id="genderOther"
                    value="Other"
                    checked={gender === "Other"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label className="form-check-label label-light" htmlFor="genderOther">Other</label>
                </div>
              </div>
              {errors.gender && <div className="text-danger mt-1">{errors.gender}</div>}
            </div>


            <div className="row space">
              <div className=" col-md-7">
                <label className="form-label label-light" htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control input-light"
                  placeholder="Enter 10-digit number"
                  pattern="[0-9]{10}"
                />
                {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
              </div>
              <div className="col-md-5">
                <label className="form-label label-light" htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  max={maxDOB}
                  className="form-control input-light"
                />
                {errors.dob && <div className="text-danger mt-1">{errors.dob}</div>}
              </div>
            </div>


            <div className="row space">
              <div className=" col-md-4">
                <label className="form-label label-light" htmlFor="state">State</label>
                <select
                  id="state"
                  className="form-select input-light"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <div className="text-danger mt-1">{errors.state}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label label-light" htmlFor="district">District</label>
                <select
                  id="district"
                  className="form-select input-light"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                >
                  <option value="">Select District</option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                {errors.district && <div className="text-danger mt-1">{errors.district}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label label-light" htmlFor="city">City</label>
                <select
                  id="city"
                  className="form-select input-light"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <div className="text-danger mt-1">{errors.city}</div>}
              </div>
            </div>

            <div className="position-relative">
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

            <div className="position-relative">
              <label className="form-label label-light" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="form-control input-light"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <div className="text-danger mt-1">{errors.confirmPassword}</div>}

              <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <img className="eye" src={showConfirmPassword ? eyeCrossed : eye} alt="Toggle Confirm Password" />
              </span>
            </div>

            <div className="form-check space">
              <input type="checkbox" className="form-check-input" id="terms" />
              <label className="form-check-label label-light" htmlFor="terms">
                I agree to the <a href="#" className="text-link">Terms and Conditions</a>
              </label>
            </div>

            <button type="submit" className="btn btn-primary w-100">Sign Up</button>

            <div className="text-center m-2">
              <span className="label-light">Already have an account? </span>
              <Link to="/" className="text-link">Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrisisSignup;

