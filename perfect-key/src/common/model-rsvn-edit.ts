import { DataFoextraCharge, DataForeservationDTO, DataFoTransactRoomEditGroupDTO, FlyInfor, Pickup, RemainRSVN } from "./model-rsvn";

export interface RoomTypeIdnCountsEdit {
    roomType: string | null;
    maxPerson: number;
    totalRooms: number;
    count: number;
    rate: number;
    guestCount: number;
    newGuestGuids: string[];
}


export interface EditGroupRSVN {
    remainRSVN: RemainRSVN | null;
    dataFotransactRoomDTO: DataFoTransactRoomEditGroupDTO;
    masterGuestGuid: string | null;
    roomTypeidnCounts: RoomTypeIdnCountsEdit[];
    dataForeservationDTO: DataForeservationDTO;
    flyInfor: FlyInfor;
    pickup: Pickup;
    dataFoextraCharges: DataFoextraCharge[];
}
export interface EditRoomGroup{
    roomNameGuid: string,
    roomName: string,
    roomTypeGuid: string,
    roomTypeName: string
}
export interface TypeStateHistory{
    rsvnNo: string,
    status: string,
    isTableSearch?: boolean
}
export interface InforExtraBed{
    totalExtraBed: number,
    extraBedUser: number
}
export interface PostExtraBed{
    id: number,
    hotelGuid: string,
    maTk: string,
    arrivalDate: string,
    depatureDate: string
}
export interface ResCheckInToGroup{
    listRoomName: string[],
    arrival: string,
    arrivalDate: string,
    departureDate: string,
    result: true,
    message:  string,
    data: string,
    totalGuest: string
}