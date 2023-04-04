export interface IDataApiDateFromReport {
    dateFrom: string | Date;
    dateTo: string | Date;
    hotelId: string
}
export interface IDataAPIInputDataReport {
    hotelGuid: string,
    departureDate?: string | Date,
    arrivalDate?: string | Date,
    isRate: boolean,
    isComments: boolean,
    groupCode?: string | null,
    lastName?: string | null,
    orderBy: string,
    isMainGuestOnly: boolean
}
export interface IDataAPIGroupInHouse {
    hotelGuid: string,
    isRate?: boolean,
    groupCode?: string | null,
    orderBy?: string,
    isGroup?: boolean,
    isGroupCode?: boolean,
    isRateCode?: boolean,
    occupancy: string
}
export interface IDataAPICompanyAgent {
    hotelGuid: string,
    year?: string,
    orderBy: string,
    agentCompany: string
}
export interface IDataAPIAccountDetail {
    hotelGuid: string,
    dateFrom: string| Date,
    dateTo: string| Date,
    accountList: string[],
    isVat: boolean,
    userName: string,
    isPayment: boolean
}
export interface IDataAPIGuestFolio {
    hotelGuid: string,
    dateFrom: string | Date,
    dateTo: string | Date,
    isDetail: boolean
}
export interface IDataAPIEndOfDay {
    hotelGuid: string,
    isRate: boolean,
    dateFrom: string | Date,
    dateTo: string | Date,
    occupancy: number,
    type: string,
    isMarket: boolean,
    isSource: boolean,
    isRateCode: boolean,
    vipGuestType: string
}
export interface IDataAPINationality {
    hotelGuid: string,
    dateFrom: string | Date,
    dateTo: string | Date,
    type: string,
    orderBy: string
}
export interface IDataAPIHousekeeping {
    hotelGuid: string,
    dateFrom: string | Date,
    dateTo: string | Date,
    isDetail: boolean,
    isItems: boolean,
    type: string
}