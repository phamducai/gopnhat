import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CashierAPI from "api/cashier/cashier.api";
import { ITableMinibarAndLaundry } from "common/cashier/model-cashier";
import { IQueryParam } from "common/define-booking";
import { RootEpic } from "common/define-type";
import { ISearchResult } from "common/model-booking";
import { IPagination } from "redux/controller/booking.slice";
import { catchError, filter, map, switchMap } from "rxjs/operators";

interface FolioState {
    loading: boolean,
    message: string,
    listGoodsMinibar: ITableMinibarAndLaundry[],
    listGoodsLaundry: ITableMinibarAndLaundry[],
    voucherNumberFolio: number,
    dataSearchResults: ISearchResult[],
    queryParam: IQueryParam[],
    isLoadTableRunNight: boolean,
    inforPage: IPagination,
}

const initAppState: FolioState = {
    loading: false,
    message: "",
    listGoodsMinibar: [],
    listGoodsLaundry: [],
    voucherNumberFolio: 0,
    dataSearchResults: [],
    queryParam: [],
    isLoadTableRunNight: false,
    inforPage: {
        CurrentPage: 1,
        PageSize: 10,
        TotalCount: 1,
        TotalPages: 1,
        HasNext: false,
        HasPrevious: false
    }
}

const folioSlice = createSlice({
    name: 'folioSlice',
    initialState: initAppState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload 
        },
        message(state, action: PayloadAction<string>) {
            state.message = action.payload
        },
        setGoodsMinibar(state, action: PayloadAction<ITableMinibarAndLaundry[]>){
            state.listGoodsMinibar = action.payload
        },
        setGoodsLaundry(state, action: PayloadAction<ITableMinibarAndLaundry[]>){
            state.listGoodsLaundry = action.payload
        },
        fetchVoucherNumberFolio(state, action: PayloadAction<string>){
            state.loading = true
        },
        getVoucherNumberFolio(state, action: PayloadAction<number>){
            state.voucherNumberFolio = action.payload
        },
        setLoadingTableRunNight(state, action: PayloadAction<boolean>){
            state.isLoadTableRunNight = action.payload
        },
        setSearchRunNightSuccess(state, action: PayloadAction<{queryParam : IQueryParam[], dataSearchResults: ISearchResult[], inforPage: IPagination}>){
            state.queryParam = action.payload.queryParam;
            state.dataSearchResults = action.payload.dataSearchResults;
            state.inforPage = action.payload.inforPage;
        }
        
    }
})

const fetchNewestVoucherService$: RootEpic = (action$) => action$.pipe(
    filter(fetchVoucherNumberFolio.match),
    switchMap((action) => {
        return CashierAPI.getVoucherNumberFolio(action.payload).pipe(
            map((res) => {
                return folioSlice.actions.getVoucherNumberFolio(res)
            }), catchError((err) => {
                return [folioSlice.actions.message(err.message)]
            })
        )
    })
)

export const FolioEpics = [
    fetchNewestVoucherService$
]

export const {
    setGoodsMinibar,
    setGoodsLaundry,
    fetchVoucherNumberFolio,
    setLoadingTableRunNight,
    setSearchRunNightSuccess
} = folioSlice.actions;
export const folioReducer = folioSlice.reducer