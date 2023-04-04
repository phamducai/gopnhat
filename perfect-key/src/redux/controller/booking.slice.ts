
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import PkmApi from "api/pkm/pkm.api";
import functionPkmApi from "api/pkm/function.api";
import { RootEpic } from "common/define-type";
import {
    dataFOReservation,
    IQueryParam,
    ISearchRequest,
} from "common/define-booking";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
import Utils from "common/utils";
import ProfileApi from "api/profile/prf.api";
import { addDays } from "date-fns";
import { ResGuestProfilesSearch } from "common/define-api-booking";
import GLobalPkm from "common/global";
import { Observable } from "rxjs";
import { GuestProfile } from "common/model-profile";
import GUEST_PROFILE_DEFAULT_VALUE from "common/const/guestProfileDefaultValue";
import { IDataSearchMessage, ITracerMessage, NewReservationData, ReservationData } from "common/model-rsvn";
import rSVN_DEFAULT_DATA from "common/const/newRSVNDefaultValue";
import { cloneDeep } from "lodash";
import { ISearchResult } from "common/model-booking";
import InventoryApi from "api/inv/inv.api";
import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";
import { NumberOfRooms } from "common/model-inventory";
interface ITitleDataSearchResults {
    fullName: string;
    room: string;
    rate: string;
    roomType: string;
    code: string;
    arrival: string;
    departure: string;
    groupCode: string;
    rsvnNo: string;
    status: string;
    comments: string;
}

export interface IFormSearch {
    pageNumber?: number,
    pageSize?: number,
    isOnlyMainGuest: boolean,
    hotelGuid: string,
    rsvnId?: string | number,
    rsvnNo?: string | number,
    rsvnCode: string,
    room?: string,
    status: number,
    profileIds: any[],
    companyAgentGuid: string,
    roomType: string,
    arrivalDates: any[],
    departureDates: any[],
    groupCode: string
}
export interface IPagination {
    CurrentPage: number,
    PageSize: number,
    TotalCount: number,
    TotalPages: number,
    HasNext: boolean,
    HasPrevious: boolean
}

interface groupStatusRSVN {
    transactRoomId: string,
    status: number,
    totalRooms: number,
}

interface BookingState {
    loading: boolean,
    loadingSearch: boolean,
    loadingAcive: boolean,
    loadingTable: boolean,
    loadingSearchProfile: boolean,
    isLoadingAll: boolean,
    isShowStat: boolean,
    changeStatusProfiles: boolean
    rsvn: dataFOReservation[],
    queryParam: IQueryParam[],
    formSearch: IFormSearch,
    messErr: string,
    roomType: any[],
    roomTypePm: any,
    room: any[],
    listGuestProfiles: GuestProfile[],
    dataSearchResults: any[],
    dataSearchTracerMessage: ITracerMessage[],
    dataSearchMessage: IDataSearchMessage[]
    reservatedRooms: any[],
    titleDataSearchResults: ITitleDataSearchResults,
    companyAgent: any,
    selectedProfile: GuestProfile[],
    guestProfile: GuestProfile,
    allMainGuest: GuestProfile[],
    allQueryParam: IQueryParam[],
    reservationData: NewReservationData,
    reservationDataById: any
    inforPage: IPagination,
    selectedSearchResults: any[],
    listRoomingFromFile: any[],
    formSearchQuery: any,
    groupStatusRSVN: groupStatusRSVN;
    resetCheckBoxSearchResultTalble: boolean,
    initDragListener: boolean
}

const initBookingState: BookingState = {
    loading: false,
    loadingSearch: false,
    loadingTable: false,
    loadingAcive: false,
    loadingSearchProfile: false,
    isLoadingAll: false,
    isShowStat: false,
    messErr: "",
    rsvn: [],
    queryParam: [],
    formSearch: {
        pageNumber: 1,
        pageSize: 20,
        isOnlyMainGuest: false,
        hotelGuid: '',
        rsvnCode: '',
        status: 0,
        profileIds: [],
        companyAgentGuid: '',
        roomType: '',
        arrivalDates: [],
        departureDates: [],
        groupCode: ''
    },
    roomType: [],
    roomTypePm: '',
    room: [],
    changeStatusProfiles: false,
    listGuestProfiles: [],
    dataSearchResults: [],
    dataSearchTracerMessage: [],
    dataSearchMessage: [],
    reservatedRooms: [],
    titleDataSearchResults: {
        fullName: "Full name",
        room: "Room",
        rate: "Rate",
        roomType: "Room type",
        code: "Code",
        arrival: "Arrival",
        departure: "Departure",
        groupCode: "Group code",
        rsvnNo: "RSVN No.",
        status: 'Status',
        comments: 'Comments'
    },
    companyAgent: [],
    selectedProfile: [],
    guestProfile: { ...GUEST_PROFILE_DEFAULT_VALUE },
    allMainGuest: [],
    allQueryParam: [],
    reservationData: cloneDeep(rSVN_DEFAULT_DATA),
    inforPage: {
        CurrentPage: 1,
        PageSize: 20,
        TotalCount: 1,
        TotalPages: 1,
        HasNext: false,
        HasPrevious: false
    },
    selectedSearchResults: [],
    formSearchQuery: null,
    groupStatusRSVN: {
        transactRoomId: '',
        status: -1,
        totalRooms: -1,
    },
    resetCheckBoxSearchResultTalble: false,
    initDragListener: false,
    listRoomingFromFile: [],
    reservationDataById: {}
}

