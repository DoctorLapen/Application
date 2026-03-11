import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ToolbarProps, View } from "react-big-calendar";
type MyEvent = { id: number; title: string; start: Date; end: Date };

const CustomToolbar= (props: ToolbarProps<MyEvent, object>) => {
    const { label, onNavigate, onView, view } = props;
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2 overflow-x-auto">
     
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded border hover:bg-gray-100"
          onClick={() => onNavigate("PREV")}
        >
          <ChevronLeft size={20} />
        </button>
       
      <div className="font-medium text-lg">{label}</div>
        <button
          className="px-3 py-1 rounded border hover:bg-gray-100"
          onClick={() => onNavigate("NEXT")}
        >
          <ChevronRight size={20} />
        </button>
      </div>  
      <div className="flex gap-2">
        {["month", "week","day"].map((v) => (
          <button
            key={v}
            className={`px-3 py-1 rounded border ${
              view === v ? "bg-blue-500 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => onView(v as View)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
export default CustomToolbar;