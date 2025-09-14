import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthData, getUsername, isLoggedIn, removeAuthData, login, logout } from "../services/authService.js";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const isSubmitDisabled = !email || !password;

  useEffect(() => {
    if (isLoggedIn()) setLoggedInUser(getUsername());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    try {
      const data = await login(email, password);
      setAuthData(data.token, data.username || email, email, data.id || "");
      console.log(data.token);
      setSuccess("Login successful!");
      setLoggedInUser(data.username || email);

      setTimeout(() => navigate("/edit-user"), 1500);
    } catch (e) {
      setError("Login failed: " + e.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // call backend logout
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // always clear frontend state
      //removeAuthData();
      setLoggedInUser(null);
      navigate("/");
    }
  };


  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2>Welcome back</h2>

        {error && <div className="login-alert error">{error}</div>}
        {success && <div className="login-alert success">{success}</div>}

        {loggedInUser ? (
          <div className="login-status">
            <p>You are logged in as <strong>{loggedInUser}</strong>.</p>
            <button className="login-button danger" onClick={handleLogout} type="button">Logout</button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="login-button" type="submit" disabled={isSubmitDisabled}>Log in</button>
          </form>
        )}

        {!loggedInUser && (
          <div className="login-footer">
            <button type="button" className="login-link" onClick={() => navigate("/signup")}>
              Don't have an account? Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