const bookingSlice = createSlice({
    name: 'booking',
    initialState: initBookingState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
            state.loadingTable = action.payload;
            state.loadingSearchProfile = action.payload;
            state.loadingSearch = action.payload
        },
        setLoadingSearch(state, action: PayloadAction<boolean>) {
            state.loadingSearch = action.payload
        },
        setMessage(state, action: PayloadAction<string>) {
            state.messErr = action.payload
        },
        getReservation(state, action: PayloadAction<string>) {
            state.loading = true
        },
        getReservationSuccess(state, action: PayloadAction<dataFOReservation[]>) {
            state.rsvn = action.payload;
        },
        getReservationById(state, action: PayloadAction<string>) {
            state.loading = true
        },
        getReservationByIdSuccess(state, action: PayloadAction<ReservationData>) {
            state.reservationDataById = action.payload;
        },
        fetchRoom(state, action: PayloadAction<string>) {
            //don't handle
        },
        fetchQueryParam(state, action: PayloadAction<any>) {
            //don't handle
        },
        fetchQueryParamSuccess(state, action: PayloadAction<any>) {
            state.loading = false
            state.queryParam = action.payload
        },
        setRoom(state, action: PayloadAction<any>) {
            //state.loadingTable = true
            state.room = action.payload.room
        },
        setRoomType(state, action: PayloadAction<any>) {
            // *
            state.loading = false
            state.loadingTable = false;
            state.roomType = action.payload.rooomType
        },
        setRoomTypePm(state, action: PayloadAction<any>) {
            state.roomTypePm = action.payload;
            state.loading = false;
        },
        fetchReservatedRooms(state, action: PayloadAction<any>) {
            state.loadingTable = true
            //don't handle
        },
        fetchReservatedRoomsSuccess(state, action: PayloadAction<any>) {
            state.loadingTable = false;
            state.loading = false;
            const newRSVN: any = []
            action.payload.forEach((element: any) => {
                const sortRSVN = Object.keys(element.roomTypesCount)
                    .sort().reduce(
                        (obj: any, key) => {
                            obj[key] = element.roomTypesCount[key];
                            return obj;
                        }, {}
                    );
                newRSVN.push({ ...element, roomTypesCount: sortRSVN })
            });
            state.reservatedRooms = newRSVN
        },
        searchRequest(state, action: PayloadAction<ISearchRequest>) {
            state.loadingSearch = true
            // state.changeStatusProfiles = false
            //state.formSearch = action.payload?.formSearch
        },
        setFormSearch(state, action: PayloadAction<IFormSearch>) {
            state.formSearch = action.payload;
        },
        searchWithQueryParam(state, action: PayloadAction<any>) {
            // state.changeStatusProfiles = false
            state.loadingSearch = true
        },
        setQueryParam(state, action: PayloadAction<any>) {
            state.queryParam = action.payload.queryParam
        },
        updateQueryParamStatus(state, action: PayloadAction<any>) {
            state.changeStatusProfiles = action.payload;
            state.loading = false
        },
        setInfoPage(state, action: PayloadAction<any>) {
            state.inforPage = action.payload;
        },
        searchSuccess(state, action: PayloadAction<any>) {
            state.listGuestProfiles = action.payload.listGuestProfiles
            state.dataSearchResults = action.payload.dataSearchResults
            state.loadingSearch = false
            state.changeStatusProfiles = false
            state.loading = false
        },
        selectProfile(state, action: PayloadAction<any>) {
            state.selectedProfile = action.payload;
        },
        searchProfileIdsRequest(state, action: PayloadAction<any>) {
            state.loadingSearchProfile = true
        },
        guestProfileInBookingRSVN(state, action: PayloadAction<GuestProfile>) {
            state.guestProfile = action.payload;
        },
        searchProfileIdsSuccess(state, action: PayloadAction<any>) {
            state.loadingSearchProfile = false;
            state.loading = false
            state.companyAgent = action.payload
        },
        searchProfileIdsFailed(state, action: PayloadAction<any>) {
            state.loadingSearchProfile = false
            state.companyAgent = []
        },
        getAllGuestAndQueryRequest(state, action: PayloadAction<any>) {
            state.isLoadingAll = true;
        },
        getAllGuestProfileMain(state, action: PayloadAction<any>) {
            state.isLoadingAll = true;
        },
        setAllMainGuest(state, action: PayloadAction<any>) {
            state.allMainGuest = action.payload
        },
        setAllQueryParm(state, action: PayloadAction<any>) {
            state.allQueryParam = action.payload
        },
        updateCombineGuestRequest(state, action: PayloadAction<any>) {
            state.changeStatusProfiles = true;
        },
        getGuestProfilesRsvnData(state, action: PayloadAction<any>) {
            state.isLoadingAll = true;
            state.loading = false
        },
        getGuestProfilesRsvnDataSuccess(state, action: PayloadAction<any>) {
            state.isLoadingAll = false;
            state.loading = false
            state.reservationData = action.payload
        },
        addPmRequest(state, action: PayloadAction<any>) {
            state.changeStatusProfiles = true;
        },
        cancelPmRequest(state, action: PayloadAction<any>) {
            state.changeStatusProfiles = true;
        },
        addGroupMasterRequest(state, action: PayloadAction<any>) {
            const { checkedComment } = action.payload
            state.changeStatusProfiles = !checkedComment;
        },
        unsetGroupMasterRequest(state, action: PayloadAction<any>) {
            state.loadingSearch = true;
        },
        addSharedGuestRequest(state, action: PayloadAction<any>) {
            state.changeStatusProfiles = true;
        },
        addCommentTrRoomRequest(state, action: PayloadAction<any>) {
            state.changeStatusProfiles = true;
        },

        setSelectedSearchResults(state, action: PayloadAction<any>) {
            state.selectedSearchResults = action.payload;
        },

        setFormSearchQuery(state, action: PayloadAction<any>) {
            state.formSearchQuery = action.payload;
        },

        setStatusGroupRSVN(state, action: PayloadAction<any>) {
            state.groupStatusRSVN = action.payload;
        },
        updateResetCheckBoxSearchResultTalble(state, action: PayloadAction<boolean>) {
            state.resetCheckBoxSearchResultTalble = action.payload;
        },

        updateInitDragListener(state, action: PayloadAction<boolean>) {
            state.initDragListener = action.payload
        },

        readExcelRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },

        setDataRoomingList(state, action: PayloadAction<any>) {
            state.listRoomingFromFile = action.payload;
            state.loading = false;
        },
        setShowStat(state, action: PayloadAction<boolean>) {
            state.isShowStat = action.payload;
        },
        setRoomTypeLoadPage(state, action: PayloadAction<any>) {
            //state.roomType = action.payload;
        },
        searchTracerMessageReq(state, action: PayloadAction<ITracerMessage[]>) {
            state.dataSearchTracerMessage = action.payload
        },
        searchMessageReq(state, action: PayloadAction<IDataSearchMessage[]>) {
            state.dataSearchMessage = action.payload
        }
    }
})

