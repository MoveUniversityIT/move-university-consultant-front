import React, {useState} from "react";
import {Layout, Spin, Tabs} from "antd";
import {SettingOutlined, UserOutlined,} from "@ant-design/icons";
import UserManagement from "@component/admin/UserManagement";
import SystemManagement from "@component/admin/SystemManagement";

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("1");

    const items = [
        {
            key: "1",
            label: (
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
            ),
            children: <UserManagement setIsLoading={setIsLoading} />,
        },
        {
            key: "2",
            label: (
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
            ),
            children: <SystemManagement setIsLoading={setIsLoading} />,
        },
        // {
        //     key: "3",
        //     label: "로그 뷰어",
        //     children: <LogViewer />,
        // },
    ];

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

            <div className="bg-white shadow-xl rounded-lg m-4 h-full flex flex-col">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                    className="rounded-t-lg"
                    tabBarStyle={{
                        padding: "0 16px",
                        borderBottom: "1px solid #e0e0e0",
                    }}
                />

                <div
                    className="flex-grow overflow-hidden p-4"
                    style={{
                        transition: "background-color 0.3s ease",
                    }}
                >
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;