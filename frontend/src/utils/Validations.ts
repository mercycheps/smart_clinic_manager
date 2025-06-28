
export const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasNumber && hasSpecialChar,
      errors: {
        minLength: !minLength ? 'Password must be at least 8 characters' : '',
        hasNumber: !hasNumber ? 'Password must include at least one number' : '',
        hasSpecialChar: !hasSpecialChar ? 'Password must include at least one special character' : ''
      }
    };
  };
  
  export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };