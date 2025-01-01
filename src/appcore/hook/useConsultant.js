import {useMutation, useQuery} from "@tanstack/react-query";
import {
    getCalcConsultant,
    getCalcConsultants,
    getConsultantMetadata, getCustomerUploadImage, getCustomerUploadVoice,
    getDifficultyKakaoAddress,
    getImage,
    getItem,
    getKakaoAddress,
    getPendingItem,
    getRoadDistance,
    getSpecialDay,
    getUploadImage, getUploadVoice,
    patchUpdateDateFeeRate,
    postSaveItem,
    postSpecialDate,
    postUploadImageAndVoice
} from "@api/consultantApi";
import {message} from "antd";

// 상담 봇 메타 데이터 조회
export const useConsultantMetadata = (userId) => {
    return useQuery({
        queryKey: ['consultantMetadata', userId],
        queryFn: getConsultantMetadata,
        retry: false,
        enabled: !!userId,
        refetchInterval: 1000 * 60 * 10,
    })
}

// 카카오 주소 검색 함수 (Kakao API를 사용하는 부분)
export const useAddressSearch = (locationSearch) => {
    return useQuery({
        queryKey: ['addressSearch', locationSearch],
        queryFn: ({queryKey}) => getKakaoAddress(queryKey[1]),
        enabled: !!locationSearch?.address,
        retry: false,
    })
}

// 카카오 주소 난이도 검색 함수 (Kakao API를 사용하는 부분)
export const useDifficultyAddressSearch = (locationSearch) => {
    return useQuery({
        queryKey: ['difficultyAddressSearch', locationSearch],
        queryFn: ({queryKey}) => getDifficultyKakaoAddress(queryKey[1]),
        enabled: !!locationSearch,
        retry: false,
    })
}

// 도로 거리 계산 함수
export const useRoadDistance = (location) => {
    return useQuery({
        queryKey: ['roadDistance', location],
        queryFn: ({queryKey}) => getRoadDistance(queryKey[1]),
        enabled: !!location?.startX && !!location.startY && !!location?.endX && !!location.endY,
        retry: false
    })
};

// 배차 금액 조회
// export const useCalcConsultant = () => {
//     return useMutation({
//         mutationFn: (consultantDataForm) => getCalcConsultant(consultantDataForm),
//         retry: false,
//         onError: (error) => {
//             const errorMessage = error.errorMessage || "알 수 없는 오류가 발생했습니다.";
//             alert(`API 요청 오류: ${errorMessage}`);
//         },
//     });
// }

// 배차 금액 조회
export const useCalcConsultant = (consultantDataForm, enabled) => {
    return useQuery({
            queryKey: ['calcConsultant', consultantDataForm],
            queryFn: ({queryKey}) => getCalcConsultant(queryKey[1]),
            enabled,
            retry: false,
        }
    );
};

// 배차 금액 조회(여러 항목)
export const useCalcConsultants = () => {
    return useMutation({
        mutationFn: (consultantDataForm) => getCalcConsultant(consultantDataForm),
        retry: false,
    })
}

// 특수일(손 없는날) 조회
export const useSpecialDay = () => {
    return useMutation({
        mutationFn: (year) => getSpecialDay(year),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "특수일(손없는 날) 데이터를 가져오는데 실패했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}

// 물품 조회
export const useGetItem = () => {
    return useMutation({
        mutationFn: (itemId) => getItem(itemId),
        retry: false,
        onError: (error) => {
            const errorMessage = error?.response?.data?.errorMessage || "아이템 조회 중 오류가 발생했습니다.";
            alert(errorMessage);
        },
    })
}

// 물품 목록 조회(cbm 또는 weight 값이 0)
export const usePendingItem = () => {
    return useQuery({
        queryKey: ['pendingItem'],
        queryFn: getPendingItem,
        retry: false,
    })
}

// 물품 등록
export const useSaveItem = () => {
    return useMutation({
        mutationFn: (item) => postSaveItem(item),
        retry: false,
        onSuccess: (response) => {
            // 서버에서 받은 성공 메시지
            const successMessage = response?.data?.message || "아이템이 성공적으로 추가되었습니다.";
            alert(successMessage);
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.errorMessage || "아이템 추가 중 오류가 발생했습니다.";
            alert(errorMessage);
        },
    })
}

// 물품 수정
// export const useUpdateItem = () => {
//     return useMutation({
//         mutationFn:({itemId, item}) => putUpdateItem(itemId, item),
//         retry: false,
//         onSuccess: (response) => {
//             // 서버에서 받은 성공 메시지
//             const successMessage = response?.data?.message || "아이템이 성공적으로 추가되었습니다.";
//             alert(successMessage);
//         },
//         onError:(error) => {
//             const errorMessage = error?.response?.data?.errorMessage || "아이템 수정 중 오류가 발생했습니다.";
//             alert(errorMessage);
//         },
//     })
// }

// 이사 종류 + 상하차 방법 - 요금 비율 수정
export const useUpdateDateRate = () => {
    return useMutation({
        mutationFn: (updateRateForm) => patchUpdateDateFeeRate(updateRateForm),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "날짜 추가 요금 수정하는데 오류가 발생했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}

// 특수일 등록
export const useRegSpecialDate = () => {
    return useMutation({
        mutationFn: (date) => postSpecialDate(date),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "특수일 등록하는데 오류가 발생했습니다.";
            alert(`API 요청 오류: ${errorMessage}`)
        },
    })
}

export const useImageQuery = (imageName, enabled = true) => {
    return useQuery({
        queryKey: ["image", imageName],
        queryFn: ({queryKey}) => getImage(queryKey[1]),
        enabled,
        retry: false,
        onError: (error) => {
            console.error("이미지 로드 오류:", error);
        },
    });
};

export const usePostUploadImageAndVoice = () => {
    return useMutation({
        mutationFn: (dataForm) => postUploadImageAndVoice(dataForm),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "업로드 중 오류가 발생했습니다.";
            message.error(errorMessage);
        },
    })
}

export const useGetUploadImage = () => {
    return useMutation({
        mutationFn: (searchParams) => getUploadImage(searchParams),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "이미지 조회를 하는데 문제가 발생했습니다.";
            message.error(errorMessage);
        }
    })
}

export const useGetCustomerUploadImage = () => {
    return useMutation({
        mutationFn: (searchParams) => getCustomerUploadImage(searchParams),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "이미지 조회를 하는데 문제가 발생했습니다.";
            message.error(errorMessage);
        }
    })
}

export const useGetUploadVoice = () => {
    return useMutation({
        mutationFn: (searchParams) => getUploadVoice(searchParams),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "녹음 조회를 하는데 문제가 발생했습니다.";
            message.error(errorMessage);
        }
    })
}

export const useGetCustomerUploadVoice = () => {
    return useMutation({
        mutationFn: (searchParams) => getCustomerUploadVoice(searchParams),
        retry: false,
        onError: (error) => {
            const errorMessage = error.errorMessage || "이미지 조회를 하는데 문제가 발생했습니다.";
            message.error(errorMessage);
        }
    })
}