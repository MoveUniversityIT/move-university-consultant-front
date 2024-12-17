import React, {useEffect, useState} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import LoginForm from "@/component/LoginForm";
import Consultant from "@component/Consultant";
import {useSelector} from "react-redux";
import ProtectedRoute from "@/appcore/routes/ProtectedRoute";
import RegisterForm from "@/component/RegisterForm";
import AdminDashboard from "@component/admin/AdminDashboard";
import TestPointTransfer from "@component/TestPointTransfer";
import {useGetNotice} from "@hook/useUser";
import Notice from "@component/Notice";
import CustomLayout from "@/common/component/CustomLayout";
import Community from "@component/Community";
import Qna from "@component/mindMap/Qna";

const Router = () => {
    const isLogin = useSelector((state) => state.login.loginState);
    const userId = useSelector((state) => state.login.userId);
    const {data: noticesData} = useGetNotice(userId);
    const [notices, setNotices] = useState({notices: [], unreadCount: 0});

    useEffect(() => {
        setNotices(noticesData);
    }, [noticesData]);

    const router = createBrowserRouter(
        [
            {
                path: "/",
                element: isLogin ? <Navigate to="/consultant" replace/> : <LoginForm/>,
            },
            {
                path: "/",
                element: (
                        <CustomLayout notices={notices}/>
                ),
                children: [
                    {
                        path: "consultant",
                        element: (
                            <ProtectedRoute requiredRoles={["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                                <Consultant/>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "notice",
                        element: (
                            <ProtectedRoute requiredRoles={["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                                <Community notices={notices} setNotices={setNotices}/>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: "admin",
                        element: (
                            <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}>
                                <AdminDashboard/>
                            </ProtectedRoute>
                        ),
                    }
                ]
            },

            {
                path: "/register",
                element: <RegisterForm/>,
            },
            {
                path: "test",
                element: (
                    <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}>
                        <TestPointTransfer/>
                    </ProtectedRoute>
                )
            },
            {
                path: "*",
                element: <Navigate to="/" replace/>,
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

    return <RouterProvider router={router}/>;
};

export default Router;