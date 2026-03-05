import * as yup from 'yup';
export const isValidPassword = (min = 8, max = 32) =>
  yup
    .string()
    .typeError('password must be a string') 
    .required('password is required')
    .min(min, `password must be at least ${min} characters long`)
    .max(max, `password must not exceed ${max} characters`)
    .matches(
      /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
      'password can contain only latin letters, numbers and special characters'
    );