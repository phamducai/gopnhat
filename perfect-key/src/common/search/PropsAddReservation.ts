import { NewReservationData } from "common/model-rsvn";

export interface PropsAddReservation{
    selectedRows: any;
    modalAdd: boolean;
    setToggleModalAddReservation: React.Dispatch<React.SetStateAction<boolean>>;
    reservationData: NewReservationData;
}