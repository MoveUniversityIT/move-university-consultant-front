import React from 'react';
import UploadExcel from "@/component/UploadExcel";
import DownloadExcel from "@/component/DownloadExcel";
import {useQueryClient} from "@tanstack/react-query";

const SystemManagement = () => {
    const queryClient = useQueryClient();

    const handleExcepUpload = () => {
        queryClient.invalidateQueries('consultantMetadata');
    };

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">시스템 설정</h2>

            <div className="flex flex-row justify-between gap-8">
                {/* 아이템 물품 섹션 */}
                <div className="flex flex-col items-center flex-1 bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">아이템 물품</h3>
                    <UploadExcel
                        url={'/item'}
                        handleExcepUpload={handleExcepUpload}
                        fileName={"물품 업로드"}
                    />
                    <DownloadExcel
                        url={'/item'}
                        fileName={'item.xlsx'}
                        text={'물품 다운로드'}
                    />
                </div>

                {/* 특수일 섹션 */}
                <div className="flex flex-col items-center flex-1 bg-gray-50 p-4 rounded-md shadow-sm">
                    <h3 className="text-md font-semibold text-gray-700 mb-4">특수일</h3>
                    <UploadExcel
                        url={'/special-date'}
                        handleExcepUpload={handleExcepUpload}
                        fileName={"특수일 업로드"}
                    />
                    <DownloadExcel
                        url={'/special-date'}
                        fileName={'special-date.xlsx'}
                        text={'특수일 다운로드'}
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemManagement;