/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISearchResult } from "common/model-booking";

export interface PropsReinstateRSVN{
    data: ISearchResult[],
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>
}

export interface SetStatusModel{
    transactRoomId: string,
    status: number,
    totalRooms: number
}

export interface ReinstateTreeTable{
    room: string | null,
    roomId: string | null,
    key: number | null,
    guid: string | null,
    guestId: string | null,
    parentMeGuid: string | number | null,
    fullName: string | null,
    rate: string | null,
    roomType: string | null,
    roomTypeId: string | null,
    code: string | null,
    arrival: string | null,
    departure: string | null,
    groupCode: string | null,
    rsvnNo: number | null,
    status: string | null,
    comments: string | null,
    children?: ReinstateTreeTable[] | null,
    operation?: () => any
}

export const DEFAULT_RESINSTATETREE_VALUE: ReinstateTreeTable = {
    room: "",
    roomId: "",
    key: 1,
    guid: "",
    guestId: "",
    parentMeGuid: "",
    fullName: "",
    rate: "",
    roomType: "",
    roomTypeId: "",
    code: "",
    arrival: "",
    departure: "",
    groupCode: "",
    rsvnNo: 0,
    status: "",
    comments: "",
    operation: undefined
}