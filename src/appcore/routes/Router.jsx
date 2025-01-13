import React, {useEffect, useState} from "react";
import {createBrowserRouter, Navigate, RouterProvider, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import LoginForm from "@/component/LoginForm";
import Consultant from "@component/Consultant";
import ProtectedRoute from "@/appcore/routes/ProtectedRoute";
import RegisterForm from "@/component/RegisterForm";
import AdminDashboard from "@component/admin/AdminDashboard";
import CustomLayout from "@/common/component/CustomLayout";
import Community from "@component/Community";
import CustomerImage from "@component/CustomerImage";
import CustomerVoice from "@component/CustomerVoice";
import MapsTest from "@component/MapsTest";
import MobilePage from "@component/MobilePage";
import LoadingSpinner from "@component/LoadingSpinner";
import {WebSocketProvider} from "@/appcore/context/WebSocketContext";

const Router = () => {
    const isLogin = useSelector((state) => state.login.loginState);
    const [notices, setNotices] = useState({notices: [], unreadCount: 0});
    const [isMobile, setIsMobile] = useState(null);

    // 모바일 여부 체크
    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

        setIsMobile(mobileRegex.test(userAgent));
    }, []);

    const MobileRedirectWrapper = ({children}) => {
        if (isMobile === null) {
            return <LoadingSpinner/>;
        }
        if (isMobile) {
            return <Navigate to="/mobile" replace/>;
        }
        return children;
    };

    const router = createBrowserRouter(
        [
            {
                path: "/",
                element: (
                    <MobileRedirectWrapper>
                        {isLogin ? <Navigate to="/consultant" replace/> : <LoginForm/>}
                    </MobileRedirectWrapper>
                ),
            },
            {
                path: "/",
                element: (
                    <CustomLayout notices={notices} setNotices={setNotices}/>
                ),
                children: [
                    {
                        path: "consultant",
                        element: (
                            <WebSocketProvider>
                                <ProtectedRoute requiredRoles={["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                                    <Consultant/>
                                </ProtectedRoute>
                            </WebSocketProvider>
                        ),
                    },
                    {
                        path: "notice",
                        element: (
                            <WebSocketProvider>
                                <ProtectedRoute requiredRoles={["ROLE_MANAGER", "ROLE_ADMIN", "ROLE_EMPLOYEE"]}>
                                    <Community notices={notices} setNotices={setNotices}/>
                                </ProtectedRoute>
                            </WebSocketProvider>
                        ),
                    },
                    {
                        path: "admin",
                        element: (
                            <WebSocketProvider>
                                <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}>
                                    <AdminDashboard/>
                                </ProtectedRoute>
                            </WebSocketProvider>
                        ),
                    },
                ],
            },
            {
                path: "/customer-image",
                element: (
                    <CustomerImage/>
                ),
            },
            {
                path: "/customer-voice",
                element: (
                    <CustomerVoice/>
                ),
            },
            {
                path: "/register",
                element: (
                    <RegisterForm/>
                ),
            },
            {
                path: "/maps",
                element: (
                    <MapsTest/>
                ),
            },
            {
                path: "/mobile",
                element: <MobilePage/>,
            },
            {
                path: "*",
                element: <Navigate to="/" replace/>,
            },
        ]
    );

    return <RouterProvider router={router}/>;
};

export default Router;
