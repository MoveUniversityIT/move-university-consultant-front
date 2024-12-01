import React, {useState} from 'react';
import UploadExcel from "@/component/UploadExcel";
import DownloadExcel from "@/component/DownloadExcel";
import {useQueryClient} from "@tanstack/react-query";
import {useAddressSearch} from "@hook/useConsultant";

const SystemManagement = () => {
    const queryClient = useQueryClient();
    const [location, setLocation] = useState("");
    const [showList, setShowList] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [difficulty, setDifficulty] = useState(null); // 난이도 값
    const [addressList, setAddressList] = useState([]);
    const {data: locationList} = useAddressSearch(location);

    const handleExcepUpload = () => {
        queryClient.invalidateQueries('consultantMetadata');
    };

    const handleLocationChange = (e) => {
        const address = e.target.value;
        setLocation(address);

        setShowList(true);
    };

    // const handleKeyDown = (e) => {
    //     if (setShowList && addressList.length > 0) {
    //         if (e.key === 'ArrowDown') {
    //             setSelectedIndex((prevIndex) => {
    //                 if (prevIndex <= -1) {
    //                     return 0;
    //                 }
    //                 return Math.min(prevIndex + 1, addressList.length - 1);
    //             });
    //         } else if (e.key === 'ArrowUp') {
    //             setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    //         } else if (e.key === 'Enter' && selectedIndex >= 0) {
    //             const selectedAddress = addressList[selectedIndex];
    //             const addressName = selectedAddress.address_name.trim();
    //
    //             setCityCode(selectedAddress.address?.b_code || undefined);
    //             handleCoordinates({x: selectedAddress.x, y: selectedAddress.y});
    //             onSelectAddress(addressName);
    //             setShowAddressList(false);
    //             setSkipAddressChangeEvent(true);
    //             setSelectedIndex(-1);
    //         }
    //     } else {
    //         setSkipAddressChangeEvent(false);
    //     }
    // };
    //
    // const handleUpdateDifficulty = () => {
    //     console.log("Updated Difficulty:", difficulty);
    //     // 업데이트 로직 추가
    // };
    //
    // useEffect(() => {
    //     if (locationList) {
    //         setLoadAddressList(locationList.address || []);
    //
    //         if (locationSearch.address === locationList.address[0]?.address?.address_name) {
    //             handleAddressSelect(setLoadLocation, setShowLoadAddressList);
    //             setLoadCityCode(locationList.address[0]?.address?.b_code?.trim() || null);
    //         }
    //     } else {
    //         handleLoadCoordinates({x: null, y: null});
    //         setLoadCityCode(null);
    //         setLoadAddressList([]);
    //     }
    // }, [locationList]);

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">시스템 설정</h2>
            {/* 지역 설정 섹션 */}
            {/*<div className="flex flex-col mb-6 bg-gray-50 p-4 rounded-md shadow-sm">*/}
            {/*    <h3 className="text-md font-semibold text-gray-700 mb-4">지역 설정</h3>*/}
            {/*    <div className="flex items-center gap-4">*/}
            {/*        <Input*/}
            {/*            placeholder="주소를 입력하세요"*/}
            {/*            value={location}*/}
            {/*            onChange={handleLocationChange}*/}
            {/*            onKeyDown={handleKeyDown}*/}
            {/*            onFocus={() => {*/}
            {/*                setShowAddressList(true);*/}
            {/*                setSelectedIndex(0);*/}
            {/*            }}*/}
            {/*            onBlur={() => setShowAddressList(false)}*/}
            {/*            className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"*/}
            {/*            tabIndex={tabIndex}*/}
            {/*        />*/}
            {/*        <span className="text-gray-700">난이도: {difficulty}</span>*/}
            {/*    </div>*/}
            {/*    <div className="flex items-center gap-4 mt-4">*/}
            {/*        <InputNumber*/}
            {/*            className="w-1/3"*/}
            {/*            min={1}*/}
            {/*            max={10}*/}
            {/*            value={difficulty}*/}
            {/*            onChange={(value) => setDifficulty(value)}*/}
            {/*        />*/}
            {/*        <Button type="primary" onClick={handleUpdateDifficulty}>*/}
            {/*            수정*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="flex flex-row justify-between gap-8">
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
                {/*  */}
            </div>
        </div>
    );
};

export default SystemManagement;