import type { FC, MouseEvent } from "react";
import { useNavigate } from "react-router";
import { type Event } from "./types";


import type { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { joinEvent, leaveEvent } from "./eventsThunks";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {user,isAuth}= useSelector((state: RootState) => state.auth);

  const isParticipant = event.participants.some(
    (p) => p.id === user?.id
  );

  const isFull =
    event.capacity !== null &&
    event.capacity !== undefined &&
    event.participants.length >= event.capacity;

  const handleJoin = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if(isAuth){
    dispatch(joinEvent(event.id));
    }else{
      navigate("/login");
    }
  };

  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
     if(isAuth){
    dispatch(leaveEvent(event.id));
    }else{
      navigate("/login");
    }
  };

  const openDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
  <div
    onClick={openDetails}
    className="border border-gray-300 rounded-xl p-5 shadow hover:shadow-lg hover:bg-gray-50 transition cursor-pointer bg-white"
  >
    <h2 className="text-xl font-semibold">{event.title}</h2>

    {event.description && (
      <p className="text-gray-600 mt-2 line-clamp-2">
        {event.description}
      </p>
    )}

    <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
      <Calendar className="w-4 h-4" /> 
       {format(event.dateTime, "dd.MM.yyyy HH:mm")}
    </div>

    <div className="text-sm text-gray-500 flex items-center gap-1">
      <MapPin className="w-4 h-4" /> {event.location}
    </div>

    <div className="text-sm mt-2 flex items-center gap-1">
      <Users className="w-4 h-4" /> {event.participants.length}
      {event.capacity !== null && event.capacity !== undefined
        ? ` / ${event.capacity}`
        : " participants"}
    </div>

    <div className="mt-4 flex space-x-2">
      {!isParticipant && !isFull && (
        <button
          onClick={handleJoin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Join
        </button>
      )}

      {isParticipant && (
        <button
          onClick={ handleLeave }
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Leave
        </button>
      )}

      {isFull && (
        <div className="bg-purple-600 text-white px-4 py-2 rounded flex items-center justify-center">
          Full
        </div>
      )}
    </div>
  </div>
);
};