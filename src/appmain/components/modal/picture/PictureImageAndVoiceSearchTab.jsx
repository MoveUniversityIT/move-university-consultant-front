import React, { useState } from "react";
import {Button, Input, message, Pagination, Table} from "antd";
import { useGetUploadImage } from "@hook/useConsultant";
import dayjs from "dayjs";

const { Search } = Input;

const PictureImageAndVoiceSearchTab = () => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState();
    const [groups, setGroups] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const { mutate: getUploadImage } = useGetUploadImage();

    const fetchTableData = (page = 1, searchValue = "") => {
        const searchParams = {
            queryValue: searchValue,
            page: page - 1,
            size: itemsPerPage,
        };

        getUploadImage(searchParams, {
            onSuccess: (data) => {
                setGroups(data.content || []);
                setTotalItems(data.totalElements || 0);
                setCurrentPage(data.pageable.pageNumber + 1);
            },
        });

        setSearchTerm(searchValue);
        setCurrentPage(page);
    };

    const handleSearch = (value) => {
        fetchTableData(1, value);
    };

    const handlePageChange = (page) => {
        fetchTableData(page);
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
                        <div>{dayjs(requestDate).format("YYYY-MM-DD")}</div>
                    ) : (
                        "-"
                    )}
                </div>
            ),
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
                    className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
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
        <div className="overflow-hidden h-[70vh] p-6 bg-gray-50 rounded-lg">
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
                    pagination={false}
                    rowClassName="hover:bg-gray-50"
                />
            </div>
            <div className="flex justify-center">
                <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default PictureImageAndVoiceSearchTab;
