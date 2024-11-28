import React from "react";
import {Form, Input} from "antd";

const PhoneNumberInput = ({label, phoneNumber, setPhoneNumber, tabIndex}) => {
    const formatShipperNumber = (value) => {
        const numericValue = value.replace(/\D/g, "");

        if (numericValue.length <= 2) return numericValue;
        if (numericValue.length <= 4) return `${numericValue.slice(0, 2)}-${numericValue.slice(2)}`;
        if (numericValue.length <= 7) {

            if (numericValue.startsWith("02")) {
                return `${numericValue.slice(0, 2)}-${numericValue.slice(2)}`;
            }
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        }
        if (numericValue.length <= 10) {
            if (numericValue.startsWith("02")) {
                return `${numericValue.slice(0, 2)}-${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
            }
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        }
        return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
    };

    const handleChange = (e) => {
        const formattedValue = formatShipperNumber(e.target.value);
        setPhoneNumber(formattedValue);
    };

    return (
        <Form.Item className="flex-1 !mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}:</label>
            <Input
                className="w-full"
                placeholder="예: 010-1234-1234"
                value={phoneNumber}
                onChange={handleChange}
                maxLength={13}
                tabIndex={tabIndex}
            />
        </Form.Item>
    );
};

export default PhoneNumberInput;