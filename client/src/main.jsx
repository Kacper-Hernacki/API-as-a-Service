import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { ContextProvider } from "./contexts/ContextProvider.jsx";
import { router } from "./routes/router.jsx";
import AuthProvider from "react-auth-kit";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      {/*<AuthProvider authType={"cookie"}*/}
      {/*              authName={"_auth"}*/}
      {/*              cookieDomain={window.location.hostname}*/}
      {/*              cookieSecure={window.location.protocol === "https:"}>*/}
        <RouterProvider router={router} />
      {/*</AuthProvider>*/}
    </ContextProvider>
  </React.StrictMode>
);
