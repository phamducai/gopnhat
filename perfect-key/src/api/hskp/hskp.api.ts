/* eslint-disable @typescript-eslint/no-explicit-any */
import SYSTEM_CONSTANTS from 'common/constants';
import { IGetHSKBlockRoom, IHSKBlockRoom } from 'common/model-hskp';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import HttpClient from '../http-client';
export default class HskpAPI {
    public static hostHskp: string;
    
    static postHSKPBlockRoom(data: IHSKBlockRoom): Observable<string | null> {
        const api = `${HskpAPI.hostHskp}/${SYSTEM_CONSTANTS.API.HSKP.BLOCK_ROOM}`;
        return HttpClient.post(api, data).pipe(
            map((res) => res as string || null)
        );
    }
    static getBlockRoomById(bussinessDate: Date, roomId: string, hotelId: string): Observable<IGetHSKBlockRoom | null> {
        const api = `${HskpAPI.hostHskp}/${SYSTEM_CONSTANTS.API.HSKP.BLOCK_ROOM}/${bussinessDate}/${roomId}/${hotelId}`;
        return HttpClient.get(api).pipe(
            map((res) => res as IGetHSKBlockRoom || null)
        );
    }
    static updateBlockRoomById(data: IHSKBlockRoom, blockRoomId: string): Observable<string | null> {
        const api = `${HskpAPI.hostHskp}/${SYSTEM_CONSTANTS.API.HSKP.BLOCK_ROOM}/${blockRoomId}`;
        return HttpClient.put(api, data).pipe(
            map((res) => res as string || null)
        );
    }
}