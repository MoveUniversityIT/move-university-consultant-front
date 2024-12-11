import React from 'react';
import {message, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const CustomUpload = ({fileList, setFileList}) => {
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

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('파일은 5MB보다 작아야 합니다.');
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
    const onRemove = file => {
        setFileList(current => current.filter(f => f.uid !== file.uid));
    };

    return (
        <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onRemove={onRemove}
            multiple={true}
            onPreview={handlePreview}
        >
            <div>
                <PlusOutlined/>
                <div className="mt-1">Upload</div>
            </div>
        </Upload>
    )
}

export default CustomUpload;