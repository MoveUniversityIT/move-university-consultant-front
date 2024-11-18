import React, {useState} from 'react';
import API from "@api/API";
import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons";

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
            link.setAttribute('download', 'special_date.xlsx');
            document.body.appendChild(link);
            link.click();
        }).catch(() => {
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