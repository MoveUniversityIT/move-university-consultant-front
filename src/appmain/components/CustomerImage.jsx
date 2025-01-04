import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCustomerUploadImage } from "@hook/useConsultant";
import { Card, Image, Spin } from "antd";

const CustomerImage = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const { mutate: getCustomerUploadImageVoice } = useGetCustomerUploadImage();

    useEffect(() => {
        const query = searchParams.get("queryValue");

        getCustomerUploadImageVoice(
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
                    </div>
                </div>

                <Image.PreviewGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.urls.map((url, index) => (
                            <Card
                                key={index}
                                hoverable
                                className="shadow-md rounded-lg overflow-hidden"
                                cover={
                                    <div className="relative w-full h-60 bg-gray-100">
                                        <Image
                                            alt={`이미지 ${index + 1}`}
                                            src={url}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                }
                            />
                        ))}
                    </div>
                </Image.PreviewGroup>

            </div>
        </div>
    );
};

export default CustomerImage;
