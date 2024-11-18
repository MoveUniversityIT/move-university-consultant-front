import React from "react";
import { Form, Select, Space } from "antd";

const { Option } = Select;

const GenderSelector = ({ label, customer, setCustomer }) => {
    const handleGenderChange = (gender, count) => {
        if (count > 0) {
            if (customer.some((item) => item.gender === gender)) {
                // 이미 존재하는 경우 업데이트
                setCustomer((prevList) =>
                    prevList.map((item) =>
                        item.gender === gender ? { ...item, peopleCount: count } : item
                    )
                );
            } else {
                // 새로 추가
                setCustomer((prevList) => [
                    ...prevList,
                    { gender, peopleCount: count },
                ]);
            }
        } else {
            // 0명인 경우 삭제
            setCustomer((prevList) =>
                prevList.filter((item) => item.gender !== gender)
            );
        }
    };

    return (
        <Form.Item label={label} className="relative">
            <div className="flex gap-4 items-center">
                {/* 남자 선택 */}
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">남자</label>
                    <Select
                        className="w-32"
                        placeholder="명수 선택"
                        value={customer.find((item) => item.gender === "male")?.peopleCount || undefined}
                        onChange={(value) => handleGenderChange("male", value)}
                    >
                        <Option value={0}>0 명</Option>
                        <Option value={1}>1 명</Option>
                        <Option value={2}>2 명</Option>
                        <Option value={3}>3 명</Option>
                    </Select>
                </div>

                {/* 여자 선택 */}
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium">여자</label>
                    <Select
                        className="w-32"
                        placeholder="명수 선택"
                        value={customer.find((item) => item.gender === "female")?.peopleCount || undefined}
                        onChange={(value) => handleGenderChange("female", value)}
                    >
                        <Option value={0}>0 명</Option>
                        <Option value={1}>1 명</Option>
                        <Option value={2}>2 명</Option>
                        <Option value={3}>3 명</Option>
                    </Select>
                </div>
            </div>
        </Form.Item>
    );
};

export default GenderSelector;