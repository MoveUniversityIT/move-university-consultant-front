import {useMutation, useQuery} from "@tanstack/react-query";
import {
    deleteReservation,
    getCheckEmail,
    getReservation,
    postLogin,
    postRegisterUser,
    postReservation
} from "@api/userApi";
import {toggleAccessToken, toggleLoginState, toggleRefreshToken, toggleRoles} from "@/features/user/loginSlice";
import RootStore from "@/appcore/rootStore";
import {message} from "antd";

export const useLogin = () => {
    return useMutation({
        mutationFn:(loginForm) => postLogin(loginForm),
        retry: false,
        onSuccess: (data) => {
            RootStore.dispatch(toggleRoles(data.roles));
            RootStore.dispatch(toggleAccessToken(data.accessToken));
            RootStore.dispatch(toggleRefreshToken(data.refreshToken));
            RootStore.dispatch(toggleLoginState(true));
        },
        onError: (error) => {
            const errorMessage = error?.errorMessage || "로그인 실패했습니다";
            message.error(errorMessage);
        }
    })
}

export const useCheckEmail = (email, enabled) => {
    return useQuery({
        queryKey: ['checkEmail', email],
        queryFn: ({queryKey}) => getCheckEmail(queryKey[1]),
        enabled,
        retry: false,
    })
}

export const useRegisterUser = () => {
    return useMutation({
        mutationFn:(registerForm) => postRegisterUser(registerForm),
        retry: false,
    })
}

export const useReservation = () => {
    return useQuery({
        queryKey: ['reservation'],
        queryFn: ({queryKey}) => getReservation(),
        retry: false
    })
}

export const useSaveReservation = () => {
    return useMutation( {
        mutationFn: (moveInfo) => postReservation(moveInfo),
        retry: false,
    })
}

export const useDeleteReservation = () => {
    return useMutation({
        mutationFn: (reservationId) => deleteReservation(reservationId),
        retry: false,
    })
}