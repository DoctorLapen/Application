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
            <div className="w-full px-4 py-3 flex justify-end">

                <nav className="flex items-center gap-4">

                    <NavLink to="/" className={linkStyle}>
                        <List size={18} />

                        Events
                    </NavLink>

                    <NavLink to="/my-events" className={linkStyle}>
                        <Calendar size={18} />
                        My Events
                    </NavLink>

                    <NavLink
                        to="/create-event"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        <PlusCircle size={18} />
                        Create Event
                    </NavLink>

                    <div className="h-6 w-px bg-gray-300 mx-2"></div>


                    {isAuth && (
                        <div className="flex items-center gap-2 text-gray-700">
                            <span className="text-sm font-medium">{firstName}</span>
                        </div>
                    )}
                    {!isAuth ? (
                        <NavLink
                            to="/login"
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                        >
                            <LogIn size={20} />
                            <span>Login</span>
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