import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./errors/errorPage.jsx";
import SignIn from "./auth/signin.jsx";
import React from "react";
import SignUp from "./auth/signup.jsx";
import Home from "./home.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <SignIn/>,
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },
]);