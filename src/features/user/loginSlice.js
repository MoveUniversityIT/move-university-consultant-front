import { createSlice } from "@reduxjs/toolkit";


const initialState= {
    userId: null,
    userName: '',
    loginState: false,
    accessToken: '',
    refreshToken: '',
    roles: []
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        toggleUserId: (state, action) => {
            state.userId = action.payload
        },
        toggleUserName: (state, action) => {
            state.userName = action.payload
        },
        toggleLoginState: (state, action) => {
            state.loginState = action.payload;
        },
        toggleAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        toggleRefreshToken: (state, action) => {
            state.refreshToken = action.payload;
        },
        toggleRoles: (state, action) => {
            state.roles = action.payload;
        },
        resetState: () => initialState
    }
});

export const { toggleUserId, toggleUserName, toggleLoginState, toggleAccessToken, toggleRefreshToken, toggleRoles, resetState } = loginSlice.actions;
export default loginSlice.reducer;