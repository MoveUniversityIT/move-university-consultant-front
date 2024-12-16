import {useMutation, useQuery} from "@tanstack/react-query";
import {deleteQna, getQna, patchQna, postQna} from "@api/qnaApi";
import {message} from "antd";

export const useGetQna = () => {
    return useQuery({
        queryKey: ['qna'],
        queryFn: () => getQna(),
        staleTime: Infinity,
        retry: false,
    })
}

export const usePostQna = () => {
    return useMutation({
        mutationFn: (qnaData) => postQna(qnaData),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "QnA 추가 중 에러가 발생했습니다.";
            message.error(errorMessage);
        },
    })
}

export const usePatchQna = () => {
    return useMutation({
        mutationFn: (qnaData) => patchQna(qnaData),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "QnA 수정 중 에러가 발생했습니다.";
            message.error(errorMessage);
        },
    })
}

export const useDeleteQna = () => {
    return useMutation({
        mutationFn: (parentId) => deleteQna(parentId),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "QnA 삭제 중 에러가 발생했습니다.";
            message.error(errorMessage);
        },
    })
}