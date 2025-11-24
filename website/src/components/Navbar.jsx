import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: location.pathname === path ? '#000000ff' : 'white', 
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

    </nav>
  );
};

export default Navbar;