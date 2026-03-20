import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AskQuestionDto {
  @ApiProperty({
    description: 'The question to ask the AI assistant',
    example: 'What events am I attending this week?',
  })
  @IsString()
  @IsNotEmpty({ message: 'Question must not be empty' })
  @MaxLength(400, { message: `question must not exceed 400 characters` })
  question: string;
}