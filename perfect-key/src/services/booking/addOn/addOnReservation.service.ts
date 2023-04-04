/* eslint-disable @typescript-eslint/no-explicit-any */
import InventoryApi from "api/inv/inv.api";
import PkmApi from "api/pkm/pkm.api";
import NewDataRsvn from "common/const/newDataRsvn";
import { RoomsInARoomType } from "common/model-inventory";
import { NewReservationData } from "common/model-rsvn";

interface IDate {
    arrivalDate: Date,
    departureDate: Date,
    nights: number
}
interface ISelectedRow{
    roomType: string,
    roomName: string,
    rate: number | string
}

class AddOnReservstionService {
    static async addOnReservationData(reservationData: NewReservationData, date: IDate, hotelId: string, rate: number, room :ISelectedRow): Promise<NewReservationData> {
        const data: NewReservationData = NewDataRsvn(reservationData, hotelId, date)

        const lstRoomTypes: string[] = [];
        const dataFiltler = reservationData?.roomTypeidnCounts.filter((value) =>
            value.roomType === room.roomType
        )
        const reservation = dataFiltler[0]
        reservation?.roomType && lstRoomTypes.push(reservation.roomType);
        data.roomTypeidnCounts.push({
            roomType: reservation?.roomType,
            count: reservation?.count,
            guestGuid: reservation?.guestGuid,
            maxPerson: 4,
            totalRooms: 5,
            rate: rate !== 1 ? rate : reservation?.rate,
            mappingRooms: reservation?.mappingRooms
        });

        const roomsInRoomTypes: RoomsInARoomType[] = await InventoryApi.getRoomsInRoomTypes(hotelId, lstRoomTypes) || [];
        roomsInRoomTypes?.forEach((item: RoomsInARoomType) => {
            const tmp = data.roomTypeidnCounts.find(x => x.roomType === item.roomType);
            tmp && (tmp.mappingRooms = item.rooms.map((x) => {
                return {roomGuid: x.guid, roomName: x.so}
            }));
        })
        data.roomTypeidnCounts.forEach((item) => item.totalRooms = item.mappingRooms.length)
        return data
    }

    static async newRsvnData(data: NewReservationData): Promise<any>{
        return await PkmApi.newReservation(data).toPromise();
    }
}

export default AddOnReservstionService