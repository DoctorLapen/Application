import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { getUserEvents } from "../features/events/eventsThunks";
import { useNavigate } from "react-router";
import EventItem from "../features/events/calendar/EventItem";
import CustomToolbar from "../features/events/calendar/CustomToolBar";


const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }), 
  getDay,
  locales,
});



const MyEventsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
 const {userEvents, loading } = useSelector((state: RootState) => state.events);
  const [view, setView] = useState<"month" | "week" | "day">("month");
 

  useEffect(() => {
    dispatch(getUserEvents());
  }, [dispatch]);

  const events = userEvents.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.dateTime,
    end: new Date(e.dateTime.getTime() + 60 * 60 * 1000),
  }));

  
  const [currentDate, setCurrentDate] = useState(new Date());

  if (loading) return <div>Loading...</div>;

  if (!userEvents || userEvents.length === 0) {
    return (
     <div className="flex flex-col items-center justify-center min-h-100 sm:min-h-150 h-full w-full text-center p-4">
  <p className="text-lg font-medium">
    You are not part of any events yet.
  </p>
  <p className="text-gray-600 mt-2">
    Explore public events and join.
  </p>
</div>
    );
  }
  return (
    <div className="flex-1  h-150">
      
      <div className="flex-1 h-full w-full bg-white rounded-xl shadow-sm min-h-150">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="h-full w-full"
          view={view}
          onView={(v) => setView(v as "month" | "week" | "day")}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          components={{
            toolbar: CustomToolbar,
            event: (props) => <EventItem {...props} view={view} />
          }}
          onSelectEvent={(event) => navigate(`/events/${event.id}`)}
          
        />
      </div>
    </div>
  )

}

export default MyEventsPage;