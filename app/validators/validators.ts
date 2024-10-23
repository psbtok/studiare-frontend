export const validateRegistrationInput = (
    username: string,
    email: string,
    password: string
  ): string[] => {
    const errors: string[] = [];
  
    if (!username.trim()) {
      errors.push("Username cannot be empty.");
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.push("Enter a valid email address.");
    }
  
    if (!password.trim()) {
      errors.push("Password cannot be empty.");
    }
  
    return errors;
  };