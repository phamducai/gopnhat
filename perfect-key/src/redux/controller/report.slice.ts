/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import ListHotelApi from "api/hotel/hotel.api";

interface ReportListState {
    loading: boolean,
    isSuccess: boolean,
    message: string | undefined,
}
const initState: ReportListState = {
    loading: false,
    isSuccess: false,
    message: undefined,
}

const reportSlice = createSlice({
    name: "report",
    initialState: initState,
    reducers: {
        getWaitingRequest(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        message(state, action: PayloadAction<string>) {
            state.message = action.payload;
        }
    }
})

export const ReportEpics = []
export const {
    getWaitingRequest
} = reportSlice.actions
export const reportReducer = reportSlice.reducer