const fetchRoomTypeLoadPage$: RootEpic = (action$) =>
    action$.pipe(
        filter(setRoomTypeLoadPage.match),
        switchMap((action) => {
            const { hotelGuid } = action.payload;
            return InventoryApi.invRoomtype(hotelGuid).pipe(
                mergeMap((res: any) => {
                    return [
                        bookingSlice.actions.setRoomType({
                            rooomType: res.filter((e: any) => e.ma !== "PM"),
                        })
                    ];
                }),
                catchError((err) => {
                    return [
                        bookingSlice.actions.setLoading(false),
                        bookingSlice.actions.setMessage(err.message),
                    ];
                })
            );
        })
    );
const getReservation$: RootEpic = (action$) =>
    action$.pipe(
        filter(getReservation.match),
        //hien tai chua can get rsvn
        // switchMap((action) => {
        //     return PkmApi.getReservation().pipe(
        //         //eslint-disable-next-line
        //         mergeMap((res: any) => {
        //             return [
        //                 bookingSlice.actions.getReservationSuccess(res),
        //                 bookingSlice.actions.fetchRoom(action?.payload),
        //             ]
        //         }),
        //         catchError(err => [bookingSlice.actions.setLoading(false), bookingSlice.actions.setMessage(err.message)])
        //     )
        // })
        map((action) => bookingSlice.actions.fetchRoom(action?.payload)))
    ;
const getReservationById$: RootEpic = (action$) =>
    action$.pipe(
        filter(getReservationById.match),
        switchMap((action) => {
            return PkmApi.getReservationById(action.payload).pipe(
                map((res: any) => {
                    return bookingSlice.actions.getReservationByIdSuccess(res)
                }),
                catchError(err => [bookingSlice.actions.setLoading(false), bookingSlice.actions.setMessage(err.message)])
            )
        })
    );

