import {useMutation, useQuery} from "@tanstack/react-query";
import {getCalcConsultant, getConsultantMetadata, getKakaoAddress, getRoadDistance} from "@api/consultantApi";

// 상담 봇 메타 데이터 조회
export const useConsultantMetadata = () => {
    return useQuery({
        queryKey: ['consultantMetadata'],
        queryFn: getConsultantMetadata,
        retry: false
    })
}

// 주소 검색 함수 (Kakao API를 사용하는 부분)
export const useAddressSearch = (locationSearch) => {
    return useQuery({
        queryKey: ['addressSearch', locationSearch],
        queryFn: ({queryKey}) => getKakaoAddress(queryKey[1]),
        enabled: !!locationSearch?.address,
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
export const useCalcConsultant = () => {
    return useMutation({
        mutationFn: (consultantDataForm) => getCalcConsultant(consultantDataForm),
        retry: false,
        onError: (error) => {
            const errorMessage = error.response?.data?.errorMessage || "알 수 없는 오류가 발생했습니다.";
            alert(`API 요청 오류: ${errorMessage}`);
        },
        onSuccess: (data) => {
        }
    });
}


