import React, {useEffect} from "react";
import {Card, Checkbox, Descriptions, Form, List} from "antd";

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
    datePriceFactor: "요청 날짜 추가 요금",
    timePriceFactor: "요청 시간 추가 요금",
    vehicleTypeFee: "차량 추가 요금",
    loadLocationPriceFactor: "상차지 난이도 추가 요금",
    unloadLocationPriceFactor: "하차지 난이도 추가 요금",
    totalDifficultyPriceFactor: "상차지 난이도 + 하차지 난이도 추가 요금",
    boxPriceFactor: "박스 추가/할인 요금",
    todayOrTomorrowPriceFactor: "당일, 내일 추가 요금",
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

// "data": {
//     "moveTypeName": "일반이사",
//         "vehicleCount": 1,
//         "loadMethodFloorPerFee": 0.0000,
//         "unloadMethodFloorPerFee": 0.0000,
//         "loadLocationPriceFactor": 0.000000,
//         "unloadLocationPriceFactor": 0.000000,
//         "totalDifficultyPriceFactor": 0.000000,
//         "dokcha": 40000.00,
//         "disCountDokchaPrice": 40000,
//         "dokchaCbmPerFee": 1600.5340,
//         "loadUnloadDokchaPrice": 1600.5340,
//         "itemAdditionalFee": 0,
//         "datePriceFactor": 0,
//         "timePriceFactor": 0,
//         "vehicleTypeFee": 0.00,
//         "boxPriceFactor": 0,
//         "todayOrTomorrowPriceFactor": 20.0,
//         "vehiclePrice": 1920.6408000000000,
//         "vehicleRoundingHalfUp": 0,
//         "totalVehiclePrice": 0,
//         "helpers": [
//         {
//             "helperType": "TRANSPORT",
//             "loadUnloadType": "LOAD_UNLOAD",
//             "helperCount": 1.0,
//             "helperPrice": 60000,
//             "totalHelperPrice": 60000.0
//         }
//     ],
//         "totalRequiredHelperPrice": 60000.0,
//         "totalItemCbm": 0.40,
//         "totalCalcPrice": 60000.0
// }

const DispatchCost = ({items, setItems, dispatchAmount}) => {
    const handleCheckboxChange = (itemId, key, checked) => {
        setItems(prevItems => ({
            ...prevItems,
            [itemId]: {
                ...prevItems[itemId],
                [key]: checked ? "Y" : "N",
            }
        }));

        console.log(items);
    };

    return (
        <div className="flex flex-col h-full">
            <Card title="배차 금액" className="shadow-md rounded-md flex-1">
                <Descriptions bordered column={1} size="middle" className="mb-1">
                    <Descriptions.Item label={totalLabels["totalItemCbm"]}>
                        {dispatchAmount?.totalItemCbm ? dispatchAmount?.totalItemCbm + " CBM" : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label={totalLabels["totalRequiredHelperPrice"]}>
                        {dispatchAmount?.totalRequiredHelperPrice ? dispatchAmount?.totalRequiredHelperPrice + " 원" : ""}
                    </Descriptions.Item>
                    {/*<Descriptions.Item label="추가 인부 금액">*/}
                    {/*    /!*{dispatchAmount?.helpers} | 추가 이모 금액: X명*!/*/}
                    {/*</Descriptions.Item>*/}
                    <Descriptions.Item label={totalLabels["totalCalcPrice"]}>
                        {dispatchAmount?.totalCalcPrice} 원
                    </Descriptions.Item>
                </Descriptions>

                <Form
                    layout="vertical"
                    className="flex gap-1 h-[20vh] overflow-y-auto"
                >
                    <div className="flex-1 border-l border-gray-300 pl-5">
                        <h4 className="text-lg font-semibold mb-3">아이템 목록 및 옵션 설정</h4>
                        <List
                            dataSource={Object.values(items)}
                            renderItem={(item) => (
                                <List.Item className="!p-0 flex justify-between items-center">
                                    <span className="text-sm">{item.itemName} {item.itemCount} 개</span>
                                    <div className="flex items-center space-x-2">
                                        {item.isDisassembly === "Y" && (
                                            <Checkbox
                                                className="text-sm"
                                                checked={item?.requiredIsDisassembly === "Y"}
                                                onChange={(e) => handleCheckboxChange(item.itemId, 'requiredIsDisassembly', e.target.checked)}
                                            >
                                                분해
                                            </Checkbox>
                                        )}
                                        {item.isInstallation === "Y" && (
                                            <Checkbox
                                                className="text-sm"
                                                checked={item?.requiredIsInstallation === "Y"}
                                                onChange={(e) => handleCheckboxChange(item.itemId, 'requiredIsInstallation', e.target.checked)}
                                            >
                                                설치
                                            </Checkbox>
                                        )}
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </Form>
            </Card>
            <Card title="견적 자판기" className="shadow-md rounded-md flex-1">
            </Card>
        </div>
    );
};

export default DispatchCost;