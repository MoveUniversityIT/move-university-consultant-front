import React, {useState, useEffect} from 'react';
import {Form, Input, Tooltip} from 'antd';
import {ExclamationCircleOutlined} from "@ant-design/icons";

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
                          setSkipAddressChangeEvent,
                          tabIndex,
                          isLocationError
                      }) => {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleKeyDown = (e) => {
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

                setCityCode(selectedAddress.address?.b_code || undefined);
                handleCoordinates({x: selectedAddress.x, y: selectedAddress.y});
                onSelectAddress(addressName);
                setShowAddressList(false);
                setSkipAddressChangeEvent(true);
                setSelectedIndex(-1);
            }
        } else {
            setSkipAddressChangeEvent(false);
        }
    };

    useEffect(() => {
        setSelectedIndex(0);
    }, [addressList, showAddressList]);

    return (
        <Form.Item className="mb-2.5">
            <div className="flex items-center">
                {!_.isEmpty(label) && (
                    <label className="w-12 text-gray-700 font-medium">{label}:</label>
                )}

                <div className="relative flex-1">
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
                        className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
                        style={{ paddingRight: isLocationError ? '40px' : '10px' }}
                        tabIndex={tabIndex}
                    />

                    {isLocationError && (
                        <Tooltip title="유효하지 않은 주소" className="cursor-pointer">
                            <ExclamationCircleOutlined
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'red',
                                }}
                            />
                        </Tooltip>
                    )}

                    {showAddressList && addressList.length > 0 && (
                        <ul
                            className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-gray-300 bg-white rounded-lg shadow-lg z-50"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {addressList.map((address, index) => (
                                <li
                                    key={index}
                                    onMouseDown={(e) => {
                                        setCityCode(address.address?.b_code || undefined);
                                        handleCoordinates({x: address.x, y: address.y});
                                        onSelectAddress(address.address_name);
                                        setShowAddressList(false);
                                        e.preventDefault();
                                    }}
                                    className={`px-4 py-1 cursor-pointer ${
                                        selectedIndex === index ? 'bg-blue-100' : 'bg-white'
                                    } hover:bg-blue-50`}
                                >
                                    {address.address_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Form.Item>
    );
};

export default AddressInput;