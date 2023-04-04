import PkmApi from "api/pkm/pkm.api";
import ProfileApi from "api/profile/prf.api";
import MASTER_AND_MEMBER_PROFILES from "common/const/masterAndMemberProfilesDefaultValue";
import wALK_IN_DEFAULT_DATA from "common/const/newWalkInDefaultValue";
import { NotificationStatus } from "common/enum/shared.enum";
import { RoomInfo } from "common/model-inventory";
import { GuestProfile, MasterAndMemberProfiles } from "common/model-profile";
import { DataFoextraCharge, NewWalkInData, RoomShortInfo, WalkInFormData } from "common/model-rsvn";
import Utils from "common/utils";
import openNotification from "components/CNotification";
import { cloneDeep } from "lodash";

interface BaseProfile{
    guestName: string,
    firstName: string
}

const DEFAULT_BASE_PROFILE: BaseProfile = {
    firstName: '',
    guestName: ''
}

class WalkInService {
    static baseProfile: BaseProfile = {...DEFAULT_BASE_PROFILE};

    static resetBaseProfile = (): void => {
        WalkInService.baseProfile = {...DEFAULT_BASE_PROFILE};
    }

    static lstAvailableRooms: RoomInfo[] = [];

    static resetAvailableRooms = (): void => {
        WalkInService.lstAvailableRooms = [];
    }

    static updateAvailableRooms = (newRooms: RoomInfo[]): void => {
        WalkInService.lstAvailableRooms = newRooms;
        return;
    }

    static processNewRSVNRequest = async (masterAndMemberProfiles: MasterAndMemberProfiles, rsvnData: NewWalkInData) : Promise<boolean> => {
        let result = false;
        await ProfileApi.postMasterProfileAndMemberProfiles(true, masterAndMemberProfiles).toPromise().then(
            async (response) => {
                rsvnData.masterGuestGuid = response?.masterGuestGuid;
                //res?.masterGuestGuid ? rsvnData.guestGuid.push(res?.masterGuestGuid) : "";
                rsvnData.dataForeservationDTO.bookedBy = response?.masterGuestGuid;
                // Set guestGuid
                const allGuestGuid: string[] = [];
                allGuestGuid.push(response.masterGuestGuid ?? '');

                allGuestGuid.push(...response.guestGuid);
                rsvnData.roomWalkIns[0].guestGuid = allGuestGuid;
                rsvnData.dataFotransactRoomDTO.arrivalDate = Utils.formatDateCallApi(new Date(rsvnData.dataFotransactRoomDTO.arrivalDate ?? ""))
                rsvnData.dataFotransactRoomDTO.departureDate = Utils.formatDateCallApi(new Date(rsvnData.dataFotransactRoomDTO.departureDate ?? ""))
                await PkmApi.newWalkIn(rsvnData).toPromise().then(
                    (res) => {
                        openNotification(NotificationStatus.Success, "WalkIn Successfully", res);
                        result = true;
                    },
                    (err) => {
                        openNotification(NotificationStatus.Error, err?.status, err?.response);
                        result = false;
                    }
                );
                result = false;
            },
            (err) => {
                openNotification(NotificationStatus.Error, err?.status, err?.response, err.status);
                result = false;
            })
        return result;
        //dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));// reset data fixcharge when new success
        //dispatch(setAccountNameFixCharge({ accountName: "ACCOUNT NAME", dataSelectedFixcharge: [] }));// reset data fixcharge when new success
    }