const fetchRoom$: RootEpic = (action$) =>
    action$.pipe(
        filter(fetchRoom.match),
        switchMap((action) => {
            return InventoryApi.getNumberOfRoomsInEachRoomTypes(action.payload).pipe(
                map((res) => {
                    return bookingSlice.actions.setRoom({
                        room: res,
                        hotelGuid: action?.payload,
                    });
                }),
                catchError((err) => {
                    return [
                        bookingSlice.actions.setLoading(false),
                        bookingSlice.actions.setMessage(err.message),
                    ];
                })
            );
        })
    );

const fetchRoomType$: RootEpic = (action$) =>
    action$.pipe(
        filter(setRoom.match),
        switchMap((action) => {
            const { room, hotelGuid } = action.payload;
            return InventoryApi.invRoomtype(hotelGuid).pipe(
                mergeMap((res: any) => {
                    const newRoomType: any = [];

                    res.forEach((rooomTypeItems: any) => {
                        const newRoom = room.find(
                            (roomItems: any) => roomItems.id === rooomTypeItems.guid
                        );
                        newRoomType.push({ ...rooomTypeItems, countRoom: newRoom.count });
                    });
                    return [
                        bookingSlice.actions.setRoomType({
                            rooomType: newRoomType.filter((e: any) => e.ma !== "PM"),
                        }),
                        bookingSlice.actions.setRoomTypePm(
                            newRoomType.filter((e: any) => e.ma === "PM")
                        ),
                        // bookingSlice.actions.fetchQueryParam({ hotelGuid: hotelGuid, roomType: newRoomType }),
                        // bookingSlice.actions.fetchReservatedRooms({
                        //     rooomType: newRoomType.filter((e: any) => e.ma !== "PM"),
                        // }),
                    ];
                }),
                catchError((err) => {
                    return [
                        bookingSlice.actions.setLoading(false),
                        bookingSlice.actions.setMessage(err.message),
                    ];
                })
            );
        })
    );

const fetchReservatedRooms$: RootEpic = (action$) =>
    action$.pipe(
        filter(fetchReservatedRooms.match),
        switchMap((action) => {
            const defaultArivalDay = Utils.formatDateCallApi(new Date());
            const defaultDepatureDay = Utils.formatDateCallApi(
                addDays(new Date(), 6)
            );
            const {
                numberOfRooms,
                arivalDay = defaultArivalDay,
                depatureDay = defaultDepatureDay,
            } = action.payload;
            const newListRoomType: string[] = [];
            numberOfRooms?.forEach((element: NumberOfRooms) => {
                newListRoomType.push(element.id);
            });
            const rooomType: any[] = numberOfRooms.map((x: NumberOfRooms) => {
                return {
                    guid: x.id,
                    parentGuid: "",
                    ma: "",
                    ten: x.name,
                    ghiChu: "",
                    donGia: 0,
                    hotelGuid: "",
                    statusRec: 0,
                    countRoom: x.count
                }
            });
            
            const roomtypeIds = JSON.stringify(newListRoomType).slice(1, -1);
            return PkmApi.getReservatedRoomsCustom({
                //hard code
                roomtypeIds,
                arivalDay: arivalDay,
                depatureDay: depatureDay,
            }).pipe(
                map((res: any) => {
                    const newRes: any = [];
                    const resDataAssign = Array.from(res.roomCountsByDays);
                    // const itemRoomTypeCount: any = []
                    resDataAssign.forEach((items: any) => {
                        const newRoomTypesCount: any = Object.assign({}, items);
                        // for (const [key] of Object.entries(items.roomTypesCount)) {
                        //     if (items.roomTypesCount[key].length > 1) {
                        //         // eslint-disable-next-line no-loop-func
                        //         items.roomTypesCount[key].forEach((item: any) => {
                        //             if (item.parentMeGuid === null && item.rate !== 0) {
                        //                 itemRoomTypeCount.push(item)
                        //             }
                        //         })
                        //         items.roomTypesCount[key] = itemRoomTypeCount
                        //     }
                        //     itemRoomTypeCount = []
                        // }
                        if (Object.entries(items.roomTypesCount).length <= 0) {
                            rooomType.forEach((itemsRoomType: any) => {
                                newRoomTypesCount.roomTypesCount[itemsRoomType.guid] = {
                                    ...itemsRoomType,
                                    transactRooms: [],
                                };
                            });
                        } else {
                            for (const [key, value] of Object.entries(items.roomTypesCount)) {
                                rooomType.forEach((itemsRoomType: any) => {
                                    if (key === itemsRoomType.guid) {
                                        newRoomTypesCount.roomTypesCount[key] = {
                                            ...itemsRoomType,
                                            transactRooms: value,
                                        };
                                    } else {
                                        if (!newRoomTypesCount.roomTypesCount[itemsRoomType.guid]) {
                                            newRoomTypesCount.roomTypesCount[itemsRoomType.guid] = {
                                                ...itemsRoomType,
                                                transactRooms: [],
                                            };
                                        } else if (!newRoomTypesCount.roomTypesCount[itemsRoomType.guid].transactRooms || newRoomTypesCount.roomTypesCount[itemsRoomType.guid].transactRooms === []) {
                                            newRoomTypesCount.roomTypesCount[itemsRoomType.guid] = {
                                                ...itemsRoomType,
                                                transactRooms: [],
                                            };
                                        }
                                    }
                                });
                            }
                        }
                        newRes.push(newRoomTypesCount);
                    });
                    return bookingSlice.actions.fetchReservatedRoomsSuccess(newRes);
                }),
                catchError((err) => {
                    return [
                        bookingSlice.actions.setLoading(false),
                        bookingSlice.actions.setMessage(err.message),
                    ];
                })
            );
        }), catchError((err) => {
            return [
                bookingSlice.actions.setLoading(false),
                bookingSlice.actions.setMessage(err.message),
            ];
        })
    );

