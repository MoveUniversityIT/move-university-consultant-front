import React, {useState} from 'react';
import {Button, Form, Input, message} from "antd";
import {usePostNotice} from "@hook/useAdmin";
import CustomUpload from "@component/CustomUpload";

const AdminNotice = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const {mutate: postNotice} = usePostNotice();

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

        postNotice(uploadForm, {
            onSuccess: (data) => {
                const successMessage = data?.message || "정상적으로 처리되었습니다.";
                message.success({
                    content: successMessage,
                    key: 'noticeUpload',
                    duration: 2,
                });

                form.resetFields();
                setFileList([]);
            }
        })
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">공지사항 설정</h2>
            <Form
                form={form}
                name="admin-notice"
                onFinish={onFinish}
                labelCol={{span: 4}}
                wrapperCol={{span: 16}}
                className="w-full h-full p-4 shadow-md bg-white rounded-lg flex items-center justify-center flex-col"
                autoComplete="off"
            >
                <Form.Item
                    label="제목"
                    name="title"
                    rules={[{required: true, message: '공지사항의 제목을 입력해주세요!'}]}
                    className="mb-4 w-full"
                >
                    <Input className="mt-1 block w-full"/>
                </Form.Item>

                <Form.Item
                    label="내용"
                    name="content"
                    rules={[{required: true, message: '공지사항의 내용을 입력해주세요!'}]}
                    className="mb-4 w-full"
                >
                    <Input.TextArea autoSize={{minRows: 3}} className="mt-1 block w-full"/>
                </Form.Item>

                <Form.Item
                    label="이미지 업로드"
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra="공지사항에 첨부할 이미지를 업로드하세요."
                    className="mb-4 w-full"
                >
                    <CustomUpload fileList={fileList} setFileList={setFileList}/>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        공지사항 등록
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AdminNotice;

