import axios from "axios";
import RootStore from "@/appcore/rootStore";
import { toggleAccessToken, toggleLoginState, toggleRefreshToken } from "@/features/user/loginSlice";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    while (failedQueue.length > 0) {
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
        if (!config.headers["Content-Type"]) {
            config.headers["Content-Type"] = "application/json";
        }

        const accessToken = RootStore.getState().login.accessToken;

        if (accessToken && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (!accessToken) {
            RootStore.dispatch(toggleLoginState(false));
        }

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
                RootStore.dispatch(toggleLoginState(false));
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

                    const newAccessToken = response.data.accessToken;
                    RootStore.dispatch(toggleAccessToken(newAccessToken));

                    isRefreshing = false;
                    processQueue(null, newAccessToken);

                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    return API(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    processQueue(refreshError, null);

                    RootStore.dispatch(toggleAccessToken(""));
                    RootStore.dispatch(toggleRefreshToken(""));
                    RootStore.dispatch(toggleLoginState(false));

                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return API(originalRequest);
                })
                .catch((err) => {
                    RootStore.dispatch(toggleAccessToken(""));
                    RootStore.dispatch(toggleRefreshToken(""));
                    RootStore.dispatch(toggleLoginState(false));
                    Promise.reject(err)
                });
        } else if (error.response?.status === 403) {
            if (error.response && error.response.data instanceof Blob) {
                try {
                    const text = await error.response.data.text(); // Blob을 문자열로 변환
                    const errorData = JSON.parse(text); // 문자열을 JSON으로 파싱
                    const errorMessage = errorData.errorMessage || "알 수 없는 오류가 발생했습니다.";
                    alert(errorMessage);
                } catch (parseError) {
                    alert("알 수 없는 오류가 발생했습니다.");
                }
                return Promise.reject(error.response?.data);
            }else {
                const errorMessage = error?.response?.data.errorMessage || "알 수 없는 오류가 발생했습니다.";

                alert(errorMessage);
                return Promise.reject(error.response?.data);
            }
        }

        return Promise.reject(error.response?.data);
    }
);

export default API;