import React, {useState} from 'react';
import { Button, Form, Input } from 'antd';
// import { useRegister } from '@hook/useUser'; // 회원가입 훅으로 가정
import { CalculatorOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    // const { mutate: registerMutate } = useRegister();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [phoneNumber, setPhoneNumber] = useState("");

    // const onFinish = (values) => {
    //     registerMutate(values);
    // };

    const formatPhoneNumber = (value) => {
        const numericValue = value.replace(/\D/g, "");

        if (numericValue.length <= 3) return numericValue;
        if (numericValue.length <= 7)
            return `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;

        return `${numericValue.slice(0, 3)}-${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
    };

    const handleChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setPhoneNumber(formattedValue);
    };

    const goToLogin = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };

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
                    name="register_form"
                    // onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: '이메일을 입력해주세요.' },
                            { type: 'email', message: '올바른 이메일 형식을 입력해주세요.' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="이메일"
                            className="rounded-lg py-2"
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
                            className="w-full"
                            placeholder="휴대폰 번호"
                            value={phoneNumber}
                            onChange={handleChange}
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