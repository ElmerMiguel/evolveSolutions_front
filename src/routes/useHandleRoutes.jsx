import React from 'react';
import Login from "../pages/auth/Login.jsx";

const UseHandleRoutes = () => {
    return [
        {
            name: "Login",
            key: "Login",
            route: "/login",
            component: <Login />,
        },
    ];
};

export default UseHandleRoutes;