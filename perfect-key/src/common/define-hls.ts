export interface HlsHotel {
    id: number,
    guid: string,
    pmS_ID: string,
    hlS_ID: string,
    hotelName: string,
    hotelCode: string,
    hotelNote: string,
    hotelChannelKey: string
}
export interface CancellationRules {
    policyId: string,
    daysPriorCheckin: number,
    penaltyType: number,
    penaltyAmount: number,
    action: string
}
export interface HlsRatePlan {
    ratePlanId: string,
    name: string,
    guestsIncluded: number,
    adultGuestsIncluded: number,
    childGuestsIncluded: number,
    maxGuests: number,
    extraGuestsConfig: string,
    minRoomRate: number,
    mealsIncluded: {
        breakfast: boolean,
        lunch: boolean,
        dinner: boolean,
        allInclusive: boolean
    },
    lastMinuteDefault: {
        numberDaysInAdvance: number,
        valueChange: string,
        valueType: string,
        amount: number
    },
    bookingCondition: {
        bookingConditionId: string,
        depositType: number,
        cancellationRules: CancellationRules[],
        action: string
    },
    roomId: null,
    inclusions: string,
    inclusionsName: string,
    inclusionsDescription: string,
    order: number

}
export interface HlsRoom {
    roomId: string,
    name: string,
    ratePlans: HlsRatePlan[],
    order: number
}

export interface RatePlanRes {
    result: string,
    message: string,
    error: number,
    data: {
        rooms: HlsRoom[]
    }
}
export interface RatePlanData {
    rooms: HlsRoom[]
}
export interface RoomTypeMapping {
    id?: number,
    guid?: string,
    hotelId: string,
    pmsRoomTypeId: string,
    hlsRoomTypeId: string,
    dateCreated?: string,
    pmsRoomTypeIdName: string,
    hlsRoomTypeIdName: string
}
export interface ChannelAllotment {
    id?: number,
    guid?: string,
    ngayThang: string,
    roomTypePMSId: number,
    roomTypePMSGUID: string,
    roomTypePMSCode: string,
    roomTypeHLSId: string,
    roomTypeHLSCode: string,
    pmS_RoomTypeIdName?: string,
    hlS_RoomTypeIdName?: string,
    soLuong: number,
    realesePeriod?: number,
    tgtn?: string,
    nguoiDung: string,
    tgtN2?: string,
    nguoiDung2: string,
    status?: null,
    flagType?: null,
    isDeleted?: null,
    hotelGUID?: string
}
export interface RatePackage {
    ratePlanId: string,
    rate: {
        amount: {
            type: string,
            value: string,
            currency: string
        },
        action: string
    },
    extraAdultRate?: {
        amount: {
            type: string,
            value: string,
            currency: string
        },
        action: string
    },
    extraChildRate?: {
        amount: {
            type: string,
            value: string,
            currency: string
        },
        action: string
    },
    minNights?: string,
    maxNights?: string,
    closeToArrival?: string,
    closeToDeparture?: string,
    stopSell?: string,
    dateRange: {
        from: string,
        to: string
    }
}
export interface Availability {
    dateRange: {
        from: string,
        to: string
    },
    quantity: string,
    releasePeriod: string,
    action: string
}
export interface Inventory {
    roomId: string,
    availabilities?: Availability[],
    ratePackages?: RatePackage[]
}
export interface SetInventoryReq {
    hlsCredential: {
        hotelId: string,
        lang: string
    },
    saveInventoryRequest: {
        inventories: Inventory[],
        credential: {
            hotelId: string,
            hotelAuthenticationChannelKey: string
        },
        lang: string
    }
}
export interface UpdateRatePlanRes {
    id: string,
    name: string,
    action: string
}
export interface UpdateRateInventoryRes {
    roomId: string,
    ratePlans?: []
}
export interface SetInventoryRes {
    result: boolean,
    data: {
        updatedRateInventory: UpdateRateInventoryRes[]
    },
    message: string,
    error: number
}

export const SetInventoryAction = {
    SET: "SET",
    INCREASE: "INCREASE",
    DECREASE: "DECREASE"
}
export const DEFAULT_SET_INVENTORY: SetInventoryReq = {
    hlsCredential: {
        hotelId: "",
        lang: "en"
    },
    saveInventoryRequest: {
        inventories: [],
        credential: {
            hotelId: "string",
            hotelAuthenticationChannelKey: "string"
        },
        lang: "en"
    }
}
