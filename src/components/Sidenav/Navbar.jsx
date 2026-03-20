import { Menu, LogOut } from "lucide-react"; // lucide-react icons
import { Link } from "react-router-dom";

export default function Navbar({ toggleSidebar, onLogout }) {
    return (
        <nav className="w-full bg-white shadow">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left: Sidebar toggle */}
                <button
                    onClick={toggleSidebar}
                    className="text-slate-700 hover:text-slate-900"
                    aria-label="menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                {/* Center: Logo */}
                <h1 className="flex-grow text-center text-lg font-bold text-slate-900 drop-shadow-md">
                    PsiFirm
                </h1>

                {/* Right: Logout */}
                <div className="flex items-center">
                    <button
                        onClick={onLogout}
                        className="text-slate-700 hover:text-slate-900"
                        aria-label="logout"
                    >
                        <LogOut className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
