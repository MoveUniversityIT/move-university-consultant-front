import API from "@api/API";

export const getUserManagement = async () => {
    const response = await API.get('/admin/management/user')
    return response?.data
}

export const patchUserInfo = async ({userId, statusType}) => {
    const response = await API.patch(`/admin/management/user/${userId}`, statusType);

    return response?.data;
}