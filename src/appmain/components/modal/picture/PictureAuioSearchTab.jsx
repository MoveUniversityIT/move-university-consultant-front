import React, {useState} from 'react';
import {Card, Col, Input, Row} from 'antd';

const files = [
    {
        url: 'https://www.example.com/audio/sample-audio-1.mp3',
        name: 'sample-audio-1.mp3',
        fileType: 'audio/mpeg',
        customerName: '이철수',
        customerPhoneNumber: '010-1357-2468',
        requestDate: '2024-12-09',
    },
    {
        url: 'https://www.example.com/audio/sample-audio-2.wav',
        name: 'sample-audio-2.wav',
        fileType: 'audio/wav',
        customerName: '박민수',
        customerPhoneNumber: '010-2468-1357',
        requestDate: '2024-12-08',
    },
];

const PictureAudioSearchTab = () => {
    const [filteredFiles, setFilteredFiles] = useState(files);

    const handleSearch = (value) => {
        const searchTerm = value.toLowerCase();
        const filtered = files.filter(
            (file) =>
                file.customerName.toLowerCase().includes(searchTerm) ||
                file.customerPhoneNumber.includes(searchTerm) ||
                file.requestDate.includes(searchTerm)
        );
        setFilteredFiles(filtered);
    };

    return (
        <div className="overflow-hidden h-[65vh] p-4">
            <div className="sticky top-0 bg-white z-10 pb-4">
                <Input.Search
                    placeholder="고객 이름, 고객 번호, 요청일로 검색"
                    allowClear
                    onSearch={handleSearch}
                    className="mb-4"
                />
            </div>

            <div className="overflow-y-auto h-[calc(65vh-220px)]">
                <Row gutter={[16, 16]} justify="start" className="!mt-0 !mb-1 !ml-0 !mr-0">
                    {filteredFiles.map((file) => (
                        <Col key={file.url} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                className="shadow-md"
                            >
                                <p>고객 이름: {file.customerName}</p>
                                <p>고객 번호: {file.customerPhoneNumber}</p>
                                <p>요청일: {file.requestDate}</p>
                                <div className="flex items-center justify-center mt-4">
                                    {file.fileType.startsWith('audio') ? (
                                        <a
                                            href={file.url}
                                            download={file.name}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
                                        >
                                            오디오 다운로드
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 italic">다운로드 불가능한 파일</span>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default PictureAudioSearchTab;
