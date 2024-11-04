import React, { forwardRef } from 'react';
import { Form, Input } from 'antd';

const AddressInput = forwardRef(({ label, location, handleLocationChange, setCityCode, handleCoordinates, addressList, showAddressList, onSelectAddress, setShowAddressList }, ref) => (
    <Form.Item label={label} style={{ position: 'relative', width: '100%' }} ref={ref}>
        <Input
            placeholder="주소를 입력하세요"
            value={location}
            onChange={handleLocationChange}
            onFocus={() => setShowAddressList(true)} // 포커스 시 리스트 표시
            onBlur={() => setShowAddressList(false)} // 포커스를 잃으면 리스트 숨김
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
                onMouseDown={(e) => e.preventDefault()} // 리스트 클릭 시 blur 방지
            >
                {addressList.map((address, index) => (
                    <li
                        key={index}
                        onMouseDown={(e) => {
                            e.preventDefault(); // 기본 동작 방지
                            setCityCode(address.address?.b_code || undefined);
                            handleCoordinates({x: address.x, y: address.y})
                            onSelectAddress(address.address_name); // 주소 선택 처리
                            setShowAddressList(false); // 리스트 닫기
                        }}
                        style={{ cursor: 'pointer', padding: '5px 0' }}
                    >
                        {address.address_name}
                    </li>
                ))}
            </ul>
        )}
    </Form.Item>
));

export default AddressInput;
