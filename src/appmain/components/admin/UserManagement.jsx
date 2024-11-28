import {Button, Input, Select, Spin, Table} from "antd";
import React, {useEffect, useState} from "react";
import {useUpdateUser, useUserManagement} from "@hook/useAdmin";
import dayjs from "dayjs";
import {useQueryClient} from "@tanstack/react-query";
import {message} from "antd";

const { Option } = Select;

const positionLabel = {
    "CEO": "대표",
    "GENERAL_DIRECTOR": "총괄 이사",
    "DEV_TEAM": "개발자",
    "DISPATCH_TEAM_LEADER": "배차 팀장",
    "SALES_TEAM_LEADER_1": "영업 1팀장",
    "SALES_TEAM_LEADER_2": "영업 2팀장",
    "DISPATCH": "배차 팀원",
    "SALES": "영업 팀원",
    "MARKETER": "마케터",
    "HR_MANAGER": "인사 책임자",
    "EMPLOYEE": "사원"
}

const UserManagement = ({ setIsLoading }) => {
    const queryClient = useQueryClient();
    const { isLoading, data: userManagementData} = useUserManagement();
    const {mutate: userMutate } = useUpdateUser();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [roleFilter, setRoleFilter] = useState("전체");

    useEffect(() => {
        if (userManagementData) {
            const usersWithKey = userManagementData.map((user) => ({
                ...user,
                key: user.id || user.email,
                originalStatus: user.status,
            }));
            setUsers(usersWithKey);
            setFilteredUsers(usersWithKey);
        }
    }, [userManagementData]);

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
                return { ...user, status: newStatus };
            }
            return user;
        });

        setUsers(updatedUsers);

        const updatedFilteredUsers = filteredUsers.map((user) => {
            if (user.key === key) {
                return { ...user, status: newStatus };
            }
            return user;
        });

        setFilteredUsers(updatedFilteredUsers);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.trim();
        setSearchValue(value);

        const filtered = users.filter((user) =>
            user.name.includes(value) || user.email.includes(value)
        );

        setFilteredUsers(
            roleFilter === "전체"
                ? filtered
                : filtered.filter((user) => user.positionName === roleFilter)
        );
    };

    const handleFilterChange = (value) => {
        setRoleFilter(value);

        const filtered = users.filter((user) =>
            user.email.includes(searchValue) || user.name.includes(searchValue)
        );

        setFilteredUsers(
            value === "전체"
                ? filtered
                : filtered.filter((user) => user.positionName === value)
        );
    };

    const handleUpdateUser = (userId, statusType) => {
        const userInfo = { userId, statusType };

        userMutate(userInfo, {
            onSuccess: (data) => {
                queryClient.invalidateQueries('userManagement'); // 서버 상태 최신화
                const successMessage = data?.data?.message
                    ? data?.data?.message
                    : "정상적으로 처리되었습니다";
                message.success(successMessage);
            },
            onError: (error) => {
                message.error(error?.response?.data?.message || "처리 중 오류가 발생했습니다.");
            },
        });
    };

    const columns = [
        {
            title: "index",
            dataIndex: "id",
            key: "id",
            hidden: true
        },
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
            dataIndex: "positionName",
            key: "positionName",
            render: (positionName) => positionName ? positionLabel[positionName] : ""
        },
        {
            title: "휴대폰번호",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "상태",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                record && typeof(record.key) !== 'string'? (
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
            render: (createdAt) => createdAt ? dayjs(createdAt).format("YYYY-MM-DD HH:mm") : "",
        },
        {
            title: "수정일",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (updatedAt) => updatedAt ? dayjs(updatedAt).format("YYYY-MM-DD HH:mm") : "",
        },
        {
            title: "상태 변경",
            key: "action",
            render: (record) => (
                record.status ? (
                    <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handleUpdateUser(record.id, record.status)}
                        disabled={record.status === record.originalStatus}
                    >
                        수정
                    </Button>
                ) : null
            ),
        },
    ];

    const dataWithEmptyRows = () => {
        const rowsToAdd = 7 - filteredUsers.length;
        if (rowsToAdd > 0) {
            const emptyRows = Array.from({ length: rowsToAdd }, (_, i) => ({
                key: `empty-${i}`,
                email: "",
                name: "",
                positionName: "",
                phoneNumber: "",
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
                    {Object.keys(positionLabel).map((key) => (
                        <Option key={key} value={key}>
                            {positionLabel[key]}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="flex-grow overflow-auto p-4">
                {isLoading ? (
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