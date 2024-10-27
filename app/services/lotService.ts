import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config';
import { LotsResponse } from '../models';

export const getLotsService = async (page: number = 1): Promise<LotsResponse> => {
  try {
    const token = await AsyncStorage.getItem('login-token');

    const url = `${API_BASE_URL}/lots/?page=${page}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error; 
  }
};