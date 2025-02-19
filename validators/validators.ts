import words from '@/locales/ru';
import { Student, Subject, User } from '@/models/models';

export const validateRegistrationInput = (
  email: string,
  password: string,
  confirmPassword: string
): string[] => {
  const errors: string[] = [];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.push(words.invalidEmail);
  }

  if (!password.trim()) {
    errors.push(words.passwordEmpty); 
  } else if (password.length < 8) {
    errors.push(words.passwordTooShort); 
  } else if (password != confirmPassword) {
    errors.push(words.passwordsDoNotMatch)
  }

  return errors;
};

export const validateLoginInput = (
  username: string,
  password: string
): string[] => {
  const errors: string[] = [];

  if (!username.trim()) {
    errors.push(words.usernameEmpty);
  }

  if (!password.trim()) {
    errors.push(words.passwordEmpty);
  }

  return errors;
};

export const validateCreateLessonInput = (
  subject: Subject | null,
  participants: User[],
  dateStart: Date,
  dateEnd: Date,
  price: number
): string[] => {
  const errors: string[] = [];
  if (!subject?.id) {
    errors.push(words.subjectEmpty);
  }
  
  if (!participants.length || !parseInt(participants[0].id)) {
    errors.push(words.studentIdEmpty);
  }

  if (dateStart >= dateEnd) {
    errors.push(words.invalidDateRange); 
  }
  
  if (price <= 0) {
    errors.push(words.invalidPrice); 
  }
  return errors;
};

export const validateCreateSubjectInput = (
  title: string,
  colorId: number,
): string[] => {
  const errors: string[] = [];

  if (!title.trim()) {
    errors.push(words.titleEmpty);
  }

  if (colorId < 1 || colorId > 9) {
    errors.push(words.invalidColorId);
  }

  return errors;
};