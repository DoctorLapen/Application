
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";

export const selectEventById = (id: number | string) =>
  createSelector(
    (state: RootState) => state.events.events,
    (events) => events.find(e => e.id === Number(id)) || null
  );