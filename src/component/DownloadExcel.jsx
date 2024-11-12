import React, {useState} from 'react';
import API from "@api/API";
import {Button} from "antd";
import {DownloadOutlined, UploadOutlined} from "@ant-design/icons";

const DownloadExcel = ({url, text}) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        setLoading(true);

        API({
            url: `/excel${url}`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'items.xlsx');
            document.body.appendChild(link);
            link.click();
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Button icon={<DownloadOutlined />} onClick={handleDownload} loading={loading} disabled={loading}>
            {text}
        </Button>
    );
};

export default DownloadExcel;