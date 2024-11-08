import React from 'react';
import {Navigate, useRoutes} from "react-router-dom";
import LoginForm from "@/component/LoginForm";
import Consultant from "@/component/Consultant";

const Router = () => {
    const isLogin = true;
    // <LoginForm onSubmit={(values) => console.log(values)} />
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