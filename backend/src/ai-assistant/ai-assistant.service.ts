import { Injectable } from '@nestjs/common';

import { EventsService } from 'src/events/events.service';

import Groq from 'groq-sdk';
import { EventSnapshotDto } from 'src/events/dto/event-shapshot.dto';
import { ConfigService } from '@nestjs/config';
import { addDays, addMonths, addWeeks, endOfWeek, startOfWeek } from 'date-fns';
import { DateRange, DateRanges, LLMResponse } from './types/ai-assistant.types';
import { AnswerDto } from './dto/answer.dto';
import { LLMError } from './errors/errors';

@Injectable()
export class AiAssistantService {


  private groq: any;

  constructor(private readonly eventsService: EventsService, private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set in config');
    }

    this.groq = new Groq({ apiKey });
  }

  async ask(userId: number, question: string):Promise<AnswerDto> {
    

      const snapshot = await this.eventsService.getSnapshot();
    

      const now = new Date();

      const ranges = this.generateDateRanges(now);

      const prompt = this.buildPrompt(question, userId, now, ranges, snapshot);

      const responseLlm = await this.callLLM(prompt);
     
      const events = await this.eventsService.getEventsByIds(responseLlm.eventIds);
      return {
        answer: responseLlm.answer,
        events: events,
      };

  }

  private buildPrompt(question: string, userId: number, now: Date, ranges: DateRanges, snapshot: EventSnapshotDto[]): string {

    const prompt = `
You are a smart AI assistant that answers questions about events for user ${userId}.

Use ONLY the data provided below. Do NOT invent any events or IDs.

Current date: ${now.toISOString()}

Definitions:
- "This week" = ${ranges.thisWeek[0]} to ${ranges.thisWeek[1]}
- "Next week" = ${ranges.nextWeek[0]} to ${ranges.nextWeek[1]}
- "Last week" = ${ranges.lastWeek[0]} to ${ranges.lastWeek[1]}
- "This month" = ${ranges.thisMonth[0]} to ${ranges.thisMonth[1]}
- "Next month" = ${ranges.nextMonth[0]} to ${ranges.nextMonth[1]}
- "Past events" → before ${now.toISOString()}
- "Upcoming events" → after ${now.toISOString()}
- "This weekend" = ${ranges.thisWeekend[0]} to ${ranges.thisWeekend[1]}
- "Next weekend" = ${ranges.nextWeekend[0]} to ${ranges.nextWeekend[1]}
- "Past weekend" = ${ranges.pastWeekend[0]} to ${ranges.pastWeekend[1]}


Events:
${JSON.stringify(snapshot)}

Rules:

Filtering logic:
- Apply filters in this order:
  1. "my events" → events where user ${userId} is organizer OR participant
  2. "my organized events" → organizerId equals ${userId}
  3. tag filters → match tags exactly (case-insensitive)
  4. time filters (this week, next week, etc.)
  5. "next event" → select the event with the earliest dateTime after ${now}
  6. popularity sorting (if requested)

Tags:
- If the question mentions a tag, include only events where "tags" contains that exact tag (case-insensitive)
- Do NOT match tags using the event title

Next event:
- "Next event" means the event with the earliest dateTime after ${now}
- If combined with "my", first filter "my events", then select the next event

Popularity:
- If the question refers to "popular", "top", or "most popular" events, sort events by the number of participants in descending order
- Popularity is determined ONLY by the number of participants

General rules:
- If no filters are mentioned, consider all events
- Use ONLY event IDs from the provided data
- Do NOT invent IDs
- If no events match, return an empty array []
- "eventIds" must always be an array of numbers
- If one event matches, return [eventId]
- Never return a single number instead of an array

Answer style:
- The "answer" must be a short, natural-sounding, complete sentence (1–2 sentences max)
- Always include event titles when referring to events
- Do not refer to events without mentioning their titles
- If multiple events match, list their titles in a natural way (e.g., "Event A, Event B, and Event C")
- Format dates like: "March 26, 2026 at 09:00 UTC"
- Do not include unnecessary details

Output format:

You must return a valid JSON object with this exact structure:

{
  "answer": string,
  "eventIds": number[]
}

Do NOT include any text outside the JSON.

Fallback:

If the question cannot be answered, return:

{
  "answer": "Sorry, I didn’t understand that. Please try rephrasing your question.",
  "eventIds": []
}

User question:
"${question}"
`;
   

    return prompt;
  }

  private async callLLM(prompt: string): Promise<LLMResponse> {
      const response = await this.groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 1,
        top_p: 1,
        max_completion_tokens: 8000,

        stream: false,
        reasoning_effort: "medium",
        stop: null


      });


      const text = response.choices?.[0]?.message?.content ?? '';
      
      const parsed = JSON.parse(text);


      if (
        typeof parsed.answer === 'string' &&
        Array.isArray(parsed.eventIds)
      ) {
        return parsed as LLMResponse;
      }

    throw new LLMError('Invalid LLM response format');
    
  }

  private generateDateRanges(now: Date): DateRanges {
    return {
      thisWeek: this.getWeekRange(now, 0),
      nextWeek: this.getWeekRange(now, 1),
      lastWeek: this.getWeekRange(now, -1),
      thisMonth: this.getMonthRange(now, 0),
      nextMonth: this.getMonthRange(now, 1),
      thisWeekend: this.getWeekendRange(now, 0),
      nextWeekend: this.getWeekendRange(now, 1),
      pastWeekend: this.getWeekendRange(now, -1),
    };
  }

  private getWeekRange(now: Date, offset: number): DateRange {
    const start = addWeeks(startOfWeek(now, { weekStartsOn: 1 }), offset);
    const end = endOfWeek(start, { weekStartsOn: 1 });

    return [this.startUTC(start), this.endUTC(end)];
  }

  private getMonthRange(now: Date, offset: number): DateRange {
    const date = addMonths(now, offset);

    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));

    return [this.startUTC(start), this.endUTC(end)];
  }

  private getWeekendRange(now: Date, offset: number): DateRange {
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const target = addWeeks(weekStart, offset);

    const saturday = addDays(target, 5);
    const sunday = addDays(saturday, 1);

    return [this.startUTC(saturday), this.endUTC(sunday)];
  }

  private startUTC(date: Date) {
    return new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0, 0, 0, 0
    )).toISOString();
  }

  private endUTC(date: Date) {
    return new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23, 59, 59, 999
    )).toISOString();
  }




}
