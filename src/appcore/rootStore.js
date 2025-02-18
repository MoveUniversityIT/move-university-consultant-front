import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import login from "@/features/user/loginSlice";
import reservation from "@/features/reservation/reservationSlice";
import consultant from "@/features/consultant/consultantSlice";

const persistConfig = {
    key: "root",
    storage,
    blacklist: []
}

const reducers = combineReducers({
    login,
    reservation,
    consultant
})

const persistedReducer = persistReducer(persistConfig, reducers);

const RootStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat()
});

export default RootStore;