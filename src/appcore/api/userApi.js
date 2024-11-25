import API from "@api/API";

export const postLogin = async (loginForm) => {
    const response = await API.post('/user/login', loginForm)

    return response?.data;
}

export const getCheckEmail = async (email) => {
    return await API.get(`/user/check-email?email=${email}`)
}