export interface IRoomChargeRunNight{
    numberRoomCharge: number,
    debitRoomCharge: number,
    listInHouseId: string[]
}
export interface IRoomRevenue{
    roomCount: number,
    roomRevenue: number
}
export interface ITableRunNight{
    guestId: string,
    parentMeGuid: string | number,
    fullName: string,
    room: string,
    rate: string,
    roomType: string,
    code: string,
    arrival: string,
    departure: string,
    groupCode: string,
    rsvnNo: number,
    status: string,
    comments: string,
    guid: string | null,
    parentGuid?: string | null,
    market: string,
    sources: string,
    chanels: string,
    specials: string,
    packages: string
}
export interface InForRunNightReqDTO{
    tsRoomGuid: string,
    market: string[],
    sources: string[],
    chanels: string[],
    specials: string[],
    packages: string[]
}
export interface IInForRunNightRespDTO{
    tsRoomGuid: string,
    tenMarket: string,
    tenSource: string,
    tenChanel: string,
    tenSpecial: string,
    tenPackage: string
}
export interface IRunNightCommon{
    hotelGuid: string,
    nguoiDung2: string,
    serverName: string,
    language: string,
    statAtNight: IStatAtNight
}
export interface IStatAtNight{
    roomInHouse: number,
    roomNoGuest: number,
    occupiedTonight: string,
    houseUse: number,
    complimentary: number,
    guestInHouse: number,
    roomRevenue: number,
    timeZone: number,
    hotelName: string
}
export interface IRunNightAudit{
    hotelGuid: string,
    type: number,
    dateFrom: string,
    dateTo: string
}