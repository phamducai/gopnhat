/* eslint-disable @typescript-eslint/no-explicit-any */
import InventoryApi from "api/inv/inv.api";
import PkmApi from "api/pkm/pkm.api";
import NewDataRsvn from "common/const/newDataRsvn";
import { RoomsInARoomType } from "common/model-inventory";
import { NewReservationData, RoomTypeIdnCounts } from "common/model-rsvn";

interface IDate {
    arrivalDate: Date,
    departureDate: Date,
    nights: number
}

class AddGroupReservstionService {
    static async addGroupReservationData(reservationData: NewReservationData, date: IDate, hotelId: string): Promise<NewReservationData> {
        const data = NewDataRsvn(reservationData, hotelId, date)
        
        const lstRoomTypes: string[] = [];
        reservationData.roomTypeidnCounts.forEach((item: RoomTypeIdnCounts) => {
            item.roomType && lstRoomTypes.push(item.roomType);
            data.roomTypeidnCounts.push({
                roomType: item.roomType,
                count: item.count,
                guestGuid: item.guestGuid,
                maxPerson: 4,
                totalRooms: 5,
                rate: item.rate,
                mappingRooms: item.mappingRooms
            })
        })
        
        const roomsInRoomTypes: RoomsInARoomType[] = await InventoryApi.getRoomsInRoomTypes(hotelId, lstRoomTypes) || [];
        roomsInRoomTypes?.forEach((item: RoomsInARoomType) => {
            const tmp = data.roomTypeidnCounts.find(x => x.roomType === item.roomType);
            tmp && (tmp.mappingRooms = item.rooms.map((x) => {
                return {roomGuid: x.guid, roomName: x.so}
            }));
        })
        data.roomTypeidnCounts.forEach((item) => {
            if(item.mappingRooms)
                item.totalRooms = item.mappingRooms.length
        })

        return data
    }

    static async newRsvnData(data: NewReservationData): Promise<any>{
        return await PkmApi.newReservation(data).toPromise();
    }
}

export default AddGroupReservstionService