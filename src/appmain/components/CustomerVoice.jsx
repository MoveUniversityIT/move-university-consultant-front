import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCustomerUploadVoice } from "@hook/useConsultant";
import { Card, Spin, Tooltip, Button } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

const CustomerVoice = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState(null);
    const { mutate: getCustomerUploadVoice } = useGetCustomerUploadVoice();

    const sortRecordingFiles = (urls) => {
        return [...urls].sort((a, b) => {
            // 파일명 추출 (URL에서 마지막 부분)
            const fileNameA = a.split('/').pop();
            const fileNameB = b.split('/').pop();
            
            // 정규표현식으로 날짜와 시간 추출
            const patternA = /통화 녹음 \d+_(\d{6})_(\d{6})/.exec(fileNameA);
            const patternB = /통화 녹음 \d+_(\d{6})_(\d{6})/.exec(fileNameB);
            
            if (patternA && patternB) {
                const dateStrA = patternA[1]; // DDMMYY
                const timeStrA = patternA[2]; // HHMMSS
                const dateStrB = patternB[1];
                const timeStrB = patternB[2];
                
                // 날짜 형식: DDMMYY
                const dayA = dateStrA.substring(0, 2);
                const monthA = dateStrA.substring(2, 4);
                const yearA = dateStrA.substring(4, 6);
                const hourA = timeStrA.substring(0, 2);
                const minA = timeStrA.substring(2, 4);
                const secA = timeStrA.substring(4, 6);
                
                const dayB = dateStrB.substring(0, 2);
                const monthB = dateStrB.substring(2, 4);
                const yearB = dateStrB.substring(4, 6);
                const hourB = timeStrB.substring(0, 2);
                const minB = timeStrB.substring(2, 4);
                const secB = timeStrB.substring(4, 6);
                
                // 날짜 비교를 위한 문자열 생성 (YYYYMMDDHHMMSS 형식)
                const dateTimeStrA = `20${yearA}${monthA}${dayA}${hourA}${minA}${secA}`;
                const dateTimeStrB = `20${yearB}${monthB}${dayB}${hourB}${minB}${secB}`;
                
                // 문자열 직접 비교 (숫자로 변환하여 비교)
                return Number(dateTimeStrA) - Number(dateTimeStrB);
            }
            
            return 0;
        });
    };

    useEffect(() => {
        const query = searchParams.get("queryValue");

        getCustomerUploadVoice(
            {
                queryValue: query,
            },
            {
                onSuccess: (data) => {
                    if (data && data.urls && Array.isArray(data.urls)) {
                        data.urls = sortRecordingFiles(data.urls);
                    }
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
