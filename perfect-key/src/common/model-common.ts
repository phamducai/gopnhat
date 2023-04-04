export interface ValidateResponse{
    result: boolean,
    message: string,
    data: null | string[],
}
export interface InforRoomType{
    donGia: number
    ghiChu: string
    guid: string
    hotelGuid: string
    ma: string
    maxPerson: number
    parentGuid: string
    statusRec: number
    ten: string
}
export interface IDonViTienTe{
    id: number,
    guid: string,
    ten: string,
    hotelGuid: string
}
export interface IPostTraceInHouse {
    parent: number,
    objectId: number,
    actionCode: number,
    actionName: string,
    oldInteger: number,
    newInteger: number,
    oldDouble: number,
    newDouble: number,
    oldDate?: Date,
    newDate?: Date,
    oldString?: string,
    newString?: string,
    userName?: string,
    hotelGuid: string
}
export interface IGetTraceInHouse{
    id: number,
    parent: number,
    objectId: number,
    actionCode: number,
    actionName: string,
    oldInteger: number,
    newInteger: number,
    oldDouble: number,
    newDouble: number,
    oldDate?: Date,
    newDate?: Date,
    oldString?: string,
    newString?: string,
    userName?: string,
    tgtn: Date,
    hotelGuid: string
}
export interface IPostTraceFolio{
    parent: number,
    parentGuid: string,
    objectId: number,
    objectGuid: string,
    actionCode: number,
    actionName: string,
    oldInteger: number,
    newInteger: number,
    oldDouble: number,
    newDouble: number,
    oldDate: Date,
    newDate: Date,
    oldString: string,
    newString: string,
    userName: string,
    hotelGuid: string
}
export interface ICommonInforTsRoom{
    tsRoomId: number,
    arrivalDate: Date,
    departureDate: Date,
    status: number
}