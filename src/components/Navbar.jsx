import { authService } from "../service/authService";
import React from "react";
import './Navbar.css'; 
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUserFromLocalStorage();
    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally, you can show an error message to the user
        }
    }
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">User Management</Link>
            <ul className="navbar-links">
                <li><a href="/">Home</a></li>
                {currentUser ? (
                    <>
                        <span className="navbar-user">
                            Welcome, {currentUser.username}
                        </span>
                        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Signup</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );

}

