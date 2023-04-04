import { ITableFolio } from 'common/cashier/model-cashier';
import { TransactRoom } from 'common/model-booking';
import { CompanyProfile, GuestProfile } from 'common/model-profile';
import { ChargeInfo } from 'common/shared/hotelconfig.model';
export interface IHotelInfo {
    name: string,
    logo: string,
    address: string,
    tel: string,
    email: string,
    website: string
}
export interface IGuestInfo {
    name: string,
    company?: string | null,
    address?: string,
    tax?: string
}
export interface IInvoiceInfo {
    room: string,
    arrival: string,
    departure: string,
    cashier: string,
    pageSize: string,
    pageNumber: string,
    printDate: string,
    foliosList: ITableFolio[],

}
export interface DataPrintOption {
    transactRoom: TransactRoom,
    guest: GuestProfile | null,
    company: CompanyProfile | null,
    exchangeRate: number,
    charges: ChargeInfo[]
}