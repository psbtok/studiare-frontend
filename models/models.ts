export interface Subject {
  id: number,
  title: string
  notes: string | null
  colorId: number
  user: User
}

export interface lessonParticipant {
  profile: Profile,
  status: 'cancelled' | 'conducted' | 'confirmed' | 'awaiting_confirmation',
  updated_at: string
}

export interface Lesson {
  id: number;                
  tutor: Profile;             
  participants: lessonParticipant[];           
  subject: Subject;           
  date_start: string;              
  date_end: string;          
  notes?: string | null;    
  price: number 
}

export interface Student {
  id: string, 
  first_name: string, 
  last_name: string
}
  
export interface User {
  id: string,
  email: string;
  first_name: string;
  last_name: string;
}
  
export interface Tutor {
  id: number;
  about: string;
  birth_date: string; // Формат ISO 8601, например, "YYYY-MM-DD"
  education: string;
  links: string; // Ссылки в виде строки, разделённой запятыми
  age: number;
  paymentMethod: string;
}

export interface Profile {
  user: User;
  is_tutor: boolean;
  profile_picture: string | null;
  tutor?: Tutor | undefined; // Поле может быть необязательным, если пользователь не репетитор
}

export interface LessonResponse {
  count: number;
  next: string | null;       // URL для следующей страницы или null
  previous: string | null;   // URL для предыдущей страницы или null
  results: Lesson[];         // Список уроков
}