import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "./Navbar.jsx"; // using lucide-react icons

const SITE_NAME = import.meta.env.SITE_NAME;

export default function Sidebar({ sidebarItems }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex">
            <Navbar toggleSidebar={() => setOpen(true)}/>
            {open && (
                <div
                    className="fixed inset-0 bg-black/30"
                    onClick={() => setOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h1 className="text-lg font-semibold text-slate-900">${SITE_NAME}</h1>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-slate-700 hover:text-slate-900"
                    >
                        <ChevronLeft />
                    </button>
                </div>

                {/* List */}
                <ul className="p-4 space-y-2">
                    {sidebarItems?.map((item) => (
                        <li key={item.key}>
                            <Link
                                to={item.link}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
                            >
                                <span className="text-slate-700">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
