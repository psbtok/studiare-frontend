import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config';
import { validateRegistrationInput, validateLoginInput } from '../validators/validators';
import words from '@/locales/ru';

export const loginService = async (username: string, password: string) => {
  const validationErrors = validateLoginInput(username, password);
  if (validationErrors.length) {
    throw new Error(validationErrors.join('\n'));
  }

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
      throw new Error(data.non_field_errors ? data.non_field_errors[0] : words.loginFailed);
    }

    const token = data.token;
    await AsyncStorage.setItem('login-token', token);
    await AsyncStorage.setItem('profile', JSON.stringify(data.profile));

    return token;
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error; 
  }
};

export const registerService = async (
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const validationErrors = validateRegistrationInput(email, password, confirmPassword);
  if (validationErrors.length) {
    throw new Error(validationErrors.join('\n'));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profile/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email,
          password,
        }
      }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.non_field_errors ? data.non_field_errors[0] : words.registrationFailed);
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
    }

    await AsyncStorage.removeItem('login-token');
    await AsyncStorage.removeItem('profile');
    console.log(words.logoutSuccess);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const editProfileService = async (updatedProfile: any) => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {


    const response = await fetch(`${API_BASE_URL}/profile/edit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(updatedProfile),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || words.profileUpdateFailed);
    }

    // Update the stored profile in AsyncStorage
    await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
    console.log(updatedProfile)
    console.log('Profile updated successfully.');
  } catch (error: any) {
    console.error('Edit profile error:', error.message);
    throw error;
  }
};


export const getProfileService = async (profileId?: number) => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const url = profileId ? `${API_BASE_URL}/profile/get/?profile_id=${profileId}` : `${API_BASE_URL}/profile/get/`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || words.profileFetchFailed);
    }

    return data.profile; // Возвращаем профиль
  } catch (error: any) {
    console.error('Get profile error:', error.message);
    throw error;
  }
};

