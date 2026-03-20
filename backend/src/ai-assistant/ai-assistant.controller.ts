import { Controller, Post, Body, UseGuards, UseFilters } from '@nestjs/common';
import { AiAssistantService } from './ai-assistant.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';
import type { UserInfo } from 'src/auth/interfaces/auth.interfaces';
import { AskQuestionDto } from './dto/ask-question.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AIAssistantFilter } from './filters/ai-assistant-exceptions.filter';

@ApiTags('AI Assistant')
@Controller('assistant')
@UseFilters(AIAssistantFilter)
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('ask')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Ask a question to the AI assistant' })
  @ApiBody({ type: AskQuestionDto, description: 'Question to send to AI assistant' })
  @ApiResponse({ status: 200, description: 'AI response returned successfully' })
  async ask( @Body() body: AskQuestionDto,@CurrentUser() user: UserInfo,) {
    return this.aiAssistantService.ask(user.userId, body.question);
  }
}
