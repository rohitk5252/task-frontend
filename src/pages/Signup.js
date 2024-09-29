import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { Link } from "react-router-dom";
import { genConfig } from 'react-nice-avatar'

const Signup = () => {
  const [postData, setPostData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { handleGoogleLogin } = useGoogleAuth();

  const { signup, isLoading, error, isSuccess } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup({...postData, userAvatar: {...genConfig(), shirtColor: "#fff"}});
  };

  const onChangeInput = (e, type) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth">
      <div className="container">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            type="text"
            value={postData?.firstName}
            placeholder="Firstname"
            onChange={onChangeInput}
            disabled={isLoading}

          />
          <input
            name="lastName"
            type="text"
            value={postData?.lastName}
            placeholder="Lastname"
            onChange={onChangeInput}
            disabled={isLoading}

          />
          <input
            name="email"
            type="email"
            value={postData?.email}
            placeholder="Email"
            onChange={onChangeInput}
            disabled={isLoading}

          />
          <input
            name="password"
            type="password"
            value={postData?.password}
            placeholder="Password"
            onChange={onChangeInput}
            disabled={isLoading}

          />
          <input
            name="confirmPassword"
            type="password"
            value={postData?.confirmPassword}
            placeholder="Confirm Password"
            onChange={onChangeInput}
            disabled={isLoading}

          />
          <button
            className="btn btn-filled btn-filled-blue auth-btn"
            disabled={isLoading}
          >
            Sign up
          </button>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
          <button
            className="btn btn-filled btn-filled-blue google-btn"
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleGoogleLogin();
            }}
          >
            Sign Up With <b>Google</b>
          </button>
          {isLoading && (
            <div
              className="loading"
            >
              Signing Up ...
            </div>
          )}
          {error && <div className="error">{error}</div>}
          {isSuccess && <div className="success">Signed up sucessfully</div>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
