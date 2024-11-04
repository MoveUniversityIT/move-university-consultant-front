import React from "react";
import {Button, Form, InputNumber, Space, Tag} from "antd";


const GenderSelector = ({label, addGenderCount, helperList, updateGenderCount, isGenderAdded, removeGender}) => {
    return (
        <Form.Item label={label} style={{ position: 'relative' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                    <Tag
                        color="blue"
                        onClick={() => addGenderCount('male')}
                        disabled={isGenderAdded('male')}
                        style={{
                            cursor: isGenderAdded('male') ? 'not-allowed' : 'pointer',
                            opacity: isGenderAdded('male') ? 0.5 : 1
                        }}
                    >
                        남자 추가
                    </Tag>
                    <Tag
                        color="pink"
                        onClick={() => addGenderCount('female')}
                        disabled={isGenderAdded('female')}
                        style={{
                            cursor: isGenderAdded('female') ? 'not-allowed' : 'pointer',
                            opacity: isGenderAdded('female') ? 0.5 : 1
                        }}
                    >
                        여자 추가
                    </Tag>
                </Space>

                {helperList.map((item, index) => (
                    <Space key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{item.gender === 'male' ? '남자' : '여자'}</span>
                        <InputNumber
                            min={1}
                            value={item.peopleNumber}
                            onChange={(value) => updateGenderCount(index, value)}
                            formatter={(value) => `${value} 명`}
                        />
                        <Button type="link" onClick={() => removeGender(item.gender)}>
                            삭제
                        </Button>
                    </Space>
                ))}

                <div>
                    <h3>선택된 목록:</h3>
                    {helperList.map((item, index) => (
                        <div key={index}>
                            {item.gender === 'male' ? '남자' : '여자'} {item.peopleNumber}명
                        </div>
                    ))}
                </div>
            </Space>
        </Form.Item>
    )
}

export default GenderSelector;