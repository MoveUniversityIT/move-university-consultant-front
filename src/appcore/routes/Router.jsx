import React from "react";
import {Navigate, useRoutes} from "react-router-dom";
import LoginForm from "@/component/LoginForm";
import Consultant from "@component/Consultant";
import {useSelector} from "react-redux";
import ProtectedRoute from "@/appcore/routes/ProtectedRoute";

const Router = () => {
    const isLogin = useSelector((state) => state.login.loginState);

    const routes = [
        {
            path: "/",
            element: isLogin ? <Navigate to="/consultant" replace /> : <LoginForm />,
        },
        {
            path: "/consultant",
            element: (
                <ProtectedRoute requiredRoles={["ROLE_MANAGER", "ROLE_ADMIN"]}>
                    <Consultant />
                </ProtectedRoute>
            ),
        },
        {
            path: "*",
            element: <Navigate to="/" replace />,
        },
    ];

    return useRoutes(routes);
};

export default Router;