import API from "@api/API";

export const getSalesQna = async () => {
    const response = await API.get('/admin/sales-qna');

    return response?.data;
}

export const postSalesQna = async (qnaData) => {
    const response = await API.post('/admin/sales-qna', qnaData)

    return response?.data
}

export const patchSalesQna = async ({parentId, content}) => {
    const response = await API.patch(`/admin/sales-qna/${parentId}`, {content})

    return response?.data
}

export const deleteSalesQna = async (parentId) => {
    const response = await API.delete(`/admin/sales-qna/${parentId}`)

    return response?.data
}