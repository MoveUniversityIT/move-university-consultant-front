import API from "@api/API";

export const getUserManagement = async () => {
    const response = await API.get('/admin/management/user')
    return response?.data
}

export const patchUserInfo = async ({userId, statusType}) => {
    const response = await API.patch(`/admin/management/user/${userId}`, statusType);

    return response?.data;
}

export const getDifficulty = async (bCode) => {
    const response = await API.get(`/admin/difficulty/${bCode}`)

    return response?.data
}

export const postDifficulty = async (data) => {
    const response = await API.post('/admin/difficulty', data)

    return response?.data
}

export const getDifficultyList = async (page) => {
    const response = await API.get(`/admin/difficulty?page=${page.page}&size=${page.size}`)

    return response?.data
}

export const getNotice = async () => {
    const response = await API.get('/admin/notice');

    return response?.data;
}

export const postNotice = async (noticeForm) => {
    const response = await API.post('/admin/notice', noticeForm);

    return response?.data;
}

export const patchNotice = async (noticeForm) => {
    const { id, data } = noticeForm;
    const response = await API.patch(`/admin/notice/${id}`, data);

    return response?.data;
}

// 다른 회원 예약 조회
export const getUserReservation = async (userId) => {
    const response = await API.get(`/admin/user/reservation?userId=${userId}`);

    return response?.data;
}