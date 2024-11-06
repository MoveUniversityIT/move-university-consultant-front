// Kakao 지도 API의 Geocoder 생성
import API from "@/appcore/api/API";

const KAKAO_API_KEY = 'ac0c13294a266a60b3d71faf0c38d965';

const geocoder = new window.kakao.maps.services.Geocoder();

// 상담 봇 메타데이터 조회
export const getConsultantMetadata = async () => {
    const response = await API.get('/consultant')

    return response?.data.data
}

// 주소 검색 함수 (Kakao API를 사용하는 부분)
export const getKakaoAddress = (searchInfo) => {
    return new Promise((resolve, reject) => {
        geocoder.addressSearch(searchInfo?.address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                resolve({address: result, locationType: searchInfo?.locationType}); // 검색 결과를 resolve로 반환
            } else {
                reject(new Error('주소 검색 실패'));
            }
        });
    });
};

// 도로 거리 계산 함수
export const getRoadDistance = async (location) => {
    const {startX, startY, endX, endY} = location;

    const response = await API.get('https://apis-navi.kakaomobility.com/v1/directions', {
        headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
        params: {
            origin: `${startX},${startY}`,
            destination: `${endX},${endY}`,
        },
    });

    const distance = response.data?.routes[0]?.summary?.distance;
    return distance ? distance / 1000 : undefined;
};

// 배차 금액 조회
export const getCalcConsultant = async (consultantDataForm) => {
    const response = await API.post('/consultant/price/calculate', consultantDataForm);

    return response?.data?.data;
}

// 특수일(손 없는날) 조회
export const getSpecialDay = async (year) => {
    const response = await API.get(`/consultant/special-day?year=${year}`);

    return response?.data?.data;
}

// 물품 등록
export const postSaveItem = async (item) => {
    const response = await API.post('/consultant/item', item);

    return response?.data?.data;
}

