import React, {useEffect, useState} from 'react';
import {Alert, Button, Form, Input, InputNumber, Select} from 'antd';
import {useGetItem, useSaveItem, useUpdateItem} from '@hook/useConsultant'; // 업데이트 함수 추가

const { Option } = Select;

const AddItem = ({ itemList, onItemAdded, pendingItemList }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState({});
    const [itemId, setItemId] = useState(null);
    const [itemInput, setItemInput] = useState('');
    const [cbmInput, setCbmInput] = useState(null);
    const [additionalFee, setAdditionalFee] = useState(null);
    const [weight, setWeight] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const { mutate: getItemMutate } = useGetItem();
    const { mutate: itemMutate } = useSaveItem();
    const { mutate: updateItemMutate } = useUpdateItem();

    useEffect(() => {
        setItems(itemList);
    }, [itemList]);

    const categories = Object.keys(itemList);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setError(null);
        setInfo(null);
        setIsUpdateMode(false); // 카테고리가 변경될 때 수정 모드를 해제합니다.
        resetFields();
    };

    const handleItemInputChange = (value) => {
        setItemInput(value);

        if (value.trim()) {
            let duplicateCategory = null;
            let duplicateItem = null;

            const isDuplicate = Object.entries(items).some(([category, categoryItems]) => {
                const item = categoryItems.find((item) => item.itemName === value);
                if (item) {
                    duplicateCategory = category;
                    duplicateItem = item;
                    return true;
                }
                return false;
            });

            if (isDuplicate) {
                setError(`이미 존재하는 아이템입니다: ${value} (카테고리: ${duplicateCategory})`);
                setInfo(null);
                setIsUpdateMode(true);
                getItemMutate(duplicateItem.itemId, {
                    onSuccess: (data) => {
                        setItemId(duplicateItem.itemId)
                        setSelectedCategory(duplicateCategory)
                        setItemInput(data.itemName)
                        setCbmInput(data.cbm)
                        setAdditionalFee(data.additionalFee)
                        setWeight(data.weight)
                    }
                })
            } else {
                setError(null);
                setInfo(`추가 가능한 아이템입니다: ${value} (카테고리: ${selectedCategory})`);
                setIsUpdateMode(false);
                resetFields();
            }
        } else {
            setError(null);
            setInfo(null);
            setIsUpdateMode(false);
        }
    };

    const resetFields = () => {
        setItemId(null);
        setCbmInput(null);
        setAdditionalFee(null);
        setWeight(null);
    };

    const handleAddOrUpdateItem = () => {
        if (!selectedCategory) {
            alert("대분류를 선택하세요.");
            return;
        }
        if (!itemInput.trim()) {
            alert("아이템 이름을 입력하세요.");
            return;
        }
        if (cbmInput === null || cbmInput === '') {
            alert("CBM 값을 입력하세요.");
            return;
        }
        if (additionalFee === null || additionalFee === '') {
            alert("추가 비용 유형을 입력하세요.");
            return;
        }
        if (weight === null || weight === '') {
            alert("무게 값을 입력하세요.");
            return;
        }

        const confirmed = window.confirm(isUpdateMode ? "수정하시겠습니까?" : "전송하시겠습니까?");
        if (!confirmed) return;

        const item = {
            itemCategoryName: selectedCategory,
            itemName: itemInput,
            cbm: cbmInput,
            additionalFee: additionalFee,
            weight: weight,
        };

        if (isUpdateMode) {
            updateItemMutate({itemId, item}, {
                onSuccess: () => {
                    onItemAdded();
                    setIsUpdateMode(false);
                    resetForm();
                }
            });
        } else {
            // 아이템 추가 로직
            itemMutate(item, {
                onSuccess: () => {
                    onItemAdded();
                    resetForm();
                }
            });
        }
    };

    const resetForm = () => {
        setSelectedCategory(null);
        setItemInput('');
        setCbmInput(null);
        setAdditionalFee(null);
        setWeight(null);
        setError(null);
        setInfo(null);
        setIsUpdateMode(false);
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

                <Form.Item label="물품 추가 비용(배차 금액 계산시 사용안하고 있음)">
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="물품 추가 비용을 입력하세요"
                        value={additionalFee}
                        onChange={(value) => setAdditionalFee(value)}
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
                        disabled={!selectedCategory}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        onClick={handleAddOrUpdateItem}
                        disabled={!selectedCategory || !itemInput.trim()}
                    >
                        {isUpdateMode ? '수정' : '저장'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddItem;