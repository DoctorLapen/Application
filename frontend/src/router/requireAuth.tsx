import { redirect } from "react-router";
import { store } from "../store/store"; 
import type { RootState } from "../store/store";

export const requireAuth = (): null => {
  const state: RootState = store.getState();
  const isAuth = state.auth.isAuth; 

  if (!isAuth) {
    throw redirect("/login");
  }

  return null;
};