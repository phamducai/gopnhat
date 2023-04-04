/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SYSTEM_CONSTANTS from "common/constants";
import { dataFOReservation, FormQueryParam } from "common/define-booking";
import { catchError, map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import HttpClient from "../http-client";
import {
    IGetReservatedRooms,
    ResReservatedRooms,
    IUserRoomDetail,
    ResGuestProfiles,
} from "common/define-api-booking";
import {
    TransactionRoomInfo,
    ReservationData,
    NewReservationData,
    NewWalkInData,
    CountOfRSVN,
    GuestHistoryYear,
    CompanyHistoryYear
} from "common/model-rsvn";
import { IRespTotalBooker, ListTsRoomPlan } from "common/model-booking";
import { UnAssignBody } from "common/front-desk/define-api-roomPlan";
import { BookingStat, IResArrivalsDepartures, RevenueInDaysData, SourceData } from './../../common/model-statistic';
import { IReqStatistic } from "common/dashboard/PropsDashboard";
import { RevenueBySourceMarket } from "common/dashboard/define-api-dashboard";
import { UpdateRoomRackData } from "common/front-desk/define-api-roomRack";
import { IGetTraceInHouse, IPostTraceInHouse, ValidateResponse } from "common/model-common";
import { throwError } from "rxjs";
export default class PkmApi {
    static host = "";

    static getReservation(): Observable<dataFOReservation[] | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RESERVATION}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as dataFOReservation[]) || null)
        );
    }
    static getReservationById(
        rsvnid: string
    ): Observable<ReservationData | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RESERVATION}/${rsvnid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as ReservationData) || null)
        );
    }
    static rsvnQueryParam(
        data: FormQueryParam,
        isGetHeader = false
    ): Observable<any | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_QUERYPARAM}`;
        return HttpClient.post(api, data, {}, isGetHeader).pipe(
            map((res) =>
                !isGetHeader ? (res as FormQueryParam) || null : (res as any) || null
            )
        );
    }

    static newReservation(data: NewReservationData): Observable<string | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RESERVATION}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static newAllotment(data: NewReservationData[]): Observable<string | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.ALLOTMENT}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }

    static getBookingByRsvnId(
        rSVNid: string
    ): Observable<NewReservationData | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.GET_BOOKING_BY_RSVNID}/${rSVNid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as NewReservationData) || null)
        );
    }

    // static infoRoomtype(
    //     hotelGuid: any,
    //     lstRoomTypes: any
    // ): Observable<ResRoomType[] | null> {
    //     const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.INV.ROOM_TYPE_INFO}/${hotelGuid}`;
    //     return HttpClient.get(api, lstRoomTypes).pipe(
    //         map((res) => (res as ResRoomType[]) || null)
    //     );
    // }

    static setStateForMultiTransactionRoomsReinstate(
        isIncludeChild: boolean,
        data: any[]
    ): Observable<unknown | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.CHANGE_STATUS_TRANSACTROOMS}/${isIncludeChild}`;
        return HttpClient.post(api, data).pipe(map((res) => res as any | null));
    }

    static changeMainGuest(
        oldMainGuest: string,
        newMainGuest: string
    ): Observable<unknown | null> {
        const endpoint =
            SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.CHANGE_MAIN_GUEST.replace(
                "OldMainTrRoomId",
                oldMainGuest
            ).replace("NewMainTrRoomId", newMainGuest);
        const api = `${PkmApi.host}/${endpoint}`;
        return HttpClient.get(api).pipe(map((res) => res as any | null));
    }
    static getReservatedRooms(data: IGetReservatedRooms): Observable<ResReservatedRooms[]> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RESERVATED_ROOMS}/${data.arivalDay}/${data.depatureDay}`;
        return HttpClient.get(api, { headers: { 'roomtypeIds': data.roomtypeIds } }).pipe(
            map((res) => {
                console.log('api res ',res);
                return res as ResReservatedRooms[]
            }), catchError(err => {
                console.log('error api ', err);
                return throwError(err)
            })
        );
    }
    static getReservatedRoomsCustom(data: IGetReservatedRooms): Observable<unknown | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RESERVATED_ROOMS_CUSTOM}/${data.arivalDay}/${data.depatureDay}`;
        return HttpClient.get(api, { headers: { 'roomtypeIds': data.roomtypeIds }}).pipe(
            map((res) => res as ResReservatedRooms | null)
        );
    }
    static setStateForMultiTransactionRooms(
        status: number,
        data: string[]
    ): Promise<unknown | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.CHANGE_STATUS_TRANSACTROOMS}`;
        return HttpClient.post(api, `${status}`, {
            headers: { transactRoomIds: data },
        })
            .pipe(map((res) => res as any | null))
            .toPromise();
    }

    static getTrsInfo(id: string): Promise<TransactionRoomInfo | null> {
        const endpoint =
            SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.GET_TRS_INFO.replace("{id}", id);
        const api = `${PkmApi.host}/${endpoint}`;
        return HttpClient.get(api)
            .pipe(map((res) => res as any | null))
            .toPromise();
    }

    static getTrsInfoObservable(id: string): Observable<unknown | null> {
        const endpoint =
            SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.GET_TRS_INFO.replace("{id}", id);
        const api = `${PkmApi.host}/${endpoint}`;
        return HttpClient.get(api).pipe(map((res) => res as any | null));
    }


    static getRoomAndGuestByDate(id: string, date: any): Observable<IResArrivalsDepartures> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.STATISTIC.GET_ROOM_AND_GUEST_BY_DATE}`;
        return HttpClient.post(api, { "hotelGuid": id, "selectedDate": date }).pipe(map((res) => (res as any)));
    }

    static getTrsByStatus(data: UnAssignBody): Observable<any | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.GET_TRANSACTION_ROOM_UNASSIGN}`
        return HttpClient.post(api, data, {}, true).pipe(
            map((res) => res as any))
    }

    static newWalkIn(data: NewWalkInData): Observable<string | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.WALK_IN}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }

    static getCountOfRSVN(hotelId: string): Observable<CountOfRSVN> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.COUNT_OF_RSVN.replace('{hotelId}', hotelId)}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as CountOfRSVN))
        );
    }
    static getBookingStat(rsvnId: string): Observable<BookingStat> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.STAT_BOOKING}/${rsvnId}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as BookingStat))
        );
    }
    static getUserRoomDetail(data: IUserRoomDetail): Observable<ListTsRoomPlan[]> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.USER_ROOM_DETAIL}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as ListTsRoomPlan[]))
        )
    }
    static getHasUserRoomByRoomTypeId(data: IUserRoomDetail): Observable<string[]> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.HAS_USER_ROOM}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string[]))
        )
    }
    static getRevenueInDay(data: IReqStatistic): Observable<RevenueInDaysData[]> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.STATISTIC.REVENUE_DAY}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as RevenueInDaysData[])));
    }
    static getRevenuebySourceMarket(data: RevenueBySourceMarket): Observable<SourceData[]> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.STATISTIC.SOURCE_MARKET}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as any[])));
    }
    static getGuestHistoryYear(data: GuestHistoryYear, isGetHeader = false): Observable<any | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.GET_GUEST_HISTORY_YEAR}`;
        return HttpClient.post(api, data, {}, isGetHeader).pipe(
            map((res) => (res as any) || null)
        );
    }
    static getCompanyHistoryYear(data: CompanyHistoryYear, isGetHeader = false): Observable<any | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.GET_COMPANY_AGENT_HISTORY_YEAR}`;
        return HttpClient.post(api, data, {}, isGetHeader).pipe(
            map((res) => (res as any) || null)
        );
    }
    static getShareGuestByTRSRoom(Trsroom: string): Observable<ResGuestProfiles[] | []> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.GET_SHARESGUEST_TRSROOM}?tsRoomId=${Trsroom}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as ResGuestProfiles[]) || [])
        );
    }
    static getDetailAllRoom(data: any, listRoomGuid: string[]): Observable<ListTsRoomPlan[] | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_SEARCH_ROOMRACK}`;
        return HttpClient.post(api, data, { headers: { 'lstRooms': listRoomGuid } }).pipe(
            map((res) => (res as ListTsRoomPlan[]) || null)
        );
    }
    static updateTaskRoomRack(data: UpdateRoomRackData): Observable<ValidateResponse | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_UPDATE_ROOMRACK}`;
        return HttpClient.put(api, data).pipe(map((res) => (res as any) || null));

    }
    static getTotalRoomBookedByRoomTypeId(listRoomTypeId: string[], arrivalDate: Date, departureDate: Date): Observable<IRespTotalBooker[] | []> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.TOTAL_ROOM_BOOKED}/${arrivalDate}/${departureDate}`;
        return HttpClient.get(api, { headers: { 'roomtypeIds': listRoomTypeId } }).pipe(map((res) => (res as IRespTotalBooker[]) || []));

    }
    static postTraceInHouse(listTraceInHouse: IPostTraceInHouse[]): Observable<string | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.POST_TRACE_IN_HOUSE}`;
        return HttpClient.post(api, listTraceInHouse).pipe(map((res) => (res as string) || null));

    }
    static getTraceInHouseByTsRoomId(tsRoomId: number): Observable<IGetTraceInHouse[] | null> {
        const api = `${PkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.GET_TRACE_IN_HOUSE}/${tsRoomId}`;
        return HttpClient.get(api).pipe(map((res) => (res as IGetTraceInHouse[]) || null));

    }
}
