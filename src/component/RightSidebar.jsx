import React from 'react';
import {Divider, Form, Input} from "antd";
import SpecialDateCheckBox from "@/component/SpecialDateCheckBox";
import UploadExcel from "@/component/UploadExcel";
import DownloadExcel from "@/component/DownloadExcel";
import DateFeeUpdate from "@/component/DateFeeUpdate";


const RightSideBar = ({ distance, dateCheckList, handleExcepUpload, consultant }) => {
    return (
        <div>
            <Form.Item label="거리">
                <Input value={`${distance} Km`} disabled/>
            </Form.Item>

            <Form.Item label="특수일">
                <SpecialDateCheckBox dateCheckList={dateCheckList}/>
            </Form.Item>

            <Divider>아이템 추가 임시 공간</Divider>

            <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '80px'
            }}>
                <UploadExcel handleExcepUpload={handleExcepUpload}/>
                <DownloadExcel url={'/download/item'} text={'모든 물품 엑셀 다운로드'}/>
                <DownloadExcel url={'/download/special-date'} text={'특수일 다운로드'}/>
            </div>

            <Divider>이사 종류, 상하차 방법, 날짜 추가요금 업데이트</Divider>
            <DateFeeUpdate consultant={consultant}/>
        </div>
    );
};

export default RightSideBar;