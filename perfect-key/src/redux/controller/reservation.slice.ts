import { IHcfgInfor, OjectFixCharge } from './../../common/model-hcfg';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import InventoryApi from "api/inv/inv.api";
import PkmApi from "api/pkm/pkm.api";
import ProfileApi from "api/profile/prf.api";
import { RootEpic } from "common/define-type";
import { ISearchResult, ITableFixCharge } from "common/model-booking";
import { NumberOfRooms } from "common/model-inventory";
import { CompanyProfile } from "common/model-profile";
import { DataFoextraCharge, SelectedBookingRoomType } from "common/model-rsvn";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import HotelConfigApi from 'api/hcfg/hcfg.api';
/* eslint-disable @typescript-eslint/no-explicit-any*/

export interface ReservatedRoomsEachRoomType {
    day: Date,
    roomTypesCount: any
}

interface MoreDetailInfos {
    khachNN: [],
    gioiTinh: [],
    plGiayTo: [],
    ngheNghiep: [],
    mucDichLuuTru: [],
    danToc: [],
    tonGiao: [],
    vietKieu: [],
    loaiThiThuc: [],
    noiCapTT: []
}

interface GuestDetailInfos {
    guestTitle: any[],
    guestType: any[],
    nationality: any[],
    languages: any[],
    sources: any[],
    entryPorts: any[]
}
interface dateRsvn {
    arrivalDate: Date,
    departureDate: Date,
    newNumberNight: number,
    defineNight: number
}
interface DetailFixCharge {
    index: number,
    kieuNgay: number,
    tuNgay: number,
    denNgay: number,
    soNgay: number
}
interface RsvnState {
    isEdit: boolean,
    loading: boolean,
    isSuccess: boolean,
    message: string | undefined,
    data: IHcfgInfor | any | null,
    filteredCompanyProfile: CompanyProfile[],
    reservatedRooms: ReservatedRoomsEachRoomType[],
    numberOfRooms: NumberOfRooms[],
    guestDetailOptions: GuestDetailInfos | null,
    guestMoreDetailInfos: MoreDetailInfos | null,
    getBookingByRsvnId: any | null,
    roomTypesidnCounts: SelectedBookingRoomType[],
    oldValueInput: any,
    noShowRSVN: ISearchResult[],
    accountNameFixCharge: string,
    dataSelectedFixcharge: ITableFixCharge[],
    dateRsvn: dateRsvn,
    totalFixCharge: number,
    dataFoextraCharge: DataFoextraCharge[],
    dataExtraChargeDetail: DetailFixCharge,
    typeSubMenu: string
}
const initState: RsvnState = {
    isEdit: false,
    loading: false,
    isSuccess: false,
    message: undefined,
    data: null,
    filteredCompanyProfile: [],
    reservatedRooms: [],
    numberOfRooms: [],
    guestDetailOptions: null,
    guestMoreDetailInfos: null,
    getBookingByRsvnId: null,
    roomTypesidnCounts: [],
    oldValueInput: null,
    noShowRSVN: [],
    accountNameFixCharge: "ACCOUNT NAME",
    dataSelectedFixcharge: [],
    dateRsvn: {
        arrivalDate: new Date(),
        departureDate: new Date(),
        newNumberNight: 1,
        defineNight: 1
    },
    totalFixCharge: 0,
    dataFoextraCharge: [],
    dataExtraChargeDetail: {
        index: 0,
        kieuNgay: 0,
        tuNgay: 0,
        denNgay: 0,
        soNgay: 0
    },
    typeSubMenu: ""
}
const rsvnSlice = createSlice({
    name: 'ratecode',
    initialState: initState,
    reducers: {
        getHcfgInfoRequest(state, action: PayloadAction<string>) {
            state.loading = true;
        },
        getHcfgInfoSuccess(state, action: PayloadAction<any | null>) {
            state.data = action.payload;
            state.loading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        message(state, action: PayloadAction<string>) {
            state.message = action.payload;
            state.loading = false;
        },
        setSelectedBookingRoomType(state, action: PayloadAction<SelectedBookingRoomType[]>) {
            state.roomTypesidnCounts = action.payload;
        },
        companyProfilesFilterByInputRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        companyProfilesFilterByInput(state, action: PayloadAction<any>) {
            state.filteredCompanyProfile = action.payload;
            state.loading = false;
        },
        fetchReservatedRooms(state, action: PayloadAction<any>) {
            //state.filteredCompanyProfile = action.payload
            state.loading = true;
        },
        fetchReservatedRoomsSuccess(state, action: PayloadAction<any>) {
            state.reservatedRooms = action.payload
            state.loading = false;
        },
        fetchNumberOfRooms(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        fetchNumberOfRoomsSuccess(state, action: PayloadAction<any>) {
            state.numberOfRooms = action.payload;
            state.loading = false;
        },
        getGuestDetailsOptionsRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        getGuestDetailsOptions(state, action: PayloadAction<any>) {
            state.guestDetailOptions = action.payload;
            state.loading = false;
        },
        getGuestMoreDetailsRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        getGuestMoreDetailsSuccess(state, action: PayloadAction<any>) {
            state.guestMoreDetailInfos = action.payload;
            state.loading = false;
        },
        getBookingByRsvnId(state, action: PayloadAction<any>) {
            state.isEdit = true
            state.getBookingByRsvnId = action.payload;
        },
        setOldMultipleValue(state, action: PayloadAction<any>) {
            state.oldValueInput = action.payload;
        },
        setNoShowRSVN(state, action: PayloadAction<ISearchResult[]>) {
            state.noShowRSVN = action.payload;
        },
        setAccountNameFixCharge(state, action: PayloadAction<any>) {
            const { accountName, dataSelectedFixcharge } = action.payload;
            state.accountNameFixCharge = accountName;
            state.dataSelectedFixcharge = dataSelectedFixcharge;
        },
        setDateRsvn(state, action: PayloadAction<dateRsvn>) {
            state.dateRsvn = action.payload;
        },
        setDataFoextraCharge(state, action: PayloadAction<OjectFixCharge>) {
            const { totalFixCharge, dataFoextraCharge } = action.payload;
            state.totalFixCharge = totalFixCharge;
            state.dataFoextraCharge = dataFoextraCharge;
        },
        setDataFoextraChargeDetail(state, action: PayloadAction<DetailFixCharge>) {
            state.dataExtraChargeDetail = action.payload;
        },
        setTypeSubMenu(state, action: PayloadAction<any>) {
            state.typeSubMenu = action.payload;
        }
    }
})
const getHcfgInfo$: RootEpic = (action$) => action$.pipe(
    filter(getHcfgInfoRequest.match),
    switchMap((action) => {
        return HotelConfigApi.getHcfgInfo(action.payload).pipe(
            map((res: any) => {
                return rsvnSlice.actions.getHcfgInfoSuccess(res);
            }
            ),
            catchError(err => [rsvnSlice.actions.message(err), rsvnSlice.actions.setLoading(false)])
        )
    }
    )
)

const getGuestDetailsOptions$: RootEpic = (action$) => action$.pipe(
    filter(getGuestDetailsOptionsRequest.match),
    switchMap((action) => {
        return ProfileApi.getGuestDetailInformationOptions(action.payload).pipe(
            map((res: any) => {
                return rsvnSlice.actions.getGuestDetailsOptions(res);
            }
            ),
            catchError(err => [rsvnSlice.actions.message(err)])
        )
    }
    )
)

const getGuestMoreDetailsInfors$: RootEpic = (action$) => action$.pipe(
    filter(getGuestMoreDetailsRequest.match),
    switchMap((action) => {
        return ProfileApi.getGuestMoreInforsOptions(action.payload).pipe(
            map((res: any) => {
                return rsvnSlice.actions.getGuestMoreDetailsSuccess(res);
            }
            ),
            catchError(err => [rsvnSlice.actions.message(err)])
        )
    }
    )
)

// Get fields in search filter profile
const companyProfilesFilterByInput$: RootEpic = (action$) => action$.pipe(
    filter(companyProfilesFilterByInputRequest.match),
    mergeMap((action) => {
        const { hotelGuid, input } = action.payload
        return ProfileApi.getCompanyProfileFilterByInput(hotelGuid, input).pipe(
            map((res) => {
                return rsvnSlice.actions.companyProfilesFilterByInput(res)
            }), catchError((err) => {
                return [rsvnSlice.actions.message(err.message)]
            })
        )
    })
)

const fetchReservatedRooms$: RootEpic = (action$) => action$.pipe(
    filter(fetchReservatedRooms.match),
    switchMap((action) => {
        const listRoomType = action.payload.roomTypes;
        //const newListRoomType:string[] = []
        const { arivalDay, depatureDay } = action.payload;
        // listRoomType.forEach((element: any) => {
        //     newListRoomType.push(element)
        // });
        const roomtypeIds = JSON.stringify(listRoomType).slice(1, -1)
        return PkmApi.getReservatedRooms(
            {
                //hard code
                roomtypeIds: roomtypeIds,
                arivalDay: arivalDay.toISOString().slice(0, 10),
                depatureDay: depatureDay.toISOString().slice(0, 10)
            }
        ).pipe(
            mergeMap((res) => {
                return [
                    rsvnSlice.actions.fetchReservatedRoomsSuccess(res),
                ]
            }), catchError(err => {
                return [rsvnSlice.actions.setLoading(false)]
            })
        )
    })
)

// Get number of rooms in each roomtypes.
const fetchNumberOfRoomsInEachRoomTypes$: RootEpic = (action$) => action$.pipe(
    filter(fetchNumberOfRooms.match),
    switchMap((action) => {
        const { hotelGuid } = action.payload
        return InventoryApi.getNumberOfRoomsInEachRoomTypes(hotelGuid).pipe(
            map((res) => {
                return rsvnSlice.actions.fetchNumberOfRoomsSuccess(res)
            }), catchError((err) => {
                console.log(err);
                return [rsvnSlice.actions.message(err.message)]
            })
        )
    })
)

//Add Guest Details Information--------------

//Add Guest Details Information END-------------

export const ReservationEpics = [
    getHcfgInfo$,
    companyProfilesFilterByInput$,
    fetchReservatedRooms$,
    fetchNumberOfRoomsInEachRoomTypes$,
    getGuestDetailsOptions$,
    getGuestMoreDetailsInfors$
]
export const {
    getHcfgInfoRequest,
    companyProfilesFilterByInputRequest,
    fetchReservatedRooms,
    fetchNumberOfRooms,
    fetchNumberOfRoomsSuccess,
    getGuestDetailsOptionsRequest,
    getGuestMoreDetailsRequest,
    getBookingByRsvnId,
    setSelectedBookingRoomType,
    setOldMultipleValue,
    setNoShowRSVN,
    setAccountNameFixCharge,
    setDateRsvn,
    setDataFoextraCharge,
    setDataFoextraChargeDetail,
    setTypeSubMenu,
    companyProfilesFilterByInput
} = rsvnSlice.actions
export const rsvnReducer = rsvnSlice.reducer