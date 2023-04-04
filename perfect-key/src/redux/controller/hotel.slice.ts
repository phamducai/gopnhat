/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootEpic } from "common/define-type";
import { catchError, filter, switchMap, map } from "rxjs/operators";
// import ListHotelApi from "api/hotel/hotel.api";
import HotelConfigApi from "api/hcfg/hcfg.api";
import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";

interface HotelListState {
    loading: boolean,
    isSuccess: boolean,
    message: string | undefined,
    listHotel: [],
}
const initState: HotelListState = {
    loading: true,
    isSuccess: false,
    message: undefined,
    listHotel: []
}

const hotelSlice = createSlice({
    name: "hotel",
    initialState: initState,
    reducers: {
        getListHotelRequest(state, action: PayloadAction<string>) {
            state.loading = true
        },
        getListHotelSuccess(state, action: PayloadAction<any>) {
            state.listHotel = action.payload;
            state.loading = false;
        },
        message(state, action: PayloadAction<string>) {
            state.message = action.payload;
            state.loading = false;
        }
    }
})
const getListHotel$: RootEpic = (action$) => action$.pipe(
    filter(getListHotelRequest.match),
    switchMap((action) => {
        return HotelConfigApi.getHotel(action.payload).pipe(
            map((res: any) => {
                return hotelSlice.actions.getListHotelSuccess(res);
            }
            ),
            catchError(err => {
                openNotification(NotificationStatus.Error, "Error", "Can't get data hotel !");
                return [hotelSlice.actions.message(err)]
            })
        )
    }
    )
)
export const HotelEpics = [
    getListHotel$
]
export const {
    getListHotelRequest
} = hotelSlice.actions
export const hotelReducer = hotelSlice.reducer