import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches a list of users from the mock API server using Axios
 * @returns {Promise<Array>} List of user objects
 */

console.log('user service calls BASE_URL', BASE_URL) // Debugging: Log when the service is called
export const fetchUsersList = async () => {
    console.log('Raw API Response:', response); // Debugging: Log the raw response data

  try {
    const response = await axios.get(`${BASE_URL}/userList.json`);
    
    console.log('Raw API Response:', response); // Debugging: Log the raw response data
    // Transform or clean up the API data to match your requirements
    return response.data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      company: user.company.name,
      city: user.address.city
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to retrieve system users.');
  }
};
