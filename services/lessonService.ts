import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config';
import words from '@/locales/ru';
import { Lesson, LessonResponse } from '@/models/models';

export const createLessonService = async (
  student: number,
  subject: string,
  date_start: string,
  date_end: string,
  price: number,
  notes?: string
): Promise<Lesson> => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lessons/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        student,
        subject,
        date_start,
        date_end,
        notes,
        price
      }),
    });

    const data: Lesson = await response.json();
    console.log(data)
    if (!response.ok) {
      throw new Error(data.notes || words.lessonCreateFailed);
    }

    return data; 
  } catch (error: any) {
    console.error('Create lesson error:', error.message);
    throw error;
  }
};

export const getLessonListService = async (filters: Record<string, any> = {}): Promise<LessonResponse> => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const queryParams = new URLSearchParams({
      ...filters,
      ordering: filters.orderByDesc ? `-${filters.orderByDesc}` : filters.orderBy || 'date_start', // Если нужна обратная сортировка
    }).toString();

    const response = await fetch(`${API_BASE_URL}/lessons/?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || words.error);
    }

    const data: LessonResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Fetch lessons error:', error.message);
    throw error;
  }
};