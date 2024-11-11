import API from "@api/API";

export const postLogin = async (loginForm) => {
    const response = await API.post('/user/login', loginForm)

    return response?.data;
}