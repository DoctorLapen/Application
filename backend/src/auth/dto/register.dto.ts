
import { IsValidEmail } from 'src/common/validators/email.decorator';
import { IsValidName } from 'src/common/validators/name.decorator';
import { IsValidPassword } from 'src/common/validators/password.decorator';

export class RegisterDto {
  @IsValidEmail()
  email: string;

  @IsValidPassword()
  password: string;

  @IsValidName('First name')
  firstName: string;
  
  @IsValidName('Last name')
  lastName: string;
}
