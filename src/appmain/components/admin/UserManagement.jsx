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
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>index</div>,
            dataIndex: 'id',
            key: 'id',
            hidden: true,
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>이메일</div>,
            dataIndex: 'email',
            key: 'email',
            render: (text) => (
                <div
                    style={{
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#2563eb', // Tailwind "text-blue-600"
                        fontWeight: 'bold',
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>이름</div>,
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <div
                    style={{
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>직책</div>,
            dataIndex: 'positionName',
            key: 'positionName',
            render: (positionName) => (
                <div
                    style={{
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {positionName ? positionLabel[positionName] : ''}
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>휴대폰번호</div>,
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text) => (
                <div
                    style={{
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>상태</div>,
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                record && typeof record.key !== 'string' ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                    </div>
                ) : (
                    <div style={{ height: '18px', textAlign: 'center' }} />
                )
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>생성일</div>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => (
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center', // 정렬 통일
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    {createdAt ? (
                        <div>
                            <div>{dayjs(createdAt).format('YYYY년 MM월 DD일')}</div>
                            <div>{dayjs(createdAt).format('A HH시 mm분').replace('AM', '오전').replace('PM', '오후')}</div>
                        </div>
                    ) : (
                        '-'
                    )}
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>수정일</div>,
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt) => (
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center', // 정렬 통일
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    {updatedAt ? (
                        <div>
                            <div>{dayjs(updatedAt).format('YYYY년 MM월 DD일')}</div>
                            <div>{dayjs(updatedAt).format('A HH시 mm분').replace('AM', '오전').replace('PM', '오후')}</div>
                        </div>
                    ) : (
                        '-'
                    )}
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>상태 변경</div>,
            key: 'action',
            render: (record) => (
                record.status ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            style={{
                                backgroundColor: record.status === record.originalStatus ? '#d1d5db' : '#2563eb', // 비활성화: 회색, 활성화: 파란색
                                color: record.status === record.originalStatus ? '#6b7280' : 'white', // 비활성화: 어두운 회색, 활성화: 흰색
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: record.status === record.originalStatus ? 'not-allowed' : 'pointer', // 비활성화 시 커서 변경
                                opacity: record.status === record.originalStatus ? 0.6 : 1, // 비활성화 시 투명도 조정
                            }}
                            onClick={() => handleUpdateUser(record.id, record.status)}
                            disabled={record.status === record.originalStatus}
                        >
                            수정
                        </Button>
                    </div>
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