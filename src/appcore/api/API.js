import axios from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});

API.interceptors.request.use(
    (config) => {

        if(config.headers["Content-Type"] === undefined)
            config.headers["Content-Type"] = "application/json";
        return config;

    },
    (error) => {
        return Promise.reject(error);
    }
)
//
// API.interceptors.response.use(
//     (response) => {
//         // 200대의 응답 데이터를 이용해 실행
//         return response.data;
//     },
//     async (error) => {
//         // // 200대 이외의 응답 에러난 경우 실행
//         // const originalRequest = error.config;
//         // // 토큰 만료, 잘못된 토큰, 토큰이 존재하지 않는 경우, 로그아웃 된 경우: 401
//         // if(error.response.status === 401 && !originalRequest._retry) {
//         //     console.log(error.response.status);
//         //
//         //     // TODO 저장소에서 accessToken 제거
//         //     RootStore.dispatch(toggleAccessToken(''));
//         //
//         //     originalRequest._retry = true;
//         //
//         //     // TODO 저장소에서 리프래시 토큰 가져오기
//         //     const refreshToken = RootStore.getState().login.refreshToken;
//         //
//         //     if(refreshToken === ""){
//         //         RootStore.dispatch(toggleLoginState(false));
//         //     }
//         //
//         //     if(refreshToken !== ''){
//         //         try{
//         //             // TODO 리프래시 토큰을 이용해서 토큰 재발급 요청
//         //             const response = await API.post('/member/token/refresh', { }, {
//         //                 headers: {
//         //                     'Authorization': `Bearer ${refreshToken}`
//         //                 }
//         //             });
//         //
//         //             // TODO 새로 발급받은 Access Token 저장
//         //             // const { accessToken } = response.data.accessToken;
//         //             // localStorage.setItem('');
//         //             RootStore.dispatch(toggleAccessToken(response.data.accessToken));
//         //
//         //             return API(originalRequest)
//         //         }catch(refreshError) {
//         //             console.log('유효하지 않은 리프래시 토큰:', refreshError);
//         //             RootStore.dispatch(toggleLoginState(false));
//         //             return Promise.reject(refreshError);
//         //         }
//         //     }
//         // }
//         return Promise.reject(error.response.data);
//     },
// );
//
export default API;