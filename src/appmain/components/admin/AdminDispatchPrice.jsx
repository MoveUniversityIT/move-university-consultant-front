import React, {useEffect, useState} from 'react';
import {Table, Typography} from 'antd';
import CustomProgress from "@/component/CustomProgress";

const {Title} = Typography;

const totalLabels = {
    totalCalcPrice: "총 배차 금액",
    totalVehiclePrice: "합계 차량 가격",
    totalRequiredHelperPrice: "상/하차 총 인부 가격",
    totalItemCbm: "물품 총 CBM",
};

const labels = {
    moveTypeName: "이사 종류",
    vehicleCount: "차량 대수",
    loadMethodFloorPerFee: "상차 층당 CBM 가격",
    unloadMethodFloorPerFee: "하차 층당 CBM 가격",
    dokcha: "독차가",
    disCountDokchaPrice: "추가할인된 독차가",
    dokchaCbmPerFee: "독차 + 기본가 + 추가 CBM당 요금",
    loadUnloadDokchaPrice: "총합 독차가 + 상차 + 하차",
    itemAdditionalFee: "비싼 품목 추가 요금(합산)",
    specialItemCost: "특이 사항 비용",
    datePriceFactor: "요청 날짜 추가 요금",
    timePriceFactor: "요청 시간 추가 요금",
    vehicleTypeFee: "차량 추가 요금",
    loadLocationPriceFactor: "상차지 난이도 추가 요금",
    unloadLocationPriceFactor: "하차지 난이도 추가 요금",
    totalDifficultyPriceFactor: "상차지 난이도 + 하차지 난이도 추가 요금",
    boxPriceFactor: "박스 추가/할인 요금",
    todayOrTomorrowPriceFactor: "당일, 내일 추가 요금",
    specialItemTotalCost: "특이 사항 총 비용(1대당 적용)",
    vehiclePrice: "차량 1대당 가격",
    vehicleRoundingHalfUp: '차량 1대당(반올림) 가격',
};

const helperLabels = {
    helperType: "도우미 종류",
    loadUnloadType: "상하차 종류",
    helperCount: "필요 인부수",
    helperPrice: "인부당 가격",
    totalHelperPrice: "인부 총금액",
    TRANSPORT: "운반",
    PACKING_CLEANING: "이모",
    LOAD: "상차",
    UNLOAD: "하차",
    LOAD_UNLOAD: "상차/하차(양쪽)"
};

const AdminDispatchPrice = ({data, isLoadingConsultantMutate}) => {
    const [dispatchData, setDispatchData] = useState({});

    useEffect(() => {
        if (data) {
            setDispatchData(data);
        }
    }, [data]);

    // % 표시가 필요한 필드 목록
    const percentFields = [
        "loadLocationPriceFactor",
        "unloadLocationPriceFactor",
        "totalDifficultyPriceFactor",
        "datePriceFactor",
        "timePriceFactor",
        "vehicleTypeFee",
        "boxPriceFactor",
        "todayOrTomorrowPriceFactor",
    ];

    // totalData 테이블 컬럼 정의
    const totalColumns = [
        {
            title: '항목',
            dataIndex: 'label',
            key: 'label',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: '값',
            dataIndex: 'value',
            key: 'value',
            render: (value) => value || <span style={{color: '#ccc'}}>데이터 없음</span>
        }
    ];

    const totalDataSource = Object.keys(totalLabels).map((key, index) => ({
        key: index,
        label: totalLabels[key],
        value: dispatchData[key] !== undefined
            ? key === 'totalItemCbm' ?
                `${dispatchData[key].toLocaleString()}`
                : `${dispatchData[key].toLocaleString()} 원`
            : null
    }));

    // 메인 데이터 테이블 컬럼
    const mainDataColumns = [
        {
            title: '항목',
            dataIndex: 'label',
            key: 'label',
            render: (text) => <strong>{text}</strong>
        },
        {
            title: '값',
            dataIndex: 'value',
            key: 'value',
            render: (value) => value || <span style={{color: '#ccc'}}>데이터 없음</span>
        }
    ];

    const mainDataSource = Object.keys(labels).map((key, index) => ({
        key: index,
        label: labels[key],
        value: dispatchData[key] !== undefined
            ? typeof dispatchData[key] === 'number'
                ? percentFields.includes(key)
                    ? `${dispatchData[key].toLocaleString()}%`
                    : `${dispatchData[key].toLocaleString()}`
                : dispatchData[key]
            : null
    }));

    // 인부 관련 데이터 테이블 컬럼
    const helperColumns = [
        {
            title: helperLabels['helperType'],
            dataIndex: 'helperType',
            key: 'helperType',
            render: (value) => helperLabels[value] || <span style={{color: '#ccc'}}>데이터 없음</span>
        },
        {
            title: helperLabels['loadUnloadType'],
            dataIndex: 'loadUnloadType',
            key: 'loadUnloadType',
            render: (value) => helperLabels[value] || <span style={{color: '#ccc'}}>데이터 없음</span>
        },
        {
            title: helperLabels['helperCount'],
            dataIndex: 'helperCount',
            key: 'helperCount',
            render: (value) => value || <span style={{color: '#ccc'}}>데이터 없음</span>
        },
        {
            title: helperLabels['helperPrice'],
            dataIndex: 'helperPrice',
            key: 'helperPrice',
            render: (price) => price ? `${price.toLocaleString()} 원` : <span style={{color: '#ccc'}}>데이터 없음</span>
        },
        {
            title: helperLabels['totalHelperPrice'],
            dataIndex: 'totalHelperPrice',
            key: 'totalHelperPrice',
            render: (price) => price ? `${price.toLocaleString()} 원` : <span style={{color: '#ccc'}}>데이터 없음</span>
        }
    ];

    const helperDataSource = dispatchData.helpers
        ? dispatchData.helpers.map((helper, index) => ({
            key: index,
            ...helper
        }))
        : [{key: 0}]; // 초기 빈 데이터 제공

    return (
        <div className="pb-14">
            {isLoadingConsultantMutate ? (
                <CustomProgress isLoading={isLoadingConsultantMutate} />
            ) : (
                <>
                    <Title level={3}>배차 금액 총계</Title>
                    <Table
                        columns={totalColumns}
                        dataSource={totalDataSource}
                        pagination={false}
                        bordered
                        style={{marginBottom: '20px'}}
                    />

                    <Title level={3}>배차 금액 정보</Title>
                    <Table
                        columns={mainDataColumns}
                        dataSource={mainDataSource}
                        pagination={false}
                        bordered
                        style={{marginBottom: '20px'}}
                    />

                    <Title level={4}>상하차 인부 정보</Title>
                    <Table
                        columns={helperColumns}
                        dataSource={helperDataSource}
                        pagination={false}
                        bordered
                    />
                </>
            )}
        </div>
    );
};

export default AdminDispatchPrice;