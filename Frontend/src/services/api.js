import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Set auth token for requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get user profile
const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error.response?.data?.message || 'Failed to fetch profile';
  }
};

// Update user profile
const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/profile`,
      profileData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data?.message || 'Failed to update profile';
  }
};

export { setAuthToken, getProfile, updateProfile };
