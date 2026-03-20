
import { createContext, useContext, useReducer, useMemo } from "react";

const Layout = createContext(null);

function reducer(state, action) {
    switch (action.type) {
        case "MINI_SIDENAV": {
            return { ...state, miniSidenav: action.value };
        }
        case "LAYOUT": {
            return { ...state, layout: action.value };
        }
        default: {
            throw new Error(`Acción no reconocida: ${action.type}`);
        }
    }
}

function LayoutProvider({ children }) {
    const initialState = {
        miniSidenav: false,
        transparentSidenav: true,
        sidenavColor: "info",
        transparentNavbar: true,
        fixedNavbar: true,
        openConfigurator: false,
        direction: "ltr",
        layout: "page",
    };

    const [controller, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

    return <Layout.Provider value={value}>{children}</Layout.Provider>;
}

function useLayoutController() {
    const context = useContext(Layout);

    if (!context) {
        throw new Error("useSoftUIController should be used inside the SoftUIControllerProvider.");
    }

    return context;
}

const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });

export {
    LayoutProvider,
    useLayoutController,
    setMiniSidenav,
    setLayout,
};
