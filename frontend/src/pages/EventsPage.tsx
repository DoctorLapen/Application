import { useEffect, useState } from "react";


import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { getEvents } from "../features/events/eventsThunks";
import { EventCard } from "../features/events/EventCard";

import { availableTags } from "../features/events/constants";
import type { Tag } from "../features/events/types";

import TagMultiSelect from "../features/events/TagMultiSelect";
import AIAssistant from "../features/ai-assistant/AiAssistant";


export const EventsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { events, loading } = useSelector((state: RootState) => state.events);

  const [tempTags, setTempTags] = useState<Tag[]>([]);


    const { answer } = useSelector((state: RootState) => state.aiAssistant);

  

  useEffect(() => {
    if (answer ) {
      
      setTempTags([]);
    }
  }, [answer]);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const applyFilter = () => {
    const tags = tempTags.map(t => t.id);
    dispatch(getEvents({ tags }));
  };

  const clearFilter = () => {
    setTempTags([]);
    dispatch(getEvents());
  };
  return (
   <div className="max-w-6xl mx-auto p-6 flex-1 flex flex-col">
       
        <h1 className="text-3xl font-bold mb-6">Public Events</h1>

        <AIAssistant />
        
        <div className="max-w-3xl mb-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
            {/* SELECT */}
            <div className="w-full sm:flex-1">
              <TagMultiSelect
                availableTags={availableTags}
                selectedTags={tempTags}
                onChange={setTempTags}
                placeholder="Filter events by tags"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={applyFilter}
                className="flex-1 sm:flex-none px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Apply
              </button>

              <button
                onClick={clearFilter}
                className="flex-1 sm:flex-none px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        

       
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-center w-full">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center w-full text-gray-500">
              No events match the selected tags.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
  );
};