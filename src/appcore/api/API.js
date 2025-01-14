import axios from "axios";
import RootStore from "@/appcore/rootStore";
import {toggleAccessToken, toggleRefreshToken} from "@/features/user/loginSlice";
import {message} from "antd";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    while (failedQueue && failedQueue?.length > 0) {
        const { resolve, reject } = failedQueue.shift();
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    }
};

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

API.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
        }

        const accessToken = RootStore.getState().login.accessToken;

        if (accessToken && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // if (!accessToken) {
        //     RootStore.dispatch(toggleLoginState(false));
        // }

        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = RootStore.getState().login.refreshToken;

            if (!refreshToken) {
                // 상태 초기화
                // RootStore.dispatch(toggleAccessToken(""));
                // RootStore.dispatch(toggleRefreshToken(""));
                // RootStore.dispatch(toggleLoginState(false));
                return Promise.reject(error.response?.data);
            }

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const response = await API.get("/user/token/refresh", {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });

                    const newAccessToken = response?.data?.accessToken;
                    const newRefreshToken = response?.data?.refreshToken;
                    RootStore.dispatch(toggleAccessToken(newAccessToken));
                    RootStore.dispatch(toggleRefreshToken(newRefreshToken));

                    isRefreshing = false;
                    processQueue(null, newAccessToken);

                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return API(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    processQueue(refreshError, null);

                    // 초기화 로직 추가
                    // RootStore.dispatch(toggleAccessToken(""));
                    // RootStore.dispatch(toggleRefreshToken(""));
                    // RootStore.dispatch(toggleLoginState(false));

                    return Promise.reject(refreshError);
                }
            }else if(error.config.url.includes("/user/token/refresh")) {
                // RootStore.dispatch(toggleAccessToken(""));
                // RootStore.dispatch(toggleRefreshToken(""));
                // RootStore.dispatch(toggleLoginState(false));

                return Promise.reject(error.response?.data);
            }

            // Refresh 중인 경우 대기열 추가
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return API(originalRequest);
                })
                .catch((err) => {
                    // 초기화 로직 보장
                    // RootStore.dispatch(toggleAccessToken(""));
                    // RootStore.dispatch(toggleRefreshToken(""));
                    // RootStore.dispatch(toggleLoginState(false));

                    message.error({
                        content: "회원 정보가 만료되었습니다. 다시 로그인 후 시도해주세요.",
                        key: 'refreshError',
                        duration: 5,
                    });
                    return Promise.reject(err);
                });
        }

        // 403 에러 처리
        if (error.response?.status === 403) {
            if (error.response.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const errorData = JSON.parse(text);
                    const errorMessage = errorData.errorMessage || "알 수 없는 오류가 발생했습니다.";
                    // alert(errorMessage);
                } catch (parseError) {
                    // alert("알 수 없는 오류가 발생했습니다.");
                }
            } else {
                const errorMessage = error?.response?.data.errorMessage || "알 수 없는 오류가 발생했습니다.";
                // alert(errorMessage);
            }
            return Promise.reject(error.response?.data);
        }

        return Promise.reject(error.response?.data);
    }
);

export default API;