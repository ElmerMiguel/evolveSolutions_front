import React from 'react';
import Login from "../pages/auth/Login.jsx";
import {Book} from "lucide-react";
import cursosRoutes from "./Cursos/index.jsx";

const UseHandleRoutes = () => {
    return [
        {
            name: "Login",
            key: "Login",
            route: "/login",
            component: <Login />,
        },
        {
            type: "collapse",
            name: "Cursos",
            key: "cursos",
            icon: <Book className="w-6 h-6 text-blue-500"/>,
            collapse: cursosRoutes
        }
    ];
};

export default UseHandleRoutes;