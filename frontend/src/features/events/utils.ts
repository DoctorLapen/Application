
import { format, setHours, setMinutes } from "date-fns";
import type { EventResponse ,Event, EventData} from "./types";

export const mapEventResponseToEvent = (ev: EventResponse): Event => ({
  id: ev.id,
  title: ev.title,
  description: ev.description,
  dateTime: new Date(ev.dateTime),   
  location: ev.location,
  capacity: ev.capacity,
  visibility: ev.visibility,
  organizer: ev.organizer,       
  participants: ev.participants,
});

export const mapEventToEventData = (event: Event): EventData => ({
  title: event.title,
  description: event.description,
  location: event.location,
  capacity: event.capacity ?? null,
  visibility: event.visibility,
  dateTime: event.dateTime ? new Date(event.dateTime) : null,
});

export const formatTimeForInput = (date: Date | null) => (date ? format(date, "HH:mm") : "");


export const parseTimeFromInput = (timeStr: string) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  let d = new Date();
  d = setHours(d, hours);
  d = setMinutes(d, minutes);
  return d;
};


