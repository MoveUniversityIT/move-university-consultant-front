import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Form, message, Select, Typography} from "antd";
import AddressInput from "@/component/AddressInput";
import _ from "lodash";
import {useAddressSearch, usePostSimpleEstimate, useRoadDistance} from "@hook/useConsultant";

const {Option} = Select;
const {Title, Paragraph} = Typography;

const MobilePage = () => {
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

    const {mutate: postSimpleEstimate} = usePostSimpleEstimate();

    const [estimatePrice, setEstimatePrice] = useState(0);
    const [depositPrice, setDepositPrice] = useState(0);

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

    const calcEstimatePrice = (estimate) => {
        const minEstimate = Math.round(estimate.baseCost * 1.15);
        const midEstimate = estimate.estimatePrice;
        const maxEstimate = Math.round(estimate.estimatePrice * 1.5);

        let calcEstimate = estimate.estimatePrice;

        // 반올림 처리
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

        const calculatedDeposit = calcEstimate - estimate.totalCalcPrice;

        const adjustedDeposit =
            calculatedDeposit >= calcEstimate
                ? calcEstimate
                : calculatedDeposit;

        setEstimatePrice(calcEstimate);
        setDepositPrice(adjustedDeposit);
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

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return; // 유효성 검사가 실패하면 처리 중단
        }

        postSimpleEstimate(
            {
                loadLocation,
                unloadLocation,
                moveTypeId: moveType,
                loadCityCode,
                unloadCityCode,
                locationInfo,
                isAddFee,
                distance,
            },
            {
                onSuccess: (data) => {
                    calcEstimatePrice(data?.estimatePrice);
                }
            }
        );
    };

    return (
        <div style={{
            backgroundColor: "#f7f7f7",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 20px"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "500px",
                minHeight: "90vh",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}>
                <Title level={3} style={{textAlign: "center", marginBottom: "20px", color: "#333"}}>
                    이사 정보 입력
                </Title>

                <Form.Item
                    label="상차지"
                >
                    <AddressInput
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
                </Form.Item>

                {/* 하차지 */}
                <Form.Item
                    label="하차지"
                >
                    <AddressInput
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
                </Form.Item>

                {/* 이사종류 */}
                <Form.Item
                    label="이사종류"
                >
                    <Select
                        placeholder="이사종류를 선택하세요"
                        value={moveType}
                        onChange={setMoveType}
                    >
                        <Option value="1">단순운송</Option>
                        <Option value="2">일반이사</Option>
                        <Option value="3">반포장이사</Option>
                        <Option value="4">포장이사</Option>
                    </Select>
                </Form.Item>

                {/* 추가사항 */}
                <Form.Item label="추가사항">
                    <Checkbox
                        checked={isAddFee}
                        onChange={(e) => setIsAddFee(e.target.checked)}
                    >계단, 동승 등</Checkbox>
                </Form.Item>

                {/* 제출 버튼 */}
                <div style={{marginTop: "20px"}}>
                    <Button
                        type="primary"
                        block
                        style={{height: "45px", fontSize: "16px"}}
                        onClick={handleSubmit}
                    >
                        견적 금액 조회
                    </Button>
                </div>

                <div style={{marginTop: "30px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px"}}>
                    <Title level={4} style={{marginBottom: "10px"}}>
                        견적 금액: {estimatePrice?.toLocaleString()}원
                    </Title>
                    <Paragraph>배차가 기준 상담봇 견적레버(5)</Paragraph>
                    <ul>
                        <li>1톤 한대 기준</li>
                        <li>여러 대면 대당 금액 조금씩 증가</li>
                        <li>이사 몰리는 날은 금액 상승</li>
                        <li>좋지 않은 지역은 금액 상승</li>
                        <li>인부 필요 시 금액 상승</li>
                    </ul>
                    <Paragraph>
                        <strong>정확한 금액은 상담봇2 참조</strong>
                    </Paragraph>
                </div>
            </div>
        </div>
    );
};

export default MobilePage;
