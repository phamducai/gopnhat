import PkmApi from "api/pkm/pkm.api";
import { ReservationStatus } from "common/enum/booking.enum";
import { NotificationStatus } from "common/enum/shared.enum";
import { ISearchResult } from "common/model-booking";
import { NumberOfRooms } from "common/model-inventory";
import { TransactionRoomInfo } from "common/model-rsvn";
import { ReinstateTreeTable, SetStatusModel } from "common/search/model-reinstateRsvn";
import Utils from "common/utils";
import openNotification from "components/CNotification";
import { cloneDeep } from "lodash";

class ReinstateService{
    static async setMasterGuest(oldMainGuestId: string, newMainGuestId: string): Promise<unknown | null>{
        return await PkmApi.changeMainGuest(oldMainGuestId, newMainGuestId);
    }

    static notifyLackOfMasterGuest(notiLackOfMainGuests: string[]): void{
        let description = '';
        notiLackOfMainGuests.forEach(item => {
            description += item;
            description += ', ';
        })
        description = description.slice(0, description.length - 2);
        openNotification(NotificationStatus.Warning, 'Lack of MasterGuest', `You haven't choosed MasterGuest for Room: ${description}.\n
                Or your MasterGuest hasn't been done Reinstate or Check-In before.\n
                You should set Master for this room!`);
    }

    static prepareBodyRequest = (_status: ReservationStatus, selectedRows: ReinstateTreeTable[], numberOfRooms: NumberOfRooms[]) : SetStatusModel[] => {
        const transactionRequest = selectedRows.filter(item => !Utils.isNullOrEmpty(item.guid)).map((item) => {
            const totalRooms = numberOfRooms.find(x => x.id === item.roomTypeId)
            return {
                transactRoomId: item.guid as string,
                status: _status,
                totalRooms: totalRooms?.count
            } as SetStatusModel
        })
        return transactionRequest;
    }

    static convertNestedValueToSingle = (raw: ISearchResult[], key: number): ReinstateTreeTable[] => {
        return raw.sort((x, y) => {
            if(!x.parentMeGuid) return -1;
            if(!y.parentMeGuid) return 1;
            const strA = x.fullName.name || '';
            const strB = x.fullName.name || '';
            return strA.localeCompare(strB)
        }).map((item, index) => {
            return {
                room: item.room.name,
                roomId: item.room.id,
                key: parseInt(key.toString() + (index+1).toString()),
                guid: item.guid,
                guestId: item.guestId,
                parentMeGuid: item.parentMeGuid,
                fullName: item.fullName.name,
                rate: item.rate.name,
                roomType: item.roomType.name,
                roomTypeId: item.roomType.id,
                code: item.code.name,
                arrival: item.arrival.name,
                departure: item.departure.name,
                groupCode: item.groupCode.name,
                rsvnNo: item.rsvnNo.id,
                status: item.status.name,
                comments: item.comments.name
            }
        })
    }

    static syncWhenChangeMasterGuest = async (oldMasterGuestId: string | number | null, newMasterGuestId: string | null, expandedData: ISearchResult[]): Promise<ISearchResult[]> => {
        // work here for rerender masterGuest after click SetMasterGuest
        const expandedDataClone = cloneDeep(expandedData);
        const indx = expandedDataClone.findIndex(item => item.guid === oldMasterGuestId);
        if(indx === -1){
            const newTrsMaster: TransactionRoomInfo | null = await PkmApi.getTrsInfo(newMasterGuestId ? newMasterGuestId.toString() : "");
            const newMaster = expandedDataClone.find(item => item.guid === newMasterGuestId);
            if(newMaster){
                // set rate for newMaster
                newMaster.rate.id = newTrsMaster?.rate || 0;
                newMaster.rate.name = newTrsMaster?.rate.toString() || '0';
                newMaster.parentMeGuid = 0;
                expandedDataClone.forEach(item => {
                    if(item.parentMeGuid === oldMasterGuestId){
                        item.parentMeGuid = newMasterGuestId;
                    }
                })
            }
        }
        else{
            const newMaster = expandedDataClone.find(item => item.guid === newMasterGuestId);
            if(newMaster){
                const tmpRate = cloneDeep(newMaster.rate);
                newMaster.rate = cloneDeep(expandedDataClone[indx].rate);
                expandedDataClone[indx].rate = tmpRate;
                expandedDataClone[indx].parentMeGuid = newMasterGuestId;
                newMaster.parentMeGuid = 0;
                expandedDataClone.forEach(item => {
                    if(item.parentMeGuid === oldMasterGuestId){
                        item.parentMeGuid = newMasterGuestId;
                    }
                })
            }
        }
        return expandedDataClone;
    }
}

export default ReinstateService;

