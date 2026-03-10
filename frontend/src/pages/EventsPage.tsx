import { useEffect } from "react";


import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { getEvents } from "../features/events/eventsThunks";
import { EventCard } from "../features/events/EventCard";


export const EventsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { events, loading } = useSelector((state:RootState) => state.events);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center p-10">Loading events...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Public Events
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};