import { ISearchResult } from "common/model-booking";
import { NewReservationData } from "common/model-rsvn";

export interface RenderItemBookingSeri{
    reservationData: NewReservationData;
    selectedRow: ISearchResult[];
    modalAddSeri: boolean
    setVisibleGuestProfile: React.Dispatch<React.SetStateAction<boolean>>;
}