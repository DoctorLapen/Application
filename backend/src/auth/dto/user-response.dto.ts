import { Exclude } from "class-transformer";

 export class UserResponseDto {
  id: number;

  firstName: string;

  lastName: string;

  @Exclude()
  password: string;

  email: string;
}