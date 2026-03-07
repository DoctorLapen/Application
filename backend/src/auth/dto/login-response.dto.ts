import { UserDto } from "./user.dto";

export class LoginResponseDto {
  accessToken: string;
  user:UserDto;
}