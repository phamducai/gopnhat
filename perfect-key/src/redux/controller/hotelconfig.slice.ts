/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CashierAPI from "api/cashier/cashier.api";
import HotelConfigApi from "api/hcfg/hcfg.api";
import { RootEpic } from "common/define-type";
import { IDonViTienTe } from "common/model-common";
import { HotelConfigInfo } from "common/shared/hotelconfig.model";
import Utils from "common/utils";
import { catchError, filter, map, switchMap } from "rxjs/operators";

interface HotelConfigState{
    hcfgInfo: HotelConfigInfo,
    loading: boolean,
    businessDate: any,
    listDonViTienTe: IDonViTienTe[]
}

const initState: HotelConfigState = {
    hcfgInfo: {
        paymentMethods: [],
        fixCharges: [],
        packages: [],
        channels: [],
        markets: [],
        origins: [],
        sources: [],
        rsvnTypes: [],
        specials: [],
        rateCodes: []
    },
    businessDate: new Date(),
    loading: false,
    listDonViTienTe: []
}

const hotelConfigSlice = createSlice({
    name: 'hotelConfig',
    initialState: initState,
    reducers: {
        getHcfgInfoRequest(state, action: PayloadAction<string>) {
            state.loading = true;
        },
        setHcfgInfo(state, action: PayloadAction<HotelConfigInfo>) {
            state.hcfgInfo = action.payload;
            state.loading = false
        },
        bussinessDateReq(state, action: PayloadAction<string>){
            state.loading = true
        },
        bussinessDateSuccess(state, action: PayloadAction<string>){
            state.businessDate = Utils.convertMiddleDate(action.payload)
            state.loading = false
        },
        getDonViTienTeRequest(state, action: PayloadAction<string>){
            state.loading = true;
        },
        setDonViTienTe(state, action: PayloadAction<IDonViTienTe[]>){
            state.listDonViTienTe = action.payload;
        }
    }
})

const getbussinessDate$: RootEpic = (action$) => action$.pipe(
    filter(bussinessDateReq.match),
    switchMap((action) => {
        return CashierAPI.getBussinessDate(action.payload).pipe(
            map((res: any) => {
                const convertBusinessDate = Utils.convertToVNTimeZoneMbyMoment(res);
                return hotelConfigSlice.actions.bussinessDateSuccess(convertBusinessDate);
            }),
            catchError(() => {
                return [hotelConfigSlice.actions.bussinessDateSuccess(Utils.convertToVNTimeZoneMbyMoment(new Date()))]
            })
        )
    }
    )
)
const getHotelConfigInfo$: RootEpic = (action$) => action$.pipe(
    filter(getHcfgInfoRequest.match),
    switchMap((action) => {
        return HotelConfigApi.getHcfgInfo(action.payload).pipe(
            map((res: any) => {
                return hotelConfigSlice.actions.setHcfgInfo(res);
            }
            )
        )
    }
    )
)
const getListDonViTienTe$: RootEpic = (action$) => action$.pipe(
    filter(getDonViTienTeRequest.match),
    switchMap((action) => {
        return HotelConfigApi.getListDonViTienTe(action.payload).pipe(
            map((res) => {
                return hotelConfigSlice.actions.setDonViTienTe(res);
            }),
            catchError((err) => {
                return [hotelConfigSlice.actions.setDonViTienTe([])];
            })
        )
    })
)

export const HotelConfigEpic = [
    getHotelConfigInfo$,
    getbussinessDate$,
    getListDonViTienTe$,
]

export const {
    getHcfgInfoRequest,
    setHcfgInfo,
    bussinessDateReq,
    getDonViTienTeRequest,
    setDonViTienTe
} = hotelConfigSlice.actions

export const hotelConfigReducer = hotelConfigSlice.reducer