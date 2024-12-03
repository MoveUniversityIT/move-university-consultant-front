import {useMutation, useQuery} from "@tanstack/react-query";
import {getDifficulty, getDifficultyList, getUserManagement, patchUserInfo, postDifficulty} from "@api/adminApi";

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

export const useDifficultyLevel = (bCode) => {
    return useQuery({
        queryKey: ['difficultyLevel', bCode],
        queryFn: ({queryKey}) => getDifficulty(queryKey[1]),
        enabled: !!bCode && bCode.length === 10,
        retry: false,
    })
}

export const useUpdateDifficultyLevel = () => {
    return useMutation({
        mutationFn: (data) => postDifficulty(data),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "지역 난이도 설정에 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}

export const useDifficultyLevelList = (page) => {
    return useQuery({
        queryKey: ['difficultyLevelList', page],
        queryFn: ({queryKey}) => getDifficultyList(queryKey[1]),
        enabled: !!page,
        retry: false,
    })
}