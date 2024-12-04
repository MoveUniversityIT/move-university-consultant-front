import React, {useState, useEffect} from "react";
import {QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import API from "@api/API";

const TestPointTransfer = () => {
    const [senderId, setSenderId] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState(0);
    const [messages, setMessages] = useState([]);
    const queryClient = useQueryClient();

    const API_BASE_URL = process.env.REACT_APP_BASE_URL;

    // WebSocket 초기화
    useEffect(() => {
        const socket = new SockJS(`${API_BASE_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("WebSocket 연결됨");
                stompClient.subscribe("/topic/points", (message) => {
                    setMessages((prev) => [...prev, message.body]);

                    queryClient.invalidateQueries({ queryKey: ["users"] });
                });
            },
        });
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    // 사용자 목록 가져오기
    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => API.get(`/socket-user-test`).then((res) => res.data),
        retry:false
    });

    // 포인트 전송 API 호출
    const mutation = useMutation({
        mutationFn: (payload) => sendWebSocketMessage(payload), // 실행 함수
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] }); // 사용자 데이터 새로고침
            return Promise.resolve();
        },
        onError: (error) => {
            alert("포인트 전송 실패: " + (error.response?.data?.message || error.message));
        },
    });


    const handleTransfer = () => {
        if (!senderId || !receiverId || amount <= 0) {
            alert("모든 필드를 올바르게 입력해주세요.");
            return;
        }
        console.log(senderId, receiverId)
        mutation.mutate({senderId, receiverId, amount});
    };

    const sendWebSocketMessage = (payload) => {
        const API_BASE_URL = process.env.REACT_APP_BASE_URL;
        const socket = new SockJS(`${API_BASE_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.publish({
                    destination: "/app/transfer", // 서버의 @MessageMapping("/transfer")로 연결
                    body: JSON.stringify(payload),
                });
            },
            onStompError: (frame) => {
                console.error("WebSocket 오류:", frame.headers);
            },
        });
        stompClient.activate();
    };

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div>
            <h1>포인트 전송</h1>
            <div>
                <label>송신자:</label>
                <select value={senderId} onChange={(e) => setSenderId(e.target.value)}>
                    <option value="">선택</option>
                    {users.map((user) => (
                        <option key={user.userId} value={user.userId}>
                            {user.name} (잔액: {user.balance})
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>수신자:</label>
                <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)}>
                    <option value="">선택</option>
                    {users.map((user) => (
                        <option key={user.userId} value={user.userId}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>금액:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>
            <button onClick={handleTransfer} disabled={mutation.isLoading}>
                전송
            </button>
            <div>
                <h2>실시간 메시지</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TestPointTransfer;