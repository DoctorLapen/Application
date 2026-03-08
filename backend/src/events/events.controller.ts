import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete, Patch } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decorator';

import type { UserInfo } from 'src/auth/interfaces/auth.interfaces';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EditEventDto } from './dto/edit-event.dto';
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
  })
  async create(@Body() dto: CreateEventDto, @CurrentUser() user: UserInfo) {
    return this.eventsService.createEvent(dto, Number(user.userId));
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get public event by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the event',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully retrieved.',
  })
  async getEvent(@Param('id') id: number) {
    return this.eventsService.getEventById(id);
  }

  @ApiOperation({ summary: 'Get all public events' })
  @ApiResponse({
    status: 200,
    description: 'List of all public events successfully retrieved.',
  })
  @Get()
  async getAll() {
    return await this.eventsService.getAllEvents();
  }

  @ApiOperation({ summary: 'Get all events the current user is involved in (creator or participant)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'List of events successfully retrieved for the current user.',
  })
  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyEvents(@CurrentUser() user: UserInfo) {
    return this.eventsService.getUserEvents(user.userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Join an event' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the event to join',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined the event.',
  })
  async joinEvent(
    @Param('id') eventId: number,
    @CurrentUser() user: UserInfo,
  ) {
    return this.eventsService.joinEvent(eventId, user.userId);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Leave an event' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the event to leave',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully left the event',
  })
  async leaveEvent(
    @Param('id') eventId: number,
    @CurrentUser() user: UserInfo,
  ) {
    return this.eventsService.leaveEvent(eventId, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the event to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully deleted.',
  })
  async deleteEvent(
    @Param('id') eventId: number,
    @CurrentUser() user: UserInfo,
  ) {
    return this.eventsService.deleteEvent(eventId, user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit an event' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the event to edit',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Event successfully edited.',
  })
  async editEvent(
    @Param('id') eventId: number,
    @CurrentUser() user: UserInfo,
    @Body() dto: EditEventDto,
  ) {
    return this.eventsService.editEvent(eventId, user.userId, dto);
  }

}
