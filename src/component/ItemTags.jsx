import React from 'react';
import {Tag} from "antd";

const ItemTags = ({ selectedItems, handleItemRemove }) => (
    <div style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        backgroundColor: '#fafafa'
    }}>
        {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
                <Tag key={item.itemId} closable onClose={() => handleItemRemove(item)}>
                    {item.itemName}
                </Tag>
            ))
        ) : (
            <span>선택된 물품이 없습니다.</span>
        )}
    </div>
);
export default ItemTags;