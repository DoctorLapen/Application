import type { User } from "../auth/types";



export interface Tag {
  id: number;
  name: string;
}

export type EventData = {
    title: string;
    description: string | undefined;
    location: string;
    capacity: number | null | undefined;
    visibility: "public" | "private";
    dateTime: Date | null| undefined;
    tags:Tag[]; 
};

export interface Event {
    id: number;
    title: string;
    description?: string;
    location: string;
    capacity?: number | null;
    visibility: "public" | "private";
    dateTime: Date;
    tags:Tag[]; 
    organizer: User;
    participants: User[];
}

export interface EventResponse {
    id: number;
    title: string;
    description?: string;
    dateTime: string;  // ISO string
    location: string;
    capacity?: number;
    visibility: "public" | "private";
    tags:Tag[]; 
    organizer: User;
    participants: User[];
}


export interface EventsState {
    events: Event[];
    userEvents: Event[];
    loading: boolean;
    error: string | null;
}

export type EditEventRequest = Partial<{
  title: string;
  description: string;
  location: string;
  capacity: number | null;
  visibility: "public" | "private";
  dateTime: Date;
  tags:number[]
}>;