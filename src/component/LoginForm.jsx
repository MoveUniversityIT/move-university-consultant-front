import React from 'react';
import { Form, Input, Button } from 'antd';

const LoginForm = ({ onSubmit }) => {
    const onFinish = (values) => {
        console.log('Submitted:', values);
        if (onSubmit) {
            onSubmit(values);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#f0f2f5' // 배경색 설정
        }}>
            <div style={{
                padding: '40px',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 그림자 효과
                minWidth: '300px' // 최소 너비 설정
            }}>
                <Form
                    name="login_form"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="아이디"
                        name="username"
                        rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
                    >
                        <Input placeholder="아이디" />
                    </Form.Item>

                    <Form.Item
                        label="비밀번호"
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                    >
                        <Input.Password placeholder="비밀번호" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            로그인
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;