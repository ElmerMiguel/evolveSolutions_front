import { Suspense } from "react";
import LoadingScreen from "../LoadingScreen/index.jsx";

const Loadable = (Component) => (props) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    );
};

export default Loadable