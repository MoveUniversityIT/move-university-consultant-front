import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Spin} from 'antd';
import { CalculatorOutlined, LockOutlined, UserOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {useCheckEmail, useRegisterUser} from "@hook/useUser";

const RegisterForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isDuplicate, setIsDuplicate] = useState(null);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const email = Form.useWatch('email', form);

    const {data: isCheckEmail, isLoading: isEmailLoading, error: isCheckEmailError} = useCheckEmail(
        email, isValidEmail
    );
    const { mutate: registerMutation } = useRegisterUser();

    // const formatPhoneNumber = (value) => {
    //     const numericValue = value.replace(/\D/g, "");
    //
    //     if (numericValue.length <= 2) return numericValue;
    //     if (numericValue.length <= 4) return `${numericValue.slice(0, 2)}-${numericValue.slice(2)}`;
    //     if (numericValue.length <= 7) {
    //         if (numericValue.startsWith("02")) {
    //             return `${numericValue.slice(0, 2)}-${numericValue.slice(2)}`;
    //         }
    //         return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
    //     }
    //     if (numericValue.length <= 10) {
    //         if (numericValue.startsWith("02")) {
    //             return `${numericValue.slice(0, 2)}-${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    //         }
    //         return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
    //     }
    //     return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
    // };

    const handlePhoneNumberChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        form.setFieldValue('phoneNumber', formattedValue);
    };

    const formatPhoneNumber = (value) => {
        const numericValue = value.replace(/\D/g, ""); // 숫자만 추출

        // 길이에 따라 번호를 형식화
        if (numericValue.length < 10) return numericValue; // 유효한 길이가 아니면 그대로 반환
        if (numericValue.length === 10) {
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        }
        if (numericValue.length === 11) {
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
        }

        return numericValue;
    };

    const validatePhoneNumber = (value) => {
        const phoneRegex = /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/;
        return phoneRegex.test(value);
    };

    const handleEmailChange = async (e) => {
        const email = e.target.value;
        form.setFieldValue('email', email);

        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|co\.kr|org)$/;
        setIsValidEmail(emailRegex.test(email));
    };

    const goToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = (registerForm) => {
        registerMutation(registerForm, {
            onSuccess: (data) => {
                const successMessage = data?.data?.message
                    ? data?.data?.message
                    : "정상적으로 생성되었습니다.";

                navigate('/login');
                message.success(successMessage);
            },
            onError: (error) => {
                const validationMessages = error?.validation
                    ? Object.values(error.validation).join("\n")
                    : "처리 중 오류가 발생했습니다.";

                message.error(validationMessages);
            },
        })
    };

    useEffect(() => {
        setIsDuplicate(!(isCheckEmail?.code === 200));
    }, [isCheckEmail]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
            <div className="bg-white shadow-xl rounded-lg p-8 pb-10 w-full max-w-sm">
                <div className="text-center mb-6">
                    <CalculatorOutlined className="text-blue-600 text-5xl mb-2 animate-bounce" />
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
                        회원가입 <span className="text-blue-600">견적기</span> v2
                    </h1>
                    <p className="text-sm text-gray-600">Sign Up for Consultant Estimator v2</p>
                </div>
                <Form
                    form={form}
                    name="register_form"
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: '이메일을 입력해주세요.' },
                            {
                                validator: (_, value) => {
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|co\.kr|org)$/;
                                    if (!value || emailRegex.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('올바른 이메일 형식을 입력해주세요.'));
                                },
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="이메일"
                            className="rounded-lg py-2"
                            onChange={handleEmailChange}
                            suffix={
                                isEmailLoading ? (
                                    <Spin size="small" />
                                ) : isValidEmail === false ? null : isDuplicate ? (
                                    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                                ) : (
                                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: '비밀번호를 입력해주세요.' },
                            { min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다.' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="비밀번호"
                            className="rounded-lg py-2"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '비밀번호 확인을 입력해주세요.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="비밀번호 확인"
                            className="rounded-lg py-2"
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: '이름을 입력해주세요.' }]}
                    >
                        <Input
                            placeholder="이름"
                            className="rounded-lg py-2"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phoneNumber"
                        rules={[{ required: true, message: '휴대폰 번호를 입력해주세요.' }]}
                    >
                        <Input
                            className="rounded-lg py-2"
                            placeholder="휴대폰 번호"
                            value={form.getFieldValue('phoneNumber')}
                            onChange={handlePhoneNumberChange}
                            maxLength={13}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                        >
                            회원가입
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        이미 계정이 있으신가요?{" "}
                        <button
                            onClick={goToLogin}
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            로그인
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
