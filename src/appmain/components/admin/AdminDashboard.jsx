import React, {useState} from "react";
import {Layout, Menu} from "antd";
import {SettingOutlined, UserOutlined,} from "@ant-design/icons";
import UserManagement from "@component/admin/UserManagement";
import {Content} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import AdminNotice from "@component/admin/AdminNotice";
import SystemManagement from "@component/admin/SystemManagement";
import {FaBullhorn, FaQuestionCircle} from "react-icons/fa";
import Qna from "@component/mindMap/Qna";
import ProtectedRoute from "@/appcore/routes/ProtectedRoute";

const AdminDashboard = () => {
    const [activeMenu, setActiveMenu] = useState('userManagement');

    const menuItems = [
        {
            key: 'userManagement',
            icon: <UserOutlined />,
            label: '사용자 관리',
        },
        {
            key: 'systemSettings',
            icon: <SettingOutlined />,
            label: '시스템 설정',
            children: [
                {
                    key: 'noticeRegistration',
                    icon: <FaBullhorn />,
                    label: '공지사항 설정',
                },
                {
                    key: 'difficultyRegistration',
                    icon: <SettingOutlined />,
                    label: '기타 설정',
                },
                {
                    key: 'qnaRegistration',
                    icon: <FaQuestionCircle />,
                    label: 'QnA 설정',
                },
            ],
        },
    ];

    const renderContent = () => {
        switch (activeMenu) {
            case 'userManagement':
                return <UserManagement />;
            case 'noticeRegistration':
                return <AdminNotice />;
            case 'difficultyRegistration':
                return <SystemManagement />;
            case 'qnaRegistration':
                return (
                    <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}>
                        <Qna />
                    </ProtectedRoute>
                );
            default:
                return <UserManagement />;
        }
    };

    return (
        <Layout className="pt-14 relative h-full">
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['userManagement']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                        onSelect={({ key }) => setActiveMenu(key)}
                    />
                </Sider>
                <Layout style={{ padding: '12px' }}>
                    <Content
                        className="site-layout-background"
                    >
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
};

export default AdminDashboard;