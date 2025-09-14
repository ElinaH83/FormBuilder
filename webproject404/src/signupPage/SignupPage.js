import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup, checkUsernameAvailability } from "../services/authService.js";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);

  const isPasswordTooShort = password.length > 0 && password.length < 8;
  const isPasswordOnlyDigits = password.length > 0 && /^\d+$/.test(password);
  const isSubmitDisabled = !username || !email || !password || isUsernameTaken || isPasswordTooShort || isPasswordOnlyDigits;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (isUsernameTaken) return;

    try {
      const data = await signup(username, email, password);
      setSuccess(data.message || "Signup successful!");
      setTimeout(() => navigate("/login-signup"), 1500);
    } catch (e) {
      setError("Signup failed: " + e.message);
    }
  };

  useEffect(() => {
    if (!username) { setIsUsernameTaken(false); return; }
    const controller = new AbortController();
    const debounceId = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailability(username, { signal: controller.signal });
        setIsUsernameTaken(!available);
      } catch {
        setIsUsernameTaken(false);
      }
    }, 400);
    return () => { clearTimeout(debounceId); controller.abort(); };
  }, [username]);

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>Create your account</h2>
        {error && <div className="signup-alert error">{error}</div>}
        {success && <div className="signup-alert success">{success}</div>}
        <form onSubmit={handleSignup} noValidate>
          <div className="form-field">
            <label>Username</label>
            <input type="text" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} />
            {isUsernameTaken && <div className="field-hint error">This username is already taken.</div>}
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} />
            {isPasswordTooShort && <div className="field-hint error">Must be 8 characters</div>}
            {isPasswordOnlyDigits && <div className="field-hint error">Weak password</div>}
          </div>
          <button type="submit" disabled={isSubmitDisabled}>Create account</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
