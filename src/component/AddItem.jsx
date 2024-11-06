import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Alert } from 'antd';
import { useSaveItem } from '@hook/useConsultant';
import dayjs from 'dayjs';

const { Option } = Select;

const AddItem = ({ itemList, onItemAdded }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState({});
    const [itemInput, setItemInput] = useState('');
    const [cbmInput, setCbmInput] = useState(null);
    const [additionalFee, setAdditionalFee] = useState(null);
    const [weight, setWeight] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const { mutate: itemMutate } = useSaveItem();

    useEffect(() => {
        setItems(itemList);
    }, [itemList]);

    const categories = Object.keys(itemList);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setError(null);
        setInfo(null);
    };

    const handleItemInputChange = (value) => {
        setItemInput(value);

        if (value.trim()) {
            let duplicateCategory = null;
            const isDuplicate = Object.entries(items).some(([category, categoryItems]) => {
                const exists = categoryItems.some((item) => item.itemName === value);
                if (exists) duplicateCategory = category;
                return exists;
            });

            if (isDuplicate) {
                setError(`이미 존재하는 아이템입니다: ${value} (카테고리: ${duplicateCategory})`);
                setInfo(null);
            } else {
                setError(null);
                setInfo(`추가 가능한 아이템입니다: ${value} (카테고리: ${selectedCategory})`);
            }
        } else {
            setError(null);
            setInfo(null);
        }
    };

    const handleAddItem = () => {
        if (!selectedCategory || !itemInput.trim() || error) return;

        const confirmed = window.confirm("전송하시겠습니까?");
        if (!confirmed) return;

        const item = {
            itemCategoryName: selectedCategory,
            itemName: itemInput,
            cbm: cbmInput,
            additionalFee: additionalFee,
            weight: weight,
        };

        itemMutate(item, {
            onSuccess: () => {
                onItemAdded();
                setSelectedCategory(null);
                setItemInput('');
                setCbmInput(null);
                setAdditionalFee(null);
                setWeight(null);
                setError(null);
                setInfo(null);
            }
        });
    };

    return (
        <div>
            <Form layout="vertical">
                <Form.Item label="대분류 선택">
                    <Select placeholder="대분류를 선택하세요" onChange={handleCategoryChange} value={selectedCategory}>
                        {categories.map((category) => (
                            <Option key={category} value={category}>
                                {category}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="아이템 추가">
                    <Input
                        style={{ marginBottom: '5px' }}
                        placeholder="추가할 아이템을 입력하세요"
                        value={itemInput}
                        onChange={(e) => handleItemInputChange(e.target.value)}
                        disabled={!selectedCategory}
                    />

                    {error && <Alert message={error} type="error" showIcon closable />}
                    {info && <Alert message={info} type="success" showIcon closable />}
                </Form.Item>

                <Form.Item label="CBM">
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="CBM을 입력하세요"
                        value={cbmInput}
                        onChange={(value) => setCbmInput(value)}
                        min={0}
                        step={0.1}
                        disabled={!selectedCategory}
                    />
                </Form.Item>

                <Form.Item label="물품 추가 비용(배차 비용 계산시 사용안하고 있음)">
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="물품 추가 비용을 입력하세요"
                        value={additionalFee}
                        onChange={(value) => setAdditionalFee(value)}
                        min={0}
                        step={0.1}
                        disabled={!selectedCategory}
                    />
                </Form.Item>

                <Form.Item label="무게">
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="무게를 입력하세요"
                        value={weight}
                        onChange={(value) => setWeight(value)}
                        min={0}
                        step={0.1}
                        disabled={!selectedCategory}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleAddItem}
                        disabled={!selectedCategory || !itemInput.trim() || !!error}
                    >
                        저장
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddItem;