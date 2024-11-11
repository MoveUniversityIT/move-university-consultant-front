import { createSlice } from "@reduxjs/toolkit";


const initialState= {
    loginState: false,
    accessToken: '',
    refreshToken: ''
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
    }
});

export const { toggleLoginState, toggleAccessToken, toggleRefreshToken } = loginSlice.actions;
export default loginSlice.reducer;