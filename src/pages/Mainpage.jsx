import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';

const Mainpage = () => {
  const navigate = useNavigate();

  const handleGettingStarted = () => {
    navigate('/signup');
  };

  const handleLearnMore = () => {
    window.open('https://google.com', '_blank', 'noopener noreferrer');
  };

  return (
    <main className="home-container">
      <h1 className="home-title">Welcome to the User Management System</h1>
      <p
        style={{
          color: '#555',
          fontSize: '1.2rem',
          marginBottom: '32px',
          textAlign: 'center',
          maxWidth: 600,
        }}
      >
        Manage your users efficiently and securely. Get started to create your
        account or learn more about our features.
      </p>
      <div className="home-buttons">
        <button
          className="btn btn-primary"
          onClick={handleGettingStarted}
          aria-label="Get started with user management"
        >
          Getting Started
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleLearnMore}
          aria-label="Learn more about the user management system"
        >
          Learn More
        </button>
      </div>
    </main>
  );
};

export default Mainpage;
