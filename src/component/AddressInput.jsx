import React, { useState, useEffect, forwardRef } from 'react';
import { Form, Input } from 'antd';

const AddressInput = forwardRef(({ label, location, handleLocationChange, setCityCode, handleCoordinates, addressList, showAddressList, onSelectAddress, setShowAddressList }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleKeyDown = (e) => {
        if (showAddressList && addressList.length > 0) {
            if (e.key === 'ArrowDown') {
                setSelectedIndex((prevIndex) => {
                    // 리스트가 열렸을 때 첫 번째 ArrowDown 입력 시 첫 항목이 선택되도록 설정
                    return prevIndex === -1 ? 0 : Math.min(prevIndex + 1, addressList.length - 1);
                });
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
                e.preventDefault();
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                // Enter 키로 선택
                const selectedAddress = addressList[selectedIndex];
                setCityCode(selectedAddress.address?.b_code || undefined);
                handleCoordinates({ x: selectedAddress.x, y: selectedAddress.y });
                onSelectAddress(selectedAddress.address_name);
                setShowAddressList(false);
                setSelectedIndex(-1); // 선택 후 초기화
                e.preventDefault();
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [addressList, showAddressList, selectedIndex]);

    return (
        <Form.Item label={label} style={{ position: 'relative', width: '240px' }} ref={ref}>
            <Input
                placeholder="주소를 입력하세요"
                value={location}
                onChange={handleLocationChange}
                onFocus={() => {
                    setShowAddressList(true);
                    setSelectedIndex(0); // 리스트 열릴 때 첫 번째 항목 선택
                }}
                onBlur={() => setShowAddressList(false)}
            />
            {showAddressList && addressList.length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        padding: '10px',
                        marginTop: '5px',
                        backgroundColor: '#fff',
                        zIndex: 1000
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {addressList.map((address, index) => (
                        <li
                            key={index}
                            onMouseDown={(e) => {
                                setCityCode(address.address?.b_code || undefined);
                                handleCoordinates({ x: address.x, y: address.y });
                                onSelectAddress(address.address_name);
                                setShowAddressList(false);
                                e.preventDefault();
                            }}
                            style={{
                                cursor: 'pointer',
                                padding: '5px 0',
                                backgroundColor: selectedIndex === index ? '#e6f7ff' : '#fff'
                            }}
                        >
                            {address.address_name}
                        </li>
                    ))}
                </ul>
            )}
        </Form.Item>
    );
});

export default AddressInput;