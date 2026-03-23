import React, {useEffect, useState} from 'react';
import {useAuth} from "../contexts/auth/AuthContext.jsx";
import {Navigate, Routes, Route, useLocation, useNavigate} from "react-router-dom";
import useHandleRoutes from "./useHandleRoutes.jsx";
import {setMiniSidenav, useLayoutController} from "../contexts/layout/LayoutContext.jsx";
import Register from "../pages/auth/Register.jsx";
import Sidebar from "../components/Sidenav/Sidebar.jsx";
import Login from "../pages/auth/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const SITE_NAME = import.meta.env.SITE_NAME;

const getRoutes = (allRoutes) =>
    allRoutes?.map((route) => {
        if (route.collapse) {
            return getRoutes(route.collapse);
        }
        if (route.to) {
            return <Route exact path={route.to} element={route.component} key={route.key} />;
        }
        if (route.route) {
            return <Route exact path={route.route} element={route.component} key={route.key} />;
        }

        return null;
    });


const Navigation = () => {
    const [controller, dispatch] = useLayoutController();
    const { miniSidenav, layout } = controller;
    const { pathname } = useLocation();
    const navigate = useNavigate()
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const { token } = useAuth()
    const routes = useHandleRoutes()

    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    useEffect(() => {
        if (token && (pathname === '/login' || pathname === '/register' || pathname === '/landing')) {
            navigate('/dashboard')
        }
    }, [token, pathname, navigate])

    return (
        <div>
            {
                layout === "dashboard" ?
                    <Sidebar
                        brandName={SITE_NAME}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                    />
                    :
                    <></>
            }
            <Routes>
                <Route path={"/login"} element={<Login/>} />
                <Route path={"/register"} element={<Register/>}/>
                <Route path={"/dashboard"} element={<Dashboard/>} />
                <Route path={"/"} element={<Dashboard/>} />
                <Route path='/*' element={
                    <Routes>
                        {getRoutes(routes)}
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                } />

            </Routes>
        </div>
    );
};

export default Navigation;