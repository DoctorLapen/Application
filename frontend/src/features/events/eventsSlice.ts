// store/eventsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { EventResponse, EventsState } from "./types";
import { createEvent, deleteEvent, getEventById, getEvents, getUserEvents, joinEvent, leaveEvent, updateEvent } from "./eventsThunks";

import { mapEventResponseToEvent } from "./utils";


const initialState: EventsState = {
  events: [],
  userEvents:[],
  loading: false,
  error: null,
};



// Slice
const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;

        const event = mapEventResponseToEvent(action.payload);
        state.events.push(event);
      })
      .addCase(createEvent.rejected, (state) => {
        state.loading = false;

      })
      // GET EVENTS
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;

        state.events = action.payload.map(mapEventResponseToEvent);
      })

      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(getUserEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.loading = false;

        state.userEvents = action.payload.map(mapEventResponseToEvent);
      })

      .addCase(getUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;

        const event = mapEventResponseToEvent(action.payload);

        const index = state.events.findIndex(e => e.id === event.id);

        if (index >= 0) {
          state.events[index] = event;
        } else {
          state.events.push(event);
        }

      })

      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(joinEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action: PayloadAction<EventResponse>) => {
        state.loading = false;

        const updatedEvent = mapEventResponseToEvent(action.payload);

        const index = state.events.findIndex(e => e.id === updatedEvent.id);
        if (index >= 0) {
          state.events[index] = updatedEvent;
        } else {
          state.events.push(updatedEvent);
        }
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })


      // LEAVE EVENT
      .addCase(leaveEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveEvent.fulfilled, (state, action: PayloadAction<EventResponse>) => {
        state.loading = false;

        const updatedEvent = mapEventResponseToEvent(action.payload);

        const index = state.events.findIndex(e => e.id === updatedEvent.id);
        if (index >= 0) {
          state.events[index] = updatedEvent;
        } else {
          state.events.push(updatedEvent);
        }
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<EventResponse>) => {
        state.loading = false;

        const deletedEvent = mapEventResponseToEvent(action.payload);

        state.events = state.events.filter(e => e.id !== deletedEvent.id);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;

        const updatedEvent = mapEventResponseToEvent(action.payload);

        const index = state.events.findIndex(e => e.id === updatedEvent.id);
        if (index >= 0) {
          state.events[index] = updatedEvent; 
        } else {
          state.events.push(updatedEvent);
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update event";
      });

  },
});

export default eventsSlice.reducer;