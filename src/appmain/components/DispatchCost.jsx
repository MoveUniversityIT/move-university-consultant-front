import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Checkbox, Divider, Drawer, Form, List, message, Slider, Spin, Tooltip} from "antd";
import {useCalcConsultants} from "@hook/useConsultant";
import {CopyOutlined, ZoomInOutlined, ZoomOutOutlined} from "@ant-design/icons";
import DispatchAmountListText from "@component/DispatchAmountListText";

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

const processDispatchData = (dispatchData, dokchaPrice) => {
    if (!dispatchData || dispatchData.length === 0) {
        return {
            calcData: {
                totalItemCbm: 0,
                totalWeight: 0,
                vehicleName: "",
                dokcha: dokchaPrice?.toLocaleString() || 0,
                vehicleCount: 0,
                vehicleRoundingHalfUp: 0,
                transportHelperCount: 0,
                cleaningHelperCount: 0,
                transportHelperPrice: 0,
                cleaningHelperPrice: 0,
                totalCalcPrice: 0,
                totalLadderPrice: 0,
            },
            estimate: {
                depositAdjustmentRate: 0,
                baseCost: 0,
                deposit: 0,
                minDeposit: 0,
                maxDeposit: 0,
                estimatePrice: 0,
                minEstimatePrice: 0,
                maxEstimatePrice: 0,
                totalCalcPrice: 0,
            },
        };
    }

    let loadTransCount = 0;
    let unloadTransCount = 0;

    return {
        calcData: {
            totalItemCbm: dispatchData[0]?.totalItemCbm || 0,
            totalWeight: dispatchData[0]?.totalWeight || 0,
            vehicleName: dispatchData[0]?.vehicleName || "",
            dokcha: dispatchData[0]?.dokcha?.toLocaleString() || dokchaPrice?.toLocaleString() || 0,
            vehicleCount: dispatchData[0]?.vehicleCount?.toLocaleString() || 0,
            vehicleRoundingHalfUp: dispatchData[0]?.vehicleRoundingHalfUp?.toLocaleString() || 0,
            transportHelperCount: dispatchData[0]?.helpers
                ? dispatchData[0].helpers.reduce((total, helper) => {
                    if (helper.helperType === "TRANSPORT") {
                        if (helper.loadUnloadType === "LOAD") {
                            loadTransCount += helper.helperCount || 0;
                        } else if (helper.loadUnloadType === "UNLOAD") {
                            unloadTransCount += helper.helperCount || 0;
                        }
                        return Number(total) + Number(helper.helperCount || 0);
                    }
                    return total;
                }, 0) -
                Math.min(loadTransCount, unloadTransCount)?.toLocaleString()
                : 0,
            cleaningHelperCount: dispatchData[0]?.helpers
                ? dispatchData[0].helpers.reduce((total, helper) => {
                    if (helper.helperType === "PACKING_CLEANING") {
                        return Number(total) + Number(helper.helperCount || 0);
                    }
                    return total;
                }, 0)?.toLocaleString()
                : 0,
            transportHelperPrice: dispatchData[0]?.helpers
                ? dispatchData[0].helpers.reduce((total, helper) => {
                    if (helper.helperType === "TRANSPORT") {
                        return Number(total) + Number(helper.totalHelperPrice || 0);
                    }
                    return total;
                }, 0)?.toLocaleString()
                : 0,
            cleaningHelperPrice: dispatchData[0]?.helpers
                ? dispatchData[0].helpers.reduce((total, helper) => {
                    if (helper.helperType === "PACKING_CLEANING") {
                        return Number(total) + Number(helper.totalHelperPrice || 0);
                    }
                    return total;
                }, 0)?.toLocaleString()
                : 0,
            totalCalcPrice: dispatchData[0]?.totalCalcPrice?.toLocaleString() || 0,
            totalLadderPrice: dispatchData[0]?.totalLadderPrice?.toLocaleString() || 0,
        },
        estimate: {
            depositAdjustmentRate: dispatchData[0]?.estimatePrice?.depositAdjustmentRate || 0,
            baseCost: dispatchData[0]?.estimatePrice?.baseCost || 0,
            deposit: dispatchData[0]?.estimatePrice?.deposit || 0,
            minDeposit: dispatchData[0]?.estimatePrice?.minDeposit || 0,
            maxDeposit: dispatchData[0]?.estimatePrice?.maxDeposit || 0,
            estimatePrice: dispatchData[0]?.estimatePrice?.estimatePrice || 0,
            minEstimatePrice: dispatchData[0]?.estimatePrice?.minEstimatePrice || 0,
            maxEstimatePrice: dispatchData[0]?.estimatePrice?.maxEstimatePrice || 0,
            totalCalcPrice: dispatchData[0]?.totalCalcPrice || 0,
        },
    };
};

