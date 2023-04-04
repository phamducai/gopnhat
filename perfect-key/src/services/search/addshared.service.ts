/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryParam } from 'common/define-booking';
import { ISearchResult } from 'common/model-booking';
import { MainGuestInfo } from 'common/model-profile';
interface IAmountGuest{
    index: number | 0;
    transactRoomId: string | null;
    firstName: string | null;
    guestName: string | null;
    amount: number | 1;
    guestId: string | null;
}
interface dataResult{
    dataAmount: IAmountGuest[],
    dataSearchResult: ISearchResult[]
}
class AddSharedGuestService {
    static handelDataAmountApplyForGroup(selectedRows: ISearchResult[] ,queryParam: IQueryParam[], listGuestProfiles: MainGuestInfo[] | any[],dataSearchResults: ISearchResult[] | any[]): dataResult{
        const newDataAmount: IAmountGuest[] = [];
        const tempObject = queryParam.find((x: IQueryParam) => x.guid === selectedRows[0].guid);//get transaction room by id
        const arrGuestForGroup = queryParam.filter((x : IQueryParam) => x.parentGuid === tempObject?.parentGuid && x.parentMeGuid === null);// return list guest belong group 
        const newDataAddShared: ISearchResult[] = [];
        arrGuestForGroup.forEach((item: IQueryParam, index: number) => {
            const guestProfile: MainGuestInfo = listGuestProfiles.find(x => x.guid === item.guestId);
            newDataAddShared.push(dataSearchResults.find(x => x.guid === item.guid));
            newDataAmount.push({
                index,
                transactRoomId : item.guid,
                firstName : guestProfile.firstName,
                guestName : guestProfile.guestName,
                amount : 1,
                guestId : item.guestId
            })
        });
        return {dataAmount : newDataAmount, dataSearchResult : newDataAddShared};
    }
    static handelDataAmount(selectedRows: ISearchResult[], listGuestProfiles: MainGuestInfo[] | any []): IAmountGuest[]{
        const newDataAmount: IAmountGuest[] = [];
        selectedRows.forEach((item,index : number) => {
            const guestProfile: MainGuestInfo = listGuestProfiles.find(x => x.guid === item.guestId);
            newDataAmount.push({
                index,
                transactRoomId : item.guid,
                firstName : guestProfile.firstName,
                guestName : guestProfile.guestName,
                amount : 1,
                guestId : item.guestId
            });
        });
        return newDataAmount;
    }
}
export default AddSharedGuestService;