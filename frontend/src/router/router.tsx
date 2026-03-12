import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import { requireAuth } from "./requireAuth";
import CreateEventPage from "../pages/CreateEventPage";
import MyEventsPage from "../pages/MyEventsPage";
import EventDetailsPage from "../pages/EventDetailsPage";
import { EventsPage } from "../pages/EventsPage";
import EditEventPage from "../pages/EditEventPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <EventsPage/> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
       {
        loader: requireAuth,
        children: [
          { path: "events/create", element: <CreateEventPage /> },
          { path: "events/me", element: <MyEventsPage /> },
          { path: 'events/:id', element: <EventDetailsPage /> },
          { path: "/events/edit/:id", element: <EditEventPage /> },
        ],
      },
    ],
    errorElement: <NotFoundPage />,
  },
]);