import {useMutation, useQuery} from "@tanstack/react-query";
import {
    getDifficulty,
    getDifficultyList,
    getNotice,
    getUserManagement, getUserReservation,
    patchNotice,
    patchUserInfo,
    postDifficulty,
    postNotice
} from "@api/adminApi";

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

export const useGetNotices = () => {
    return useQuery({
        queryKey: ['notice'],
        staleTime: 0,
        queryFn: () => getNotice(),
        retry: false,
    })
}

export const usePostNotice = () => {
    return useMutation({
        mutationFn: (noticeForm) => postNotice(noticeForm),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "공지사항 등록에 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}

export const useUpdateNotice = () => {
    return useMutation({
        mutationFn: (noticeForm) => patchNotice(noticeForm),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "공지사항 수정에 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}

export const useDeleteNotice = () => {
    return useMutation({
        mutationFn: (noticeForm) => postNotice(noticeForm),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "공지사항 등록에 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}

export const useMtReservation = () => {
    return useMutation({
        mutationFn: (userId) => getUserReservation(userId),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "회원 예약 정보를 가져오는데 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}