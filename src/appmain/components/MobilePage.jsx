import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Form, Select, Typography} from "antd";
import AddressInput from "@/component/AddressInput";
import _ from "lodash";
import {useAddressSearch, useRoadDistance} from "@hook/useConsultant";

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

    const [estimateVisible, setEstimateVisible] = useState(false);

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

    // 필드 유효성 검사
    useEffect(() => {
        if (loadLocation && unloadLocation && moveType && !isLoadLocationError && !isUnloadLocationError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [loadLocation, unloadLocation, moveType, isLoadLocationError, isUnloadLocationError]);

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

    const handleSubmit = () => {
        console.log({
            loadLocation,
            unloadLocation,
            moveType,
            additionalServices,
            loadCityCode,
            unloadCityCode,
            locationInfo,
            distance
        });

        setEstimateVisible(true); // 견적 정보 표시
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

                <Form layout="vertical">
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
                    <Form.Item label="추가사항" name="additionalServices">
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
                            disabled={!isFormValid}
                            loading={isDistanceData}
                        >
                            {isDistanceData ? "거리 계산 중..." : "간단 견적 금액 조회"}
                        </Button>
                    </div>
                </Form>

                <div style={{marginTop: "30px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px"}}>
                    <Title level={4} style={{marginBottom: "10px"}}>
                        견적가:
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
