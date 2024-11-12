import React from 'react';
import API from "@api/API";
import {Button} from "antd";
import {DownloadOutlined, UploadOutlined} from "@ant-design/icons";

const DownloadExcel = ({url, text, setProgress}) => {
    const handleDownload = () => {
        setProgress(0);

        API({
            url: `/excel${url}`,
            method: 'GET',
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'items.xlsx');
            document.body.appendChild(link);
            link.click();
        }).finally(() => {
            setProgress(0);
        });
    };

    return (
        <Button icon={<DownloadOutlined />} onClick={handleDownload}>{text}</Button>
    );
};

export default DownloadExcel;