import axios from "axios";
import RootStore from "@/appcore/rootStore";
import {toggleAccessToken, toggleLoginState} from "@/features/user/loginSlice";

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

API.interceptors.request.use(
    (config) => {

        if(config.headers["Content-Type"] === undefined)
            config.headers["Content-Type"] = "application/json";

        const accessToken = RootStore.getState().login.accessToken;

        if(!config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (accessToken === '') {
            RootStore.dispatch(toggleLoginState(false));
        }

        return config;

    },
    (error) => {
        return Promise.reject(error);
    }
)

API.interceptors.response.use(

    (response) => {
        return response.data;
    },
    // async (error) => {
    //     // 200대 이외의 응답 에러난 경우 실행
    //     const originalRequest = error.config;
    //     // 토큰 만료, 잘못된 토큰, 토큰이 존재하지 않는 경우, 로그아웃 된 경우: 401
    //     if(error.response.status === 401 && !originalRequest._retry) {
    //         console.log(error.response.status);
    //
    //         RootStore.dispatch(toggleAccessToken(''));
    //         RootStore.dispatch(toggleLoginState(false));
    //
    //         // originalRequest._retry = true;
    //
    //         // const refreshToken = RootStore.getState().login.refreshToken;
    //
    //         // if(refreshToken === ""){
    //         //     RootStore.dispatch(toggleLoginState(false));
    //         // }
    //         //
    //         // if(refreshToken !== ''){
    //         //     try{
    //         //         const response = await API.post('/member/token/refresh', { }, {
    //         //             headers: {
    //         //                 'Authorization': `Bearer ${refreshToken}`
    //         //             }
    //         //         });
    //         //
    //         //         // const { accessToken } = response.data.accessToken;
    //         //         // localStorage.setItem('');
    //         //         RootStore.dispatch(toggleAccessToken(response.data.accessToken));
    //         //
    //         //         return API(originalRequest)
    //         //     }catch(refreshError) {
    //         //         console.log('유효하지 않은 리프래시 토큰:', refreshError);
    //         //         RootStore.dispatch(toggleLoginState(false));
    //         //         return Promise.reject(refreshError);
    //         //     }
    //         // }
    //     }
    //     return Promise.reject(error.response.data);
    // },
)

export default API;