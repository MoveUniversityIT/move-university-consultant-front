import React, {useEffect, useState} from "react";
import {Button, Card, Checkbox, Form, Input, InputNumber, message, Modal, Select, Spin, TimePicker} from "antd";
import dayjs from "dayjs";
import {useAddressSearch, useCalcConsultant, useRoadDistance} from "@hook/useConsultant";
import AddressInput from "@/component/AddressInput";
import MethodAndFloorInput from "@/component/MethodAndFloorInput";
import CustomDatePicker from "@/component/CustomDatePicker";
import koKR from "antd/es/date-picker/locale/ko_KR";
import ItemSearch from "@component/ItemSearch";
import _ from "lodash";
import PhoneNumberInput from "@component/PhoneNumberInput";
import {useSaveReservation} from "@hook/useUser";
import {useQueryClient} from "@tanstack/react-query";

const {Option} = Select;

const MoveInfo = ({
                      consultantData,
                      items,
                      setItems,
                      reservationData,
                      isNewMoveInfo,
                      setIsNewMoveInfo,
                      setDispatchAmount,
                      setIsDispatchAmount,
                      paymentMethod,
                      setPaymentMethod,
                      onReady
                  }) => {
    const queryClient = useQueryClient();

    const [reservationId, setReservationId] = useState(null);
    const [client, setClient] = useState({key: 1, value: '거래처1'});
    const [moveType, setMoveType] = useState(null);
    const [vehicleType, setVehicleType] = useState({key: 1, value: '카고'});
    const [vehicleTonnage, setVehicleTonnage] = useState(1);

    const [loadLocation, setLoadLocation] = useState('');
    const [loadCityCode, setLoadCityCode] = useState(null);
    const [loadAddressList, setLoadAddressList] = useState([]);
    const [loadMethod, setLoadMethod] = useState({key: 1, value: '엘레베이터'});
    const [loadFloor, setLoadFloor] = useState(1);
    const [loadArea, setLoadArea] = useState(1);
    const [loadHouseholdMembers, setLoadHouseholdMembers] = useState(0);
    const [loadCustomers, setLoadCustomers] = useState([]);
    const [showLoadAddressList, setShowLoadAddressList] = useState(false);

    const [unloadLocation, setUnloadLocation] = useState('');
    const [unloadCityCode, setUnloadCityCode] = useState(null);
    const [unloadAddressList, setUnloadAddressList] = useState([]);
    const [unloadMethod, setUnloadMethod] = useState({key: 1, value: '엘레베이터'});
    const [unloadFloor, setUnloadFloor] = useState(1);
    const [unloadArea, setUnloadArea] = useState(1);
    const [unloadHouseholdMembers, setUnloadHouseholdMembers] = useState(0);
    const [unloadCustomers, setUnloadCustomers] = useState([]);
    const [showUnloadAddressList, setShowUnloadAddressList] = useState(false);

    const [isTogether, setIsTogether] = useState(false);

    const [searchItemTerm, setSearchItemTerm] = useState('');
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


    const [consultantDataForm, setConsultantDataForm] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const {data: dispatchAmount, isLoading: isDispatchAmount, error: dispatchError} = useCalcConsultant(
        consultantDataForm,
        isFormValid
    );

    // const {mutate: consultantMutate} = useCalcConsultant();
    const {isLoading: isDistanceData, data: roadDistanceData} = useRoadDistance(locationInfo);

    const [specialItems, setSpecialItems] = useState([]);
    const [searchSpecialItemTerm, setSearchSpecialItemTerm] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');


    // 메모
    const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
    const [memo, setMemo] = useState("");

    const {mutate: reservationMutate} = useSaveReservation();

    useEffect(() => {
        if (
            locationInfo.startX &&
            locationInfo.startY &&
            locationInfo.endX &&
            locationInfo.endY &&
            locationInfo.startX === locationInfo.endX &&
            locationInfo.startY === locationInfo.endY
        ) {
            setDistance(0);
        }
    }, [locationInfo,]);

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

    // 상차 벙법 관련 메서드 구간
    const handleMethodChange = (setMethod) => (value, option) => {
        setMethod({key: option.key, value});
    };

    const handleFloorChange = (setFloor) => (value) => setFloor(value);

    useEffect(() => {
        if (locationSearch?.locationType === "load") {
            if (locationList) {
                setLoadAddressList(locationList.address || []);

                if (locationSearch.address === locationList.address[0]?.address?.address_name) {
                    handleLoadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setLoadLocation, setShowLoadAddressList);
                    setLoadCityCode(locationList.address[0]?.address?.b_code?.trim() || null);
                }
            } else {
                handleLoadCoordinates({x: null, y: null});
                setLoadCityCode(null);
                setLoadAddressList([]);
            }
        } else if (locationSearch?.locationType === "unload") {
            if (locationList) {
                setUnloadAddressList(locationList.address || []);

                if (locationSearch.address === locationList.address[0]?.address?.address_name) {
                    handleUnloadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setUnloadLocation, setShowUnloadAddressList);
                    setUnloadCityCode(locationList.address[0]?.address?.b_code?.trim() || null);
                }
            } else {
                handleUnloadCoordinates({x: null, y: null});
                setUnloadCityCode(null);
                setUnloadAddressList([]);
            }
        }

    }, [locationList, locationSearch]);

    useEffect(() => {
        if (roadDistanceData) {
            setDistance(Math.round(roadDistanceData));
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


    const removeTerm = (searchTerm, termsToRemove) => {
        const regex = new RegExp(`(,\\s*|^\\s*)(${termsToRemove.join('|')})(,\\s*|$)`, 'g');
        return searchTerm.replace(regex, (_, prefix, term, suffix) => {
            return prefix === ',' && suffix === ',' ? ',' : ''; // 양쪽이 콤마일 경우 콤마 유지
        }).trim();
    };

    const handleMoveTypeChange = (value, option) => {
        setMoveType({key: option.key, value});

        // if (value === '단순운송' || value === '일반이사') {
        //     Object.keys(items).forEach((key) => {
        //         console.log(items[key]);
        //         const item = items[key]?.itemName;
        //         if (['박스(필요)', '바구니(필요)'].some((exclude) => item === exclude)) {
        //             delete items[key];
        //         }
        //     });
        //     setItems({ ...items });
        //
        //     const termsToRemove = ["박스(필요)", "바구니(필요)"];
        //     console.log(removeTerm(searchTerm, termsToRemove))
        //     // setSearchTerm(removeTerm(searchTerm, termsToRemove));
        // }
    };

    const updateWorkerCount = (type, value) => {
        setHelpers((prevList) =>
            prevList.map((item) =>
                item.helperType === type
                    ? {...item, peopleCount: value}
                    : {...item}
            )
        );
    };

    const checkRequiredFields = () => {
        const emptyFields = [];

        if (_.isEmpty(loadLocation)) emptyFields.push("상차지");
        if (_.isEmpty(loadMethod)) emptyFields.push("상차 방법");
        if (_.isNull(loadFloor)) emptyFields.push("상차 층수");
        if (_.isEmpty(unloadLocation)) emptyFields.push("하차지");
        if (_.isEmpty(unloadMethod)) emptyFields.push("하차 방법");
        if (_.isNull(unloadFloor)) emptyFields.push("하차 층수");
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
                message.error({
                    content: "포장이사의 경우 박스(필요) 물품이 존재해야 합니다.",
                    key: 'packingBox',
                    duration: 3,
                });

                return false;
            }
        }

        if (emptyFields.length > 0) {
            // notification.error({
            //     message: "필수 입력 항목 누락",
            //     description: `다음 필드를 입력해주세요: ${emptyFields.join(", ")}`,
            //     placement: "top",
            //     style: {width: "700px", margin: "0 auto"},
            //     duration: 5,
            // });
            return false;
        }
        return true;
    };

    const resetState = () => {
        setReservationId(null);
        setClient({key: 1, value: '거래처1'});
        setDistance(0);

        setLoadLocation('');
        setLoadCityCode(null);
        setLoadMethod({key: 1, value: '엘레베이터'});
        setLoadFloor(1);
        setLoadArea(1);
        setLoadHouseholdMembers(0);
        setLoadCustomers([]);

        setUnloadLocation('');
        setUnloadCityCode(null);
        setUnloadMethod({key: 1, value: '엘레베이터'});
        setUnloadFloor(1);
        setUnloadArea(1);
        setUnloadHouseholdMembers(0);
        setUnloadCustomers([]);

        setLocationInfo({startX: null, startY: null, endX: null, endY: null});

        setMoveType(null);
        setRequestDate(dayjs(new Date()));
        setRequestTime(dayjs('08:00', 'HH:mm'));
        setIsTogether(false);

        setVehicleType({key: 1, value: '카고'});
        setVehicleTonnage(1);

        setHelpers([
            {helperType: 'TRANSPORT', peopleCount: 0},
            {helperType: 'PACKING_CLEANING', peopleCount: 0}
        ]);
        setItems([]);
        setSpecialItems([]);
        setCustomerName('');
        setCustomerPhoneNumber('');
        setPaymentMethod('현금');
        setMemo('');

        setSearchItemTerm('');
        setDispatchAmount(null);
        setConsultantDataForm(null);
        setIsFormValid(false);
    };

    const handleSave = () => {
        const reservationData = {
            reservationId,
            client: JSON.stringify(client), // JSON 객체를 문자열로 변환
            distance,

            loadLocation,           // 상차지
            loadCityCode,           // 상차지 행정동 코드
            loadMethod: JSON.stringify(loadMethod), // 필요 시 문자열로 변환
            loadFloor,              // 상차 층수
            loadArea,               // 상차 평수
            loadHouseholdMembers,   // 상차 거주 인원
            loadCustomers: JSON.stringify(loadCustomers), // 필요 시 문자열로 변환

            unloadLocation,         // 하차지
            unloadCityCode,         // 하차지 행정동 코드
            unloadMethod: JSON.stringify(unloadMethod), // 필요 시 문자열로 변환
            unloadFloor,            // 하차 층수
            unloadArea,             // 하차 평수
            unloadHouseholdMembers, // 하차 거주 인원
            unloadCustomers: JSON.stringify(unloadCustomers), // 필요 시 문자열로 변환

            locationInfo: JSON.stringify(locationInfo), // JSON 객체를 문자열로 변환

            moveType: JSON.stringify(moveType),               // 이사 종류
            requestDate: requestDate.format("YYYY-MM-DD"),
            requestTime: requestTime.format("HH:mm"),
            isTogether,

            vehicleType: JSON.stringify(vehicleType), // 필요 시 문자열로 변환
            vehicleTonnage,         // 톤수

            helpers: JSON.stringify(helpers), // JSON 객체 배열을 문자열로 변환

            searchItemTerm,
            items: JSON.stringify(items), // 필요 시 문자열로 변환

            searchSpecialItemTerm,
            specialItems: JSON.stringify(specialItems), // 필요 시 문자열로 변환
            customerName,
            customerPhoneNumber,
            paymentMethod,
            memo,
        };

        reservationMutate(reservationData, {
            onSuccess: (data) => {
                queryClient.invalidateQueries('reservation');
            }
        });
        // dispatch(addReservation(reservationData));
        resetState();
    };


    useEffect(() => {
        if (reservationData) {
            setReservationId(reservationData?.reservationId ?? null)
            setClient(reservationData?.client ?? {key: 1, value: '거래처1'});
            setDistance(reservationData?.distance ?? 0);

            setLoadLocation(reservationData?.loadLocation ?? '');
            setLoadCityCode(reservationData?.loadCityCode ?? null);
            setLoadMethod(reservationData?.loadMethod ?? {key: 1, value: '엘레베이터'});
            setLoadFloor(reservationData?.loadFloor ?? 1);
            setLoadArea(reservationData?.loadArea ?? 1);
            setLoadHouseholdMembers(reservationData?.loadHouseholdMembers ?? 0);
            setLoadCustomers(reservationData?.loadCustomers ?? []);

            setUnloadLocation(reservationData?.unloadLocation ?? '');
            setUnloadCityCode(reservationData?.unloadCityCode ?? null);
            setUnloadMethod(reservationData?.unloadMethod ?? {key: 1, value: '엘레베이터'});
            setUnloadFloor(reservationData?.unloadFloor ?? 1);
            setUnloadArea(reservationData?.unloadArea ?? 1);
            setUnloadHouseholdMembers(reservationData?.unloadHouseholdMembers ?? 0);
            setUnloadCustomers(reservationData?.unloadCustomers ?? []);

            setMoveType(reservationData?.moveType ?? null);
            setRequestDate(dayjs(reservationData.requestDate) ?? dayjs(new Date()));
            setRequestTime(dayjs(reservationData.requestTime, "HH:mm") ?? dayjs('08:00', 'HH:mm'));
            setIsTogether(reservationData?.isTogether ?? false);

            setVehicleType(reservationData?.vehicleType ?? null);
            setVehicleTonnage(reservationData?.vehicleTonnage ?? {key: 1, value: '카고'});

            setHelpers(reservationData?.helpers ?? [{helperType: 'TRANSPORT', peopleCount: 0},
                {helperType: 'PACKING_CLEANING', peopleCount: 0}]);
            setItems(reservationData?.items ?? []);
            setSpecialItems(reservationData?.specialItems ?? []);
            setCustomerName(reservationData?.customerName ?? '');
            setCustomerPhoneNumber(reservationData?.customerPhoneNumber ?? '');
            setPaymentMethod(reservationData?.paymentMethod ?? '현금');
            setMemo(reservationData?.memo ?? '');

            setSearchItemTerm(reservationData?.searchItemTerm ?? '');
            setSearchSpecialItemTerm(reservationData?.searchSpecialItemTerm ?? '');
        }
    }, [reservationData]);

    useEffect(() => {
        if (isNewMoveInfo) {
            resetState();
            setIsNewMoveInfo(false);
        }
    }, [isNewMoveInfo]);

    useEffect(() => {
        if (checkRequiredFields()) {
            const formData = {
                loadLocationName: loadLocation,
                loadCityCode: loadCityCode.substring(0, 6),
                loadSubCityCode: loadCityCode.substring(6),
                loadMethodId: loadMethod?.key,
                loadMethodName: loadMethod?.value,
                loadFloorNumber: loadFloor,
                loadHelperPeople: loadCustomers,
                unloadLocationName: unloadLocation,
                unloadCityCode: unloadCityCode.substring(0, 6),
                unloadSubCityCode: unloadCityCode.substring(6),
                unloadMethodId: unloadMethod?.key,
                unloadMethodName: unloadMethod?.value,
                unloadFloorNumber: unloadFloor,
                unloadHelperPeople: unloadCustomers,
                moveTypeId: moveType.key,
                moveTypeName: moveType.value,
                vehicleId: vehicleType.key,
                vehicleName: vehicleType.value,
                distance,
                requestDate: requestDate.format("YYYY-MM-DD") || null,
                requestTime: requestTime.format("HH:mm") || null,
                items,
                totalItemCbm,
                employHelperPeople: helpers,
            };

            const packingCleaningKey = "packing-cleaning-warning";
            const transportKey = "transport-warning";

            if (moveType.value !== '포장이사') {
                const packingCleaningHelper = helpers.find(helper => helper.helperType === 'PACKING_CLEANING');
                const peopleCount = packingCleaningHelper ? packingCleaningHelper.peopleCount : 0;

                if (peopleCount > 0) {
                    message.warning({
                        content: "이사종류: 포장이사가 아닌경우 추가 이모 설정은 무시 후 계산됩니다.",
                        key: packingCleaningKey,
                        duration: 3,
                    });
                } else {
                    message.destroy(packingCleaningKey);
                }
            }

            if (moveType.value === '단순운송') {
                const transportHelper = helpers.find(helper => helper.helperType === 'TRANSPORT');
                const packingCleaningHelper = helpers.find(helper => helper.helperType === 'PACKING_CLEANING');
                const totalPeople = transportHelper?.peopleCount ?? 0 + packingCleaningHelper?.peopleCount ?? 0;

                if (totalPeople > 0) {
                    message.warning({
                        content: "이사종류: 단순운송인 경우 추가 인부, 추가 이모 설정은 무시 후 계산됩니다.",
                        key: transportKey,
                        duration: 3,
                    });
                } else {
                    message.destroy(transportKey);
                }
            }

            setConsultantDataForm(formData);
            setIsFormValid(true);
        } else {
            setConsultantDataForm(null);
            setDispatchAmount(null);
            setIsFormValid(false);
        }
    }, [
        loadLocation,
        loadCityCode,
        loadMethod,
        loadFloor,
        loadCustomers,
        unloadLocation,
        unloadCityCode,
        unloadMethod,
        unloadFloor,
        unloadCustomers,
        moveType,
        vehicleType,
        distance,
        requestDate,
        requestTime,
        items,
        helpers,
    ]);

    useEffect(() => {
        setIsDispatchAmount(isDispatchAmount);
        if (dispatchAmount) {
            setDispatchAmount(dispatchAmount);
        }
    }, [isDispatchAmount, dispatchAmount]);

    return (
        <Card
            title="이사 정보"
            className="shadow-md rounded-md relative"
            style={{position: "relative"}}
        >
            {dispatchError && (
                <div
                    className="absolute mt-1 right-2 top-2 text-red-500 font-bold text-sm flex items-center justify-center"
                    style={{
                        color: "red",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(255, 235, 235, 0.8)", // 배경 추가(선택 사항)
                        borderRadius: "4px", // 둥근 테두리
                        padding: "4px 8px", // 텍스트 주위 여백
                        lineHeight: "1.5", // 텍스트 세로 정렬 개선
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // 약간의 그림자 효과(선택 사항)
                    }}
                >
                    {dispatchError?.message}
                </div>
            )}
            <Form layout="vertical">
                <div className="flex gap-1 items-center mb-2">
                    <div className="flex items-center w-2/5">
                        <label className="w-12 text-gray-700 font-medium">담당자:</label>
                        <Select
                            placeholder="예: 담당자"
                            className="min-w-32 border border-gray-300 rounded-lg"
                            value={consultantData?.userName}
                        >
                            <Option value={consultantData?.userName}>{consultantData?.userName}</Option>
                        </Select>
                    </div>

                    <div className="flex items-center w-2/5">
                        <label className="w-12 text-gray-700 font-medium">거래처:</label>
                        <Select
                            placeholder="예: 거래처"
                            className="w-32 border border-gray-300 rounded-lg"
                            value={client}
                            onChange={(value, option) => {
                                setClient({key: option.key, value});
                            }}
                        >
                            <Option value={1}>거래처1</Option>
                            <Option value={2}>거래처2</Option>
                        </Select>
                    </div>

                    <div className="flex items-center w-1.5/5">
                        <label className="w-10 text-gray-700 font-medium">거리:</label>
                        <div className="relative flex-1">
                            <Input
                                value={`${distance} Km`}
                                disabled
                                className="border border-gray-300 rounded-lg text-right"
                            />
                            <div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    opacity: isDistanceData ? 1 : 0,
                                    transition: "opacity 0.3s ease",
                                }}
                            >
                                <Spin size="small"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center mb-1">
                    <div className="flex-grow-[2] basis-[70%]">
                        <AddressInput
                            label="상차지"
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
                        customers={loadCustomers}
                        setMethod={setLoadMethod}
                        setFloor={setLoadFloor}
                        setArea={setLoadArea}
                        setHouseHoldMembers={setLoadHouseholdMembers}
                        setCustomers={setLoadCustomers}
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
                    handleLocationChange={handleLocationChange(setUnloadLocation, setShowUnloadAddressList, 'unload')}
                    addressList={unloadAddressList}
                    showAddressList={showUnloadAddressList}
                    setShowAddressList={setShowUnloadAddressList}
                    onSelectAddress={handleAddressSelect(setUnloadLocation, setShowUnloadAddressList, 'unload')}
                    setSkipAddressChangeEvent={setSkipAddressChangeEvent}
                    tabIndex={2}
                />

                <div className="flex items-center gap-4">
                    <MethodAndFloorInput
                        label="하차 방법"
                        method={unloadMethod}
                        floor={unloadFloor}
                        area={unloadArea}
                        householdMembers={unloadHouseholdMembers}
                        customers={unloadCustomers}
                        setMethod={setUnloadMethod}
                        setFloor={setUnloadFloor}
                        setArea={setUnloadArea}
                        setHouseHoldMembers={setUnloadHouseholdMembers}
                        setCustomers={setUnloadCustomers}
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
                                <Option key={moveType.moveTypeId} value={moveType.moveTypeName}>
                                    {moveType.moveTypeName}
                                </Option>
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
                                <Option key={vehicle.vehicleId} value={vehicle.vehicleName}>
                                    {vehicle.vehicleName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item className="flex flex-col !mb-1" style={{flex: "1.5 1 0"}}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">톤수:</label>
                    <Select
                        placeholder="예: 톤수"
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={vehicleTonnage}
                        listHeight={128}
                        onChange={(value) => setVehicleTonnage(value)}
                    >
                        <Option value="1">1</Option>
                        <Option value="1.4">1.4</Option>
                        <Option value="2.5">2.5</Option>
                        <Option value="3.5">3.5</Option>
                        <Option value="5">5</Option>
                        <Option value="7.5">7.5</Option>
                        <Option value="10">10</Option>
                        <Option value="15">15</Option>
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
                searchTerm={searchItemTerm}
                suggestions={suggestions}
                collapseItems={collapseItems}
                items={items}
                setItems={setItems}
                setSuggestions={setSuggestions}
                setSearchTerm={setSearchItemTerm}
                moveType={moveType}
                tabIndex={3}
            />
            <Form.Item className="relative !mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">특이사항:</label>
                <Input.TextArea
                    autoSize={{minRows: 2}}
                    className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchSpecialItemTerm}
                    onChange={(e) => setSearchSpecialItemTerm(e.target.value)}
                    tabIndex={4}
                />
            </Form.Item>
            <div className="flex gap-1 items-center">
                <Form.Item className="flex-1 !mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">화주이름:</label>
                    <Input
                        className="w-full"
                        placeholder="예: 이름"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </Form.Item>

                <PhoneNumberInput label='화주번호' phoneNumber={customerPhoneNumber}
                                  setPhoneNumber={setCustomerPhoneNumber}/>

                <Form.Item className="flex-1 !mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">결제방법:</label>
                    <Select
                        placeholder="예: 현금"
                        className="w-full"
                        value={paymentMethod}
                        onChange={(value) => setPaymentMethod(value)}
                    >
                        {["카드", "현금", "세금계산서", "현금영수증"].map((method) => (
                            <Option key={method} value={method}>
                                {method}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <Form.Item className="relative !mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">메모:</label>
                <Input.TextArea
                    autoSize={{minRows: 3, maxRows: 3}}
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
                        autoSize={{minRows: 10}}
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

                {/*<div>*/}
                {/*<Button onClick={fetchConsultant}*/}
                {/*        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">*/}
                {/*    배차 금액 조회*/}
                {/*</Button>*/}
                {/*</div>*/}
            </div>
        </Card>
    );
};

export default MoveInfo;