import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName }) => {
  const navigate = useNavigate();
  const storedName = localStorage.getItem('userName') || 'User';
  const nameToDisplay = userName || storedName;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className="navbar-brand text-gradient">User-Dashboard</span>
        <div className="navbar-user-section">
          <span className="navbar-welcome">
            Welcome, <span>{nameToDisplay}</span>
          </span>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', backgroundColor: 'blue' }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
