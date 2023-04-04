/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import InventoryApi from "api/inv/inv.api";
import PkmApi from "api/pkm/pkm.api";
import { RoomsInARoomType } from "common/model-inventory";
import { MasterAndMemberProfiles } from "common/model-profile";
import { NewReservationData } from "common/model-rsvn";
import { cloneDeep } from "lodash";
import MASTER_AND_MEMBER_PROFILES from "common/const/masterAndMemberProfilesDefaultValue"
import rSVN_DEFAULT_DATA from "common/const/newRSVNDefaultValue";
import Utils from "common/utils";
import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";
import ProfileApi from "api/profile/prf.api";

interface roomDetail {
    roomType: string
    roomName: string
    rate: number
    fullName: string
}

class AddRsvnToGroupService {
    static async newRsvnData(data: NewReservationData): Promise<any>{
        return await PkmApi.newReservation(data).toPromise();
    }

    static async bookingRsvnToGroup(reservationData: NewReservationData, room: roomDetail, hotelId: string, 
        number: string, guest: string, rate: number, nameRoom: any, inHouse: boolean, arrivalDate: Date, departureDate: Date): Promise<boolean> {
        let result = false
        const data = {
            ...reservationData,
            dataForeservationDTO: { ...reservationData?.dataForeservationDTO},
            dataFotransactRoomDTO: { ...reservationData?.dataFotransactRoomDTO, id: 0},
            flyInfor: { ...rSVN_DEFAULT_DATA.flyInfor},
            pickup: {...reservationData.pickup},
            roomTypeidnCounts: {...reservationData.roomTypeidnCounts}
        }
        data.dataFotransactRoomDTO.hotelGuid = hotelId;
        data.dataForeservationDTO.hotelGuid = hotelId;
        data.flyInfor.hotelGuid =  hotelId;
        data.dataForeservationDTO.reservationDate = Utils.convertToVNTimeZone(new Date());
        // set some DateTime value that not null
        data.dataForeservationDTO.ccexpDate = Utils.convertToVNTimeZone(new Date());
        const masterAndMemberProfiles: MasterAndMemberProfiles = cloneDeep(MASTER_AND_MEMBER_PROFILES);
        const name: string = room.fullName
        // const memberMaster = data.dataForeservationDTO.guid
        masterAndMemberProfiles.masterProfile.hotelGuid = hotelId;
        masterAndMemberProfiles.masterProfile.firstName = name.slice(0, name.indexOf(" "))
        masterAndMemberProfiles.masterProfile.guestName = name.slice(name.indexOf(" "))
        if(inHouse){
            data.dataFotransactRoomDTO.arrivalDate = Utils.convertMiddleDate(arrivalDate)
            data.dataFotransactRoomDTO.departureDate = Utils.convertMiddleDate(departureDate)
        }
        for (let i = 0; i < Number.parseInt(guest); i++) {
            masterAndMemberProfiles.memberProfiles.push({ ...masterAndMemberProfiles.masterProfile })
        }

        data.remainRSVN = {
            confirmed: false,
            isRemain: true,
            rsvnId: data?.dataForeservationDTO.guid,
            groupCode: data?.dataForeservationDTO.groupCode
        }
        const res = await ProfileApi.postMasterProfileAndMemberProfiles(true, masterAndMemberProfiles).toPromise();
        if (res) {
            if(res.masterGuestGuid !== null){ 
                let begin = 0;
                data.roomTypeidnCounts = []
                const allGuestGuid: string[] = [];
                data.masterGuestGuid = res.masterGuestGuid
                allGuestGuid.push(res.masterGuestGuid ?? res.masterGuestGuid);
                allGuestGuid.push(...res.guestGuid)
                    
                if(nameRoom?.guid === room.roomType){ //if Customer don't change roomType
                    let listGuestId: string[] = []
                    const rateSelect: number = room.rate ? room.rate : 1
                    for (let i = 0; i < Number.parseInt(number); i++) {
                        listGuestId = allGuestGuid?.slice(begin, 
                            begin + Number.parseInt(guest) * Number.parseInt(number)
                        );
                        data.roomTypeidnCounts.push({
                            roomType: room.roomType,
                            count: Number.parseInt(number),
                            guestGuid: listGuestId,
                            maxPerson: 4,
                            totalRooms: 5,
                            rate: rate !== 1 ? rate : rateSelect,
                            mappingRooms: []
                        })
                    }
                            
                    data.dataFotransactRoomDTO.rate = rate ? rate : rateSelect
                    data.dataFotransactRoomDTO.roomType = room.roomType
                    data.dataForeservationDTO.bookedBy = res.masterGuestGuid
                        
                    data.dataFotransactRoomDTO.guestId = null
                    const lstRoomTypes: string[] = [room.roomType ? room.roomType : ""];
                    const roomsInRoomTypes: RoomsInARoomType[] = await InventoryApi.getRoomsInRoomTypes(hotelId, lstRoomTypes) || [];
                    roomsInRoomTypes?.forEach((item: RoomsInARoomType) => {
                        const tmp = data.roomTypeidnCounts.find(x => x.roomType === item.roomType);
                        tmp && (tmp.mappingRooms = item.rooms.map((x) => {
                            return {roomGuid: x.guid, roomName: x.so}
                        }));
                    })
                    data.roomTypeidnCounts.forEach((item) => item.totalRooms = item.mappingRooms.length)
                    try {
                        const res = await AddRsvnToGroupService.newRsvnData(data)
                        if (res) {
                            result = true
                            openNotification(NotificationStatus.Success, 'Done', 'Create RSVN To Group successfully!')   
                        }
                    } catch (error: any) {
                        console.log(error)
                        openNotification(NotificationStatus.Error, 'Failure!', "Room type '" + room.roomName + "' has no capacity", error.status)
                    }
                }else{ //if Customer change roomType
                    let listGuestId: string[] = []
                    for (let i = 0; i < 1; i++) {
                        listGuestId = allGuestGuid?.slice(begin, 
                            begin + Number.parseInt(guest) * Number.parseInt(number)
                        )
                        begin += Number.parseInt(guest) * Number.parseInt(number);
                    }
                    begin = 0
                    const rateSelect: number = room.rate ? room.rate : 1
                    const countRoom = [{
                        roomType: nameRoom?.guid,
                        count: Number.parseInt(number),
                        guestGuid: listGuestId,
                        maxPerson: 4,
                        totalRooms: 5,
                        rate: rate !== 1 ? rate : rateSelect,
                        mappingRooms: []
                    }]
                    data.roomTypeidnCounts = [...countRoom]
                    data.dataFotransactRoomDTO.rate = rate
                    data.dataFotransactRoomDTO.roomType = nameRoom?.guid
                    const lstRoomTypes: string[] = [nameRoom?.guid];
                        
                    const roomsInRoomTypes: RoomsInARoomType[] = await InventoryApi.getRoomsInRoomTypes(hotelId, lstRoomTypes) || [];
                    roomsInRoomTypes?.forEach((item: RoomsInARoomType) => {
                        const tmp = data.roomTypeidnCounts.find(x => x.roomType === item.roomType);
                        tmp && (tmp.mappingRooms = item.rooms.map((x) => {
                            return {roomGuid: x.guid, roomName: x.so}
                        }));
                    })
                    data.roomTypeidnCounts.forEach((item) => item.totalRooms = item.mappingRooms.length)
                    try {
                        const res = await AddRsvnToGroupService.newRsvnData(data)
                        if (res) {
                            result = true
                            openNotification(NotificationStatus.Success, 'Done', 'Create RSVN To Group successfully!')   
                        }
                    } catch (error: any) {
                        console.log(error)
                        openNotification(NotificationStatus.Error, 'Failure!', "Room type '" + room.roomName + "' has no capacity", error.status)
                    }
                }
            }else{
                openNotification(NotificationStatus.Error, 'Failure!', "Create profile fail!")
            }
        }
        return result 
    }
}

export default AddRsvnToGroupService