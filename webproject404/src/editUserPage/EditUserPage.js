import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { authFetch, getToken, getUsername, getEmail, getUserId } from "../services/authService.js";



const BACKEND_URL = "https://webproject404-backend.darkube.app/api/user/";

const EditUserPage = () => {

  const [username, setUsername] = useState(getUsername() || "");
  const [email, setEmail] = useState("");
  const [newUsername, setNewUsername] = useState(getUsername() || "");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [userId, setUserId] = useState(null);

  //Load user ID and email on mount
    useEffect(() => {
    const usernameFromStorage = getUsername();
    const emailFromStorage = getEmail();
    const idFromStorage = getUserId();

    if (!usernameFromStorage) return;

    setUsername(usernameFromStorage);
    setNewUsername(usernameFromStorage);
    setEmail(emailFromStorage);
    setNewEmail(emailFromStorage);
    setUserId(idFromStorage);
    }, []);

  // Handlers
  const handleUsernameChange = async () => {
    if (!userId) return;
    setLoading(true); setError(""); setMsg("");
    console.log(userId)
    console.log(getToken())
    try {
      const res = await authFetch(BACKEND_URL + userId + "/username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername })
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setUsername(data.username);
      setMsg("Username updated.");
    } catch {
      setError("Failed to update username");
    }
    setLoading(false);
  };

  const handleEmailChange = async () => {
    if (!userId) return;
    setLoading(true); setError(""); setMsg("");
    try {
      const res = await authFetch(BACKEND_URL + userId + "/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail })
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setEmail(data.email);
      setMsg("Email updated.");
    } catch {
      setError("Failed to update email");
    }
    setLoading(false);
  };

  const handlePasswordChangeClick = (e) => {
    e.preventDefault();
    setMsg(""); setError("");
    if (!currentPassword || !newPassword || !repeatNewPassword) {
      setError("Fill all password fields"); return;
    }
    if (newPassword !== repeatNewPassword) {
      setError("New passwords do not match"); return;
    }
    setShowModal(true);
  };

  const handleConfirmPasswordChange = async () => {
    if (!userId) return;
    setShowModal(false); setLoading(true); setMsg(""); setError("");
    try {
      const res = await authFetch(BACKEND_URL + userId + "/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }
      setMsg("Password updated!");
      setCurrentPassword(""); setNewPassword(""); setRepeatNewPassword("");
    } catch (e) {
      setError("Failed to update password: " + e.message);
    }
    setLoading(false);
  };

return (
  <div className="bg-light" style={{ overflowX: "hidden" }}>
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ backgroundColor: '#d9d9d9' }}>
      <Link to="/" className="navbar-brand ps-5 fw-bold fs-3">Form Builder</Link>
      <Link to="/explore" className="btn btn-dark btn-lg fw-bold fs-6" style={{ marginRight: "70px" }}>
        &larr; Back to Forms
      </Link>
    </div>

    <div className="row h-90" style={{ marginLeft: "100px" }}>
      {/* Main Content */}
      <div className="p-2" style={{ paddingTop: 0, maxWidth: "700px" }}>
        <h4 className="mb-4">Change Account</h4>
        {loading && <div className="alert alert-info">Loading...</div>}
        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Username Section */}
        <div className="mb-4">
          <p><strong>Username:</strong> {username}</p>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control w-50"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="Enter new username"
            />
            <button
              className="btn btn-outline-dark"
              onClick={handleUsernameChange}
              disabled={newUsername === username || loading}
            >
              Change Name
            </button>
          </div>
        </div>
        <hr />

        {/* Email Section */}
        <div className="mb-4">
          <p><strong>Email:</strong> {email}</p>
          <div className="d-flex gap-3">
            <input
              type="email"
              className="form-control w-50"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="Enter new email"
            />
            <button
              className="btn btn-outline-dark"
              onClick={handleEmailChange}
              disabled={newEmail === email || loading}
            >
              Change Email
            </button>
          </div>
        </div>
        <hr />

        {/* Password Section */}
        <div className="mb-4">
          <p><strong>Password</strong></p>
          <div
            className="d-grid"
            style={{ width: "500px",gridTemplateColumns: "1fr auto", gridTemplateRows: "auto auto auto", gap: "0.5rem" }}
          >
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ gridColumn: "1", gridRow: "1" }}
            />
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ gridColumn: "1", gridRow: "2" }}
            />
            <input
              type="password"
              className="form-control"
              value={repeatNewPassword}
              onChange={e => setRepeatNewPassword(e.target.value)}
              placeholder="Enter new password again"
              style={{ gridColumn: "1", gridRow: "3" }}
            />
            <button
              className="btn btn-outline-dark"
              onClick={handlePasswordChangeClick}
              disabled={loading}
              style={{ gridColumn: "2", gridRow: "3", whiteSpace: "nowrap" }}
            >
              Change Password
            </button>
          </div>
        </div>

      </div>
    </div>

    {/* Modal */}
    {showModal && (
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Password Change</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to change your password?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmPasswordChange}>Yes, change it</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default EditUserPage;