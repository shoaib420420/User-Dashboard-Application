import React, { useState, useEffect } from 'react';
import API from '../services/api';

const UserDetailForm = ({ initialData, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    skills: '',
    profileDescription: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing details if present (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        address: initialData.address || '',
        skills: initialData.skills ? initialData.skills.join(', ') : '',
        profileDescription: initialData.profileDescription || ''
      });
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl.startsWith('http')
          ? initialData.imageUrl
          : `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${initialData.imageUrl}`);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\//)) {
        setError('Please select a valid image file (PNG, JPG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const validate = () => {
    const { fullName, address, skills, profileDescription } = formData;
    if (
      !fullName.trim() ||
      !address.trim() ||
      !skills.trim() ||
      !profileDescription.trim()
    ) {
      return 'All fields are required';
    }
    if (!imageFile && !initialData?.imageUrl) {
      return 'Please upload a profile image';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('address', formData.address);
      data.append('skills', formData.skills);
      data.append('profileDescription', formData.profileDescription);
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await API.post('/users/details', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        onSaveSuccess(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card-glass modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-gradient" style={{ fontSize: '1.5rem' }}>
            {initialData ? 'Update Profile Details' : 'Add Profile Details'}
          </h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ alignItems: 'center' }}>
            <label className="form-label" style={{ alignSelf: 'flex-start' }}>Profile Image</label>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <div className="image-upload-wrapper" style={{ width: '100%' }} onClick={() => document.getElementById('image-input').click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                <div style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.3)' }}>📷</div>
              )}
              <span className="image-upload-text">
                {imageFile || imagePreview ? 'Change profile photo' : 'Select profile photo'}
              </span>
              <span className="image-upload-subtext">JPG, PNG, GIF, WEBP up to 5MB</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Your professional name"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="e.g. San Francisco, CA"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills">Skills (Comma Separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              placeholder="e.g. React, Node.js, Express, MongoDB, CSS"
              className="form-input"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profileDescription">Profile Description</label>
            <textarea
              id="profileDescription"
              name="profileDescription"
              placeholder="Brief summary of your professional background, skills, or goals..."
              className="form-input"
              rows="4"
              style={{ resize: 'vertical' }}
              value={formData.profileDescription}
              onChange={handleChange}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '120px' }}>
              {loading ? <div className="spinner"></div> : 'Save Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetailForm;
