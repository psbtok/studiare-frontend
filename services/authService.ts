import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { validateRegistrationInput, validateLoginInput } from '@/validators/validators';
import words from '@/locales/ru';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

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

    await AsyncStorage.removeItem('login-token');
    await AsyncStorage.removeItem('profile');
    await AsyncStorage.removeItem('subjects');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const editProfileService = async (updatedProfile: any, profilePicture: File | null) => {
  const token = await AsyncStorage.getItem('login-token');
  if (!token) {
    throw new Error(words.notAuthenticated);
  }
  const formData = new FormData();

  const flattenObject = (obj: any, parentKey = '', result: any = {}) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}[${key}]` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          flattenObject(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
    }
    return result;
  };

  const flattenedProfile = flattenObject(updatedProfile);

  for (const key in flattenedProfile) {
    if (flattenedProfile.hasOwnProperty(key)) {
      formData.append(key, flattenedProfile[key]);
    }
  }
  
  formData.delete("profile_picture");

  if (profilePicture) {
    formData.append('profile_picture', profilePicture);
  } 

  try {
    const response = await fetch(`${API_BASE_URL}/profile/edit/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || words.profileUpdateFailed);
    }

    await AsyncStorage.setItem('profile', JSON.stringify(data.profile));
  } catch (error: any) {
    console.error('Edit profile error:', error.message);
    throw error;
  }
};


export const getProfileService = async () => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const url = `${API_BASE_URL}/profile/get/`;
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
    
    await AsyncStorage.setItem('profile', JSON.stringify(data));

    return data;
  } catch (error: any) {
    console.error('Get profile error:', error.message);
    throw error;
  }
};

export const getUserIdByFullNameService = async (fullName: string) => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/by-full-name/?full_name=${fullName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || words.error);
    }

    if (data.length === 0) {
      throw new Error(words.userNotFound);
    }

    return data;
  } catch (error: any) {
    console.error('Get user ID by full name error:', error.message);
    throw error;
  }
};

