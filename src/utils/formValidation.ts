export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}

export const validateContactForm = (formData: FormData): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