const fetchQueryParam$: RootEpic = (action$) =>
    action$.pipe(
        filter(fetchQueryParam.match),
        switchMap((action) => {
            const { hotelGuid } = action.payload;
            return PkmApi.rsvnQueryParam({
                hotelGuid: hotelGuid,
                rsvnCode: "ZNWPLWKMPT",
                status: 0,
                profileIds: [],
                companyAgentGuid: GLobalPkm.defaultBytes32,
                roomType: GLobalPkm.defaultBytes32,
                arrivalDates: [],
                departureDates: [],
            }).pipe(
                map((res) => {
                    return bookingSlice.actions.fetchQueryParamSuccess(res);
                }),
                catchError((err) => {
                    return [
                        bookingSlice.actions.setLoading(false),
                        bookingSlice.actions.setMessage(err.message),
                    ];
                })
            );
        })
    );

//Search Criteria

const searchCompanyProfile$: RootEpic = (action$) =>
    action$.pipe(
        filter(searchProfileIdsRequest.match),
        switchMap((action) => {
            const { input, hotelGuid } = action.payload;
            return ProfileApi.getCompanyProfileFilterByInput(hotelGuid, input).pipe(
                map((res: any) => {
                    return bookingSlice.actions.searchProfileIdsSuccess(res);
                }),
                catchError((err) => {
                    return [
                        bookingSlice.actions.searchProfileIdsFailed(false),
                        bookingSlice.actions.setMessage(err.message),
                        bookingSlice.actions.setLoading(false)
                    ];
                })
            );
        })
    );

const searchProfileIds$: RootEpic = (action$) =>
    action$.pipe(
        filter(searchRequest.match),
        switchMap((action) => {
            const { hotelGuid, profiles } = action.payload;
            const data = {
                hotelGuid: hotelGuid,
                ...profiles,
            };
            return ProfileApi.getGuestProfilesSearch(data).pipe(
                map((res: any) => {
                    const profileIds = res.map(
                        (profiles: ResGuestProfilesSearch) => profiles.guid
                    );
                    if (res.length > 0) {
                        return bookingSlice.actions.searchWithQueryParam({
                            ...action.payload,
                            profileIds: profileIds,
                        });
                    } else {
                        return bookingSlice.actions.searchSuccess({
                            listGuestProfiles: [],
                            dataSearchResults: [],
                        });
                    }
                }),
                catchError((err) => {
                    return [bookingSlice.actions.setMessage(err.message), bookingSlice.actions.setLoading(false), bookingSlice.actions.setLoadingSearch(false)]
                })
            );
        })
    );

const searchCriteria$: RootEpic = (action$) =>
    action$.pipe(
        filter(searchWithQueryParam.match),
        switchMap((action) => {
            const { hotelGuid, arrivalDates, departureDates, listRoomType, profileIds, companyAgentGuid, status, rsvnNo, isOnlyMainGuest, roomType, availableDate, room, groupCode, pageNumber, pageSize, rsvnId } = action.payload;
            const formSearch: IFormSearch = {
                pageNumber: pageNumber !== 0 ? pageNumber : 1,
                pageSize: pageSize !== 0 ? pageSize : 10,
                hotelGuid,
                isOnlyMainGuest: isOnlyMainGuest ?? false,
                rsvnNo: parseInt(rsvnNo || "0"),
                rsvnCode: '',
                room: room,
                rsvnId: rsvnId ?? GLobalPkm.defaultBytes32,
                status: status ?? 5,
                profileIds: profileIds ?? '',
                companyAgentGuid: companyAgentGuid ?? GLobalPkm.defaultBytes32,
                roomType: roomType ?? GLobalPkm.defaultBytes32,
                groupCode: groupCode,
                arrivalDates: arrivalDates ?? [],
                departureDates: departureDates ?? [],
            }
            const newFormSearch = availableDate ? { ...formSearch, availableDate: availableDate } : formSearch
            return PkmApi.rsvnQueryParam(newFormSearch, true).pipe(
                mergeMap((res) => {
                    const resPage = res.xhr.getResponseHeader("x-pagination");
                    return [
                        bookingSlice.actions.setQueryParam({ queryParam: res.response, roomType: listRoomType }),
                        bookingSlice.actions.setFormSearch(newFormSearch),
                        bookingSlice.actions.setInfoPage(JSON.parse(resPage))
                    ]
                }), catchError((err) => {
                    return [bookingSlice.actions.setLoadingSearch(false), bookingSlice.actions.setLoading(false), bookingSlice.actions.setMessage(err.message)]
                })
            )
        })
    );

