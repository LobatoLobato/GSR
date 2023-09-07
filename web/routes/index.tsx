import App from "../App";
import { AuthProvider } from "@web/contexts/authContext";
import { AppProvider } from "@web/contexts/appContext";
export default [
  {
    path: "/",
    element: (
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    ),
  },
];
