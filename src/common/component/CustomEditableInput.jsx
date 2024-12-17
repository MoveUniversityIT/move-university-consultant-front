import React, { useRef, useState, useEffect } from "react";
import { Input } from "antd";

const CustomEditableInput = ({ node, updateNodeTitle, editingKey, setEditingKey }) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState(node.title || ""); // 현재 입력 값
    const [inputWidth, setInputWidth] = useState("auto"); // 입력 필드의 동적 너비

    const calculateWidth = (text) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "14px Arial"; // Input 텍스트 폰트 설정
        return context.measureText(text).width + 20; // 텍스트 길이 + 여백
    };

    useEffect(() => {
        if (editingKey === node.key) {
            setInputWidth(`${calculateWidth(inputValue)}px`);
        }
    }, [editingKey, inputValue]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue); // 현재 입력 값 업데이트
        setInputWidth(`${calculateWidth(newValue)}px`); // 실시간 너비 조정
    };

    return editingKey === node.key ? (
        <Input
            ref={inputRef}
            value={inputValue}
            autoFocus
            onChange={handleInputChange} // 입력 값 변경 시 호출
            onBlur={() => updateNodeTitle(node.key, inputValue)} // 포커스 해제 시 저장
            onPressEnter={() => updateNodeTitle(node.key, inputValue)} // 엔터 시 저장
            className="border border-gray-300 rounded-lg px-2 py-1"
            style={{ width: inputWidth, minWidth: "50px" }}
        />
    ) : (
        <span
            className="flex-grow font-medium text-gray-800"
            onDoubleClick={() => setEditingKey(node.key)}
        >
            {node.title}
        </span>
    );
};

export default CustomEditableInput;