const selectProfile$: RootEpic = (action$) =>
    action$.pipe(
        filter(selectProfile.match),
        switchMap((action) => {
            //const { hotelGuid, input } = action.payload
            bookingSlice.actions.selectProfile(action.payload);
            const t = new Observable<any>();
            return t;
        })
    );

const guestProfileInBookingRSVN$: RootEpic = (action$) =>
    action$.pipe(
        filter(guestProfileInBookingRSVN.match),
        switchMap((action) => {
            //const { hotelGuid, input } = action.payload
            bookingSlice.actions.guestProfileInBookingRSVN(action.payload);
            const t = new Observable<any>();
            return t;
        })
    );

const guestProfiles$: RootEpic = (action$) =>
    action$.pipe(
        filter(setQueryParam.match),
        switchMap((action) => {
            const { queryParam, roomType } = action.payload
            const listGuestId: string[] = []
            queryParam.forEach((element: IQueryParam) => {
                listGuestId.push(element.guestId)
            });
            const newListRoomType = JSON.stringify(listGuestId).slice(1, -1)
            return ProfileApi.getGuestProfiles({ 'guids': newListRoomType }).pipe(
                mergeMap((res: any) => {
                    const newData: ISearchResult[] = []
                    queryParam.forEach((element: any) => {
                        const findData = res.filter((item: any) => {
                            return element?.guestId === item?.guid
                        })
                        const getNameByID = (id: string) => {
                            const nameRoomType = roomType.find((items: NumberOfRooms) => items.id === id);
                            return nameRoomType.name ?? ""
                        }
                        // const getRoomByID = (id: string) => {
                        //     const nameRoomType = (roomType.filter((items: any) => items.guid === id))[0]
                        //     return nameRoomType?.ma
                        // }
                        const getStatus = (status: string | number) => {
                            switch (status) {
                            case 0:
                                return status = "Reservation"
                            case 1:
                                return status = "CheckIn"
                            case 2:
                                return status = "CheckOut"
                            case 3:
                                return status = "Cancelled"
                            case 4:
                                return status = "NoShow"
                            case 5:
                                return status = "WaitingList"
                            default:
                                break;
                            }
                            return "";
                        }
                        //convert data                                            
                        newData.push({
                            guestId: element?.guestId,
                            parentMeGuid: element?.parentMeGuid === null ? 0 : element?.parentMeGuid,
                            fullName: { name: findData.length > 0 ? ((findData[0]?.firstName ? findData[0]?.firstName : "") + " " + (findData[0]?.guestName ? findData[0]?.guestName : "")) : "", id: "" },
                            room: { name: element?.transactRoomsGroup?.roomName, id: element?.transactRoomsGroup?.mappingRoomId },
                            rate: { name: (element?.rate)?.toString(), id: element?.rate },
                            roomType: { name: getNameByID(element?.roomType), id: element?.roomType },
                            code: { name: element?.dataForeservation?.reservCode, id: "" },
                            arrival: { name: Utils.formatDateString(element?.arrivalDate), id: element?.arrivalDate },
                            departure: { name: Utils.formatDateString(element?.departureDate), id: element?.departureDate },
                            groupCode: { name: element?.dataForeservation?.groupCode, id: element?.dataForeservation?.groupCode },
                            rsvnNo: { name: element?.dataForeservation.id, id: element?.dataForeservation.id },
                            status: { name: getStatus(element?.status), id: element?.status },
                            comments: { name: element?.comments, id: element?.comments },
                            guid: element?.guid,
                            parentGuid: element?.parentGuid
                        })
                    });
                    return [
                        bookingSlice.actions.searchSuccess({ listGuestProfiles: res, dataSearchResults: newData }),
                        bookingSlice.actions.updateResetCheckBoxSearchResultTalble(true)
                    ]
                }),
                catchError((err) => {
                    console.log(err);
                    return [bookingSlice.actions.setLoadingSearch(false), bookingSlice.actions.setLoading(false), bookingSlice.actions.setMessage(err.message)]
                })
            )
        })
    )
