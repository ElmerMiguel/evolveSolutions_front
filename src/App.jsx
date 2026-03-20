import { BrowserRouter as Router } from "react-router-dom"
import {LayoutProvider} from "./contexts/layout/LayoutContext.jsx";
import {AuthProvider} from "./contexts/auth/AuthContext.jsx";
import {ErrorSnackbarProvider} from "./contexts/error/ErrorSnackbarProvider.jsx";
import Navigation from "./routes/Navigation.jsx";

export default function App() {
  return (
      <Router>
          <LayoutProvider>
              <AuthProvider>
                    <ErrorSnackbarProvider>
                        <Navigation />
                    </ErrorSnackbarProvider>
              </AuthProvider>
          </LayoutProvider>
      </Router>
  );
}