const DispatchCost = ({
                          items, setItems, dispatchAmount, isDispatchAmount, paymentMethod,
                          estimate, setEstimate, sliderValue, setSliderValue, depositPrice,
                          setDepositPrice, estimatePrice, setEstimatePrice, surtax, setSurtax,
                          setSearchItemTerm, consultantDataForm, isFormValid, dokchaPrice,
    isModalOpen, showModal, closeModal
                      }) => {
    const [calcData, setCalcData] = useState({
            totalItemCbm: 0,
            totalWeight: 0,
            vehicleName: "",
            dokcha: 0,
            vehicleCount: 0,
            vehicleRoundingHalfUp: 0,
            transportHelperCount: 0,
            cleaningHelperCount: 0,
            transportHelperPrice: 0,
            cleaningHelperPrice: 0,
            totalCalcPrice: 0,
            totalLadderPrice: 0,
        });
    const [tempTotalCbm, setTempTotalCbm] = useState(0);
    const [dispatchAmountList, setDispatchAmountList] = useState({});
    const [checkBox, setCheckBox] = useState({
        1: {
            checked: false,
            name: '단순운송'
        },
        2: {
            checked: false,
            name: '일반운송'
        },
        3: {
            checked: false,
            name: '반포장이사'
        },
        4: {
            checked: false,
            name: '포장이사'
        }
    });

    const isAnyCheckBoxSelected = Object.values(checkBox).some(item => item.checked);

    const textRef = useRef(null);


    const {mutateAsync: consultantMutateAsync} = useCalcConsultants();

    // minDeposit + (slider value - 1) * ((maxDeposit - minDeposit) / (10 -1))
    const handleSliderChange = (value) => {
        setSliderValue(value);

        // 중간값 계산
        // const interpolate = (min, mid, max, currentValue, minValue, maxValue) => {
        //     if (currentValue === minValue) return min;
        //     if (currentValue === maxValue) return max;
        //     if (currentValue === Math.floor((minValue + maxValue) / 2)) return mid;
        //
        //     const midPoint = Math.floor((minValue + maxValue) / 2);
        //
        //     // 선형 보간 공식
        //     if (currentValue < midPoint) {
        //         return min + ((mid - min) / (midPoint - minValue)) * (currentValue - minValue);
        //     } else {
        //         return mid + ((max - mid) / (maxValue - midPoint)) * (currentValue - midPoint);
        //     }
        // };

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

        const roundingUnit = 5000;
        // const calculatedDeposit =
        //     Math.round((calcEstimate - estimate.totalCalcPrice) * (estimate.depositAdjustmentRate + 1) / roundingUnit) * roundingUnit;
        const calculatedDeposit = calcEstimate - estimate.totalCalcPrice;
            // Math.round((calcEstimate - estimate.totalCalcPrice) / roundingUnit) * roundingUnit;

        const adjustedDeposit =
            calculatedDeposit >= calcEstimate
                ? calcEstimate
                : calculatedDeposit;

        setEstimatePrice(calcEstimate);
        setDepositPrice(adjustedDeposit);
        setSurtax(Math.round(calcEstimate * 0.1));
    };

    const handleSubEstimatePrice = (key, estimate, totalCalcPrice, value = 5, index = 0) => {
        let calcEstimate;

        // value를 기반으로 calcEstimate 계산
        if (value === 5) {
            calcEstimate = estimate.estimatePrice;

            // 반올림 처리
            calcEstimate = Math.round(calcEstimate * 100) / 100;

            if (calcEstimate < 300000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            } else if (calcEstimate < 1300000) {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;

                const thousandWon = Math.floor(calcEstimate / 100000);
                const tenThousandWon = calcEstimate % 100000;

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
            } else {
                calcEstimate = Math.round(calcEstimate / 50000) * 50000;
            }
        } else if (1 <= value && value < 5) {
            const minEstimate = Math.round(estimate.baseCost * 1.15);
            const midEstimate = estimate.estimatePrice;

            calcEstimate = minEstimate + ((midEstimate - minEstimate) / (5 - 1)) * (value - 1);
            calcEstimate = Math.round(calcEstimate / 5000) * 5000;

            if (calcEstimate <= 980000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            } else {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;
            }
        } else if (5 < value && value <= 10) {
            const midEstimate = estimate.estimatePrice;
            const maxEstimate = Math.round(estimate.estimatePrice * 1.5);

            calcEstimate = midEstimate + ((maxEstimate - midEstimate) / (10 - 5)) * (value - 5);

            if (calcEstimate <= 980000) {
                calcEstimate = Math.round(calcEstimate / 5000) * 5000;
            } else {
                calcEstimate = Math.round(calcEstimate / 10000) * 10000;
            }
        }

        // 기타 계산 및 상태 업데이트
        const roundingUnit = 5000;
        const calculatedDeposit = calcEstimate - totalCalcPrice
            // Math.round((calcEstimate - totalCalcPrice) * (estimate.depositAdjustmentRate + 1) / roundingUnit) * roundingUnit;

        const adjustedDeposit =
            calculatedDeposit >= calcEstimate ? calcEstimate : calculatedDeposit;

        setDispatchAmountList((prevMap = {}) => {
            return {
                ...prevMap,
                [key]: [
                    ...prevMap[key].map((item, idx) =>
                        idx === index
                            ? {
                                ...item[0],
                                estimate,
                                totalCalcPrice,
                                calcEstimate,
                                calcDeposit: adjustedDeposit,
                                calcSurtax: Math.round(calcEstimate * 0.1),
                            }
                            : item[0]
                    ),
                ],
            };
        });
    };

    const handleRefreshSubEstimate = (value) => {
        let tempDispatchAmountList = { ...dispatchAmountList };

        Object.entries(dispatchAmountList).forEach(([key, items]) => {
            tempDispatchAmountList[key] = items.map((item, index) => {
                // 방어 코드: estimate 유효성 확인
                if (!item.estimate || !item.estimate.estimatePrice) {
                    console.warn(`Invalid estimate for item at key: ${key}, index: ${index}`);
                    return item; // 기존 item 반환
                }

                let calcEstimate;

                // value를 기반으로 calcEstimate 계산
                if (value === 5) {
                    calcEstimate = item.estimate.estimatePrice;

                    // 반올림 처리
                    calcEstimate = Math.round(calcEstimate * 100) / 100;

                    if (calcEstimate < 300000) {
                        calcEstimate = Math.round(calcEstimate / 5000) * 5000;
                    } else if (calcEstimate < 1300000) {
                        calcEstimate = Math.round(calcEstimate / 10000) * 10000;

                        const thousandWon = Math.floor(calcEstimate / 100000);
                        const tenThousandWon = calcEstimate % 100000;

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
                    } else {
                        calcEstimate = Math.round(calcEstimate / 50000) * 50000;
                    }
                } else if (1 <= value && value < 5) {
                    const minEstimate = Math.round(item.estimate.baseCost * 1.15);
                    const midEstimate = item.estimate.estimatePrice;

                    calcEstimate = minEstimate + ((midEstimate - minEstimate) / (5 - 1)) * (value - 1);
                    calcEstimate = Math.round(calcEstimate / 5000) * 5000;

                    if (calcEstimate <= 980000) {
                        calcEstimate = Math.round(calcEstimate / 5000) * 5000;
                    } else {
                        calcEstimate = Math.round(calcEstimate / 10000) * 10000;
                    }
                } else if (5 < value && value <= 10) {
                    const midEstimate = item.estimate.estimatePrice;
                    const maxEstimate = Math.round(item.estimate.estimatePrice * 1.5);

                    calcEstimate = midEstimate + ((maxEstimate - midEstimate) / (10 - 5)) * (value - 5);

                    if (calcEstimate <= 980000) {
                        calcEstimate = Math.round(calcEstimate / 5000) * 5000;
                    } else {
                        calcEstimate = Math.round(calcEstimate / 10000) * 10000;
                    }
                }

                // 기타 계산
                const roundingUnit = 5000;
                const calculatedDeposit = calcEstimate - item.totalCalcPrice;

                const adjustedDeposit =
                    calculatedDeposit >= calcEstimate ? calcEstimate : calculatedDeposit;

                return {
                    ...item,
                    estimate: item.estimate,
                    totalCalcPrice: item.totalCalcPrice,
                    calcEstimate,
                    calcDeposit: adjustedDeposit,
                    calcSurtax: Math.round(calcEstimate * 0.1),
                };
            });
        });

        setDispatchAmountList({ ...tempDispatchAmountList });
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

    const dispatchAmountListMutate = async (key, updatedForm, index = 0) => {
        await consultantMutateAsync(updatedForm, {
            onSuccess: async (data) => {
                setDispatchAmountList((prevMap = {}) => {
                    const currentList = prevMap[key] || [];
                    const updatedList = currentList.length > 0 ? [{...currentList}, {...data}] : [{...data}];

                    return {
                        ...prevMap,
                        [key]: updatedList,
                    };
                });

                handleSubEstimatePrice(key, data[0].estimatePrice, data[0].totalCalcPrice, sliderValue, index);
            }
        });
    }

    const handleCheckSave = async (key, checked, name) => {
        if (checked) {
            if (Number(tempTotalCbm) <= 10 && consultantDataForm.vehicleCount < 2) {
                if (key === 1) {
                    const updatedForm1 = {
                        ...consultantDataForm,
                        moveTypeId: key,
                        moveTypeName: name,
                        isAlone: true,
                    };

                    await dispatchAmountListMutate(key, updatedForm1);
                } else if(key === 4) {
                    const transPortHelper = {
                        helperType: "TRANSPORT",
                        peopleCount: 1,
                    };

                    const updatedForm2 = {
                        ...consultantDataForm,
                        moveTypeId: key,
                        moveTypeName: name,
                        isAlone: true,
                        employHelperPeople: consultantDataForm.employHelperPeople.map((item, index) =>
                            index === 0
                                ? transPortHelper
                                : key === 4 && index === 1
                                    ? {
                                        helperType: "PACKING_CLEANING",
                                        peopleCount: 1,
                                    }
                                    : item
                        ),
                    };

                    await dispatchAmountListMutate(key, updatedForm2);
                } else {
                    const updatedForm1 = {
                        ...consultantDataForm,
                        moveTypeId: key,
                        moveTypeName: name,
                        isAlone: true,
                    };

                    const transPortHelper = {
                        helperType: "TRANSPORT",
                        peopleCount: 1,
                    };

                    const updatedForm2 = {
                        ...consultantDataForm,
                        moveTypeId: key,
                        moveTypeName: name,
                        isAlone: true,
                        employHelperPeople: consultantDataForm.employHelperPeople.map((item, index) =>
                            index === 0
                                ? transPortHelper
                                : key === 4 && index === 1
                                    ? {
                                        helperType: "PACKING_CLEANING",
                                        peopleCount: 1,
                                    }
                                    : item
                        ),
                    };

                    await dispatchAmountListMutate(key, updatedForm1);
                    await dispatchAmountListMutate(key, updatedForm2, 1);
                }
            } else {
                const updatedForm = {
                    ...consultantDataForm,
                    moveTypeId: key,
                    moveTypeName: name,
                    employHelperPeople: consultantDataForm.employHelperPeople.map((item, index) =>
                        key === 4 && index === 1 ?
                            {
                                helperType: "PACKING_CLEANING",
                                peopleCount: 1,
                            }
                            : item
                    ),
                };

                dispatchAmountListMutate(key, updatedForm);
            }

        } else {
            setDispatchAmountList((prev) => {
                const {[key]: _, ...rest} = prev;
                return rest;
            });
        }

        setCheckBox((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                checked: checked,
            },
        }));
    }

    const handleCopy = () => {
        if (textRef.current) {
            let textToCopy = '';

            // 자식 노드를 순회하면서 텍스트와 입력 필드 값을 추출
            const traverseNodes = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // 텍스트 노드의 내용을 추가
                    textToCopy += node.textContent.trim();
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                        // 입력 필드의 값을 추가
                        textToCopy += node.value.trim();
                    } else if (node.tagName === 'BR') {
                        // 줄바꿈 추가
                        textToCopy += '\n';
                    } else if (node.classList.contains('flex')) {
                        // 견적 금액 div를 한 줄로 처리
                        const inlineText = Array.from(node.childNodes)
                            .map((child) => {
                                if (child.nodeType === Node.TEXT_NODE) return child.textContent.trim();
                                if (child.tagName === 'INPUT') return child.value.trim();
                                if (child.tagName === 'SPAN') return child.textContent.trim();
                                return '';
                            })
                            .join(''); // 한 줄로 결합
                        textToCopy += inlineText + '\n';
                    } else {
                        // 자식 노드를 재귀적으로 탐색
                        Array.from(node.childNodes).forEach(traverseNodes);
                    }
                }
            };

            // `textRef`의 모든 자식 노드를 탐색
            Array.from(textRef.current.childNodes).forEach(traverseNodes);

            // 클립보드에 복사
            navigator.clipboard.writeText(textToCopy).then(() => {
                message.success('견적 내용이 복사되었습니다!');
            });
        }
    };


    const handleTextChange = (id, field, value) => {
        setDispatchAmountList((prevList) => {
            const [groupId, itemIndex] = id.split("-").map(Number);
            const updatedGroup = [...prevList[groupId]];
            updatedGroup[itemIndex] = {
                ...updatedGroup[itemIndex],
                [field]: value, // 특정 필드 업데이트
            };
            return {
                ...prevList,
                [groupId]: updatedGroup, // 수정된 그룹으로 리스트 업데이트
            };
        });
    };

    useEffect(() => {
        setCalcData(prev => ({
            ...prev,
            dokcha: dokchaPrice
        }))
    }, [dokchaPrice]);

    useEffect(() => {
        handleRefreshSubEstimate(sliderValue);
    }, [sliderValue]);

    useEffect(() => {
        const primaryData = processDispatchData(dispatchAmount, dokchaPrice);
        setCalcData(primaryData.calcData);
        setEstimate(primaryData.estimate);
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

    useEffect(() => {
        setCheckBox({
            1: {
                checked: false,
                name: '단순운송'
            },
            2: {
                checked: false,
                name: '일반운송'
            },
            3: {
                checked: false,
                name: '반포장이사'
            },
            4: {
                checked: false,
                name: '포장이사'
            }
        });
        setDispatchAmountList({});
        closeModal();
    }, [consultantDataForm]);

    return (
        <div className="flex flex-col h-full">
            <Card title="배차 금액" className="shadow-md rounded-md">
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
                    className="flex gap-1 h-[17vh] overflow-y-auto"
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
            <Card title={
                <div className="flex justify-between items-center">
                    <span>견적 자판기</span>
                    {!isAnyCheckBoxSelected ? (
                        <Tooltip title="아래의 체크박스 선택 후 사용할 수 있습니다." placement="top">
                            <Button
                                className="px-5 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                                icon={<ZoomInOutlined />}
                                disabled
                            >
                                추가 견적 상세 보기
                            </Button>
                        </Tooltip>
                    ) : (
                        <Button
                            className="px-5 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                            icon={isModalOpen ? <ZoomOutOutlined /> : <ZoomInOutlined />}
                            onClick={isModalOpen ? closeModal : showModal}
                        >
                            {isModalOpen ? '추가 견적 상세 닫기' : '추가 견적 상세 보기'}
                        </Button>
                    )}
                </div>
            }
                  className="shadow-md rounded-md flex-1"
            >
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
                <div className="relative">
                    <div
                        className={`absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 transition-opacity duration-500 ${
                            isFormValid ? "opacity-0 pointer-events-none" : "opacity-100"
                        }`}
                    >
                        <div
                            className="text-sm text-gray-700 font-semibold transform transition-transform duration-500 ease-in-out"
                            style={{
                                transform: isFormValid ? "translateY(-20px)" : "translateY(0)",
                            }}
                        >
                            배차 금액을 조회해야 기능이 활성화됩니다.
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pl-4 pr-4 border rounded-md">
                        <Checkbox
                            onChange={(e) => handleCheckSave(1, e.target.checked, "단순운송")}
                            className="text-gray-700"
                            disabled={!isFormValid}
                            checked={checkBox[1].checked}
                        >
                            단순운송
                        </Checkbox>
                        <Checkbox
                            onChange={(e) => handleCheckSave(2, e.target.checked, "일반이사")}
                            className="text-gray-700"
                            disabled={!isFormValid}
                            checked={checkBox[2].checked}
                        >
                            일반이사
                        </Checkbox>
                        <Checkbox
                            onChange={(e) => handleCheckSave(3, e.target.checked, "반포장이사")}
                            className="text-gray-700"
                            disabled={!isFormValid}
                            checked={checkBox[3].checked}
                        >
                            반포장이사
                        </Checkbox>
                        <Checkbox
                            onChange={(e) => handleCheckSave(4, e.target.checked, "포장이사")}
                            className="text-gray-700"
                            disabled={!isFormValid}
                            checked={checkBox[4].checked}
                        >
                            포장이사
                        </Checkbox>
                    </div>
                </div>
                <Drawer
                    title={
                        <div className="flex justify-between items-center">
                            <span>추가 견적 상세</span>
                            <Button
                                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                                icon={<CopyOutlined/>}
                                onClick={handleCopy}
                            >
                                견적금액 복사
                            </Button>
                        </div>
                    }
                    placement="right"
                    onClose={closeModal}
                    open={isModalOpen}
                    width={650}
                    mask={false}
                >
                    <DispatchAmountListText
                        ref={textRef}
                        consultantDataForm={consultantDataForm}
                        dispatchAmountList={dispatchAmountList}
                        onUpdate={handleTextChange}
                    />
                </Drawer>
            </Card>
        </div>
    );
};

export default DispatchCost;