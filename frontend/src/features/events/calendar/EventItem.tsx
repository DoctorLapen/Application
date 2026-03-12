import { format } from "date-fns";
import { useIsMobile } from "../../../hooks/useMobileHook";

type Props = {
  event: any;
  view: "month" | "week" | "day";
};

const EventItem = ({ event, view }: Props) => {
  const isMobile = useIsMobile();
  const start = format(event.start, "HH:mm");

  if (view === "month") {
    return (
      <div
        className={`text-xs leading-tight truncate flex ${
          isMobile ? "flex-col gap-0.5" : "flex-row gap-1"
        }`}
        style={{ whiteSpace: "normal" }} 
      >
        {isMobile ? (
          <>
            <span className="font-medium truncate">{event.title}</span>
            <span className="truncate">{start}</span>
          </>
        ) : (
          <>
            <span>{start}</span>
            <span className="font-medium truncate">{event.title}</span>
          </>
        )}
      </div>
    );
  }

  
  return <div className="text-xs truncate">{event.title}</div>;
};

export default EventItem;