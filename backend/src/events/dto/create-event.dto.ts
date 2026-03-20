import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsISO8601, Min, IsInt, IsArray, ArrayMaxSize } from 'class-validator';
import { EventVisibility } from '../types/events.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';



export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event',
    example: 'Tech Meetup Madrid',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Title must be a text string' })
  @IsNotEmpty({ message: 'Title cannot be empty or consist only of spaces' })
  title: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the event',
    example: 'A meetup for developers to discuss new technologies.',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Description must be a text string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Date and time when the event will take place (ISO 8601 format)',
    example: '2026-04-15T18:30:00Z',
  })
  @IsISO8601({}, { message: 'DateTime must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'DateTime is required' })
  dateTime: string;

  @ApiProperty({
    description: 'Location where the event will be held',
    example: 'Madrid, Spain',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'Location must be a text string' })
  @IsNotEmpty({ message: 'Location cannot be empty or consist only of spaces' })
  location: string;

  @ApiPropertyOptional({
    description: 'Maximum number of participants allowed',
    example: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Capacity must be a number' })
  @Min(1, { message: 'Capacity must be at least 1 participant' })
  capacity?: number;

  @ApiPropertyOptional({
    description: 'List of tag IDs assigned to the event',
    example: [1, 2, 3],
    type: Number,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'Maximum 5 tags allowed per event' })
  @IsInt({ each: true, message: 'Each tag ID must be a number' })
  tags?: number[];


  @ApiProperty({
    description: 'Visibility level of the event',
    enum: EventVisibility,
    example: EventVisibility.PUBLIC,
  })
  @IsEnum(EventVisibility, { message: 'Visibility must be either PUBLIC or PRIVATE' })
  visibility: EventVisibility;
}