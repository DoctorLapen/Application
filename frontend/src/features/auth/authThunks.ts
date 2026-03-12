import { createAsyncThunk } from "@reduxjs/toolkit"
import  api  from "../../api/axios"
import type { LoginRequest, RegisterRequest, AuthResponse } from "./types"
import axios from "axios"

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest
>(
  "auth/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", data)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("network error");
    }
  }
)

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest
>(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", data)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("network error");
    }
  }
)