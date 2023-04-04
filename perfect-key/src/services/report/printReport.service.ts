/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDataAPIAccountDetail, IDataAPICompanyAgent, IDataApiDateFromReport, IDataAPIEndOfDay, IDataAPIGroupInHouse, IDataAPIGuestFolio, IDataAPIHousekeeping, IDataAPIInputDataReport, IDataAPINationality } from 'common/report/define-api-report';
import PrintReportApi from 'api/report/printReport.api';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { IAccountDetailReport, ICompanyAgentReport, IDataDateFromReport, IDataNationalityReport, IGuestInHouseReport, NightAuditResponse } from 'common/report/define-report';
import Utils from 'common/utils';
import { getYear } from 'date-fns';
import { FixChargeCode, GuestInHouseOption, RateOption, TypeEODWithOption } from 'common/enum/report.enum';
import HotelConfigApi from 'api/hcfg/hcfg.api';
import { ITableFixCharge } from 'common/model-booking';
import { IFixCharge } from 'common/model-hcfg';
import { IRunNightAudit } from 'common/end-of-day/model-runNight';
import CashierAPI from 'api/cashier/cashier.api';
import FolioService from 'services/cashier/folio.service';
class PrintReportService {
    static async guestBalanceReport(data: IDataDateFromReport, hotelId: string): Promise<string | null> {
        try {
            const dataApi: IDataApiDateFromReport = {
                hotelId: hotelId,
                dateFrom: data.dateSchedule[0],
                dateTo: data.dateSchedule[1]
            }
            const fileURL = await PrintReportApi.printGuestBalance(dataApi).toPromise();
            return fileURL
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    // call api print arrival and departure report 
    static async arrivalDepartureReport(data: IDataAPIInputDataReport): Promise<string | null> {
        try {
            const fileURL = await PrintReportApi.printArrivalDeparture(data).toPromise();
            return fileURL
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    static async guestInHouseReport(data: IGuestInHouseReport, hotelId: string, optionGuestInHouse: number, rateOption: number,
        orderBy: string, occupiedTonight: string): Promise<string | null> {
        try {
            let dataApi: IDataAPIGroupInHouse = {
                hotelGuid: hotelId,
                groupCode: "",
                occupancy: occupiedTonight
            }
            if (optionGuestInHouse === GuestInHouseOption.orderBy) {
                dataApi = {
                    ...dataApi,
                    groupCode: data.groupCode,
                    orderBy: orderBy,
                }
            } else if (optionGuestInHouse === GuestInHouseOption.RateCode) {
                if (rateOption === RateOption.WithRate) {
                    dataApi = {
                        ...dataApi,
                        isGroup: false,
                        isRate: true
                    }
                } else if (rateOption === RateOption.WithRateCode) {
                    dataApi = {
                        ...dataApi,
                        isGroup: false,
                        isRateCode: true
                    }
                } else {
                    dataApi = {
                        ...dataApi,
                        isGroup: false,
                        isGroupCode: true
                    }
                }
            } else {
                if (rateOption === RateOption.WithRate) {
                    dataApi = {
                        ...dataApi,
                        isGroup: true,
                        isRate: true
                    }
                } else {
                    dataApi = {
                        ...dataApi,
                        isGroup: true,
                        isRate: false
                    }
                }
            }
            const fileURL = await PrintReportApi.printGuestInHouse(dataApi).toPromise();
            return fileURL
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    static async companyAgentReport(data: ICompanyAgentReport, hotelId: string, orderBy: string): Promise<string | null> {
        try {
            const dataApi: IDataAPICompanyAgent = {
                hotelGuid: hotelId,
                year: data.date && getYear(data.date).toString(),
                orderBy: orderBy,
                agentCompany: data.companyAgent
            }
            const fileURL = await PrintReportApi.printCompanyAgent(dataApi).toPromise();
            return fileURL
        } catch (error: any) {
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    static async filterDataFixCharges(hotelGuid: string): Promise<ITableFixCharge[]> {
        const dataRes = await HotelConfigApi.getAllFixChareByHotel(hotelGuid).toPromise();
        const newData: ITableFixCharge[] = [];
        if (dataRes) {
            dataRes.forEach((item: IFixCharge) => {
                newData.push({
                    id: item.id,
                    guid: item.guid,
                    autoPost: "x",
                    parent: item.parent,
                    ma: item.ma,
                    ten: item.ten,
                    soLuong: 0,
                    donGia: item.soTk5,
                    thanhTien: 0,
                    ghiChu: "",
                    hotelGuid: item.hotelGuid,
                    kieuNgay: 0,
                    soNgay: 0
                })
            });
            return newData;
        }
        return [];
    }
    //print account detail report 
    static async accountDetailReport(data: IAccountDetailReport, hotelId: string,
        selectAccount: string[], isVat?: boolean, isPayment?: boolean, username?: string): Promise<string | null> {
        try {
            let dataApi: IDataAPIAccountDetail = {
                hotelGuid: hotelId,
                dateFrom: Utils.convertToVNTimeZoneMbyMoment(data.time[0]),
                dateTo: Utils.convertToVNTimeZoneMbyMoment(data.time[1]),
                accountList: [],
                isVat: isVat ?? false,
                userName: username ?? "",
                isPayment: isPayment ?? false
            }
            if (!data.allAccount) {
                if (selectAccount[0] === FixChargeCode.GET_FB_MATK1) {
                    const res = await HotelConfigApi.getMaTKByHotelId(selectAccount[0], hotelId).toPromise()    //get data fix charge ma with food and beverage (matk1)
                    if (res) {
                        dataApi = { ...dataApi, accountList: res }
                    }
                }else if(selectAccount[0] === FixChargeCode.GET_PAYMENT_MATK1){
                    const res = await HotelConfigApi.getMaTKByHotelId("100", hotelId).toPromise()   //get data fix charge ma with payment (matk1)
                    if (res) {
                        dataApi = { ...dataApi, accountList: res }
                    }
                }
                else if(selectAccount[0] === FixChargeCode.GET_REBATE){
                    const res = FolioService.filterDataFixChargeByMaTK2(hotelId, selectAccount[0])  //get data fix charge ma with rebate (matk2) 
                    if(res){
                        const data: string[] = [];  //get ma fix charge
                        (await res).forEach((element: IFixCharge) => {  
                            data.push(element.ma)
                        });
                        dataApi = { ...dataApi, accountList: data }
                    }
                }else{
                    dataApi = { ...dataApi, accountList: selectAccount }
                }
            }
            console.log(dataApi);
            
            const fileURL = await PrintReportApi.printAccountDetail(dataApi).toPromise();
            return fileURL
        } catch (error: any) {
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    //get run night date
    static async getAuditDate(data: IRunNightAudit): Promise<NightAuditResponse | null> {
        try {
            const res = await CashierAPI.getNightAudit(data).toPromise();
            return res
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    //print guest folio report 
    static async guestFolioReport(data: IDataDateFromReport, hotelId: string, isDetail: boolean): Promise<string | null> {
        try {
            const dataApi: IDataAPIGuestFolio = {
                hotelGuid: hotelId,
                dateFrom: data.dateSchedule[0],
                dateTo: data.dateSchedule[1],
                isDetail: isDetail
            }
            const res = await PrintReportApi.printGuestFolio(dataApi).toPromise();
            return res
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    //print end of day report
    static async EODReport(data: IDataDateFromReport, hotelId: string, isRate: boolean, EODType: string,
        occupancy: string, guestVIP: string, isTypeEODWith: number): Promise<string | null> {
        try {
            let dataApi: IDataAPIEndOfDay = {
                hotelGuid: hotelId,
                isRate: isRate,
                dateFrom: data.dateSchedule[0],
                dateTo: data.dateSchedule[1],
                occupancy: Number.parseFloat(occupancy),
                type: EODType,
                isRateCode: false,
                vipGuestType: "",
                isMarket: false,
                isSource: false
            }
            if(isTypeEODWith === TypeEODWithOption.IsRateCode){
                dataApi = {...dataApi, isRateCode: true}
            }else if(isTypeEODWith === TypeEODWithOption.IsMarket){
                dataApi = {...dataApi, isMarket: true}
            }else if(isTypeEODWith === TypeEODWithOption.IsSource){
                dataApi = {...dataApi, isSource: true}
            }else if(isTypeEODWith === TypeEODWithOption.IsVIP){
                dataApi = {...dataApi, vipGuestType: guestVIP}
            }
            const res = await PrintReportApi.printEndOfDay(dataApi).toPromise();
            return res
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    //print nationality report
    static async nationalityReport(data: IDataNationalityReport, hotelId: string, monthType: string): Promise<string | null> {
        try {
            const dataApi: IDataAPINationality = {
                hotelGuid: hotelId,
                dateFrom: Utils.convertToVNTimeZoneMbyMoment(data.date[0]),
                dateTo: Utils.convertToVNTimeZoneMbyMoment(data.date[1]),
                type: monthType,
                orderBy: data.orderBy
            }
            const res = await PrintReportApi.printNationality(dataApi).toPromise();
            return res
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
    //print house keeping report
    static async housekeepingReport(data: IDataDateFromReport, hotelId: string, type: string,
        isDetail: boolean, isItems: boolean): Promise<string | null> {
        try {
            const dataApi: IDataAPIHousekeeping = {
                hotelGuid: hotelId,
                dateFrom: data.dateSchedule[0],
                dateTo: data.dateSchedule[1],
                type: type,
                isDetail: isDetail,
                isItems: isItems
            }
            const res = await PrintReportApi.printHousekeeping(dataApi).toPromise();
            return res
        } catch (error: any) {
            console.log(error);
            error.response && openNotification(NotificationStatus.Error, "Error", "No data!", error.status);
            return null;
        }
    }
}
export default PrintReportService;