export interface ISearchGuest {
    title?: string,
    name?: string,
    lastName?: string,
    bookingCode?: string,
}

export interface IRateCode {
    id: number,
    guid: string,
    parent: number,
    parentGuid: string,
    ma: string,
    ten: string,
    ghiChu: string,
    discountFb: number,
    discountLaundry: number,
    discountOther: number,
    discountMinibar: number,
    nguoiDung: number,
    capDo: number,
    tgtn: string,
    nguoiDung2: number,
    tgtn2: string,
    dateFrom: string,
    dateTo: string,
    marketCode: number,
    hotelGuid: string,
    statusRec: number
}

export interface IPaymentMethod {
    id: number,
    guid: string,
    ten: string,
    hotelGuid: string,
    seq: number,
    statusRec: number
}

export interface RsvnType {
    id: number,
    guid: string,
    parent: number,
    parentGuid: string,
    ten: string,
    isConfirm: boolean,
    ma: string,
    sequency: number,
    hotelGuid: string,
    statusRec: number
}
