import React from 'react';
import {Checkbox, Form, Input, List, Tag} from 'antd';

const ItemForm = ({ searchTermRef, onInputChange, suggestions, handleSelectItem, searchTerm, handleInputKeyDown, items, setItems}) => {

    const handleCheckboxChange = (itemId, key, checked) => {
        setItems(prevItems => ({
            ...prevItems,
            [itemId]: {
                ...prevItems[itemId],
                [key]: checked ? "Y" : "N",
            }
        }));
    };

    return (
        <Form layout="vertical" style={{ display: 'flex', gap: '20px', height: '70vh', overflowY: 'auto' }}>
            <div style={{ flex: '1' }}>
                <Form.Item label="물품명">
                    <Input
                        placeholder="아이템 이름을 입력하고 콤마(,)로 구분하세요"
                        ref={searchTermRef}
                        value={searchTerm}
                        onChange={onInputChange}
                        onKeyDown={handleInputKeyDown}
                    />
                </Form.Item>

                {suggestions.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {suggestions.map((item, index) => (
                            <Tag
                                key={index}
                                onClick={handleSelectItem(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.itemName}
                            </Tag>
                        ))}
                    </div>
                )}
            </div>

            <div style={{flex: '1', borderLeft: '1px solid #ddd', paddingLeft: '20px'}}>
                <h3>아이템 목록 및 옵션 설정</h3>
                <List
                    dataSource={Object.values(items)}
                    renderItem={(item) => (
                        <List.Item style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>{item.itemName} {item.itemCount} 개</span>
                            <div>
                                {item.isDisassembly === "Y" && (
                                    <Checkbox
                                        style={{marginRight: '10px'}}
                                        checked={item?.requiredIsDisassembly === "Y"}
                                        onChange={(e) => handleCheckboxChange(item.itemId, 'requiredIsDisassembly', e.target.checked)}
                                    >
                                        분해
                                    </Checkbox>
                                )}
                                {item.isInstallation === "Y" && (
                                    <Checkbox
                                        checked={item?.requiredIsInstallation === "Y"}
                                        onChange={(e) => handleCheckboxChange(item.itemId, 'requiredIsInstallation', e.target.checked)}
                                    >
                                        설치
                                    </Checkbox>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </Form>
    );
};

export default ItemForm;