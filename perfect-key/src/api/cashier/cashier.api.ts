import { IDataCheckBalanceDTO } from './../../common/cashier/model-cashier';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPostingPaymentDTO } from './../../common/cashier/model-folio';
import { IPostingFoodAndOther, IPostingLaundry, IPostingAdvanceRoomCharge, IPostingSplit, IPostingCorrection, AmountRoomChat, IPostingMove, FilterGroupFolio } from './../../common/cashier/model-folio';
import { IGetDataFolio, IGetGroupFolio, IGroupFolio, FilterFolio } from 'common/cashier/model-cashier';
import { IPostingMiniBar, ICombineFolio } from 'common/cashier/model-folio';
import SYSTEM_CONSTANTS from 'common/constants';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import HttpClient from '../http-client';
import { DataAmountRoomChat } from './../../common/cashier/model-cashier';
import { IRoomChargeRunNight, IRunNightAudit, IRunNightCommon } from 'common/end-of-day/model-runNight';
import { IPostTraceFolio, ValidateResponse } from 'common/model-common';
import { NightAuditResponse } from 'common/report/define-report';
export default class CashierAPI {
    static host = "";
    
    static getGroupFolioByInHouseId(inHouseGuid: string): Observable<IGetGroupFolio[] | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.GROUP_FOLIO}?inHouseId=${inHouseGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as IGetGroupFolio[]) || null)
        );
    }
    static postGroupFolioByInHouseId(data: IGroupFolio[]): Observable<string[] | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.GROUP_FOLIO}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string[]) || null)
        );
    }
    static getAllDataFolio(data: FilterFolio): Observable<any | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.GET_DATA_FOLIO}`;
        return HttpClient.post(api, data, {}, true).pipe(
            map((res) => res || null)
        );
    }
    static getVoucherIdMiniBar(hotelGuid: string): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.NEW_VOUCHER_MINIBAR}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as string) || null)
        );
    }
    static postingMiniBar(data: IPostingMiniBar): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POSTING_MINI_BAR}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static getVoucherIdLaundry(hotelGuid: string): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.NEW_VOUCHER_LAUNDRY}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as string) || null)
        );
    }
    static postingLaundry(data: IPostingLaundry): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POSTIN_LAUNDRY}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static postingFoodAndOtherService(data: IPostingFoodAndOther): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_FOODANDBEVERAGE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static postingRoomCharger(data: IPostingFoodAndOther): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_ROOM_CHARGE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static postingAdvanceRoomCharger(data: IPostingAdvanceRoomCharge): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_ADVANCE_ROOM_CHARGE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static postingRebate(data: IPostingFoodAndOther): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_REBATE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        )
    }
    static getVoucherNumberFolio(hotelGuid: string): Observable<number> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.NEW_VOUCHER_FOOD_OTHERSERVICE}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as number))
        );
    }
    static combineFolio(data: ICombineFolio): Observable<number> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.COMBINE_FOLIO}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as number))
        );
    }
    static getDataFolioByFolioGuid(folioGuid: string): Observable<IGetDataFolio | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.GET_FOLIO}/${folioGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as IGetDataFolio) || null)
        );
    }
    static postingSplit(data: IPostingSplit): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_SPLIT}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        )
    }
    static postingCorrection(data: IPostingCorrection): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_CORRECTION}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        )
    }
    static getRoomChatData(data: AmountRoomChat): Observable<DataAmountRoomChat | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.AMOUNT_ROOMCHAT}/${data.groupFolioId}/${data.maTk}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as DataAmountRoomChat) || null))
    }

    static postingMove(data: IPostingMove): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_MOVE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        )
    }
    static filterGroupFolio(data: FilterGroupFolio): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.FILTER_GROUP_FOLIO}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        )
    }
    static getTotalRoomChargeByNight(hotelGuid: string): Observable<IRoomChargeRunNight | null>{
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.RUN_NIGHT.ROOM_CHARGE}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as IRoomChargeRunNight) || null)
        )
    }
    static postRunNightByHotel(data: IRunNightCommon): Observable<IRoomChargeRunNight | null>{
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.RUN_NIGHT.PROCEED_RUN_NIGHT}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as IRoomChargeRunNight) || null)
        )
    }
    static getBussinessDate(hotelGuid: string): Observable<string | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.RUN_NIGHT.GET_BUSSINESS_DATE}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as string) || null));
    }
    static checkBalanceChecOut(lstTsRoomId: string[]): Observable<IDataCheckBalanceDTO[] | []> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.CHECK_BALANCE_GUEST_CHECKOUT}`;
        return HttpClient.get(api, { headers: { 'tsRoomIds': lstTsRoomId}}).pipe(map((res) => (res as IDataCheckBalanceDTO[]) || []));
    }
    static postPaymentFolio(data: IPostingPaymentDTO): Observable<ValidateResponse | null> {
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.POST_PAYMENT}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as ValidateResponse) || null));
    }
    static getNightAudit(data: IRunNightAudit): Observable<NightAuditResponse | null>{
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.RUN_NIGHT.GET_NIGHT_AUDITOR}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as NightAuditResponse) || null)
        )
    }
    static postTraceFolio(data: IPostTraceFolio[]): Observable<any | null>{
        const api = `${CashierAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.TRACE.TRACE_FOLIO}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as NightAuditResponse) || null)
        )
    }
}