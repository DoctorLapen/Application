
import {  IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { EventVisibility } from '../types/events.types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export class EditEventDto {
  @ApiPropertyOptional({
    description: 'Title of the event',
    example: 'Tech Meetup Madrid',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Title must be a text string' })
  @IsNotEmpty({ message: 'Title cannot be empty or consist only of spaces' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the event',
    example: 'A meetup for developers to discuss new technologies.',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Description must be a text string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Date and time when the event will take place (ISO 8601 format)',
    example: '2026-04-15T18:30:00Z',
  })
  @IsOptional()
  @IsISO8601({}, { message: 'DateTime must be a valid date in ISO 8601 format' })
  dateTime?: string;

  @ApiPropertyOptional({
    description: 'Location where the event will be held',
    example: 'Madrid, Spain',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Location must be a text string' })
  @IsNotEmpty({ message: 'Location cannot be empty or consist only of spaces' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of participants allowed',
    example: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Capacity must be a number' })
  @Min(1, { message: 'Capacity must be at least 1 participant' })
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Visibility level of the event',
    enum: EventVisibility,
    example: EventVisibility.PUBLIC,
  })
  @IsOptional()
  @IsEnum(EventVisibility, { message: 'Visibility must be either PUBLIC or PRIVATE' })
  visibility?: EventVisibility;
}