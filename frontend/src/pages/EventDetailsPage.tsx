import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store/store";
import { deleteEvent, getEventById, joinEvent, leaveEvent } from "../features/events/eventsThunks";

import { selectEventById } from "../features/events/eventSelector";
import { ConfirmModal } from "../features/events/ConfirmModal";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";


export const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const event = useSelector(selectEventById(id!));
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.events.loading);

  useEffect(() => {
    if (!id) return;



    dispatch(getEventById(Number(id)));


  }, [dispatch, id]);
  const [showAllParticipants, setShowAllParticipants] = useState(false);




  if (loading || !event) return <div>Loading...</div>;
  const participants = event.participants ?? [];
  
  const visibleParticipants = showAllParticipants
  ? participants
  : participants.slice(0, 5);

  const isParticipant = participants.some(
    (p) => p.id === currentUser?.id
  );

  const isOrganizer = event?.organizer.id === currentUser?.id;

  const isFull =
    event.capacity !== null &&
    event.capacity !== undefined &&
    participants.length >= event.capacity;

  const handleJoin = () => {
    if (id) {
      dispatch(joinEvent(Number(id)));
    }
  };

  const handleLeave = () => {
    if (id) {
      dispatch(leaveEvent(Number(id)));
    }
  };

  const handleDelete = () => {
    if (id) {
      dispatch(deleteEvent(Number(id)));
      navigate("/");
    }
  };

  return (
    <>
      <div className="min-h-100 flex flex-col  max-w-3xl mx-auto p-6">
        <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-8 hover:shadow-xl hover:bg-gray-50 transition">
          {/* Event Info */}
          <h1 className="text-2xl font-bold">{event.title}</h1>

          {event.description && (
            <p className="text-gray-700 mt-2 line-clamp-3">
              {event.description}
            </p>
          )}

          <div className="space-y-2 text-sm text-gray-500 mt-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(event.dateTime, "dd.MM.yyyy HH:mm")}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {event.location}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {event.participants?.length ?? 0}
              {event.capacity != null ? ` / ${event.capacity}` : " participants"}
            </div>
          </div>

          {participants.length > 0 && (
            <div className="mb-6 mt-4">
              <h2 className="font-bold text-xl mb-2 text-gray-800">
                Participants
              </h2>

              <div className="flex flex-wrap gap-2">
                {visibleParticipants.map((user) => (
                  <div
                    key={user.id}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {user.firstName} {user.lastName}
                  </div>
                ))}
              </div>

              {participants.length > 5 && (
                <button
                  onClick={() => setShowAllParticipants(!showAllParticipants)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showAllParticipants ? "Show less" : `Show all (${participants.length})`}
                </button>
              )}
            </div>
          )}

          {/* Join / Leave Buttons */}
          <div className="mt-4 flex gap-3">
            {isParticipant ? (
              <button
                onClick={handleLeave}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Leave
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isFull}
                className={`px-4 py-2 rounded ${isFull
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                  } transition`}
              >
                Join
              </button>
            )}
          </div>

          {/* Organizer Actions */}
          {isOrganizer && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => navigate(`/events/edit/${event.id}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => setConfirmDelete(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={confirmDelete}
        message="Are you sure you want to delete this event?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};



export default EventDetailsPage;