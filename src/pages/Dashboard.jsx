import React, { useState, useEffect } from 'react';
import { authService } from '../service/authService';

const PasswordModal = ({ isOpen, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await authService.changePassword(currentPassword, newPassword);
      onSave();
      onClose();
    } catch (err) {
      setError('Failed to change password');
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Password</h2>
        <div className="modal-field">
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersTable = ({ users, fetchUsers }) => {
  const handleDeleteUser = async (userId) => {
    try {
      await authService.deleteUser(userId);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="users-table-container">
      <h2>Manage All Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button className="btn btn-primary">Edit</button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditToggle = () => setEditing(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await authService.updateProfile(editedUser);
      setUser(updatedUser);
      setEditedUser(updatedUser);
      setEditing(false);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setEditing(false);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        {['home', 'profile', 'users', 'settings'].map((section) => (
          <div
            key={section}
            className={`dashboard-menu-item ${
              activeSection === section ? 'active' : ''
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </div>
        ))}
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
                value={isEditing ? editedUser.username : user.username}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={isEditing ? editedUser.email : user.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleEditToggle}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    Change Password
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="dashboard-settings">
            <h2>Settings Section</h2>
          </div>
        )}

        {activeSection === 'users' && isAdmin && (
          <UsersTable users={users} fetchUsers={fetchUsers} />
        )}

        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={() => alert('Password changed successfully')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
