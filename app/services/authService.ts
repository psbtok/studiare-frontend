import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config';
import { validateRegistrationInput } from '../validators/validators';

export const loginService = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.non_field_errors ? data.non_field_errors[0] : 'Login failed');
    }

    const token = data.token;
    await AsyncStorage.setItem('login-token', token);
    await AsyncStorage.setItem('username', username);
    
    return token;
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error; 
  }
};

export const registerService = async (
  username: string,
  email: string,
  password: string,
  isTutor: boolean
) => {
  const validationErrors = validateRegistrationInput(username, email, password);
  if (validationErrors.length) {
    throw new Error(validationErrors.join(' '));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/create-profile/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username,
          email,
          password,
        },
        is_tutor: isTutor,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.non_field_errors ? data.non_field_errors[0] : 'Registration failed');
    }

    return data;
  } catch (error: any) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

export const logoutService = async () => {
  try {
    const token = await AsyncStorage.getItem('login-token');
    
    if (token) {
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed on server');
      }
    }

    await AsyncStorage.removeItem('login-token');
    await AsyncStorage.removeItem('username');
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};