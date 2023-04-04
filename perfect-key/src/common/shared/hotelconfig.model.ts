
export interface HotelConfigInfo {
    paymentMethods: PaymentMethod[],
    fixCharges: FixCharges[],
    packages: Packages[],
    channels: ReservationChannels[],
    markets: ReservationMarkets[],
    origins: ReservationOrigins[],
    sources: ReservationSources[],
    rsvnTypes: ReservationTypes[],
    specials: ReservationSpecials[],
    rateCodes: RateCodes[]
}

export interface PaymentMethod {
    id: number,
    guid: string,
    ten: string | 'No Name',
    hotelGuid: string,
    seq: number | 0,
    statusRec: number
}

export interface FixCharges {
    id: number,
    guid: string,
    parent: number,
    parentGuid: string | '',
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
    parentMeGuid: string,
    crossGroupGuid: string,
    tyLeThueVat: number,
    tyLeThueTtdb: number,
    tyLePhiDichVu: number,
    maKhoanMuc: string,
    maVuViec: string,
    maBoPhan: string,
    parentMe: number,
    hotelGuid: string,
    seq: number,
    statusRec: number
}

export interface ChargeInfo {
    "id": number,
    "parent": number,
    "ma": string,
    "ten": string,
    "giaTri": string,
    "ghiChu": string,
    "statusRec": string | null,
    "hotelGuid": string
}
export interface Packages {
    id: number;
    guid: string;
    parent: number | null;
    parentGuid: string;
    ma: string;
    ten: string | 'No Name';
    ghiChu: string | null;
    hotelGuid: string;
    kieuNgay: number | null;
    tuNgay: number | null;
    denNgay: number | null;
    autoPost: boolean | null;
    statusRec: number;
    seq: number | null;
}

export interface ReservationChannels {
    id: number;
    guid: string;
    parent: number | null;
    parentGuid: string;
    ma: string;
    ten: string | 'No Name';
    ghiChu: string | null;
    seq: number | null;
    hotelGuid: string;
    statusRec: number;
}

export interface ReservationMarkets {
    id: number;
    guid: string;
    parent: number;
    parentGuid: string;
    ma: string;
    ten: string | 'No Name';
    ghiChu: string | null;
    seq: number | null;
    hotelGuid: string;
    statusRec: number;
}

export interface ReservationOrigins {
    id: number;
    guid: string;
    parent: number;
    parentGuid: string;
    ma: string;
    ten: string | 'No Name';
    ghiChu: string;
    seq: number;
    hotelGuid: string;
    statusRec: number;
}

export interface ReservationSources {
    id: number;
    guid: string;
    parent: number;
    parentGuid: string;
    ma: string;
    ten: string | 'No Name';
    ghiChu: string;
    seq: number;
    hotelGuid: string;
    statusRec: number;
}

export interface ReservationTypes {
    id: number;
    guid: string;
    parent: number;
    parentGuid: string;
    ten: string | 'No Name';
    isConfirm: boolean;
    ma: string;
    sequency: number;
    hotelGuid: string;
    statusRec: number;
}

export interface ReservationSpecials {
    id: number;
    guid: string;
    parent: number;
    parentGuid: string;
    ma: string;
    ten: string | 'No Name';
    ghiChu: string;
    seq: number;
    hotelGuid: string;
    statusRec: number;
}

export interface RateCodes {
    id: number;
    guid: string;
    parent: number;
    parentGuid: string;
    ma: string;
    ten: string | 'No Name';
    ghiChu: string;
    discountFb: number;
    discountLaundry: number;
    discountOther: number;
    discountMinibar: number;
    nguoiDung: number;
    capDo: number;
    tgtn: Date;
    nguoiDung2: number;
    tgtn2: Date;
    dateFrom: Date;
    dateTo: Date;
    marketCode: number;
    hotelGuid: string;
    statusRec: number;
}
