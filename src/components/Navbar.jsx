import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {authService} from '../service/authService';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // ✅ state to trigger re-render

  useEffect(() => {
    const user = authService.getCurrentUserFromLocalStorage();
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null); // ✅ clear user from state
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        User Management
      </Link>
      <ul className="navbar-links">
        <li>
          <Link className="navbar-link" to="/">
            Home
          </Link>
        </li>

        {currentUser ? (
          <>
            <li className="navbar-user">Welcome, {currentUser.username}</li>
            <li>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="navbar-link">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
