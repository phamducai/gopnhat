/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITableFixCharge } from "./model-booking";
import { DataFoextraCharge } from "./model-rsvn";

export interface IFixCharge {
    id: number,
    guid: string,
    parent: number,
    parentGuid: string | null,
    ma: string,
    ten: string,
    ghiChu: string,
    maTk1: string,
    maTk2: string,
    maTk3: string,
    maTk4: string,
    soTk1: number,
    soTk2: number,
    flagType: number,
    status: number,
    tinhChat: string,
    maTk5: string,
    maTk6: string,
    maTk7: string,
    maTk8: string,
    maTk9: string,
    maTk10: string,
    maTk11: string,
    maTk12: string,
    soTk3: number,
    soTk4: number,
    soTk5: number,
    soTk6: number,
    soTk7: number,
    soTk8: number,
    soTk9: number,
    soTk10: number,
    tenVn: string,
    maSub1: string,
    maSub2: string,
    maSub3: string,
    maSub4: string,
    groupCode: string,
    subGroupCode: string,
    transactionType: string,
    subGroupType: string,
    subTransactionType: string,
    parentMeGuid: string | null,
    crossGroupGuid: string | null,
    tyLeThueVat: number,
    tyLeThueTtdb: number,
    tyLePhiDichVu: number,
    maKhoanMuc: string,
    maVuViec: string,
    maBoPhan: string,
    parentMe: number,
    hotelGuid: string | null,
    seq: number,
    statusRec: number
}
export interface ResultFixCharge {
    listFixCharge: IFixCharge[] | null,
    tableFixCharge: ITableFixCharge[] | []
}
export interface OjectFixCharge {
    totalFixCharge: number,
    dataFoextraCharge: DataFoextraCharge[]
}
export interface IMiniBarAndLaundry {
    id: number,
    guid: string,
    parent: number,
    parentGuid: null | string,
    ma: string,
    ten: string,
    tenNn: null | string,
    quyCach: null | string,
    quyCachNn: null | string,
    donViTinh: null | string,
    donViTinh2: null | string,
    ghiChu1: null | string,
    ghiChu2: null | string,
    nhomHang: number,
    phanLoai: number,
    donGia: number,
    outlet: number,
    fullName: string,
    accountCode: null | string,
    image: string,
    nhomHangGuid: string,
    soundName: string,
    donGiaUsd: number,
    isSetMenu: boolean,
    numberRef: null | string,
    eventGuid: null | string,
    daDinhLuong: boolean,
    hotelGuid: string,
    statusRec: number
}
export interface ITableLaundry {
    id: number,
    guid: string,
    parent: number,
    parentGuid: string | null,
    ma: string,
    ten: string,
    tenNn: string | null,
    laundryVND: number,
    laundryUSD: number,
    dryCleaningVND: number,
    dryCleaningUSD: number,
    pressingOnlyVND: number,
    pressingOnlyUSD: number,
    ghiChu: string | null,
    flagType: number,
    hotelGuid: string,
    status: number
}
export interface ExchangeRate {
    id: number,
    guid: string,
    ngayThang: string,
    currency1: number,
    currency2: number,
    giaTri: number,
    nguonGoc: string,
    hotelGuid: string
}

export interface IKhachHang{
    id: number,
    guid: string,
    ma: string,
    ten: string,
    tenNn: string,
    ghiChu: string,
    isDeleted: boolean,
    createDate: Date,
    userId: string,
    autoId: number,
    ngayBatDau: Date,
    ngayKetThuc: Date,
    advanceFuntion: number,
    dataKhachSan: any
}
export interface IPaymentMethods{
    id: number,
    guid: string,
    ten: string,
    hotelGuid: string,
    seq: number,
    statusRec: number
}
export interface IPackages{
    id: number,
    guid: string,
    parent: number,
    parentGuid: string,
    ma: string,
    ten: string,
    ghiChu: string,
    hotelGuid: string,
    kieuNgay: number,
    tuNgay: number,
    denNgay: number,
    autoPost: boolean,
    statusRec: number,
    seq: number
}
export interface ICommonHcfgInfo{
    id: number,
    guid: string,
    parent: number,
    parentGuid: string,
    ma: string,
    ten: string,
    ghiChu: string,
    seq: number,
    hotelGuid: string,
    statusRec: number
}
export interface IRsvnTypes{
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
export interface IRateCodes{
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
    tgtn: Date,
    nguoiDung2: number,
    tgtn2: Date,
    dateFrom: Date,
    dateTo: Date,
    marketCode: number,
    hotelGuid: string,
    statusRec: number
}
export interface IHcfgInfor{
    paymentMethods: IPaymentMethods[],
    fixCharges: IFixCharge[],
    packages: IPackages[],
    channels: ICommonHcfgInfo[],
    markets: ICommonHcfgInfo[],
    origins: ICommonHcfgInfo[],
    sources: ICommonHcfgInfo[],
    rsvnTypes: IRsvnTypes[],
    specials: ICommonHcfgInfo[],
    rateCodes: IRateCodes[]
}
export interface IGetDmucTuyChon
{
    id: number,
    parent: number,
    ma: string,
    ten: string,
    giaTri: string,
    ghiChu: string,
    statusRec: string,
    hotelGuid: string
}