import React, {useState} from "react";
import {Button, Divider, Form, Input, message, Upload} from "antd";
import {usePostNotice} from "@hook/useAdmin";
import {PlusOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {usePostUploadImageAndVoice} from "@hook/useConsultant";

const PictureUploadTab = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const {mutate: postUploadImageAndVoice} = usePostUploadImageAndVoice();

    const formatPhoneNumber = (value) => {
        const numericValue = value.replace(/\D/g, "");

        if (numericValue.length <= 2) return numericValue;
        if (numericValue.length <= 4) return `${numericValue.slice(0, 2)}-${numericValue.slice(2)}`;
        if (numericValue.length <= 7) {

            if (numericValue.startsWith("02")) {
                return `${numericValue.slice(0, 2)}-${numericValue.slice(2)}`;
            }
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        }
        if (numericValue.length <= 10) {
            if (numericValue.startsWith("02")) {
                return `${numericValue.slice(0, 2)}-${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
            }
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        }
        return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
    };

    const onPhoneNumberChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        form.setFieldsValue({ customerPhoneNumber: formattedValue });
    };

    const formatDate = (value) => {
        const numericValue = value.replace(/\D/g, "");

        if (numericValue.length <= 4) {
            return numericValue;
        }
        if (numericValue.length <= 6) {
            return `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
        }
        return `${numericValue.slice(0, 4)}-${numericValue.slice(4, 6)}-${numericValue.slice(6, 8)}`;
    };

    const onDateChange = (e) => {
        const formattedValue = formatDate(e.target.value);
        form.setFieldsValue({ requestDate: formattedValue });
    };

    const onRemove = file => {
        setFileList(current => current.filter(f => f.uid !== file.uid));
    };

    const beforeUpload = file => {
        const isImage = [
            'image/jpeg', // JPEG
            'image/png',  // PNG
            'image/webp', // WEBP
            'image/gif'   // GIF
        ].includes(file.type);

        const isAudio = [
            'audio/mpeg', // MP3
            'audio/wav',  // WAV
            'audio/aac',  // AAC
            'audio/mp4',  // MP4
            'audio/amr',  // AMR
            'audio/x-m4a' // M4A
        ].includes(file.type);

        if (!isImage && !isAudio) {
            message.error('이미지(JPG, PNG, WEBP, GIF) 또는 오디오(MP3, WAV, AAC, MP4, M4A, AMR) 파일만 업로드 가능합니다.');
            return false;
        }

        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
            message.error('파일은 20MB보다 작아야 합니다.');
            return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const filePreview = isImage
                ? e.target.result
                : URL.createObjectURL(file);

            setFileList((current) => [
                ...current,
                {
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: filePreview,
                    type: file.type,
                    originFileObj: file,
                },
            ]);
        };

        if (isImage) {
            reader.readAsDataURL(file);
        } else if (isAudio) {
            reader.onload();
        }

        return false;
    };

    const validateDate = (_, value) => {
        if (!value || dayjs(value, "YYYY-MM-DD", true).isValid()) {
            return Promise.resolve();
        }

        return Promise.reject(new Error('날짜 형식이 유효하지 않습니다 (예: 2024-01-01).'));
    };

    const handlePreview = async (file) => {
        if (file.type.startsWith("image")) {
            const src = file.url || (await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file.originFileObj || file);
            }));

            const imgWindow = window.open(src);
            imgWindow.document.write(`<img src="${src}" style="width:100%">`);
        } else if (file.type.startsWith("audio")) {
            const audioSrc = file.url || URL.createObjectURL(file.originFileObj || file);
            const audioWindow = window.open("", "_blank");
            audioWindow.document.write(`
            <audio controls autoplay style="width:100%">
                <source src="${audioSrc}" type="${file.type}">
                브라우저에서 오디오형식을 지원하지 않습니다.
            </audio>
        `);
        } else {
            message.error("지원되지 않는 파일 형식입니다.");
        }
    };

    const onFinish = (values) => {
        const uploadForm = new FormData();
        uploadForm.append('customerName', values.customerName);
        uploadForm.append('customerPhoneNumber', values.customerPhoneNumber);
        uploadForm.append('requestDate', values.requestDate)
        fileList.forEach(file => {
            const actualFile = file.originFileObj || file;
            if (actualFile instanceof File) {
                uploadForm.append('files', actualFile);
            }
        });

        postUploadImageAndVoice(uploadForm, {
            onSuccess: (data) => {
                const successMessage = data?.message || "정상적으로 처리되었습니다.";
                message.success({
                    content: successMessage,
                    key: 'imgVoiceUpload',
                    duration: 2,
                });

                form.resetFields();
                setFileList([]);
            }
        })
    };

    const uploadButton = (
        <div className="flex flex-col items-center justify-center">
            <PlusOutlined className="text-blue-500 text-lg" />
            <div className="mt-1 text-sm font-medium text-gray-600">파일 추가</div>
        </div>
    );

    return (
        <div className="overflow-hidden h-[65vh] p-6 bg-gray-50 rounded-lg">
            <Form
                form={form}
                name="image-voice"
                onFinish={onFinish}
                labelCol={{span: 4}}
                wrapperCol={{span: 16}}
                className="w-full items-center justify-center"
                autoComplete="off"
            >
                <Divider orientation="left" className="text-gray-500 !mt-0">
                    화주 정보
                </Divider>

                <Form.Item
                    label={<span className="font-medium text-gray-700">화주 이름</span>}
                    name="customerName"
                    rules={[{required: true, message: "화주 이름을 입력해주세요."}]}
                    className="mb-4 w-full"
                >
                    <Input placeholder="화주 이름 입력" className="py-2 px-4 border rounded-lg"/>
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium text-gray-700">화주 번호</span>}
                    name="customerPhoneNumber"
                    rules={[{required: true, message: "화주 번호를 입력해주세요."}]}
                    className="mb-4 w-full"
                >
                    <Input
                        placeholder="화주 번호 입력"
                        className="py-2 px-4 border rounded-lg"
                        onChange={onPhoneNumberChange}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="font-medium text-gray-700">요청일</span>}
                    name="requestDate"
                    rules={[
                        {required: true, message: "요청일을 입력해주세요."},
                        {validator: validateDate},
                    ]}
                    className="mb-4 w-full"
                >
                    <Input
                        placeholder="YYYY-MM-DD"
                        className="py-2 px-4 border rounded-lg"
                        onChange={onDateChange}
                        maxLength={10}
                    />
                </Form.Item>

                <Divider orientation="left" className="text-gray-500">
                    파일 업로드
                </Divider>

                <Form.Item
                    label={<span className="font-medium text-gray-700">파일</span>}
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e && e.fileList}
                    className="mb-4 w-full"
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onRemove={onRemove}
                        multiple={true}
                        onPreview={handlePreview}
                        className="w-full"
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 4, span: 16}} className="mt-6 text-center">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg"
                    >
                        이미지/녹음 저장
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default PictureUploadTab;