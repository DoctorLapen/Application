import { redirect } from "react-router";
import { store } from "../store/store"; 
import type { RootState } from "../store/store";

export const requireAuth = ({ request }: { request: Request }): null | Response  => {
  const state: RootState = store.getState();
  const isAuth = state.auth.isAuth;

  if (!isAuth) {
    const currentPath = new URL(request.url).pathname;
    return redirect(`/login?from=${encodeURIComponent(currentPath)}`);
  }

  return null;
};