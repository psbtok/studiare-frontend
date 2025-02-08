export interface Subject {
  id: number,
  title: string
  notes: string | null
  price: number | null
  colorId: number
  user: User
}

export interface Lesson {
  id: number;                
  tutor: Profile;             
  student: Profile;           
  subject: Subject;           
  date_start: string;              
  date_end: string;          
  notes?: string | null;    
  price: number 

  isConfirmed?: boolean | null;      
  confirmationTime?: string | null;  

  isCancelled?: boolean | null;      
  cancellationTime?: string | null;  

  isConducted?: boolean | null;      
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
}

export interface Profile {
  user: User;
  is_tutor: boolean;
  tutor?: Tutor | undefined; // Поле может быть необязательным, если пользователь не репетитор
}

export interface LessonResponse {
  count: number;
  next: string | null;       // URL для следующей страницы или null
  previous: string | null;   // URL для предыдущей страницы или null
  results: Lesson[];         // Список уроков
}