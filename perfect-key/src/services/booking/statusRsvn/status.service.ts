/* eslint-disable @typescript-eslint/no-explicit-any */
import functionPkmApi from "api/pkm/function.api";
import { ExpandStatus, ReservationStatus } from "common/enum/booking.enum";
import { NotificationStatus } from "common/enum/shared.enum";
import { ISearchResult } from "common/model-booking";
import openNotification from "components/CNotification";
interface dataRSVN {
    transactRoomId: string;
    status: number;
    totalRooms: number;
    comment: string;
}

interface numberOfRooms {
    count: number;
    id: string;
    name: string;
}

class setStatusRSVN {
    static async dataActiveRsvn (responData: any[], numberOfRooms: numberOfRooms[], IsIncludeChild: boolean, isCheckin: boolean): Promise<any> {
        
        try {
            const data: dataRSVN[] = [];        
            responData.forEach((elm: any) => {
                numberOfRooms.forEach((numberOfRoom: numberOfRooms) => {
                    if (elm.roomType.id === numberOfRoom.id) {
                        data.push({
                            transactRoomId: elm.transactRoomGuid ? elm.transactRoomGuid : elm.guid,
                            status: 0,
                            totalRooms: numberOfRoom.count,
                            comment: elm.comments.name ?? "",
                        })
                    }
                })
            });
            await functionPkmApi.setGroupStatusRsvn(data, IsIncludeChild, isCheckin).toPromise();
            openNotification(NotificationStatus.Success,"Active Success","");
        } catch (error: any) {
            openNotification(NotificationStatus.Error,"Active failed","", error.status);
            return null;
        }
        return null;
    }

    static dataCancelRsvn (responData: any[], numberOfRooms: numberOfRooms[], isBooking = false): dataRSVN[] {
        const data: dataRSVN[] = []; 
        if(isBooking){
            const selectedRows = responData as ISearchResult[];
            selectedRows.forEach((elm: ISearchResult) => {
                numberOfRooms.forEach((numberOfRoom: numberOfRooms) => {
                    if (elm.roomType.id === numberOfRoom.id) {
                        data.push({
                            transactRoomId: elm.guid ?? "",
                            status: this.mapStatusCancel(elm.status.id ?? 0),
                            totalRooms: numberOfRoom.count,
                            comment: elm.comments.name ?? "",
                        })
                    }
                })
            });
        }
        else{
            responData.forEach((elm) => {
                numberOfRooms.forEach((numberOfRoom: numberOfRooms) => {
                    if (elm.roomType === numberOfRoom.id) {
                        data.push({
                            transactRoomId: elm.guid ?? "",
                            status: this.mapStatusCancel(elm.status),
                            totalRooms: numberOfRoom.count,
                            comment: elm.comments ?? "",
                        })
                    }
                })
            });
        }
        return data;
    }
    static mapStatusCancel(status: number): number{
        switch(status){
        case ReservationStatus.Reservation:
            return ReservationStatus.Cancel;
        case ReservationStatus.CheckIn:
            return ReservationStatus.Reservation;
        case ReservationStatus.CheckOut:
            return ReservationStatus.CheckIn
        case ExpandStatus.Wakin:
            return ReservationStatus.Cancel
        }
        return ReservationStatus.Cancel;
    }
    static mapTitleTranslation(status: number): string{
        switch(status){
        case ReservationStatus.Reservation:
            return "COMMON.cancel_reservation";
        case ReservationStatus.CheckIn:
            return "COMMON.cancel_check_in";
        case ReservationStatus.CheckOut:
            return "COMMON.cancel_check_out";
        case ExpandStatus.PM:
            return "COMMON.cancel_pm";
        case ExpandStatus.Wakin:
            return "COMMON.cancel_walking";
        }
        return "COMMON.cancel_reservation";
    }
    static getStatus(status: string | number): string {
        switch (status) {
        case 0:
            return status = "Reservation"
        case 1:
            return status = "CheckIn"
        case 2:
            return status = "CheckOut"
        case 3:
            return status = "Cancelled"
        case 4:
            return status = "NoShow"
        case 5:
            return status = "WaitingList"
        default:
            break;
        }
        return "";
    }
}

export default setStatusRSVN;

