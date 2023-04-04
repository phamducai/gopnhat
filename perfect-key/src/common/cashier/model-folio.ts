import { IGetDataFolio, ITableFolio } from "./model-cashier";


export interface IStateHistoryFolio {
    fullName: string,
    roomNumber: string,
    guestGuid: string,
    status: number,
    parentMeGuid: string,
    idRsvn: string
}
export interface PropsServiceCommon {
    isShowModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    fullName?: string,
    roomNumber?: string,
    guestGuid: string,
    groupGuidId: string,
    parentMeGuid?: string,
    idRsvn?: string
}
interface CommonPosting {
    tsRoomId: string,
    tinhChat: string,
}

export interface IParam {
    tsRoomGuid: string;
}
export interface IPostingMiniBar extends CommonPosting {
    dataFofolioCreateDTO: ICreateDTOFolio,
    giaoDichHangHoaMiniBarCreateDTO: ICreateGiaoDichMiniBar,
    chiTietGiaoDichMiniBarCreateDTO: ICreateChiTietGiaoDichMiniBar[]
}
export interface ICreateDTOFolio {
    parentGuid: string,
    ngayThang: Date,
    flagParent: number,
    audited: true,
    ma: string,
    dienGiai: string,
    donVi: string,
    donGia: number,
    soLuong: number,
    status: number,
    nguoiDung: number,
    capDo: number,
    tag: number,
    flagType: number,
    parentMe: number,
    guest: string,
    soPhong: string,
    location: number,
    rebate: true,
    maTk: string,
    idchild: number,
    condense: number,
    suplement: string,
    adjustment: string,
    transferToAr: true,
    nguoiDung2: string,
    debitor: number,
    transferToAc: true,
    thanhTienVnd: number,
    thanhTien1Vnd: number,
    tyGia: number,
    recIdPh11: number,
    recIdPh15: number,
    flagType2: number,
    outletCode: string,
    dockGuid: string,
    packageCode: string,
    hotelGuid: string
}
export interface ICreateGiaoDichMiniBar {
    ngayThang: Date,
    so: string,
    thanhTien: number,
    tyLeGiamTru: number,
    soTienGiamTru: number,
    tongSoTien: number,
    ghiChu: string,
    nguoiDung: number,
    capDo: number,
    guest: string,
    freeCharge: boolean,
    status: number,
    servicesCharge: number,
    vatcharge: number,
    nightAuditorRun: number,
    hotelGuid: string
}
export interface ICreateChiTietGiaoDichMiniBar {
    hangHoa: number,
    hangHoaGuid: string,
    soLuong: number,
    donGia: number,
    thanhTien: number,
    status: number,
    hotelGuid: string
}
export interface IMapDataChiTiet {
    dienGiai: string,
    chiTietGiaoDichMiniBarCreateDTO: ICreateChiTietGiaoDichMiniBar[]
}
export interface IFormMiniBarOrLaundry {
    ngayThang: Date,
    so: string,
    thanhTien: number,
    tyLeGiamTru: number,
    soTienGiamTru: number,
    tongSoTien: number,
    ghiChu: string,
    nguoiDung: number,
    capDo: number,
    guest: string,
    freeCharge: true,
    status: number,
    servicesCharge: number,
    vatcharge: number,
    nightAuditorRun: number,
    hotelGuid: string,
    soPhong: string,
}
export interface IFormCommonPosting extends CommonPosting {
    parentGuid: string,
    maTk: string,
    ma: string,
    hotelGuid: string,
    nguoiDung2: string,
    ten: string
}

