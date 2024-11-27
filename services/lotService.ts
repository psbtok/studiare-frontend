import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config';
import { CreateLotData, LotsResponse } from '../models';
import axios from 'axios';

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

export const createLotService = async (data: CreateLotData) => {
  const token = localStorage.getItem('login-token');
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('starting_price', data.starting_price.toString());
  formData.append('is_reserve', data.is_reserve.toString());
  if (data.is_reserve && data.reserve_price) {
    formData.append('reserve_price', data.reserve_price.toString());
  }
  formData.append('start_datetime', data.start_datetime);
  formData.append('end_datetime', data.end_datetime);

  if (data.image) {
    const response = await fetch(data.image.uri);
    const blob = await response.blob();
    formData.append('image', blob, data.image.fileName);
  }

  const response = await axios.post(`${API_BASE_URL}/lots/create/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Token ${token}`,
    },
  });

  return response.data;
};