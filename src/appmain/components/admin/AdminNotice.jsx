import React, {useState} from 'react';
import {Button, Form, Input, message, Modal, Table, Popconfirm, Image} from "antd";
import {usePostNotice, useGetNotices, useUpdateNotice, useDeleteNotice} from "@hook/useAdmin";
import CustomUpload from "@component/CustomUpload";
import dayjs from "dayjs";

const AdminNotice = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const {data: notices} = useGetNotices();
    const {mutate: postNotice} = usePostNotice();
    const {mutate: updateNotice} = useUpdateNotice();
    const {mutate: deleteNotice} = useDeleteNotice();

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

    const columns = [
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>제목</div>,
            dataIndex: 'title',
            key: 'title',
            width: '15%',
            render: (text) => (
                <div
                    style={{
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center', // 세로 정렬: 이미지와 같은 라인에 맞춤
                        justifyContent: 'center',
                        height: '100%', // 전체 높이 맞춤
                    }}
                >
                    {text}
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>내용</div>,
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
            width: '10%',
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
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>생성일</div>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
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
                        <div>{dayjs(createdAt).format('A HH:mm').replace('AM', '오전').replace('PM', '오후')}</div>
                    </div>
                </div>
            ),
        },
        {
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>수정일</div>,
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '10%',
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
                            <div>{dayjs(updatedAt).format('A HH:mm').replace('AM', '오전').replace('PM', '오후')}</div>
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
            title: <div style={{ textAlign: 'center', fontWeight: 'bold' }}>액션</div>,
            key: 'action',
            width: '10%',
            render: (_, record) => (
                <div
                    style={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center', // 정렬 통일
                    }}
                >
                    <Button type="link" onClick={() => handleEdit(record)}>
                        수정
                    </Button>
                    <Popconfirm title="정말 삭제하시겠습니까?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger>
                            삭제
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">공지사항 관리</h2>
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

            <Table columns={columns}
                   dataSource={notices}
                   rowKey="noticeId"
                   size="small"
            />

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
        </div>
    );
};

export default AdminNotice;
