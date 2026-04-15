import { Calendar, List, LogIn, LogOut, PlusCircle, } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../store/store";
import { logout } from "../features/auth/authSlice";



const Header = () => {
    const linkStyle =
        "flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-black";

    const isAuth = useSelector((state: RootState) => state.auth.isAuth);
    const firstName = useSelector((state: RootState) => state.auth.user?.firstName);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout())
        navigate("/")
    }
    return (
        <header className="w-full bg-white border-b-2 border-gray-200">
            <div className="w-full px-4 py-3 flex justify-between">

                <div className="flex items-center px-2 py-2">
                    <span className="text-lg sm:text-xl font-semibold text-gray-800">
                        Events
                    </span>
                </div>
                <nav className="flex items-center gap-4">

                    <NavLink to="/" className={linkStyle} title="Events">
                        <List size={18} />
                        <span className="hidden sm:inline">Events</span>
                    </NavLink>

                    <NavLink to="/events/me" className={linkStyle} title="My Events">
                        <Calendar size={18} />
                        <span className="hidden sm:inline">My Events</span>
                    </NavLink>

                    <NavLink
                        to="/events/create"
                        className="flex items-center sm:px-4 sm:py-2 rounded-lg sm:bg-blue-600 sm:hover:bg-blue-700 transition"
                        title="Create Event"
                    >

                        <PlusCircle size={18} className="text-blue-600 sm:hidden" />


                        <span className="hidden sm:flex items-center gap-2 text-white">
                            <PlusCircle size={18} />
                            Create Event
                        </span>
                    </NavLink>

                    <div className="h-6 w-px bg-gray-300 mx-2"></div>

                    {isAuth && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="hidden sm:inline text-sm font-medium">{firstName}</span>
                        </div>
                    )}
                    {!isAuth ? (
                        <NavLink
                            to="/login"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                            title="Login"
                        >
                            <LogIn size={20} />
                            <span className="hidden sm:inline">Login</span>
                        </NavLink>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-gray-100"
                            title="LogOut"
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