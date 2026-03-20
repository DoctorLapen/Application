import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RateLimitError, APIError } from 'groq-sdk';
import ClientError from  'groq-sdk';
import ValidationError from 'groq-sdk'
import { LLMError } from '../errors/errors';


@Catch(RateLimitError, APIError, ClientError, ValidationError, LLMError)
export class AIAssistantFilter implements ExceptionFilter {
  catch(exception: RateLimitError | APIError | ClientError | ValidationError | LLMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('AI Assistant exception caught:', exception);

    if (exception instanceof RateLimitError) {
      return response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        answer: "LLM rate limit exceeded — too many requests. Please try again later.",
        events: [],
      });
    }

    
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      answer: "Sorry, I didn’t understand that. Please try rephrasing your question.",
      events: [],
    });
  }
}