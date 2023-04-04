/* eslint-disable @typescript-eslint/no-explicit-any */
interface NestedValue<TName, TId> {
    name: TName,
    id: TId
}

export interface ISearchResult {
    guestId: string | null,
    parentMeGuid: string | number | null,
    fullName: NestedValue<string | null, string | null>,
    room: NestedValue<string | null, string | null>,
    rate: NestedValue<string | null, number | null>,
    roomType: NestedValue<string | null, string | null>,
    code: NestedValue<string | null, string | null>,
    arrival: NestedValue<string | null, string | null>,
    departure: NestedValue<string | null, string | null>,
    groupCode: NestedValue<string | null, string | null>,
    rsvnNo: NestedValue<number | null, number | null>,
    status: NestedValue<string | null, number | null>,
    comments: NestedValue<string | null, string | null>,
    guid: string | null,
    parentGuid?: string | null
}
export interface ITableFixCharge {
    key?: string | number,
    guid: string,
    parent: number,
    id: number,
    autoPost: boolean | string,
    ma: number | string | null,
    ten: string | null,
    soLuong: number,
    donGia: number,
    thanhTien: number | string,
    ghiChu: string,
    hotelGuid: string | null,
    kieuNgay: number,
    soNgay: number
}
export interface RSVNFormData {
    id?: number,
    bookByEmail?: string,
    bookByFax?: string,
    bookByPhone?: string,
    bookedBy?: string,
    bookingCode?: string
    cod?: number,
    comment?: string
    companyAgentGuid?: string
    confirmed?: boolean
    firstName: string,
    isNet: boolean,
    isNoBkf: boolean,
    lastName: string
    nights?: number,
    groupCode?: string | number,
    guid?: string,
    packageCodes?: string | null,
    paymentMethod?: string,
    printRate: boolean,
    rateCode?: string,
    resChanel?: string,
    resMarket?: string,
    resOrigin?: string,
    resSource?: string,
    resType?: string,
    specialsCodes?: string | null,
    title: string
}
export const DEFAULT_RSVN_FORM_DATA: RSVNFormData = {
    bookByEmail: "",
    bookByFax: "",
    bookByPhone: "",
    bookedBy: "",
    bookingCode: "",
    cod: 0,
    comment: "",
    companyAgentGuid: "",
    confirmed: false,
    firstName: "",
    isNet: false,
    isNoBkf: false,
    lastName: "",
    nights: 0,
    packageCodes: "",
    paymentMethod: "",
    printRate: false,
    rateCode: "",
    resChanel: "",
    resMarket: "",
    resOrigin: "",
    resSource: "",
    resType: "",
    specialsCodes: "",
    title: ""
}
export interface ITableNight {
    key: number,
    nightFrom: string,
    nightTo: string,
    notes: string | null
}
export interface TransactRoom {
    arrival: string | null,
    arrivalDate: string | null,
    arrivalPickUp: boolean,
    audults: string | number | null,
    carPickUp: string | number | null,
    carPickUpTime: string | number | null,
    childs: string | number | null,
    comments: string | null,
    comp: string | number | null,
    companyAgentGuid: string | null,
    confirmed: boolean,
    cutOfDate: string | null,
    departure: null
    departureDate: string | null,
    departurePickUp: boolean,
    deposit: string | number | null,
    fixedRate: boolean,
    flagType: number,
    flightNo: string | number | null,
    guestId: string,
    guid: string | null,
    hotelGuid: string | null,
    hotelId: number,
    houseUse: string | number | null,
    id: number,
    isNet: boolean,
    isNoBkf: boolean,
    nights: number,
    noPost: string | number | null,
    origin: string | null,
    packageCodes: string | null,
    parentMeGuid: string | null,
    paymentMethod: string | null,
    printRate: boolean,
    rate: number
    rateCode: string | null,
    rateRef: string | null,
    resChanel: string | null,
    resMarket: string | null,
    resSource: string | null,
    resType: string | null,
    room: string | number | null,
    roomType: string | null,
    roomTypeUgr: string | number | null,
    specialsCodes: string | null,
    status: number
}
export interface ListTsRoomPlan {
    arrivalDate: Date,
    departureDate: Date,
    code: number,
    hotelGuid: string,
    mainGuest: string,
    mappingRoomId: string,
    roomName: number | string,
    roomType: string,
    reservation: RSVNFormData,
    rsvnID: string,
    status: number,
    transactRoom: TransactRoom[]
}
export interface IParamCheckIn {
    roomName: string,
    mainTsRoom: string,
    status: string,
    rsvnNo: string,
    parentMeGuid: string | null
}
export interface ResParamCheckIn {
    listParamCheckin: IParamCheckIn[],
    roomDirty: string[]
}
export interface DataFormConfirm {
    isChild: boolean
}
export interface RsvnConfirmation {
    hotelGuid: string,
    transactRoomGuid: string,
    rsvnGuid: string,
    isGroup: boolean
}
export interface IQueryParamRunNight{
    pageNumber?: number,
    pageSize?: number,
    status?: number | null,
    isOnlyMainGuest?: boolean | null,
    occupiedTonight?: boolean | null,
    houseUse?: boolean | null,
    complimentary?: boolean | null,
    expectedArrivals?: boolean | null,
    expectedDepartures?: boolean | null,
    roomRevenue?: boolean | null,
    RoomCharge?: boolean | null,
    listInHouseId?: string[],
    businnesDate: Date,
    hotelGuid: string
}
export interface IRespTotalBooker{
    day: Date,
    roomTypeId: string,
    countHasRoom: number
}