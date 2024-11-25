import React, {useEffect} from 'react';
import {Form, InputNumber, Select} from "antd";

const MethodAndFloorInput = ({
                                 label,
                                 method,
                                 floor,
                                 area,
                                 householdMembers,
                                 customer,
                                 setMethod,
                                 setFloor,
                                 setArea,
                                 setHouseHoldMembers,
                                 setCustomer,
                                 consultant,
                                 handleMethodChange,
                                 handleFloorChange
                             }) => {

    const handleGenderChange = (gender, count) => {
        if (count > 0) {
            if (customer.some((item) => item.gender === gender)) {
                setCustomer((prevList) =>
                    prevList.map((item) =>
                        item.gender === gender ? {...item, peopleCount: count} : item
                    )
                );
            } else {
                setCustomer((prevList) => [
                    ...prevList,
                    {gender, peopleCount: count},
                ]);
            }
        } else {
            setCustomer((prevList) =>
                prevList.filter((item) => item.gender !== gender)
            );
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
                        <Select.Option key={method.methodId} value={method.methodName}>
                            {method.methodName}
                        </Select.Option>
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
                    onChange={setArea}
                />
            </Form.Item>

            <Form.Item label="거주 인원:" className="flex flex-col items-start !mb-3"
                       style={{flex: "0 1 auto", maxWidth: "120px"}}>
                <InputNumber
                    className="w-full min-w-[70px]"
                    placeholder="인원 수"
                    min={0}
                    value={householdMembers}
                    onChange={setHouseHoldMembers}
                />
            </Form.Item>

            <Form.Item label="남자 도움:" className="flex flex-col items-start !mb-3"
                       style={{flex: "0 1 auto", maxWidth: "120px"}}>
                <InputNumber
                    className="w-full min-w-[70px]"
                    placeholder="인원 수"
                    min={0}
                    max={10}
                    value={customer.find((item) => item.gender === "male")?.peopleCount || 0}
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
                    value={customer.find((item) => item.gender === "female")?.peopleCount || 0}
                    onChange={(value) => handleGenderChange("female", value)}
                />
            </Form.Item>
        </div>
    )
};

export default MethodAndFloorInput;