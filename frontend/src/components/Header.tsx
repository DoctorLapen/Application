import { Calendar, List, LogIn, LogOut, PlusCircle, } from "lucide-react";
import { NavLink } from "react-router";


const Header = () => {
    const linkStyle =
        "flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-black";

    return (
        <header className="w-full bg-white border-b-2 border-gray-200">
            <div className="w-full px-4 py-3 flex justify-end">

                <nav className="flex items-center gap-4">

                    <NavLink to="/events" className={linkStyle}>
                        <List size={18} />

                        Events
                    </NavLink>

                    <NavLink to="/myevents" className={linkStyle}>
                        <Calendar size={18} />
                        My Events
                    </NavLink>

                    <NavLink
                        to="/create"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        <PlusCircle size={18} />
                        Create Event
                    </NavLink>
                   
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          
          {true && (
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-sm font-medium">{"Eduard"}</span>
            </div>
          )}
                    {!false ? (
                        <NavLink
                            to="/login"
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <LogIn size={20} />
                        </NavLink>
                    ) : (
                        <button
                            onClick={() => { }}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </nav>
            </div>             
        </header>
    );
};

export default Header;