import {useMutation, useQuery} from "@tanstack/react-query";
import {message} from "antd";
import {deleteSalesQna, getSalesQna, patchSalesQna, postSalesQna} from "@api/salesQnaApi";

export const useGetSalesQna = () => {
    return useQuery({
        queryKey: ['salesQna'],
        queryFn: () => getSalesQna(),
        staleTime: Infinity,
        retry: false,
    })
}

export const usePostSalesQna = () => {
    return useMutation({
        mutationFn: (salesQnaData) => postSalesQna(salesQnaData),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "영업 QnA 추가 중 에러가 발생했습니다.";
            message.error(errorMessage);
        },
    })
}

export const usePatchSalesQna = () => {
    return useMutation({
        mutationFn: (salesQnaData) => patchSalesQna(salesQnaData),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "영업 QnA 수정 중 에러가 발생했습니다.";
            message.error(errorMessage);
        },
    })
}

export const useDeleteSalesQna = () => {
    return useMutation({
        mutationFn: (parentId) => deleteSalesQna(parentId),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "영업 QnA 삭제 중 에러가 발생했습니다.";
            message.error(errorMessage);
        },
    })
}