import React from 'react';
import API from "@api/API";
import {Button} from "antd";
import {DownloadOutlined, UploadOutlined} from "@ant-design/icons";

const DownloadExcel = ({url, text}) => {
    const handleDownload = () => {
        API({
            url: `/excel${url}`,
            method: 'GET',
            responseType: 'blob', // Blob을 사용해 파일 다운로드
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'items.xlsx');
            document.body.appendChild(link);
            link.click();
        });
    };

    return (
        <Button icon={<DownloadOutlined />} onClick={handleDownload}>{text}</Button>
    );
};

export default DownloadExcel;