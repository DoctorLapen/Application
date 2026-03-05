
import { IsValidEmail } from 'src/common/validators/email.decorator';
import { IsValidPassword } from 'src/common/validators/password.decorator';

export class LoginDto {
  @IsValidEmail()
  email: string;

  @IsValidPassword()
  password: string;
}
