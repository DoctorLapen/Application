import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export function IsValidEmail() {
  return applyDecorators(
    Transform(({ value }) => 
      (typeof value === 'string' ? value.trim().toLowerCase() : value)),
    IsNotEmpty({ message: 'Email is required' }),
    IsEmail({}, { message: 'Invalid email format' }),
  );
}