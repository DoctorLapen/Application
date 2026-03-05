import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsValidName(field: string, maxLength = 50) {
  return applyDecorators(
    Transform(({ value }) => value.trim()),
    IsNotEmpty({ message: `${field} is required` }),
    IsString({ message: `${field} must be a string` })
  );
}

