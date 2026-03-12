
import { ApiProperty } from '@nestjs/swagger';
import { IsValidEmail } from 'src/common/validators/email.decorator';
import { IsValidName } from 'src/common/validators/name.decorator';
import { IsValidPassword } from 'src/common/validators/password.decorator';

export class RegisterDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsValidEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'strongPassword123' })
  @IsValidPassword()
  password: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsValidName('First name')
  firstName: string;
  
  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsValidName('Last name')
  lastName: string;
}
