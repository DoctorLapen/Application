import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import eventsReducer from "../features/events/eventsSlice"
import AiAssistantReducer from "../features/ai-assistant/aiAssistantSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    events:eventsReducer,
    aiAssistant:AiAssistantReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch