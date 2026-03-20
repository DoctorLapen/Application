import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "../../store/store";
import { setEventsFromServer } from "../events/eventsSlice";
import api from "../../api/axios";
import type { AIState, AnswerResponse } from "./types";




export const askQuestion = createAsyncThunk<
  string, 
  string,
  { dispatch: AppDispatch;state: RootState;rejectValue: string }
>(
  "aiAssistant/askQuestion",
  async (question, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      if (!token) throw new Error("No auth token");

      const response = await api.post<AnswerResponse>(
        "/assistant/ask",
        {question:question},
        { headers: { Authorization: `Bearer ${token}` } }
      );

       const { answer, events } = response.data;

      if (events?.length) {
        thunkAPI.dispatch( setEventsFromServer(events));
      }
      return answer;

    } catch (err: unknown) {
      
      let message = "Failed to ask Assistant";
      if (err instanceof Error) {
        message = err.message;
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);



const initialState: AIState = {
  answer: "",
  loading: false,
  error: null,
};

const aiAssistantSlice = createSlice({
  name: "aiAssistant",
  initialState,
  reducers: {
    clearAnswer(state) {
      state.answer = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askQuestion.pending, (state) => {
        state.loading = true;
        state.answer = "";
        state.error = null;
      })
      .addCase(askQuestion.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.answer = action.payload; 
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearAnswer } = aiAssistantSlice.actions;
export default aiAssistantSlice.reducer;