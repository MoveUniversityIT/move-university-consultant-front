import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Divider, Form, message, Select, Typography} from "antd";
import AddressInput from "@/component/AddressInput";
import _ from "lodash";
import {useAddressSearch, useMuCalcConsultant, usePostSimpleEstimate, useRoadDistance} from "@hook/useConsultant";
import dayjs from "dayjs";
import CustomDatePicker from "@/component/CustomDatePicker";

const {Option} = Select;
const {Title, Paragraph} = Typography;

const MobilePage = () => {
    const [consultantDataForm, setConsultantDataForm] = useState(null);
    const [moveType, setMoveType] = useState(null);

    const [loadLocation, setLoadLocation] = useState('');
    const [loadCityCode, setLoadCityCode] = useState(null);
    const [showLoadAddressList, setShowLoadAddressList] = useState(false);
    const [loadAddressList, setLoadAddressList] = useState([]);

    const [locationSearch, setLocationSearch] = useState({});

    const [unloadLocation, setUnloadLocation] = useState('');
    const [unloadCityCode, setUnloadCityCode] = useState(null);
    const [showUnloadAddressList, setShowUnloadAddressList] = useState(false);
    const [unloadAddressList, setUnloadAddressList] = useState([]);

    const [dateCheckList, setDateCheckList] = useState([]);
    const [requestDate, setRequestDate] = useState(dayjs(new Date()));

    const [isAddFee, setIsAddFee] = useState(false);

    const [locationInfo, setLocationInfo] = useState({
        startX: null, startY: null, endX: null, endY: null
    });

    const [isLoadLocationError, setIsLoadLocationError] = useState(false);
    const [isUnloadLocationError, setIsUnloadLocationError] = useState(false);

    const {data: locationList} = useAddressSearch(locationSearch);

    const [skipAddressChangeEvent, setSkipAddressChangeEvent] = useState(false);

    const [distance, setDistance] = useState(0);

    const {isLoading: isDistanceData, data: roadDistanceData} = useRoadDistance(locationInfo);

    const [isFormValid, setIsFormValid] = useState(false);

    const {mutate: postCalcConsultant} = useMuCalcConsultant();

    const [estimatePrice, setEstimatePrice] = useState(0);
    const [depositPrice, setDepositPrice] = useState(0);

    const handleDateChange = (isNoHandsSon) => (date) => {
        if (isNoHandsSon) {
            setDateCheckList(["NO_HANDS_SON"]);
        } else {
            setDateCheckList([]);
        }

        setRequestDate(date);
    };

    const handleLocationChange = (setLocation, setShowList, locationType) => (e) => {
        if (skipAddressChangeEvent) {
            setSkipAddressChangeEvent(false);
            return;
        }

        const address = e.target.value;
        setLocation(address);
        setLocationSearch({address, locationType});

        setShowList(true);
        if (locationType === 'load') {
            setShowUnloadAddressList(false);
        } else {
            setShowLoadAddressList(false);
        }
    };

    const handleAddressSelect = (setLocation, setShowList, locationType) => (address) => {
        setLocation(address);
        setLocationSearch({address, locationType});
        setShowList(false);
    };

    const handleLoadCoordinates = (coordinates) => {
        setLocationInfo((prev) => ({
            ...prev,
            startX: coordinates?.x ?? null,
            startY: coordinates?.y ?? null,
            _trigger: Math.random()
        }));
    };

    const handleUnloadCoordinates = (coordinates) => {
        setLocationInfo((prev) => ({
            ...prev,
            endX: coordinates?.x ?? null,
            endY: coordinates?.y ?? null,
            _trigger: Math.random()
        }));
    }

    useEffect(() => {
        setEstimatePrice(0);
        setDepositPrice(0);
    }, [loadLocation, unloadLocation, requestDate, moveType]);

    useEffect(() => {
        if (locationSearch?.locationType === "load") {
            if (locationList) {
                setIsLoadLocationError(false);
                setLoadAddressList(locationList.address || []);

                if (locationSearch.address === locationList.address[0]?.address?.address_name) {
                    handleLoadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setLoadLocation, setShowLoadAddressList);
                    setLoadCityCode(locationList.address[0]?.address?.b_code?.trim() || null);
                }
            } else {
                if (!_.isEmpty(loadLocation)) {
                    setIsLoadLocationError(true);
                } else {
                    setIsLoadLocationError(false);
                }

                handleLoadCoordinates({x: null, y: null});
                setLoadCityCode(null);
                setDistance(0);
                setLoadAddressList([]);
            }
        } else if (locationSearch?.locationType === "unload") {
            if (locationList) {
                setIsUnloadLocationError(false);
                setUnloadAddressList(locationList.address || []);

                if (locationSearch.address === locationList.address[0]?.address?.address_name) {
                    handleUnloadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setUnloadLocation, setShowUnloadAddressList);
                    setUnloadCityCode(locationList.address[0]?.address?.b_code?.trim() || null);
                }
            } else {
                if (!_.isEmpty(unloadLocation)) {
                    setIsUnloadLocationError(true);
                } else {
                    setIsUnloadLocationError(false);
                }

                handleUnloadCoordinates({x: null, y: null});
                setUnloadCityCode(null);
                setDistance(0);
                setUnloadAddressList([]);
            }
        }

    }, [locationList, locationSearch]);

    useEffect(() => {
        if (roadDistanceData && roadDistanceData.distance !== "undefined") {
            const newDistance = Math.round(roadDistanceData.distance);
            setDistance(newDistance);
        }
    }, [roadDistanceData]);

    const calcEstimatePrice = (data) => {
        const estimate = data?.estimatePrice;

        let calcEstimate = estimate.estimatePrice;

        const value = 3;

        // 반올림 처리
        if (value === 5) {
            calcEstimate = Math.round(calcEstimate * 100) / 100;

            // 30만 미만일 경우 5천원 단위로 반올림
            if (calcEstimate < 300000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            }
            // 30만 이상 ~ 130만 미만일 경우 1만원 단위로 반올림
            else if (calcEstimate < 1300000) {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;

                const thousandWon = Math.floor(calcEstimate / 100000); // 10만 단위
                const tenThousandWon = calcEstimate % 100000; // 10만 단위 잔여값

                if (tenThousandWon > 60000 || tenThousandWon <= 10000 || tenThousandWon === 0) {
                    if (60000 < tenThousandWon && tenThousandWon < 100000) {
                        calcEstimate = (calcEstimate - tenThousandWon) + 80000;
                    } else {
                        calcEstimate = (thousandWon - 1) * 100000 + 80000;
                    }

                } else if (tenThousandWon > 10000 && tenThousandWon <= 60000) {
                    calcEstimate = Math.floor(calcEstimate / 100000) * 100000 + 40000;
                }

                if (calcEstimate <= 980000) {
                    calcEstimate += 5000;
                }

                calcEstimate = Math.round(calcEstimate);
            }
            // 130만 이상의 경우 5만원 단위 반올림
            else {
                calcEstimate = Math.round(calcEstimate / 50000) * 50000;
            }
        }else if( 1 <= value && value < 5) {
            const minEstimate = Math.round(estimate?.baseCost * 1.15);
            const midEstimate = estimate.estimatePrice;

            calcEstimate = minEstimate + ((midEstimate - minEstimate) / (5 - 1)) * (value - 1);
            calcEstimate = Math.round(calcEstimate / 5000) * 5000;

            if (calcEstimate <= 980000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            } else {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;
            }
        } else if (5 < value && value <= 10) {
            const midEstimate = estimate.estimatePrice;
            const maxEstimate = Math.round(estimate?.estimatePrice * 1.5);

            calcEstimate = midEstimate + ((maxEstimate - midEstimate) / (10 - 5)) * (value - 5);

            if (calcEstimate <= 980000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            } else {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;
            }
        }

        setEstimatePrice(calcEstimate);
        setDepositPrice(data?.totalCalcPrice);
    };

    const validateForm = () => {
        if (!loadLocation) {
            message.error({
                content: '상차지를 입력해주세요.',
                key: 'loadLocationError',
                duration: 2,
            });
            return false;
        }

        if (!unloadLocation) {
            message.error({
                content: '하차지를 입력해주세요.',
                key: 'unloadLocationError',
                duration: 2,
            });
            return false;
        }

        if (!moveType) {
            message.error({
                content: '이사종류를 선택해주세요.',
                key: 'moveTypeError',
                duration: 2,
            });
            return false;
        }

        if (isLoadLocationError) {
            message.error({
                content: '상차지 정보가 올바르지 않습니다.',
                key: 'isLoadLocationError',
                duration: 2,
            });
            return false;
        }

        if (isUnloadLocationError) {
            message.error({
                content: '하차지 정보가 올바르지 않습니다.',
                key: 'isUnloadLocationError',
                duration: 2,
            });
            return false;
        }

        if (!requestDate) {
            message.error({
                content: '요청일을 선택해주세요.',
                key: 'requestDate',
                duration: 2,
            });
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const formData = {
            loadLocationName: loadLocation,
            loadCityCode: loadCityCode.substring(0, 6),
            loadSubCityCode: loadCityCode.substring(6),
            loadMethodId: 1,
            loadMethodName: '엘레베이터',
            loadFloorNumber: 1,
            loadHelperPeople: [{gender: "male", peopleCount: 1}],
            unloadLocationName: unloadLocation,
            unloadCityCode: unloadCityCode.substring(0, 6),
            unloadSubCityCode: unloadCityCode.substring(6),
            unloadMethodId: 1,
            unloadMethodName: '엘레베이터',
            unloadFloorNumber: 1,
            unloadHelperPeople: [{gender: "male", peopleCount: 1}],
            moveTypeId: moveType,
            vehicleId: 1,
            vehicleName: '단순운송',
            vehicleCount: 1,
            distance,

            requestDate: requestDate.format("YYYY-MM-DD") || null,
            requestTime: '08:00',

            storageMoveTypeId: null,
            storageMoveTypeName: null,
            storageLoadRequestDate: null,
            storageLoadRequestTime: null,
            storageUnloadRequestDate: null,
            storageUnloadRequestTime: null,

            specialItems: {},
            employHelperPeople: [
                {
                    helperType: "TRANSPORT",
                    peopleCount: 0,
                },
                {
                    helperType: "PACKING_CLEANING",
                    peopleCount: 0,
                }
            ],
            isTogether: false,
            isAlone: false
        };

        // 단순운송
        if (moveType === '1' || moveType === '2') {
            formData.items = {
                '박스(포장됨)': {
                    'additionalPrice': 0,
                    'baseAdditionalFee': 0,
                    'disassemblyAdditionalFee': 0,
                    'installationAdditionalFee': 0,
                    'isDisassembly': "N",
                    'isInstallation': "N",
                    'itemCbm': 0.27,
                    'itemCount': 30,
                    'itemId': 149,
                    'itemName': "박스(포장됨)",
                    'requiredIsDisassembly': "N",
                    'requiredIsInstallation': "N",
                    'weight': 30
                }
            }

            formData.totalItemCbm = 8.1
        } else if (moveType === '3' || moveType === '4') {
            formData.items = {
                '박스(포장됨)': {
                    'additionalPrice': 0,
                    'baseAdditionalFee': 0,
                    'disassemblyAdditionalFee': 0,
                    'installationAdditionalFee': 0,
                    'isDisassembly': "N",
                    'isInstallation': "N",
                    'itemCbm': 0.27,
                    'itemCount': 15,
                    'itemId': 149,
                    'itemName': "박스(포장됨)",
                    'requiredIsDisassembly': "N",
                    'requiredIsInstallation': "N",
                    'weight': 30
                },
                '박스(필요)': {
                    'additionalPrice': 0,
                    'baseAdditionalFee': 0,
                    'disassemblyAdditionalFee': 0,
                    'installationAdditionalFee': 0,
                    'isDisassembly': "N",
                    'isInstallation': "N",
                    'itemCbm': 0.27,
                    'itemCount': 15,
                    'itemId': 150,
                    'itemName': "박스(필요)",
                    'requiredIsDisassembly': "N",
                    'requiredIsInstallation': "N",
                    'weight': 30
                },
            }

            formData.totalItemCbm = 8.1;
        }


        postCalcConsultant(formData,
            {
                onSuccess: (data) => {
                    calcEstimatePrice(data[0]);
                },
                onError: (error) => {
                    message.error({
                        content: error?.message,
                        key: 'difficultyLevel',
                        duration: 2,
                    });
                }
            }
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-2xl min-h-[90vh] p-8 bg-white rounded-lg shadow-lg">
                <h3 className="text-center text-3xl font-bold text-gray-800 mb-8">
                    이사 정보 입력
                </h3>

                <AddressInput
                    label='상차지'
                    location={loadLocation}
                    setCityCode={setLoadCityCode}
                    handleCoordinates={handleLoadCoordinates}
                    handleLocationChange={handleLocationChange(setLoadLocation, setShowLoadAddressList, 'load')}
                    addressList={loadAddressList}
                    showAddressList={showLoadAddressList}
                    setShowAddressList={setShowLoadAddressList}
                    onSelectAddress={handleAddressSelect(setLoadLocation, setShowLoadAddressList, 'load')}
                    setSkipAddressChangeEvent={setSkipAddressChangeEvent}
                    tabIndex={1}
                    isLocationError={isLoadLocationError}
                />

                <AddressInput
                    label='하차지'
                    location={unloadLocation}
                    setCityCode={setUnloadCityCode}
                    handleCoordinates={handleUnloadCoordinates}
                    handleLocationChange={handleLocationChange(setUnloadLocation, setShowUnloadAddressList, 'unload')}
                    addressList={unloadAddressList}
                    showAddressList={showUnloadAddressList}
                    setShowAddressList={setShowUnloadAddressList}
                    onSelectAddress={handleAddressSelect(setUnloadLocation, setShowUnloadAddressList, 'unload')}
                    setSkipAddressChangeEvent={setSkipAddressChangeEvent}
                    tabIndex={2}
                    isLocationError={isUnloadLocationError}
                />

                <div className="flex items-center w-full mb-4">
                    <label className="w-20 text-sm text-gray-700 font-medium">이사종류:</label>
                    <Select
                        className="w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="이사종류를 선택하세요"
                        value={moveType}
                        onChange={setMoveType}
                    >
                        <Option value="1">단순운송</Option>
                        <Option value="2">일반이사</Option>
                        <Option value="3">반포장이사</Option>
                        <Option value="4">포장이사</Option>
                    </Select>
                </div>

                <CustomDatePicker
                    label="요청일"
                    dateCheckList={dateCheckList}
                    requestDate={requestDate}
                    handleDateChange={handleDateChange}
                />

                <div className="mt-4">
                    <button
                        className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                        onClick={handleSubmit}
                    >
                        견적 금액 조회
                    </button>
                </div>

                <Divider />

                <div className="mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700">배차 금액</h4>
                        <p className="text-lg font-semibold text-green-500">{depositPrice?.toLocaleString()}원</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <h4 className="font-semibold text-gray-700">견적 금액</h4>
                        <p className="text-lg font-semibold text-blue-600">{estimatePrice?.toLocaleString()}원</p>
                    </div>
                    <hr className="my-4 border-gray-300"/>
                    <ul className="space-y-2 text-gray-600 list-disc list-inside">
                        <li>기본 물품 기준 배차가</li>
                        <li>상담봇 견적레버 3기준</li>
                        <li>1톤 한대 기준</li>
                        <li>여러 대면 대당 금액 증가필요</li>
                        <li>인부 필요시 금액 상승</li>
                    </ul>
                    <p className="mt-6 text-center text-lg text-gray-500">
                        <strong className="text-gray-700">정확한 금액은 상담봇2 참조</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MobilePage;
