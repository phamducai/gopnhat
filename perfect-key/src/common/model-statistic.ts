export interface IRoomAndGuest {
    room: number,
    guest: number
}

export interface IResArrivalsDepartures {
    arrivals: {
        actual: IRoomAndGuest,
        expected: IRoomAndGuest
    },
    departures: {
        actual: IRoomAndGuest,
        expected: IRoomAndGuest
    },
    inHouse: IRoomAndGuest,
    houseUse: IRoomAndGuest,
    complimentary: IRoomAndGuest,
    walkIns: IRoomAndGuest
}

export interface BookingStat {
    "reservCode": string,
    "totalRoom": number,
    "totalGuest": number,
    "masterGuest": string | number,
    "totalFixCharge": number,
    "roomRevenue": number,
    "totalRevenue": number,
    "deposit": number
}
export interface IDataArrivalsDepartures {
    key: string,
    name: string,
    room?: number,
    guest?: number
}
export interface RevenueInDaysData {
    Key: string,
    Value: number
}
export interface StatisticGuestInRoom {
    arrivals: {actual: {room: number, guest: number}, expected: {room: number, guest: number}},
    complimentary: {room: number, guest: number},
    departures: {actual: {room: number, guest: number}, expected: {room: number, guest: number}},
    houseUse: {room: number, guest: number},
    inHouse: {room: number, guest: number},
    walkIns: {room: number, guest: number},
}
export interface HouseKepping {
    clean: number, dirty: number, inspected: number
}

export interface OccupiedToNight {
    room: number,
    guest: number
}
export interface SourceData {
    sourceMarketGuid: string,
    value: RevenueInDaysData[]
}
export interface MarketData {
    sourceMarketGuid: string,
    value: RevenueInDaysData[]
}
