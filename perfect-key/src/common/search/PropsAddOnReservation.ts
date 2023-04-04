import { NewReservationData } from "common/model-rsvn";

export interface PropsAddOnReservation{
    modalAdd: boolean;
    setToggleModalAddOnGroupRsvn: React.Dispatch<React.SetStateAction<boolean>>;
    reservationData: NewReservationData;
    selectedRows: any
}