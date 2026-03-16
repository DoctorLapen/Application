import axios from "axios";
import api from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import type { EditEventRequest, EventResponse } from "./types";

export const createEvent = createAsyncThunk<
  EventResponse, 
  { title: string; description?: string; location: string; capacity?: number | null; visibility: "public" | "private";  dateTime: Date ,tags?:number[]},
  { state: RootState }
>(
  "events/createEvent",
  async (eventData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      if (!token) throw new Error("No auth token");

      const response = await api.post<EventResponse>(
        "/events",
        { ...eventData, dateTime: eventData.dateTime.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (err: unknown) {
      
      let message = "Failed to create event";
      if (err instanceof Error) {
        message = err.message;
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getEvents = createAsyncThunk<
  EventResponse[],
 { tags?: number[] } | undefined ,
  { rejectValue: string }
>(
  "events/getEvents",
  async (params, thunkAPI) => {
    try {
       let url = "/events";

      if (params?.tags?.length) {
        const query = params.tags.map(id => `tagIds=${id}`).join("&");
        url += `?${query}`;
      }

      const response = await api.get<EventResponse[]>(url);
      return response.data;
    } catch (err: unknown) {
      let message = "Failed to fetch events";

      if (err instanceof Error) {
        message = err.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getUserEvents = createAsyncThunk<
  EventResponse[],
  void,
  { state:RootState ,rejectValue: string }
>(
  "events/getUserEvents",
  async (_, thunkAPI) => {
    try {
      
       const token = thunkAPI.getState().auth.accessToken

     
      const response = await api.get<EventResponse[]>("/events/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err: unknown) {
      let message = "Failed to fetch events";

      if (err instanceof Error) {
        message = err.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getEventById = createAsyncThunk<
  EventResponse,
  number,
  { rejectValue: string }
>(
  "events/getEventById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get<EventResponse>(`/events/${id}`);
      return response.data;
    } catch (err: unknown) {
      let message = "Failed to fetch event";

      if (err instanceof Error) {
        message = err.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const joinEvent = createAsyncThunk<
  EventResponse,          
  number,  
  { state: RootState; rejectValue: string }
>(
  "events/joinEvent",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken
      if (!token) throw new Error("No auth token");

      const response = await api.post<EventResponse>(
        `/events/${id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (err: unknown) {
      let message = "Failed to join event";

      if (err instanceof Error) message = err.message;
      else if (axios.isAxiosError(err) && err.response?.data?.message)
        message = err.response.data.message;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const leaveEvent = createAsyncThunk<
  EventResponse,
  number,
  { state: RootState; rejectValue: string }
>(
  "events/leaveEvent",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      if (!token) throw new Error("No auth token");

      const response = await api.post<EventResponse>(
        `/events/${id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (err: unknown) {
      let message = "Failed to leave event";

      if (err instanceof Error) message = err.message;
      else if (axios.isAxiosError(err) && err.response?.data?.message)
        message = err.response.data.message;

      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const deleteEvent = createAsyncThunk<
  EventResponse,       
  number,              
  { state: RootState; rejectValue: string }
>(
  "events/deleteEvent",
  async (eventId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      if (!token) throw new Error("No auth token");

      const response = await api.delete<EventResponse>(`/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;  
    } catch (err: unknown) {
      let message = "Failed to delete event";

      if (err instanceof Error) message = err.message;
      else if (axios.isAxiosError(err) && err.response?.data?.message)
        message = err.response.data.message;

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateEvent = createAsyncThunk<
  EventResponse,
  { id: number; data: EditEventRequest},
  { state: RootState; rejectValue: string }
>(
  "events/updateEvent",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      if (!token) throw new Error("No auth token");

     
      const payload = { ...data } as any;
      if (payload.dateTime instanceof Date) {
        payload.dateTime = payload.dateTime.toISOString();
      }

      const response = await api.patch<EventResponse>(
        `/events/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (err: unknown) {
      let message = "Failed to update event";
      if (err instanceof Error) {
        message = err.message;
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);