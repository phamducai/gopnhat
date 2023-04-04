export interface IFEGroupFolio {
    key: number,
    guidGroupFolio: string,
    debit: number,
    credit: number,
    balance: number,
}
export interface FolioStat {
    balanceOfSharedGuest: number,
    debit: number,
    credit: number,
    balance: number,
    deposit: number
}

export interface IGetGroupFolio {
    debit: number,
    credit: number,
    balance: number,
    dataFogroupFolioGetDTO: IGroupFolio
}
export interface IGroupFolio {
    id: number | null,
    guid: string,
    parent: string,
    parentGuid: string,
    so: string,
    ngayThang: string,
    tongSoTien: number,
    status: number,
    flagType: number,
    tongSoDaTt: 0,
    nguoiDung: 0,
    tgtn: string,
    capDo: number,
    flagTypePost: number,
    dateCreate: string,
    audited: boolean,
    tenKhach: string | null,
    tenCongTy: string | null,
    diaChi: string | null,
    maSoThue: string | null,
    rebate: string | null,
    flagParent: string | null,
    inHouse: string | null,
    location: string | null,
    conVoucher: string | null,
    inHouseGuid: string,
    hotelId: string | number | null,
    hotelGuid: string
}

export interface ITableMinibarAndLaundry {
    hangHoa: number,
    hangHoaGuid: string,
    donGia: number,
    soLuong: number,
    donGiaUsd: number,
    thanhTien: number | null,
    status: number,
    dienGiai: string,
    fullName: string,
    hotelGuid: string,
    ten: string,
    flagType?: number
}

export interface IPageDTO {
    pageNumber?: number,
    pageSize?: number,
}
export interface FilterFolio extends IPageDTO {
    groupFolioId: string
}
export interface InfoPage {
    TotalCount: number,
    PageSize: number,
    CurrentPage: number,
    TotalPages: number
}
export interface IResDataFolio {
    resPage: InfoPage,
    dataFolio: IGetDataFolio[]
}
export interface IGetDataFolio {
    id: number,
    guid: string,
    parent: number,
    parentGuid: string,
    ngayThang: string,
    inHouse: string,
    inHouseFrom: string,
    parentRoot: null | string,
    flagParent: number,
    audited: boolean,
    ma: string,
    dienGiai: string,
    donVi: string,
    donGia: number,
    soLuong: number,
    thanhTien: number,
    status: number,
    nguoiDung: number,
    capDo: number,
    tag: number,
    flagType: number,
    parentMe: number,
    guest: string,
    soPhong: string,
    location: number,
    rebate: boolean,
    maTk: string,
    thanhTien1: number,
    idchild: number,
    condense: number,
    suplement: string,
    adjustment: string,
    transferToAr: boolean,
    nguoiDung2: string,
    debitor: number,
    transferToAc: boolean,
    inHouseOrigin: number,
    thanhTienVnd: number,
    thanhTien1Vnd: number,
    tyGia: number,
    recIdPh11: number,
    recIdPh15: number,
    flagType2: number,
    inHouseOriginGuid: string,
    inHouseGuid: string,
    inHouseFromGuid: string,
    parentRootGuid: string,
    hotelId: number,
    outletCode: string,
    dockGuid: string,
    packageCode: string,
    hotelGuid: string
}

export interface ITableFolio {
    id: number,
    guid: string,
    parent: number,
    parentGuid: string,
    ngayThang: string,
    inHouse: string,
    inHouseFrom: string,
    parentRoot: null | string,
    flagParent: number,
    audited: boolean,
    ma: string,
    dienGiai: string,
    donVi: string,
    donGia: number,
    soLuong: number,
    thanhTien: number | string,
    status: number,
    nguoiDung: number,
    capDo: number,
    tag: number,
    flagType: number,
    parentMe: number,
    guest: string,
    soPhong: string,
    location: number,
    rebate: boolean,
    maTk: string,
    thanhTien1: number | string,
    idchild: number,
    condense: number,
    suplement: string,
    adjustment: string,
    transferToAr: boolean,
    nguoiDung2: string,
    debitor: number,
    transferToAc: boolean,
    inHouseOrigin: number,
    thanhTienVnd: number,
    thanhTien1Vnd: number,
    tyGia: number,
    recIdPh11: number,
    recIdPh15: number,
    flagType2: number,
    inHouseOriginGuid: string,
    inHouseGuid: string,
    inHouseFromGuid: string,
    parentRootGuid: string,
    hotelId: number,
    outletCode: string,
    dockGuid: string,
    packageCode: string,
    hotelGuid: string
}

export interface IDataCharge {
    thanhTien: number,
    tiLeGiamTru: number,
    soTienGiamTru: number,
    valueSC: number,
    valueVAT: number,
    totalValue: number,
    expressService?: number
}
export interface DataAmountRoomChat {
    roomChats: number,
    amount: number,
    maTk: string
}
export interface IDataCheckBalanceDTO{
    fullName?: string,
    tsRoomId: string,
    positionGroups: number[]
}