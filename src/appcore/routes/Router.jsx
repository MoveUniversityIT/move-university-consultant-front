import React from "react";
import {Navigate, useRoutes} from "react-router-dom";
import LoginForm from "@/component/LoginForm";
import Consultant from "@component/Consultant";
import {useSelector} from "react-redux";
import ProtectedRoute from "@/appcore/routes/ProtectedRoute";
import RegisterForm from "@/component/RegisterForm";
import AdminDashboard from "@component/admin/AdminDashboard";

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
                <ProtectedRoute requiredRoles={["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                    <Consultant />
                </ProtectedRoute>
            ),
        },
        {
            path: "/admin",
            element: (
                <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}> {/* 관리자 권한만 접근 가능 */}
                    <AdminDashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: "/register",
            element: (
                <RegisterForm />
            )
        },
        {
            path: "*",
            element: <Navigate to="/" replace />,
        },
    ];

    return useRoutes(routes);
};

export default Router;