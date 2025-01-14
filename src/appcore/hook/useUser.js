import {useMutation, useQuery} from "@tanstack/react-query";
import {
    deleteReservation,
    fetchIntermediaryrByName,
    fetchManagerByName,
    getCheckEmail, getManagerUUID,
    getNotices,
    getReservation,
    postLogin,
    postReadNotice,
    postRegisterUser,
    postReservation,
    postSaveGongcha
} from "@api/userApi";
import {
    toggleAccessToken,
    toggleLoginState,
    toggleRefreshToken,
    toggleRoles,
    toggleUserId, toggleUserList,
    toggleUserName
} from "@/features/user/loginSlice";
import RootStore from "@/appcore/rootStore";
import {message} from "antd";
import {useNavigate} from "react-router-dom";

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn:(loginForm) => postLogin(loginForm),
        retry: false,
        onSuccess: async (data) => {
            await Promise.all([
                RootStore.dispatch(toggleRoles(data?.roles)),
                RootStore.dispatch(toggleAccessToken(data?.accessToken)),
                RootStore.dispatch(toggleRefreshToken(data?.refreshToken)),
                RootStore.dispatch(toggleUserId(data?.userId)),
                RootStore.dispatch(toggleUserName(data?.userName)),
                RootStore.dispatch(toggleUserList(data?.userList)),
                RootStore.dispatch(toggleLoginState(true)),
            ]);

            navigate("/consultant", { replace: true });
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

export const useReservation = ({userOption, hasAdminAccess}) => {
    return useQuery({
        queryKey: ['reservation', userOption],
        queryFn: () => getReservation({userOption, hasAdminAccess}),
        retry: false
    })
}

export const useSaveReservation = () => {
    return useMutation( {
        mutationFn: ({reservationData, hasAdminAccess}) => postReservation({reservationData, hasAdminAccess}),
        retry: false,
    })
}

export const useDeleteReservation = () => {
    return useMutation({
        mutationFn: (reservationId) => deleteReservation(reservationId),
        retry: false,
    })
}

// 공차 담당자 조회
export const useSupabaseManager = (managerName) => {
    return useQuery({
        queryKey: ['manager', managerName],
        queryFn: ({queryKey}) => fetchManagerByName(queryKey[1]?.userName),
        enabled: !!managerName?.userId,
        retry: false,
    })
}

// 공차 거래처 조회
export const useSupabaseIntermediary = (intermediaryName) => {
    return useQuery({
        queryKey: ['intermediary', intermediaryName],
        queryFn: ({queryKey}) => fetchIntermediaryrByName(queryKey[1]),
        enabled: !!intermediaryName,
        retry: false,
    })
}

export const useSupabaseSaveGongcha = () => {
    return useMutation( {
        mutationFn: (isaData) => postSaveGongcha(isaData),
        retry: false,
    })
}

// 공지사항 조회
export const useGetNotice = (userId) => {
    return useQuery({
        queryKey: ['notice', userId],
        queryFn: () => getNotices(),
        staleTime: 0,
        enabled: !!userId,
        retry: false,
    })
}

// 공지사항 확인
export const usePostReadNotice = () => {
    return useMutation( {
        mutationFn: (noticeId) => postReadNotice(noticeId),
        retry: false,
    })
}