import axios from "axios";
import RootStore from "@/appcore/rootStore";
import {toggleAccessToken, toggleLoginState, toggleRefreshToken} from "@/features/user/loginSlice";

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
    async (error) => {
        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = RootStore.getState().login.refreshToken;

            if(refreshToken === ""){
                RootStore.dispatch(toggleLoginState(false));
            }

            if(refreshToken !== ''){
                try{
                    const response = await API.post('/user/token/refresh', { }, {
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`
                        }
                    });

                    RootStore.dispatch(toggleAccessToken(response.data.accessToken));

                    return API(originalRequest)
                }catch(refreshError) {
                    console.log('유효하지 않은 리프래시 토큰:', refreshError);
                    RootStore.dispatch(toggleAccessToken(''));
                    RootStore.dispatch(toggleRefreshToken(''));
                    RootStore.dispatch(toggleLoginState(false));
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error.response.data);
    },
)

export default API;