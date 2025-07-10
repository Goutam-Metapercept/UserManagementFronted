import React, { useState, useEffect } from 'react';
import { authService } from '../service/authService';
import api from '../service/authService'; // You exported api as default

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // Assuming this was missing

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
      <div className="dashboard-content">
        {/* Render section based on activeSection */}
        {activeSection === 'home' && <div>Welcome, {user?.username}</div>}
        {activeSection === 'profile' && <div>Profile Section (editing: {isEditing.toString()})</div>}
        {activeSection === 'users' && isAdmin && <div>User List Coming Soon</div>}
        {activeSection === 'settings' && <div>Settings Section</div>}
      </div>
    </div>
  );
};

export default Dashboard;
