import dayjs from "dayjs";
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    reservationId: null,
    client: {key: 0, value: '이사대학'},
    distance: 0,
    dokchaPrice: 0,
    loadLocation: '',
    loadCityCode: null,
    loadMethod: {key: 1, value: '엘레베이터'},
    loadFloor: 1,
    loadArea: 1,
    loadHouseholdMembers: 0,
    loadCustomers: [],

    unloadLocation: '',
    unloadCityCode: null,
    unloadMethod: {key: 1, value: '엘레베이터'},
    unloadFloor: 1,
    unloadArea: 1,
    unloadHouseholdMembers: 0,
    unloadCustomers: [],

    locationInfo: {startX: null, startY: null, endX: null, endY: null},

    moveType: null,
    requestDate: dayjs(new Date()),
    requestTime: dayjs('08:00', 'HH:mm'),

    storageMoveType: null,
    storageLoadRequestDate: dayjs(new Date()),
    storageLoadRequestTime: dayjs('08:00', 'HH:mm'),
    storageUnloadRequestDate: dayjs(new Date()),
    storageUnloadRequestTime: dayjs('08:00', 'HH:mm'),

    isTogether: false,
    isAlone: false,
    vehicleType: {key: 1, value: '카고'},
    vehicleTonnage: 1,
    vehicleCount: null,

    heleprs: [
        {helperType: 'TRANSPORT', peopleCount: 0},
        {helperType: 'PACKING_CLEANING', peopleCount: 0}
    ],
    items: [],
    specialItems: {},
    customerName: '',
    customerPhoneNumber: '',
    paymentMethod: {key: 1, value: '현금'},
    memo: '',

    searchItemTerm: '',
    unregisterWord: [],
    searchSpecialItemTerm: '',

    suggestions: [],
    specialItemSuggestions: [],

    dispatchAmount: null,
    consultantDataForm: null,
    isFormValid: false,

    loadAddressList: [],
    unloadAddressList: [],

    sliderValue: 5,
    dispatchCosts: {},

    isLoadLocationError: false,
    isUnloadLocationError: false
}

const consultantSlice = createSlice({
    name: 'consultant',
    initialState,
    reducers: {
        toggleItems: (state, action) => {
            state.items = action.payload
        },
        toggleSuggestions: (state, action) => {
            state.suggestions = action.payload
        },
        toggleSearchTerm: (state, action) => {
            state.searchItemTerm = action.payload
        },
        toggleUnregisterWord: (state, action) => {
            state.unregisterWord = action.payload
        },

    }
});

export const { toggleItems,
    toggleSuggestions,
    toggleSearchTerm,
    toggleUnregisterWord} = consultantSlice.actions;
export default consultantSlice.reducer;