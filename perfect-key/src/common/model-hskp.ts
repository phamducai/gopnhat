export interface IHSKBlockRoom{
    parentGuid: string,
    roomGuid: string
    ngayThang: Date,
    dateFrom: Date,
    dateTo: Date,
    tinhTrang: number,
    remark: string,
    nguoiDung: string,
    capDo: number,
    flagType: number,
    status: number,
    onlyReservation: number,
    hotelGuid: string
}
export interface IGetHSKBlockRoom extends IHSKBlockRoom{
    guid: string,
    id: string
}
export interface IListStatusRoomHskp{
    id: number,
    ma: string,
    ten: string,
    ghiChu: string,
    hotelGuid: string,
    statusRec: number | null,
    dmucFophong: number | null
}