const getAllMainGuest$: RootEpic = (action$) =>
    action$.pipe(
        filter(getAllGuestProfileMain.match),
        switchMap((action) => {
            const allQueryParam = action.payload;
            const listRoomType: string[] = [];
            allQueryParam.forEach((element: IQueryParam) => {
                listRoomType.push(element.guestId);
            });
            const newListRoomType = JSON.stringify(listRoomType).slice(1, -1);
            return ProfileApi.getGuestProfiles({ guids: newListRoomType }).pipe(
                map((res: any) => {
                    return bookingSlice.actions.setAllMainGuest(res);
                }),
                catchError((err) => [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)])
            );
        })
    );
const getAllQueryParm$: RootEpic = (action$) =>
    action$.pipe(
        filter(getAllGuestAndQueryRequest.match),
        switchMap((action) => {
            const { hotelGuid, arrivalDates, departureDates } = action.payload;
            const formSearch: IFormSearch = {
                pageNumber: 1,
                pageSize: 50,
                hotelGuid,
                isOnlyMainGuest: true,
                rsvnCode: '',
                status: 5,
                profileIds: [],
                companyAgentGuid: GLobalPkm.defaultBytes32,
                roomType: GLobalPkm.defaultBytes32,
                groupCode: '',
                arrivalDates: arrivalDates ?? [],
                departureDates: departureDates ?? [],
            }
            return PkmApi.rsvnQueryParam(formSearch).pipe(
                mergeMap((res: any) => {
                    return [bookingSlice.actions.setAllQueryParm(res), bookingSlice.actions.getAllGuestProfileMain(res)]
                }
                ),
                catchError(err => [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)])
            )
        }
        )
    )
const fetchUpdateCombineGuest$: RootEpic = (action$) => action$.pipe(
    filter(updateCombineGuestRequest.match),
    switchMap((action) => {
        return functionPkmApi.CombineGuestTransctRoom(action.payload).pipe(
            map((res: any) => {
                openNotification(NotificationStatus.Success, "Successfully", "");
                return bookingSlice.actions.updateQueryParamStatus(false)
            }),
            catchError(err => {
                openNotification(NotificationStatus.Warning, "This guest is not master", "");
                return [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)]
            })
        )
    }
    )
)

const getGuestProfilesRsvnData$: RootEpic = (action$) =>
    action$.pipe(
        filter(getGuestProfilesRsvnData.match),
        switchMap((action) => {
            return functionPkmApi.getGuestProfilesRsvnData(action.payload).pipe(
                map((res: any) => {
                    return bookingSlice.actions.getGuestProfilesRsvnDataSuccess(res)
                }),
                catchError(err => [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)])
            )
        }
        )
    )
const fetchAddPmToGroup$: RootEpic = (action$) => action$.pipe(
    filter(addPmRequest.match),
    switchMap((action) => {
        const { rSVNId, data, pmRoomId, isCreateGrm } = action.payload;
        return functionPkmApi.addPmToGroup(rSVNId, data, pmRoomId, isCreateGrm).pipe(
            map((res: any) => {
                openNotification(NotificationStatus.Success, "Successfully", `This PM room has been added to room ${res.data.roomName}`);
                return bookingSlice.actions.updateQueryParamStatus(true)
            }),
            catchError(err => {
                openNotification(NotificationStatus.Warning, "This room has been added PM", "")
                return [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)]
            })
        )
    }
    )
)
const fetchCancelPm$: RootEpic = (action$) => action$.pipe(
    filter(cancelPmRequest.match),
    switchMap((action) => {
        const { roomTypeId, rSVNId } = action.payload
        return functionPkmApi.cancelPmToGroup(roomTypeId, rSVNId).pipe(
            map((res: any) => {
                openNotification(NotificationStatus.Success, "Successfully", "");
                return bookingSlice.actions.updateQueryParamStatus(false)
            }),
            catchError(err => {
                openNotification(NotificationStatus.Error, err.message, "", err.status);
                return [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)]
            })
        )
    }
    )
)
const fetchAppGroupMaster$: RootEpic = (action$) => action$.pipe(
    filter(addGroupMasterRequest.match),
    mergeMap((action) => {
        const { rSVNId, trRoomId, checkedComment, comment } = action.payload;
        return functionPkmApi.addGroupMaster(rSVNId, trRoomId).pipe(
            map((res: any) => {
                openNotification(NotificationStatus.Success, "Successfully", "");
                if (checkedComment) {
                    return bookingSlice.actions.addCommentTrRoomRequest({
                        trRoomId,
                        comment
                    })
                } else {
                    return bookingSlice.actions.updateQueryParamStatus(false)
                }
            }),
            catchError(err => {
                openNotification(NotificationStatus.Error, err.message, "", err.status);
                return [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)]
            })
        )
    }
    )
)
const fetchUnserGroupMaster$: RootEpic = (action$) => action$.pipe(
    filter(unsetGroupMasterRequest.match),
    mergeMap((action) => {
        const { rSVNId, trRoomId, comment } = action.payload
        return functionPkmApi.unsetGroupMaster(rSVNId, trRoomId).pipe(
            map((res: any) => {
                openNotification(NotificationStatus.Success, "Successfully", "");
                return bookingSlice.actions.addCommentTrRoomRequest({ trRoomId, comment })
            }),
            catchError(err => {
                openNotification(NotificationStatus.Error, err.message, "", err.status);
                return [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)]
            })
        )
    })
)
const fetchAddCommentTrRoom$: RootEpic = (action$) => action$.pipe(
    filter(addCommentTrRoomRequest.match),
    mergeMap((action) => {
        const { trRoomId, comment } = action.payload;
        return functionPkmApi.addCommentTransactionRoom(trRoomId, comment).pipe(
            map((res: any) => {
                return bookingSlice.actions.updateQueryParamStatus(false)
            }),
            catchError(err => [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)])
        )
    }
    )
)

