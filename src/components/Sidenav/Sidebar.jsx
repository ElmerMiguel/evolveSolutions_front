import { useState } from "react";
import {Link, NavLink} from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "./Navbar.jsx";
import useHandleRoutes from "../../routes/useHandleRoutes.jsx";
import useValidarPermiso from "../../hooks/useValidarPermiso.js";
import {TIPOS_AUTORIZACIONES} from "../../entities/enums/TiposAutorizacion.js";
import {useAuth} from "../../contexts/auth/AuthContext.jsx"; // using lucide-react icons

const SITE_NAME = import.meta.env.SITE_NAME;
const { LECTURA } = TIPOS_AUTORIZACIONES;

export default function Sidebar({ sidebarItems }) {
    const [open, setOpen] = useState(false);
    const { validarPermiso } = useValidarPermiso()
    const [openCollapse, setOpenCollapse] = useState(false);
    const [openNestedCollapse, setOpenNestedCollapse] = useState(false);
    const { logout } = useAuth();

    const routes = useHandleRoutes()

    const validarItemsMenu = () => {
        try {
            let navItems = []

            for (const route of routes) {

                if (!route.collapse) {

                    try {
                        const isValid = validarPermiso(route?.permiso, (route?.tipoAutorizacion || LECTURA))
                        if (route?.backButton) navItems.push(route)

                        if (!isValid) continue
                    }  catch (error){
                        console.log(error)

                    }

                    navItems.push(route)

                } else {

                    let subRoutes = []
                    for (const subRoute of route.collapse) {
                        if (!subRoute.collapse) {

                            const isValidSubRoute = validarPermiso(subRoute.permiso, (subRoute?.tipoAutorizacion || LECTURA))
                            if (route.backButton) navItems.push(route)
                            if (!isValidSubRoute) continue
                            subRoutes.push(subRoute)
                        } else {

                            let subSubRoutes = []

                            for (const subSubRoute of subRoute.collapse) {

                                const isValid = validarPermiso(subSubRoute.permiso, (subSubRoute?.tipoAutorizacion || LECTURA))
                                if (!isValid) continue
                                subSubRoutes.push(subSubRoute)
                            }

                            subRoute.collapse = subSubRoutes

                            if (subSubRoutes.length > 0) {
                                subRoutes.push(subRoute)
                            }

                        }
                    }
                    route.collapse = subRoutes

                    if (subRoutes.length > 0) {
                        navItems.push(route)
                    }
                }
            }

            return navItems
        } catch {
            return []
        }
    }

    const renderNestedCollapse = (collapse) => {
        return collapse.map(({ name, route, key, href }) =>
            href ? (
                <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="block pl-8 pr-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md"
                >
                    {name}
                </a>
            ) : (
                <NavLink
                    to={route}
                    key={key}
                    className={({ isActive }) =>
                        `block pl-8 pr-3 py-2 text-sm rounded-md ${
                            isActive ? "bg-slate-200 text-slate-800" : "text-slate-600 hover:bg-slate-100"
                        }`
                    }
                >
                    {name}
                </NavLink>
            )
        );
    };

    const renderCollapse = (collapses) =>
        collapses.map(({ name, collapse, route, href, key }) => {
            if (collapse) {
                const isOpen = openNestedCollapse === name;

                return (
                    <li key={key} className="space-y-1">
                        <button
                            type="button"
                            onClick={() => setOpenNestedCollapse(isOpen ? false : name)}
                            className={`flex w-full items-center justify-between px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100 ${
                                isOpen ? "bg-slate-200" : ""
                            }`}
                        >
                            <span>{name}</span>
                            <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
                        </button>

                        {isOpen && (
                            <ul className="mt-1 space-y-1">
                                {renderNestedCollapse(collapse)}
                            </ul>
                        )}
                    </li>
                );
            }

            return href ? (
                <li key={key}>
                    <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-3 py-2 text-slate-700 rounded-md hover:bg-slate-100"
                    >
                        {name}
                    </a>
                </li>
            ) : (
                <li key={key}>
                    <NavLink
                        to={route}
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-md ${
                                isActive ? "bg-slate-200 text-slate-800" : "text-slate-700 hover:bg-slate-100"
                            }`
                        }
                    >
                        {name}
                    </NavLink>
                </li>
            );
        });

    return (
        <div className="flex">
            <Navbar toggleSidebar={() => setOpen(true)} onLogout={logout}/>
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
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h1 className="text-lg font-semibold text-slate-900">{SITE_NAME}</h1>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-slate-700 hover:text-slate-900"
                    >
                        <ChevronLeft />
                    </button>
                </div>

                <ul className="p-4 space-y-2">
                    {validarItemsMenu(routes).map(
                        ({ type, name, icon, title, collapse, noCollapse, key, href, route }) => {
                            if (type === "collapse") {
                                if (href) {
                                    return (
                                        <li key={key}>
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
                                            >
                                                <span className="text-slate-700">{icon}</span>
                                                <span className="text-sm font-medium">{name}</span>
                                            </a>
                                        </li>
                                    );
                                }

                                if (noCollapse && route) {
                                    // Important: do NOT render children inside the NavLink (causes horizontal/inline layout)
                                    return (
                                        <li key={key}>
                                            <NavLink
                                                to={route}
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
                                            >
                                                <span className="text-slate-700">{icon}</span>
                                                <span className="text-sm font-medium">{name}</span>
                                            </NavLink>
                                        </li>
                                    );
                                }

                                // Collapsible section: header button + nested <ul> below (only when open)
                                const isOpen = openCollapse === key;

                                return (
                                    <li key={key} className="space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => setOpenCollapse(isOpen ? false : key)}
                                            className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 ${
                                                isOpen ? "bg-slate-200" : ""
                                            }`}
                                        >
                                            <span className="text-slate-700">{icon}</span>
                                            <span className="text-sm font-medium">{name}</span>
                                            <span className="ml-auto">{isOpen ? "▲" : "▼"}</span>
                                        </button>

                                        {isOpen && collapse ? (
                                            <ul className="pl-2 space-y-1">
                                                {renderCollapse(collapse)}
                                            </ul>
                                        ) : null}
                                    </li>
                                );
                            } else if (type === "title") {
                                return (
                                    <li
                                        key={key}
                                        className="text-xs font-bold uppercase text-slate-500 mt-2 mb-1 pl-3"
                                    >
                                        {title}
                                    </li>
                                );
                            } else if (type === "divider") {
                                return <li key={key}><hr className="border-t border-slate-200 my-2" /></li>;
                            }
                            return null;
                        }
                    )}
                </ul>
            </div>

        </div>
    );
}
