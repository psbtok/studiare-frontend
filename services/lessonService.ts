import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import words from '@/locales/ru';
import { Lesson, LessonResponse, Profile } from '@/models/models';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

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
    if (!response.ok) {
      throw new Error(data.notes || words.lessonCreateFailed);
    }

    return data; 
  } catch (error: any) {
    console.error('Create lesson error:', error.message);
    throw error;
  }
};

export const getLessonListService = async (filters: Record<string, any> = {}, limit: string): Promise<LessonResponse> => {
  const token = await AsyncStorage.getItem('login-token');
  const profileString = await AsyncStorage.getItem('profile');
  const profile: Profile | null = profileString ? JSON.parse(profileString) : null;

  if (!token || !profile) {
    throw new Error(words.notAuthenticated);
  }

  const userId = profile.user?.id;

  if (userId) {
    filters.userId = userId;
  }

  try {
    const queryParams = new URLSearchParams({
      ...filters,
      ordering: filters.orderByDesc ? `-${filters.orderByDesc}` : filters.orderBy || 'date_start',
      limit: limit ?? ''
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


export const updateLessonStatusService = async (
  lesson: Lesson,
  action: 'cancel' | 'confirm' | 'conduct'
): Promise<Lesson> => {
  const token = await AsyncStorage.getItem('login-token');
  
  if (!token) throw new Error(words.notAuthenticated);

  let payload = {};
  switch (action) {
    case 'cancel':
      payload = { isCancelled: true, cancellationTime: new Date().toISOString(), action };
      break;
    case 'confirm':
      payload = { isConfirmed: true, confirmationTime: new Date().toISOString(), action };
      break;
    case 'conduct':
      payload = { isConducted: true, action };
      break;
    default:
      throw new Error(words.error);
  }

  const response = await fetch(`${API_BASE_URL}/lessons/${lesson.id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || words.error);
  }

  return await response.json();
};

export const modifyLessonService = async (updatedLesson: Lesson | any): Promise<Lesson> => {
  const token = await AsyncStorage.getItem('login-token');
  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${updatedLesson.id}/`, {
      method: 'PUT', // Используем PUT для полного обновления
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(updatedLesson), // Отправляем весь обновленный урок
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || words.error);
    }

    const data: Lesson = await response.json();
    return data;
  } catch (error: any) {
    console.error('Modify lesson error:', error.message);
    throw error;
  }
};
