import {useMutation} from "@tanstack/react-query";
import {postLogin} from "@api/userApi";
import {toggleAccessToken, toggleLoginState, toggleRefreshToken, toggleRoles} from "@/features/user/loginSlice";
import RootStore from "@/appcore/rootStore";
import {message} from "antd";

export const useLogin = () => {
    return useMutation({
        mutationFn:(loginForm) => postLogin(loginForm),
        retry: false,
        onSuccess: (data) => {
            RootStore.dispatch(toggleAccessToken(data.accessToken));
            RootStore.dispatch(toggleRefreshToken(data.refreshToken));
            RootStore.dispatch(toggleLoginState(true));
            RootStore.dispatch(toggleRoles(data.roles));
        },
        onError: (error) => {
            const errorMessage = error?.errorMessage || "로그인 실패했습니다";
            message.error(errorMessage);
        }
    })
}