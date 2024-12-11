import React, { useEffect, useState } from 'react';
import { Card, Col, Image, message, Pagination, Row, Checkbox, Button } from 'antd';
import { useGetUploadImageAndVoice } from "@hook/useConsultant";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";

const PictureImageAndVoiceSearchTab = () => {
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState();
    const { mutate: getUploadImageVoice } = useGetUploadImageAndVoice();
    const [items, setItems] = useState([]);
    const [selectedUrls, setSelectedUrls] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const handleSearch = (value) => {
        const searchTerm = value.toLowerCase();

        const searchParams = {
            queryValue: searchTerm,
            page: 0,
            size: itemsPerPage,
        };

        getUploadImageVoice(searchParams, {
            onSuccess: (data) => {
                setItems(data.content);
                setTotalCount(data.totalElements);
            },
        });

        setSelectedUrls([]);
        setSearchTerm(searchParams);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        const searchParams = { ...searchTerm, page: page - 1 };

        getUploadImageVoice(searchParams, {
            onSuccess: (data) => {
                setItems(data.content);
                setTotalCount(data.totalElements);
            },
        });

        setSelectedUrls([]);
        setCurrentPage(page);
    };

    const toggleSelection = (fileUrl) => {
        setSelectedUrls((prev) =>
            prev.includes(fileUrl)
                ? prev.filter((url) => url !== fileUrl) // 이미 선택된 경우 제거
                : [...prev, fileUrl] // 선택되지 않은 경우 추가
        );
    };

    const handleCopyUrls = () => {
        const urlsToCopy = selectedUrls.join(", ");
        navigator.clipboard
            .writeText(urlsToCopy)
            .then(() => {
                message.success("선택된 URL이 복사되었습니다!");
            })
            .catch(() => {
                message.error("URL 복사에 실패했습니다.");
            });
    };

    useEffect(() => {
        handleSearch('');
    }, []);

    return (
        <div className="overflow-hidden h-[65vh] p-4">
            <div className="sticky top-0 bg-white z-10 pb-4">
                <Search
                    placeholder="고객 이름, 고객 번호, 요청일로 검색"
                    allowClear
                    onSearch={handleSearch}
                    className="mb-4"
                />
            </div>

            <div className="overflow-y-auto h-[calc(65vh-220px)]">
                <Row gutter={[16, 16]} justify="start" className="!mt-0 !mb-1 !ml-0 !mr-0">
                    {items.map((file, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                onClick={() => toggleSelection(file.fileUrl)} // 카드 클릭 시 체크
                                className={`shadow-md h-60 flex flex-col border rounded-lg cursor-pointer overflow-hidden 
                                ${selectedUrls.includes(file.fileUrl) ? 'border-blue-500' : 'border-gray-300'}`}
                            >
                                <div className="relative flex-1">
                                    <Checkbox
                                        className="absolute top-2 left-2 z-10"
                                        checked={selectedUrls.includes(file.fileUrl)}
                                        onClick={(e) => e.stopPropagation()} // 부모 클릭 이벤트 차단
                                        onChange={() => toggleSelection(file.fileUrl)}
                                    />
                                    {file.fileType.startsWith('audio') ? (
                                        <div className="flex items-center justify-center h-32 bg-gray-100">
                                            <p className="text-gray-600 font-semibold">오디오 파일</p>
                                        </div>
                                    ) : file.fileType.startsWith('image') ? (
                                        <div className="flex items-center justify-center h-32 bg-gray-100 overflow-hidden">
                                            <Image
                                                src={file.fileUrl}
                                                alt={file.fileName}
                                                className="h-full w-full object-cover"
                                                preview={false} // 미리보기 비활성화
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-32 bg-red-50">
                                            <p className="text-red-600 font-semibold">지원되지 않는 파일</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 bg-white">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600 font-semibold min-w-[55px]">고객 이름:</span>
                                        <span className="text-gray-900">{file.customerName || '정보 없음'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600 font-semibold min-w-[55px]">고객 번호:</span>
                                        <span className="text-gray-900">{file.customerPhoneNumber || '정보 없음'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600 font-semibold min-w-[55px]">요청일:</span>
                                        <span
                                            className={`text-gray-900 ${file.requestDate ? '' : 'text-red-500 italic'}`}>
                                            {file.requestDate ? dayjs(file.requestDate).format('YYYY-MM-DD') : '미정'}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* 확인 버튼과 페이지네이션 */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    type="primary"
                    onClick={handleCopyUrls}
                    disabled={selectedUrls.length === 0}
                >
                    선택된 URL 복사
                </Button>
                <div className="flex-1 flex justify-center">
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={totalCount || 0}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default PictureImageAndVoiceSearchTab;