import { Menu, LogOut } from "lucide-react"; // lucide-react icons

const SITE_NAME = import.meta.env.SITE_NAME;

export default function Navbar({ toggleSidebar, onLogout }) {
    return (
        <nav className="w-full bg-white shadow">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    onClick={toggleSidebar}
                    className="text-slate-700 hover:text-slate-900"
                    aria-label="menu"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <h1 className="flex-grow text-center text-lg font-bold text-slate-900 drop-shadow-md">
                    {SITE_NAME}
                </h1>

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
