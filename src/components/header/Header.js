import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import the CSS file for styling

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-name">FOODIEDELIGHT</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </header>
  );
};

export default Header;
