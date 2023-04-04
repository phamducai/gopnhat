import { ExchangeRate, IKhachHang, ITableLaundry } from './../../common/model-hcfg';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import SYSTEM_CONSTANTS from "common/constants";
import HttpClient from 'api/http-client';
import { IFixCharge, IMiniBarAndLaundry } from 'common/model-hcfg';
import { ResponseListHotel } from 'common/define-identity';
import { IRateCode as RateCode } from "common/define-reversation";
import { IPaymentMethod as PaymentMethod, RsvnType } from "common/define-reversation";
import { IInForRunNightRespDTO, InForRunNightReqDTO } from 'common/end-of-day/model-runNight';
import { IDonViTienTe } from 'common/model-common';

export default class HotelConfigApi {
    static hcfgHost = '';

    static getAllFixChareByHotel(hotelGuid: string): Observable<IFixCharge[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.FIX_CHARGES}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res as IFixCharge[] || null)
        )
    }

    static rsvnPaymentMethod(data: string): Observable<PaymentMethod | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.RSVN_PAYMENT}/${data}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as PaymentMethod) || null)
        );
    }

    static getHotel(data: string): Observable<ResponseListHotel | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.OPERATOR.ACTIVEHOTEL}`
        return HttpClient.get(api).pipe(
            map((res) => res as ResponseListHotel || null)
        );
    }

    static rsvnRateCode(data: string): Observable<RateCode | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.RSVN_RATECODE}/${data}`;
        return HttpClient.get(api).pipe(map((res) => (res as RateCode) || null));
    }
    static rsvnType(data: string): Observable<RsvnType | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.RSVN_TYPE}/${data}`;
        return HttpClient.get(api).pipe(map((res) => (res as RsvnType) || null));
    }

    static getHcfgInfo(data: string): Observable<unknown | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.RESERVATION_HCFG}/${data}`;
        return HttpClient.get(api).pipe(map((res) => (res as any) || null));
    }
    static getAllMinibarById(hotelGuid: string): Observable<IMiniBarAndLaundry[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.DMUC_MINIBAR}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as IMiniBarAndLaundry[]) || null));
    }
    static getAllHangHoaDichVuById(hotelGuid: string): Observable<IMiniBarAndLaundry[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.DMUC_HANGHOADICHVU}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as IMiniBarAndLaundry[]) || null));
    }
    static getAllQuanAoGiatLaVuById(hotelGuid: string): Observable<ITableLaundry[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.DMUC_QUANAOGIATLA}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as ITableLaundry[]) || null));
    }
    static getDmucOutLet(hotelGuid: string): Observable<ITableLaundry[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.DMUC_OUTLET}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as ITableLaundry[]) || null));
    }
    static getDmucDepartment(hotelGuid: string): Observable<ITableLaundry[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.DMUC_DEPARTMENT}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as ITableLaundry[]) || null));
    }
    static getExchangeRate(hotelGuid: string, currency1: number, currency2: number): Observable<ExchangeRate | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.OPERATOR.EXCHANGE_RATE}`;
        return HttpClient.post(api, { hotelGuid, currency1, currency2 }).pipe(
            map((res) => (res as ExchangeRate) || null));
    }
    static postExchangeRate(data: ExchangeRate): Observable<string[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.OPERATOR.POST_EXCHANGE_RATE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string[]) || null));
    }
    static getInfoRunNight(hotelGuid: string, data: InForRunNightReqDTO[]): Observable<IInForRunNightRespDTO[] | null> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.OPERATOR.INFOR_RUNIGHT}/${hotelGuid}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as IInForRunNightRespDTO[]) || null));
    }
    
    static getKhachHangInfo(): Observable<IKhachHang | null>{
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.OPERATOR.KHACH_HANG}`;
        return HttpClient.get(api).pipe(map((res) => (res as IKhachHang) || null));
    }
    static checkInValidCard(ccNumber: string): Observable<string | null>{
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.OPERATOR.CHECK_INVALID_CARD}/${ccNumber}`;
        return HttpClient.get(api).pipe(map((res) => (res as string) || null));
    }
    static getMaTKByHotelId(maTK1: string, hotelGuid: string): Observable<string[] | []> {
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.DMUC_GETMATK1}/${maTK1}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as string[]) || []));
    }
    static getListDonViTienTe(hotelGuid: string): Observable<IDonViTienTe[] | []>{
        const api = `${HotelConfigApi.hcfgHost}/${SYSTEM_CONSTANTS.API.HCFG.OPERATOR.GET_LIST_DON_VI_TIEN_TE}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as IDonViTienTe[]) || []));
    }
}