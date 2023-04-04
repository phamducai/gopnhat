/* eslint-disable @typescript-eslint/no-explicit-any */
import functionPkmApi from "api/pkm/function.api";
import { ListTsRoomPlan } from "common/model-booking";
import { PostBreakShared, RoomMapRoomType } from "common/model-inventory";
import { GuestProfile } from "common/model-profile";
import { IExtraGuest } from "common/model-rsvn";
import RoomPlanService from "services/frontdesk/roomplan.service";
import { NotificationStatus } from 'common/enum/shared.enum';
import openNotification from 'components/CNotification';
import PkmApi from 'api/pkm/pkm.api';
class BreakSharedService {
    static mapDataExtraGuest(dataTsRoom: ListTsRoomPlan, listGuestProfile: GuestProfile[]): IExtraGuest[]{
        const tmpGuest: IExtraGuest[] = [];
        dataTsRoom.transactRoom.forEach((item) => {
            if(item.parentMeGuid !== null){
                const extraGuest =  listGuestProfile?.find(x => x.guid === item.guestId);
                tmpGuest.push({
                    guid: item.guid ?? "",
                    fullName: `${extraGuest?.firstName ?? ""} ${extraGuest?.guestName ?? ""}`
                })
            }
        })
        return tmpGuest;
    }
    static converDataBreakShared(roomGuid: string,trsGuid: string, listRoom: RoomMapRoomType[], startDate?: Date, endDate?: Date, rate?: number): PostBreakShared{
        const selectRoom = listRoom.find(x => x.roomGuid === roomGuid);
        let data = {};
        if(selectRoom){
            data = {
                ...selectRoom,
                trsGuid: trsGuid,
                breakShareStartDate: startDate ?? "",
                breakShareEndDate: endDate ?? "",
                rate: rate ?? 0
            }
        }
        return data as PostBreakShared;
    }
    static async postBreakShared(data: PostBreakShared, isValidated: boolean): Promise<any>{
        try {
            const res = await functionPkmApi.breakShared(data, isValidated).toPromise();
            openNotification(NotificationStatus.Success, "Successfully","");
            return res;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.message,"", error.status);
            return false;
        }
    }
    static async checkRoomHasGuest(hotelGuid: string, listRoomGuid: string[], selectDate?: Date | string): Promise<any>{
        if(listRoomGuid.length > 0){
            const data = {
                hotelGuid: hotelGuid,
                selectedDate: selectDate
            }
            try {
                const res = await functionPkmApi.searchGroupListRoomPlan(data, listRoomGuid).toPromise() ;
                if(res && res.length ===1){
                    const guestId = res[0].transactRoom.find(x => x.parentMeGuid === null);
                    const resGuestProfile = await RoomPlanService.getDataGuestProfile([guestId?.guestId ?? ""]);
                    if(resGuestProfile){
                        return `${resGuestProfile[0]?.firstName ?? ""} ${resGuestProfile[0]?.guestName ?? ""}`;
                    }
                }else{
                    return null;
                }
            } catch (error) {
                console.log(error);
                return null;
            }

        }
        return null;
    }
    static async checkAvailableRoomType(roomType: string[], arivalDay: string, depatureDay: string, numberOfRooms: any[]): Promise<boolean>{
        try {
            const res = await PkmApi.getReservatedRooms({
                arivalDay: arivalDay,
                depatureDay: depatureDay,
                roomtypeIds: roomType
            }).toPromise() as any[];
            
            if(res){
                const roomTypeGuid = roomType[0];
                const tmp = numberOfRooms.find((x: any) => x.id === roomTypeGuid);
                let avaliable = tmp.count;
                if(tmp){
                    if(res[0].roomTypesCount[roomTypeGuid]?.length){
                        const tmps: any[] = res[0].roomTypesCount[roomTypeGuid].filter((item: any) => item.status < 2);
                        avaliable = avaliable - tmps.length;
                    }
                }
                if(avaliable > 0){
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
export default BreakSharedService;