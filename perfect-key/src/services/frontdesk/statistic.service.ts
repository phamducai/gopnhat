/* eslint-disable @typescript-eslint/no-explicit-any */
import PkmApi from "api/pkm/pkm.api"
import { IResArrivalsDepartures, IDataArrivalsDepartures } from "common/model-statistic"

class StatisticService {
    static async getRoomAndGuestByDate(hotelId: string, arrivalDate: Date): Promise<IResArrivalsDepartures> {
        try {
            return await PkmApi.getRoomAndGuestByDate(hotelId, arrivalDate).toPromise();  
        } catch (error) {
            return {
                arrivals: {actual: {room: 0, guest: 0}, expected: {room: 0, guest: 0}},
                complimentary: {room: 0, guest: 0},
                departures: {actual: {room: 0, guest: 0}, expected: {room: 0, guest: 0}},
                houseUse: {room: 0, guest: 0},
                inHouse: {room: 0, guest: 0},
                walkIns: {room: 0, guest: 0}
            };
        }
    }

    static getDataStatistic(response: IResArrivalsDepartures): IDataArrivalsDepartures[] {
        return [
            {
                key: '1', name: "Arrivals"
            },
            {
                key: '2', name: "Actual", room: response.arrivals.actual.room, guest: response.arrivals.actual.guest
            },
            {
                key: '3', name: "Expected", room: response.arrivals.expected.room, guest: response.arrivals.expected.guest
            },
            {
                key: '4', name: "In-House/High Balance", room: response.inHouse.room, guest: response.inHouse.guest
            },
            {
                key: "Departures", name: "Departures"
            },
            {
                key: "Actual", name: "Actual", room: response.departures.actual.room, guest: response.departures.actual.guest
            },
            {
                key: "Expected", name: "Expected", room: response.departures.expected.room, guest: response.departures.expected.guest
            },
            {
                key: "House Use", name: "House Use", room: response.houseUse.room, guest: response.houseUse.guest
            },
            {
                key: "Complimentary", name: "Complimentary", room: response.complimentary.room, guest: response.complimentary.guest
            },
            {
                key: "Walk Ins", name: "Walk Ins", room: response.walkIns.room, guest: response.walkIns.guest
            }
        ]
    }
}

export default StatisticService;