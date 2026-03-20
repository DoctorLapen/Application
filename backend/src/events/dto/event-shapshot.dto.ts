import { UserShapshotDto } from "./user-shapshot.dto";


export class EventSnapshotDto {
  id: number;
  title: string;
  dateTime: string;
  location:string;        
  organizer: UserShapshotDto;     
  participants: UserShapshotDto[]; 
  tags: string[];
  visibility: string;              
  capacity: number | null;
}