import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ResRoom } from "common/define-api-booking";
import { ResGetAllByHotelId, RoomRackFooter, Task } from "common/front-desk/define-roomRack";
import { RoomType } from "common/model-inventory";
import { addDays } from "date-fns";

interface RoomRackState{
    loading : boolean,
    data : ResRoom[] | [],
    message : string,
    //eslint-disable-next-line
    taskOfRoom : any;
    //eslint-disable-next-line
    guestDataProfile : any;
    listDate : string[];
    startDate : Date;
    totalPages : number;
    totalCount : number;
    reload : boolean;
    roomRackFooter : RoomRackFooter[];
    roomType : RoomType[];
    dateRangePicker : {
        fromDate : Date,
        toDate: Date,
    }
    roomFloors : number[];
    currentPage : number;
}

const initState : RoomRackState = {
    reload : false,
    loading : false,
    data : [],
    message : "",
    taskOfRoom : null,
    listDate : [],
    startDate : new Date(),
    totalPages : 1,
    totalCount : 1,
    guestDataProfile : null,
    roomRackFooter : [],
    roomType: [],
    roomFloors: [],
    currentPage : 1,
    dateRangePicker : {
        fromDate : new Date(),
        toDate : addDays(new Date(), 6),
    },
}

const roomRackSlice = createSlice({
    name : 'roomrack',
    initialState: initState,
    reducers : {
        updateRoomRackFooter(state, action : PayloadAction<{gridOfDeparture : number, resizeGrid : number}>){
            const {resizeGrid, gridOfDeparture} = action.payload;
            const cloneRoomRackFooter = [...state.roomRackFooter];
            if(resizeGrid < 0){
                for(let i = gridOfDeparture; i < gridOfDeparture - resizeGrid ; i++ ){
                    cloneRoomRackFooter[i].totalItemUnassign += 1
                }
            }
            else{
                for(let i = gridOfDeparture; i > gridOfDeparture - resizeGrid  ; i--){
                    cloneRoomRackFooter[i - 1].totalItemUnassign -= 1
                }
            }
            state.roomRackFooter = cloneRoomRackFooter;
        },
        setCurrentPage(state,action : PayloadAction<number>){
            state.currentPage = action.payload;
        },
        clearAllData(state){
            state = initState;
        },
        setRoomFloors(state, action : PayloadAction<number[]>){
            state.roomFloors = action.payload;
        },
        setRoomTypeRoomRack(state, action : PayloadAction<RoomType[]>){
            state.roomType = action.payload;
        },
        setRoomrackFooter(state, action : PayloadAction<RoomRackFooter[]>){
            state.roomRackFooter = action.payload;
        },
        setLoadingRoomRack(state,action : PayloadAction<boolean>){
            state.loading = action.payload
        },
        setReload (state,action : PayloadAction<boolean>){
            state.reload = action.payload;
        },
        message(state, action : PayloadAction<string>){
            state.message = action.payload
        },
        getListDataRequest(state){
            state.loading = true
        },
        setListRoomPlane(state,action : PayloadAction<{totalPages : number, totalCount : number, listRoom : ResRoom[]}>){
            state.totalPages = action.payload.totalPages;
            state.totalCount = action.payload.totalCount;
            state.data = action.payload.listRoom;
        },
        setListRoomPlaneMore(state,action : PayloadAction<ResGetAllByHotelId>){
            state.data = [...state.data, ...action.payload.listRoom];
        },
        //Update task[index] data when resize or Drag
        updateTaskFromRoom(state,action : PayloadAction<{data:Task, index : number, mappingRoomId : string}>){
            state.taskOfRoom[action.payload.mappingRoomId][action.payload.index] = action.payload.data
        },
        changeTaskToRoom(state,action : PayloadAction<{data: Task, roomGuid : string}> ){            
            state.taskOfRoom[action.payload.roomGuid] = [...state.taskOfRoom[action.payload.roomGuid], action.payload.data];
        },
        deleteTaskFromRoom(state,action : PayloadAction<{data : Task, roomGuid : string}>){
            state.taskOfRoom[action.payload.roomGuid] = action.payload.data;
        },
        setTotalPages(state,action: PayloadAction<number>){
            state.totalPages = action.payload;
        },
        setTotalCount(state,action : PayloadAction<number>){
            state.totalCount = action.payload;
        },
        //eslint-disable-next-line
        setTaskOfRoomMore(state,action : PayloadAction<any>){
            state.taskOfRoom = {...state.taskOfRoom,...action.payload};
        },
        //eslint-disable-next-line
        setTaskOfRoom(state,action : PayloadAction<any>){
            state.taskOfRoom = action.payload;
        },
        setDateRange(state, action : PayloadAction<string[]>){
            state.listDate = action.payload;
        },
        setStartDate(state, action: PayloadAction<Date>){
            state.startDate = action.payload
        },
        setDateRangePicker(state, action : PayloadAction<{fromDate : Date, toDate : Date}>){
            state.dateRangePicker = action.payload
        },
        //eslint-disable-next-line
        setGuestProfileData(state, action : PayloadAction<any>){
            if(action.payload && state.guestDataProfile){
                let cloneGuestProfileData = { ...state.guestDataProfile };
                // eslint-disable-next-line
                for(const key in action.payload){
                    if(!cloneGuestProfileData[key]){                        
                        cloneGuestProfileData = {...cloneGuestProfileData, [`${key}`] : action.payload[key] }
                    }
                }
                state.guestDataProfile = cloneGuestProfileData;
            }
            else{
                state.guestDataProfile = action.payload;
            }
        }
    }
})

export const {
    setRoomTypeRoomRack,
    setGuestProfileData,
    setListRoomPlaneMore,
    setTaskOfRoomMore,
    setListRoomPlane,
    setTaskOfRoom,
    getListDataRequest,
    setDateRange,
    setStartDate,
    setTotalPages,
    setTotalCount,
    changeTaskToRoom,
    setReload,
    setLoadingRoomRack, 
    deleteTaskFromRoom,
    updateTaskFromRoom,
    setRoomrackFooter,
    clearAllData,
    setRoomFloors,
    setCurrentPage,
    setDateRangePicker,
    updateRoomRackFooter,
} = roomRackSlice.actions
export const roomRackReducer = roomRackSlice.reducer