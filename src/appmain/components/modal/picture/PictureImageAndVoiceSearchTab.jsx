import React, {useState} from "react";
import {Button, Input, message, Table} from "antd";
import {useGetUploadImage} from "@hook/useConsultant";
import dayjs from "dayjs";

const {Search} = Input;

const PictureImageAndVoiceSearchTab = () => {
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState();
    const {mutate: getUploadImage} = useGetUploadImage();
    const [groups, setGroups] = useState([]);

    const handleSearch = (value) => {
        const searchTerm = value.toLowerCase();

        const searchParams = {
            queryValue: searchTerm,
        };

        getUploadImage(searchParams, {
            onSuccess: (data) => {
                setGroups(data || []);
            },
        });

        setSearchTerm(searchTerm);
        setCurrentPage(1);
    };

    // 테이블 열 정의
    const columns = [
        {
            title: "화주 이름",
            dataIndex: "customerName",
            key: "customerName",
            align: "center",
            width: "10%",
        },
        {
            title: "화주 번호",
            dataIndex: "customerPhoneNumber",
            key: "customerPhoneNumber",
            align: "center",
            width: "15%",
        },
        {
            title: "요청일",
            dataIndex: "requestDate",
            key: "requestDate",
            align: "center",
            width: "15%",
            render: (requestDate) => (
                <div>
                    {requestDate ? (
                        <div>{dayjs(requestDate).format('YYYY년 MM월 DD일')}</div>
                    ) : (
                        '-'
                    )}
                </div>
            )
        },
        {
            title: "URL",
            key: "url",
            width: "50%",
            align: "center",
            render: (_, record) => (
                <a
                    href={`${process.env.REACT_IMAGE_BASE_URL}/customer-image?queryValue=${record.encryptedKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                >
                    {`${process.env.REACT_IMAGE_BASE_URL}/customer-image?queryValue=${record.encryptedKey}`}
                </a>
            ),
        },
        {
            title: "복사",
            key: "copy",
            width: "10%",
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    className="hover:underline text-sm"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${process.env.REACT_IMAGE_BASE_URL}/customer-image?queryValue=${record.encryptedKey}`
                        );
                        message.success("링크가 복사되었습니다!");
                    }}
                >
                    링크 복사
                </Button>
            ),
        },
    ];

    // 테이블 데이터 소스
    const dataSource = groups.map((group, index) => ({
        key: index,
        ...group,
    }));

    return (
        <div className="overflow-hidden h-[65vh] p-6 bg-gray-50">
            <div className="sticky top-0 rounded-lg bg-white z-10 shadow">
                <Search
                    placeholder="화주 이름, 화주 번호, 요청일 검색"
                    allowClear
                    onSearch={handleSearch}
                    className="shadow-sm border rounded-lg"
                />
            </div>

            <div className="overflow-y-auto h-[calc(65vh-180px)] mt-6">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: currentPage,
                        pageSize: itemsPerPage,
                        onChange: (page) => setCurrentPage(page),
                    }}
                    bordered
                    rowClassName="hover:bg-gray-50"
                />
            </div>
        </div>
    );
};

export default PictureImageAndVoiceSearchTab;
