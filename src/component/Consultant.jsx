import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, DatePicker, Form, Input, InputNumber, Progress, Select, Tag, TimePicker, Typography} from 'antd';
import {useAddressSearch, useCalcConsultant, useConsultantMetadata, useRoadDistance} from "@hook/useConsultant";
import _ from 'lodash';
import AddressInput from "@/component/AddressInput";
import MethodAndFloorInput from "@/component/MethodAndFloorInput";
import GenderSelector from "@/component/GenderSelector";
import dayjs from 'dayjs';
import DispatchPrice from "@/component/DispatchPrice";
import LeftSidebar from "@/component/LeftSidebar";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {v4 as uuidv4} from 'uuid';

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
    const [loadHelperList, setLoadHelperList] = useState([]);
    const [unloadHelperList, setUnloadHelperList] = useState([]);
    const [showLoadAddressList, setShowLoadAddressList] = useState(false);
    const [showUnloadAddressList, setShowUnloadAddressList] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const searchTermRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [items, setItems] = useState([]);
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
    const [packedBoxes, setPackedBoxes] = useState(0);
    const [boxesToBePacked, setBoxesToBePacked] = useState(0);
    const [totalItemCbm, setTotalItemCbm] = useState(0);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const {data: locationList} = useAddressSearch(locationSearch);
    const {isLoading, data: consultant, error: consultantMetaError} = useConsultantMetadata();
    const {data: roadDistanceData} = useRoadDistance(locationInfo);
    const [distance, setDistance] = useState(null);
    const {isLoading: isLoadingConsultantMutate, mutate: consultantMutate, data: calcData} = useCalcConsultant();
    const [calcConsultantData, setCalcConsultantData] = useState(null);

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
        setLoadHelperList([]);
        setUnloadHelperList([]);
        setShowLoadAddressList(false);
        setShowUnloadAddressList(false);
        setSearchTerm('');
        setSuggestions([]);
        setErrorMessage('');
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
        setDistance(null);
        setPackedBoxes(0);
        setBoxesToBePacked(0);
        setTotalItemCbm(0);
        setCalcConsultantData(null);
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
            loadHelperList,
            unloadHelperList,
            searchTerm,
            locationInfo,
            loadMethod,
            unloadMethod,
            loadFloor,
            unloadFloor,
            requestDate,
            requestTime,
            packedBoxes,
            boxesToBePacked,
            totalItemCbm,
            distance,
            items,
        };
        setSavedEntries([...savedEntries, entry]);
        resetForm();
    };

    const loadSavedEntry = (entry) => {
        // 저장된 정보 불러오기
        setMoveType(entry.moveType);
        setVehicleType(entry.vehicleType);
        setLoadLocation(entry.loadLocation);
        setLoadCityCode(entry.loadCityCode);
        setUnloadLocation(entry.unloadLocation);
        setUnloadCityCode(entry.unloadCityCode);
        setLoadHelperList(entry.loadHelperList);
        setSearchTerm(entry.searchTerm);
        setLocationInfo(entry.locationInfo);
        setUnloadHelperList(entry.unloadHelperList);
        setLoadMethod(entry.loadMethod);
        setUnloadMethod(entry.unloadMethod);
        setLoadFloor(entry.loadFloor);
        setUnloadFloor(entry.unloadFloor);
        setRequestDate(entry.requestDate);
        setRequestTime(entry.requestTime);
        setPackedBoxes(entry.packedBoxes);
        setBoxesToBePacked(entry.boxesToBePacked);
        setTotalItemCbm(entry.totalItemCbm);
        setDistance(entry.distance);
        setItems(entry.items);
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

    // `locationList` 업데이트 시 `addressList` 업데이트
    useEffect(() => {
        if (locationList && locationSearch?.address) {
            if (locationSearch?.address === loadLocation) {
                setLoadAddressList(locationList.address || []);
                setShowLoadAddressList(true);

                if (loadLocation === locationList.address[0]?.address_name) {
                    handleLoadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setLoadLocation, setShowLoadAddressList);
                    setLoadCityCode(locationList.address[0]?.address?.b_code || null);
                }
            } else if (locationSearch?.address === unloadLocation) {
                setUnloadAddressList(locationList.address || []);
                setShowUnloadAddressList(true);

                if (unloadLocation === locationList.address[0]?.address_name) {
                    handleUnloadCoordinates({x: locationList.address[0]?.x, y: locationList.address[0]?.y});
                    handleAddressSelect(setUnloadLocation, setShowUnloadAddressList);
                    setUnloadCityCode(locationList.address[0]?.address?.b_code || null);
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

    const handleAddressSelect = (setLocation, setShowList) => (address) => {
        setLocation(address);
        setShowList(false);
    };

    const handleMethodChange = (setMethod, setFloor) => (value, option) => {
        setMethod({key: option.key, value});
        setFloor(1);
    };

    const handleFloorChange = (setFloor) => (value) => setFloor(value);

    const checkRequiredFields = () => {
        const emptyFields = [];

        if (loadLocation && loadLocation === unloadLocation) {
            alert(`상차지와 하차지가 같습니다. 다시 확인해주세요.`);
            return false;
        }

        if (_.isEmpty(loadLocation)) emptyFields.push("상차지");
        if (_.isEmpty(loadMethod)) emptyFields.push("상차 방법");
        if (_.isEmpty(unloadLocation)) emptyFields.push("하차지");
        if (_.isEmpty(unloadMethod)) emptyFields.push("하차 방법");
        if (_.isEmpty(items)) emptyFields.push("선택된 아이템");
        if (_.isEmpty(requestDate)) emptyFields.push("요청 날짜");
        if (_.isEmpty(requestTime)) emptyFields.push("요청 시간");
        if (_.isEmpty(vehicleType)) emptyFields.push("차량 종류");
        if (_.isEmpty(moveType)) emptyFields.push("이사 종류");

        if (_.isEmpty(loadCityCode)) {
            alert("상차지 법정동 코드가 존재하지 않습니다. ");
            return false;
        }

        if (_.isEmpty(unloadCityCode)) {
            alert("하차지 법정동 코드가 존재하지 않습니다. ");
            return false;
        }

        if (emptyFields.length > 0) {
            alert(`다음 필드를 입력해주세요: ${emptyFields.join(", ")}`);
            return false;
        }
        return true;
    };

    const fetchConsultant = () => {
        if (!checkRequiredFields()) {
            return;
        }
        const consultantDataForm = {
            loadLocationName: loadLocation,
            loadCityCode: loadCityCode.substring(0, 6),
            loadSubCityCode: loadCityCode.substring(6),
            loadMethodId: loadMethod?.key,
            loadMethodName: loadMethod?.value,
            loadFloorNumber: loadFloor,
            loadHelperPeople: loadHelperList,
            unloadLocationName: unloadLocation,
            unloadCityCode: unloadCityCode.substring(0, 6),
            unloadSubCityCode: unloadCityCode.substring(6),
            unloadMethodId: unloadMethod?.key,
            unloadMethodName: unloadMethod?.value,
            unloadFloorNumber: unloadFloor,
            unloadHelperPeople: unloadHelperList,
            moveTypeId: moveType.key,
            moveTypeName: moveType.value,
            vehicleId: vehicleType.key,
            vehicleName: vehicleType.value,
            distance,
            requestDate: requestDate.format('YYYY-MM-DD') || null,
            requestTime: requestTime.format('HH:mm') || null,
            items,
            totalItemCbm,
            toPackBoxCount: boxesToBePacked
        }

        consultantMutate(consultantDataForm);
        setIsCollapsed(false);
    };

    // 아이템 목록
    const collapseItems = Object.values(consultant?.items || {}).flat();

    const [skipChangeEvent, setSkipChangeEvent] = useState(false);

    const handleSelectItem = (item) => (e) => {
        const firstSuggestion = item;
        const terms = searchTerm.split(',').map(term => term.trim());

        terms[terms.length - 1] = firstSuggestion.itemName;

        const newSearchTerm = `${terms.join(', ')}`;

        const matchingItems = terms
            .map(term => collapseItems.find(item => (
                item.itemName.toLowerCase() === term.toLowerCase()))
            )
            .filter(Boolean);

        searchTermRef.current.focus();
        setItems(matchingItems);
        setSuggestions([]);
        setSearchTerm(`${newSearchTerm}, `);

        e.preventDefault();
    }

    const handleInputKeyDown = (e) => {
        if (e.key === ' ') {
            if (suggestions.length > 0) {
                const firstSuggestion = suggestions[0];
                const terms = searchTerm.split(',').map(term => term.trim());

                terms[terms.length - 1] = firstSuggestion.itemName;

                const newSearchTerm = `${terms.join(', ')}`;

                const matchingItems = terms
                    .map(term => collapseItems.find(item => item.itemName.toLowerCase() === term.toLowerCase()))
                    .filter(Boolean);

                setItems(matchingItems);
                setSuggestions([]);
                setSearchTerm(`${newSearchTerm}, `);

                e.preventDefault();
                setSkipChangeEvent(true);
            }
        }
    }

    // 입력 시 연관 검색어 및 유효성 검사
    const handleInputChange = (e) => {
        if (skipChangeEvent) {
            setSkipChangeEvent(false);
            return;
        }

        const value = e.target.value;
        const terms = value.split(',').map(term => term.trim());
        const lastItem = terms[terms.length - 1];

        // 연관 검색어 필터링
        if (lastItem) {
            const filteredSuggestions = collapseItems.filter((item) =>
                item.itemName.toLowerCase().includes(lastItem.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }

        const matchingItems = terms
            .map(term => collapseItems.find(item => item.itemName.toLowerCase() === term.toLowerCase()))
            .filter(Boolean);

        // const matchingItems = terms
        //     .map(term => {
        //         const match = term.match(/^([ㄱ-ㅎ|가-힣a-zA-Z]+)(\d+)$/i);
        //
        //         if (match) {
        //             const textPart = match[1];
        //             const numberPart = parseInt(match[2], 10);
        //
        //             const item = collapseItems.find(item =>
        //                 item.itemName.toLowerCase() === textPart.toLowerCase()
        //             );
        //
        //             if (item) {
        //                 return Array(numberPart).fill(item); // 숫자에 따라 아이템 생성
        //             }
        //         }
        //
        //         return null;
        //     })
        //     .flat() // 중첩 배열 평탄화
        //     .filter(Boolean);

        console.log(matchingItems);

        setSearchTerm(value);
        setItems(matchingItems);
    };

    const addGenderCount = (selectedGender, listSetter, listGetter) => {
        if (!listGetter().some(item => item.gender === selectedGender)) {
            listSetter((prevList) => [
                ...prevList,
                {gender: selectedGender, peopleNumber: 1}
            ]);
        }
    };

    const updateGenderCount = (index, value, listSetter, listGetter) => {
        listSetter((prevList) =>
            prevList.map((item, idx) =>
                idx === index ? {...item, peopleNumber: value || 0} : item
            )
        );
    };

    const removeGender = (gender, listSetter) => {
        listSetter((prevList) => prevList.filter(item => item.gender !== gender));
    };

    const isGenderAdded = (gender, listGetter) => listGetter().some(item => item.gender === gender);

    const handleDateChange = (date) => {
        setRequestDate(date);
    };

    const handleTimeChange = (time) => {
        console.log(time);
        setRequestTime(time);
    };

    const handleMoveTypeChange = (value, option) => {
        setMoveType({key: option.key, value});
        // 이사 종류가 변경될 때 박스 수 초기화
        if (value !== '반포장이사' && value !== '포장이사') {
            setPackedBoxes(0);
            setBoxesToBePacked(0);
        }
    };

    const deleteEntry = (id) => {
        setSavedEntries(savedEntries.filter(entry => entry.id !== id));
    };

    return (
        <div style={{display: 'flex'}}>
            {isLoading ? (
                // 로딩 중일 때 Progress 바 표시
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
                    <Progress type="circle" percent={80} status="active"/>
                </div>
            ) : consultantMetaError ? (
                // 에러 발생 시 Alert 표시
                <Alert
                    message="서버와의 통신에 문제가 발생했습니다."
                    description="상담 봇 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.(관리자에게 문의바랍니다.)"
                    type="error"
                    showIcon
                    style={{marginTop: '20px'}}
                />
            ) : (
                <>
                    <div style={{width: '15%', padding: '20px', borderRight: '1px solid #ddd'}}>
                        <Title level={3}>상담 예약</Title>
                        <LeftSidebar resetForm={resetForm} saveEntry={saveEntry} savedEntries={savedEntries}
                                     loadSavedEntry={loadSavedEntry} deleteEntry={deleteEntry}/>
                    </div>

                    <div style={{width: '45%', padding: '20px'}}>
                        <main style={{display: 'flex', flexDirection: 'column', maxHeight: '100vh'}}>
                            <Title level={3}>이사 정보</Title>

                            <Form layout="vertical">
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <div style={{width: '50%'}}>
                                        <AddressInput
                                            label="상차지"
                                            location={loadLocation}
                                            setLocation={setLoadLocation}
                                            setCityCode={setLoadCityCode}
                                            handleCoordinates={handleLoadCoordinates}
                                            handleLocationChange={handleLocationChange(setLoadLocation, setShowLoadAddressList, 'start')}
                                            addressList={loadAddressList}
                                            showAddressList={showLoadAddressList}
                                            setShowAddressList={setShowLoadAddressList}
                                            onSelectAddress={handleAddressSelect(setLoadLocation, setShowLoadAddressList)}
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
                                            label="상차 도움 인원"
                                            addGenderCount={(gender) => addGenderCount(gender, setLoadHelperList, () => loadHelperList)}
                                            helperList={loadHelperList}
                                            updateGenderCount={(index, value) => updateGenderCount(index, value, setLoadHelperList, () => loadHelperList)}
                                            isGenderAdded={(gender) => isGenderAdded(gender, () => loadHelperList)}
                                            removeGender={(gender) => removeGender(gender, setLoadHelperList)}
                                        />
                                    </div>

                                    <div style={{width: '50%'}}>
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
                                            onSelectAddress={handleAddressSelect(setUnloadLocation, setShowUnloadAddressList)}
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
                                            label="하차 도움 인원"
                                            addGenderCount={(gender) => addGenderCount(gender, setUnloadHelperList, () => unloadHelperList)}
                                            helperList={unloadHelperList}
                                            updateGenderCount={(index, value) => updateGenderCount(index, value, setUnloadHelperList, () => unloadHelperList)}
                                            isGenderAdded={(gender) => isGenderAdded(gender, () => unloadHelperList)}
                                            removeGender={(gender) => removeGender(gender, setUnloadHelperList)}
                                        />
                                    </div>
                                </div>

                                <div style={{display: "flex"}}>
                                    <div style={{flex: '1'}}>
                                        <Form.Item label="요청일">
                                            <DatePicker
                                                value={requestDate}
                                                onChange={handleDateChange}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div style={{flex: '1'}}>
                                        <Form.Item label="요청시간">
                                            <TimePicker
                                                value={requestTime}
                                                onChange={handleTimeChange}
                                                format="HH:mm"
                                                minuteStep={60}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                <Form.Item label="물품">
                                    <Input
                                        ref={searchTermRef}
                                        placeholder="아이템 이름을 입력하고 콤마(,)로 구분하세요"
                                        value={searchTerm}
                                        onChange={handleInputChange}
                                        onKeyDown={handleInputKeyDown}
                                        style={{marginBottom: '8px', width: '100%'}}
                                    />
                                    {errorMessage && <div style={{color: 'red', marginTop: '4px'}}>{errorMessage}</div>}
                                    {suggestions.length > 0 && (
                                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px'}}>
                                            {suggestions.map((item) => (
                                                <Tag
                                                    key={item.itemId}
                                                    onClick={handleSelectItem(item)}
                                                    style={{cursor: 'pointer'}}
                                                >
                                                    {item.itemName}
                                                </Tag>
                                            ))}
                                        </div>
                                    )}
                                    <div style={{marginTop: '8px'}}>
                                        <h3>선택된 아이템 목록:</h3>
                                        {items.map((item, index) => <Tag key={index}>{item.itemName}</Tag>)}
                                    </div>
                                </Form.Item>

                                <div style={{display: "flex", gap: '10px'}}>
                                    {consultant?.vehicles && (
                                        <Form.Item label="차량 종류" style={{width: '100px'}}>
                                            <Select
                                                placeholder="예: 카고"
                                                value={vehicleType}
                                                onChange={(value, option) => {
                                                    setVehicleType({key: option.key, value})}
                                                }
                                            >
                                                {consultant.vehicles.map((vehicle) => (
                                                    <Select.Option key={vehicle.vehicleId} value={vehicle.vehicleName}>
                                                        {vehicle.vehicleName}
                                                    </Select.Option>
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
                                                    <Select.Option key={moveType.moveTypeId}
                                                                   value={moveType.moveTypeName}>
                                                        {moveType.moveTypeName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    )}

                                    {(moveType?.value === '반포장이사' || moveType?.value === '포장이사') && (
                                        <>
                                            <Form.Item label="포장된 박스">
                                                <InputNumber
                                                    min={0}
                                                    value={packedBoxes}
                                                    onChange={setPackedBoxes}
                                                    style={{width: '100%'}}
                                                    placeholder="포장된 박스 수 입력"
                                                />
                                            </Form.Item>
                                            <Form.Item label="포장할 박스">
                                                <InputNumber
                                                    min={0}
                                                    value={boxesToBePacked}
                                                    onChange={setBoxesToBePacked}
                                                    style={{width: '100%'}}
                                                    placeholder="포장해야 할 박스 수 입력"
                                                />
                                            </Form.Item>
                                        </>
                                    )}
                                </div>

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

                                <div className='btn-wra' style={{display: 'flex', gap: '10px'}}>
                                    <Button type='primary' onClick={fetchConsultant}>배차 금액 조회</Button>
                                    <Button type="primary" onClick={saveEntry}
                                            style={{marginBottom: '20px', backgroundColor: '#52c41a'}}>
                                        저장하기
                                    </Button>
                                </div>
                            </Form>

                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    right: isCollapsed ? '-38%' : '0', // 패널 슬라이드 위치 조정
                                    width: '38%',
                                    height: '100%',
                                    backgroundColor: '#f8f6f6',
                                    transition: 'right 0.3s ease',
                                    padding: '10px',
                                    overflow: 'auto',
                                    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '-20px',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        boxShadow: '0px 0px 5px rgba(0,0,0,0.3)', // 그림자 추가
                                    }}
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                >
                                    {isCollapsed ? <LeftOutlined/> : <RightOutlined/>}
                                </div>

                                <div style={{display: isCollapsed ? 'none' : 'block'}}>
                                    <DispatchPrice data={calcConsultantData} isLoadingConsultantMutate={isLoadingConsultantMutate}/>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div style={{width: '40%', padding: '20px'}}>
                        테스트
                    </div>
                </>
            )}
        </div>
    );
};

export default Consultant;