import { IQueryParam, FormQueryParam } from './../../common/define-booking';
import functionPkmApi from "api/pkm/function.api";
import PkmApi from "api/pkm/pkm.api";
import GLobalPkm from 'common/global';
import { ResDataCEditRsvn } from 'common/model-rsvn';
import { TransactRoom } from 'common/model-booking';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';

/* eslint-disable */
class search {
    static async editGroupRsvn(idRsvn: string): Promise<any> {
        return await PkmApi.getBookingByRsvnId(idRsvn).toPromise();
    }
    static async getTsRomById(transactRoomId: string): Promise<TransactRoom | null> {
        try {
            return await functionPkmApi.getTransactRoomByID(transactRoomId).toPromise() as TransactRoom;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response.message, "", error.status);
            return null;
        }
        
    }
    static async addPM(transactRoomId: string): Promise<any> {
        return await functionPkmApi.getTransactRoomByID(transactRoomId).toPromise();
    }
    static async getDataTsRoomByGuid(transactRoomId: string, isGroup = false): Promise<ResDataCEditRsvn | null> {
        try {
            return await functionPkmApi.getDataTsRoomEditByGuid(transactRoomId, isGroup).toPromise();
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response.message, "", error.status);
            return null;
        }
    }
    static async apiSearch(idRsvn: string, hotelGuid: string): Promise<any> {
        const data = {
            pageNumber: 1,
            pageSize: 50,
            hotelGuid: hotelGuid,
            isOnlyMainGuest: false,
            rsvnId: idRsvn,
            rsvnNo: 0,
            rsvnCode: "",
            room: "",
            status: 5,
            companiesId: "00000000-0000-0000-0000-000000000000",
            profileIds: [],
            companyAgentGuid: "00000000-0000-0000-0000-000000000000",
            roomType: "00000000-0000-0000-0000-000000000000",
            groupCode: "",
            arrivalDates: [],
            departureDates: []
        }
        return await PkmApi.rsvnQueryParam(data).toPromise();
    }

    static async searchQueryByRsvnNo(formSearch: FormQueryParam): Promise<any>{
        return await PkmApi.rsvnQueryParam(formSearch).toPromise();
    }

    static filterGuesrMaster(queryParam: IQueryParam[],valueFilter: any): IQueryParam {
        return queryParam.find((x: IQueryParam) => x.guid === valueFilter) as IQueryParam || undefined;
    }

    static async mapStateToEditRsvn(queryParam: IQueryParam[], guid: string, formSearch: FormQueryParam, rsvnNo?: string | number, hotel?: string): Promise<any> {
        let inforRsvn: string | null = "No";
        const getQuery: IQueryParam | undefined = this.filterGuesrMaster(queryParam,guid);
        if(getQuery){
            if(getQuery.parentMeGuid === null && getQuery.groupMaster === GLobalPkm.defaultBytes32){
                inforRsvn = "ID: " + getQuery.dataForeservation.id;
            }// case guest is main
            else{
                const getQueryGroupMaster: IQueryParam | undefined = this.filterGuesrMaster(queryParam,getQuery.parentMeGuid);
                if(getQueryGroupMaster !== undefined){ // case master find in query param
                    inforRsvn = this.getPaymentExpensesOrRoomName(queryParam,getQuery);
                }
                else { // case master counld't find in query param, call API get list query param
                    const form = {
                            arrivalDates: [],
                            companyAgentGuid: "00000000-0000-0000-0000-000000000000",
                            departureDates: [],
                            hotelGuid: formSearch.hotelGuid,
                            isOnlyMainGuest: false,
                            pageNumber: 1,
                            pageSize: 50,
                            profileIds: [],
                            roomType: "00000000-0000-0000-0000-000000000000",
                            rsvnCode: "",
                            rsvnNo: getQuery.dataForeservation.id,
                            status: 5,
                            room: "",
                            groupCode: "",
                    };
                    try {
                        const res = await this.searchQueryByRsvnNo(form);
                        inforRsvn = this.getPaymentExpensesOrRoomName(res,getQuery);
                    } catch (error) {
                        console.log(error);
                    }
    
                }
            }
        }
        else{
            const form = {
                arrivalDates: [],
                companyAgentGuid: "00000000-0000-0000-0000-000000000000",
                departureDates: [],
                hotelGuid: hotel ?? "00000000-0000-0000-0000-000000000000",
                isOnlyMainGuest: false,
                pageNumber: 1,
                pageSize: 50,
                profileIds: [],
                roomType: "00000000-0000-0000-0000-000000000000",
                rsvnCode: "",
                rsvnNo: rsvnNo,
                status: 5,
                room: "",
                groupCode: "",
            };
            try {
                const res = await this.searchQueryByRsvnNo(form);
                inforRsvn = this.getPaymentExpensesOrRoomName(res,getQuery);
            } catch (error) {
                console.log(error);
            }
        }
        return inforRsvn;
    }
    static getPaymentExpensesOrRoomName(queryParam: IQueryParam[],getQuery: IQueryParam) {
        let result: string | null = "";
        const findByParenMeGuid = this.filterGuesrMaster(queryParam, getQuery.parentMeGuid);
        if(getQuery?.transactRoomsGroup.roomName !== null && findByParenMeGuid?.groupMaster !== GLobalPkm.defaultBytes32){
            const findByGroupMaster = this.filterGuesrMaster(queryParam, getQuery.groupMaster);
            if(findByGroupMaster){
                result = findByGroupMaster.transactRoomsGroup.roomName;
            }else{
                result = findByParenMeGuid.transactRoomsGroup.roomName;
            }
        }// return roomName for room guest main is Group master
        else {
            if(findByParenMeGuid){
                result = "ID: " + findByParenMeGuid.dataForeservation.id;
            }
        }// return id room master is not Group master
        return result;
    }
}
export default search;
