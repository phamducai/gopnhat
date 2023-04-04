export enum DateTypeStatus {
    Today = 0,
    Yesterday = 1,
    ByDate = 2,
    Tomorow = 3,
}
export enum RateOption {
    WithRate = 1,
    NoRate = 2,
    WithRateCode = 3,
    WithGroupCode = 4
}
export enum ByOderOption {
    ByRoom = "RoomName",
    ByGuestName = "GuestName",
    ByArrivalDate = "ArrivalDate",
    ByDepartureDate = "DepartureDate",
    ByCompanyAgent = "CompanyAgent",
    ByGroupMaster = "GroupMaster"
}
export enum GuestInHouseOption {
    orderBy = 1,
    RateCode = 2,
    GroupCode = 3
}
export enum OrderByCompanyOption {
    TopByRevenue = "Revenue",
    TopByRoomNight = "RoomNight",
    TopByAverageRoomRate = "ArRate"
}
export enum FixChargeCode {
    RESTAURANT = "2011",
    TELEPHONE = "207",
    REBATE_MINIBAR = "102",
    CHILD_SURCHARGE = "306",
    VISA_CARD = "90003",
    SOURVENIR_SHOP = "20506",
    SERVICE_CHARGE = "303",
    REBATE_ROOMCHARGE = "100",
    BROKEN_LOST = "20511",
    DINNER_CARD = "90006",
    COMPLIMENTARY = "90010",
    JCB_CARD = "90007",
    VALUE_ADD_TAX = "302",
    MASTERCARD = "90004",
    HOUSE_ACCOUNT = "90011",
    REBATE_LAUNDRY = "103",
    REBATE_EXTRABED = "107",
    REBATE_SURCHARGE = "105",
    AMEX_CARD = "90005",
    GUEST_LEDGER = "90009",
    CITY_LEDGER = "90008",
    EXTRA_BED = "304",
    EXTRA_OTASERVICE = "20599",
    BANK_TRANSFER = "90013",
    ROOM_CHARGE = "200",
    REBATE_MISCCHARGE = "10503",
    TRANSPORTATION = "20501",
    MISC_CHARGE = "20503",
    DAY_USE_ROOM_CHARGE = "300",
    CASH_VND = "90001",
    BREAKFAST = "2019",
    LOBBYBAR = "2012",
    TELEPHONE_IDD = "204",
    REBATE_TELEPHONE = "104",
    LAUNDRY = "203",
    REBATE_ACCOUNT_RECEIVABLE = "10650",
    MINIBAR = "202",
    PAIDOUT = "20651",
    ACCOUNT_RECEIVABLE = "20650",
    TOUR_SERVICE_INBOUND = "20504",
    BUSINESS_CENTRE = "20502",
    OTHERS_CARD = "90012",
    REBATE_BUSINESS_CENTRE = "10502",
    REBATE_RESTAURANT = "1011",
    EXTRA_PERSON = "307",
    SURCHARGE = "305",
    ROOM_CHARGE_MANUAL = "301",
    REBATE_TRANSPORTATION = "10501",
    REBATE_TOURSERVICE_INBOUND = "10504",
    BANK_CHARGE = "20505",
    CASH_USD = "90002",
    SPECIAL_TAX = "3021",
    REBATE_LOBBYBAR = "1012",
    GET_FB_MATK1 = "420",
    GET_PAYMENT_MATK1 = "1001",
    GET_REBATE = "1",
    GET_DEPOSIT = "2"
}
export enum EODTypeOption {
    InHouse= "InHouse",
    DayUse= "DayUse",
    WalkIn= "WalkIn",
    LTSG= "LTSG"
}
export enum TypeEODWithOption {
    IsRateCode= 1,
    IsMarket= 2,
    IsSource= 3,
    IsVIP = 4
}
export enum Quarter {
    I= 1,
    II= 2,
    III= 3,
    IV = 4
}
export enum TypeMonthly {
    Monthly = "Monthly",
    RoomType = "RoomType",
    Statistic = "Statistic",
}
export enum TypeHouseKeeping {
    Minibar = "Minibar",
    Laundry = "Laundry",
    LostBroken = "LostBroken",
    ExtraCharge = "ExtraCharge"
}