    static newWalkInExec = async (data: WalkInFormData, guestProfile: GuestProfile | null, dataFoextraCharge: DataFoextraCharge[], selectedRoom: RoomShortInfo, hotelGuid: string) : Promise<boolean | void> => {
        const hotelId = hotelGuid
        const masterAndMemberProfiles: MasterAndMemberProfiles = cloneDeep(MASTER_AND_MEMBER_PROFILES);
        // set master profile
        // transformData(profileFormData.main, masterAndMemberProfiles.masterProfile);
        // transformData(profileFormData.more, masterAndMemberProfiles.masterProfile);

        // set member profile

        // duplicate master profile in member profile
        // change when has Create Member profile UI
        if (guestProfile) {
            guestProfile.firstName = WalkInService.baseProfile.firstName;
            guestProfile.guestName = WalkInService.baseProfile.guestName;
            Utils.transformData(guestProfile, masterAndMemberProfiles.masterProfile);
        }
        if (Utils.isNullOrEmpty(masterAndMemberProfiles.masterProfile.firstName)) {
            alert("Please fill out required fields in Guest Profile!");
        }
        else {
            //data = { ...data, arrivalDate, departureDate };
            //data.printRate = isPrintRate;
            //data.resSource = valueSource;
            //data.confirmed = isConfirm;
            data.specialsCodes = data.specialsCodes ? '{"specialsCodes" : ' + JSON.stringify(data.specialsCodes) + "}" : null;
            data.packageCodes = data.packageCodes ? '{"packageCodes" : ' + JSON.stringify(data.packageCodes) + "}" : null;
            const rsvnData: NewWalkInData = {
                ...wALK_IN_DEFAULT_DATA,
                dataFoextraCharges: { ...wALK_IN_DEFAULT_DATA.dataFoextraCharges },
                dataFotransactRoomDTO: { ...wALK_IN_DEFAULT_DATA.dataFotransactRoomDTO },
                flyInfor: { ...wALK_IN_DEFAULT_DATA.flyInfor },
                dataForeservationDTO: { ...wALK_IN_DEFAULT_DATA.dataForeservationDTO },
                pickup: { ...wALK_IN_DEFAULT_DATA.pickup },
                roomWalkIns: [],
            };
            // transform data - Mapping data
            Utils.transformData(data, rsvnData.dataFotransactRoomDTO);
            Utils.transformData(data, rsvnData.dataForeservationDTO);

            // set COD int value to DateTime value
            const cutOfDate: Date = new Date();
            const tmp = data.cod ? data.cod : 0;
            cutOfDate.setDate(data.arrivalDate.getDate() - tmp);

            // set cutOfDate value
            rsvnData.dataFotransactRoomDTO.cutOfDate = cutOfDate;

            // set hotelId to appropriate field in each object
            rsvnData.dataFotransactRoomDTO.hotelGuid = hotelId;
            //rsvnData.dataFoextraCharges.hotelGuid = hotelId;
            rsvnData.dataForeservationDTO.hotelGuid = hotelId;
            rsvnData.pickup.hotelGuid = hotelId;
            rsvnData.flyInfor.hotelGuid = hotelId;
            rsvnData.dataFoextraCharges = dataFoextraCharge;

            // set roomTypeidnCounts

            let countGuests = data.adults + data.childs;
            // var arrRoomTypesidnCounts = Object.keys(roomTypesidnCounts).map((key: any) => roomTypesidnCounts[key])

            // set Reservated Date
            rsvnData.dataForeservationDTO.reservationDate = Utils.convertToVNTimeZone(new Date());

            // set some DateTime value that not null
            rsvnData.dataForeservationDTO.ccexpDate = Utils.convertToVNTimeZone(new Date());
            countGuests--;
            masterAndMemberProfiles.masterProfile.hotelGuid = hotelId;
            for (let i = 0; i < countGuests; i++) {
                masterAndMemberProfiles.memberProfiles.push({ ...masterAndMemberProfiles.masterProfile })
            }
            // create roomWalkIn[]
            rsvnData.roomWalkIns.push({
                guestGuid: [],
                maxPerson: 4,
                rate: data.rate,
                roomGuid: data.roomGuid,
                roomName: selectedRoom.roomName,
                roomTypeGuid: data.roomType,
            })
            rsvnData.dataFotransactRoomDTO.nguoiDung2 = Utils.getValueLocalStorage("username");
            // call api to set masterGuestGuid and guestGuid
            return await WalkInService.processNewRSVNRequest(masterAndMemberProfiles, rsvnData);
        }
    }

}

export default WalkInService;