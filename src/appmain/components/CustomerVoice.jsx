import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCustomerUploadVoice } from "@hook/useConsultant";
import { Card, Spin, Tooltip, Button } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

const CustomerVoice = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const { mutate: getCustomerUploadVoice } = useGetCustomerUploadVoice();

    useEffect(() => {
        const query = searchParams.get("queryValue");

        getCustomerUploadVoice(
            {
                queryValue: query,
            },
            {
                onSuccess: (data) => {
                    setData(data);
                },
            }
        );
    }, [searchParams]);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">화주 정보</h2>
                    <div className="flex flex-col space-y-2">
                        <p className="text-gray-700">
                            <span className="font-semibold">화주 이름:</span> {data.customerName}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">화주 번호:</span> {data.customerPhoneNumber}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.urls.map((url, index) => (
                        <Card
                            key={index}
                            hoverable
                            className="shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
                            bodyStyle={{
                                padding: "1rem",
                                textAlign: "center",
                            }}
                        >
                            <audio
                                controls
                                className="w-full rounded-md shadow-sm border border-gray-300"
                            >
                                <source src={url} type="audio/mpeg" />
                                브라우저가 오디오 태그를 지원하지 않습니다.
                            </audio>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerVoice;
