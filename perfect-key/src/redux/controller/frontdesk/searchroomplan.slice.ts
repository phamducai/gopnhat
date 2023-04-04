import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageType, NavbarType } from "common/define-type";

interface AppState {
    language: LanguageType;
    navbar: NavbarType,
    hotelName: string;
    hotelId: string;
}

const initAppState: AppState = {
    language: 'en',
    navbar: 'dashboard',
    hotelName: 'Hotel name',
    hotelId: "",
}

const searchSlice = createSlice({
    name: 'app',
    initialState: initAppState,
    reducers: {
        changeLanguage(state, action: PayloadAction<LanguageType>) {
            state.language = action.payload
        },
        setNavbar(state, action: PayloadAction<NavbarType>) {
            const navbar = action.payload;
            if (navbar !== state.navbar) {
                state.navbar = action.payload
            }
        },
        selectHotel(state, action: PayloadAction<{ hotelName: string, hotelId: string }>) {
            state.hotelId = action.payload.hotelId;
            state.hotelName = action.payload.hotelName;
        }
    }
})

export const {
    changeLanguage,
    setNavbar,
    selectHotel
} = searchSlice.actions;
export const appReducer = searchSlice.reducer