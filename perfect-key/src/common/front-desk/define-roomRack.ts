/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResRoom } from "common/define-api-booking";

export interface DataGroup {
    reservCode: string;
    totalRoom: number;
    totalGuest: number;
    masterGuest: string;
    totalFixCharge: number;
    roomRevenue: number;
    totalRevenue: number;
    deposit: number;
}
export interface DataRooms {
    id: string;
    mainGuest: string;
    mappingRoomId: string;
    roomName: string;
    roomType: string;
    rsvnID: string;
    arrivalDate: Date;
    departureDate: Date;
    arrival?: Date;
    departure?: any;
    hotelGuid: string;
    status: number;
    transactRoom: any[];
}

export interface Task{
    dataGroup : DataGroup,
    dataRooms : DataRooms
}

export interface ResListRoom {
    minArrivalDate: Date;
    maxDepartureDate: Date;
    data: Task[];
    totalRoom : number;
    roomRackFooter : RoomRackFooter[];

}
export interface ResGetAllByHotelId{
    listRoom : ResRoom[],
    taskOfRoom : any,
    totalCount : number,
    totalPages : number,
    guestProfileData : any,
    listRoomRackFooter : RoomRackFooter[],
}

export interface RoomRackFooter {
    totalItemAssign: number;
    totalItemUnassign: number;
    totalItem: number;
}

export interface RoomRackFilterOptions{
    floor : number,
    hotelGuid : string,
    pageNumber : number,
    pageSize : number,
    roomType : string | null,
    roomName : string
}
export const DefaultDataRooms: DataRooms = {
    id: "",
    mainGuest: "",
    mappingRoomId: "",
    roomName: "",
    roomType: "",
    rsvnID: "",
    arrivalDate: new Date(),
    departureDate: new Date(),
    hotelGuid: "",
    status: 0,
    transactRoom: [],
}
