import * as yup from 'yup';
export const isValidName = (field: string) =>
  yup
    .string()
    .typeError(`${field} must be a string`) 
    .transform((value: unknown) => (typeof value === 'string' ? value.trim() : ''))
    .required(`${field} is required`);