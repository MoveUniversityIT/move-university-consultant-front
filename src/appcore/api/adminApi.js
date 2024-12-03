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
    console.log("data", data);
    const response = await API.post('/admin/difficulty', data)

    return response?.data
}

export const getDifficultyList = async (page) => {
    const response = await API.get(`/admin/difficulty?page=${page.page}&size=${page.size}`)

    return response?.data
}