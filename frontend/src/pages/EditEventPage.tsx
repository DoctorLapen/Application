import EditEventForm from "../features/events/EditEventForm";

import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";

import { getEventById } from "../features/events/eventsThunks";
import type { Event, EventData } from "../features/events/types";
import { mapEventToEventData } from "../features/events/utils";
import Spinner from "../components/Spinner";

const EditEventPage = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const { events, loading } = useSelector((state: RootState) => state.events);

  const eventId = Number(id);

  const event: Event | undefined = events.find(e => e.id === eventId);
  const eventData: EventData | undefined = event
    ? mapEventToEventData(event)
    : undefined;


  useEffect(() => {
    if (!eventData && eventId) {
      dispatch(getEventById(eventId));
    }
  }, [dispatch, eventData, eventId]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center text-center w-full">
      <Spinner />
    </div>
  )

  if (!eventData) return <p>Event not found</p>;
  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8">

      <EditEventForm eventId={eventId} initialData={eventData} currentParticipantsCount={event.participants.length} />

    </div>
  );
};

export default EditEventPage;