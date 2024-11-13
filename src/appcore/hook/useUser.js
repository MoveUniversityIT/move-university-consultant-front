import {useMutation} from "@tanstack/react-query";
import {postLogin} from "@api/userApi";
import {toggleAccessToken, toggleLoginState, toggleRefreshToken} from "@/features/user/loginSlice";
import RootStore from "@/appcore/rootStore";

export const useLogin = () => {
    return useMutation({
        mutationFn:(loginForm) => postLogin(loginForm),
        retry: false,
        onSuccess: (data) => {
            RootStore.dispatch(toggleAccessToken(data.accessToken));
            RootStore.dispatch(toggleRefreshToken(data.refreshToken));
            RootStore.dispatch(toggleLoginState(true));
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.errorMessage || "로그인 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`);
        }
    })
}