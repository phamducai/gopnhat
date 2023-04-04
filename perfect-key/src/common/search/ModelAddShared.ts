import { ISearchResult } from 'common/model-booking';

export interface PropsAddShared {
    isVisbleAddShared: boolean;
    setIsVisbleAddShared: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRows: ISearchResult[];
    isApplyGroup: boolean;
}
export interface IAmountGuest{
    index: number | 0;
    transactRoomId: string | null;
    firstName: string | null;
    guestName: string | null;
    amount: number | 1;
    guestId: string | null;
}