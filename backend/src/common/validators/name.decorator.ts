import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsValidName(field: string) {
  return applyDecorators(
    Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    IsNotEmpty({ message: `${field} is required` }),
    IsString({ message: `${field} must be a string` })
  );
}

