/* eslint-disable*/
import functionPkmApi from "api/pkm/function.api";
import pkmApi from "api/pkm/function.api";
import PkmApi from 'api/pkm/pkm.api';
import { IRespTotalBooker, RSVNFormData } from "common/model-booking";
import { GuestProfile } from "common/model-profile";
import { DataCEditRsvn, DataFoextraCharge, ITracerMessage, ITracerMessageByOption, RoomTypeIdnCounts, SearchQueryTracerMessage, SelectedBookingRoomType, TrRoomHistory } from "common/model-rsvn";
import { EditGroupRSVN, EditRoomGroup, RoomTypeIdnCountsEdit } from "common/model-rsvn-edit";
import rSVN_DEFAULT_DATA from 'common/const/newRSVNDefaultValue';
import openNotification from 'components/CNotification';
import { NotificationStatus } from './../../common/enum/shared.enum';
import { RoomsInARoomType } from "common/model-inventory";
import Utils from 'common/utils';
import ProfileApi from "api/profile/prf.api";
import InventoryApi from "api/inv/inv.api";
import { IGetTraceInHouse, InforRoomType } from "common/model-common";
import search from 'services/search/search.service';
import { IReqStatistic } from "common/dashboard/PropsDashboard";
class ReservationService {
    static confirmReservation(transactRoomId: string): any {
        return pkmApi.confirmTSRoom(transactRoomId);
    }
    static mapDataFoReservation(data: any, dataConvert: any): any{
        const dataMap = {...dataConvert};
        const dataFrom = Object.keys(data);
        const dataTo = Object.keys(dataConvert);
        dataTo.forEach(item => {
            const index = dataFrom.indexOf(item);
            if(index > 0 && item !== "nights" && item !== "room"){
                if(data[dataFrom[index]] !== ""){
                    dataMap[item] = data[dataFrom[index]];
                }else{
                    dataMap[item] = null;
                }
            }
        })
        delete dataMap.guid;
        delete dataMap.guestId;
        delete dataMap.id;
        return dataMap;
    }
    static mapDataEditReservation(data: any, dataCEdit: DataCEditRsvn, dataFoextraCharges: DataFoextraCharge[], isGroup: boolean): DataCEditRsvn {
        const newDataCEdit: DataCEditRsvn = {
            dataForeservationDTO : {...dataCEdit.dataForeservationDTO},
            dataFotransactRoomDTO: {...dataCEdit.dataFotransactRoomDTO},
            flyInfor: {...rSVN_DEFAULT_DATA.flyInfor},
            pickup: {...rSVN_DEFAULT_DATA.pickup},
            dataFoextraCharges: dataFoextraCharges,
            dataRoomGroup: {
                roomName: "",
                roomNameGuid: data.room,
                roomTypeGuid: data.roomType,
                roomTypeName: ""
            }
        }
        data.arrivalDate = Utils.formatDateCallApi(new Date(data.arrivalDate));
        data.departureDate = Utils.formatDateCallApi(new Date(data.departureDate));
        newDataCEdit.dataForeservationDTO.bookByEmail = data.bookByEmail;
        newDataCEdit.dataForeservationDTO.bookByPhone = data.bookByPhone;
        newDataCEdit.dataForeservationDTO.bookByFax = data.bookByFax;
        newDataCEdit.pickup.hotelGuid = dataCEdit.dataFotransactRoomDTO.hotelGuid;
        newDataCEdit.flyInfor.hotelGuid = dataCEdit.dataFotransactRoomDTO.hotelGuid;
        newDataCEdit.dataFotransactRoomDTO = this.mapDataFoReservation(data, dataCEdit.dataFotransactRoomDTO);

        
        if(isGroup){
            newDataCEdit.dataFotransactRoomDTO.roomType = dataCEdit.dataFotransactRoomDTO.roomType;
        }
        return newDataCEdit;
    }
    static mapDataGuestProfile(firstName: string, lastName: string, guestProfile: GuestProfile, guestId: string): boolean{
        try {
            ProfileApi.editGuestProflie(guestProfile, guestId).subscribe();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async updateTsRoomByGuid(dataCEdit: DataCEditRsvn, tsRoomGuid: string, isExtraGuest: boolean): Promise<boolean | null>{
        try {
            await functionPkmApi.editDataTsRoomEditByGuid(dataCEdit,tsRoomGuid, isExtraGuest).toPromise();
            openNotification(NotificationStatus.Success,"Update success","");
            return true;
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Error,"Update failed","", error.status);
            return false;
        }
    }
    static async updateStatusCheckIn(tsRoomGuid: string): Promise<boolean | null>{
        try {
            const newData = [
                {
                    transactRoomId: tsRoomGuid,
                    status: 1,
                    totalRooms: 0
                }
            ];
            await PkmApi.setStateForMultiTransactionRoomsReinstate(false,newData).toPromise();
            return true;
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Error,"Check in false","", error.status);
            return false;
        }
    }
    static async updateGroupReservation(dataCEdit: DataCEditRsvn): Promise<boolean | null>{
        try {
            await functionPkmApi.editGroupReservation(dataCEdit, dataCEdit.dataForeservationDTO.guid ?? "").toPromise();
            openNotification(NotificationStatus.Success,"Update success","");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error,"Update failed","", error.status);
            return false;
        }
    }
    static async updateRoomGroup(ListRoomType: any[],listRoomName: RoomsInARoomType[],roomNameGuid: string, roomTypeGuid: string, tsRoomGuid: string, isExtraGuest: boolean): Promise<boolean | null>{
        try {
            const getNameRoomType = ListRoomType.find( x=> x.id === roomTypeGuid);
            const getNameRoomNumber = listRoomName[0].rooms.find(x => x.guid === roomNameGuid);
            const newData: EditRoomGroup = {
                roomNameGuid: roomNameGuid ?? null,
                roomName: getNameRoomNumber?.so ?? "",
                roomTypeGuid: roomTypeGuid,
                roomTypeName: getNameRoomType.name
            }
            await functionPkmApi.editRoomGroup(newData,tsRoomGuid,isExtraGuest).toPromise();
            return true;
        } catch (error) {
            return false;
        }
    }
    static mapDataGuestProfileGroup(rsvnId: string, firstName: string, lastName: string, guestProfile: GuestProfile): boolean{
        const newListGuest: GuestProfile[] = [];
        try {  
            ProfileApi.getListGuestIdbyRsvnId(rsvnId).subscribe(res => {
                if(res){
                    for(let i = 0; i < res.length; i++){
                        newListGuest.push({
                            ...guestProfile,
                            firstName: firstName,
                            guestName: lastName,
                            guid: res[i]
                        })
                    }
                    ProfileApi.updateListGuestProfiles(newListGuest).subscribe();
                }
            })
            return true;
        } catch (error) {
            return false;
        }
    }
    static async checkInToGroup(rsvnId: string, businessDate: Date): Promise<any>{
        try {
            return await functionPkmApi.checkInToGroup(rsvnId, businessDate).toPromise();;
        } catch (error: any) {
            openNotification(NotificationStatus.Error,"Check in failed","", error.status);
        }
    }
    static async checkInToRsvn(listTsRoom: string[], dataCEdit: DataCEditRsvn, isExtraGuest: boolean): Promise<any>{
        try {
            var resp = await functionPkmApi.checkInToRSVN(listTsRoom, dataCEdit, isExtraGuest).toPromise();
            if(resp?.result === false){
                openNotification(NotificationStatus.Error,"Check in failed","This room is already occupied !");
            }else{
                openNotification(NotificationStatus.Success,"Check in success","");
            }
        } catch (error: any) {
            openNotification(NotificationStatus.Error,"Check in failed","", error.status);
        }
    }
    static async getRoomTypeList(hotelGuid: string): Promise<InforRoomType[]>{
        try {
            return await InventoryApi.invRoomtype(hotelGuid).toPromise() as InforRoomType[];
        } catch (error) {
            return [];
        }
    }
    static async addPmByToGroup(tsRoomId: string, rsvnId: string, isCreateGrm: boolean, roomTypePmId: string): Promise<any>{
        try {
            const dataTsRoom = await search.addPM(tsRoomId);
            if(dataTsRoom){
                dataTsRoom.roomType = roomTypePmId;
                delete dataTsRoom.id;
                delete dataTsRoom.guid;

                const res: any = await functionPkmApi.addPmToGroup(rsvnId, dataTsRoom, roomTypePmId, isCreateGrm).toPromise();
                openNotification(NotificationStatus.Success, "Successfully", `This PM room has been added to room ${res.data.roomName}`);
            }
        } catch (error: any) {
            if(Utils.handleErrosMessaeg(error)){
                openNotification(NotificationStatus.Warning, "This room has been added PM", "", error.status);
            }
        }
    }
    static async checkOutToGroup(rsvnId: string, businessDate: Date): Promise<boolean>{
        try {
            await functionPkmApi.checkOutGroup(rsvnId, Utils.formatDateByUTC(businessDate)).toPromise();
            openNotification(NotificationStatus.Success, "Check out success !", "");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Check out failed !", "", error.status);
            return false;
        }
    }
    static async checkOutRoomOrGuest(tsRoomId: string, isCheckRoom: boolean, businessDate: Date): Promise<boolean>{
        try {
            await functionPkmApi.checkOutGuestOrRoom(tsRoomId, isCheckRoom, Utils.formatDateByUTC(businessDate)).toPromise();
            openNotification(NotificationStatus.Success, "Check out success !", "");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Check out failed !", "", error.status);
            return false;
        }
    }

    static async hasUserRoomByRoomType(roomTypeGuid: string, hotelGuid: string, arrivalDate: string, departureDate: string): Promise<string[] | []> {
        try {
            const data: IReqStatistic = {
                roomTypeGuid: roomTypeGuid,
                hotelGuid: hotelGuid,
                arrivalDate: arrivalDate,
                departureDate: departureDate
            }
            return await PkmApi.getHasUserRoomByRoomTypeId(data).toPromise() as string[];
        } catch (error) {
            return [];   
        }
    }
    static async getListTraceInHouseByTsRoomId(tsRoomId: number): Promise<IGetTraceInHouse[] | []>{
        try {
            return await PkmApi.getTraceInHouseByTsRoomId(tsRoomId).toPromise() ?? [];
        } catch (error) {
            return [];
        }
    }
    static async getTotalBookerByRoomTypeId(listRoomType: string[], arrivalDate: Date, departureDate: Date): Promise<IRespTotalBooker[] | []>{
        try {
            return await PkmApi.getTotalRoomBookedByRoomTypeId(listRoomType, arrivalDate, departureDate).toPromise();
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Get data failed !", "", error.status);
            return [];
        }
    }
}
export default ReservationService;
