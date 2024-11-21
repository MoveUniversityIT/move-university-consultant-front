import React, {useEffect, useState} from "react";
import {Card, Checkbox, Descriptions, Divider, Form, List, Slider} from "antd";

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

const dataLabel = {
    totalItemCbm: "물품 총 CBM",
    transportHelperCount: "추가 인부 수",
    cleaningHelperCount: "추가 이모 수",
    vehicleName: "차량 종류",
    vehicleCount: "차량 수",
    vehicleRoundingHalfUp: "한 대 차량 가격",
    transportHelperPrice: "추가 인부 가격",
    cleaningHelperPrice: "추가 이모 가격",
    totalCalcPrice: "총 배차 가격",
}

const unitLabel = {
    totalItemCbm: "CBM",
    transportHelperCount: "명",
    cleaningHelperCount: "명",
    vehicleCount: "대",
    vehicleRoundingHalfUp: "원",
    transportHelperPrice: "원",
    cleaningHelperPrice: "원",
    totalCalcPrice: "원"
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
    const [calcData, setCalcData] = useState({});
    const [estimate, setEstimate] = useState({
        minDeposit: dispatchAmount?.estimatePrice?.minDeposit || 0,
        maxDeposit: dispatchAmount?.estimatePrice?.maxDeposit || 0,
        minEstimatePrice: dispatchAmount?.estimatePrice?.minEstimatePrice || 0,
        maxEstimatePrice: dispatchAmount?.estimatePrice?.maxEstimatePrice || 0,
    });

    const [sliderValue, setSliderValue] = useState(5);
    const [depositPrice, setDepositPrice] = useState(estimate.minDeposit);
    const [estimatePrice, setEstimatePrice] = useState(estimate.minEstimatePrice);

    // minDeposit + (slider value - 1) * ((maxDeposit - minDeposit) / (10 -1))
    const handleSliderChange = (value) => {
        setSliderValue(value);

        // 예측 값 계산
        let calcDeposit =
            estimate.minDeposit +
            (value - 1) * ((estimate.maxDeposit - estimate.minDeposit) / (10 - 1));

        let calcEstimate =
            estimate.minEstimatePrice +
            (value - 1) * ((estimate.maxEstimatePrice - estimate.minEstimatePrice) / (10 - 1));

        calcDeposit = Math.round(calcDeposit * 100) / 100;
        calcEstimate = Math.round(calcEstimate * 100) / 100;

        // 30만 미만일 경우 5천원 단위로 반올림
        if (calcDeposit < 300000) {
            calcDeposit = Math.round(calcDeposit / 5000) * 5000;
            calcEstimate = Math.round(calcEstimate / 5000) * 5000;
        }
        // 30만 이상 ~ 130만 미만일 경우 1만원 단위로 반올림
        else if (calcDeposit < 1300000) {
            calcDeposit = Math.round(calcDeposit / 10000) * 10000;
            calcEstimate = Math.round(calcEstimate / 10000) * 10000;

            const thousandWon = Math.floor(calcDeposit / 100000); // 10만 단위
            const tenThousandWon = calcDeposit % 100000; // 10만 단위 잔여값

            if (tenThousandWon > 60000 || tenThousandWon <= 10000) {
                if (tenThousandWon > 0) {
                    calcDeposit = calcDeposit - tenThousandWon + (tenThousandWon > 60000 ? 80000 : 0);
                } else {
                    calcDeposit = thousandWon * 100000 + 80000;
                }
            } else if (tenThousandWon > 10000 && tenThousandWon <= 60000) {
                calcDeposit = thousandWon * 100000 + 40000;
            }

            if(calcDeposit <= 980000) {
                calcDeposit += 5000;
            }

            calcDeposit = Math.round(calcDeposit);
            calcEstimate = Math.round(calcEstimate);
        }
        // 130만 이상의 경우 5만원단위 반올림
        else {
            calcDeposit = Math.round(calcDeposit / 50000) * 50000;
            calcEstimate = Math.round(calcDeposit / 50000) * 50000;
        }

        setDepositPrice(calcDeposit);
        setEstimatePrice(calcEstimate);
    };

    const handleCheckboxChange = (itemName, key, checked) => {
        setItems(prevItems => ({
            ...prevItems,
            [itemName]: {
                ...prevItems[itemName],
                [key]: checked ? "Y" : "N",
            }
        }));
    };

    useEffect(() => {
        setCalcData({
            totalItemCbm: dispatchAmount?.totalItemCbm ? dispatchAmount.totalItemCbm : 0,
            transportHelperCount: dispatchAmount?.helpers
                ? dispatchAmount.helpers.reduce((total, helper) => {
                    if (helper.helperType === "TRANSPORT") {
                        return total + (helper.helperCount || 0);
                    }
                    return total;
                }, 0)
                : 0,
            cleaningHelperCount: dispatchAmount?.helpers
                ? dispatchAmount.helpers.reduce((total, helper) => {
                    if (helper.helperType === "PACKING_CLEANING") {
                        return total + (helper.helperCount || 0);
                    }
                    return total;
                }, 0)
                : 0,
            vehicleName: dispatchAmount?.vehicleName,
            vehicleCount: dispatchAmount?.vehicleCount ? dispatchAmount.vehicleCount : 0,
            vehicleRoundingHalfUp: dispatchAmount?.vehicleRoundingHalfUp ? dispatchAmount.vehicleRoundingHalfUp : 0,
            transportHelperPrice: dispatchAmount?.helpers
                ? dispatchAmount.helpers.reduce((total, helper) => {
                    if (helper.helperType === "TRANSPORT") {
                        return total + (helper.totalHelperPrice || 0);
                    }
                    return total;
                }, 0)
                : 0,
            cleaningHelperPrice: dispatchAmount?.helpers
                ? dispatchAmount.helpers.reduce((total, helper) => {
                    if (helper.helperType === "PACKING_CLEANING") {
                        return total + (helper.totalHelperPrice || 0);
                    }
                    return total;
                }, 0)
                : 0,
            totalCalcPrice: dispatchAmount?.totalCalcPrice ? dispatchAmount.totalCalcPrice : 0,
        })

        setEstimate({
            minDeposit: dispatchAmount?.estimatePrice?.minDeposit || 0,
            maxDeposit: dispatchAmount?.estimatePrice?.maxDeposit || 0,
            minEstimatePrice: dispatchAmount?.estimatePrice?.minEstimatePrice || 0,
            maxEstimatePrice: dispatchAmount?.estimatePrice?.maxEstimatePrice || 0,
        })
    }, [dispatchAmount]);

    useEffect(() => {
        handleSliderChange(5);
    }, [estimate]);

    // 사다리가격도 별도 고지
    return (
        <div className="flex flex-col h-full">
            <Card title="배차 금액" className="shadow-md rounded-md flex-1">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(calcData).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center border p-2 rounded-md">
                            <span className="font-bold text-gray-600">{dataLabel[key]}:</span>
                            <span className="text-gray-800">
                            {value}
                                {unitLabel[key] ? unitLabel[key] : ""}
                        </span>
                        </div>
                    ))}
                </div>

                <Divider>물품 목록 & 옵션 설정</Divider>
                <Form
                    layout="vertical"
                    className="flex gap-1 h-[20vh] overflow-y-auto"
                >
                    <div className="flex-1 border-l border-gray-300 pl-5">
                        <List
                            dataSource={Object.values(items)}
                            renderItem={(item) => (
                                <List.Item className="!p-1 flex justify-between items-center">
                                    <span className="text-sm">{item.itemName} {item.itemCount} 개</span>
                                    <div className="flex items-center space-x-2">
                                        {item.isDisassembly === "Y" && (
                                            <Checkbox
                                                className="text-sm"
                                                checked={item?.requiredIsDisassembly === "Y"}
                                                onChange={(e) => handleCheckboxChange(item.itemName, 'requiredIsDisassembly', e.target.checked)}
                                            >
                                                분해
                                            </Checkbox>
                                        )}
                                        {item.isInstallation === "Y" && (
                                            <Checkbox
                                                className="text-sm"
                                                checked={item?.requiredIsInstallation === "Y"}
                                                onChange={(e) => handleCheckboxChange(item.itemName, 'requiredIsInstallation', e.target.checked)}
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
                <div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm w-2/5 font-semibold text-gray-700">견적금액 레버:</span>

                        <Slider
                            min={1}
                            max={10}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="w-full"
                            style={{ height: "10px" }}
                        />

                        <span className="text-sm font-semibold text-gray-700">{sliderValue}</span>
                    </div>
                    <p className="mt-4 text-gray-600">견적금액: {depositPrice}원(계약금: {estimatePrice}원)</p>
                </div>
            </Card>
        </div>
    );
};

export default DispatchCost;