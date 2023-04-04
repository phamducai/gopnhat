
export enum ChildModalCashier {
    MiniBar = 0,
    Laundry = 1,
    PostRoomChange = 2,
    AdvanceRoomChange = 3,
    PostFoodAndBeverage = 4,
    PostOtherService = 5,
    Correction = 6,
    DayUse = 8,
    Split = 11,
    Combine = 9,
    CombineAll = 10,
    Filter = 12
}

export enum ServiceHotelMa {
    MiniBar = "202",
    Laundry = "203",
    FoodAndBeverage = "420",
    PostRoomChange = "301",
    AdvanceRoomChange = "200",
    TelephoneChange = "204",
    DayUse = "300",
    Other = '1',
    ExpressService = "MNSC"
}
export enum ServiceHotelMaTK {
    OtherService = "200",
    FoodAndBeverage = "420",
    PaymentMethod = "100"
}
export enum ServiceHotelMaTK2 {
    Rebate = "1"
}
export enum KeyMove {
    Folio = 0,
    AnotherRoom = 1,
    AnotherRsvn = 2
}
export enum typeTracerTo {
    GuestOnly = 1,
    AllGuestInGroup = 2,
    GuestSameArrival = 3,
    GuestSameDeparture = 4,
    GuestInHouseBetween = 5,
    GuestArrivalBetween = 6,
    GuestDepartureBetween = 7
}

export enum TypeStatusMessage {
    Unread = 0,
    Read = 1,
    Reply = 2
}

export enum TypeTracer {
    Tracer = 0,
    AlertCheckIn = 1,
    AlertCheckOut = 2
}
export enum PaymentMethod{
    VISA = "90003",
    DINNNERCARD = "90006",
    JCBCARD = "90007",
    MASTERCARD = "90004",
    AMEXCARD = "90005",
    OTHERSCARD = "90012",
    CASHUSD = "90002"
}
export enum FlagTypeLaundry{
    Laundry = 0,
    Dry = 1,
    PreesingOnly  = 2
}