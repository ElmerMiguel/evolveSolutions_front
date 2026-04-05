import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";

const LoadingScreen = () => {
    NProgress.configure({
        showSpinner: false,
    });
    useEffect(() => {
        NProgress.start();
        return () => {
            NProgress.done();
        };
    }, []);
    return  "";
};

export default LoadingScreen;