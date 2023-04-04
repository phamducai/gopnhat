/* eslint-disable @typescript-eslint/no-explicit-any */
import SYSTEM_CONSTANTS from 'common/constants';
import { ResponseListHotel } from 'common/define-identity';
import { Observable } from 'rxjs/internal/Observable';
import { map } from "rxjs/operators";
import HttpClient from "../http-client";


export default class ListHotelApi {
    static host = "";
    
    // eslint-disable-next-line
    static getHotel(data:any): Observable<ResponseListHotel | null> {
        const api = `${ListHotelApi.host}/${SYSTEM_CONSTANTS.API.LISTHOTEL.HOTEL}/${data.departmentId}`
        return HttpClient.get(api,{ headers: { Authorization : `${data.token}` }}).pipe(
            map((res) => res as ResponseListHotel || null)
        );
    }

}