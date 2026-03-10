import type { FC, MouseEvent } from "react";
import { useNavigate } from "react-router";
import { type Event } from "./types";


import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { joinEvent, leaveEvent } from "./eventsThunks";

interface EventCardProps {
  event: Event;
}

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const isParticipant = event.participants.some(
    (p) => p.id === user?.id
  );

  const isFull =
    event.capacity !== null &&
    event.capacity !== undefined &&
    event.participants.length >= event.capacity;

  const handleJoin = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(joinEvent(event.id));
  };

  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(leaveEvent(event.id));
  };

  const openDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div
      onClick={openDetails}
      className="border rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer bg-white"
    >
      <h2 className="text-xl font-semibold">{event.title}</h2>

      {event.description && (
        <p className="text-gray-600 mt-2 line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="mt-3 text-sm text-gray-500">
        📅 {new Date(event.dateTime).toLocaleString()}
      </div>

      <div className="text-sm text-gray-500">
        📍 {event.location}
      </div>

      <div className="text-sm mt-2">
        👥 {event.participants.length}
        {event.capacity !== null && event.capacity !== undefined
          ? ` / ${event.capacity}`
          : " participants"}
      </div>

      <div className="mt-4 flex space-x-2">
        {!isParticipant && !isFull && (
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Join
          </button>
        )}

        {isParticipant && (
          <button
            onClick={handleLeave}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Leave
          </button>
        )}

        {isFull && (
          <div
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center justify-center"
          >
            Full
          </div>
        )}
      </div>
    </div>
  );
};