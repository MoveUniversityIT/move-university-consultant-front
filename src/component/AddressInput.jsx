import React, { useState, useEffect } from 'react';
import { Form, Input } from 'antd';

const AddressInput = ({
                          label,
                          location,
                          handleLocationChange,
                          setCityCode,
                          handleCoordinates,
                          addressList,
                          showAddressList,
                          onSelectAddress,
                          setShowAddressList,
                          setSkipAddressChangeEvent
                      }) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleKeyDown = (e) => {
        console.log(selectedIndex);
        if (showAddressList && addressList.length > 0) {
            if (e.key === 'ArrowDown') {
                setSelectedIndex((prevIndex) => {
                    if (prevIndex <= -1) {
                        return 0;
                    }
                    return Math.min(prevIndex + 1, addressList.length - 1);
                });
            } else if (e.key === 'ArrowUp') {
                setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                const selectedAddress = addressList[selectedIndex];
                const addressName = selectedAddress.address_name.trim();
                const processedAddressName = addressName.replace(/[^가-힣\s]/g, "");

                setCityCode(selectedAddress.address?.b_code || undefined);
                handleCoordinates({ x: selectedAddress.x, y: selectedAddress.y });
                onSelectAddress(processedAddressName);
                setShowAddressList(false);
                setSkipAddressChangeEvent(true);
                setSelectedIndex(-1);
            }
        }else {
            setSkipAddressChangeEvent(false);
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [addressList, showAddressList]);

    return (
        <Form.Item label={label}>
            <Input
                placeholder="주소를 입력하세요"
                value={location}
                onChange={handleLocationChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                    setShowAddressList(true);
                    setSelectedIndex(0);
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
};

export default AddressInput;