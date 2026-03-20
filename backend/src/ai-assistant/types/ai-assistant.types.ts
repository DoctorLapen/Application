export type DateRange = [string, string];

export type DateRanges = {
  thisWeek: DateRange;
  nextWeek: DateRange;
  lastWeek: DateRange;
  thisMonth: DateRange;
  nextMonth: DateRange;
  thisWeekend: DateRange;
  nextWeekend: DateRange;
  pastWeekend: DateRange;
};

export type LLMResponse = {
  answer: string;
  eventIds: number[];
};

