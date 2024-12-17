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
            style={{
                border: "1px solid #e0e0e0", // 더 은은한 테두리 색상
                padding: "15px 20px", // 좌우 패딩을 조금 더 여유롭게
                borderRadius: "8px", // 모서리를 둥글게
                backgroundColor: "#fafafa", // 배경색 추가
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // 부드러운 그림자
                lineHeight: "1.6", // 줄 간격 설정
                fontSize: "14px", // 가독성을 위한 폰트 크기
                color: "#333", // 진한 텍스트 색상
                wordBreak: "break-word", // 긴 단어도 줄바꿈 처리
            }}
        >
            <ReactMarkdown
                breaks={true}
                components={{
                    p: ({children}) => (
                        <p style={{margin: "0", lineHeight: "1.5"}}>{children}</p>
                    ),
                    strong: ({children}) => (
                        <strong style={{color: "#007bff", fontWeight: "600"}}>{children}</strong>
                    ),
                    br: () => <br style={{display: "block", height: "0.5em"}}/>,
                }}
            >
                {inputValue}
            </ReactMarkdown>
        </div>

    );
};

export default CustomEditableInput;
