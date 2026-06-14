import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import UserDetailForm from '../components/UserDetailForm';
import API from '../services/api';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users/profile');
      setProfile(response.data.data);
      if (response.data.data.name) {
        localStorage.setItem('userName', response.data.data.name);
      }
    } catch (err) {
      setError('Failed to load profile details. Please try logging in again.');
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveSuccess = (updatedDetails) => {
    setProfile((prev) => ({ ...prev, details: updatedDetails }));
    setIsModalOpen(false);
    setSuccessMessage('Profile details saved successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderWidth: '3px' }}></div>
      </div>
    );
  }

  const hasDetails = profile && profile.details;
  const imageBase = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  const profileImageUrl = hasDetails && profile.details.imageUrl
    ? (profile.details.imageUrl.startsWith('http') ? profile.details.imageUrl : `${imageBase}${profile.details.imageUrl}`)
    : '';

  // Standard avatar placeholder from Unsplash
  const placeholderAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&h=250&q=80';

  return (
    <div className="app-container">
      <Navbar userName={profile?.name} />

      <main className="content-wrapper">
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="dashboard-title-bar">
          <div>
            <h1 className="dashboard-title text-gradient">Dashboard</h1>
            <p className="dashboard-subtitle">Manage your personal profile and professional portfolio</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            {hasDetails ? 'Edit User Details' : 'Add User Details'}
          </button>
        </div>

        <div className="dashboard-grid">
          {/* Column 1: Account Profile Summary Card */}
          <div className="card-glass profile-avatar-container">
            <img
              src={profileImageUrl || placeholderAvatar}
              alt="Avatar"
              className="profile-avatar"
              onError={(e) => {
                e.target.src = placeholderAvatar;
              }}
            />
            <h3 className="profile-name">{hasDetails ? profile.details.fullName : profile?.name}</h3>
            <p className="profile-email">{profile?.email}</p>
            
            <div style={{ width: '100%', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', marginTop: '0.5rem', textAlign: 'left' }}>
              <div className="profile-info-item">
                <span className="profile-info-label">Account Status</span>
                <span className="profile-info-value" style={{ color: '#10B981', fontWeight: 600 }}>Active</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Registered Email</span>
                <span className="profile-info-value">{profile?.email}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Secondary User Portfolio Details */}
          <div className="card-glass" style={{ height: '100%' }}>
            {hasDetails ? (
              <div>
                <h3 className="text-gradient" style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Professional Details</h3>
                
                <div className="profile-info-item" style={{ marginBottom: '1.5rem' }}>
                  <span className="profile-info-label">Location / Address</span>
                  <span className="profile-info-value" style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
                    📍 {profile.details.address}
                  </span>
                </div>

                <div className="profile-info-item" style={{ marginBottom: '1.5rem' }}>
                  <span className="profile-info-label">Skills & Tech Stack</span>
                  <div className="badge-container">
                    {profile.details.skills.map((skill, index) => (
                      <span key={index} className="badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="profile-info-item">
                  <span className="profile-info-label">Profile Description</span>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginTop: '0.25rem', whiteSpace: 'pre-line' }}>
                    {profile.details.profileDescription}
                  </p>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
                <h4 className="empty-state-title">Please Complete Your Profile</h4>
                <p className="empty-state-text">
                  Add custom info including details, skills, location, bio description, and a profile avatar.
                </p>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                  Add User Details
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <UserDetailForm
          initialData={profile?.details}
          onClose={() => setIsModalOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
