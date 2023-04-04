export interface IFormRoomCharge {
    ngayThang: Date,
    dienGiai: string,
    donGia: number,
    autoService: boolean,
    dateFrom?: Date,
    dateTo?: Date
}

export interface IFormRebate {
    ngayThang: Date,
    dienGiai: string,
    thanhTien: number,
    tyLeGiamTru: number,
    maTK: string,
    ma: string
}
export interface FormFilter {
    services: string[],
    202: string,
    203: string,
    204: string,
    301: string,
    420: string,
    "": string
}
export interface FormPayment{
    maTK: string,
    expireDate: Date,
    cvv: number,
    valuePay: number,
    creaditCardNo: number,
    valueAfterEx: number,
    exchangeRate: number,
    outletCode: string
}