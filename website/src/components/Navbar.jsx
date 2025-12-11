/**import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {useAuth} from "../AuthContext";

const Navbar = () => {
  const location = useLocation();
  const {user, logout} = useAuth();

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#000000ff' : '#333333', 
    borderBottom: location.pathname === path ? '2px solid #000000ff' : 'none',
    paddingBottom: '4px',
    fontFamily: '"Arial", monospace',
    transition: 'all 0.3s ease',
  });

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        padding: '20px',
        backgroundColor: '#ffffffff',
        fontSize: '18px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Link to="/" style={linkStyle('/')}>Home</Link>
      <Link to="/about" style={linkStyle('/about')}>About</Link>
      <Link to="/contact" style={linkStyle('/contact')}>Contact Us</Link>
      <Link to="/community" style={linkStyle('/community')}>Community</Link>
      <Link to="/recipes" style={linkStyle('/recipes')}>Recipes</Link>
      {user ? (
        <>
          <Link to="/profile" style={linkStyle('/profile')}>My Profile</Link>
          <Link to="/upload" style={linkStyle('/upload')}>Upload Recipe</Link>
          <button
            onClick={logout}
            style={{ marginLeft: '10px', cursor: 'pointer', fontFamily: 'Arial, monospace' }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={linkStyle('/login')}>Login</Link>
          <Link to="/signup" style={linkStyle('/signup')}>Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;**/

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
        <Link className={`nav-link ${isActive("/contact") ? "active" : ""}`} to="/contact">Contact</Link>
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
