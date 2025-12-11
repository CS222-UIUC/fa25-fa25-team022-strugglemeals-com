import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">Home</Link>
        <Link className={`nav-link ${isActive("/about") ? "active" : ""}`} to="/about">About</Link>
        <Link className={`nav-link ${isActive("/community") ? "active" : ""}`} to="/community">Community</Link>
        <Link className={`nav-link ${isActive("/recipes") ? "active" : ""}`} to="/recipes">Recipes</Link>
        {user ? (
          <>
            <Link className={`nav-link ${isActive("/profile") ? "active" : ""}`} to="/profile">My Profile</Link>
            <Link className={`nav-link ${isActive("/upload") ? "active" : ""}`} to="/upload">Upload Recipe</Link>
            <button onClick={logout} className="nav-button">Logout</button>
          </>
        ) : (
          <>
            <Link className={`nav-link ${isActive("/login") ? "active" : ""}`} to="/login">Login</Link>
            <Link className={`nav-link ${isActive("/signup") ? "active" : ""}`} to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
