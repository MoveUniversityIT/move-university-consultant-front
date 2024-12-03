// Kakao 지도 API의 Geocoder 생성
import API from "@/appcore/api/API";

const KAKAO_API_KEY = 'ac0c13294a266a60b3d71faf0c38d965';

const geocoder = new window.kakao.maps.services.Geocoder();

// 상담 봇 메타데이터 조회
export const getConsultantMetadata = async () => {
    const response = await API.get('/consultant')
    return response?.data
}

// 주소 검색 함수 (Kakao API를 사용하는 부분)
export const getKakaoAddress = (searchInfo) => {
    return new Promise((resolve, reject) => {
        const initialAddress = searchInfo?.address;
        let initialResult = null;

        const searchAddress = (address, originalAddress = initialAddress) => {
            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                    if (!initialResult) {
                        initialResult = result;
                    }

                    const addressData = result[0];
                    const bCode = addressData?.address?.b_code;
                    if (bCode) {
                        if (initialResult[0].address === null) {
                            initialResult[0].address = {};
                        }

                        initialResult[0].address["address_name"] = originalAddress;
                        initialResult[0].address["b_code"] = bCode;

                        resolve({
                            address: initialResult,
                            locationType: searchInfo?.locationType,
                        });
                    } else {
                        const upperAddress = addressData?.address_name?.substring(0, addressData?.address_name.lastIndexOf(' '));
                        if (upperAddress !== address) {
                            searchAddress(upperAddress, originalAddress);
                        } else {
                            reject(new Error('주소 검색 실패 및 상위 주소 없음'));
                        }
                    }
                } else {
                    reject(new Error('주소 검색 실패'));
                }
            });
        };

        searchAddress(initialAddress);
    });
};

// 카카오 주소 검색(난이도 설정)
export const getDifficultyKakaoAddress = (searchInfo) => {
    return new Promise((resolve, reject) => {
        geocoder.addressSearch(searchInfo, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                resolve(result);
            } else {
                reject(new Error('주소 검색 실패'));
            }
        });
    });
};

// 도로 거리 계산 함수
export const getRoadDistance = async (location) => {
    const {startX, startY, endX, endY} = location;

    try {
        const response = await API.get('https://apis-navi.kakaomobility.com/v1/directions', {
            headers: {
                Authorization: `KakaoAK ${KAKAO_API_KEY}`,
            },
            params: {
                origin: `${startX},${startY}`,
                destination: `${endX},${endY}`,
            },
        });

        const distance = response?.routes[0]?.summary?.distance;
        return distance ? distance / 1000 : 0; // distance가 없으면 0 반환
    } catch (error) {
        console.error("도로 거리를 가져오는데 실패했습니다:", error);
        return 0; // API 호출 실패 시 0 반환
    }
};

// 배차 금액 조회
export const getCalcConsultant = async (consultantDataForm) => {
    try {
        const response = await API.post('/consultant/price/calculate', consultantDataForm);
        return response?.data;
    } catch (error) {
        const errorMessage = error.errorMessage || "알 수 없는 오류가 발생했습니다.";
        throw new Error(errorMessage);
    }
}

// 특수일(손 없는날) 조회
export const getSpecialDay = async (year) => {
    const response = await API.get(`/consultant/special-day?year=${year}`);
    return response?.data;
}

// 물품 조회
export const getItem = async (id) => {
    const response = await API.get(`/consultant/item/${id}`);

    return response?.data;
}

// 물품 목록 조회(cbm 또는 weight 값이 0)
export const getPendingItem = async () => {
    const response = await API.get("/consultant/pending-item");

    return response?.data;
}

// 물품 등록
export const postSaveItem = async (item) => {
    const response = await API.post('/consultant/item', item);

    return response?.data;
}

// 이사 종류 + 상하차 방법 - 요금 비율 수정
export const patchUpdateDateFeeRate = async (updateRateForm) => {
    const response = await API.patch(`/consultant/date-fee`, updateRateForm);

    return response?.data;
}

// 특수일 등록
export const postSpecialDate = async (specialDate) => {
    const response = await API.post('/consultant/special-day', specialDate);
    return response?.data;
}

// 이미지 조회
export const getImage = async (imageName) => {
    const response = await API.get(`/images/${imageName}`);
    const base64Image = response?.data;

    if (!base64Image) {
        throw new Error("이미지를 가져오는 데 실패했습니다.");
    }

    return `data:image/jpeg;base64,${base64Image}`;
};