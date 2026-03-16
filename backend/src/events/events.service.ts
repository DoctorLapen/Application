import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from 'src/auth/entities/user.entity';
import { Event } from './entities/event.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventVisibility } from './types/events.types';
import { EditEventDto } from './dto/edit-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { plainToInstance } from 'class-transformer';
import { DeleteEventResponseDto } from './dto/delete-event-response.dto';
import { Tag } from './entities/tag.entity';
import { TagDto } from './dto/tag.dto';


@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,

  ) { }

  async createEvent(dto: CreateEventDto, userId: number): Promise<EventResponseDto> {

    const eventDateUTC = this.convertDateToUTC(dto.dateTime);
    this.validateEventDate(eventDateUTC);

    let tags: Tag[] = [];
    if (dto.tags && dto.tags.length > 0) {
      tags = await this.tagsRepository.findBy({ id: In(dto.tags) });
      if (tags.length !== dto.tags.length) {
        throw new BadRequestException('Some tags not found in database');
      }
      if (tags.length > 5) {
        throw new BadRequestException('Maximum 5 tags allowed per event');
      }
    }
    const event = this.eventsRepository.create({
      ...dto,
      dateTime: eventDateUTC,
      organizer: { id: userId } as User,
      tags,
    });
    const savedEvent = await this.eventsRepository.save(event);

    const fullEvent = await this.eventsRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['organizer', 'participants', 'tags'],
    });

    return plainToInstance(EventResponseDto, fullEvent);
  }

  async getEventById(id: number): Promise<EventResponseDto> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'participants','tags']
    });

    if (!event) throw new NotFoundException('event not found');

    if (event.visibility !== EventVisibility.PUBLIC) {
      throw new ForbiddenException('event is not public');
    }

    return plainToInstance(EventResponseDto, event);
  }

  async getAllEvents(tagIds?: number[]): Promise<EventResponseDto[]> {
    const query = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('event.participants', 'participants')
      .leftJoinAndSelect('event.tags', 'tag')
      .where('event.visibility = :visibility', { visibility: EventVisibility.PUBLIC })
      .orderBy('event.dateTime', 'ASC');

    
    if (tagIds && tagIds.length > 0) {
      query.andWhere('tag.id IN (:...tagIds)', { tagIds });
    }

    const events = await query.getMany();

    if (!events.length && tagIds && tagIds.length > 0) {
      throw new NotFoundException('No events match the selected tags');
    }
    return plainToInstance(EventResponseDto, events);
  }

  async getUserEvents(userId: number): Promise<EventResponseDto[]> {
    const events = [
      ...new Map(
        await this.eventsRepository.find({
          where: [
            { organizer: { id: userId } },
            { participants: { id: userId } },
          ],
          relations: ['organizer', 'participants','tags'],
          order: { dateTime: 'ASC' },
        }).then(events => events.map(e => [e.id, e]))
      ).values()
    ];
    return plainToInstance(EventResponseDto, events);
  }

  async joinEvent(eventId: number, userId: number): Promise<EventResponseDto> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['participants'],
    });

    if (!event) throw new NotFoundException('event not found');


    if (event.participants.some(p => p.id === userId)) {
      throw new BadRequestException('already joined');
    }

    if (event.capacity && event.participants.length >= event.capacity) {
      throw new BadRequestException('event is full');
    }


    event.participants.push({ id: userId } as User);

    const savedEvent = await this.eventsRepository.save(event);

    const fullEvent = await this.eventsRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['organizer', 'participants','tags'],
    });

    return plainToInstance(EventResponseDto, fullEvent);
  }

  async leaveEvent(eventId: number, userId: number): Promise<EventResponseDto> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['participants'],
    });

    if (!event) throw new NotFoundException('event not found');


    const participantIndex = event.participants.findIndex(p => p.id === userId);
    if (participantIndex === -1) {
      throw new BadRequestException('you are not a participant of this event');
    }


    event.participants.splice(participantIndex, 1);

    const savedEvent = await this.eventsRepository.save(event);

    const fullEvent = await this.eventsRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['organizer', 'participants','tags'],
    });

    return plainToInstance(EventResponseDto, fullEvent);
  }

  async deleteEvent(eventId: number, userId: number): Promise<DeleteEventResponseDto> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['organizer'],
    });
    if (!event) throw new NotFoundException('event not found');
    if (event.organizer.id !== userId) {
      throw new BadRequestException('only the organizer can delete this event');
    }
    await this.eventsRepository.remove(event);
    return { eventId: eventId };
  }

  async editEvent(eventId: number, userId: number, dto: EditEventDto): Promise<EventResponseDto> {
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
      relations: ['organizer', 'participants'],
    });
    if (!event) throw new NotFoundException('event not found');
    if (event.organizer.id !== userId)
      throw new BadRequestException('only the organizer can edit this event');

    const eventDateUTC = dto.dateTime ? this.convertDateToUTC(dto.dateTime) : undefined;
    if (eventDateUTC) this.validateEventDate(eventDateUTC);



    if (dto.capacity !== undefined) {
      if (dto.capacity < event.participants.length) {
        throw new BadRequestException(
          `capacity cannot be less than the current number of participants (${event.participants.length})`,
        );
      }
      event.capacity = dto.capacity;
    }

    if (dto.title !== undefined) event.title = dto.title;
    if (dto.description !== undefined) event.description = dto.description;
    if (eventDateUTC) event.dateTime = eventDateUTC;
    if (dto.location !== undefined) event.location = dto.location;
    if (dto.visibility !== undefined) event.visibility = dto.visibility;
    if (dto.tags !== undefined) {

    if (dto.tags.length > 5) {
      throw new BadRequestException('Maximum 5 tags allowed');
    }

    const tags = await this.tagsRepository.findBy({
      id: In(dto.tags),
    });

    if (tags.length !== dto.tags.length) {
      throw new BadRequestException('Some tags not found');
    }

    event.tags = tags;
  }


    const savedEvent = await this.eventsRepository.save(event);


    const fullEvent = await this.eventsRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['organizer', 'participants','tags'],
    });

    return plainToInstance(EventResponseDto, fullEvent);
  }

  async getAllTags(): Promise<TagDto[]> {
  const tags = await this.tagsRepository.find({
    order: { name: 'ASC' },
  });

  return plainToInstance(TagDto, tags);
}

  private convertDateToUTC(dateTime: string): Date {
    return new Date(new Date(dateTime).toISOString());
  }


  private validateEventDate(eventDateUTC: Date) {
    const nowUTC = new Date(new Date().toISOString());
    const tomorrowUTC = new Date(
      Date.UTC(
        nowUTC.getUTCFullYear(),
        nowUTC.getUTCMonth(),
        nowUTC.getUTCDate() + 1,
        0, 0, 0, 0,
      ),
    );

    if (eventDateUTC < tomorrowUTC) {
      throw new BadRequestException(
        'Event must start no earlier than the next day (UTC)',
      );
    }
  }
}
