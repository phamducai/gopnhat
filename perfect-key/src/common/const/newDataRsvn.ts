import { NewReservationData } from "common/model-rsvn";
import Utils from "common/utils";
import { IDate } from "services/booking/addOn/addSeriReservation.service";
import rSVN_DEFAULT_DATA from "./newRSVNDefaultValue";

const NewDataRsvn = ((reservationData: NewReservationData, hotelId: string, date: IDate): NewReservationData => {
    const data = {
        ...reservationData,
        dataFoextraCharges: [],
        dataForeservationDTO: { ...reservationData?.dataForeservationDTO},
        dataFotransactRoomDTO: { ...reservationData?.dataFotransactRoomDTO, id: 0,
            arrivalDate: Utils.convertMiddleDate(date.arrivalDate),
            departureDate: Utils.convertMiddleDate(date.departureDate),
            nights: date.nights ?? date.nights
        },
        flyInfor: { ...rSVN_DEFAULT_DATA.flyInfor},
        pickup: {...reservationData.pickup},
        roomTypeidnCounts: [],
    }
    data.dataFotransactRoomDTO.hotelGuid = hotelId;
    data.dataForeservationDTO.hotelGuid = hotelId;
    data.flyInfor.hotelGuid =  hotelId;
    data.dataForeservationDTO.reservationDate = Utils.convertToVNTimeZone(new Date());
    // set some DateTime value that not null
    data.dataForeservationDTO.ccexpDate = Utils.convertToVNTimeZone(new Date());
    return data
}) 
export default NewDataRsvn