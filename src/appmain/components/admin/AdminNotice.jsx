import React, {useState} from 'react';
import {Button, Form, Input, message, Modal, Table, Popconfirm, Image, Spin} from "antd";
import {usePostNotice, useGetNotices, useUpdateNotice, useDeleteNotice} from "@hook/useAdmin";
import CustomUpload from "@component/CustomUpload";
import dayjs from "dayjs";
import {ReloadOutlined} from "@ant-design/icons";

const AdminNotice = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const {data: notices, refetch: getNotice} = useGetNotices();
    const {mutate: postNotice} = usePostNotice();
    const {mutate: updateNotice} = useUpdateNotice();
    const {mutate: deleteNotice} = useDeleteNotice();

    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await getNotice();
        } finally {
            setLoading(false);
        }
    };

    const [unreadUsers, setUnreadUsers] = useState([]);
    const [isUnreadModalVisible, setIsUnreadModalVisible] = useState(false);

    const onFinish = (values) => {
        const uploadForm = new FormData();
        uploadForm.append('title', values.title);
        uploadForm.append('content', values.content);
        fileList.forEach(file => {
            const actualFile = file.originFileObj || file;
            if (actualFile instanceof File) {
                uploadForm.append('files', actualFile);
            }
        });

        const action = editingNotice ? updateNotice : postNotice;
        const payload = editingNotice ? {id: editingNotice.noticeId, data: uploadForm} : uploadForm;

        action(payload, {
            onSuccess: (data) => {
                message.success(data?.message || "정상적으로 처리되었습니다.");
                form.resetFields();
                setFileList([]);
                setEditingNotice(null);
                setIsModalVisible(false);
            },
        });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        form.setFieldsValue({
            title: notice.title,
            content: notice.content,
        });

        setFileList(
            (notice.fileUrls || []).map((url, index) => ({
                uid: `${index}`,
                name: url.split('/').pop(),
                status: 'done',
                url: url,
            }))
        );

        setIsModalVisible(true);
    };

    const handleDelete = (id) => {
        deleteNotice(id, {
            onSuccess: () => {
                message.success("공지사항이 삭제되었습니다.");
            },
        });
    };

    const handleShowUnreadUsers = (users) => {
        setUnreadUsers(users || []);
        setIsUnreadModalVisible(true);
    };

    const columns = [
        {
            title: <div style={{textAlign: 'center', fontWeight: 'bold'}}>제목</div>,
            dataIndex: 'title',
            key: 'title',
            // width: '15%',
            render: (text) => (
                <div
                    style={{
                        textAlign: 'center',
                        overflowY: 'auto',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // 두 줄까지만 보여줌
                        WebkitBoxOrient: 'vertical',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        maxHeight: '3.6em',
                        lineHeight: '1.8em',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: <div style={{textAlign: 'center', fontWeight: 'bold'}}>내용</div>,
            dataIndex: 'content',
            key: 'content',
            width: '25%',
            render: (text) => (
                <div
                    style={{
                        overflowY: 'auto',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2, // 두 줄까지만 보여줌
                        WebkitBoxOrient: 'vertical',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        maxHeight: '3.6em',
                        lineHeight: '1.8em',
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: <div style={{textAlign: 'center', fontWeight: 'bold'}}>이미지</div>,
            dataIndex: 'fileUrls',
            key: 'fileUrls',
            // width: '10%',
            render: (fileUrls) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                    }}
                >
                    {fileUrls.map((url, index) => (
                        <Image
                            key={index}
                            src={url}
                            alt={`file-${index}`}
                            width={20} // 작은 크기로 표시
                            height={20}
                            style={{
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                objectFit: 'cover',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>
            ),
        },
        {
            title: <div style={{textAlign: 'center', fontWeight: 'bold'}}>생성일</div>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            // width: '10%',
            render: (createdAt) => (
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center', // 정렬 통일
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <div>
                        <div>{dayjs(createdAt).format('YYYY년 MM월 DD일')}</div>
                        <div>{dayjs(createdAt).format('A HH시 mm분').replace('AM', '오전').replace('PM', '오후')}</div>
                    </div>
                </div>
            ),
        },
        {
            title: <div style={{textAlign: 'center', fontWeight: 'bold'}}>수정일</div>,
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            // width: '10%',
            render: (updatedAt) =>
                updatedAt ? (
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '0.9em',
                            display: 'flex',
                            alignItems: 'center', // 정렬 통일
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <div>
                            <div>{dayjs(updatedAt).format('YYYY년 MM월 DD일')}</div>
                            <div>{dayjs(updatedAt).format('A HH시 mm분').replace('AM', '오전').replace('PM', '오후')}</div>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '0.9em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        -
                    </div>
                ),
        },
        {
            title: <div style={{textAlign: 'center', fontWeight: 'bold'}}>액션</div>,
            key: 'action',
            // width: '10%',
            render: (_, record) => (
                <div
                    style={{
                        textAlign: 'center',
                        fontSize: '0.9em',
                        display: 'flex',
                        alignItems: 'center', // 정렬 통일
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    <Button
                        style={{
                            backgroundColor: '#10b981',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            color: 'white',
                            marginRight: '8px',
                            border: 'none',
                        }}
                        onClick={() => handleShowUnreadUsers(record.unreadUserIds)}
                    >
                        {`미확인(${record.unreadUserIds.length}명)`}
                    </Button>
                    <Button
                        style={{
                            backgroundColor: '#2563eb',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            color: 'white',
                            marginRight: '8px',
                            border: 'none',
                        }}
                        onClick={() => handleEdit(record)}
                    >
                        수정
                    </Button>
                    <Button
                        style={{
                            backgroundColor: '#dc2626',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            color: 'white',
                            border: 'none',
                        }}
                        onClick={() => handleDelete(record.id)}
                    >
                        삭제
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">공지사항 관리</h2>
                <Button
                    type="default"
                    icon={
                        loading ? (
                            <Spin size="small"/>
                        ) : (
                            <ReloadOutlined/>
                        )
                    }
                    onClick={handleRefresh}
                    style={{
                        borderRadius: '4px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d9d9d9',
                        color: '#333',
                    }}
                    disabled={loading}
                >
                    새로고침
                </Button>
            </div>
            <Button
                type="primary"
                className="mb-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                    form.resetFields();
                    setFileList([]);
                    setEditingNotice(null);
                    setIsModalVisible(true);
                }}
            >
                공지사항 등록
            </Button>

            <div className="flex-1 overflow-y-auto">
                <Table
                    columns={columns}
                    dataSource={notices}
                    rowKey="noticeId"
                    size="small"
                    scroll={{y: 'calc(100% - 10px)'}}
                    style={{tableLayout: 'fixed', width: '100%'}}
                />
            </div>

            <Modal
                title={editingNotice ? "공지사항 수정" : "공지사항 등록"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                width="80%"
                footer={null}
                styles={{
                    body: {
                        height: '60vh',
                        padding: '20px',
                        overflowY: 'auto'
                    },
                }}
            >
                <Form
                    form={form}
                    name="admin-notice"
                    onFinish={onFinish}
                    labelCol={{span: 6}}
                    wrapperCol={{span: 16}}
                    autoComplete="off"
                    style={{padding: '10px 20px'}}
                >
                    <Form.Item
                        label="제목"
                        name="title"
                        rules={[{required: true, message: '공지사항의 제목을 입력해주세요!'}]}
                        style={{marginBottom: '16px'}}
                    >
                        <Input placeholder="공지사항 제목을 입력하세요"/>
                    </Form.Item>

                    <Form.Item
                        label="내용"
                        name="content"
                        rules={[{required: true, message: '공지사항의 내용을 입력해주세요!'}]}
                        style={{marginBottom: '16px'}}
                    >
                        <Input.TextArea
                            autoSize={{minRows: 4}}
                            placeholder="공지사항 내용을 입력하세요"
                        />
                    </Form.Item>

                    <Form.Item
                        label="이미지 업로드"
                        name="upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        extra="공지사항에 첨부할 이미지를 업로드하세요."
                        style={{marginBottom: '24px'}}
                    >
                        <CustomUpload fileList={fileList} setFileList={setFileList}/>
                    </Form.Item>

                    <Form.Item wrapperCol={{span: 24}} style={{textAlign: 'center'}}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: '120px',
                                height: '40px',
                                backgroundColor: '#1890ff',
                                border: 'none',
                                fontWeight: 'bold',
                            }}
                            className="hover:bg-blue-700 text-white"
                        >
                            {editingNotice ? "수정" : "등록"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    <div style={{textAlign: 'center', fontWeight: 'bold', fontSize: '18px', color: '#333'}}>
                        공지사항 읽지 않은 사용자 목록
                    </div>
                }
                open={isUnreadModalVisible}
                onCancel={() => setIsUnreadModalVisible(false)}
                footer={null}
                styles={{
                    body: {
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        maxHeight: '500px',
                        overflowY: 'auto'
                    },
                }}
            >
                {unreadUsers.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                            gap: '12px',
                        }}
                    >
                        {unreadUsers.map((user, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '12px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#555',
                                }}
                            >
                                {user}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#888',
                            marginTop: '10px',
                        }}
                    >
                        모든 사용자가 읽었습니다.
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminNotice;
