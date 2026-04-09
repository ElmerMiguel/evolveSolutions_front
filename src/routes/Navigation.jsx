import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth/AuthContext.jsx";
import {
    Navigate,
    Routes,
    Route,
    useLocation,
    useNavigate,
} from "react-router-dom";
import useHandleRoutes from "./useHandleRoutes.jsx";
import {
    setMiniSidenav,
    useLayoutController,
} from "../contexts/layout/LayoutContext.jsx";
import Register from "../pages/auth/Register.jsx";
import Sidebar from "../components/Sidenav/Sidebar.jsx";
import Login from "../pages/auth/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";

const SITE_NAME = import.meta.env.VITE_SITE_NAME;

const getRoutes = (allRoutes) =>
    allRoutes?.map((route) => {
        if (route.collapse) {
            return getRoutes(route.collapse);
        }
        if (!route.component) return null;

        if (route.route) {
            return (
                <Route
                    path={route.route}
                    element={route.component}
                    key={route.key}
                />
            );
        }
        if (route.to) {
            return (
                <Route
                    path={route.to}
                    element={route.component}
                    key={route.key}
                />
            );
        }
        return null;
    });

const Navigation = () => {
    const [controller, dispatch] = useLayoutController();
    const { miniSidenav, layout } = controller;
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const { token } = useAuth();
    const routes = useHandleRoutes();

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
        if (
            token &&
            (pathname === "/login" ||
                pathname === "/register" ||
                pathname === "/landing")
        ) {
            navigate("/dashboard", { replace: true });
        } else if (
            !token &&
            pathname !== "/login" &&
            pathname !== "/register"
        ) {
            navigate("/login", { replace: true });
        }
    }, [token, pathname, navigate]);

    return (
        <div>
            {layout === "dashboard" && token ? (
                <Sidebar
                    brandName={SITE_NAME}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                />
            ) : (
                <></>
            )}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {token ? (
                    <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                        <Route
                            path="/*"
                            element={
                                <Routes>
                                    {getRoutes(routes)}
                                    <Route
                                        path="*"
                                        element={
                                            <Navigate to="/dashboard" replace />
                                        }
                                    />
                                </Routes>
                            }
                        />
                    </>
                ) : (
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
                )}
            </Routes>
        </div>
    );
};

export default Navigation;
