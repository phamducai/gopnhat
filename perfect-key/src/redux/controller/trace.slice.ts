import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICommonInforTsRoom, IPostTraceFolio, IPostTraceInHouse } from "common/model-common";
import { RootEpic } from "common/define-type";
import { catchError, filter, switchMap, map } from "rxjs/operators";
import Trace from "common/trace";
import Utils from "common/utils";
import PkmApi from "api/pkm/pkm.api";
import store from "redux/store";
import GLobalPkm from "common/global";
import CashierAPI from "api/cashier/cashier.api";



interface IPayLoadTrace{
    objectGuid?: string,
    actionCode: number,
    objectId?: number,
    oldString: string, 
    newString: string,
    hotelGuid: string,
    oldDate: Date,
    newDate: Date,
    parentGuid?: string
}
interface TraceState {
    listTraceInHouse: IPostTraceInHouse[],
    traceFolio: [],
    loading: boolean,
    message: string,
    commonInforTsRoom: ICommonInforTsRoom | null,
    listTraceFolio: IPostTraceFolio[],

}

const initTraceState: TraceState = {
    listTraceInHouse: [],
    traceFolio: [],
    loading: false,
    message: "",
    commonInforTsRoom: null,
    listTraceFolio: []
}

const traceSlice = createSlice({
    name: 'trace',
    initialState: initTraceState,
    reducers: {
        setTraceInHouse(state, action: PayloadAction<IPayLoadTrace>) {
            const userName = Utils.getValueLocalStorage("username");
            const { actionCode, objectId, oldString, newString, hotelGuid, oldDate, newDate } = action.payload;
            const listTrace: IPostTraceInHouse[] = Object.assign([],state.listTraceInHouse);
            listTrace.forEach((x) => {
                if(x.actionCode === actionCode){
                    x.newString = `${newString}`;
                }
            })
            const getTrace = listTrace.find(x => x.actionCode === actionCode);
            if(listTrace.length === 0 || !getTrace){
                listTrace.push({
                    parent: 0,
                    objectId: objectId ?? 0,
                    actionCode: actionCode,
                    actionName: `${Trace.GetActionName(actionCode)}`,
                    newDouble: 0,
                    oldDouble: 0,
                    newInteger: 0,
                    oldInteger: 0,
                    oldDate: oldDate,
                    newDate: newDate,
                    oldString: `${oldString}`,
                    newString: `${newString}`,
                    userName: userName,
                    hotelGuid: hotelGuid
                })
            }
            state.listTraceInHouse = listTrace;
        },
        setTraceInHouseRequest(state, action: PayloadAction<string>){
            state.loading = true;
        },
        setMessage(state, action: PayloadAction<string>){
            state.message = action.payload;
            state.listTraceInHouse = [];
        },
        setCommonInforTsRoom(state, action: PayloadAction<ICommonInforTsRoom>){
            state.commonInforTsRoom = action.payload;
        },
        resetTraceInHouse(state, action: PayloadAction<string>){
            state.listTraceInHouse = [];
            state.commonInforTsRoom = null;
        },
        setTraceFolioRequest(state, action: PayloadAction<IPayLoadTrace>){
            state.loading = true;
        },
        resetTraceFolio(state, action: PayloadAction<string>){
            state.listTraceFolio = [];
        },
    }
})

const postTraceInHouse$: RootEpic = (action$) => action$.pipe(
    filter(setTraceInHouseRequest.match),
    switchMap((action) => {
        const { trace } = store.getState();
        return PkmApi.postTraceInHouse(trace.listTraceInHouse).pipe(
            map((res) => {
                return traceSlice.actions.setMessage("success !");
            }
            ),
            catchError(err => [traceSlice.actions.setMessage(err)])
        )
    }
    )
)
const postTraceFolio$: RootEpic = (action$) => action$.pipe(
    filter(setTraceFolioRequest.match),
    switchMap((action) => {
        const userName = Utils.getValueLocalStorage("username");
        const { actionCode, objectId, oldString, newString, hotelGuid, oldDate, newDate, objectGuid, parentGuid } = action.payload;
        const listData: IPostTraceFolio[] = [];
        listData.push({
            parent: 0,
            parentGuid: parentGuid ?? GLobalPkm.defaultBytes32,
            objectGuid: objectGuid ?? GLobalPkm.defaultBytes32,
            objectId: objectId ?? 0,
            actionCode: actionCode,
            actionName: `${Trace.GetActionName(actionCode)}`,
            newDouble: 0,
            oldDouble: 0,
            newInteger: 0,
            oldInteger: 0,
            oldDate: oldDate,
            newDate: newDate,
            oldString: `${oldString}`,
            newString: `${newString}`,
            userName: userName,
            hotelGuid: hotelGuid
        })
        console.log(listData);
        return CashierAPI.postTraceFolio(listData).pipe(
            map((res) => {
                return traceSlice.actions.setMessage("success !");
            }
            ),
            catchError(err => [traceSlice.actions.setMessage(err)])
        )
    }
    )
)
export const TraceEpics = [
    postTraceInHouse$,
    postTraceFolio$
]

export const {
    setTraceInHouse,
    setTraceInHouseRequest,
    setCommonInforTsRoom,
    resetTraceInHouse,
    setTraceFolioRequest,
} = traceSlice.actions;

export const traceReducer = traceSlice.reducer