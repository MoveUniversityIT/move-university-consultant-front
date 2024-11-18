import React from "react";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {message} from "antd"; // Ant Design의 메시지 컴포넌트 사용

const roleHierarchy = {
    ROLE_ADMIN: ["ROLE_ADMIN", "ROLE_DISPATCH_MANAGE", "ROLE_USER"],
    ROLE_DISPATCH_MANAGE: ["ROLE_DISPATCH_MANAGE", "ROLE_DISPATCH_READ", "ROLE_EMPLOYEE"],
};

const ProtectedRoute = ({ requiredRoles, children }) => {
    const isLogin = useSelector((state) => state.login.loginState);
    const roles = useSelector((state) => state.login.roles);

    if (!isLogin) {
        return <Navigate to={"/login"} />;
    }

    if (roles) {
        const expandedRoles = roles.flatMap((role) => roleHierarchy[role] || []);
        const hasAccess = requiredRoles.some((requiredRole) => expandedRoles.includes(requiredRole));

        if (!hasAccess) {
            // 권한 부족 경고 메시지
            message.warning("해당 페이지에 접근할 권한이 없습니다.");
            return <Navigate to={"/consultant"} />;
        }
    }

    return children;
};

export default ProtectedRoute;