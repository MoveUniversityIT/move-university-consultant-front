import React, { useState } from "react";
import { Layout, Tabs, Spin } from "antd";
import {
    UserOutlined,
    SettingOutlined,
    FileSearchOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import UserManagement from "@component/admin/UserManagement";
import SystemManagement from "@component/admin/SystemManagement";

const { TabPane } = Tabs;

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    const renderContent = () => {
        switch (activeTab) {
            case "1":
                return <UserManagement setIsLoading={setIsLoading} />;
            case "2":
                return <SystemManagement setIsLoding={setIsLoading} />;
            default:
                return <p>콘텐츠를 선택하세요</p>;
        }
    };

    return (
        <Layout
            className="min-h-screen h-screen"
            style={{
                background: "linear-gradient(to bottom right, #f3f4f6, #ffffff)",
            }}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
                    <Spin size="large" />
                    <p className="text-lg text-gray-700 mt-4">데이터를 불러오는 중입니다...</p>
                </div>
            )}

            {/* Admin Layout */}
            <div className="bg-white shadow-xl rounded-lg m-4 h-full flex flex-col">
                {/* 탭 메뉴 */}
                <Tabs
                    defaultActiveKey="1"
                    onChange={(key) => setActiveTab(key)}
                    className="rounded-t-lg"
                    tabBarStyle={{
                        padding: "0 16px",
                        borderBottom: "1px solid #e0e0e0",
                    }}
                >
                    <TabPane
                        tab={
                            <span
                                className={`flex items-center gap-2 ${
                                    activeTab === "1"
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-500"
                                } hover:text-blue-500 transition-all`}
                            >
                                <UserOutlined
                                    className={`${
                                        activeTab === "1" ? "text-blue-600" : "text-gray-400"
                                    }`}
                                />
                                사용자 관리
                            </span>
                        }
                        key="1"
                    />
                    <TabPane
                        tab={
                            <span
                                className={`flex items-center gap-2 ${
                                    activeTab === "2"
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-500"
                                } hover:text-blue-500 transition-all`}
                            >
                                <SettingOutlined
                                    className={`${
                                        activeTab === "2" ? "text-blue-600" : "text-gray-400"
                                    }`}
                                />
                                시스템 설정
                            </span>
                        }
                        key="2"
                    />
                    {/*<TabPane*/}
                    {/*    tab={*/}
                    {/*        <span*/}
                    {/*            className={`flex items-center gap-2 ${*/}
                    {/*                activeTab === "3"*/}
                    {/*                    ? "text-blue-600 font-semibold"*/}
                    {/*                    : "text-gray-500"*/}
                    {/*            } hover:text-blue-500 transition-all`}*/}
                    {/*        >*/}
                    {/*            <FileSearchOutlined*/}
                    {/*                className={`${*/}
                    {/*                    activeTab === "3" ? "text-blue-600" : "text-gray-400"*/}
                    {/*                }`}*/}
                    {/*            />*/}
                    {/*            로그 뷰어*/}
                    {/*        </span>*/}
                    {/*    }*/}
                    {/*    key="3"*/}
                    {/*/>*/}
                    {/*<TabPane*/}
                    {/*    tab={*/}
                    {/*        <span*/}
                    {/*            className={`flex items-center gap-2 ${*/}
                    {/*                activeTab === "4"*/}
                    {/*                    ? "text-blue-600 font-semibold"*/}
                    {/*                    : "text-gray-500"*/}
                    {/*            } hover:text-blue-500 transition-all`}*/}
                    {/*        >*/}
                    {/*            <BarChartOutlined*/}
                    {/*                className={`${*/}
                    {/*                    activeTab === "4" ? "text-blue-600" : "text-gray-400"*/}
                    {/*                }`}*/}
                    {/*            />*/}
                    {/*            보고서*/}
                    {/*        </span>*/}
                    {/*    }*/}
                    {/*    key="4"*/}
                    {/*/>*/}
                </Tabs>

                {/* 콘텐츠 영역 */}
                <div
                    className="flex-grow overflow-hidden p-4"
                    style={{
                        transition: "background-color 0.3s ease",
                    }}
                >
                    {renderContent()}
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;