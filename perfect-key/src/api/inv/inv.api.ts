/* eslint-disable @typescript-eslint/no-explicit-any */
import SYSTEM_CONSTANTS from 'common/constants';
import { ResRoom, ResRoomType } from 'common/define-api-booking';
import { IListStatusRoomHskp } from 'common/model-hskp';
import { IUpdateStatusRoom, NumberOfRooms, PaginationRoom, RoomInfo, RoomInfoUpdateStatus, RoomsInARoomType } from 'common/model-inventory';
import { HouseKepping } from 'common/model-statistic';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import HttpClient from '../http-client';
export default class InventoryApi {
    public static inventoryHost: string;
    inventoryHost = '';

    static getNumberOfRoomsInEachRoomTypes(hotelGuid: string): Observable<NumberOfRooms[]> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.ALL_ROOMS_IN_ROOMTYPE}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res as NumberOfRooms[])
        );
    }

    static getRoomsInRoomTypes(hotelGuid: string, lstRoomTypes: string[]): Promise<RoomsInARoomType[]> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.ROOMS_IN_ROOMTYPES}/${hotelGuid}`;
        return HttpClient.get(api, { headers: { 'lstRoomTypes': lstRoomTypes } }).pipe(
            map((res) => res as RoomsInARoomType[])
        ).toPromise();
    }
    static getAvailableRooms(hotelGuid: string, roomTypeGuid: string, arrivalDate: string | Date, departureDate: string | Date): Promise<RoomInfo[] | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.AVAILABLE_ROOMS}`;
        return HttpClient.post(api, { hotelGuid, roomTypeGuid, arrivalDate, departureDate }).pipe(
            map((res) => res as RoomInfo[] || null)
        ).toPromise();
    }
    static getAllRoomInHotel(data: PaginationRoom, containPM: boolean): Observable<any | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.ROOM}/${containPM}`;
        //const api = `http://localhost:2102/${SYSTEM_CONSTANTS.API.INV.ROOM}`;
        return HttpClient.post(api, data, {}, true).pipe(map((res) => (res as any) || null));
    }
    static getAllFLoorByGuid(hotelGuid: string): Observable<number[] | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.FLOOR_BY_HOTEL}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as number[]) || null));
    }
    static searchByRoomNo(hotelGuid: string, roomNo: string): Observable<RoomInfo[] | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.SEARCH_BY_ROOM_NO}/${hotelGuid}/${roomNo}`;
        return HttpClient.get(api).pipe(map((res) => (res as RoomInfo[]) || null));
    }
    static updateStatus(transactionGuid: string, data: RoomInfoUpdateStatus): Observable<boolean | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.EDITROOM}/${transactionGuid}`;
        return HttpClient.put(api, data).pipe(map((res) => (res as boolean) || null));
    }
    static invRoom(data: PaginationRoom): Observable<unknown | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.ROOM}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as ResRoom) || null));
    }
    static invRoomtype(data: string): Observable<unknown | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.ROOM_TYPE}/${data}`;
        return HttpClient.get(api).pipe(map((res) => (res as ResRoomType) || null));
    }
    static getListHouseKeeping(hotelGuid: string): Observable<HouseKepping> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.STATISTIC.HOUSE_KEEPING}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as HouseKepping)));
    }
    static getTotalRoomByHotelId(hotelGuid: string): Observable<number> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.TOTAL_ROOM_HOTEL}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as number)));
    }
    static getListStatusRoomByHotel(): Observable<IListStatusRoomHskp[] | []> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.GET_LIST_STATUS_ROOM}`;
        return HttpClient.get(api).pipe(map((res) => (res as IListStatusRoomHskp[] | [])));
    }
    static getRoomTypePMId(hotelGuid: string): Observable<string | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.GET_ROOM_TYPE_PM_ID}/${hotelGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as string | null)));
    }
    static updateStatusRoom(data: IUpdateStatusRoom): Observable<boolean | null> {
        const api = `${InventoryApi.inventoryHost}/${SYSTEM_CONSTANTS.API.INV.UPDATE_STATUS_ROOM}`;
        return HttpClient.put(api, data).pipe(map((res) => (res as boolean | null)));
    }
}