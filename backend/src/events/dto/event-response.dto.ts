import { UserResponseDto } from "src/auth/dto/user-response.dto";
import { EventVisibility } from "../types/events.types";
import { Type } from "class-transformer";

export class EventResponseDto {
  id: number;
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  capacity?: number;
  visibility: EventVisibility;

  @Type(() => UserResponseDto)
  organizer: UserResponseDto;

  @Type(() => UserResponseDto)
  participants: UserResponseDto[];
}