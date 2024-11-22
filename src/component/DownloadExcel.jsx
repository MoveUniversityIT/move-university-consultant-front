import React, {useState} from 'react';
import API from "@api/API";
import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons";

const DownloadExcel = ({url, fileName, text}) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        setLoading(true);

        API({
            url: `/excel/download${url}`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        }).catch(() => {
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={loading}
            disabled={loading}
            className="w-52 h-12 flex items-center justify-center text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-md focus:outline-none"
        >
            {text || "Download File"}
        </Button>
    );
};

export default DownloadExcel;