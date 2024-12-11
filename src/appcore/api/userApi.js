import API from "@api/API";
import {supabase} from "@/appcore/supabase/supabaseClient";

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

export const fetchManagerByName = async (name) => {
    const { data, error } = await supabase
        .from('manager')
        .select('*')
        .match({ name: name });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const fetchIntermediaryrByName = async (name) => {
    const { data, error } = await supabase
        .from('intermediary')
        .select('*')
        .match({ name: name });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const postSaveGongcha = async (isaData) => {
    const {data, error} = await supabase.from("isa").insert(isaData);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const getNotices = async () => {
    const response = await API.get('/user/notice');

    return response?.data;
}

export const postReadNotice = async (noticeId) => {
    const response = await API.post('/user/notice', noticeId);

    return response?.data;
}

