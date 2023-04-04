/* eslint-disable @typescript-eslint/no-explicit-any */
import { GuestProfile } from 'common/model-profile';
import { IQueryParam } from 'common/define-booking';
import { ICombineGuest } from 'common/model-rsvn';
import { IRoomType } from 'common/define-api-booking';
class CombineGuestService{
    static mapDataCombine(guid: string ,allQueryParam: IQueryParam[], roomType: IRoomType[], allMainGuest: GuestProfile[]): ICombineGuest[] {
        const listConvertCombineGuest: ICombineGuest[] = [];
        const listMainGuestParam = allQueryParam.filter(x => x.guid !== guid && x.parentMeGuid === null);
        listMainGuestParam.forEach((item: IQueryParam) => {
            const guestProfile = allMainGuest.find(x => x.guid === item.guestId);
            const romTypeById = roomType.find(x => x.guid === item.roomType);
            if(guestProfile && romTypeById){
                listConvertCombineGuest.push({
                    id : item.id,
                    guid : item.guid,
                    fullName : guestProfile.firstName + " " + guestProfile.guestName,
                    dataForeservation : item.dataForeservation,
                    ten : romTypeById === undefined ? '' : romTypeById.ten,
                    roomName : item.transactRoomsGroup.roomName
                });
            }
        });
        return listConvertCombineGuest;
    }
}
export default CombineGuestService;