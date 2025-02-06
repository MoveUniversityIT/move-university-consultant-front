import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    Checkbox,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Spin,
    TimePicker,
    Tooltip
} from "antd";
import dayjs from "dayjs";
import {useAddressSearch, useCalcConsultant, useRoadDistance} from "@hook/useConsultant";
import AddressInput from "@/component/AddressInput";
import MethodAndFloorInput from "@/component/MethodAndFloorInput";
import CustomDatePicker from "@/component/CustomDatePicker";
import koKR from "antd/es/date-picker/locale/ko_KR";
import ItemSearch from "@component/ItemSearch";
import _ from "lodash";
import PhoneNumberInput from "@component/PhoneNumberInput";
import {useSaveReservation, useSupabaseIntermediary, useSupabaseManager, useSupabaseSaveGongcha} from "@hook/useUser";
import {useQueryClient} from "@tanstack/react-query";
import SpecialItemSearch from "@component/SpecialItemSearch";
import {InfoCircleOutlined, SaveOutlined} from "@ant-design/icons";
import {FiTruck} from "react-icons/fi";

const {Option} = Select;

const gongchaMethods = ["사다리", "엘레베이터", "계단", "1층"];
const gongchaMoveTypes = ["단순운송", "일반이사", "반포장이사", "포장이사", "이모까지", "익스프레스", "보관이사"];
const gongchaPaymentTypes = ["현금", "카드", "현금영수증", "세금계산서"];

