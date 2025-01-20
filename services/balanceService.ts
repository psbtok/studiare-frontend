// balanceService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config';

export const getBalanceService = async () => {
  const token = await AsyncStorage.getItem('login-token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/balance/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get balance');
    }

    return data.balance;
  } catch (error: any) {
    console.error('Get balance error:', error.message);
    throw error;
  }
};

export const topUpService = async (amount: number) => {
  const token = await AsyncStorage.getItem('login-token');
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/topup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        amount: amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to top up balance');
    }

    return data; // Assuming the response contains some data, e.g., new balance
  } catch (error: any) {
    console.error('Top-up error:', error.message);
    throw error;
  }
};