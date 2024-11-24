import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reservations: [],
};

const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        addReservation: (state, action) => {
            state.reservations.push(action.payload);
        },
        deleteReservation: (state, action) => {
            state.reservations = state.reservations.filter((_, idx) => idx !== action.payload);
        },
    }
});

export const { addReservation, deleteReservation, loadReservation, resetReservation, setReservations } =
    reservationSlice.actions;
export default reservationSlice.reducer;
