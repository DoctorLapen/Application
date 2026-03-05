import { createSlice } from "@reduxjs/toolkit"
import { loginUser, registerUser } from "./authThunks"
import type {  AuthState } from "./types"



const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  isAuth: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.accessToken = null
      state.isAuth = false;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
       
       
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuth = true;
        state.accessToken = action.payload.accessToken
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer