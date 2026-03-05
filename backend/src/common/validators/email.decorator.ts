import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export function IsValidEmail() {
  return applyDecorators(
    Transform(({ value }) => value.trim().toLowerCase()),
    IsNotEmpty({ message: 'Email is required' }),
    IsEmail({}, { message: 'Invalid email format' }),
  );
}