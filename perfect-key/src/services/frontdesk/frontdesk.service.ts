/* eslint-disable @typescript-eslint/no-explicit-any */
import InventoryApi from "api/inv/inv.api";
import functionPkmApi from "api/pkm/function.api";
import { IFormSearchReq } from "common/define-booking";
import { ReservationStatus } from "common/enum/booking.enum";
import { TypeStatusMessage } from "common/enum/cashier.enum";
import { TypeCancelRoom } from "common/enum/roomplan.enum";
import { NotificationStatus } from "common/enum/shared.enum";
import GLobalPkm from "common/global";
import { IParamCheckIn, ISearchResult } from "common/model-booking";
import { IUpdateStatusRoom } from "common/model-inventory";
import { DataGetTracerMessage, ITracerMessage } from "common/model-rsvn";
import openNotification from "components/CNotification";
import { addDays } from "date-fns";

export default class FrontDeskService {
    static handleCancelChecked(hotelGuid: string, type: number, listRoomType: any[]): any {
        const data: any = {
            pageNumber: 1,
            pageSize: 10,
            hotelGuid: hotelGuid,
            isOnlyMainGuest: false,
            rsvnNo: parseInt("0"),
            groupCode: "",
            rsvnCode: "",
            room: "",
            rsvnId: GLobalPkm.defaultBytes32,
            status: 1,
            profileIds: [],
            companyAgentGuid: GLobalPkm.defaultBytes32,
            roomType: GLobalPkm.defaultBytes32,
            arrivalDates: [],
            departureDates: [],
            listRoomType
        }
        const formSearch: any = {
            searchBy: 1,
            dateArrival: []
        }
        const today = new Date();
        if (type === TypeCancelRoom.CHECKIN_TO_DAY) {
            data.status = ReservationStatus.CheckIn;
            data.arrivalDates = [today, today]
            formSearch.searchBy = ReservationStatus.CheckIn;
            formSearch.dateArrival = data.arrivalDates;
        }
        if (type === TypeCancelRoom.CHECKIN_YESTERDAY) {
            data.status = ReservationStatus.CheckIn;
            data.arrivalDates = [addDays(today, -1), addDays(today, -1)]
            formSearch.searchBy = ReservationStatus.CheckIn;
            formSearch.dateArrival = data.arrivalDates;
        }
        if (type === TypeCancelRoom.SEARCH_CANCEL) {
            data.status = ReservationStatus.CheckIn;
            formSearch.searchBy = ReservationStatus.CheckIn;
        }
        if (type === TypeCancelRoom.CANCEL_CHECK_OUT) {
            data.status = ReservationStatus.CheckOut;
            formSearch.searchBy = ReservationStatus.CheckOut;
        }
        return { dataSearch: data, formSearch };
    }
    static mapDataSearch(hotelGuid: string, formSearch: IFormSearchReq, listRoomType: any[]): any {
        const data: any = {
            pageNumber: 1,
            pageSize: 10,
            hotelGuid: hotelGuid,
            isOnlyMainGuest: false,
            rsvnNo: formSearch.rsvnNo ?? parseInt("0"),
            groupCode: formSearch.groupCode ?? "",
            rsvnCode: formSearch.rsvnNo ?? "",
            room: formSearch.room ?? "",
            rsvnId: GLobalPkm.defaultBytes32,
            status: formSearch.status ?? 0,
            profileIds: [],
            companyAgentGuid: GLobalPkm.defaultBytes32,
            roomType: GLobalPkm.defaultBytes32,
            arrivalDates: (formSearch.arrivalDates.from && formSearch.arrivalDates.to) ? [formSearch.arrivalDates.from, formSearch.arrivalDates.to] : [],
            departureDates: (formSearch.departureDates.from && formSearch.departureDates.to) ? [formSearch.departureDates.from, formSearch.departureDates.to] : [],
            listRoomType
        }
        return data;
    }
    static mapDataSearchByName(hotelGuid: string, formSearch: IFormSearchReq, listRoomType: any[]): any {
        const data: any = {
            pageNumber: 1,
            pageSize: 10,
            hotelGuid: hotelGuid,
            isOnlyMainGuest: false,
            rsvnNo: formSearch.rsvnNo ?? parseInt("0"),
            groupCode: formSearch.groupCode ?? "",
            rsvnCode: formSearch.rsvnNo ?? "",
            room: formSearch.room ?? "",
            rsvnId: GLobalPkm.defaultBytes32,
            status: formSearch.status ?? 0,
            profiles: {
                phone: formSearch.phone,
                passport: formSearch.passport,
                firstName: formSearch.firstName,
                guestName: formSearch.guestName
            },
            companyAgentGuid: GLobalPkm.defaultBytes32,
            roomType: GLobalPkm.defaultBytes32,
            arrivalDates: (formSearch.arrivalDates.from && formSearch.arrivalDates.to) ? [formSearch.arrivalDates.from, formSearch.arrivalDates.to] : [],
            departureDates: (formSearch.departureDates.from && formSearch.departureDates.to) ? [formSearch.departureDates.from, formSearch.departureDates.to] : [],
            listRoomType
        }
        return data;
    }
    static mapDataSearchForCheckin(hotelGuid: string, formSearch: IFormSearchReq, listRoomType: any[], dateInputCheckIn: any[]): any {
        const data: any = {
            pageNumber: 1,
            pageSize: 10,
            hotelGuid: hotelGuid,
            isOnlyMainGuest: formSearch.isOnlyMainGuest,
            rsvnNo: formSearch.rsvnNo ?? parseInt("0"),
            groupCode: formSearch.groupCode ?? "",
            rsvnCode: formSearch.rsvnNo ?? "",
            room: formSearch.room ?? "",
            rsvnId: GLobalPkm.defaultBytes32,
            // status: formSearch.status ?? 0,
            status: 0,
            profiles: {
                phone: formSearch.phone,
                passport: formSearch.passport,
                firstName: formSearch.firstName,
                guestName: formSearch.guestName
            },
            companyAgentGuid: formSearch.companyAgentGuid !== '' ? formSearch.companyAgentGuid : GLobalPkm.defaultBytes32,
            roomType: GLobalPkm.defaultBytes32,
            arrivalDates: dateInputCheckIn,
            departureDates: [],
            listRoomType,
            profileIds: []
        }
        return data;
    }
    static async setStatusGroup(data: any[], isIncludeChild: boolean, isCheckin: boolean): Promise<any> {
        try {
            await functionPkmApi.setGroupStatusRsvn(data, isIncludeChild, isCheckin).toPromise();
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response.message, "", error.status);
            console.log(error);
            return error.response;
        }
    }
    static mapDataParamCheckinTable(data: ISearchResult[], dataSearchResults: ISearchResult[]): IParamCheckIn[]{
        const listParamCheckin: IParamCheckIn[] = [];
        data.forEach(item => {
            listParamCheckin.push({
                roomName: item.room.name ?? "",
                mainTsRoom: item.guid ?? "",
                rsvnNo: item.rsvnNo.name?.toString() ?? "",
                status: item.status.name ?? "",
                parentMeGuid: null
            })
            dataSearchResults.forEach(childElemnt => {
                if(item.guid === childElemnt.parentMeGuid){
                    listParamCheckin.push({
                        roomName: childElemnt.room.name ?? "",
                        mainTsRoom: childElemnt.guid ?? "",
                        rsvnNo: childElemnt.rsvnNo.name?.toString() ?? "",
                        status: childElemnt.status.name ?? "",
                        parentMeGuid: childElemnt.parentMeGuid?.toString() ?? ""
                    })
                }
            })
        })
        return listParamCheckin;
    }
    static async getMessageAlert(tsRoomId: string, flagType: number, hotelGuid: string): Promise<ITracerMessage | null> {
        try {
            const data: DataGetTracerMessage ={tsRoomId, flagType, hotelGuid}
            return await functionPkmApi.GetTracerMessage(data).toPromise();
        } catch (error: any) {
            // openNotification(NotificationStatus.Error, error.response.message, "");
            console.log(error);
            return error.response;
        }
    }
    static async SeenMessageAlert(dataMessage: ITracerMessage): Promise<any> {
        try {
            const data = {
                ...dataMessage,
                status: TypeStatusMessage.Read
            }
            const res = await functionPkmApi.SeenTracerMessage(data).toPromise();
            openNotification(NotificationStatus.Success, res, "");
            return "Success"
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response.message, "", error.status);
            console.log(error);
            return error.response;
        }
    }
    static async changeStatusRoom(data: IUpdateStatusRoom): Promise<boolean>{
        try {
            await InventoryApi.updateStatusRoom(data).toPromise();
            openNotification(NotificationStatus.Success, "Update Success !", "");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Update failed !", "", error.status);
            return false;
        }
    }
}