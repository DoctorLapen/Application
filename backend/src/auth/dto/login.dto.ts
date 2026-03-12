
import { ApiProperty } from '@nestjs/swagger';
import { IsValidEmail } from 'src/common/validators/email.decorator';
import { IsValidPassword } from 'src/common/validators/password.decorator';

export class LoginDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsValidEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'strongPassword123' })
  @IsValidPassword()
  password: string;
}
