import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Form, Input, InputNumber, message, Modal, notification, Select, TimePicker} from "antd";
import dayjs from "dayjs";
import {useAddressSearch, useCalcConsultant, useRoadDistance} from "@hook/useConsultant";
import AddressInput from "@/component/AddressInput";
import MethodAndFloorInput from "@/component/MethodAndFloorInput";
import CustomDatePicker from "@/component/CustomDatePicker";
import koKR from "antd/es/date-picker/locale/ko_KR";
import ItemSearch from "@component/ItemSearch";
import _ from "lodash";
import PhoneNumberInput from "@component/PhoneNumberInput";

const {Option} = Select;

const MoveInfo = ({consultantData, items, setItems, addReservation, initialData, setDispatchAmount, onReady}) => {
    const [moveType, setMoveType] = useState(null);
    const [vehicleType, setVehicleType] = useState({key: 1, value: '카고'});

    const [loadLocation, setLoadLocation] = useState('');
    const [loadCityCode, setLoadCityCode] = useState(null);
    const [loadAddressList, setLoadAddressList] = useState([]);
    const [loadMethod, setLoadMethod] = useState({key: 1, value: '엘레베이터'});
    const [loadFloor, setLoadFloor] = useState(null);
    const [loadArea, setLoadArea] = useState(1);
    const [loadHouseholdMembers, setLoadHouseholdMembers] = useState(0);
    const [loadCustomer, setLoadCustomer] = useState([]);
    const [showLoadAddressList, setShowLoadAddressList] = useState(false);


    const [unloadLocation, setUnloadLocation] = useState('');
    const [unloadCityCode, setUnloadCityCode] = useState(null);
    const [unloadAddressList, setUnloadAddressList] = useState([]);
    const [unloadMethod, setUnloadMethod] = useState({key: 1, value: '엘레베이터'});
    const [unloadFloor, setUnloadFloor] = useState(0);
    const [unloadArea, setUnloadArea] = useState(1);
    const [unloadHouseholdMembers, setUnloadHouseholdMembers] = useState(0);
    const [unloadCustomer, setUnloadCustomer] = useState([]);
    const [showUnloadAddressList, setShowUnloadAddressList] = useState(false);

    const [isTogether, setIsTogether] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const [suggestions, setSuggestions] = useState([]);


    const [skipAddressChangeEvent, setSkipAddressChangeEvent] = useState(false);


    const [requestDate, setRequestDate] = useState(dayjs(new Date()));
    const [requestTime, setRequestTime] = useState(dayjs('08:00', 'HH:mm'));
    const [locationInfo, setLocationInfo] = useState({
        startX: null, startY: null, endX: null, endY: null
    });

    const [distance, setDistance] = useState(0);
    const [helpers, setHelpers] = useState([
        {
            helperType: "TRANSPORT",
            peopleCount: 0,
        },
        {
            helperType: "PACKING_CLEANING",
            peopleCount: 0,
        }
    ]);

    // 아이템 목록
    const collapseItems = Object.values(consultantData?.items || {}).flat();

    const [totalItemCbm, setTotalItemCbm] = useState(0);

    const [isCollapsed, setIsCollapsed] = useState(true);

    const [locationSearch, setLocationSearch] = useState({});
    const {data: locationList} = useAddressSearch(locationSearch);

    const [calcConsultantData, setCalcConsultantData] = useState(null);
    const [dateCheckList, setDateCheckList] = useState([]);

    const {isLoading: isLoadingConsultantMutate, mutate: consultantMutate, data: calcData} = useCalcConsultant();
    const {data: roadDistanceData} = useRoadDistance(locationInfo);

    // 메모
    const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
    const [memo, setMemo] = useState("");

    useEffect(() => {

        const renderUI = () => {
            onReady();
        };

        renderUI();
    }, [consultantData, onReady]);

    const handleLoadCoordinates = (coordinates) => {
        setLocationInfo((prev) => ({
            ...prev,
            startX: coordinates?.x ?? null,
            startY: coordinates?.y ?? null
        }));
    };

    const handleUnloadCoordinates = (coordinates) => {
        setLocationInfo((prev) => ({
            ...prev,
            endX: coordinates?.x ?? null,
            endY: coordinates?.y ?? null
        }));
    }

    const handleLocationChange = (setLocation, setShowList, locationType) => (e) => {
        if (skipAddressChangeEvent) {
            setSkipAddressChangeEvent(false);
            return;
        }

        const address = e.target.value;
        setLocation(address);
        setLocationSearch({address, locationType});

        setShowList(true);
        if (locationType === 'start') {
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

    // 상차 벙법 관련 메서드 구간
    const handleMethodChange = (setMethod, setFloor) => (value, option) => {
        setMethod({key: option.key, value});
        setFloor(1);
    };

    const handleFloorChange = (setFloor) => (value) => setFloor(value);

    useEffect(() => {
        if (locationList && locationSearch?.address) {
            if (locationSearch?.address === loadLocation) {
                setLoadAddressList(locationList.address || []);

                if (loadLocation === locationList.address[0]?.address?.address_name) {
                    handleLoadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setLoadLocation, setShowLoadAddressList);
                    setLoadCityCode(locationList.address[0]?.address?.b_code?.trim() || null);
                }
            } else if (locationSearch?.address === unloadLocation) {
                setUnloadAddressList(locationList.address || []);

                if (unloadLocation === locationList.address[0]?.address?.address_name) {
                    handleUnloadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setUnloadLocation, setShowUnloadAddressList);
                    setUnloadCityCode(locationList.address[0]?.address?.b_code?.trim() || null);
                }
            }
        } else {
            if (locationSearch?.address === loadLocation) {
                handleLoadCoordinates({x: null, y: null});
                setLoadCityCode(null)
                setLoadAddressList([]);
            } else if (locationSearch?.address === unloadLocation) {
                handleUnloadCoordinates({x: null, y: null});
                setUnloadCityCode(null);
                setUnloadAddressList([]);
            }
        }

    }, [locationList, locationSearch]);

    useEffect(() => {
        if (roadDistanceData) {
            setDistance(roadDistanceData);
        }
    }, [roadDistanceData]);

    // 요청시간, 요청일 start
    const handleDateChange = (isNoHandsSon) => (date) => {
        if (isNoHandsSon) {
            setDateCheckList(["NO_HANDS_SON"]);
        } else {
            setDateCheckList([]);
        }

        setRequestDate(date);
    };

    const handleTimeChange = (time) => {
        setRequestTime(time);
    };

    // 요청시간, 요청일 end
    const handleMoveTypeChange = (value, option) => {
        setMoveType({key: option.key, value});
    };

    const updateWorkerCount = (type, value) => {
        setHelpers((prevList) =>
            prevList.map((item) =>
                item.helperType === type ? {...item, peopleCount: value} : item
            )
        );
    };

    const checkRequiredFields = () => {
        const emptyFields = [];

        if (_.isEmpty(loadLocation)) emptyFields.push("상차지");
        if (_.isEmpty(loadMethod)) emptyFields.push("상차 방법");
        if (_.isEmpty(unloadLocation)) emptyFields.push("하차지");
        if (_.isEmpty(unloadMethod)) emptyFields.push("하차 방법");
        if (_.isEmpty(items)) emptyFields.push("선택된 아이템");
        if (_.isEmpty(requestDate)) emptyFields.push("요청 날짜");
        if (_.isEmpty(requestTime)) emptyFields.push("요청 시간");
        if (_.isEmpty(vehicleType)) emptyFields.push("차량 종류");
        if (_.isEmpty(moveType)) emptyFields.push("이사 종류");

        if (_.isEmpty(loadCityCode)) emptyFields.push("상차지 법정동 코드");
        if (_.isEmpty(unloadCityCode)) emptyFields.push("하차지 법정동 코드");

        // 포장이사의 경우, 포장할 박스 여부 확인
        if (moveType?.value === "포장이사" && items) {
            const hasPackingBox = Object.values(items).some((item) => item.itemName === "박스(필요)");

            if (!hasPackingBox) {
                notification.error({
                    message: "포장할 박스",
                    description: `포장이사의 경우 박스(필요) 물품이 존재해야 합니다.`,
                    placement: "top",
                    style: {width: "700px", margin: "0 auto"},
                    duration: 5,
                });

                return false;
            }
        }

        if (emptyFields.length > 0) {
            notification.error({
                message: "필수 입력 항목 누락",
                description: `다음 필드를 입력해주세요: ${emptyFields.join(", ")}`,
                placement: "top",
                style: {width: "700px", margin: "0 auto"},
                duration: 5,
            });
            return false;
        }
        return true;
    };

    const resetState = () => {
        setMoveType(null);
        setVehicleType({key: 1, value: '카고'});
        setLoadLocation('');
        setLoadCityCode(null);
        setLoadMethod({key: 1, value: '엘레베이터'});
        setLoadFloor(null);
        setLoadArea(1);
        setLoadHouseholdMembers(0);
        setLoadCustomer([]);
        setUnloadLocation('');
        setUnloadCityCode(null);
        setUnloadMethod({key: 1, value: '엘레베이터'});
        setUnloadFloor(0);
        setUnloadArea(1);
        setUnloadHouseholdMembers(0);
        setUnloadCustomer([]);
        setIsTogether(false);
        setRequestDate(dayjs(new Date()));
        setRequestTime(dayjs('08:00', 'HH:mm'));
        setDistance(0);
        setHelpers([
            {helperType: 'TRANSPORT', peopleCount: 0},
            {helperType: 'PACKING_CLEANING', peopleCount: 0}
        ]);
        setItems([]);
    };

    const handleSave = () => {
        const reservationData = {
            moveType,
            vehicleType,
            loadLocation,
            loadCityCode,
            loadMethod,
            loadFloor,
            loadArea,
            loadHouseholdMembers,
            loadCustomer,
            unloadLocation,
            unloadCityCode,
            unloadMethod,
            unloadFloor,
            unloadArea,
            unloadHouseholdMembers,
            unloadCustomer,
            isTogether,
            requestDate: requestDate.format("YYYY-MM-DD"),
            requestTime: requestTime.format("HH:mm"),
            distance,
            helpers,
            items,
        };

        addReservation(reservationData);
        resetState();
    };

    useEffect(() => {
        if (initialData) {
            setMoveType(initialData.moveType);
            setVehicleType(initialData.vehicleType);
            setLoadLocation(initialData.loadLocation);
            setLoadCityCode(initialData.loadCityCode);
            setLoadMethod(initialData.loadMethod);
            setLoadFloor(initialData.loadFloor);
            setLoadArea(initialData.loadArea);
            setLoadHouseholdMembers(initialData.loadHouseholdMembers);
            setLoadCustomer(initialData.loadCustomer);
            setUnloadLocation(initialData.unloadLocation);
            setUnloadCityCode(initialData.unloadCityCode);
            setUnloadMethod(initialData.unloadMethod);
            setUnloadFloor(initialData.unloadFloor);
            setUnloadArea(initialData.unloadArea);
            setUnloadHouseholdMembers(initialData.unloadHouseholdMembers);
            setUnloadCustomer(initialData.unloadCustomer);
            setIsTogether(initialData.isTogether);
            setRequestDate(dayjs(initialData.requestDate));
            setRequestTime(dayjs(initialData.requestTime, "HH:mm"));
            setDistance(initialData.distance);
            setHelpers(initialData.helpers);
            setItems(items);
        } else {
            resetState();
        }
    }, [initialData]);


    const fetchConsultant = () => {
        if (!checkRequiredFields()) {
            setIsCollapsed(true);
            return;
        }

        const consultantDataForm = {
            loadLocationName: loadLocation,
            loadCityCode: loadCityCode.substring(0, 6),
            loadSubCityCode: loadCityCode.substring(6),
            loadMethodId: loadMethod?.key,
            loadMethodName: loadMethod?.value,
            loadFloorNumber: loadFloor,
            loadHelperPeople: loadCustomer,
            unloadLocationName: unloadLocation,
            unloadCityCode: unloadCityCode.substring(0, 6),
            unloadSubCityCode: unloadCityCode.substring(6),
            unloadMethodId: unloadMethod?.key,
            unloadMethodName: unloadMethod?.value,
            unloadFloorNumber: unloadFloor,
            unloadHelperPeople: unloadCustomer,
            moveTypeId: moveType.key,
            moveTypeName: moveType.value,
            vehicleId: vehicleType.key,
            vehicleName: vehicleType.value,
            distance,
            requestDate: requestDate.format('YYYY-MM-DD') || null,
            requestTime: requestTime.format('HH:mm') || null,
            items,
            totalItemCbm,
            employHelperPeople: helpers
        }
        
        if (moveType.value !== '포장이사') {
            const packingCleaningHelper = helpers.find(helper => helper.helperType === 'PACKING_CLEANING');

            const peopleCount = packingCleaningHelper ? packingCleaningHelper.peopleCount : 0;
            if(peopleCount > 0) {
                message.warning("이사종류: 포장이사가 아닌경우 추가 이모 설정은 무시 후 계산됩니다.");
            }
        }

        if (moveType.value === '단순운송') {
            const transportHelper = helpers.find(helper => helper.helperType === 'TRANSPORT');
            const packingCleaningHelper = helpers.find(helper => helper.helperType === 'PACKING_CLEANING');
            const totalPeople = transportHelper?.peopleCount ?? 0 + packingCleaningHelper?.peopleCount ?? 0;

            if(totalPeople > 0) {
                message.warning("이사종류: 단순운송인 경우 추가 인부, 추가 이모 설정은 무시 후 계산됩니다.");
            }
        }

        consultantMutate(consultantDataForm, {
            onSuccess: (data) => {
                setDispatchAmount(data);
            }
        });
    };

    return (
        <Card title="이사 정보" className="shadow-md rounded-md">
            <Form layout="vertical">
                <div className="flex gap-1 items-center mb-2">
                    <div className="flex items-center w-2/5">
                        <label className="w-12 text-gray-700 font-medium">담당자:</label>
                        <Select
                            placeholder="예: 담당자"
                            className="min-w-32 border border-gray-300 rounded-lg"
                            defaultValue={consultantData.userName}
                        >
                            <Option value={consultantData.userName}>{consultantData.userName}</Option>
                        </Select>
                    </div>

                    <div className="flex items-center w-2/5">
                        <label className="w-12 text-gray-700 font-medium">거래처:</label>
                        <Select
                            placeholder="예: 거래처"
                            className="w-32 border border-gray-300 rounded-lg"
                        >
                            <Option value="거래처1">거래처1</Option>
                            <Option value="거래처2">거래처2</Option>
                        </Select>
                    </div>

                    <div className="flex items-center w-1.5/5">
                        <label className="w-10 text-gray-700 font-medium">거리:</label>
                        <Input
                            value={`${distance} Km`}
                            disabled
                            className="flex-1 border border-gray-300 rounded-lg text-right"
                        />
                    </div>
                </div>

                <div className="flex gap-4 items-center mb-1">
                    <div className="flex-grow-[2] basis-[70%]">
                        <AddressInput
                            label="상차지"
                            location={loadLocation}
                            setCityCode={setLoadCityCode}
                            handleCoordinates={handleLoadCoordinates}
                            handleLocationChange={handleLocationChange(setLoadLocation, setShowLoadAddressList, 'start')}
                            addressList={loadAddressList}
                            showAddressList={showLoadAddressList}
                            setShowAddressList={setShowLoadAddressList}
                            onSelectAddress={handleAddressSelect(setLoadLocation, setShowLoadAddressList, 'start')}
                            setSkipAddressChangeEvent={setSkipAddressChangeEvent}
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <MethodAndFloorInput
                        label="상차 방법"
                        method={loadMethod}
                        floor={loadFloor}
                        area={loadArea}
                        householdMembers={loadHouseholdMembers}
                        customer={loadCustomer}
                        setMethod={setLoadMethod}
                        setFloor={setLoadFloor}
                        setArea={setLoadArea}
                        setHouseHoldMembers={setLoadHouseholdMembers}
                        setCustomer={setLoadCustomer}
                        consultant={consultantData}
                        handleMethodChange={handleMethodChange}
                        handleFloorChange={handleFloorChange}
                    />
                </div>

                <AddressInput
                    label="하차지"
                    location={unloadLocation}
                    setCityCode={setUnloadCityCode}
                    handleCoordinates={handleUnloadCoordinates}
                    handleLocationChange={handleLocationChange(setUnloadLocation, setShowUnloadAddressList, 'end')}
                    addressList={unloadAddressList}
                    showAddressList={showUnloadAddressList}
                    setShowAddressList={setShowUnloadAddressList}
                    onSelectAddress={handleAddressSelect(setUnloadLocation, setShowUnloadAddressList, 'end')}
                    setSkipAddressChangeEvent={setSkipAddressChangeEvent}
                />

                <div className="flex items-center gap-4">
                    <MethodAndFloorInput
                        label="하차 방법"
                        method={unloadMethod}
                        floor={unloadFloor}
                        area={unloadArea}
                        householdMembers={unloadHouseholdMembers}
                        customer={unloadCustomer}
                        setMethod={setUnloadMethod}
                        setFloor={setUnloadFloor}
                        setArea={setUnloadArea}
                        setHouseHoldMembers={setUnloadHouseholdMembers}
                        setCustomer={setUnloadCustomer}
                        consultant={consultantData}
                        handleMethodChange={handleMethodChange}
                        handleFloorChange={handleFloorChange}
                    />
                </div>
            </Form>

            <div className="flex gap-2 items-start mb-1">
                {consultantData?.moveTypes && (
                    <Form.Item className="flex-1 !mb-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">이사종류:</label>
                        <Select
                            placeholder="예: 단순운송"
                            value={moveType?.value}
                            onChange={handleMoveTypeChange}
                        >
                            {consultantData.moveTypes.map((moveType) => (
                                <Select.Option key={moveType.moveTypeId} value={moveType.moveTypeName}>
                                    {moveType.moveTypeName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item className="flex-1 !mb-1">
                    <CustomDatePicker
                        dateCheckList={dateCheckList}
                        requestDate={requestDate}
                        handleDateChange={handleDateChange}
                    />
                </Form.Item>

                <Form.Item className="flex-1 !mb-1">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">요청시간:</label>
                    <TimePicker
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={requestTime}
                        onChange={handleTimeChange}
                        format="A h:mm"
                        use12Hours
                        minuteStep={60}
                        locale={koKR}
                    />
                </Form.Item>

                <Form.Item className="!mb-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">동승:</label>
                    <Checkbox
                        checked={isTogether}
                        onChange={(e) => setIsTogether(e.target.checked)}
                        className="flex items-center justify-center"
                    />
                </Form.Item>
            </div>

            <div className="flex gap-2 items-start mb-1">
                {consultantData?.vehicles && (
                    <Form.Item className="flex flex-col !mb-1" style={{flex: "1.5 1 0"}}>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">차량종류:</label>
                        <Select
                            placeholder="카고"
                            value={vehicleType}
                            onChange={(value, option) => {
                                setVehicleType({key: option.key, value});
                            }}
                            className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {consultantData.vehicles.map((vehicle) => (
                                <Select.Option key={vehicle.vehicleId} value={vehicle.vehicleName}>
                                    {vehicle.vehicleName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item className="flex flex-col !mb-1" style={{flex: "1.5 1 0"}}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">톤수:</label>
                    <Select
                        placeholder="예: 톤수"
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue="1"
                        listHeight={128}
                    >
                        <Select.Option value="1">1</Select.Option>
                        <Select.Option value="1.4">1.4</Select.Option>
                        <Select.Option value="2.5">2.5</Select.Option>
                        <Select.Option value="3.5">3.5</Select.Option>
                        <Select.Option value="5">5</Select.Option>
                        <Select.Option value="7.5">7.5</Select.Option>
                        <Select.Option value="10">10</Select.Option>
                        <Select.Option value="15">15</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item className="flex flex-col !mb-1" style={{flex: "0.7 1 0"}}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">추가 인부:</label>
                    <InputNumber
                        min={0}
                        max={10}
                        value={
                            helpers.find((item) => item.helperType === "TRANSPORT")?.peopleCount || 0
                        }
                        onChange={(value) => updateWorkerCount("TRANSPORT", value)}
                        placeholder="인원 수"
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </Form.Item>

                <Form.Item className="flex flex-col !mb-1" style={{flex: "0.7 1 0"}}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">추가 이모:</label>
                    <InputNumber
                        min={0}
                        max={10}
                        value={
                            helpers.find((item) => item.helperType === "PACKING_CLEANING")
                                ?.peopleCount || 0
                        }
                        onChange={(value) => updateWorkerCount("PACKING_CLEANING", value)}
                        placeholder="인원 수"
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </Form.Item>
            </div>
            <ItemSearch
                searchTerm={searchTerm}
                suggestions={suggestions}
                collapseItems={collapseItems}
                items={items}
                setItems={setItems}
                setSuggestions={setSuggestions}
                setSearchTerm={setSearchTerm}
            />
            <Form.Item className="relative !mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">특이사항:</label>
                <Input.TextArea
                    autoSize={{minRows: 2}}
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </Form.Item>
            <div className="flex gap-1 items-center">
                <Form.Item className="flex-1 !mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">화주이름:</label>
                    <Input
                        className="w-full"
                        placeholder="예: 누구세요?"
                    />
                </Form.Item>

                <PhoneNumberInput/>

                <Form.Item className="flex-1 !mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">결제방법:</label>
                    <Select
                        placeholder="예: 카드"
                        className="w-full"
                    >
                        <Select.Option value="테스트">
                            테스트
                        </Select.Option>
                    </Select>
                </Form.Item>
            </div>
            <Form.Item className="relative !mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">메모:</label>
                <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={memo}
                    onClick={() => setIsMemoModalVisible(true)}
                    readOnly
                />

                <Modal
                    title="메모 작성"
                    open={isMemoModalVisible}
                    onCancel={() => setIsMemoModalVisible(false)}
                    width={800}
                    footer={[
                        <Button
                            key="ok"
                            type="primary"
                            onClick={() => setIsMemoModalVisible(false)}
                        >
                            확인
                        </Button>,
                    ]}
                >
                    <Input.TextArea
                        autoSize={{ minRows: 10 }}
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="메모를 입력하세요..."
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </Modal>
            </Form.Item>

            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    <Button
                        className="px-4 py-2 bg-gray-300 text-gray-800 border border-gray-400 rounded hover:bg-gray-400">
                        공차복사
                    </Button>
                    <Button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={handleSave}
                    >
                        저장
                    </Button>
                </div>

                <div>
                    <Button onClick={fetchConsultant}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        배차 금액 조회
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default MoveInfo;