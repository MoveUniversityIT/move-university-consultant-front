import React, { useState } from "react";
import { Input, Button } from "antd";

const { TextArea } = Input;

const CustomEditableInput = ({ node, updateNodeTitle, editingKey, setEditingKey }) => {
    const [inputValue, setInputValue] = useState(node.title || "");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSave = () => {
        updateNodeTitle(node.key, inputValue);
        setEditingKey(null);
    };

    return editingKey === node.key ? (
        <div className="flex items-center gap-2 w-full">
            <TextArea
                value={inputValue}
                autoFocus
                onChange={handleInputChange}
                autoSize={{ minRows: 1}}
                className="font-medium text-gray-800 whitespace-pre-wrap"
                style={{
                    flexGrow: 1,
                    width: "100%",
                    maxWidth: "90%",
                    minWidth: "calc(55vw - 100px)",
                }}
            />

            <div className="flex gap-2 shrink-0">
                <Button
                    type="primary"
                    size="small"
                    onClick={handleSave}
                >
                    저장
                </Button>
                <Button
                    size="small"
                    onClick={() => setEditingKey(null)}
                >
                    취소
                </Button>
            </div>
        </div>
    ) : (
        <div
            className="font-medium text-gray-800 whitespace-pre-wrap overflow-hidden !flex-grow"
            onDoubleClick={() => setEditingKey(node.key)}
            style={{
                pointerEvents: "none",
                userSelect: "none",
            }}
        >
            {node.title}
        </div>
    );
};

export default CustomEditableInput;
