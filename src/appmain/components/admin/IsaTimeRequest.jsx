import React, {useState} from "react";
import {Button, Col, Form, Input, message, Row, Select} from "antd";
import API from "@api/API";

const {Option} = Select;

export default function IsaTimeRequest() {
    const [form] = Form.useForm();

    const [movingDate, setMovingDate] = useState("");
    const [userPhone, setUserPhone] = useState("");

    const formatDate = (value) => {
        let val = value.replace(/\D/g, "");
        if (val.length > 4) {
            val = val.slice(0, 4) + "-" + val.slice(4);
        }
        if (val.length > 7) {
            val = val.slice(0, 7) + "-" + val.slice(7, 9);
        }
        return val;
    };

    const formatPhone = (value) => {
        let val = value.replace(/\D/g, "");
        if (val.startsWith("02")) {
            if (val.length > 2 && val.length <= 5) {
                val = val.slice(0, 2) + "-" + val.slice(2);
            } else if (val.length > 5 && val.length <= 9) {
                val = val.slice(0, 2) + "-" + val.slice(2, 5) + "-" + val.slice(5);
            } else if (val.length > 9) {
                val = val.slice(0, 2) + "-" + val.slice(2, 6) + "-" + val.slice(6, 10);
            }
        } else {
            if (val.length > 3 && val.length <= 7) {
                val = val.slice(0, 3) + "-" + val.slice(3);
            } else if (val.length > 7) {
                val = val.slice(0, 3) + "-" + val.slice(3, 7) + "-" + val.slice(7, 11);
            }
        }
        return val;
    };

    const onFinish = async (values) => {
        try {
            const data = {
                inquiry_type: "방문견적",
                api_key: "mf2TA1sqesPJUOPlTzTZ",
                user_name: values.user_name,
                user_phone: values.user_phone,
                moving_date: values.moving_date,
                moving_fix: values.moving_fix,
                moving_start_addr_0: values.moving_start_addr_0,
                moving_start_addr_1: values.moving_start_addr_1,
                moving_start_addr_2: values.moving_start_addr_2,
                moving_end_addr_0: values.moving_end_addr_0,
                moving_end_addr_1: values.moving_end_addr_1,
                moving_end_addr_2: values.moving_end_addr_2,
                moving_type: values.moving_type,
                moving_option: values.moving_option,
            };

            const response = await API.post("/admin/isa-time", data);

            message.success(`방문견적 요청이 성공적으로 전송되었습니다! 
            ${response.data}`);

            form.resetFields();
            setMovingDate("");
            setUserPhone("");
        } catch (error) {
            message.error(`요청 중 오류 발생: ${error}`);
        }
    };

    const onReset = () => {
        form.resetFields();
        setMovingDate("");
        setUserPhone("");
    };

    const handleDateChange = (e) => {
        const formatted = formatDate(e.target.value);
        setMovingDate(formatted);
        form.setFieldsValue({moving_date: formatted});
    };

    const handlePhoneChange = (e) => {
        setUserPhone(e.target.value);
        form.setFieldsValue({user_phone: e.target.value});
    };

    return (<div className="w-full h-full flex flex-col bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">이사타임 방문견적 요청</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="이름"
                        name="user_name"
                        rules={[{required: true, message: "이름을 입력해주세요."}]}
                    >
                        <Input placeholder="예) 홍길동"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="연락처"
                        name="user_phone"
                        rules={[{required: true, message: "연락처를 입력해주세요."}]}
                    >
                        <Input
                            placeholder="예) 01012345678 하이픈 없이 숫자만 입력"
                            value={userPhone}
                            onChange={handlePhoneChange}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="이사일"
                        name="moving_date"
                        rules={[{required: true, message: "이사일을 입력해주세요."}]}
                    >
                        <Input
                            placeholder="예) 2025-03-30"
                            value={movingDate}
                            onChange={handleDateChange}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="이사일 확정 여부"
                        name="moving_fix"
                        rules={[{required: true, message: "이사 확정 여부를 선택해주세요."}]}
                    >
                        <Select placeholder="선택">
                            <Option value="1">확정</Option>
                            <Option value="2">미확정</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="출발지 우편번호"
                        name="moving_start_addr_0"
                        rules={[{required: true, message: "출발지 우편번호를 입력해주세요."}]}
                    >
                        <Input placeholder="예) 12345"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="도착지 우편번호"
                        name="moving_end_addr_0"
                        rules={[{required: true, message: "도착지 우편번호를 입력해주세요."}]}
                    >
                        <Input placeholder="예) 67890"/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="출발지 기본주소 (시/도/군/번지)"
                        name="moving_start_addr_1"
                        rules={[{required: true, message: "출발지 기본주소를 입력해주세요."}]}
                    >
                        <Input placeholder="예) 서울 강남구 가로수길 9"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="도착지 기본주소 (시/도/군/번지)"
                        name="moving_end_addr_1"
                        rules={[{required: true, message: "도착지 기본주소를 입력해주세요."}]}
                    >
                        <Input placeholder="예) 경기 성남시 분당구 고기로 25"/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="출발지 상세주소 (동/호수)"
                        name="moving_start_addr_2"
                        rules={[{required: true, message: "출발지 상세주소를 입력해주세요."}]}
                    >
                        <Input placeholder="예) 101동 202호"/>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="도착지 상세주소 (동/호수)"
                        name="moving_end_addr_2"
                        rules={[{required: true, message: "도착지 상세주소를 입력해주세요."}]}
                    >
                        <Input placeholder="예) 505동 1203호"/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="이사타입"
                        name="moving_type"
                        rules={[{required: true, message: "이사 타입을 선택해주세요."}]}
                    >
                        <Select placeholder="선택">
                            <Option value="1">가정이사</Option>
                            <Option value="2">사무실이사</Option>
                            <Option value="3">원룸/소형이사</Option>
                            <Option value="4">보관이사</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="옵션 (복수라면 |로 연결)"
                        name="moving_option"
                    >
                        <Input placeholder="예) 입주청소|에어컨설치|인터넷가입"/>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button type="primary"
                            danger
                            className="ml-4 bg-red-600 hover:bg-red-400 text-sm" onClick={onReset}>초기화</Button>
                    <Button type="primary" style={{ marginLeft: 10 }} htmlType="submit">
                        견적 요청하기
                    </Button>
                </div>
            </Form.Item>
        </Form>
    </div>);
}
