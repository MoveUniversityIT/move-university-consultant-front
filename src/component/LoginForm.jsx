import React from 'react';
import {Button, Form, Input} from 'antd';
import {useLogin} from "@hook/useUser";
import {CalculatorOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';

const LoginForm = () => {
    const { mutate: loginMutate } = useLogin();

    const onFinish = (values) => {
        loginMutate(values);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
            <div className="bg-white shadow-xl rounded-lg p-8 pb-10 w-full max-w-sm">
                <div className="text-center mb-6">
                    <CalculatorOutlined className="text-blue-600 text-5xl mb-2 animate-bounce" />
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
                        상담봇 <span className="text-blue-600">견적기</span> v2
                    </h1>
                    <p className="text-sm text-gray-600">Consultant Estimator v2</p>
                </div>
                <Form
                    name="login_form"
                    onFinish={onFinish}
                    layout="vertical"
                    className="space-y-6"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: '아이디를 입력해주세요.' },
                            { type: 'email', message: '올바른 이메일 형식을 입력해주세요.' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="아이디 (이메일)"
                            className="rounded-lg py-2"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="비밀번호"
                            className="rounded-lg py-2"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        >
                            로그인
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;