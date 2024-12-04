import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginForm from "@/component/LoginForm";
import Consultant from "@component/Consultant";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/appcore/routes/ProtectedRoute";
import RegisterForm from "@/component/RegisterForm";
import AdminDashboard from "@component/admin/AdminDashboard";
import TestPointTransfer from "@component/TestPointTransfer";

const Router = () => {
    const isLogin = useSelector((state) => state.login.loginState);

    const router = createBrowserRouter(
        [
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
                    <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/register",
                element: <RegisterForm />,
            },
            {
                path: "test",
                element: <TestPointTransfer />
            },
            {
                path: "*",
                element: <Navigate to="/" replace />,
            },
        ],
        {
            future: {
                v7_relativeSplatPath: true, // 상대 경로 처리 방식 변경
                v7_skipActionErrorRevalidation: true, // action 처리 후 경로 재검증 스킵
                v7_startTransition: true, // React의 startTransition API 활성화
                v7_fetcherPersist: true, // fetcher의 상태 유지 동작 변경
                v7_normalizeFormMethod: true, // formMethod를 대문자로 정규화
                v7_partialHydration: true, // RouterProvider의 부분적 하이드레이션 활성화
            },
        }
    );

    return <RouterProvider router={router} />;
};

export default Router;