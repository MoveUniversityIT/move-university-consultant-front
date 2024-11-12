import React from "react";
import { Button, Form, InputNumber, Space, Checkbox } from "antd";

const GenderSelector = ({ label, customer, setCustomer }) => {
    const addGender = (selectedGender) => {
        if (!customer.some(item => item.gender === selectedGender)) {
            setCustomer(prevList => [
                ...prevList,
                { gender: selectedGender, peopleCount: 1 }
            ]);
        }
    };

    const removeGender = (gender) => {
        setCustomer(prevList => prevList.filter(item => item.gender !== gender));
    };

    const updateGenderCount = (index, value) => {
        setCustomer(prevList =>
            prevList.map((item, idx) =>
                idx === index ? { ...item, peopleCount: value || 0 } : item
            )
        );
    };

    const handleCheckboxChange = (checked, gender) => {
        if (checked) {
            addGender(gender);
        } else {
            removeGender(gender);
        }
    };

    return (
        <Form.Item label={label} style={{ position: 'relative' }}>
            <Space direction="horizontal" style={{ width: '100%' }}>
                {/* 남자와 여자 추가를 위한 체크박스 */}
                <Space>
                    <Checkbox
                        onChange={(e) => handleCheckboxChange(e.target.checked, 'male')}
                        checked={customer.some(item => item.gender === 'male')}
                    >
                        남자 추가
                    </Checkbox>
                    <Checkbox
                        onChange={(e) => handleCheckboxChange(e.target.checked, 'female')}
                        checked={customer.some(item => item.gender === 'female')}
                    >
                        여자 추가
                    </Checkbox>
                </Space>

                {/* 선택된 남자/여자 리스트 */}
                {customer.map((item, index) => (
                    <Space key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{item.gender === 'male' ? '남자' : '여자'}</span>
                        <InputNumber
                            min={1}
                            value={item.peopleCount}
                            onChange={(value) => updateGenderCount(index, value)}
                            formatter={(value) => `${value} 명`}
                        />
                        <Button type="link" onClick={() => removeGender(item.gender)} style={{ padding: "2px"}}>
                            삭제
                        </Button>
                    </Space>
                ))}
            </Space>
        </Form.Item>
    );
}

export default GenderSelector;