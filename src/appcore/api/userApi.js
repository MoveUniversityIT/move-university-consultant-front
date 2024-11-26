import API from "@api/API";

export const postLogin = async (loginForm) => {
    const response = await API.post('/user/login', loginForm)

    return response?.data;
}

export const getCheckEmail = async (email) => {
    return await API.get(`/user/check-email?email=${email}`)
}

export const postRegisterUser = async (registerForm) => {
    const response = await API.post('/user/register', registerForm)

    return response?.data;
}

export const getReservation = async () => {
    const response = await API.get('/user/reservation');

    return response?.data;
}

export const postReservation = async (moveInfo) => {
    const response = await API.post('/user/reservation', moveInfo)

    return response?.data;
}

export const deleteReservation = async (reservationId) => {
    const response = await API.delete(`/user/reservation/${reservationId}/delete`)

    return response?.data;
}