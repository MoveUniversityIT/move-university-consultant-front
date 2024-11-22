import React from "react";
import {Button, Card} from "antd";

const AdditionalFunctions = () => {
    const handleCopy = (type) => {
        alert(`${type} 복사 기능 실행`);
    };

    return (
        <Card title="추가 기능" className="shadow-md rounded-md h-full">
            <div className="grid grid-cols-1 gap-4">
                <Button type="default" onClick={() => handleCopy("복사1")}>
                    복사1
                </Button>
                <Button type="default" onClick={() => handleCopy("복사2")}>
                    복사2
                </Button>
                <Button type="default" onClick={() => handleCopy("복사3")}>
                    복사3
                </Button>
                <Button type="primary" onClick={() => handleCopy("사업자등록증")}>
                    사업자등록증
                </Button>
                <Button type="primary" onClick={() => handleCopy("화물보험")}>
                    화물보험
                </Button>
            </div>
        </Card>
);
};

export default AdditionalFunctions;