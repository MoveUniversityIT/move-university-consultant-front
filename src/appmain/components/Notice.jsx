import React from 'react';
import {List, Card, Button, message, Image} from 'antd';
import {usePostReadNotice} from "@hook/useUser";
import dayjs from "dayjs";
import {CheckCircleOutlined} from "@ant-design/icons";

const Notice = ({notices, setNotices}) => {
    const {mutate: postReadNotice} = usePostReadNotice();
    const handleConfirm = (notice) => {
        postReadNotice(notice.noticeId, {
            onSuccess: (data) => {
                notice.readYn = "Y";
                setNotices(prev => ({
                    ...prev,
                    unreadCount: Number(prev.unreadCount - 1)
                }))
            },
            onError: (error) => {
                const errorMessage = error?.errorMessage || "처리 중 에러가 발생했습니다.";
                message.error({
                    content: errorMessage,
                    key: 'errorNotice',
                    duration: 2,
                });
            },
        })
    };

    return (
        <Card
            title="공지사항 (읽은 공지사항은 확인을 눌러주세요.)"
            className="shadow-lg rounded-lg h-full w-full overflow-auto"
            styles={{
                body: {display: 'flex', flexDirection: 'column', padding: '20px'},
            }}
        >
            <List
                itemLayout="vertical"
                size="large"
                dataSource={notices?.notices}
                renderItem={notice => (
                    <List.Item key={notice.noticeId}>
                        <Card
                            className={`w-full transition-all duration-300 ease-in-out ${notice.readYn === 'N' ? 'bg-blue-100' : 'bg-white'}`}
                            title={
                                <div className="flex items-center w-full">
                                    <span className="font-semibold text-lg">{notice.title}</span>
                                    <span className="text-sm text-gray-500">
                                ({dayjs(notice.createdAt).format('YYYY년 MM월 DD일')})
                            </span>
                                </div>
                            }
                            extra={
                                notice.readYn === 'N' && (
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => handleConfirm(notice)}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        확인
                                    </Button>
                                )
                            }
                        >
                            <p className="text-gray-700">{notice.content}</p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {notice?.fileUrls.map((src, index) => (
                                    <Image
                                        key={index}
                                        width={200}
                                        height={200}
                                        src={src}
                                        alt={`Image ${index + 1}`}
                                        style={{ borderRadius: '8px' }}
                                    />
                                ))}
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default Notice;
