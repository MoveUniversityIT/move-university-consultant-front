import React from 'react';
import {Navigate, useRoutes} from "react-router-dom";
import LoginForm from "@/component/LoginForm";
import Consultant from "@/component/Consultant";
import {useSelector} from "react-redux";

const Router = () => {
    const isLogin = useSelector((state) => state.login.loginState);

    const routes = [
        {
            path: '/',
            children: [
                { index: true, element: isLogin ? <Consultant /> : <LoginForm />}
            ]
        },
        {
            path: '*',
            element: <Navigate to="/" replace />
        }
    ]

    return useRoutes(routes);
}

export default Router;