export interface IDataDateFromReport {
    dateSchedule: Date[],
    dateType: number
}
export interface IInputDataReport {
    date: Date;
    mainGuest: boolean,
    isComments: boolean,
    groupCode?: string,
    lastName?: string
}
export interface IGuestInHouseReport {
    groupCode: string
}
export interface ICompanyAgentReport {
    companyAgent: string,
    date?: Date
}
export interface IAccountDetailReport {
    date: Date[],
    time: Date[],
    dateType: number,
    isTypeTime: boolean,
    allAccount: boolean
}
export interface NightAuditResponse {
    denNgay: string,
    hotelGuid: string,
    tuNgay: string
}
export interface IDataNationalityReport {
    date: Date[]
    month: string
    numberView: number
    orderBy: string
    quater: number
    year: Date
}
export interface ICashierDetailReport {
    dateSchedule: Date[],
    time: Date[],
    dateType: number,
    isTypeTime: boolean,
    groupUser: string,
    username: string
}