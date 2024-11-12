import React from 'react';
import { Button, Form, InputNumber, Space, Checkbox } from "antd";

const HelperSelector = ({ label, helpers, setHelpers }) => {

    const addWorkerType = (selectedType) => {
        if (!helpers.some(item => item.helperType === selectedType)) {
            setHelpers((prevList) => [
                ...prevList,
                { helperType: selectedType, peopleCount: 1 }
            ]);
        }
    };

    const removeWorkerType = (type) => {
        setHelpers((prevList) => prevList.filter(item => item.helperType !== type));
    };

    const updateWorkerCount = (index, value) => {
        setHelpers((prevList) =>
            prevList.map((item, idx) =>
                idx === index ? { ...item, peopleCount: value || 0 } : item
            )
        );
    };

    const handleCheckboxChange = (checked, type) => {
        if (checked) {
            addWorkerType(type);
        } else {
            removeWorkerType(type);
        }
    };

    return (
        <Form.Item label={label} style={{ position: 'relative' }}>
            <Space direction="horizontal" style={{ width: '100%' }}>
                <Space>
                    <Checkbox
                        onChange={(e) => handleCheckboxChange(e.target.checked, 'TRANSPORT')}
                        checked={helpers.some(item => item.helperType === 'TRANSPORT')}
                    >
                        인부 추가
                    </Checkbox>
                    <Checkbox
                        onChange={(e) => handleCheckboxChange(e.target.checked, 'PACKING_CLEANING')}
                        checked={helpers.some(item => item.helperType === 'PACKING_CLEANING')}
                    >
                        정리 이모 추가
                    </Checkbox>
                </Space>

                {/* 선택된 인부/이모 리스트 */}
                {helpers.map((item, index) => (
                    <Space key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{item.helperType === 'TRANSPORT' ? '인부' : '이모'}</span>
                        <InputNumber
                            min={1}
                            value={item.peopleCount}
                            onChange={(value) => updateWorkerCount(index, value)}
                            formatter={(value) => `${value} 명`}
                        />
                        <Button type="link" onClick={() => removeWorkerType(item.type)}>
                            삭제
                        </Button>
                    </Space>
                ))}
            </Space>
        </Form.Item>
    );
}

export default HelperSelector;