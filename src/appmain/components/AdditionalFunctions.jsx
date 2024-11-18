import React from "react";
import {Card, Button, Form, Divider} from "antd";
import UploadExcel from "@/component/UploadExcel";
import DownloadExcel from "@/component/DownloadExcel";
import SpecialDateCheckBox from "@/component/SpecialDateCheckBox";
import DateFeeUpdate from "@/component/DateFeeUpdate";

const AdditionalFunctions = ({handleExcepUpload, consultantData}) => {
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
                <UploadExcel handleExcepUpload={handleExcepUpload}/>
                <DownloadExcel url={'/download/item'} text={'모든 물품 엑셀 다운로드'}/>
                <DownloadExcel url={'/download/special-date'} text={'특수일 다운로드'}/>
            </div>

            <Divider>이사 종류, 상하차 방법, 날짜 추가요금 업데이트</Divider>
            <DateFeeUpdate consultant={consultantData}/>
        </Card>
    );
};

export default AdditionalFunctions;