import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Form, InputNumber, Layout, Modal, Select, TimePicker, Typography} from 'antd';
import {useAddressSearch, useCalcConsultant, useConsultantMetadata, useRoadDistance} from "@hook/useConsultant";
import _ from 'lodash';
import AddressInput from "@/component/AddressInput";
import MethodAndFloorInput from "@/component/MethodAndFloorInput";
import GenderSelector from "@/component/GenderSelector";
import dayjs from 'dayjs';
import AdminDispatchPrice from "@component/admin/AdminDispatchPrice";
import LeftSidebar from "@/component/LeftSidebar";
import {LeftOutlined, PlusOutlined, RightOutlined} from "@ant-design/icons";
import {v4 as uuidv4} from 'uuid';
import CustomProgress from "@/component/CustomProgress";
import CustomDatePicker from "@/component/CustomDatePicker";
import {useQueryClient} from "@tanstack/react-query";
import koKR from 'antd/es/date-picker/locale/ko_KR';
import ItemForm from "@/component/ItemForm";
import {Content, Header} from "antd/es/layout/layout";
import RightSideBar from "@/component/RightSidebar";
import {useReservation, useSaveReservation} from "@hook/useUser";
import {Option} from "antd/es/mentions";

const {Title} = Typography;

const Consultant = () => {
    const [moveType, setMoveType] = useState(null);
    const [vehicleType, setVehicleType] = useState({key: 1, value: '카고'});
    const [loadLocation, setLoadLocation] = useState('');
    const [loadCityCode, setLoadCityCode] = useState(null);
    const [unloadLocation, setUnloadLocation] = useState('');
    const [unloadCityCode, setUnloadCityCode] = useState(null);
    const [loadAddressList, setLoadAddressList] = useState([]);
    const [unloadAddressList, setUnloadAddressList] = useState([]);
    const [skipAddressChangeEvent, setSkipAddressChangeEvent] = useState(false);
    const [loadCustomer, setLoadCustomer] = useState([]);
    const [unloadCustomer, setUnloadCustomer] = useState([]);
    const [showLoadAddressList, setShowLoadAddressList] = useState(false);
    const [showUnloadAddressList, setShowUnloadAddressList] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const searchTermRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [items, setItems] = useState({});
    const [loadMethod, setLoadMethod] = useState({key: 1, value: '엘레베이터'});
    const [unloadMethod, setUnloadMethod] = useState({key: 1, value: '엘레베이터'});
    const [loadFloor, setLoadFloor] = useState(1);
    const [unloadFloor, setUnloadFloor] = useState(1);
    const [requestDate, setRequestDate] = useState(dayjs(new Date()));
    const [requestTime, setRequestTime] = useState(dayjs('08:00', 'HH:mm'));
    const [locationInfo, setLocationInfo] = useState({
        startX: null, startY: null, endX: null, endY: null
    });
    const [savedEntries, setSavedEntries] = useState([]);
    const [locationSearch, setLocationSearch] = useState({});
    const [totalItemCbm, setTotalItemCbm] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const {data: locationList} = useAddressSearch(locationSearch);
    const {isLoading, data: consultant, error: consultantMetaError} = useConsultantMetadata();
    const {data: roadDistanceData} = useRoadDistance(locationInfo);
    const [distance, setDistance] = useState(0);
    const queryClient = useQueryClient();
    const {isLoading: isLoadingConsultantMutate, mutate: consultantMutate, data: calcData} = useCalcConsultant();
    const [calcConsultantData, setCalcConsultantData] = useState(null);
    const [dateCheckList, setDateCheckList] = useState([]);     // 특수일 리스트

    // 물품
    const [isItemFormVisible, setIsItemFormVisible] = useState(false);

    const showItemFormModal = () => setIsItemFormVisible(true);
    const hideItemFormModal = () => setIsItemFormVisible(false);

    // 인부
    const [helpers, setHelpers] = useState([]);

    const resetForm = () => {
        // 폼 필드를 모두 초기화하는 함수
        setMoveType(null);
        setVehicleType({key: 1, value: '카고'});
        setLoadLocation('');
        setLoadCityCode(null);
        setUnloadLocation('');
        setUnloadCityCode(null);
        setLoadAddressList([]);
        setUnloadAddressList([]);
        setLoadCustomer([]);
        setUnloadCustomer([]);
        setShowLoadAddressList(false);
        setShowUnloadAddressList(false);
        setSearchTerm('');
        setSuggestions([]);
        setItems([]);
        setLoadMethod({key: 1, value: '엘레베이터'});
        setUnloadMethod({key: 1, value: '엘레베이터'});
        setLoadFloor(1);
        setUnloadFloor(1);
        setRequestDate(dayjs(new Date()));
        setRequestTime(dayjs('08:00', 'HH:mm'));
        setLocationInfo({
            startX: null, startY: null, endX: null, endY: null
        });
        setDistance(0);
        setTotalItemCbm(0);
        setCalcConsultantData(null);
        setDateCheckList([]);
        setHelpers([]);
    };

    const saveEntry = () => {
        // 현재 입력된 정보 저장
        const entry = {
            id: uuidv4(),
            moveType,
            vehicleType,
            loadLocation,
            loadCityCode,
            unloadLocation,
            unloadCityCode,
            loadHelperList: loadCustomer,
            unloadHelperList: unloadCustomer,
            searchTerm,
            locationInfo,
            loadMethod,
            unloadMethod,
            loadFloor,
            unloadFloor,
            requestDate,
            requestTime,
            totalItemCbm,
            distance,
            items,
            dateCheckList,
            helpers
        };
        setSavedEntries([...savedEntries, entry]);
        resetForm();
    };

    const loadSavedEntry = (entry) => {
        setMoveType(entry.moveType);
        setVehicleType(entry.vehicleType);
        setLoadLocation(entry.loadLocation);
        setLoadCityCode(entry.loadCityCode);
        setUnloadLocation(entry.unloadLocation);
        setUnloadCityCode(entry.unloadCityCode);
        setLoadCustomer(entry.loadHelperList);
        setSearchTerm(entry.searchTerm);
        setLocationInfo(entry.locationInfo);
        setUnloadCustomer(entry.unloadHelperList);
        setLoadMethod(entry.loadMethod);
        setUnloadMethod(entry.unloadMethod);
        setLoadFloor(entry.loadFloor);
        setUnloadFloor(entry.unloadFloor);
        setRequestDate(entry.requestDate);
        setRequestTime(entry.requestTime);
        setTotalItemCbm(entry.totalItemCbm);
        setDistance(entry.distance);
        setItems(entry.items);
        setDateCheckList(entry.dateCheckList);
        setHelpers(entry.helpers);
    };


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

    useEffect(() => {
        setCalcConsultantData(calcData);
    }, [calcData])

    useEffect(() => {
        if (roadDistanceData) {
            setDistance(roadDistanceData);
        }
    }, [roadDistanceData]);

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

    const handleMethodChange = (setMethod, setFloor) => (value, option) => {
        setMethod({key: option.key, value});
        setFloor(1);
    };

    const handleFloorChange = (setFloor) => (value) => setFloor(value);

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

        // 모든 필드를 검토한 후에 필요한 알림을 한 번에 표시
        if (emptyFields.length > 0) {
            alert(`다음 필드를 입력해주세요: ${emptyFields.join(", ")}`);
            return false;
        }
        return true;
    };


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

        consultantMutate(consultantDataForm, {
            onSuccess: (data) => {
                setIsCollapsed(false);
            },
            onError: () => {
                setIsCollapsed(true);
            }
        });
    };

    // 아이템 목록
    const collapseItems = Object.values(consultant?.items || {}).flat();

    const [skipChangeEvent, setSkipChangeEvent] = useState(false);

    const handleSelectItem = (item) => (e) => {
        const firstSuggestion = item;
        const terms = searchTerm.split(',').map(term => term.trim());

        // 마지막 항목을 첫 번째 추천 항목의 이름으로 대체
        terms[terms.length - 1] = firstSuggestion.itemName;
        const newSearchTerm = `${terms.join(', ')}`;

        const updatedItems = {};

        const itemPattern = /^(.+?)(?:\(([^)]*)\))?(\d*)$/;

        terms.forEach(term => {
            const match = term.match(itemPattern);

            if (match) {
                const itemName = `${match[1].trim()}${match[2] ? `(${match[2]})` : ''}`;
                const quantity = parseInt(match[3]) || 1;

                collapseItems.forEach(category => {
                    category.subcategories.forEach(subcategory => {
                        subcategory.items.forEach(item => {
                            if (item.itemName.toLowerCase() === itemName.toLowerCase()) {
                                if (updatedItems[item.itemId]) {
                                    updatedItems[item.itemId].itemCount += quantity;
                                } else {
                                    updatedItems[item.itemId] = {
                                        itemId: item.itemId,
                                        itemName: item.itemName,
                                        itemCount: quantity,
                                        isDisassembly: item.isDisassembly,
                                        isInstallation: item.isInstallation,
                                        requiredIsDisassembly: item.isDisassembly,
                                        requiredIsInstallation: items[item.itemId]?.requiredIsInstallation || "N"
                                    };
                                }
                            }
                        });
                    });
                });
            }
        });

        searchTermRef.current.focus();
        setItems(updatedItems);
        setSuggestions([]);
        setSearchTerm(`${newSearchTerm}, `);

        e.preventDefault();
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (suggestions.length > 0) {
                const firstSuggestion = suggestions[0];
                const cursorPosition = e.target.selectionStart;

                const beforeCursor = searchTerm.slice(0, cursorPosition);
                const afterCursor = searchTerm.slice(cursorPosition);

                const start = beforeCursor.lastIndexOf(',') + 1;
                const end = cursorPosition + (afterCursor.indexOf(',') === -1 ? afterCursor.length : afterCursor.indexOf(','));

                let newSearchTerm = `${searchTerm.slice(0, start)}${firstSuggestion.itemName}${searchTerm.slice(end)}`;

                if (!newSearchTerm.endsWith(', ')) {
                    newSearchTerm += ', ';
                }

                const terms = newSearchTerm.split(',').map(term => term.trim()).filter(term => term);
                const updatedItems = {};

                const itemPattern = /^(.+?)(?:\(([^)]*)\))?(\d*)$/;

                terms.forEach(term => {
                    const match = term.match(itemPattern);

                    if (match) {
                        const itemName = `${match[1].trim()}${match[2] ? `(${match[2]})` : ''}`;
                        const quantity = parseInt(match[3]) || 1;

                        collapseItems.forEach(category => {
                            category.subcategories.forEach(subcategory => {
                                subcategory.items.forEach(item => {
                                    if (item.itemName.toLowerCase() === itemName.toLowerCase()) {
                                        if (updatedItems[item.itemId]) {
                                            updatedItems[item.itemId].itemCount += quantity;
                                        } else {
                                            updatedItems[item.itemId] = {
                                                itemId: item.itemId,
                                                itemName: item.itemName,
                                                itemCount: quantity,
                                                isDisassembly: item.isDisassembly,
                                                isInstallation: item.isInstallation,
                                                requiredIsDisassembly: item.isDisassembly,
                                                requiredIsInstallation: items[item.itemId]?.requiredIsInstallation || "N"
                                            };
                                        }
                                    }
                                });
                            });
                        });
                    }
                });

                setItems(updatedItems);
                setSuggestions([]);
                setSearchTerm(newSearchTerm);
                e.preventDefault();
                setSkipChangeEvent(true);
            }
        } else {
            setSkipChangeEvent(false);
        }
    };

    const handleInputChange = (e) => {
        if (skipChangeEvent) {
            setSkipChangeEvent(false);
            return;
        }

        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;

        const beforeCursor = value.slice(0, cursorPosition);
        const afterCursor = value.slice(cursorPosition);

        const start = beforeCursor.lastIndexOf(',') + 1;
        const afterCommaIndex = afterCursor.indexOf(',');
        const end = afterCommaIndex === -1 ? value.length : cursorPosition + afterCommaIndex;

        const currentItem = value.slice(start, end).trim();

        if (start <= end) {
            const filteredSuggestions = collapseItems.flatMap((category) =>
                category.subcategories.flatMap((subcategory) =>
                    subcategory.items.filter((item) =>
                        item.itemName.toLowerCase().includes(currentItem.toLowerCase())
                    )
                )
            ).slice(0, 20);

            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }

        const terms = value.split(',').map((term) => term.trim()).filter((term) => term);

        const updatedItems = { ...items };

        const itemPattern = /^(.+?)(?:\(([^)]*)\))?(\d*)$/;

        terms.forEach((term) => {
            const match = term.match(itemPattern);

            if (match) {
                const itemName = `${match[1].trim()}${match[2] ? `(${match[2]})` : ''}`;
                const quantity = parseInt(match[3]) || 1;

                collapseItems.forEach((category) => {
                    category.subcategories.forEach((subcategory) => {
                        subcategory.items.forEach((item) => {
                            if (item.itemName.toLowerCase() === itemName.toLowerCase()) {
                                if (updatedItems[item.itemId]) {
                                    updatedItems[item.itemId].itemCount = quantity; // 기존 아이템 개수 업데이트
                                } else {
                                    updatedItems[item.itemId] = {
                                        itemId: item.itemId,
                                        itemName: item.itemName,
                                        itemCount: quantity,
                                        isDisassembly: item.isDisassembly,
                                        isInstallation: item.isInstallation,
                                        requiredIsDisassembly: item.isDisassembly,
                                        requiredIsInstallation:
                                            items[item.itemId]?.requiredIsInstallation || "N",
                                    };
                                }
                            }
                        });
                    });
                });
            }
        });

        setItems(updatedItems);
        setSearchTerm(value);
    };

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

    const handleMoveTypeChange = (value, option) => {
        setMoveType({key: option.key, value});
    };

    const deleteEntry = (id) => {
        setSavedEntries(savedEntries.filter(entry => entry.id !== id));
    };

    const handleExcepUpload = () => {
        queryClient.invalidateQueries('consultantMetadata');
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            {isLoading && (
                <CustomProgress isLoading={isLoading}/>
            )}

            {!isLoading && (
                consultantMetaError ? (
                    <Alert
                        message="서버와의 통신에 문제가 발생했습니다."
                        description="상담 봇 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.(관리자에게 문의바랍니다.)"
                        type="error"
                        showIcon
                        style={{marginTop: '20px'}}
                    />
                ) : (
                    <>
                        <LeftSidebar style={{width: "15%"}} resetForm={resetForm} saveEntry={saveEntry}
                                     savedEntries={savedEntries}
                                     loadSavedEntry={loadSavedEntry} deleteEntry={deleteEntry}/>

                        <Layout style={{width: "60%"}}>
                            <Header className="header">
                                <Title level={3} className="header-title">
                                    이사 정보
                                </Title>
                            </Header>

                            <Content className="content" style={{height: "100vh"}}>
                                <div className="form-container" style={{height: "100vh"}}>
                                    <Form layout="horizontal">
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

                                        <MethodAndFloorInput
                                            label="상차 방법"
                                            method={loadMethod}
                                            floor={loadFloor}
                                            setMethod={setLoadMethod}
                                            setFloor={setLoadFloor}
                                            consultant={consultant}
                                            handleMethodChange={handleMethodChange}
                                            handleFloorChange={handleFloorChange}
                                        />

                                        <GenderSelector
                                            label="상차 도움"
                                            customer={loadCustomer}
                                            setCustomer={setLoadCustomer}
                                        />

                                        <AddressInput
                                            label="하차지"
                                            location={unloadLocation}
                                            setLocation={setUnloadLocation}
                                            setCityCode={setUnloadCityCode}
                                            handleCoordinates={handleUnloadCoordinates}
                                            handleLocationChange={handleLocationChange(setUnloadLocation, setShowUnloadAddressList, 'end')}
                                            addressList={unloadAddressList}
                                            showAddressList={showUnloadAddressList}
                                            setShowAddressList={setShowUnloadAddressList}
                                            onSelectAddress={handleAddressSelect(setUnloadLocation, setShowUnloadAddressList, 'end')}
                                            setSkipAddressChangeEvent={setSkipAddressChangeEvent}
                                        />

                                        <MethodAndFloorInput
                                            label="하차 방법"
                                            method={unloadMethod}
                                            floor={unloadFloor}
                                            setMethod={setUnloadMethod}
                                            setFloor={setUnloadFloor}
                                            consultant={consultant}
                                            handleMethodChange={handleMethodChange}
                                            handleFloorChange={handleFloorChange}
                                        />

                                        <GenderSelector
                                            label="하차 도움"
                                            customer={unloadCustomer}
                                            setCustomer={setUnloadCustomer}
                                        />

                                        <Form.Item label="요청일">
                                            <CustomDatePicker requestDate={requestDate}
                                                              handleDateChange={handleDateChange}/>
                                        </Form.Item>

                                        <Form.Item label="요청시간">
                                            <TimePicker
                                                style={{width: "100%"}}
                                                value={requestTime}
                                                onChange={handleTimeChange}
                                                format="A h:mm"
                                                use12Hours
                                                minuteStep={60}
                                                locale={koKR}
                                            />
                                        </Form.Item>

                                        {/*<div>*/}
                                        {/*    <h3>선택된 아이템 목록:</h3>*/}
                                        {/*    {Object.values(items).map((item, index) => (*/}
                                        {/*        <Tag key={index}>*/}
                                        {/*            {item.itemName} {item.itemCount}개 /!* 아이템 이름과 개수 표시 *!/*/}
                                        {/*        </Tag>*/}
                                        {/*    ))}*/}
                                        {/*</div>*/}

                                        <Modal
                                            title="물품 등록"
                                            open={isItemFormVisible}
                                            onCancel={hideItemFormModal}
                                            footer={
                                                <Button onClick={hideItemFormModal} type="primary">
                                                    닫기
                                                </Button>
                                            }
                                            destroyOnClose
                                            width="80%"
                                        >
                                            <ItemForm
                                                searchTermRef={searchTermRef}
                                                onInputChange={handleInputChange}
                                                suggestions={suggestions}
                                                handleSelectItem={handleSelectItem}
                                                searchTerm={searchTerm}
                                                handleInputKeyDown={handleInputKeyDown}
                                                items={items}
                                                setItems={setItems}
                                            />
                                        </Modal>

                                        {consultant?.vehicles && (
                                            <Form.Item label="차량 종류">
                                                <Select
                                                    placeholder="예: 카고"
                                                    value={vehicleType}
                                                    onChange={(value, option) => {
                                                        setVehicleType({key: option.key, value})
                                                    }
                                                    }
                                                >
                                                    {consultant.vehicles.map((vehicle) => (
                                                        <Option key={vehicle.vehicleId}
                                                                       value={vehicle.vehicleName}>
                                                            {vehicle.vehicleName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        )}

                                        {consultant?.moveTypes && (
                                            <Form.Item label="이사 종류">
                                                <Select
                                                    placeholder="예: 단순운송"
                                                    value={moveType?.value}
                                                    onChange={handleMoveTypeChange}
                                                >
                                                    {consultant.moveTypes.map((moveType) => (
                                                        <Option key={moveType.moveTypeId}
                                                                       value={moveType.moveTypeName}>
                                                            {moveType.moveTypeName}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        )}

                                        <Form.Item label="총 CBM 설정">
                                            <InputNumber
                                                min={0}
                                                step={0.1}
                                                precision={1}
                                                placeholder="CBM 입력해주세요."
                                                value={totalItemCbm}
                                                onChange={(value) => setTotalItemCbm(value)}
                                                formatter={(value) => `${value} CBM`}
                                                parser={(value) => value.replace(' CBM', '')}
                                            />
                                        </Form.Item>

                                        {/*<HelperSelector label={"인부 설정"} helpers={helpers} setHelpers={setHelpers}*/}
                                        {/*                moveType={moveType}/>*/}

                                        <Form.Item>
                                            <Button type='primary' onClick={fetchConsultant} className="query-btn">
                                                배차 금액 조회
                                            </Button>
                                            <Button type="primary" onClick={saveEntry} className="save-btn">
                                                저장하기
                                            </Button>
                                            <Button type="primary" icon={<PlusOutlined/>} onClick={showItemFormModal}
                                                    className="item-btn">
                                                물품 등록
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Content>

                            {/*<Form.Item label="물품">*/}
                            {/*<Input*/}
                            {/*    ref={searchTermRef}*/}
                            {/*    placeholder="아이템 이름을 입력하고 콤마(,)로 구분하세요"*/}
                            {/*    value={searchTerm}*/}
                            {/*    onChange={handleInputChange}*/}
                            {/*    onKeyDown={handleInputKeyDown}*/}
                            {/*    style={{marginBottom: '8px', width: '100%'}}*/}
                            {/*/>*/}
                            {/*{errorMessage &&*/}
                            {/*    <div style={{color: 'red', marginTop: '4px'}}>{errorMessage}</div>}*/}
                            {/*{suggestions.length > 0 && (*/}
                            {/*    <div style={{*/}
                            {/*        display: 'flex',*/}
                            {/*        gap: '8px',*/}
                            {/*        flexWrap: 'wrap',*/}
                            {/*        marginTop: '8px'*/}
                            {/*    }}>*/}
                            {/*        {suggestions.map((item) => (*/}
                            {/*            <Tag*/}
                            {/*                key={item.itemId}*/}
                            {/*                onClick={handleSelectItem(item)}*/}
                            {/*                style={{cursor: 'pointer'}}*/}
                            {/*            >*/}
                            {/*                {item.itemName}*/}
                            {/*            </Tag>*/}
                            {/*        ))}*/}
                            {/*    </div>*/}
                            {/*)}*/}
                            {/*<div style={{marginTop: '8px'}}>*/}
                            {/*    <h3>선택된 아이템 목록:</h3>*/}
                            {/*    {items.map((item, index) => <Tag key={index}>{item.itemName}</Tag>)}*/}
                            {/*</div>*/}
                            {/*</Form.Item>*/}
                        </Layout>

                        <div className={`collapse-panel ${isCollapsed ? 'collapsed' : ''}`}>
                            <div
                                className="collapse-toggle"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                style={{
                                    right: isCollapsed ? '-20px' : '37%',
                                    transform: `translateY(-50%)`,
                                    overflow: "hidden"
                                }}
                            >
                                {isCollapsed ? <LeftOutlined/> : <RightOutlined/>}
                            </div>

                            {!isCollapsed && (
                                <div className="panel-content">
                                    <AdminDispatchPrice data={calcConsultantData}
                                                        isLoadingConsultantMutate={isLoadingConsultantMutate}/>
                                </div>
                            )}
                        </div>

                        <Layout style={{width: "35%"}}>
                            <Header className="header">
                                <Title level={3} className="header-title">
                                    배차 정보
                                </Title>
                            </Header>

                            <Content className="content" style={{height: "100vh"}}>
                                <div className="form-container" style={{height: "100vh"}}>
                                    <RightSideBar distance={distance} dateCheckList={dateCheckList}
                                                  handleExcepUpload={handleExcepUpload} consultant={consultant}/>
                                </div>
                            </Content>
                        </Layout>
                    </>
                )
            )}
        </Layout>
    );
};

export default Consultant;