import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import MetricsPage from './pages/metrics';
import SignInPage from './pages/sign-in';

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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);