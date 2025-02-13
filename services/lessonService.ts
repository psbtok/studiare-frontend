import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import words from '@/locales/ru';
import { Subject, Lesson, LessonResponse, Profile, User } from '@/models/models';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL ?? '';

export const createLessonService = async (
  participants: User[],
  subject: number,
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
        subject,
        date_start,
        date_end,
        participants: participants.map(participant => participant.id),
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

export const getLessonListService = async (filters: Record<string, any> = {}, limit?: string): Promise<LessonResponse> => {
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
  action: 'cancel' | 'confirm' | 'conduct',
): Promise<Lesson> => {
  const token = await AsyncStorage.getItem('login-token');
  
  if (!token) throw new Error(words.notAuthenticated);

  const response = await fetch(`${API_BASE_URL}/lessons/${lesson.id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify({action}),
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

  updatedLesson.subject = updatedLesson.subject.id
  updatedLesson.participants = [updatedLesson.studentId]
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${updatedLesson.id}/`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(updatedLesson), 
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

export const getLessonService = async (lessonId: number): Promise<Lesson> => {
  const token = await AsyncStorage.getItem('login-token');
  
  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || words.error);
    }

    const data: Lesson = await response.json();
    return data;
  } catch (error: any) {
    console.error('Fetch lesson error:', error.message);
    throw error;
  }
};

export const getSubjectListService = async (): Promise<Subject[]> => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/subjects/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || words.error);
    }
    
    const data: {results: Subject[]} = await response.json();
    await AsyncStorage.setItem('subjects', JSON.stringify(data.results));
    return data.results;
  } catch (error: any) {
    console.error('Fetch subjects error:', error.message);
    throw error;
  }
};

export const createSubjectService = async (
  title: string,
  colorId: number,
  notes?: string,
): Promise<Subject> => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/subjects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        title,
        colorId,
        notes,
      }),
    });

    const data: Subject = await response.json();
    if (!response.ok) {
      throw new Error(data.notes || words.error);
    }

    return data;
  } catch (error: any) {
    console.error('Create subject error:', error.message);
    throw error;
  }
};

export const deleteSubjectService = async (subjectId: number): Promise<void> => {
  const token = await AsyncStorage.getItem('login-token');
  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || words.error);
    }
  } catch (error: any) {
    console.error('Delete subject error:', error.message);
    throw error;
  }
};

export const editSubjectService = async (
  id: number,
  title?: string | number,
  colorId?: number,
  notes?: string,
): Promise<Subject> => {
  const token = await AsyncStorage.getItem('login-token');

  if (!token) {
    throw new Error(words.notAuthenticated);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({
        title,
        colorId,
        notes,
      }),
    });

    const data: Subject = await response.json();
    if (!response.ok) {
      throw new Error(data.notes || words.error);
    }

    const storedSubjectsString = await AsyncStorage.getItem('subjects');
    if (storedSubjectsString) {
      const storedSubjects: Subject[] = JSON.parse(storedSubjectsString);
      const updatedSubjects = storedSubjects.map(subject => 
        subject.id === id ? { ...subject, ...data } : subject
      );
      
      await AsyncStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    }

    return data;
  } catch (error: any) {
    console.error('Edit subject error:', error.message);
    throw error;
  }
};
