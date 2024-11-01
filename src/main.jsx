import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import MetricsPage from './pages/metrics';
import SignInPage from './pages/sign-in';
import ForgotPasswordPage from './pages/forgot-password';

import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MetricsPage />,
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);