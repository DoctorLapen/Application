import * as yup from 'yup';
import { isValidEmail } from './emailValidator';
import { isValidPassword } from './passwordValidator';

export const loginValidator = yup.object({
  email: isValidEmail(),
  password: isValidPassword(),
});