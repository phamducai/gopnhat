/* eslint-disable @typescript-eslint/no-explicit-any */
import SYSTEM_CONSTANTS from 'common/constants';
import { ChannelAllotment, HlsHotel, RatePlanRes, RoomTypeMapping, SetInventoryReq, SetInventoryRes } from 'common/define-hls';
import { Observable } from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import HttpClient from "../http-client";


export default class HlsApi {
    static host = "";

    // eslint-disable-next-line
    static getHotel(): Observable<HlsHotel[] | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.HLS_HOTEL}`
        return HttpClient.get(api).pipe(
            map((res) => res as HlsHotel[] || null)
        );
    }
    static getRatePlan(hotelId: string): Observable<RatePlanRes | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.RATE_PLAN}`
        return HttpClient.post(api, { hotelId, lang: "en" }).pipe(
            map((res) => res as RatePlanRes || null)
        );
    }
    static getAlreadyMapping(): Observable<RoomTypeMapping[] | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.HOTEL_ROOMTYPE_MAPPING}`
        return HttpClient.get(api).pipe(
            map((res) => res as RoomTypeMapping[] || null)
        );
    }
    static mappingRoomType(data: RoomTypeMapping): Observable<[] | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.HOTEL_ROOMTYPE_MAPPING}`
        return HttpClient.post(api, data).pipe(
            map((res) => res as [] || null)
        );
    }
    static removeMapping(mappingGuid: string): Observable<string | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.HOTEL_ROOMTYPE_MAPPING}/${mappingGuid}`
        return HttpClient.delete(api).pipe(
            map((res) => res as string || null)
        );
    }
    static getLastAllotmentQuantity(hotelGuid: string, roomTypeHls: string): Observable<ChannelAllotment | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.LAST_ALLOTMENT_QUANTITY}/${hotelGuid}/${roomTypeHls}`
        return HttpClient.get(api).pipe(
            map((res) => res as ChannelAllotment || null)
        );
    }
    static saveInventory(data: SetInventoryReq): Observable<SetInventoryRes | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.SET_INVENTORY}`
        return HttpClient.post(api, data).pipe(
            map((res) => res as SetInventoryRes || null)
        );
    }
    static createDataAllotment(data: ChannelAllotment, dateFrom: string, dateTo: string): Observable<string | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.CREATE_ALLOTMENT}/${dateFrom}/${dateTo}`
        return HttpClient.post(api, data).pipe(
            map((res) => res as string || null)
        );
    }
    static getDataAllotment(hotelGuid: string, dateFrom: string, dateTo: string): Observable<ChannelAllotment[] | null> {
        const api = `${HlsApi.host}/${SYSTEM_CONSTANTS.API.OTA_HLS.GET_ALLOTMENT}/${dateFrom}/${dateTo}/${hotelGuid}`
        return HttpClient.get(api).pipe(
            map((res) => res as ChannelAllotment[] || null)
        );
    }

}