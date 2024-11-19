import React, {useState} from 'react';
import API from "@api/API";
import {Button, message, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

const UploadExcel = ({url, handleExcepUpload, fileName}) => {
    const [loading, setLoading] = useState(false);

    const handleUpload = ({file}) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        API.post(`/excel/upload${url}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            },
        })
            .then((data) => {
                const successMessage = data?.data?.message ? data?.data?.message : "정상적으로 처리되었습니다";
                handleExcepUpload();
                message.success(successMessage);
            })
            .catch((error) => {
                const errorMessage = error?.response?.data?.errorMessage ?
                    error?.response?.data?.errorMessage : '엑셀 업로드에 실패했습니다';
                message.error(errorMessage);
            }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <Upload customRequest={handleUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />} loading={loading} disabled={loading}>{fileName}</Button>
        </Upload>
    );
};

export default UploadExcel;