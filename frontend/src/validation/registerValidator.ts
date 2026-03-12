import * as yup from 'yup';
import { isValidName } from './nameValidator';
import { isValidEmail } from './emailValidator';
import { isValidPassword } from './passwordValidator';
export const registerValidator = yup.object({
  firstName: isValidName('first name'),
  lastName: isValidName('last name'),
  email: isValidEmail(),
  password: isValidPassword(),
});