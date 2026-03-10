import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store/store";
import { deleteEvent, getEventById, joinEvent, leaveEvent } from "../features/events/eventsThunks";

import { selectEventById } from "../features/events/eventSelector";
import { ConfirmModal } from "../features/events/ConfirmModal";

const EventDetsPage = () => (
  <div className="flex justify-center items-center flex-1">
    EventDetailsPage
  </div>
);


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

  if (loading || !event) return <div>Loading...</div>;
  const participants = event.participants ?? [];

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
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border-2 border-blue-500 shadow-2xl rounded-2xl p-8">
        {/* Event Info */}
        <h1 className="text-2xl font-bold">{event.title}</h1>
        {event.description && (
          <p className="text-gray-600">{event.description}</p>
        )}
        <div className="space-y-2 text-sm text-gray-500">
          <p>📅 {new Date(event.dateTime).toLocaleString()}</p>
          <p>📍 {event.location}</p>
          👥 {event.participants?.length ?? 0}
          {event.capacity != null
            ? ` / ${event.capacity}`
            : " participants"}
        </div>

        {/* Participants */}
        {participants.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-xl mb-2 text-blue-600">Participants</h2>
            <div className="flex flex-wrap gap-2">
              {participants.map(user => (
                <div
                  key={user.id}
                  className="px-4 py-2 bg-blue-200 text-blue-900 rounded-full text-sm font-semibold shadow-md"
                >
                  {user.firstName}
                </div>
              ))}
            </div>
          </div>
        )}


        <div>
          {isParticipant ? (
            <button
              onClick={handleLeave}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isFull}
              className={`px-4 py-2 rounded text-white ${isFull
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
                }`}
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