import { createSlice } from "@reduxjs/toolkit";


const initialState= {
    loginState: false,
    accessToken: '',
    refreshToken: '',
    roles: []
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
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

export const { toggleLoginState, toggleAccessToken, toggleRefreshToken, toggleRoles, resetState } = loginSlice.actions;
export default loginSlice.reducer;