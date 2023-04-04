import { RootEpic } from "common/define-type";
import { catchError, filter, mergeMap, switchMap } from "rxjs/operators";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageType, NavbarType } from "common/define-type";
import InventoryApi from "api/inv/inv.api";
import { NumberOfRooms } from "common/model-inventory";
import GLobalPkm from "common/global";
import { throwError } from "rxjs";

interface AppState {
    language: LanguageType;
    navbar: NavbarType,
    hotelName: string;
    hotelId: string;
    isTimeLineGuid: boolean,
    lastNightAudit: string,
    numberOfRooms: NumberOfRooms[],
    roomTypePMId: string
}

const initAppState: AppState = {
    language: 'vi',
    navbar: 'dashboard',
    hotelName: 'Hotel name',
    hotelId: "",
    isTimeLineGuid: false,
    lastNightAudit: "",
    numberOfRooms: [],
    roomTypePMId: GLobalPkm.defaultBytes32
}

const appSlice = createSlice({
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
        selectHotel(state, action: PayloadAction<{ hotelName: string, hotelId: string, businessDate: string, lastNightAudit: string }>) {
            state.hotelId = action.payload.hotelId;
            state.hotelName = action.payload.hotelName;
            state.lastNightAudit = action.payload.lastNightAudit
        },
        setTimeLineGuid(state, action: PayloadAction<boolean>) {
            state.isTimeLineGuid = action.payload;
        },
        fetchRoomTypeAvailableRequest: (state, action: PayloadAction<string>) => {
            //state.isSuccess = true;
        },
        fetchRoomTypeAvailable: (state, action: PayloadAction<NumberOfRooms[]>) => {
            state.numberOfRooms = action.payload;
        },
        fetchRoomTypePmIdRequest: (state, action: PayloadAction<string>) => {
            //state.numberOfRooms = action.payload;
        },
        setRoomTypePm: (state, action: PayloadAction<string>) => {
            state.roomTypePMId = action.payload;
        }
    }
})
const getAvaliableRoom$: RootEpic = (action$) => action$.pipe(
    filter(fetchRoomTypeAvailableRequest.match),
    switchMap((action) => {
        return InventoryApi.getNumberOfRoomsInEachRoomTypes(action.payload).pipe(
            mergeMap((res) => {
                return [
                    appSlice.actions.fetchRoomTypeAvailable(res as NumberOfRooms[]),
                    appSlice.actions.fetchRoomTypePmIdRequest(action.payload)
                ]
            }))
    })
);
const getRoomTypePmId$: RootEpic = (action$) => action$.pipe(
    filter(fetchRoomTypePmIdRequest.match),
    switchMap((action) => {
        return InventoryApi.getRoomTypePMId(action.payload).pipe(
            mergeMap((res) => {
                return [
                    appSlice.actions.setRoomTypePm(res ?? GLobalPkm.defaultBytes32)
                ]
            }), catchError(err => throwError(err))
        )
    })
);
export const {
    changeLanguage,
    setNavbar,
    selectHotel,
    setTimeLineGuid,
    fetchRoomTypeAvailableRequest,
    fetchRoomTypePmIdRequest
} = appSlice.actions;

export const ApppEpics = [
    getAvaliableRoom$,
    getRoomTypePmId$
];

export const appReducer = appSlice.reducer