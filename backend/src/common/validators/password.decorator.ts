import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, MinLength, MaxLength, Matches, IsString } from 'class-validator';

export function IsValidPassword(min = 8, max = 32) {
  return applyDecorators(
    IsNotEmpty({ message: 'Password is required' }),
    IsString({ message: 'Password must be a string' }),
    MinLength(min, { message: `Password must be at least ${min} characters long` }),
    MaxLength(max, { message: `Password must not exceed ${max} characters` }),
    Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/, {
      message: 'Password can contain only Latin letters, numbers and special characters',
    }),
  );
}