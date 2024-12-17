import React, {useState} from "react";
import {Input, Button} from "antd";
import ReactMarkdown from "react-markdown";

const {TextArea} = Input;

const CustomEditableInput = ({node, updateNodeTitle, editingKey, setEditingKey}) => {
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
                autoSize={{minRows: 1}}
                className="font-medium text-gray-800 whitespace-pre-wrap"
                style={{
                    flexGrow: 1,
                    width: "100%",
                    maxWidth: "90%",
                    minWidth: "calc(55vw - 100px)",
                }}
            >

            </TextArea>

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
                border: "1px solid #ddd",
                padding: "10px",
            }}
        >
            <ReactMarkdown
                components={{
                    p: ({children}) => (
                        <p style={{margin: "0", lineHeight: "0.7"}}>{children}</p>
                    ),
                    br: () => <br style={{display: "block", content: "", height: "1em"}}/>, // 줄바꿈 시 간격 적용
                }}
            >
                {inputValue}
            </ReactMarkdown>
        </div>
    );
};

export default CustomEditableInput;
