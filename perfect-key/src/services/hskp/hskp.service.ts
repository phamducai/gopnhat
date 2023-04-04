/* eslint-disable @typescript-eslint/no-explicit-any */
import HskpAPI from "api/hskp/hskp.api";
import InventoryApi from "api/inv/inv.api";
import { TypeStatusTsRoom } from "common/enum/roomplan.enum";
import { NotificationStatus } from "common/enum/shared.enum";
import { IGetHSKBlockRoom, IHSKBlockRoom, IListStatusRoomHskp } from "common/model-hskp";
import { IUpdateStatusRoom } from "common/model-inventory";
import Utils from "common/utils";
import openNotification from "components/CNotification";
import RoomPlanHeper from "services/frontdesk/roomPlanHeper/roomplanheper";

class HskpService {
    static idProfile = Utils.getValueLocalStorage("idProfile")

    static async getListStatusRoom(): Promise<IListStatusRoomHskp[]>{
        try {
            return await InventoryApi.getListStatusRoomByHotel().toPromise();
        } catch (error) {
            return [];
        }
    }
    static async postBlockRoomHskp(data: IHSKBlockRoom): Promise<boolean>{
        try {
            data.nguoiDung = this.idProfile;
            data.dateFrom = Utils.formatDateCallApi(data.dateFrom);
            data.dateTo = Utils.formatDateCallApi(data.dateTo);
            data.ngayThang = Utils.formatDateCallApi(data.ngayThang);
            await HskpAPI.postHSKPBlockRoom(data).toPromise();
            if(data.tinhTrang === TypeStatusTsRoom.OutOfOther || data.tinhTrang === TypeStatusTsRoom.OutOfService){
                const mapData = RoomPlanHeper.setFlagTypeUpdateRoomStatus(6);
                const dataUpdateStatus: IUpdateStatusRoom = {
                    hotelGuid : data.hotelGuid,
                    floor: 0,
                    flagType: mapData.flagType,
                    status: mapData.status,
                    roomId: data.roomGuid
                } 
                await InventoryApi.updateStatusRoom(dataUpdateStatus).toPromise();
            }
            openNotification(NotificationStatus.Success, "Post block room success !", "");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Post block room failed !", "", error.status);
            return false;
        }
    }
    static async getBlockRoomHskpById(bussinessDate: Date, roomId: string, hotelId: string): Promise<IGetHSKBlockRoom | null>{
        try {
            const resp = await HskpAPI.getBlockRoomById(Utils.formatDateCallApi(bussinessDate), roomId, hotelId).toPromise();
            if(resp){
                return resp;
            }
            console.log(resp);
            return null;
        } catch (error) {
            return null;
        }
    }
    static async unBlockRooms(data: IHSKBlockRoom, blockRoomId: string): Promise<boolean>{
        try {
            data.nguoiDung = this.idProfile;
            data.dateFrom = Utils.formatDateCallApi(data.dateFrom);
            data.dateTo = Utils.formatDateCallApi(data.dateTo);
            data.ngayThang = Utils.formatDateCallApi(data.ngayThang);
            await HskpAPI.updateBlockRoomById(data, blockRoomId).toPromise();
            const mapData = RoomPlanHeper.setFlagTypeUpdateRoomStatus(7);
            const dataUpdateStatus: IUpdateStatusRoom = {
                hotelGuid : data.hotelGuid,
                floor: 0,
                flagType: mapData.flagType,
                status: mapData.status,
                roomId: data.roomGuid
            } 
            await InventoryApi.updateStatusRoom(dataUpdateStatus).toPromise();
            await InventoryApi.updateStatusRoom({
                ...dataUpdateStatus,
                flagType: 0,
                status: TypeStatusTsRoom.Dirty
            }).toPromise();
            openNotification(NotificationStatus.Success, "Unblock room success !", "");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Unblock room failed !", "", error.status);
            return false;
        }
    }
}
export default HskpService; 