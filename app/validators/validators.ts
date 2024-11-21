import words from '@/locales/ru';

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