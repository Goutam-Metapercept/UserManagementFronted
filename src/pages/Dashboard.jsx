import React, { useState, useEffect } from 'react';
import { authService } from '../service/authService';
import api from '../service/authService'; // 'api' is the default export

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Reserved for future use

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setEditedUser(currentUser);
        setIsAdmin(currentUser?.role?.includes('ROLE_ADMIN') || false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div
          className={`dashboard-menu-item ${activeSection === 'home' ? 'active' : ''}`}
          onClick={() => setActiveSection('home')}
        >
          Home
        </div>
        <div
          className={`dashboard-menu-item ${activeSection === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSection('profile')}
        >
          Profile
        </div>
        <div
          className={`dashboard-menu-item ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          Users
        </div>
        <div
          className={`dashboard-menu-item ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          Settings
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeSection === 'home' && (
          <div className="dashboard-home">
            <h2>Welcome, {user?.username}</h2>
            <p>Some Content</p>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="dashboard-profile">
            <h2>User Profile Information</h2>
            <div className="profile-field">
              <label>Username:</label>
              <input 
              type="text"
              name="username"
              value={isEditing?editedUser.username:user.username}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <input 
              type="email"
              name="email"
              value={isEditing?editedUser.email:user.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
            </div>
          
          </div>
        )}
       <div className='profile-actions'>
        {isEditing ? (
          <>
          <button className='btn btn-primary' onClick={handleEditToggle}>Edit</button>
          <button className='btn btn-secondary' onClick={setIsPasswordModalOpen}>Change Password(true)</button>
        ) : (
          <button className='btn btn-primary' onClick={handleSaveProfile}>Save</button>
          <button className='btn btn-secondary' onClick={handleCancelEdit}>Save</button>
        )}}
       </div>
       
       

        {activeSection === 'settings' && (
          <div className="dashboard-settings">
            <h2>Settings Section</h2>
          </div>
        )}
         {activeSection === 'users' && isAdmin && (
          
            <usersTable/>
      
        )}
      </div>
    </div>
  );
};

export default Dashboard;
