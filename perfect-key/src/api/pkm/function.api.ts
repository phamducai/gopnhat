/* eslint-disable */
import SYSTEM_CONSTANTS from "common/constants";
import { map } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import HttpClient from "../http-client";
import { GuestProfile } from "common/model-profile";
import { IQueryParamRunNight, ListTsRoomPlan } from "common/model-booking";
import { PostBreakShared } from "common/model-inventory";
import { AssignRoom, DataCEditRsvn, DataGetTracerMessage, IDataSearchMessage, IMessage, IMessageByOption, ITracerMessage, ITracerMessageByOption, ResDataCEditRsvn, SearchQueryMessage, SearchQueryTracerMessage } from 'common/model-rsvn';
import { EditRoomGroup, InforExtraBed, PostExtraBed, ResCheckInToGroup } from "common/model-rsvn-edit";
import { DMColorType } from "common/shared/dmuccolor.model";
import { IRoomRevenue } from "common/end-of-day/model-runNight";
import Utils from "common/utils";
import { IQueryParam } from "common/define-booking";
import { ValidateResponse } from "common/model-common";
import { IGetDmucTuyChon } from "common/model-hcfg";
export default class functionPkmApi {
    static host = "";

    //TransactRoom
    static ActiveStatusTransactRoom(data: any, status: string): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_ACTIVE}/${status}`;
        return HttpClient.put(api, data).pipe(map((res) => (res as any) || null));
    }
    //Combine Guest
    static CombineGuestTransctRoom(data: any): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_COMBINE_GUEST}`;
        console.log(data);
        return HttpClient.put(api, data).pipe(map((res) => (res as any) || null));
    }

    // get rsvn data and all child data
    static getGuestProfilesRsvnData(data: any): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_DATA}/${data}`;
        return HttpClient.get(api).pipe(map((res) => (res as any) || null));
    }
    // get transactroom pm
    static getTransactRoomByID(tsRoomId: any): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.GET_TRANSACTROOM_BY_ID}/${tsRoomId}`;
        return HttpClient.get(api).pipe(map((res) => (res as any) || null));
    }
    // post transactroom pm
    static addPmToGroup(rSVNId: string, data: any, pmRoomId: string, isCreateGrm: boolean): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.ADD_PM}/${rSVNId}/${pmRoomId}/${isCreateGrm}`;
        return HttpClient.post(api, data, { headers: { pmRoomId: pmRoomId } }).pipe(
            map((res) => (res as any) || null)
        );
    }
    // cancel transactroom pm
    static cancelPmToGroup(roomTypeId: string, rSVNId: string): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.CANCEL_PM}/${rSVNId}`;
        return HttpClient.post(api, `"${roomTypeId}"`, {
            headers: { rSVNId: rSVNId},
        }).pipe(map((res) => (res as any) || null));
    }
    static addGroupMaster(rSVNId: string, trRoomId: string): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.ADD_GROUP_MASTER}/${rSVNId}/${trRoomId}`;
        return HttpClient.post(api, "data", {
            headers: { trRoomId: trRoomId},
        }).pipe(map((res) => (res as any) || null));
    }
    static unsetGroupMaster(rSVNId: string, trRoomId: string): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.UNSET_GROUP_MASTER}/${rSVNId}/${trRoomId}`;
        return HttpClient.post(api, {}).pipe(map((res) => (res as any) || null));
    }
    static addSharedGuest(data: any): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.ADD_SHARED_GUEST}`;
        return HttpClient.put(api, data).pipe(map((res) => (res as any) || null));
    }
    static addCommentTransactionRoom(trRoomId: string, data: string): Observable<string | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.ADD_COMMENT_TRANSACTROOM}/${trRoomId}`;
        return HttpClient.post(api, `"${data}"`).pipe(
            map((res) => (res as string) || null)
        );
    }
    static setGroupStatusRsvn(data: any, IsIncludeChild: boolean, isCheckin: boolean): Observable<string | null> {
        // const api = `http://localhost:2004/${SYSTEM_CONSTANTS.API.RSVN.SET_STATUS_GROUP_RSVN}/${status}`;
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.SET_STATUS_RSVN}/${IsIncludeChild}/${isCheckin}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }

    static confirmTSRoom(data: any): Observable<unknown | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.CONFIRM}/${data}`;
        return HttpClient.post(api, true).pipe(map((res) => (res as any) || null));
    }
    static searchGroupListRoomPlan(data: any, listRoomGuid: string[]): Observable<ListTsRoomPlan[] | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_SEARCH_ROOM_PLAN}`;
        return HttpClient.post(api, data, { headers: { 'lstRooms': listRoomGuid} }).pipe(
            map((res) => (res as ListTsRoomPlan[]) || null)
        );
    }
    static breakShared(data: PostBreakShared, isValidated: boolean): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.BREAK_SHARED}`;
        //const api = `http://localhost:2104/${SYSTEM_CONSTANTS.API.RSVN.BREAK_SHARED}`;
        return HttpClient.post(api, data, { headers: { 'IsValidated': isValidated} }).pipe(
            map((res) => (res as ListTsRoomPlan[]) || null)
        );
    }
    static assignRoom(data: AssignRoom[]): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.ASSIGNROOM}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as any) || null));
    }
    static getDataTsRoomEditByGuid(tsRoomGuid: string, isGroup: boolean): Observable<ResDataCEditRsvn | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.TSROOM_EDIT_BY_ID}/${tsRoomGuid}/${isGroup}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as ResDataCEditRsvn) || null)
        );
    }
    static editGroupReservation(data: DataCEditRsvn, guid: string): Observable<string | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.UPDATE_GROUP_RESERVATION}/${guid}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static editDataTsRoomEditByGuid(data: DataCEditRsvn, tsRoomGuid: string, isExtraGuest: boolean): Observable<string | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.UPDATE_RESERVATION}/${tsRoomGuid}/${isExtraGuest}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static editRoomGroup(data: EditRoomGroup, tsRoomGuid: string, isExtraGuest: boolean): Observable<string | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.UPDATE_ROOM_GROUP}/${tsRoomGuid}/${isExtraGuest}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }

    static unAssignRoom(transactIdList: string[]): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM_GROUP.UNASSIGN}`;
        return HttpClient.get(api, { headers: { transactionGuids: transactIdList} }).pipe(
            map((res) => (res as any) || null)
        );
    }

    static updateGroupRSVN(data: any, rsvnid: string): Observable<string | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.UPDATE_GROUP_RSVN}/${rsvnid}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static updateTransactRoom(transactionGuid: string[], value: boolean): Observable<string | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.UPDATE}`;
        return HttpClient.put(api, { transactionGuid, doNotMove: value }).pipe(
            map((res) => (res as string) || null)
        );
    }

    static getDMucColorType(): Observable<DMColorType[] | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.DMUC_COLOR_TYPE}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as DMColorType[]) || null)
        );
    }
    static getDMucTuyChonAmoutBed(data: PostExtraBed): Observable<InforExtraBed | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.DMUC_TUY_CHON_EXTRABED}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as any) || null)
        );
    }
    static getDMucTuyChonServiceAndVat(hotelGuid: string): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.DMUC_TUY_CHON_SERVICE_VAT}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => (res as any) || null)
        );
    }
    static updateSmallEditGroup(data: any, rsvnId: string, isChild: boolean): Observable<InforExtraBed | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.SMALL_FUNC_EDIT_GROUP}/${rsvnId}/${isChild}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as any) || null)
        );
    }
    static checkInToRSVN(listTsRoom: string[], data: DataCEditRsvn, isExtraGuest: boolean): Observable<ValidateResponse | null> {
        //const api = `http://localhost:2104/${SYSTEM_CONSTANTS.API.RSVN.CHECK_IN_TO_RSVN}/${isExtraGuest}`;
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.CHECK_IN_TO_RSVN}/${isExtraGuest}`;
        return HttpClient.put(api, data, { headers: { 'transactionGuids': listTsRoom} }).pipe(
            map((res) => (res as ValidateResponse) || null)
        );
    }
    static checkInToGroup(rsvnId: string, businessDate: Date): Observable<ResCheckInToGroup | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.CHECK_IN_TO_GROUP}/${rsvnId}`;
        return HttpClient.put(api, businessDate).pipe(
            map((res) => (res as any) || null)
        );
    }

    static EditGuestInTSRoom(oldGuestId: string, newGuestId: string): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.EDIT_GUEST}/${oldGuestId}/NewGuestId/${newGuestId}`;
        return HttpClient.put(api, { headers: { oldGuestId, newGuestId} }).pipe(
            map((res) => (res as any) || null)
        );
    }

    static EditCompany(oldCompanyId: string, newCompanyId: string): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.TRANSACTROOM.EDIT_COMPANY}/${oldCompanyId}/NewCompanyAgentGuid/${newCompanyId}`;
        return HttpClient.put(api, { headers: { oldCompanyId, newCompanyId} }).pipe(
            map((res) => (res as any) || null)
        );
    }
    static PostTracerMessageByOption(data: ITracerMessageByOption): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.POST_TRACER_MESSAGE_OPTION}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as any) || null)
        );
    }
    static PostTracerMessage(data: ITracerMessage): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.POST_TRACER_MESSAGE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as any) || null)
        );
    }
    static GetTracerMessage(data: DataGetTracerMessage): Observable<ITracerMessage | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.GET_TRACER_MESSAGE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as ITracerMessage) || null)
        );
    }
    static SeenTracerMessage(data: ITracerMessage): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.POST_TRACER_MESSAGE}/${data.id}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as any) || null)
        );
    }
    static SearchTracerMessage(data: SearchQueryTracerMessage): Observable<ITracerMessage[] | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.SEACH_TRACER_MESSAGE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as ITracerMessage[]) || null)
        );
    }
    static PostMessageByOption(data: IMessageByOption): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.POST_MESSAGE_OPTION}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as any) || null)
        );
    }
    static SearchMessage(data: SearchQueryMessage): Observable<IDataSearchMessage[] | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.SEACH_MESSAGE}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as IDataSearchMessage[]) || null)
        );
    }
    static UpdateMessage(data: IMessage, id: string): Observable<any | null> {
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RSVN_TRACER.POST_MESSAGE}/${id}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as any) || null)
        )
    }
    static getRoomRevenue(hotelGuid: string, businessDate: Date, listTsRoomId: string[]): Observable<IRoomRevenue | null>{
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RUN_NIGHT.ROOM_REVENUE}/${businessDate}/${hotelGuid}`;
        return HttpClient.get(api, { headers: {"lstTsRoomIds": listTsRoomId}}).pipe(
            map((res) => (res as IRoomRevenue) || null)
        );
    }
    static checkOutGuestOrRoom(tsRoomId: string, isExtraGuest: boolean, businessDate: Date): Observable<boolean | null>{
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.CHECK_OUT_ROOM}/${tsRoomId}/${isExtraGuest}`;
        return HttpClient.put(api, businessDate).pipe(
            map((res) => (res as boolean) || null)
        );
    }
    static checkOutGroup(rsvnId: string, businessDate: Date): Observable<boolean | null>{
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.CHECK_OUT_GROUP}/${rsvnId}`;
        return HttpClient.put(api, businessDate).pipe(
            map((res) => (res as boolean) || null)
        );
    }
    static getInforRunNightByParam(queryData: IQueryParamRunNight): Observable<any | null>{
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.RUN_NIGHT.GET_INFOR_NIGHT_BY_QUERY}`;
        return HttpClient.post(api, queryData, {}, true).pipe(
            map((res) => res as any | null
        ));
    }
    static getDmucTuyChonByMaAndHotelId(ma: string, hotelId: string): Observable<IGetDmucTuyChon | null>{
        const api = `${functionPkmApi.host}/${SYSTEM_CONSTANTS.API.RSVN.DMUC_TUY_CHON_BY_MA}/${ma}/${hotelId}`;
        return HttpClient.get(api).pipe(
            map((res) => res as IGetDmucTuyChon | null
        ));
    }
}
