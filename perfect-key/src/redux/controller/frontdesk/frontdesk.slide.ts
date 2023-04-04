import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import InventoryApi from "api/inv/inv.api";
import { RootEpic } from 'common/define-type';
import { HouseKepping, RevenueInDaysData, StatisticGuestInRoom } from "common/model-statistic";
import { catchError, filter, map, switchMap } from "rxjs/operators";

interface FrontdeskState {
    loading: boolean,
    message: string,
    availableTonight: number,
    listHousekeeping: HouseKepping,
    listStatisticGuest: StatisticGuestInRoom,
    revenueInDay: RevenueInDaysData[],
}

const initAppState: FrontdeskState = {
    loading: false,
    message: "",
    availableTonight: 0,
    listHousekeeping: { clean: 29, dirty: 20, inspected: 2 },
    listStatisticGuest: {
        arrivals: { actual: { room: 0, guest: 0 }, expected: { room: 0, guest: 0 } },
        complimentary: { room: 0, guest: 0 },
        departures: { actual: { room: 0, guest: 0 }, expected: { room: 0, guest: 0 } },
        houseUse: { room: 0, guest: 0 },
        inHouse: { room: 0, guest: 0 },
        walkIns: { room: 0, guest: 0 }
    },
    revenueInDay: [{ "Key": "", "Value": 0 }],
}

const frontdeskSlice = createSlice({
    name: 'frontdesk',
    initialState: initAppState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        message(state, action: PayloadAction<string>) {
            state.message = action.payload
        },
        setAvaiableToNight(state, action: PayloadAction<number>) {
            state.availableTonight = action.payload
        },
        getListHouseKeeping(state, action: PayloadAction<string>) {
            state.loading = true
        },
        listHousekeeping(state, action: PayloadAction<FrontdeskState["listHousekeeping"]>) {
            state.listHousekeeping = action.payload
            state.loading = false
        },
        listStaticGuest(state, action: PayloadAction<StatisticGuestInRoom>) {
            state.listStatisticGuest = action.payload
        },
        reqListRevenueInDay(state, action: PayloadAction<RevenueInDaysData[]>) {
            state.loading = true
        },
        getListRevenueInDay(state, action: PayloadAction<RevenueInDaysData[]>) {
            state.revenueInDay = action.payload
            state.loading = false
        }
    }
})

const fetchHouseKeeping$: RootEpic = (action$) => action$.pipe(  
    filter(getListHouseKeeping.match),
    switchMap((action) => {
        return InventoryApi.getListHouseKeeping(action.payload).pipe(
            map((res) => {
                return frontdeskSlice.actions.listHousekeeping(res)
            }), catchError((err) => {
                console.log(err);
                return [frontdeskSlice.actions.message(err.message), frontdeskSlice.actions.setLoading(false)]
            })
        )
    })
)
const fetchRevenueInDay$: RootEpic = (action$) => action$.pipe(
    filter(reqListRevenueInDay.match),
    map((action) => {
        return frontdeskSlice.actions.getListRevenueInDay(action.payload)
        // return PkmApi.getRevenueInDay(action.payload).pipe(
        //     map((res) => {
        //     }), catchError((err) => {
        //         console.log(err);
        //         return [frontdeskSlice.actions.message(err.message)]
        //     })
        // )
    }), catchError(err => [frontdeskSlice.actions.message(err.message), frontdeskSlice.actions.setLoading(false)])
)

export const FrontDeskEpics = [
    fetchHouseKeeping$,
    fetchRevenueInDay$
]

export const {
    setAvaiableToNight,
    listHousekeeping,
    getListHouseKeeping,
    reqListRevenueInDay,
    getListRevenueInDay,
    listStaticGuest
} = frontdeskSlice.actions;
export const frontdeskReducer = frontdeskSlice.reducer