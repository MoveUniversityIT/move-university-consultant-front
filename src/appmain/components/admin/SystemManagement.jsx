import React, {useEffect, useState} from 'react';
import UploadExcel from "@/component/UploadExcel";
import DownloadExcel from "@/component/DownloadExcel";
import {useQueryClient} from "@tanstack/react-query";
import {useDifficultyAddressSearch} from "@hook/useConsultant";
import {Button, Input, InputNumber, Table} from "antd";

const SystemManagement = () => {
    const queryClient = useQueryClient();
    const [location, setLocation] = useState("");
    const [showList, setShowList] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [administrativeCode, setAdministrativeCode] = useState('0');
    const [skipAddressChangeEvent, setSkipAddressChangeEvent] = useState(false);

    const [difficulty, setDifficulty] = useState(0);
    const [addressList, setAddressList] = useState([]);
    const {data: locationList} = useDifficultyAddressSearch(location);

    const handleExcepUpload = () => {
        queryClient.invalidateQueries('consultantMetadata');
    };

    const handleLocationChange = (e) => {
        const address = e.target.value;
        setLocation(address);

        if (skipAddressChangeEvent) {
            setSkipAddressChangeEvent(false);
            return;
        }

        setSelectedIndex(0);
        setShowList(true);
    };

    const handleKeyDown = (e) => {
        if (showList && addressList.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prevIndex) => {
                    return Math.min(prevIndex + 1, addressList.length - 1);
                });
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                const selectedAddress = addressList[selectedIndex];
                const addressName = selectedAddress.address_name.trim();

                setAdministrativeCode(selectedAddress.address?.b_code || undefined);
                setShowList(false);
                setSkipAddressChangeEvent(true);
                setSelectedIndex(-1);
            }
        } else {
            setSkipAddressChangeEvent(false);
        }
    };

    const regionList = [
        {cityCode: '1', address: '서울', difficulty: 5},
        {cityCode: '2', address: '부산', difficulty: 3},
        {cityCode: '3', address: '대구', difficulty: 4},
    ];

    useEffect(() => {
        if(locationList)
            setAddressList(locationList);

    }, [locationList]);

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">시스템 설정</h2>

            {/* 지역 설정 섹션 */}
            <div className="flex flex-row w-full mx-auto bg-white rounded-lg shadow-md p-6 gap-6 mb-8">
                {/* 왼쪽: 지역 설정 섹션 */}
                <div className="flex flex-col flex-[1] bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                        <h3 className="text-md font-semibold text-gray-700 mr-2">지역 난이도</h3>
                        <span className="bg-blue-200 text-blue-600 text-xs px-2 py-1 rounded">설정</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* 주소 입력 */}
                        <div className="relative flex-[2]">
                            <Input
                                placeholder="주소를 입력하세요"
                                className="w-full border border-blue-300 focus:ring-2 focus:ring-blue-500"
                                onChange={handleLocationChange}
                                onKeyDown={handleKeyDown}
                            />
                            {showList && addressList.length > 0 && (
                                <ul
                                    className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-gray-300 bg-white rounded-lg shadow-lg z-50"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    {addressList.map((address, index) => (
                                        <li
                                            key={index}
                                            onMouseDown={(e) => {
                                                setAdministrativeCode(address.address?.b_code || undefined);
                                                setShowList(false);
                                                e.preventDefault();
                                            }}
                                            className={`px-4 py-1 cursor-pointer ${
                                                selectedIndex === index ? 'bg-blue-100' : 'bg-white'
                                            } hover:bg-blue-50`}
                                        >
                                            {address.address_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* 난이도 및 행정동 코드 표현 */}
                        <div className="flex-[2] flex gap-4 items-center justify-center">
                            {/* 행정동 코드 */}
                            <div className="px-4 py-2 rounded-lg border bg-gray-100 border-gray-300 text-black">
                                <span className="text-sm font-medium">행정동 코드:</span>
                                <span className="ml-2 font-semibold">{administrativeCode}</span>
                            </div>
                            {/* 난이도 */}
                            <div className="px-4 py-2 rounded-lg border bg-gray-100 border-gray-300 text-black">
                                <span className="text-sm font-medium">난이도:</span>
                                <span className="ml-2 font-semibold">{difficulty}</span>
                            </div>
                        </div>
                    </div>
                    {/* 난이도 조정 */}
                    <div className="flex flex-wrap items-center gap-4 mt-6">
                        <InputNumber
                            className="w-32 border border-blue-300 focus:ring-2 focus:ring-blue-500"
                            min={0}
                            max={8}
                            value={difficulty}
                            onChange={(value) => setDifficulty(value ?? 0)}
                        />
                        <Button type="primary" className="bg-blue-600 hover:bg-blue-500">
                            수정
                        </Button>
                    </div>
                </div>

                {/* 오른쪽: 지역 리스트 섹션 */}
                <div className="flex flex-col flex-[1] bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">지역 난이도 리스트</h3>
                    <Table
                        dataSource={regionList}
                        columns={[
                            {
                                title: '행정동 코드',
                                dataIndex: 'cityCode',
                                key: 'cityCode',
                                width: '20%',
                            },
                            {
                                title: '주소',
                                dataIndex: 'address',
                                key: 'address',
                                width: '50%',
                            },
                            {
                                title: '난이도',
                                dataIndex: 'difficulty',
                                key: 'difficulty',
                                width: '30%',
                                render: (text) => (
                                    <span className="font-semibold text-gray-600">{text}</span>
                                ),
                            },
                        ]}
                        pagination={false}
                    />
                </div>
            </div>

            {/* 아이템 물품 및 특수일 섹션 */}
            <div className="flex flex-row justify-between rounded-lg shadow-md gap-8">
                {/* 아이템 물품 섹션 */}
                <div className="flex flex-col items-center flex-1 bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">아이템 물품</h3>
                    <UploadExcel
                        url={'/item'}
                        handleExcepUpload={handleExcepUpload}
                        fileName={"물품 업로드"}
                    />
                    <DownloadExcel
                        url={'/item'}
                        fileName={'item.xlsx'}
                        text={'물품 다운로드'}
                    />
                </div>

                {/* 특수일 섹션 */}
                <div className="flex flex-col items-center flex-1 bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">특수일</h3>
                    <UploadExcel
                        url={'/special-date'}
                        handleExcepUpload={handleExcepUpload}
                        fileName={"특수일 업로드"}
                    />
                    <DownloadExcel
                        url={'/special-date'}
                        fileName={'special-date.xlsx'}
                        text={'특수일 다운로드'}
                    />
                </div>
            </div>
        </div>

    );
};

export default SystemManagement;