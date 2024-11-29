import React, {useEffect} from 'react';
import {Form, InputNumber, Select} from "antd";
const {Option} = Select;

const MethodAndFloorInput = ({
                                 label,
                                 method,
                                 floor,
                                 area,
                                 householdMembers,
                                 customers,
                                 setMethod,
                                 setFloor,
                                 setArea,
                                 setHouseHoldMembers,
                                 setCustomers,
                                 consultant,
                             }) => {

    const handleGenderChange = (gender, count) => {
        if (count > 0) {
            if (customers.some((item) => item.gender === gender)) {
                setCustomers((prevList) =>
                    prevList.map((item) =>
                        item.gender === gender ? {...item, peopleCount: count} : item
                    )
                );
            } else {
                setCustomers((prevList) => [
                    ...prevList,
                    {gender, peopleCount: count},
                ]);
            }
        } else {
            setCustomers((prevList) =>
                prevList.filter((item) => item.gender !== gender)
            );
        }
    }

    const handleMethodChange = (setMethod) => (value, option) => {
        if(value === '사다리' && floor <= 1) {
            setFloor(2);
        }

        setMethod({key: option.key, value});
    };

    const handleFloorChange = (setFloor) => (value) => {
        if (value === undefined || value === null || value === '') {
            setFloor(0);
        } else {
            setFloor(value);
        }
    }

    const handleAreaChange = (setArea) => (value) => {
        if (value === undefined || value === null || value === '') {
            setArea(0);
        } else {
            setArea(value);
        }
    }

    const handleHouseholdMembers = (setHouseHoldMembers) => (value) => {
        if (value === undefined || value === null || value === '') {
            setHouseHoldMembers(0);
        } else {
            setHouseHoldMembers(value);
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <Form.Item label={label + ':'} className="flex flex-col items-start !mb-3"
                       style={{flex: "1 1 auto", maxWidth: "150px"}}>
                <Select
                    placeholder="엘리베이터"
                    value={method}
                    onChange={handleMethodChange(setMethod)}
                    className="w-full min-w-[100px]"
                >
                    {consultant?.methods.map((method) => (
                        <Option key={method.methodId} value={method.methodName}>
                            {method.methodName}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item label="층수:" className="flex flex-col items-start !mb-3" style={{flex: "0 1 auto", maxWidth: "100px"}}>
                {!(method?.key === "3" || method?.key === "5") && (
                    <InputNumber
                        className="w-full min-w-[70px]"
                        placeholder="층수"
                        min={method?.key === "4" ? 2 : undefined}
                        value={floor}
                        onChange={handleFloorChange(setFloor)}
                    />
                )}
            </Form.Item>

            <Form.Item label="평수:" className="flex flex-col items-start !mb-3" style={{flex: "0 1 auto", maxWidth: "100px"}}>
                <InputNumber
                    className="w-full min-w-[70px]"
                    placeholder="평수"
                    min={1}
                    value={area}
                    onChange={handleAreaChange(setArea)}
                />
            </Form.Item>

            <Form.Item label="거주 인원:" className="flex flex-col items-start !mb-3"
                       style={{flex: "0 1 auto", maxWidth: "120px"}}>
                <InputNumber
                    className="w-full min-w-[70px]"
                    placeholder="인원 수"
                    min={0}
                    value={householdMembers}
                    onChange={handleHouseholdMembers(setHouseHoldMembers)}
                />
            </Form.Item>

            <Form.Item label="남자 도움:" className="flex flex-col items-start !mb-3"
                       style={{flex: "0 1 auto", maxWidth: "120px"}}>
                <InputNumber
                    className="w-full min-w-[70px]"
                    placeholder="인원 수"
                    min={0}
                    max={10}
                    value={customers?.find((item) => item.gender === "male")?.peopleCount || 0}
                    onChange={(value) => handleGenderChange("male", value)}
                />
            </Form.Item>

            <Form.Item label="여자 도움:" className="flex flex-col items-start !mb-3"
                       style={{flex: "0 1 auto", maxWidth: "120px"}}>
                <InputNumber
                    className="w-full min-w-[70px]"
                    placeholder="인원 수"
                    min={0}
                    max={10}
                    value={customers?.find((item) => item.gender === "female")?.peopleCount || 0}
                    onChange={(value) => handleGenderChange("female", value)}
                />
            </Form.Item>
        </div>
    )
};

export default MethodAndFloorInput;