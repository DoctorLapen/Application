import type { EventResponse } from "../events/types";

export interface AIState {
  answer: string;
  loading: boolean;
  error: string | null;
}

export interface AnswerResponse{
  answer: string;
  events: EventResponse[];
}