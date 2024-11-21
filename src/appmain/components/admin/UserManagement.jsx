import { Button, Input, Select, Spin, Table } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";

const UserManagement = ({ setIsLoading }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [roleFilter, setRoleFilter] = useState("전체");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const userData = [
                {
                    key: "1",
                    email: "user1@example.com",
                    name: "홍길동",
                    role: "대표",
                    phone: "010-1234-5678",
                    status: "ACTIVE",
                    createdAt: "2023-01-01",
                    updatedAt: "2023-06-15",
                },
                {
                    key: "2",
                    email: "user2@example.com",
                    name: "김영희",
                    role: "개발자",
                    phone: "010-9876-5432",
                    status: "PENDING",
                    createdAt: "2022-12-10",
                    updatedAt: "2023-05-20",
                },
                {
                    key: "3",
                    email: "user3@example.com",
                    name: "이철수",
                    role: "영업 팀원",
                    phone: "010-5678-1234",
                    status: "SUSPENDED",
                    createdAt: "2023-02-14",
                    updatedAt: "2023-04-01",
                },
            ];
            setUsers(userData);
            setFilteredUsers(userData);
            setLoading(false);
        }, 1000);
    }, []);

    const statusLabels = {
        ACTIVE: { text: "활성", color: "bg-green-100 text-green-600" },
        INACTIVE: { text: "비활성", color: "bg-gray-100 text-gray-600" },
        DORMANT: { text: "휴면", color: "bg-yellow-100 text-yellow-600" },
        PENDING: { text: "대기", color: "bg-blue-100 text-blue-600" },
        SUSPENDED: { text: "정지", color: "bg-orange-100 text-orange-600" },
        BANNED: { text: "차단", color: "bg-red-100 text-red-600" },
        DELETED: { text: "탈퇴(삭제)", color: "bg-gray-200 text-gray-500" },
    };

    // 상태 변경 처리
    const onStatusChange = (key, newStatus) => {
        const updatedUsers = users.map((user) => {
            if (user.key === key) {
                return { ...user, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] };
            }
            return user;
        });
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        const filtered = users.filter(
            (user) =>
                user.name.includes(value) || user.email.includes(value)
        );
        setFilteredUsers(
            roleFilter === "전체"
                ? filtered
                : filtered.filter((user) => user.role === roleFilter)
        );
    };

    const handleFilterChange = (value) => {
        setRoleFilter(value);
        setFilteredUsers(
            value === "전체"
                ? users.filter((user) => user.name.includes(searchValue))
                : users.filter(
                    (user) =>
                        user.role === value &&
                        (user.name.includes(searchValue) ||
                            user.email.includes(searchValue))
                )
        );
    };

    const columns = [
        {
            title: "이메일",
            dataIndex: "email",
            key: "email",
            render: (text) => <span className="text-blue-600">{text}</span>,
        },
        {
            title: "이름",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "직책",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "휴대폰번호",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "상태",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                record && !record.key?.startsWith("empty-") ? (
                    <Select
                        value={status}
                        onChange={(value) => onStatusChange(record.key, value)}
                        style={{ width: 120 }}
                    >
                        {Object.keys(statusLabels).map((key) => (
                            <Option key={key} value={key}>
                                {statusLabels[key].text}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    <div style={{ height: "18px" }} />
                )
            ),
        },
        {
            title: "생성일",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "수정일",
            dataIndex: "updatedAt",
            key: "updatedAt",
        },
    ];

    const dataWithEmptyRows = () => {
        const rowsToAdd = 7 - filteredUsers.length;
        if (rowsToAdd > 0) {
            const emptyRows = Array.from({ length: rowsToAdd }, (_, i) => ({
                key: `empty-${i}`,
                email: "",
                name: "",
                role: "",
                phone: "",
                status: "",
                createdAt: "",
                updatedAt: "",
            }));
            return [...filteredUsers, ...emptyRows];
        }
        return filteredUsers;
    };

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">사용자 관리</h2>
                <Button type="primary" className="bg-blue-500">
                    사용자 추가
                </Button>
            </div>

            <div className="flex gap-4 p-4">
                <Input
                    placeholder="이름 또는 이메일 검색"
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="flex-grow"
                />
                <Select
                    defaultValue="전체"
                    onChange={handleFilterChange}
                    className="w-32"
                >
                    <Option value="전체">전체</Option>
                    <Option value="대표">대표</Option>
                    <Option value="총괄 이사">총괄 이사</Option>
                    <Option value="개발자">개발자</Option>
                    <Option value="배차 팀장">배차 팀장</Option>
                    <Option value="영업 1팀장">영업 1팀장</Option>
                    <Option value="영업 2팀장">영업 2팀장</Option>
                    <Option value="배차 팀원">배차 팀원</Option>
                    <Option value="영업 팀원">영업 팀원</Option>
                    <Option value="마케터">마케터</Option>
                    <Option value="인사 책임자">인사 책임자</Option>
                    <Option value="사원">사원</Option>
                    <Option value="프리랜서">프리랜서</Option>
                </Select>
            </div>

            <div className="flex-grow overflow-auto p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        className="w-full h-full"
                        dataSource={dataWithEmptyRows()}
                        columns={columns}
                        pagination={{
                            pageSize: 7,
                            position: ["bottomCenter"],
                        }}
                        bordered
                    />
                )}
            </div>
        </div>
    );
};

export default UserManagement;