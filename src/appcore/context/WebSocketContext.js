import React, { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {useQueryClient} from "@tanstack/react-query";

const WebSocketContext = createContext(null);
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

export const WebSocketProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    let reconnectTimeout = null;

    useEffect(() => {
        let client = null;

        const connectWebSocket = () => {
            if (client && client.connected) {
                return;
            }

            const socket = new SockJS(`${API_BASE_URL}/ws`);
            client = Stomp.over(socket);

            // Heartbeat 설정: 클라이언트 → 서버: 10초, 서버 → 클라이언트: 10초
            client.heartbeat.outgoing = 10000;
            client.heartbeat.incoming = 10000;

            // 디버그 메시지 비활성화
            client.debug = () => {};

            client.connect(
                {},
                () => {
                    setStompClient(client);
                    setIsConnected(true);

                    client.subscribe('/mu/notices', (message) => {
                        if (message.body === "공지사항") {
                            queryClient.invalidateQueries('notice');
                        }
                    });
                },
                (error) => {
                    console.error("WebSocket 연결 실패:", error);
                    setIsConnected(false);
                    scheduleReconnect();
                }
            );

            socket.onclose = () => {
                setIsConnected(false);
                scheduleReconnect();
            };
        };

        const scheduleReconnect = () => {
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(() => {
                connectWebSocket();
            }, 5000);
        };

        const monitorConnection = () => {
            setInterval(() => {
                if (client && !client.connected) {
                    setIsConnected(false);
                    scheduleReconnect();
                }
            }, 15000);
        };

        connectWebSocket();
        monitorConnection();

        return () => {
            if (client) {
                client.disconnect();
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
        };
    }, [queryClient]);

    return (
        <WebSocketContext.Provider value={stompClient}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
