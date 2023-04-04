/* eslint-disable @typescript-eslint/no-explicit-any */
import InventoryApi from "api/inv/inv.api";
import PkmApi from "api/pkm/pkm.api";
import ProfileApi from "api/profile/prf.api";
import MASTER_AND_MEMBER_PROFILES from "common/const/masterAndMemberProfilesDefaultValue";
import NewDataRsvn from "common/const/newDataRsvn";
import { NotificationStatus } from "common/enum/shared.enum";
import { ISearchResult } from "common/model-booking";
import { RoomsInARoomType } from "common/model-inventory";
import { MasterAndMemberProfiles } from "common/model-profile";
import { NewReservationData, RemainRSVN, RoomTypeIdnCounts } from "common/model-rsvn";
import openNotification from "components/CNotification";
import { cloneDeep } from "lodash";

export interface IDate {
    arrivalDate: Date,
    departureDate: Date,
    nights: number
}

class AddSeriReservstionService {
    static async addSeriReservationData(reservationData: NewReservationData, date: IDate, hotelId: string,
        remain: RemainRSVN, groupCode: string, checkedRemain: boolean, selectedRow: ISearchResult[]): Promise<NewReservationData> {
        const data = NewDataRsvn(reservationData, hotelId, date)

        if(remain.isRemain === true){
            data.remainRSVN = remain.isRemain === true ?
                {
                    confirmed: remain.confirmed ? true : false,
                    isRemain: true,
                    rsvnId: data?.dataForeservationDTO.guid,
                    groupCode: remain.groupCode !== " " ? remain.groupCode : null
                }
                : null
        }else{
            data.dataForeservationDTO.groupCode = remain.groupCode !== " " ? remain.groupCode : data.dataForeservationDTO.groupCode
        }

        const lstRoomTypes: string[] = [];
        reservationData.roomTypeidnCounts.forEach((item: RoomTypeIdnCounts) => {
            item?.roomType && lstRoomTypes.push(item.roomType);
            data.roomTypeidnCounts.push({
                roomType: item?.roomType,
                count: item.count,
                guestGuid: item.guestGuid,
                maxPerson: 4,
                totalRooms: 5,
                rate: item?.rate,
                mappingRooms: item?.mappingRooms
            });
        })

        const roomsInRoomTypes: RoomsInARoomType[] = await InventoryApi.getRoomsInRoomTypes(hotelId, lstRoomTypes) || [];
        roomsInRoomTypes?.forEach((item: RoomsInARoomType) => {
            const tmp = data.roomTypeidnCounts.find(x => x.roomType === item.roomType);
            tmp && (tmp.mappingRooms = item.rooms.map((x) => {
                return {roomGuid: x.guid, roomName: x.so}
            }));
        })
        data.roomTypeidnCounts.forEach((item) => item.totalRooms = item.mappingRooms.length)
        
        if(groupCode !== " " && checkedRemain){
            const masterAndMemberProfiles: MasterAndMemberProfiles = cloneDeep(MASTER_AND_MEMBER_PROFILES);
            const element: any[] = [];
            for (let index = 0; index < data.roomTypeidnCounts.length; index++) {
                for (let i = 0; i < data.roomTypeidnCounts[index].guestGuid.length; i++) {
                    // masterAndMemberProfiles.memberProfiles.push({ ...masterAndMemberProfiles.masterProfile })
                    element.push(data.roomTypeidnCounts[index].guestGuid[i])
                }
            }
            ProfileApi.guestProfilesClone(element).subscribe(
                (res) => {
                    if(res){
                        let num = true
                        res.forEach((item) => {
                            item.id = 0
                            if(num){
                                masterAndMemberProfiles.masterProfile = item
                                num = !num
                            }else
                                masterAndMemberProfiles.memberProfiles.push(item)
                        })
                                
                        ProfileApi.postMasterProfileAndMemberProfiles(true, masterAndMemberProfiles).subscribe(
                            async (res) => {
                                if(res){
                                    data.masterGuestGuid = res.masterGuestGuid
                                    //res?.masterGuestGuid ? rsvnData.guestGuid.push(res?.masterGuestGuid) : "";
                                    data.dataForeservationDTO.bookedBy = res.masterGuestGuid
                                    // Set guestGuid
                                    const len = data.roomTypeidnCounts.length;
                                    let begin = 0;
                                    const allGuestGuid: string[] = [];
                                    allGuestGuid.push(res.masterGuestGuid ?? '');
                                    allGuestGuid.push(...res.guestGuid);

                                    for (let i = 0; i < len; i++) {
                                        data.roomTypeidnCounts[i].guestGuid = allGuestGuid?.slice(begin, 
                                            begin + data.roomTypeidnCounts[i].guestGuid.length * data.roomTypeidnCounts[i].count
                                        );
                                        begin += data.roomTypeidnCounts[i].guestGuid.length * data.roomTypeidnCounts[i].count;
                                    }
                                    data.dataFotransactRoomDTO.guestId = null
                                }else{
                                    openNotification(NotificationStatus.Error, 'Failure!', "Create profile fail!")
                                    return
                                }
                            })
                    }
                }
            )
            return data
        }else{
            data.dataForeservationDTO.bookedBy = data.roomTypeidnCounts[0].guestGuid[0]
            return data
        }
    }

    static async newRsvnData(data: NewReservationData): Promise<any>{
        return await PkmApi.newReservation(data).toPromise();
    }
}

export default AddSeriReservstionService