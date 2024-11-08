import React from 'react';
import {Divider, Form, Input} from "antd";
import SpecialDateCheckBox from "@/component/SpecialDateCheckBox";
import UploadExcel from "@/component/UploadExcel";
import DownloadExcel from "@/component/DownloadExcel";


const RightSideBar = ({ distance, dateCheckList, handleExcepUpload }) => {
    return (
        <div>
            <Form.Item label="거리">
                <Input value={`${distance} Km`} disabled/>
            </Form.Item>

            <Form.Item label="특수일">
                <SpecialDateCheckBox dateCheckList={dateCheckList}/>
            </Form.Item>

            <Divider>아이템 추가 임시 공간</Divider>

            <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
                <UploadExcel handleExcepUpload={handleExcepUpload}/>
                <DownloadExcel url={'/download'} text={'모든 물품 엑셀 다운로드'}/>
                <DownloadExcel url={'/download/empty-info'} text={'빈값 물품 엑셀 다운로드'}/>
            </div>
        </div>
    );
};

export default RightSideBar;