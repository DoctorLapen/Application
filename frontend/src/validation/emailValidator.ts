import * as yup from 'yup';

export const isValidEmail = () =>
  yup
    .string()
    .transform((value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
    .required('email is required')
    .email('invalid email format');