import { ColorStatus, FlagTypeUpdateStatusRoom, TypeStatusTsRoom } from 'common/enum/roomplan.enum';
import { StatusRoomPlan } from 'common/enum/roomplan.enum';
import { IHeplerChangeSatusRoom } from 'common/model-inventory';
import { DMColorType } from 'common/shared/dmuccolor.model';
class RoomPlanHeper{
    static setColorRoomPlan(code: number | string): string{
        switch(code){
        case StatusRoomPlan.OOO:
            return ColorStatus.OOO;
        case StatusRoomPlan.OOS:
            return ColorStatus.OOS;
        case StatusRoomPlan.OCC:
            return ColorStatus.OCC;
        case StatusRoomPlan.ATD:
            return ColorStatus.ATD;
        case StatusRoomPlan.EA:
            return ColorStatus.EA;
        case StatusRoomPlan.ED:
            return ColorStatus.ED;
        case StatusRoomPlan.VC:
            return ColorStatus.VC;
        case StatusRoomPlan.VD:
            return ColorStatus.VD;
        case StatusRoomPlan.EC:
            return ColorStatus.EC;
        case StatusRoomPlan.VDEA:
            return ColorStatus.VDEA;
        case StatusRoomPlan.VCEA:
            return ColorStatus.VCEA;
        case StatusRoomPlan.EDEA:
            return ColorStatus.EDEA;
        case StatusRoomPlan.LTSG:
            return ColorStatus.LTSG;
        case StatusRoomPlan.OCLEAN:
            return ColorStatus.OCLEAN;
        case StatusRoomPlan.ODIRTY:
            return ColorStatus.ODIRTY;
        case StatusRoomPlan.COMP:
            return ColorStatus.COMP;
        case StatusRoomPlan.HSU:
            return ColorStatus.HSU;
        case StatusRoomPlan.VC_INSPECTED:
            return ColorStatus.VC_INSPECTED;
        case StatusRoomPlan.STAY:
            return ColorStatus.STAY;
        case StatusRoomPlan.ACCARR:
            return ColorStatus.ACCARR;
        case StatusRoomPlan.UN_ASSIGN:
            return ColorStatus.UN_ASSIGN;
        default:
            break;
        }
        return "";
    }
    static setColorStatusInList(listDmColor: DMColorType[], code: number): string{
        listDmColor.forEach(item => {
            if(parseInt(item.code) === code){
                return item.colorName;
            }
        }) 
        return "";
    }
    static setFlagTypeUpdateRoomStatus(flagType: number): IHeplerChangeSatusRoom{
        const dataResult: IHeplerChangeSatusRoom = {
            flagType : -1,
            status : -1
        }
        switch(flagType){
        //set clear
        case 0: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToRoom;
            dataResult.status = TypeStatusTsRoom.Clean;
            return dataResult;
        }
        case 1: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToFloor;
            dataResult.status = TypeStatusTsRoom.Clean;
            return dataResult;
        }
        case 2: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToAllRoom;
            dataResult.status = TypeStatusTsRoom.Clean;
            return dataResult;
        }
        //end 
        //set dirty
        case 3: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToRoom;
            dataResult.status = TypeStatusTsRoom.Dirty;
            return dataResult;
        }
        case 4: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToFloor;
            dataResult.status = TypeStatusTsRoom.Dirty;
            return dataResult;
        }
        case 5: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToAllRoom;
            dataResult.status = TypeStatusTsRoom.Dirty;
            return dataResult;
        }
        //end
        //set out of order
        case 6: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToOutOfOrder;
            dataResult.status = TypeStatusTsRoom.OutOfOther;
            return dataResult;
        }
        case 7: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToOutOfOrder;
            dataResult.status = 1;
            return dataResult;
        }
        //end
        //set inspected
        case 8: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToInspected;
            dataResult.status = 1;
            return dataResult;
        }
        case 9: {
            dataResult.flagType = FlagTypeUpdateStatusRoom.ToInspected;
            dataResult.status = 0;
            return dataResult;
        }
        }
        //end
        return dataResult;
    }
}
export default RoomPlanHeper;