import React, {useEffect} from 'react';
import {Form, InputNumber, Select, Space} from "antd";

const MethodAndFloorInput = ({
                                 label,
                                 method,
                                 floor,
                                 setMethod,
                                 setFloor,
                                 consultant,
                                 handleMethodChange,
                                 handleFloorChange
                             }) => {
    useEffect(() => {
        method?.key === '4' ? setFloor(2) : setFloor(1);

    }, [method]);

    return (
        <Form.Item label={label}>
            <Space.Compact>
                <Select
                    style={{width: '150px'}}
                    placeholder="예: 엘리베이터"
                    value={method}
                    onChange={handleMethodChange(setMethod, setFloor)}
                >
                    {consultant.methods.map((method) => (
                        <Select.Option key={method.methodId} value={method.methodName}>
                            {method.methodName}
                        </Select.Option>
                    ))}
                </Select>
                {!(method?.key === '3' || method?.key === '5') && (
                    <InputNumber
                        placeholder="층수"
                        min={method?.key === '4' ? 2 : undefined}
                        value={floor}
                        onChange={handleFloorChange(setFloor)}
                        formatter={(value) => `${value} 층`}
                        parser={(value) => value.replace(' 층', '')}
                    />
                )}
            </Space.Compact>
        </Form.Item>
    )
};

export default MethodAndFloorInput;