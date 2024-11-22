import {useMutation, useQuery} from "@tanstack/react-query";
import {getUserManagement, patchUserInfo} from "@api/adminApi";

export const useUserManagement = () => {
    return useQuery({
        queryKey: ['userManagement'],
        queryFn: getUserManagement,
        retry: false,
        refetchInterval: 1000 * 60 * 10,
    })
}

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: ({userId, statusType}) => patchUserInfo({userId, statusType}),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "사용자 정보 수정에 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}