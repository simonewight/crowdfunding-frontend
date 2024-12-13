import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PledgePage from "./pages/PledgePage";
import ProjectList from "./pages/ProjectList";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import { AuthProvider } from "./components/AuthProvider";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <NavBar />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/project/:id",
                element: <ProjectPage />,
            },
            {
                path: "/projects",
                element: <ProjectList />,
            },
            {
                path: "/pledge/:id",
                element: <PledgePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/signup",
                element: <SignupPage />,
            },
            {
                path: "/create-project",
                element: <CreateProjectPage />,
            },
            {
                path: "/project/:id/edit",
                element: <EditProjectPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);