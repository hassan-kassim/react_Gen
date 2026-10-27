/**
 * Simulates an asynchronous API login request.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, data: {token: string, user: {name: string, email: string}}}>}
 */
export const loginUser = async (email, password) => {
  // Simulate network round-trip delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulated Database Check
   if (email === 'user@example.com' && password === 'Password123!') {
    return {
      success: true,
      token: 'mock-jwt-token-xyz123',
      user: { 
        id: 'usr_879213',
        name: 'Jane Doe', 
        email: 'user@example.com',
        role: 'administrator'
      }
    };
  }else if (email === 'user1@example.com' && password === 'Password123!') {
    return {
      success: true,
      token: 'mock-jwt-token-abc456',
      user: { 
        id: 'usr_987654',
        name: 'John Doe', 
        email: 'user1@example.com',
        role: 'creator'
      }
    };
  }else if (email === 'user2@example.com' && password === 'Password123!') {
    return {
      success: true,
      token: 'mock-jwt-token-def789',
      user: { 
        id: 'usr_123456',
        name: 'Alice Smith', 
        email: 'user2@example.com',
        role: 'tester'
      }
    };
  }

  // Handle expected credential authentication errors
  throw new Error('Invalid email address or password. Please try again.');
};