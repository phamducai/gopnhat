import { mergeMap } from 'rxjs/operators';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GuestProfile } from 'common/model-profile';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListCardRoomPlan, ResHeaderINV, RoomInfo, RoomMapRoomType } from "common/model-inventory";
import { ListTsRoomPlan } from 'common/model-booking';
import { ResGuestProfiles } from 'common/define-api-booking';
import { RootEpic } from 'common/define-type';
import { catchError, filter, map, switchMap } from "rxjs/operators";
import InventoryApi from 'api/inv/inv.api';
import functionPkmApi from 'api/pkm/function.api';
import { NotificationStatus } from 'common/enum/shared.enum';
import openNotification from 'components/CNotification';
import { updateQueryParamStatus } from 'redux/controller/booking.slice';
import { DMColorType } from 'common/shared/dmuccolor.model';
import { ITracerMessage } from 'common/model-rsvn';

interface RoomPlanState {
    loading: boolean,
    message: string,
    ListCardRoomPlan: ListCardRoomPlan[],
    dataTransactRoom: ListTsRoomPlan[],
    listGuestProfile: GuestProfile[],
    dataUnAssignRoom: ResGuestProfiles[],
    listRoom: RoomMapRoomType[],
    lstEmptyRooms: ListCardRoomPlan[],
    listDmucColor: DMColorType[],
    queryParamRoomPlan: string,
    dateInputCheckIn: any,
    alertMessage: ITracerMessage | null,
    resHeaderINV: ResHeaderINV
}

const initAppState: RoomPlanState = {
    loading: false,
    message: "",
    listRoom: [],
    ListCardRoomPlan: [],
    dataTransactRoom: [],
    listGuestProfile: [],
    dataUnAssignRoom: [],
    lstEmptyRooms: [],
    listDmucColor: [],
    queryParamRoomPlan: "",
    dateInputCheckIn: [],
    alertMessage: null,
    resHeaderINV: {
        TotalCount: 0,
        TotalPages: 0,
        inspected: 0,
        orderService: 0,
        outOfOrder: 0,
        unInspected: 0,
        vacantClean: 0,
        vacantDirty: 0
    }
}

const roomPlanSlice = createSlice({
    name: 'roomplan',
    initialState: initAppState,
    reducers: {
        message(state, action: PayloadAction<string>) {
            state.message = action.payload
            state.loading = false
        },
        setListCardRoomPlan(state, action: PayloadAction<ListCardRoomPlan[]>) {
            state.ListCardRoomPlan = action.payload
        },
        setListGuestAndTsRoom(state, action: PayloadAction<any>) {
            const { dataTransactRoom, listGuestProfile } = action.payload;
            state.dataTransactRoom = dataTransactRoom;
            state.listGuestProfile = listGuestProfile;
        },
        getListDataUnAssignRoom(state, action: PayloadAction<ResGuestProfiles[]>) {
            state.dataUnAssignRoom = action.payload;
        },
        searchByRoomNoRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        searchByRoomNoSuccess(state, action: PayloadAction<RoomMapRoomType[]>) {
            state.listRoom = action.payload;
        },
        breakSharedRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        setListEmptyRooms(state, action: PayloadAction<ListCardRoomPlan[]>) {
            state.lstEmptyRooms = action.payload
        },
        unAssignRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        resetMessage(state) {
            state.message = "";
        },
        listDmucColorRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        setListDmucColor(state, action: PayloadAction<any>) {
            state.listDmucColor = action.payload;
        },
        setQueryParamRoomPlan(state, action: PayloadAction<string>) {
            state.queryParamRoomPlan = action.payload;
        },
        setDateInputCheckIn(state, action: PayloadAction<any>) {
            state.dateInputCheckIn = action.payload;
        },
        setAlertMessage(state, action: PayloadAction<ITracerMessage>) {
            state.alertMessage = action.payload
        },
        setLoading(state, action: PayloadAction<any>) {
            state.loading = action.payload
        },
        setResHeaderINV(state, action: PayloadAction<ResHeaderINV>) {
            state.resHeaderINV = action.payload
        },
    }
})

const searchByRoomNo$: RootEpic = (action$) => action$.pipe(
    filter(searchByRoomNoRequest.match),
    switchMap((action) => {
        const { hotelGuid, roomNo, roomType } = action.payload
        return InventoryApi.searchByRoomNo(hotelGuid, roomNo).pipe(
            map((res) => {
                const newMapListRoom: RoomMapRoomType[] = [];
                if (res && res.length > 0) {
                    res.forEach((item: RoomInfo) => {
                        const getRoomType = roomType.find((x: any) => x.guid === item.loai && x.ma !== "PM");
                        if (getRoomType) {
                            newMapListRoom.push({
                                hotelGuid: item.hotelGuid ?? "",
                                roomGuid: item.guid,
                                roomName: item.so ?? "",
                                roomType: item.loai ?? "",
                                roomTypeName: getRoomType?.ten ?? ""
                            })
                        }
                    })
                }

                return roomPlanSlice.actions.searchByRoomNoSuccess(newMapListRoom)
            }), catchError((err) => {
                console.log(err);
                return [roomPlanSlice.actions.message(err.message)]
            })
        )
    })
)
const fetchBeakShared$: RootEpic = (action$) => action$.pipe(
    filter(breakSharedRequest.match),
    switchMap((action) => {
        const { data, isValidated } = action.payload
        return functionPkmApi.breakShared(data, isValidated).pipe(
            mergeMap((res) => {
                return [updateQueryParamStatus(true), roomPlanSlice.actions.message(res)]
            }), catchError((err) => {
                console.log(err);
                openNotification(NotificationStatus.Error, err.message, "");
                return [roomPlanSlice.actions.message(err.message)]
            })
        )
    })
)
const unAssignRooom$: RootEpic = (action$) => action$.pipe(
    filter(unAssignRequest.match),
    switchMap((action) => {
        const { transactId } = action.payload;
        return functionPkmApi.unAssignRoom(transactId).pipe(
            map((res) => {
                return roomPlanSlice.actions.message(res.message)
            }), catchError((err) => {
                console.log(err);
                return [roomPlanSlice.actions.message(err.message)]
            })
        )
    })
)
const fetchListDmucColor$: RootEpic = (action$) => action$.pipe(
    filter(listDmucColorRequest.match),
    switchMap((action) => {
        return functionPkmApi.getDMucColorType().pipe(
            map((res) => {
                const newRes = res?.filter(x => x.code !== "" && x.colorName !== "");
                return roomPlanSlice.actions.setListDmucColor(newRes);
            }), catchError((err) => {
                console.log(err);
                return [roomPlanSlice.actions.message(err.message)]
            })
        )
    })
)
export const RoomPlanEpics = [
    searchByRoomNo$,
    fetchBeakShared$,
    unAssignRooom$,
    fetchListDmucColor$
]
export const {
    setListCardRoomPlan,
    setListGuestAndTsRoom,
    getListDataUnAssignRoom,
    searchByRoomNoRequest,
    breakSharedRequest,
    setListEmptyRooms,
    unAssignRequest,
    resetMessage,
    listDmucColorRequest,
    setListDmucColor,
    setQueryParamRoomPlan,
    setDateInputCheckIn,
    setAlertMessage,
    setResHeaderINV
} = roomPlanSlice.actions;
export const roomPlanReducer = roomPlanSlice.reducer