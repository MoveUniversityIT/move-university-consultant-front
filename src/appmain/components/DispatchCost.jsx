import React, {useEffect, useState} from "react";
import {Card, Checkbox, Divider, Form, List, Slider, Spin} from "antd";

const dataLabel = {
    totalItemCbm: "물품 총 CBM",
    totalWeight: "총 무게",
    dokcha: "독차가",
    transportHelperCount: "추가 인부 수",
    cleaningHelperCount: "추가 이모 수",
    vehicleName: "차량 종류",
    vehicleCount: "차량 수",
    vehicleRoundingHalfUp: "한 대 차량 가격",
    transportHelperPrice: "추가 인부 가격",
    cleaningHelperPrice: "추가 이모 가격",
    totalCalcPrice: "총 배차 가격",
    totalLadderPrice: "사다리 기본가(별도)",
}

const unitLabel = {
    totalItemCbm: "CBM",
    totalWeight: "kg",
    dokcha: "원",
    transportHelperCount: "명",
    cleaningHelperCount: "명",
    vehicleCount: "대",
    vehicleRoundingHalfUp: "원",
    transportHelperPrice: "원",
    cleaningHelperPrice: "원",
    totalCalcPrice: "원",
    totalLadderPrice: "원"
};

const DispatchCost = ({
                          items, setItems, dispatchAmount, isDispatchAmount, paymentMethod,
                          estimate, setEstimate, sliderValue, setSliderValue, depositPrice,
                          setDepositPrice, estimatePrice, setEstimatePrice, surtax, setSurtax, estimateLever,
                          searchItemTerm, setSearchItemTerm, dispatchCosts, moveTypeCheckBoxes, setMoveTypeCheckBoxes
                      }) => {
    const [calcData, setCalcData] = useState({});
    const [tempTotalCbm, setTempTotalCbm] = useState(0);

    // minDeposit + (slider value - 1) * ((maxDeposit - minDeposit) / (10 -1))
    const handleSliderChange = (value) => {
        setSliderValue(value);

        // 중간값 계산
        const interpolate = (min, mid, max, currentValue, minValue, maxValue) => {
            if (currentValue === minValue) return min;
            if (currentValue === maxValue) return max;
            if (currentValue === Math.floor((minValue + maxValue) / 2)) return mid;

            const midPoint = Math.floor((minValue + maxValue) / 2);

            // 선형 보간 공식
            if (currentValue < midPoint) {
                return min + ((mid - min) / (midPoint - minValue)) * (currentValue - minValue);
            } else {
                return mid + ((max - mid) / (maxValue - midPoint)) * (currentValue - midPoint);
            }
        };

        // `interpolate` 함수로 계산
        // let calcEstimate = interpolate(
        //     estimate.minEstimatePrice,
        //     estimate.estimatePrice,
        //     estimate.maxEstimatePrice,
        //     value,
        //     1,
        //     10
        // );

        const minEstimate = Math.round(estimate.baseCost * 1.15);
        const midEstimate = estimate.estimatePrice;
        const maxEstimate = Math.round(estimate.estimatePrice * 1.5);

        let calcEstimate = estimate.estimatePrice;

        if (value === 5) {
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
        } else if (1 <= value && value < 5) {
            calcEstimate = minEstimate + ((midEstimate - minEstimate) / (5 - 1)) * (value - 1);
            calcEstimate = Math.round(calcEstimate / 5000) * 5000;

            if (calcEstimate <= 980000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            } else {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;
            }

        } else if (5 < value && value <= 10) {
            calcEstimate = midEstimate + ((maxEstimate - midEstimate) / (10 - 5)) * (value - 5);

            if (calcEstimate <= 980000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            } else {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;
            }
        }

        setEstimatePrice(calcEstimate);
        setDepositPrice(calcEstimate - estimate.totalCalcPrice);
        setSurtax(Math.round(calcEstimate * 0.1));

    };

    const handleCheckboxChange = (itemName, itemCount, key, checked) => {
        setItems((prevItems) => {
            const prevItem = prevItems[itemName];

            // 추가 요금 계산 함수
            const calculateAdditionalPrice = (key, checked) => {
                let price = prevItem.baseAdditionalFee;

                if (key === "requiredIsDisassembly") {
                    price += checked ? prevItem.disassemblyAdditionalFee : 0;
                    price += prevItem.requiredIsInstallation === "Y" ? prevItem.installationAdditionalFee : 0;
                } else if (key === "requiredIsInstallation") {
                    price += prevItem.requiredIsDisassembly === "Y" ? prevItem.disassemblyAdditionalFee : 0;
                    price += checked ? prevItem.installationAdditionalFee : 0;
                }

                return price;
            };

            // 추가 요금 계산
            const additionalPrice = calculateAdditionalPrice(key, checked);

            const updatedItem = {
                ...prevItems[itemName],
                [key]: checked ? "Y" : "N",
                additionalPrice
            };

            // 태그 계산
            const isDisassembly = updatedItem.requiredIsDisassembly === "Y";
            const isInstallation = updatedItem.requiredIsInstallation === "Y";
            let tag = "";

            if (isDisassembly && isInstallation) {
                tag = "[분조]";
            } else if (isDisassembly) {
                tag = "[분]";
            } else if (isInstallation) {
                tag = "[조]";
            }

            setSearchItemTerm((prevSearchItemTerm) => {
                const terms = prevSearchItemTerm.split(',').map((term) => term.trim());
                const baseName = itemName.replace(/\[.*\]/g, '');
                const newItemCount = itemCount > 1 ? itemCount : '';
                const updatedItemName = tag ? `${baseName}${tag}${newItemCount}` : `${baseName}${newItemCount}`;

                const updatedTerms = terms.map((term) => {
                    if (term.startsWith(baseName)) {
                        return updatedItemName;
                    }
                    return term;
                });

                if (!updatedTerms.includes(updatedItemName)) {
                    updatedTerms.push(updatedItemName);
                }

                return updatedTerms.join(', ');
            });

            return {
                ...prevItems,
                [itemName]: updatedItem,
            };
        });
    };

    useEffect(() => {
        let loadTransCount = 0;
        let unloadTransCount = 0;

        if (dispatchAmount && dispatchAmount.length > 0) {
            setCalcData({
                totalItemCbm: dispatchAmount[0]?.totalItemCbm ? dispatchAmount[0].totalItemCbm : 0,
                totalWeight: dispatchAmount[0]?.totalWeight || 0,
                vehicleName: dispatchAmount[0]?.vehicleName,
                dokcha: dispatchAmount[0]?.dokcha || 0,
                vehicleCount: dispatchAmount[0]?.vehicleCount?.toLocaleString() ?? 0,
                vehicleRoundingHalfUp: dispatchAmount[0]?.vehicleRoundingHalfUp?.toLocaleString() ?? 0,
                transportHelperCount: dispatchAmount[0]?.helpers
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
                    : 0,
                cleaningHelperCount: dispatchAmount[0]?.helpers
                    ? dispatchAmount[0].helpers.reduce((total, helper) => {
                        if (helper.helperType === "PACKING_CLEANING") {
                            return Number(total) + Number(helper.helperCount || 0);
                        }
                        return total
                    }, 0)?.toLocaleString()
                    : 0,
                transportHelperPrice: dispatchAmount[0]?.helpers
                    ? dispatchAmount[0].helpers.reduce((total, helper) => {
                        if (helper.helperType === "TRANSPORT") {
                            return Number(total) + Number(helper.totalHelperPrice || 0);
                        }
                        return total;
                    }, 0)?.toLocaleString()
                    : 0,
                cleaningHelperPrice: dispatchAmount[0]?.helpers
                    ? dispatchAmount[0].helpers.reduce((total, helper) => {
                        if (helper.helperType === "PACKING_CLEANING") {
                            return Number(total) + Number(helper.totalHelperPrice || 0);
                        }
                        return total;
                    }, 0)?.toLocaleString()
                    : 0,
                totalCalcPrice: dispatchAmount[0]?.totalCalcPrice?.toLocaleString() ?? 0,
                totalLadderPrice: dispatchAmount[0]?.totalLadderPrice?.toLocaleString() ?? 0,
            })

            setEstimate({
                baseCost: dispatchAmount[0]?.estimatePrice?.baseCost || 0,
                deposit: dispatchAmount[0]?.estimatePrice?.deposit || 0,
                minDeposit: dispatchAmount[0]?.estimatePrice?.minDeposit || 0,
                maxDeposit: dispatchAmount[0]?.estimatePrice?.maxDeposit || 0,
                estimatePrice: dispatchAmount[0]?.estimatePrice?.estimatePrice || 0,
                minEstimatePrice: dispatchAmount[0]?.estimatePrice?.minEstimatePrice || 0,
                maxEstimatePrice: dispatchAmount[0]?.estimatePrice?.maxEstimatePrice || 0,
                totalCalcPrice: dispatchAmount[0]?.totalCalcPrice || 0,
            })
        }else {
            setCalcData({
                totalItemCbm: 0,
                totalWeight: 0,
                vehicleName: '',
                dokcha: 0,
                vehicleCount: 0,
                vehicleRoundingHalfUp: 0,
                transportHelperCount: 0,
                cleaningHelperCount: 0,
                transportHelperPrice: 0,
                cleaningHelperPrice: 0,
                totalCalcPrice: 0,
                totalLadderPrice: 0,
            })

            setEstimate({
                baseCost: 0,
                deposit: 0,
                minDeposit: 0,
                maxDeposit: 0,
                estimatePrice: 0,
                minEstimatePrice: 0,
                maxEstimatePrice: 0,
                totalCalcPrice: 0,
            })
        }
    }, [dispatchAmount]);

    useEffect(() => {
        const totalItemCbm = items instanceof Object
            ? Object.values(items).reduce((sum, item) => sum + (item.itemCbm * item.itemCount || 0), 0)
            : 0;

        setTempTotalCbm(totalItemCbm?.toLocaleString());
    }, [items]);

    useEffect(() => {
        handleSliderChange(5);
    }, [estimate]);

    // 사다리가격도 별도 고지
    return (
        <div className="flex flex-col h-full">
            <Card title="배차 금액" className="shadow-md rounded-md flex-1">
                <div className="relative">
                    {isDispatchAmount && (
                        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 z-10">
                            <Spin size="large"/>
                        </div>
                    )}
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
                </div>

                <Divider>물품({tempTotalCbm}Cbm) 목록 & 옵션 설정</Divider>
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
                                                onChange={(e) => handleCheckboxChange(item.itemName, item.itemCount, 'requiredIsDisassembly', e.target.checked)}
                                            >
                                                분해
                                            </Checkbox>
                                        )}
                                        {item.isInstallation === "Y" && (
                                            <Checkbox
                                                className="text-sm"
                                                checked={item?.requiredIsInstallation === "Y"}
                                                onChange={(e) => handleCheckboxChange(item.itemName, item.itemCount, 'requiredIsInstallation', e.target.checked)}
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
                            style={{height: "10px"}}
                        />
                        <span className="text-sm font-semibold text-gray-700">{sliderValue}</span>
                    </div>
                    <div className="mt-4 text-gray-600">
                        <div className="text-lg font-semibold">
                            견적 금액: <span className="text-blue-600">{estimatePrice?.toLocaleString()}원</span>
                        </div>
                        <div className="mt-1">
                            계약금: <span className="text-green-600">{depositPrice?.toLocaleString()}원</span>
                        </div>
                        {paymentMethod?.value !== "현금" && (
                            <div className="mt-1 text-sm text-gray-500">
                                부가세 포함: {(estimatePrice + surtax)?.toLocaleString()}원
                            </div>
                        )}
                    </div>
                </div>
                <Divider/>
                {/*<div className="grid grid-cols-3 gap-4 p-4 border rounded-md bg-gray-50">*/}
                {/*    <Checkbox onChange={(e) => handleCheckSave(1, e.target.checked)} className="text-gray-700">*/}
                {/*        단순운송*/}
                {/*    </Checkbox>*/}
                {/*    <Checkbox onChange={(e) => handleCheckSave(2, e.target.checked)} className="text-gray-700">*/}
                {/*        일반이사*/}
                {/*    </Checkbox>*/}
                {/*    <Checkbox onChange={(e) => handleCheckSave(3, e.target.checked)} className="text-gray-700">*/}
                {/*        반포장이사*/}
                {/*    </Checkbox>*/}
                {/*    <Checkbox onChange={(e) => handleCheckSave(4, e.target.checked)} className="text-gray-700">*/}
                {/*        포장이사*/}
                {/*    </Checkbox>*/}
                {/*    <Checkbox onChange={(e) => handleCheckSave(5, e.target.checked)} className="text-gray-700">*/}
                {/*        보관이사*/}
                {/*    </Checkbox>*/}
                {/*</div>*/}
            </Card>
        </div>
    );
};

export default DispatchCost;