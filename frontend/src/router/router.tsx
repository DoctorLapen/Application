import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import { requireAuth } from "./requireAuth";
import CreateEventPage from "../pages/CreateEventPage";
import MyEventsPage from "../pages/MyEventsPage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <h1>Main</h1> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
       {
        loader: requireAuth,
        children: [
          { path: "create-event", element: <CreateEventPage /> },
          { path: "my-events", element: <MyEventsPage /> },
        ],
      },
    ],
  },
]);