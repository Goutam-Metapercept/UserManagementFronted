
import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Mainpage.css'; // Import your CSS styles

const Mainpage = () => {
    const navigate = useNavigate();
    const handleGettingStarted = () => {
        //do anything you want to do when the user clicks on Getting Started
        navigate('/signup');
    }
    const handleLearnMore = () => {
        //do anything you want to do when the user clicks on Learn More
      window.open('https://google.com', '_blank'); // Opens a new tab with the specified URL
    }
    return (
        <div className="home-container">
            Welcome to the User Management System
            <div className="home-buttons">
                <button className='btn btn-primary' onClick={handleGettingStarted}>
                    Getting Started
                </button>
                <button className="btn btn-secondary"
                onClick={handleLearnMore}>
                    Learn More
                </button>
                
            </div>
        </div>
    )
}

export default Mainpage

