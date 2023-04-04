/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CompanyProfile } from "common/model-profile";
import companyProfileData from "common/const/profileDefaultValue";
import { RootEpic } from "common/define-type";
import { catchError, filter, mergeMap, switchMap,map } from "rxjs/operators";
import ProfileApi from 'api/profile/prf.api';
import { companyProfilesFilterByInputRequest } from 'redux/controller/reservation.slice';
interface companyProfileState {
    loading: boolean,
    data: CompanyProfile,
    isSuccess: boolean,
    message: string | undefined,
    commissionType : any[],
    customerMarket : any[],
    loaiHinhHD : any[],
    guidNewCompany: string
}
const initState: companyProfileState = {
    loading: false,
    isSuccess: false,
    data: companyProfileData,
    message: undefined,
    commissionType : [],
    customerMarket : [],
    loaiHinhHD : [],
    guidNewCompany : ""
}
const companyProfileSlice = createSlice({
    name: "companyprofile",
    initialState: initState,
    reducers: {
        addCompanyProfileRequest(state, action: PayloadAction<any>) {
            state.loading = true
        },
        addCompanyProfileSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.isSuccess = true;
            state.guidNewCompany = action.payload;
            alert("Adding company profile success!!!")
        },
        setMessage(state, action: PayloadAction<any>) {
            state.message = action.payload;
            state.loading = false;
        },
        getCompanyMoreDetailsRequest(state, action : PayloadAction<any>){
            state.loading = true;
        },
        setCustomerMarket(state,action : PayloadAction<any>){
            state.customerMarket = action.payload;
            state.loading = false;
        },
        setCommissionType(state,action : PayloadAction<any>){
            state.commissionType = action.payload;
            state.loading = false;
        },
        setLoaiHinhHD(state,action : PayloadAction<any>){
            state.loaiHinhHD = action.payload;
            state.loading = false;
        }
    }
})
const addCompanyProfile$: RootEpic = (action$) => action$.pipe(
    filter(addCompanyProfileRequest.match),
    switchMap((action) => {
        const {hotelGuid,input,data} = action.payload;
        console.log(action.payload);
        return ProfileApi.addCompanyProfile(data).pipe(
            mergeMap((res: any) => {
                return [
                    companyProfilesFilterByInputRequest({
                        hotelGuid,
                        input
                    }),
                    companyProfileSlice.actions.addCompanyProfileSuccess(res),
                    companyProfileSlice.actions.setMessage("Adding company success")
                ];
            }
            ),
            catchError(err => [companyProfileSlice.actions.setMessage(err)])
        )
    }
    )
)
const getCustomerMarket$: RootEpic = (action$) => action$.pipe(
    filter(getCompanyMoreDetailsRequest.match),
    mergeMap((action) => {
        return ProfileApi.getCompanyMoreCustomerMarket(action.payload).pipe(
            map((res: any) => {
                return companyProfileSlice.actions.setCustomerMarket(res)
            }
            ),
            catchError(err => [companyProfileSlice.actions.setMessage(err)])
        )
    }
    )
)
const getCommissionType$: RootEpic = (action$) => action$.pipe(
    filter(getCompanyMoreDetailsRequest.match),
    mergeMap((action) => {
        return ProfileApi.getCompanyMoreCommissionType(action.payload).pipe(
            map((res: any) => {
                return companyProfileSlice.actions.setCommissionType(res)
            }
            ),
            catchError(err => [companyProfileSlice.actions.setMessage(err)])
        )
    }
    )
)
const getLoaiHinhHD$: RootEpic = (action$) => action$.pipe(
    filter(getCompanyMoreDetailsRequest.match),
    mergeMap((action) => {
        return ProfileApi.getCompanyMoreLoaiHinhHD(action.payload).pipe(
            map((res: any) => {
                return companyProfileSlice.actions.setLoaiHinhHD(res)
            }
            ),
            catchError(err => [companyProfileSlice.actions.setMessage(err)])
        )
    }
    )
)
export const CompanyEpics = [
    addCompanyProfile$,
    getCustomerMarket$,
    getCommissionType$,
    getLoaiHinhHD$
]
export const {
    addCompanyProfileRequest,
    getCompanyMoreDetailsRequest,
    setCommissionType,
    setCustomerMarket,
    setLoaiHinhHD
} = companyProfileSlice.actions
export const companyReducer = companyProfileSlice.reducer