const getPriceByDistance = (dokchaPrices, distance) => {
    const priceInfo = dokchaPrices?.find(price =>
        distance >= price.minDistance && distance < price.maxDistance
    );
    return priceInfo ? priceInfo.price : 0;
}

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
                      onReady,
                      estimatePrice,
                      depositPrice,
                      sliderValue,
                      setSliderValue,
                      searchItemTerm,
                      setSearchItemTerm,
                      unregisterWord,
                      setUnregisterWord,
                      consultantDataForm,
                      setConsultantDataForm,
                      setDispatchCosts,
                      moveTypeCheckBoxes,
                      isFormValid,
                      setIsFormValid,
                      setDokchaPrice,
                      userId,
                      userName,
                      userOption,
                      setUserOption,
                      userList,
                      hasAdminAccess
                  }) => {
    const queryClient = useQueryClient();

    const [reservationId, setReservationId] = useState(null);
    const [client, setClient] = useState(null);
    const [moveType, setMoveType] = useState(null);
    const [storageMoveType, setStorageMoveType] = useState(null);

    const [vehicleType, setVehicleType] = useState({key: 1, value: '카고'});
    const [vehicleTonnage, setVehicleTonnage] = useState(1);
    const [vehicleCount, setVehicleCount] = useState(null);

    const [loadLocation, setLoadLocation] = useState('');
    const [loadCityCode, setLoadCityCode] = useState(null);
    const [loadAddressList, setLoadAddressList] = useState([]);
    const [loadMethod, setLoadMethod] = useState({key: 1, value: '엘레베이터'});
    const [loadFloor, setLoadFloor] = useState(1);
    const [loadArea, setLoadArea] = useState(1);
    const [loadHouseholdMembers, setLoadHouseholdMembers] = useState(0);
    const [loadCustomers, setLoadCustomers] = useState([]);
    const [showLoadAddressList, setShowLoadAddressList] = useState(false);
    const [isLoadLocationError, setIsLoadLocationError] = useState(false);

    const [unloadLocation, setUnloadLocation] = useState('');
    const [unloadCityCode, setUnloadCityCode] = useState(null);
    const [unloadAddressList, setUnloadAddressList] = useState([]);
    const [unloadMethod, setUnloadMethod] = useState({key: 1, value: '엘레베이터'});
    const [unloadFloor, setUnloadFloor] = useState(1);
    const [unloadArea, setUnloadArea] = useState(1);
    const [unloadHouseholdMembers, setUnloadHouseholdMembers] = useState(0);
    const [unloadCustomers, setUnloadCustomers] = useState([]);
    const [showUnloadAddressList, setShowUnloadAddressList] = useState(false);
    const [isUnloadLocationError, setIsUnloadLocationError] = useState(false);

    const [isTogether, setIsTogether] = useState(false);
    const [isAlone, setIsAlone] = useState(false);

    const [suggestions, setSuggestions] = useState([]);

    const [skipAddressChangeEvent, setSkipAddressChangeEvent] = useState(false);

    const [requestDate, setRequestDate] = useState(dayjs(new Date()));
    const [requestTime, setRequestTime] = useState(dayjs('08:00', 'HH:mm'));

    const [storageLoadRequestDate, setStorageLoadRequestDate] = useState(dayjs(new Date()));
    const [storageLoadRequestTime, setStorageLoadRequestTime] = useState(dayjs('08:00', 'HH:mm'));

    const [storageUnloadRequestDate, setStorageUnloadRequestDate] = useState(dayjs(new Date()));
    const [storageUnloadRequestTime, setStorageUnloadRequestTime] = useState(dayjs('08:00', 'HH:mm'));

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

    // 특이사항 목록
    const collapseSpecialItems = Object.values(consultantData?.specialItems || {}).flat();

    const [totalItemCbm, setTotalItemCbm] = useState(0);

    const [locationSearch, setLocationSearch] = useState({});
    const {data: locationList} = useAddressSearch(locationSearch);

    const [dateCheckList, setDateCheckList] = useState([]);
    const [storageLoadDateCheckList, setStorageLoadDateCheckList] = useState([]);
    const [storageUnloadDateCheckList, setStorageUnloadDateCheckList] = useState([]);

    const {data: dispatchAmount, isLoading: isDispatchAmount, error: dispatchError} = useCalcConsultant(
        consultantDataForm,
        isFormValid
    );

    // const {mutate: consultantMutate} = useCalcConsultant();
    const {isLoading: isDistanceData, data: roadDistanceData} = useRoadDistance(locationInfo);

    const [specialItems, setSpecialItems] = useState({});
    const [searchSpecialItemTerm, setSearchSpecialItemTerm] = useState('');
    const [specialItemSuggestions, setSpecialItemSuggestions] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');

    // 메모
    const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
    const [memo, setMemo] = useState("");

    const {mutate: reservationMutate} = useSaveReservation();

    // 공차 담당자 조회(UUID)
    const {data: supaManagerName} = useSupabaseManager(userOption);
    // 공차 거래처 조회
    const {data: supaIntermediaryName} = useSupabaseIntermediary(client?.value);

    const {mutate: saveGongchaMutate} = useSupabaseSaveGongcha();

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
    }, [locationInfo]);

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
                setDokchaPrice(0);
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
                setDokchaPrice(0);
                setUnloadAddressList([]);
            }
        }

    }, [locationList, locationSearch]);

    useEffect(() => {
        if (roadDistanceData && roadDistanceData.distance !== "undefined") {
            const newDistance = Math.round(roadDistanceData.distance);
            setDistance(newDistance);
            setDokchaPrice(getPriceByDistance(consultantData?.dokchaPrices, newDistance));
        }
    }, [roadDistanceData]);

    // 요청시간
    const handleDateChange = (isNoHandsSon) => (date) => {
        if (isNoHandsSon) {
            setDateCheckList(["NO_HANDS_SON"]);
        } else {
            setDateCheckList([]);
        }

        setRequestDate(date);
    };

    const handleStorageLoadDateChange = (isNoHandsSon) => (date) => {
        if (isNoHandsSon) {
            setStorageLoadDateCheckList(["NO_HANDS_SON"]);
        } else {
            setStorageLoadDateCheckList([]);
        }

        setStorageLoadRequestDate(date);
    };

    const handleStorageUnloadDateChange = (isNoHandsSon) => (date) => {
        if (isNoHandsSon) {
            setStorageUnloadDateCheckList(["NO_HANDS_SON"]);
        } else {
            setStorageUnloadDateCheckList([]);
        }

        setStorageUnloadRequestDate(date);
    };

    const handleTimeChange = (time) => {
        setRequestTime(time);
    };

    const handleStorageLoadTimeChange = (time) => {
        setStorageLoadRequestTime(time);
    };

    const handleStorageUnloadTimeChange = (time) => {
        setStorageUnloadRequestTime(time);
    };

    const handleMoveTypeChange = (setter) => (value, option) => {
        setter({key: option.key, value});

        const itemMapping = {
            '박스(필요)': '박스(포장됨)',
            '바구니(필요)': '바구니(포장됨)',
        };

        const reverseMapping = {
            '박스(포장됨)': '박스(필요)',
            '바구니(포장됨)': '바구니(필요)',
        };

        let updatedItems = {...items};

        if (value === '단순운송' || value === '일반이사') {
            Object.keys(updatedItems).forEach((key) => {
                const currentItem = updatedItems[key];
                const itemName = currentItem?.itemName;
                const itemCount = currentItem?.itemCount || 1;

                if (itemName in itemMapping) {
                    const newItemName = itemMapping[itemName];

                    const existingKey = Object.keys(updatedItems).find(
                        (k) => updatedItems[k]?.itemName === newItemName
                    );

                    if (existingKey) {
                        updatedItems[existingKey] = {
                            ...updatedItems[existingKey],
                            itemCount: (updatedItems[existingKey]?.itemCount || 0) + itemCount,
                            neededCount: itemCount,
                        };
                    } else {
                        updatedItems[newItemName] = {
                            ...currentItem,
                            itemName: newItemName,
                            neededCount: itemCount,
                        };
                    }

                    currentItem.itemCount -= itemCount;

                    if (currentItem.itemCount <= 0) {
                        delete updatedItems[key];
                    } else {
                        delete currentItem.neededCount;
                    }
                }
            });
        } else {
            Object.keys(updatedItems).forEach((key) => {
                const currentItem = updatedItems[key];
                const itemName = currentItem?.itemName;
                const itemCount = currentItem?.itemCount || 1;

                if (itemName in reverseMapping && currentItem?.neededCount) {
                    const originalItemName = reverseMapping[itemName];
                    const neededCount = currentItem.neededCount;

                    const existingKey = Object.keys(updatedItems).find(
                        (k) => updatedItems[k]?.itemName === originalItemName
                    );

                    if (existingKey) {
                        updatedItems[existingKey] = {
                            ...updatedItems[existingKey],
                            itemCount: (updatedItems[existingKey]?.itemCount || 0) + neededCount,
                        };
                    } else {
                        updatedItems[originalItemName] = {
                            ...currentItem,
                            itemName: originalItemName,
                            itemCount: neededCount,
                        };
                    }

                    currentItem.itemCount -= neededCount;

                    if (currentItem.itemCount <= 0) {
                        delete updatedItems[key];
                    } else {
                        delete currentItem.neededCount;
                    }
                }
            });
        }

        // 정렬 로직 추가: 특정 항목만 뒤로 이동
        updatedItems = Object.fromEntries(
            Object.entries(updatedItems).sort(([keyA, valueA], [keyB, valueB]) => {
                const targetItems = ['박스(포장됨)', '박스(필요)', '바구니(포장됨)', '바구니(필요)'];

                // valueA와 valueB의 itemName이 targetItems에 포함되는지 확인
                const indexA = targetItems.indexOf(valueA.itemName);
                const indexB = targetItems.indexOf(valueB.itemName);

                // 둘 다 targetItems에 포함되지 않은 경우 기존 순서 유지
                if (indexA === -1 && indexB === -1) return 0;

                // A만 targetItems에 포함되면 B가 앞쪽으로 이동
                if (indexA === -1) return -1;

                // B만 targetItems에 포함되면 A가 앞쪽으로 이동
                if (indexB === -1) return 1;

                // 둘 다 targetItems에 포함된 경우, targetItems 배열의 순서에 따라 정렬
                return indexA - indexB;
            })
        );

        // 검색어 업데이트
        const updatedSearchTerms = Object.values(updatedItems)
            .map((item) => {
                let tags = '';

                // 조건에 따라 tags 값 설정
                if (item?.requiredIsDisassembly === "Y" && item?.requiredIsInstallation === "Y") {
                    tags = "[분조]";
                } else if (item?.requiredIsDisassembly === "Y") {
                    tags = "[분]";
                } else if (item?.requiredIsInstallation === "Y") {
                    tags = "[조]";
                }

                // itemName 뒤에 tags 및 itemCount 처리
                return `${item.itemName}${tags}${item.itemCount <= 1 ? '' : item.itemCount}`;
            })
            .join(', ');

        setSearchItemTerm(updatedSearchTerms);
        setItems(updatedItems);
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
        if (_.isEmpty(vehicleType)) emptyFields.push("차량 종류");
        if (_.isEmpty(moveType)) emptyFields.push("이사 종류");

        if (_.isEmpty(loadCityCode)) emptyFields.push("상차지 법정동 코드");
        if (_.isEmpty(unloadCityCode)) emptyFields.push("하차지 법정동 코드");

        if (moveType?.value === "보관이사") {
            // 포장이사의 경우, 포장할 박스 여부 확인
            if (storageMoveType?.value === "포장이사" && items) {
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

            if (_.isEmpty(storageMoveType)) emptyFields.push("보관이사 종류");
            if (_.isEmpty(storageLoadRequestDate)) emptyFields.push("보관이사 상차 요청 날짜");
            if (_.isEmpty(storageLoadRequestTime)) emptyFields.push("요청 시간");
            if (_.isEmpty(storageLoadRequestDate)) emptyFields.push("요청 날짜");
            if (_.isEmpty(storageLoadRequestTime)) emptyFields.push("요청 시간");
        } else {
            if (_.isEmpty(requestDate)) emptyFields.push("요청 날짜");
            if (_.isEmpty(requestTime)) emptyFields.push("요청 시간");
        }

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
            return false;
        }
        return true;
    };

    const resetState = () => {
        setReservationId(null);
        setClient(null);
        setDistance(0);
        setDokchaPrice(0);

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

        setStorageMoveType(null);
        setStorageLoadRequestDate(dayjs(new Date()));
        setStorageLoadRequestTime(dayjs('08:00', 'HH:mm'));
        setStorageUnloadRequestDate(dayjs(new Date()));
        setStorageUnloadRequestTime(dayjs('08:00', 'HH:mm'));

        setIsTogether(false);
        setIsAlone(false);
        setVehicleType({key: 1, value: '카고'});
        setVehicleTonnage(1);
        setVehicleCount(null);

        setHelpers([
            {helperType: 'TRANSPORT', peopleCount: 0},
            {helperType: 'PACKING_CLEANING', peopleCount: 0}
        ]);
        setItems([]);
        setSpecialItems({});
        setCustomerName('');
        setCustomerPhoneNumber('');
        setPaymentMethod({key: 1, value: '현금'});
        setMemo('');

        setSearchItemTerm('');
        setUnregisterWord([]);
        setSearchSpecialItemTerm('');

        setSuggestions([]);
        setSpecialItemSuggestions([]);

        setDispatchAmount(null);
        setConsultantDataForm(null);
        setIsFormValid(false);

        setLoadAddressList([]);
        setUnloadAddressList([]);
        setSliderValue(5);
        setDispatchCosts({});

        setIsLoadLocationError(false);
        setIsUnloadLocationError(false);
    };

    const handleSave = () => {
        const reservationData = {
            userId: userOption?.userId,
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

            storageMoveType: JSON.stringify(storageMoveType),
            storageLoadRequestDate: storageLoadRequestDate.format("YYYY-MM-DD"),
            storageLoadRequestTime: storageLoadRequestTime.format("HH:mm"),
            storageUnloadRequestDate: storageUnloadRequestDate.format("YYYY-MM-DD"),
            storageUnloadRequestTime: storageUnloadRequestTime.format("HH:mm"),

            isTogether,
            isAlone,
            vehicleType: JSON.stringify(vehicleType), // 필요 시 문자열로 변환
            vehicleTonnage,         // 톤수
            vehicleCount,
            helpers: JSON.stringify(helpers), // JSON 객체 배열을 문자열로 변환
            searchItemTerm,
            items: JSON.stringify(items), // 필요 시 문자열로 변환
            searchSpecialItemTerm,
            specialItems: JSON.stringify(specialItems), // 필요 시 문자열로 변환
            customerName,
            customerPhoneNumber,
            paymentMethod: JSON.stringify(paymentMethod),
            memo,
            estimateLever: sliderValue      // 견적 금액 레버
        };

        reservationMutate({reservationData, hasAdminAccess}, {
            onSuccess: (data) => {
                const successMessage = data?.reservationId ? "정상적으로 저장되었습니다." : "정상적으로 처리되지 않았습니다.";
                message.success({
                    content: successMessage,
                    key: 'reservation',
                    duration: 1,
                });

                queryClient.invalidateQueries('reservation');
                setReservationId(data?.reservationId);
            },
            onError: (error) => {
                const errorMessage = error?.errorMessage || "상담 저장 중 에러가 발생했습니다";
                alert(errorMessage);
            },
        });
    };

    const getCustomerHelperText = (customers) => {
        let customer_helper = "";

        const maleData = customers.find(item => item.gender === 'male');
        const femaleData = customers.find(item => item.gender === 'female');

        customer_helper += maleData ? "남" + maleData.peopleCount : "";
        customer_helper += femaleData ? " 여" + femaleData.peopleCount : "";

        return customer_helper;
    }

    const mapShortItemNames = (inputItems) => {
        const itemMap = new Map();

        const newInputItems = inputItems.split(',').map(item => item.trim());

        newInputItems.forEach((input) => {
            const quantityMatch = input.match(/(\d+)$/);
            const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1;

            const cleanInput = quantityMatch
                ? input.slice(0, -quantityMatch[1].length).trim()
                : input;

            const cleanItemName = cleanInput.replace(/\[.*?\]/g, "").trim();

            let matchedShortName = null;

            collapseItems.forEach((category) => {
                category.subcategories.forEach((subcategory) => {
                    subcategory.items.forEach((item) => {
                        if (item.itemName === cleanItemName) {
                            matchedShortName = item.shortItemName;
                        }
                    });
                });
            });

            const finalName = matchedShortName || cleanItemName;

            if (finalName) {
                if (itemMap.has(finalName)) {
                    itemMap.set(finalName, itemMap.get(finalName) + quantity);
                } else {
                    itemMap.set(finalName, quantity);
                }
            }
        });

        // 텍스트 형식으로 변환
        const resultText = Array.from(itemMap)
            .map(([shortItemName, quantity]) => `${shortItemName}${quantity}`)
            .join(', ');

        return resultText;
    };

    const handleSort = (key, orderKey) => {
        const itemsArray = Object.values(items);

        const targetItems = ["박스(포장됨)", "박스(필요)", "바구니(포장됨)", "바구니(필요)"];

        // 정렬 수행
        const sortedItems = _.orderBy(
            itemsArray,
            [
                (item) => {
                    const index = targetItems.indexOf(item.itemName);
                    return index !== -1 ? index : -Infinity;
                },
                'additionalPrice', // 추가 요금
                'itemCbm',        // CBM
                'weight'          // 무게
            ],
            [
                'asc',
                orderKey,   // additionalPrice 기준
                orderKey,   // itemCbm 기준
                orderKey    // weight 기준
            ]
        );

        // 정렬된 배열을 객체로 변환
        const sortedItemsObject = sortedItems.reduce((acc, item) => {
            acc[item.itemName] = item;
            return acc;
        }, {});

        setItems(sortedItemsObject);

        // 검색어 업데이트
        const updatedSearchTerm = sortedItems
            .map((item) => {
                let tags = "";

                if (item.requiredIsDisassembly === "Y" && item.requiredIsInstallation === "Y") {
                    tags = "[분조]";
                } else if (item.requiredIsDisassembly === "Y") {
                    tags = "[분]";
                } else if (item.requiredIsInstallation === "Y") {
                    tags = "[조]";
                }

                const itemCount = item.itemCount && item.itemCount !== 1 ? item.itemCount : "";

                return `${item.itemName}${tags}${itemCount}`;
            })
            .join(", ");

        setSearchItemTerm(updatedSearchTerm);
    };

    const handleSaveGongcha = () => {
        let carry_type_start = gongchaMethods.indexOf(loadMethod?.value);
        let customer_helper_start = getCustomerHelperText(loadCustomers);
        let carry_type_end = gongchaMethods.indexOf(unloadMethod?.value);
        let customer_helper_end = getCustomerHelperText(unloadCustomers);
        let isa_type = gongchaMoveTypes.indexOf(moveType?.value);
        let payment_type = gongchaPaymentTypes.indexOf(paymentMethod?.value);
        let loadTransCount = 0;
        let unloadTransCount = 0;

        if (carry_type_start < 0) {
            carry_type_start = 3;
        }

        // 총 배차가격
        const totalCalcPrice = dispatchAmount[0]?.totalCalcPrice ?? 0;

        // 한대 차량가격
        const vehicleRoundingHalfUp = dispatchAmount[0]?.vehicleRoundingHalfUp ?? 0;

        // 인부 수량
        const transportHelperCount = dispatchAmount[0]?.helpers
            ? dispatchAmount[0].helpers.reduce((total, helper) => {
                if (helper.helperType === "TRANSPORT") {
                    if (helper.loadUnloadType === "LOAD") {
                        loadTransCount += helper.helperCount || 0;
                    } else if (helper.loadUnloadType === "UNLOAD") {
                        unloadTransCount += helper.helperCount || 0;
                    }
                    return Number(total) + Number(helper.helperCount || 0);
                }
                return total;
            }, 0)
            - Math.min(loadTransCount, unloadTransCount)?.toLocaleString()
            : 0;

        const cleaningHelperCount = dispatchAmount[0]?.helpers
            ? dispatchAmount[0].helpers.reduce((total, helper) => {
                if (helper.helperType === "PACKING_CLEANING") {
                    return Number(total) + Number(helper.helperCount || 0);
                }
                return total;
            }, 0)?.toLocaleString()
            : 0;

        // 추가 인부가격
        const transportHelperPrice = dispatchAmount[0]?.helpers
            ? dispatchAmount[0].helpers.reduce((total, helper) => {
                if (helper?.helperType === "TRANSPORT") {
                    return Number(total) + Number(helper?.totalHelperPrice || 0);
                }
                return total;
            }, 0)?.toLocaleString()
            : 0;

        // 추가 이모가격
        const cleaningHelperPrice = dispatchAmount[0]?.helpers
            ? dispatchAmount[0].helpers.reduce((total, helper) => {
                if (helper?.helperType === "PACKING_CLEANING") {
                    return Number(total) + Number(helper?.totalHelperPrice || 0);
                }
                return total;
            }, 0)?.toLocaleString()
            : 0

        const head_count = Number(dispatchAmount[0]?.vehicleCount) + Number(transportHelperCount) + Number(cleaningHelperCount);

        const dispatch_memo = `총 배차가격: ${totalCalcPrice?.toLocaleString()}, 한대 차량가격: ${vehicleRoundingHalfUp.toLocaleString()}, 추가 인부 가격: ${transportHelperPrice}, 추가 이모 가격: ${cleaningHelperPrice}`;

        const shortItemTerm = mapShortItemNames(searchItemTerm);
        // const searchItemTermAndSearchSpecialITemTerm = `${searchItemTerm}, ${searchSpecialItemTerm}`.replace(/,\s*$/, "");

        if(supaManagerName?.length === 0) {
            message.error({
                content: '담당자가 공차에 등록되어있지 않습니다.',
                key: 'errorGongcha',
                duration: 2,
            });

            return;
        }

        const gongchaData = {
            manager: supaManagerName[0]?.id,
            intermediary: supaIntermediaryName[0]?.id,
            start_addr: loadLocation,
            carry_type_start,
            floor_start: loadFloor,
            area_in_pyeong_start: loadArea,
            customer_help_start: customer_helper_start,
            end_addr: unloadLocation,
            carry_type_end,
            floor_end: unloadFloor,
            area_in_pyeong_end: unloadArea,
            customer_help_end: customer_helper_end,
            isa_type,
            request_date: requestDate.format("YYYY-MM-DD") || null,
            request_time: requestTime.format("HH:mm") || null,
            is_ride_sharing: isTogether,
            required_car_type: vehicleType?.value,
            required_car_ton: vehicleTonnage?.toString(),
            number_of_car_actual: dispatchAmount[0]?.vehicleCount,
            head_count: head_count,
            goods_name_abbreviation: shortItemTerm,
            goods_name: searchItemTerm,
            memo_dispatch: searchSpecialItemTerm,
            mng_name: customerName,
            start_mng_mobile: customerPhoneNumber,
            payment_type,
            memo,
            dispatch_memo,
            cash_pay1: totalCalcPrice,
            deposit: depositPrice,
            cash_bill: estimatePrice,
            status: 1
        }

        saveGongchaMutate(gongchaData, {
            onSuccess: (data) => {
                const successMessage = "공차등록이 정상적으로 처리되었습니다.";
                message.success({
                    content: successMessage,
                    key: 'saveGongcha',
                    duration: 2,
                });

                queryClient.invalidateQueries('reservation');
                setReservationId(data?.reservationId);
            },
            onError: (error) => {
                const errorMessage = error?.errorMessage || "공차등록 중 에러가 발생했습니다";
                message.error({
                    content: errorMessage,
                    key: 'errorSaveGongcha',
                    duration: 2,
                });
            },
        })
    }

    useEffect(() => {
        if (reservationData) {
            setReservationId(reservationData?.reservationId ?? null)
            setClient(reservationData?.client ?? null);
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

            setLocationInfo(reservationData?.locationInfo ?? {endY: null, endX: null, startY: null, startX: null});

            setMoveType(reservationData?.moveType ?? null);
            setStorageMoveType(reservationData?.storageMoveType ?? null);

            setRequestDate(dayjs(reservationData.requestDate) ?? dayjs(new Date()));
            setRequestTime(dayjs(reservationData.requestTime, "HH:mm") ?? dayjs('08:00', 'HH:mm'));

            setStorageLoadRequestDate(dayjs(reservationData.storageLoadRequestDate) ?? dayjs(new Date()));
            setStorageLoadRequestTime(dayjs(reservationData.storageLoadRequestTime, "HH:mm") ?? dayjs('08:00', 'HH:mm'));

            setStorageUnloadRequestDate(dayjs(reservationData.storageUnloadRequestDate) ?? dayjs(new Date()));
            setStorageUnloadRequestTime(dayjs(reservationData.storageUnloadRequestTime, "HH:mm") ?? dayjs('08:00', 'HH:mm'));

            setIsTogether(reservationData?.isTogether ?? false);
            setIsAlone(reservationData?.isAlone ?? false);

            setVehicleType(reservationData?.vehicleType ?? null);
            setVehicleTonnage(reservationData?.vehicleTonnage ?? {key: 1, value: '카고'});
            setVehicleCount(reservationData?.vehicleCount ?? null);

            setHelpers(reservationData?.helpers ?? [{helperType: 'TRANSPORT', peopleCount: 0},
                {helperType: 'PACKING_CLEANING', peopleCount: 0}]);
            setItems(reservationData?.items ?? []);
            setSpecialItems(reservationData?.specialItems ?? {});
            setCustomerName(reservationData?.customerName ?? '');
            setCustomerPhoneNumber(reservationData?.customerPhoneNumber ?? '');
            setPaymentMethod(reservationData?.paymentMethod ?? {key: 1, value: '현금'});
            setMemo(reservationData?.memo ?? '');

            setSearchItemTerm(reservationData?.searchItemTerm ?? '');
            setSearchSpecialItemTerm(reservationData?.searchSpecialItemTerm ?? '');
            setUnregisterWord([]);

            setIsLoadLocationError(false);
            setIsUnloadLocationError(false);

            setLoadAddressList([]);
            setUnloadAddressList([]);
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
                vehicleCount,
                distance,

                requestDate: requestDate.format("YYYY-MM-DD") || null,
                requestTime: requestTime.format("HH:mm") || null,

                storageMoveTypeId: storageMoveType?.key ?? null,
                storageMoveTypeName: storageMoveType?.value ?? null,
                storageLoadRequestDate: storageLoadRequestDate.format("YYYY-MM-DD") || null,
                storageLoadRequestTime: storageLoadRequestTime.format("HH:mm") || null,
                storageUnloadRequestDate: storageUnloadRequestDate.format("YYYY-MM-DD") || null,
                storageUnloadRequestTime: storageUnloadRequestTime.format("HH:mm") || null,

                items,
                specialItems,
                totalItemCbm,
                employHelperPeople: helpers,
                isTogether,
                isAlone
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

            if (moveType.value === '보관이사' && storageMoveType?.value !== '포장이사') {
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
        vehicleCount,
        distance,
        requestDate,
        requestTime,
        storageMoveType,
        storageLoadRequestDate,
        storageLoadRequestTime,
        storageUnloadRequestDate,
        storageUnloadRequestTime,
        items,
        specialItems,
        helpers,
        isTogether,
        isAlone
    ]);

    useEffect(() => {
        setIsDispatchAmount(isDispatchAmount);
        if (dispatchAmount) {
            setDispatchAmount(dispatchAmount);
        }
    }, [isDispatchAmount, dispatchAmount]);

    const confirmAction = (title, content, onConfirm) => {
        Modal.confirm({
            title,
            content,
            okText: "확인",
            cancelText: "취소",
            onOk: onConfirm,
        });
    };

    return (
        <Card
            title="이사 정보"
            className="shadow-md rounded-md relative"
        >
            <div
                className={`absolute mt-1 top-2 font-bold text-sm flex items-center justify-center ${
                    reservationId ? "text-orange-500" : "text-blue-500"
                }`}
                style={{
                    marginLeft: "4.5rem",
                    backgroundColor: reservationId
                        ? "rgba(255, 230, 204, 0.8)"
                        : "rgba(235, 245, 255, 0.8)",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    lineHeight: "1.5",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                {reservationId ? "수정" : "신규"}
            </div>

            {(dispatchError && (roadDistanceData?.code !==
                102 && roadDistanceData?.code !== 103)) && (
                <div
                    className="absolute mt-1 right-2 top-2 text-red-500 font-bold text-sm flex items-center justify-center"
                    style={{
                        color: "red",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(255, 235, 235, 0.8)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        lineHeight: "1.5",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    {dispatchError?.message}
                </div>
            )}
            {(roadDistanceData?.code === 102 || roadDistanceData?.code === 103) && (
                <div
                    className="absolute mt-1 right-2 top-2 text-red-500 font-bold text-sm flex items-center justify-center"
                    style={{
                        color: "red",
                        fontWeight: "bold",
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "rgba(255, 235, 235, 0.8)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        lineHeight: "1.5",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    {roadDistanceData?.message}
                </div>
            )}
            <Form layout="vertical">
                <div className="flex gap-1 items-center mb-2">
                    <div className="flex items-center w-2/5">
                        <label className="w-12 text-gray-700 font-medium">담당자:</label>
                        {userList?.length > 0 && (
                            <Select
                                placeholder="예: 담당자"
                                className="min-w-24 border border-gray-300 rounded-lg"
                                value={userOption?.userId}
                                onChange={(value, option) => {
                                    setUserOption({userId: option?.value, userName: option?.children});
                                }}
                            >
                                {userList
                                    ?.slice()
                                    .sort((a, b) => a.userName.localeCompare(b.userName, "ko-KR"))
                                    .map((user, index) => (
                                        <Option key={index} value={user?.userId}>{user?.userName}</Option>
                                    ))
                                }
                            </Select>
                        )}
                        {userList?.length === 0 && (
                            <div>
                                <Select
                                    placeholder="예: 담당자"
                                    className="min-w-24 border border-gray-300 rounded-lg"
                                    value={userOption?.userId}
                                    onChange={(value, option) => {
                                        setUserOption({userId: option?.value, userName: option?.children});
                                    }}
                                >
                                    <Option value={userId}>{userName}</Option>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center w-2/5">
                        <label className="w-12 text-gray-700 font-medium">거래처:</label>
                        <Select
                            placeholder="예: 거래처"
                            className={`min-w-32 border rounded-lg`}
                            value={client}
                            onChange={(value, option) => {
                                setClient({key: option.key, value});
                            }}
                        >
                            {["이사대학", "숨고", "위매치", "이사대학_ENG", "이사대학_CHN",
                                "이사대학_JAP", "아정당", "당근", "개인연락", "이사타임", "재이용",].map((name, index) => (
                                <Option key={index} value={name}>
                                    {name}
                                </Option>
                            ))}
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
                            isLocationError={isLoadLocationError}
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
                    isLocationError={isUnloadLocationError}
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
                    />
                </div>
            </Form>

            <div className="flex gap-2 items-start mb-1">
                {consultantData?.moveTypes && (
                    <Form.Item className="flex-1 !mb-1">
                        <div className="flex items-center">
                            <Tooltip className="mr-1 mb-1"
                                     title={
                                         <div className="text-sm">
                                             <strong>박스(필요), 바구니(필요) 기준:</strong> <br/>
                                             1대: 15박스, 2대: 27박스, 3대: 39박스, 4대: 51박스 <br/>
                                             <strong>추가:</strong> 첫 대는 <strong>15박스</strong>,
                                             이후 <strong>+12박스</strong>씩
                                             추가. <br/>
                                             <span className="text-red-500">※ 박스 수 차이가 클 경우 금액이 달라질 수 있습니다.</span>
                                         </div>
                                     }
                                     overlayStyle={{maxWidth: "400px"}}
                            >
                                <InfoCircleOutlined className="text-orange-400 cursor-pointer"/>
                            </Tooltip>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">이사 종류:</label>
                        </div>
                        <Select
                            placeholder="예: 단순운송"
                            value={moveType?.value}
                            onChange={handleMoveTypeChange(setMoveType)}
                        >
                            {consultantData.moveTypes
                                .filter((moveType) => moveType.moveTypeName !== "보관이사")
                                .map((moveType) => (
                                    <Option key={moveType.moveTypeId} value={moveType.moveTypeName}>
                                        {moveType.moveTypeName}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item className="flex-1 !mb-1">
                    <CustomDatePicker
                        label={moveType?.value !== '보관이사' ? "요청일:" : "상차 요청일:"}
                        dateCheckList={moveType?.value !== '보관이사' ? dateCheckList : storageLoadDateCheckList}
                        requestDate={moveType?.value !== '보관이사' ? requestDate : storageLoadRequestDate}
                        handleDateChange={moveType?.value !== '보관이사' ? handleDateChange : handleStorageLoadDateChange}
                    />
                </Form.Item>

                <Form.Item className="flex-1 !mb-1">
                    <label
                        className="text-sm font-medium text-gray-700 mb-1 block">{moveType?.value !== '보관이사' ? "요청 시간:" : "상차 요청 시간:"}</label>
                    <TimePicker
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={moveType?.value !== '보관이사' ? requestTime : storageLoadRequestTime}
                        onChange={moveType?.value !== '보관이사' ? handleTimeChange : handleStorageLoadTimeChange}
                        format="A h:mm"
                        use12Hours
                        minuteStep={30}
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

            {moveType?.value === '보관이사' && (
                <div className="flex gap-2 items-start mb-1">
                    <Form.Item className="flex-1 !mb-1">
                        <div className="flex items-center">
                            <Tooltip className="mr-1 mb-1"
                                     title={
                                         <div className="text-sm">
                                             <strong>박스(필요), 바구니(필요) 기준:</strong> <br/>
                                             1대: 15박스, 2대: 27박스, 3대: 39박스, 4대: 51박스 <br/>
                                             <strong>추가:</strong> 첫 대는 <strong>15박스</strong>,
                                             이후 <strong>+12박스</strong>씩
                                             추가. <br/>
                                             <span
                                                 className="text-red-500">※ 박스 수 차이가 클 경우 금액이 달라질 수 있습니다.</span>
                                         </div>
                                     }
                                     overlayStyle={{maxWidth: "400px"}}
                            >
                                <InfoCircleOutlined className="text-orange-400 cursor-pointer"/>
                            </Tooltip>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">보관이사 종류:</label>
                        </div>
                        <Select
                            placeholder="예: 단순운송"
                            value={storageMoveType?.value}
                            onChange={handleMoveTypeChange(setStorageMoveType)}
                        >
                            {consultantData.moveTypes
                                .filter((moveType) => moveType.moveTypeName !== "보관이사" && moveType.moveTypeName !== "단순운송")
                                .map((moveType) => (
                                    <Option key={moveType.moveTypeId} value={moveType.moveTypeName}>
                                        {moveType.moveTypeName}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item className="flex-1 !mb-1">
                        <CustomDatePicker
                            label={"하차 요청일:"}
                            dateCheckList={storageUnloadDateCheckList}
                            requestDate={storageUnloadRequestDate}
                            handleDateChange={handleStorageUnloadDateChange}
                        />
                    </Form.Item>

                    <Form.Item className="flex-1 !mb-1">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">하차 요청 시간:</label>
                        <TimePicker
                            className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={storageUnloadRequestTime}
                            onChange={handleStorageUnloadTimeChange}
                            format="A h:mm"
                            use12Hours
                            minuteStep={30}
                            locale={koKR}
                        />
                    </Form.Item>

                    <Form.Item className="!mb-1 invisible">
                        <div className="text-sm font-medium text-gray-700 mb-2 block">공백:</div>
                    </Form.Item>
                </div>
            )}

            <div className="flex gap-2 items-start mb-1">
                {consultantData?.vehicles && (
                    <Form.Item className="flex flex-col !mb-1" style={{flex: "0.8 1 0"}}>
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

                <Form.Item className="flex flex-col !mb-1" style={{flex: "0.7 1 0"}}>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">톤수:</label>
                    <Select
                        placeholder="예: 톤수"
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={vehicleTonnage}
                        listHeight={128}
                        onChange={(value) => setVehicleTonnage(value)}
                    >
                        <Option value="1">1</Option>
                    </Select>
                </Form.Item>

                <Form.Item className="flex flex-col !mb-1" style={{flex: "0.7 1 0"}}>
                    <div className="flex items-center mb-1">
                        <Tooltip className="mr-1"
                                 title={
                                     <>
                                         <span className="font-bold">빈값:</span> 자동으로 배차 대수가 계산됩니다. <br/>
                                         <span className="font-bold">입력값:</span> 배차 대수를 강제로 지정할 수 있습니다.
                                     </>
                                 }
                                 overlayStyle={{maxWidth: "400px"}}
                        >
                            <InfoCircleOutlined className="text-orange-400 cursor-pointer"/>
                        </Tooltip>
                        <label className="text-sm font-medium text-gray-700 block">배차 대수:</label>
                    </div>
                    <InputNumber
                        min={0}
                        max={10}
                        value={vehicleCount}
                        onChange={(value) => setVehicleCount(value === 0 ? null : value)}
                        placeholder="배차 조정"
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
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

                <Form.Item className="!mb-1">
                    <div className="flex items-center mb-1">
                        <Tooltip className="mr-1"
                                 title={
                                     <div className="text-sm">
                                         <strong>혼자:</strong> 물품무게로 인해 추가되는 인부 설정 무시합니다.<br/>
                                         <span className="text-red-500">※ 추가 인부, 추가 이모 설정에는 영향을 주지 않습니다.</span>
                                     </div>
                                 }
                                 overlayStyle={{maxWidth: "400px"}}
                        >
                            <InfoCircleOutlined className="text-orange-400 cursor-pointer"/>
                        </Tooltip>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">혼자:</label>
                    </div>
                    <Checkbox
                        checked={isAlone}
                        onChange={(e) => setIsAlone(e.target.checked)}
                        className="flex items-center justify-center"
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
                unregisterWord={unregisterWord}
                setUnregisterWord={setUnregisterWord}
                handleSort={handleSort}
                tabIndex={3}
            />
            <SpecialItemSearch
                searchSpecialItemTerm={searchSpecialItemTerm}
                setSearchSpecialItemTerm={setSearchSpecialItemTerm}
                specialItemSuggestions={specialItemSuggestions}
                setSpecialItemSuggestions={setSpecialItemSuggestions}
                collapseSpecialItems={collapseSpecialItems}
                specialItems={specialItems}
                setSpecialItems={setSpecialItems}
                tabIndex={4}
            />
            <div className="flex gap-1 items-center">
                <Form.Item className="flex-1 !mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">화주이름:</label>
                    <Input
                        className="w-full"
                        placeholder="예: 이름"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        tabIndex={5}
                    />
                </Form.Item>

                <PhoneNumberInput label='화주번호' phoneNumber={customerPhoneNumber}
                                  setPhoneNumber={setCustomerPhoneNumber}
                                  tabIndex={6}
                />

                <Form.Item className="flex-1 !mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">결제방법:</label>
                    <Select
                        placeholder="예: 현금"
                        className="w-full"
                        value={paymentMethod}
                        onChange={(value, option) => {
                            setPaymentMethod({key: option.key, value});
                        }}
                        tabIndex={7}
                    >
                        {["카드", "현금", "세금계산서", "현금영수증"].map((method, index) => (
                            <Option key={index} value={method}>
                                {method}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <Form.Item className="relative !mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">메모:</label>
                <div className="relative">
                    <Input.TextArea
                        autoSize={{minRows: 3, maxRows: 3}}
                        placeholder="메모를 입력하세요..."
                        className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        onChange={(e) => setMemo(e.target.value)}
                        value={memo}
                        tabIndex={8}
                    />
                    <button
                        type="button"
                        onClick={() => setIsMemoModalVisible(true)}
                        className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4h16v16H4V4z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 8h8M8 12h4"
                            />
                        </svg>
                    </button>
                </div>

                <Modal
                    title="메모 작성"
                    open={isMemoModalVisible}
                    onCancel={() => setIsMemoModalVisible(false)}
                    width={800}
                    style={{top: 60}}
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
                        autoSize={{minRows: 25}}
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
                        className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                        icon={<FiTruck/>}
                        onClick={() => {
                            if(client === null) {
                                message.error({
                                    content: "거래처 선택 후 다시 시도해주세요.",
                                    key: 'saveGongcha',
                                    duration: 3,
                                });

                                return;
                            }

                            if (!dispatchAmount || dispatchAmount.length < 1) {
                                message.error({
                                    content: "배차 금액 조회 후 다시 시도해주세요.",
                                    key: 'saveGongcha',
                                    duration: 3,
                                });

                                return;
                            }

                            confirmAction(
                                "공차등록 확인",
                                "정말로 이 데이터를 공차에 등록하시겠습니까?",
                                handleSaveGongcha
                            )
                        }}
                    >
                        공차등록
                    </Button>
                    <Button
                        className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                        icon={<SaveOutlined/>}
                        onClick={() => {
                            if(client === null) {
                                message.error({
                                    content: "거래처 선택 후 다시 시도해주세요.",
                                    key: 'saveGongcha',
                                    duration: 3,
                                });

                                return;
                            }
                            handleSave()
                        }}
                    >
                        저장
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default MoveInfo;