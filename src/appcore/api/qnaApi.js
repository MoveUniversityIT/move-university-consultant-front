import API from "@api/API";

export const getQna = async () => {
    const response = await API.get('/admin/qna');

    return response?.data;
}

export const postQna = async (qnaData) => {
    const response = await API.post('/admin/qna', qnaData)

    return response?.data
}

export const patchQna = async ({parentId, content}) => {
    const response = await API.patch(`/admin/qna/${parentId}`, {content})

    return response?.data
}

export const deleteQna = async (parentId) => {
    const response = await API.delete(`/admin/qna/${parentId}`)

    return response?.data
}