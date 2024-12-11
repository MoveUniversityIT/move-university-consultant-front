import React, {useEffect, useState} from "react";
import {Button, message} from "antd";
import {Header} from "antd/es/layout/layout";
import {resetState} from "@/features/user/loginSlice";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {
    FaTruck,
    FaUniversity,
    FaTv,
    FaCloudSun,
    FaUserShield,
    FaSatelliteDish,
    FaBullhorn,
    FaChalkboardTeacher
} from "react-icons/fa";
import {hasAccess} from "@/appcore/utils/utils";


const CustomHeader = ({notices}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roles = useSelector((state) => state.login.roles);
    const hasAdminAccess = hasAccess(roles, ["ROLE_ADMIN"]);
    const location = useLocation();
    const isAdminPage = location.pathname === "/admin";


    const handleLogout = () => {
        dispatch(resetState());
        message.info("로그아웃 되었습니다.");
        navigate("/login");
    };

    const goToConsultant = () => {
        navigate("/consultant")
    }

    const goToNotice = () => {
        navigate("/notice")
    }

    return (
        <Header className="fixed top-0 left-0 right-0 bg-white text-gray-800 z-50 shadow-md h-14">
            <div className="flex items-center justify-between px-4 py-2">
                <div
                    className="w-36 h-10 bg-mv-logo bg-contain bg-no-repeat flex-shrink-0 cursor-pointer"
                    title="사이트 로고"
                    onClick={goToConsultant}
                ></div>

                <nav className="flex items-center space-x-6 overflow-visible">
                    <div
                        className="relative flex items-center space-x-2 text-gray-800 hover:text-orange-500 text-sm whitespace-nowrap hover:cursor-pointer"
                    onClick={goToNotice}>
                        <FaBullhorn className="w-5 h-5"/>
                        {notices?.unreadCount > 0 && (
                            <span
                                className="text-xs font-semibold text-white bg-red-500 rounded-full w-4 absolute text-center !ml-0 translate-x-3/4 -translate-y-2/4">
                                {notices?.unreadCount}
                            </span>
                        )}
                        <span>공지사항</span>
                    </div>
                    <a href="https://moveuniversity.kr" target="_blank"
                       className="flex items-center space-x-2 text-gray-800 hover:text-yellow-600 text-sm whitespace-nowrap">
                        <FaUniversity className="w-5 h-5"/>
                        <span>이사대학</span>
                    </a>
                    <a href="https://isa-gongcha-v3.vercel.app/work" target="_blank"
                       className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 text-sm whitespace-nowrap">
                        <FaTruck className="w-5 h-5"/>
                        <span>이사공차</span>
                    </a>
                    <a href="https://www.moveuniversity.co.kr/main" target="_blank"
                       className="flex items-center space-x-2 text-gray-800 hover:text-green-600 text-sm whitespace-nowrap">
                        <FaSatelliteDish className="w-5 h-5"/>
                        <span>이사대학 올인원(통신)</span>
                    </a>
                    <a href="http://moveuniversity.net" target="_blank"
                       className="flex items-center space-x-2 text-gray-800 hover:text-purple-600 text-sm whitespace-nowrap">
                        <FaTv className="w-5 h-5"/>
                        <span>가전렌탈</span>
                    </a>
                    <a href="https://www.msn.com/ko-kr/weather/maps/precipitation/?type=precipitation&zoom=7"
                       target="_blank"
                       className="flex items-center space-x-2 text-gray-800 hover:text-teal-600 text-sm whitespace-nowrap">
                        <FaCloudSun className="w-5 h-5"/>
                        <span>날씨</span>
                    </a>
                    {hasAdminAccess && (
                        <a href={isAdminPage ? "/consultant" : "/admin"}
                           className="flex items-center space-x-2 text-gray-800 hover:text-red-600 text-sm whitespace-nowrap">
                            {isAdminPage ? (
                                <>
                                    <FaChalkboardTeacher className="w-5 h-5" />
                                    <span>상담봇</span>
                                </>
                            ) : (
                                <>
                                    <FaUserShield className="w-5 h-5"/>
                                    <span>관리자</span>
                                </>

                            )}
                        </a>
                    )}
                </nav>

                <Button
                    type="primary"
                    danger
                    className="ml-4 bg-red-600 hover:bg-red-400 text-sm"
                    onClick={handleLogout}
                >
                    로그아웃
                </Button>
            </div>
        </Header>
    )
}

export default CustomHeader;