const fetchAddSharedGuest$: RootEpic = (action$) => action$.pipe(
    filter(addSharedGuestRequest.match),
    switchMap((action) => {
        return functionPkmApi.addSharedGuest(action.payload).pipe(
            map((res: any) => {
                openNotification(NotificationStatus.Success, "Successfully", "");
                return bookingSlice.actions.updateQueryParamStatus(false)
            }),
            catchError(err => {
                openNotification(NotificationStatus.Error, err.message, "", err.status);
                return [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)]
            })
        )
    }
    )
)

const setStatusGroupRSVN$: RootEpic = (action$) => action$.pipe(
    filter(setStatusGroupRSVN.match),
    mergeMap((action) => {
        const { data, IsIncludeChild, isCheckin } = action.payload;
        return functionPkmApi.setGroupStatusRsvn(data, IsIncludeChild, isCheckin).pipe(
            map((res: any) => {
                return bookingSlice.actions.updateQueryParamStatus(true);
            }),
            catchError(err => [bookingSlice.actions.setMessage(err), bookingSlice.actions.setLoading(false)])
        )
    })
);
const setDataRoomingList$: RootEpic = (action$) => action$.pipe(
    filter(readExcelRequest.match),
    map((action) => {
        const { data } = action.payload;
        return bookingSlice.actions.setDataRoomingList(data);
    })
);

export const BookingEpics = [
    getReservation$,
    getReservationById$,
    fetchRoomType$,
    searchCriteria$,
    guestProfiles$,
    fetchQueryParam$,
    fetchReservatedRooms$,
    fetchRoom$,
    selectProfile$,
    guestProfileInBookingRSVN$,
    searchProfileIds$,
    searchCompanyProfile$,
    getAllMainGuest$,
    getAllQueryParm$,
    fetchUpdateCombineGuest$,
    getGuestProfilesRsvnData$,
    fetchAddPmToGroup$,
    fetchCancelPm$,
    fetchAppGroupMaster$,
    fetchUnserGroupMaster$,
    fetchAddSharedGuest$,
    fetchAddCommentTrRoom$,
    setStatusGroupRSVN$,
    setDataRoomingList$,
    fetchRoomTypeLoadPage$
]

export const {
    setLoading,
    setMessage,
    getReservation,
    getReservationById,
    fetchRoom,
    setRoomType,
    setRoomTypePm,
    setRoom,
    searchRequest,
    setQueryParam,
    fetchQueryParam,
    getReservationSuccess,
    fetchReservatedRooms,
    fetchReservatedRoomsSuccess,
    fetchQueryParamSuccess,
    searchWithQueryParam,
    selectProfile,
    guestProfileInBookingRSVN,
    searchProfileIdsRequest,
    getAllGuestAndQueryRequest,
    getAllGuestProfileMain,
    setAllMainGuest,
    setLoadingSearch,
    updateCombineGuestRequest,
    getGuestProfilesRsvnData,
    getGuestProfilesRsvnDataSuccess,
    addPmRequest,
    cancelPmRequest,
    setInfoPage,
    addGroupMasterRequest,
    unsetGroupMasterRequest,
    addSharedGuestRequest,
    addCommentTrRoomRequest,
    setSelectedSearchResults,
    setFormSearchQuery,
    setStatusGroupRSVN,
    updateResetCheckBoxSearchResultTalble,
    updateQueryParamStatus,
    updateInitDragListener,
    readExcelRequest,
    setDataRoomingList,
    setShowStat,
    setRoomTypeLoadPage,
    searchTracerMessageReq,
    searchMessageReq,
} = bookingSlice.actions;
export const bookingReducer = bookingSlice.reducer;
