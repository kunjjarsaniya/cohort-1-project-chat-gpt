import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, logout } from '../../services/api';
import './ProfileModal.css';

const ProfileModal = ({ onClose, onProfileUpdated }) => {
  const [mode, setMode] = useState('view'); // 'view' or 'edit'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});


  // Logout handler state (must be declared before any early returns)
  const [loggingOut, setLoggingOut] = useState(false);

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setForm({
          firstName: data.fullName?.firstName || '',
          lastName: data.fullName?.lastName || '',
          email: data.email || ''
        });
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} is required`;
        } else if (value.length < 2) {
          newErrors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} must be at least 2 characters`;
        } else if (value.length > 50) {
          newErrors[name] = `${name === 'firstName' ? 'First name' : 'Last name'} must be less than 50 characters`;
        } else {
          delete newErrors[name];
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  
  const validateForm = () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email'];
    const validationResults = fieldsToValidate.map(field => 
      validateField(field, form[field])
    );
    return validationResults.every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the form errors before submitting.');
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedProfile = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email
      });
      
      const updatedUserData = {
        fullName: {
          firstName: updatedProfile.user.fullName.firstName,
          lastName: updatedProfile.user.fullName.lastName
        },
        email: updatedProfile.user.email
      };
      
      setForm({
        firstName: updatedUserData.fullName.firstName,
        lastName: updatedUserData.fullName.lastName,
        email: updatedUserData.email
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      setMode('view');
      
      // Notify parent component about the profile update
      if (onProfileUpdated) {
        onProfileUpdated(updatedUserData);
      }
    } catch (err) {
      setError(err || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true" aria-busy="true" aria-live="polite">
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-body">
            <div className="loading-spinner">
              <span className="sr-only">Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    if (!form.firstName && !form.lastName) return '👤';
    return `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`;
  };

  // Logout handler
  const handleLogout = async () => {
    setLoggingOut(true);
    setError('');
    try {
      await logout();
      window.location.href = '/login';
    } catch (err) {
      setError(err || 'Failed to logout.');
      alert('Failed to logout');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true" 
      onClick={onClose}
      aria-labelledby="profile-modal-title"
    >
      <div className="modal-content profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="profile-modal-title" className="modal-title">
            {mode === 'view' ? 'Your Profile' : 'Edit Profile'}
          </h3>
          <button 
            type="button"
            className="modal-close" 
            onClick={onClose} 
            aria-label="Close profile"
            disabled={saving || loggingOut}
            aria-busy={saving || loggingOut ? 'true' : 'false'}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        {mode === 'view' ? (
          <div className="modal-body">
            <div className="profile-view">
              <div className="profile-avatar" aria-hidden="true">
                {getInitials()}
              </div>
              <div className="profile-info">
                <h4>
                  <span className="sr-only">Name: </span>
                  {form.firstName} {form.lastName}
                </h4>
                <p className="email">
                  <span className="sr-only">Email: </span>
                  {form.email}
                </p>
              </div>
            </div>
            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <button 
                type="button" 
                className="btn primary center-actions"
                onClick={() => setMode('edit')}
                aria-label="Edit profile"
                disabled={loggingOut}
              >
                Edit Profile
              </button>
              <button
                type="button"
                className="btn danger center-actions"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Logout"
                style={{ minWidth: 110 }}
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={(e) => validateField('firstName', e.target.value)}
                  className={errors.firstName ? 'error' : ''}
                  disabled={saving}
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={(e) => validateField('lastName', e.target.value)}
                  className={errors.lastName ? 'error' : ''}
                  disabled={saving}
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={(e) => validateField('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  disabled={saving}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn" 
                onClick={() => setMode('view')}
                disabled={saving}
                aria-label="Cancel editing"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn primary" 
                disabled={saving || Object.keys(errors).length > 0}
                aria-label="Save profile changes"
                aria-busy={saving ? 'true' : 'false'}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
