import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isLoggedIn, getUsername, getEmail,logout} from "./services/authService.js";

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn()) {
      setLoggedInUser({ username: getUsername(), email: getEmail() });
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



const handleLogout = async () => {
  try {
    await logout();  // <-- this calls backend logout + clears token
    setLoggedInUser(null);
    setDropdownOpen(false);
    navigate("/");
  } catch (err) {
    console.error("Logout failed", err);
  }
};

  const handleEditUser = () => {
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg ps-4 navbar-light bg-light h">
      <Link to="/" className="navbar-brand ps-5 fs-3 fw-bold">Form Builder</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto w-75">
          <li className="nav-item navbar-nav ps-5">
            <Link to="/explore" className="nav-link ps-5">Forms</Link>
            <Link to="/management" className="nav-link ps-5">Management</Link>
            <Link to="/report" className="nav-link ps-5">Reports</Link>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto" style={{ marginRight: "70px" }}>
          {loggedInUser ? (
            <li className="nav-item position-relative" ref={dropdownRef}>
              <button
                className="btn btn-dark"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ backgroundColor: "white" , borderRadius:50 , padding:0}}
              >
                <img src='/user.png' height={30} width={30} alt='user-icon'></img>
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu show position-absolute end-0 mt-2" style={{ display: "block" }}>
                  <li className="dropdown-item" style={{color: "gray"}}>{loggedInUser.email}</li>
                  <li><hr className="dropdown-divider" /></li>
                  <button className="dropdown-item" onClick={handleEditUser}>
                      Edit User
                  </button>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/login-signup" className="btn btn-dark btn-lg fw-bold fs-6">Login/Sign Up</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;