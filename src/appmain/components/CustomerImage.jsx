import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useGetUploadImageAndVoice} from "@hook/useConsultant";

const CustomerImage = () => {
    const [searchParams] = useSearchParams(); // 쿼리 스트링 값 가져오기
    const [data, setData] = useState(null);
    const { mutate: getUploadImageVoice } = useGetUploadImageAndVoice();

    useEffect(() => {
        // 쿼리 스트링에서 필요한 값 추출
        const query = searchParams.get("queryValue"); // 쿼리 파라미터 'query'

        getUploadImageVoice(
            {
                queryValue: query,
                page: 0,
                size: 100
            }, {
            onSuccess: (data) => {
                setData(data.content);
            },
        });
    }, [searchParams]);

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
            <h1>테스트</h1>
        </div>
    );
};

export default CustomerImage;