//Posting Laundry
export interface IDataLaundryMaping {
    ten: string,
    dienGiai: string,
    hangHoa: number,
    hangHoaGuid: string,
    soLuong: number,
    disableIn1: boolean,
    laundryUSD: number,
    thanhTien: number,
    soLuong1: number,
    disableIn2: boolean,
    dryCleaningUSD: number,
    thanhTien1: number,
    soLuong2: number,
    disableIn3: boolean,
    pressingOnlyUSD: number,
    thanhTien2: number,
    hotelGuid: string
}
export interface IGiaoDichLaundryCreateDTO {
    parent: number,
    parentGuid: string,
    ngayThang: string,
    so: string,
    thanhTien: number,
    tyLeGiamTru: number,
    soTienGiamTru: number,
    tongSoTien: number,
    ghiChu: string,
    nguoiDung: number,
    capDo: number,
    tgtn: Date,
    guest: string,
    freeCharge: boolean,
    status: number,
    servicesCharge: number,
    vatcharge: number,
    nightAuditorRun: number,
    tongVND: number,
    expressServiceRatio: number,
    expressServiceValue: number,
    hotelGuid: string
}
export interface IChiTietGiaoDichLaundryCreateDTOs {
    hangHoa: number,
    hangHoaGuid: string,
    soLuong: number,
    donGia: number,
    thanhTien: number,
    status: number,
    flagType: number,
    hotelGuid: string
}
export interface IPostingLaundry extends CommonPosting {
    dataFofolioCreateDTO: ICreateDTOFolio,
    giaoDichLaundryCreateDTO: IGiaoDichLaundryCreateDTO,
    chiTietGiaoDichLaundryCreateDTOs: IChiTietGiaoDichLaundryCreateDTOs[]
}
export interface IMapDataDetailLaundry {
    dienGiai: string,
    chiTietGiaoDichLaundryCreateDTOs: IChiTietGiaoDichLaundryCreateDTOs[]
}

export interface IPostingCommonFoodAndOther extends CommonPosting {
    thanhTien: number,
    businessDate?: string,
    departureDate?: string,
}
export interface IPostingCommon extends CommonPosting {
    thanhTien: number,
    businessDate?: string,
    departureDate?: string,
}
export interface IPostingFoodAndOther {
    postingCommon: IPostingCommonFoodAndOther,
    dataFofolioCreateDTO: ICreateDTOFolio
}
export interface IPostingAdvanceRoomCharge {
    postingCommon: IPostingCommonFoodAndOther,
    dataFofolioCreateDTO: ICreateDTOFolio[]
}
export interface ITableMoveFolio {
    guid: string,
    guestId: string,
    fullName: string,
    arrivalDate: Date,
    departureDate: Date,
    rate: number,
    roomName: string,
    parentMeGuid: string | null
}
export interface ICombineFolio {
    groupFolioId: string,
    isChild: boolean,
    isAllItem: boolean,
    description: string,
    ngayThang: Date,
    listFolioId: string[]
}
export interface ISplitFolio {
    isPieces: boolean,
    thanhTien: number,
    pieces: number,
    dienGiai: string,
    suplement: string
}
export interface IPostingSplit {
    isPieces: boolean,
    thanhTien: number,
    pieces: number,
    datafolioGetDTO: IGetDataFolio
}
export interface IPostingCorrection {
    folioId: string,
    suplement: string,
    description: string,
    ngayThang: string,
    tinhChat: string
}
export interface AmountRoomChat {
    groupFolioId: string,
    maTk: string
}
export interface IPostingMove {
    isSameAccount: boolean,
    typeMoveFolio: number,
    fromGroupFolioId: string,
    toGroupFolioId: string,
    toTsRoomId: string,
    guestId: string,
    listFolioId: string[],
    toRoom: string
}
export interface PrintFolio {
    hotelGuid: string,
    transactRoomGuid: string,
    listFolios: ITableFolio[],
    readTotal?: string,
    userName: string,
    groupFolioID: string,
    arrival?: Date,
    departure?: Date,
    guestName: string,
    payment: string,
    exchangeRate: string,
    serviceChargePercent: string,
    vatChargePercent: string,
    companyGuid: string,
    printRate: boolean,
    printType: string,
    printForm: string,
    isDraft: boolean
}
export interface FilterGroupItem {
    maTK: string,
    groupNumber: number
}
export interface FilterGroupFolio {
    tsRoomId: string,
    listFilter: FilterGroupItem[]
}

export interface IPostCommon {
    tsRoomId: string,
    tinhChat: string,
    thanhTien: number
}
export interface IPostingPaymentDTO {
    postingCommon: IPostCommon,
    dataFofolioCreateDTO: ICreateDTOFolio
}