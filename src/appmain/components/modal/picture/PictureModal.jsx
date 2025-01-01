import React, {useState} from 'react';
import {Button, Modal, Tabs} from 'antd';
import PictureUploadTab from "@component/modal/picture/PictureUploadTab";
import PictureImageAndVoiceSearchTab from "@component/modal/picture/PictureImageAndVoiceSearchTab";
import PictureAuioSearchTab from "@component/modal/picture/PictureAuioSearchTab";

const PictureModal = ({ isPictureVisible, handlePictureModalCancel }) => {
    const [activeKey, setActiveKey] = useState('1');

    const tabItems = [
        {
            label: (
                <span className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition">
                    이미지/녹음 업로드
                </span>
            ),
            key: '1',
            children: <PictureUploadTab />,
        },
        {
            label: (
                <span className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition">
                    이미지 조회
                </span>
            ),
            key: '2',
            children: <PictureImageAndVoiceSearchTab />,
        },
        {
            label: (
                <span className="text-sm font-semibold text-gray-600 hover:text-blue-500 transition">
                    녹음 조회
                </span>
            ),
            key: '3',
            children: <PictureAuioSearchTab />,
        }
    ];

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    return (
        <Modal
            title="이미지/녹음 업로드 및 조회"
            open={isPictureVisible}
            onCancel={handlePictureModalCancel}
            maskClosable={false}
            footer={[
                <Button key="close" onClick={handlePictureModalCancel}>
                    닫기
                </Button>,
            ]}
            width="72%"
            styles={{
                body: { padding: 0, height: '65vh', overflowY: 'hidden'},
            }}
        >
            <Tabs
                activeKey={activeKey}
                onChange={handleTabChange}
                className="border-b border-gray-200"
                tabBarStyle={{
                    borderBottom: '1px solid #e5e7eb',
                }}
                style={{
                    height: '100%',
                }}
                items={tabItems}
            />
        </Modal>
    );
};

export default PictureModal;
