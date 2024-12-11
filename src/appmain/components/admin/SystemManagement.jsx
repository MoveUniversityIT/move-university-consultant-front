import React, {useEffect, useRef, useState} from 'react';
import UploadExcel from "@/component/UploadExcel";
import DownloadExcel from "@/component/DownloadExcel";
import {useQueryClient} from "@tanstack/react-query";
import {useDifficultyAddressSearch} from "@hook/useConsultant";
import {Button, Input, InputNumber, message} from "antd";
import {useDifficultyLevel, useUpdateDifficultyLevel} from "@hook/useAdmin";
import _ from "lodash";

const SystemManagement = () => {
    const queryClient = useQueryClient();
    const [location, setLocation] = useState("");
    const [showList, setShowList] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchTermRef = useRef(null);
    const [addressName, setAddressName] = useState('');
    const [administrativeCode, setAdministrativeCode] = useState('0');
    const [skipAddressChangeEvent, setSkipAddressChangeEvent] = useState(false);

    const [difficulty, setDifficulty] = useState(0);
    const [addressList, setAddressList] = useState([]);
    const {data: locationListData} = useDifficultyAddressSearch(location);
    const {data: difficultyData, error: difficultyError} = useDifficultyLevel(administrativeCode);
    const [bCodeError, setBCodeError] = useState(null);
    const {mutate: difficultyLevelMutate} = useUpdateDifficultyLevel();

    const handleExcepUpload = () => {
        queryClient.invalidateQueries('consultantMetadata');
    };

    const handleLocationChange = (e) => {
        const address = e.target.value;

        if (skipAddressChangeEvent) {
            setSkipAddressChangeEvent(false);
            return;
        }

        setLocation(address);
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
                e.preventDefault();
                setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();

                const selectedAddress = addressList[selectedIndex];

                const bCode = selectedAddress?.address?.b_code.toString();
                const addressName = selectedAddress?.address_name.trim();

                if(_.isEmpty(selectedAddress?.address?.b_code)) {
                    setBCodeError('카카오 API에서 행정동 코드를 찾을 수 없는 주소입니다.')
                }else {
                    setBCodeError(null)
                }

                setAddressList([]);
                setAdministrativeCode(bCode || undefined);
                setAddressName(addressName);
                setLocation(addressName);
                setShowList(false);
                setSkipAddressChangeEvent(true);
                setSelectedIndex(0);
            }
        } else {
            setSkipAddressChangeEvent(false);
        }
    };

    const handleSelectAddress = (address) => {
        if(!location) return;

        const bCode = address?.address?.b_code.toString();
        const addressName = address?.address?.address_name.trim();

        setAdministrativeCode(bCode || undefined);
        setAddressName(addressName);
        setLocation(addressName);
    }

    const handleUpdateDifficultyLevel = () => {
        const difficultyData = {
            bCode: administrativeCode,
            difficultyLevel: difficulty
        }

        difficultyLevelMutate(difficultyData, {
            onSuccess: (data) => {
                const successMessage = data?.message || "난이도 설정이 정상적으로 처리되었습니다.";
                message.success({
                    content: successMessage,
                    key: 'saveDifficultyLevel',
                    duration: 2,
                });

                queryClient.invalidateQueries('difficultyLevel');
            },
            onError: (error) => {
                const errorMessage = error?.errorMessage || "난이도 설정 중 에러가 발생했습니다";
                message.error({
                    content: errorMessage,
                    key: 'errorDifficultyLevel',
                    duration: 2,
                });
            }
        })
    }

    useEffect(() => {
        if(locationListData) {
            setAddressList(locationListData);
        }else {
            setAddressList([]);
        }

    }, [locationListData]);

    useEffect(() => {
        setDifficulty(difficultyData?.difficultyLevel || 0);
    }, [difficultyData])

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">기타 설정</h2>

            {/* 지역 설정 섹션 */}
            <div className="flex flex-row w-full mx-auto bg-white rounded-lg shadow-md p-6 gap-6 mb-8">
                {/* 왼쪽: 지역 설정 섹션 */}
                <div className="flex flex-col flex-[1] bg-gray-50 p-4 rounded-lg shadow-sm relative">
                    <div className="flex items-center mb-4 relative">
                        <h3 className="text-md font-semibold text-gray-700 mr-2">지역 난이도</h3>
                        <span className="bg-blue-200 text-blue-600 text-xs px-2 py-1 rounded">설정</span>
                        {difficultyError && (
                            <div
                                className="absolute right-0 flex items-center text-red-500 font-bold text-sm bg-red-100 px-3 py-1 rounded shadow-md mt-1"
                                style={{
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            >
                                {difficultyError?.errorMessage}
                            </div>
                        )}
                        {!difficultyError && bCodeError !== null && (
                            <div
                                className="absolute right-0 flex items-center text-red-500 font-bold text-sm bg-red-100 px-3 py-1 rounded shadow-md mt-1"
                                style={{
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            >
                                {bCodeError}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* 난이도 및 행정동 코드 표현 */}
                        <div className="flex flex-row gap-6 mt-4">
                            {/* 지역 이름 */}
                            <div
                                className="flex-1 px-4 py-3 rounded-lg border bg-gray-100 border-gray-300 text-black shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">지역 이름</h4>
                                <p className="text-base font-bold">{addressName || "선택된 지역 없음"}</p>
                            </div>
                            {/* 행정동 코드 */}
                            <div
                                className="flex-1 px-4 py-3 rounded-lg border bg-gray-100 border-gray-300 text-black shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">행정동 코드</h4>
                                <p className="text-base font-bold">{administrativeCode || "선택된 행정동 없음"}</p>
                            </div>
                            {/* 난이도 */}
                            <div
                                className="flex-1 px-4 py-3 rounded-lg border bg-gray-100 border-gray-300 text-black shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-600 mb-2">난이도</h4>
                                <p className="text-base font-bold">{difficulty || "0"}</p>
                            </div>
                        </div>
                        {/* 주소 입력 */}
                        <div className="relative">
                            <Input
                                ref={searchTermRef}
                                placeholder="주소를 입력하세요"
                                className="w-full border border-blue-300 focus:ring-2 focus:ring-blue-500"
                                value={location}
                                onChange={handleLocationChange}
                                onKeyDown={handleKeyDown}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
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
                                                e.preventDefault();
                                                handleSelectAddress(address);
                                                setShowList(false);
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
                        {/* 난이도 조정 */}
                        <div className="flex flex-wrap items-center gap-4">
                            <InputNumber
                                className="w-32 border border-blue-300 focus:ring-2 focus:ring-blue-500"
                                min={0}
                                max={9999}
                                value={difficulty}
                                onChange={(value) => setDifficulty(value ?? 0)}
                            />
                            <Button type="primary" className="bg-blue-600 hover:bg-blue-500" onClick={handleUpdateDifficultyLevel}>
                                수정
                            </Button>
                        </div>
                    </div>
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