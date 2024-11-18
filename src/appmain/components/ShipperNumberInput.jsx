import React, { useState } from "react";
import { Form, Input } from "antd";

const ShipperNumberInput = () => {
    const [shipperNumber, setShipperNumber] = useState("");

    const formatShipperNumber = (value) => {
        // 숫자만 추출
        const numericValue = value.replace(/\D/g, "");
        // 핸드폰 번호 형식 적용
        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 7)
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
    };

    const handleChange = (e) => {
        const formattedValue = formatShipperNumber(e.target.value);
        setShipperNumber(formattedValue);
    };

    return (
        <Form.Item className="flex-1 !mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">화주번호:</label>
            <Input
                className="w-full"
                placeholder="예: 010-1234-1234"
                value={shipperNumber}
                onChange={handleChange}
                maxLength={13} // 최대 길이 제한
            />
        </Form.Item>
    );
};

export default ShipperNumberInput;