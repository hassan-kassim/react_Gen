import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches a list of users from the mock API server using Axios
 * @returns {Promise<Array>} List of user objects
 */

export const fetchUsersList = async () => {
  try {
    const response = await axios.get('/mock-backend/userList.json');
    // Transform or clean up the API data to match your requirements
    return response.data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      company: user.company?.name ?? '',
      city: user.address?.city ?? ''
    }));
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to retrieve system users.';

    throw new Error(message);
  }
};
