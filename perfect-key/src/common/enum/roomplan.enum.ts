export enum InfoRoomPlan{
    Home = 'home',
    UserCheck = 'user-check',
    UserCheckLight = 'user-check-light',
    UserCheckNight = 'user-check-night',
    IconGreen = '#4CAF50',
    IconRed = '#F74352',
    IconBlue = "#56CCF2",
    InforRed = "247, 67, 82",
    InforGreen = "76, 175, 80",
    InforBlue = "86, 204, 242"

}
export enum StatusRoomPlan{
    OOO = 1,
    OOS = 2,
    OCC = 3,
    ATD = 4,
    EA = 5,
    ED = 6,
    VC = 7,
    VD = 8,
    EC = 24,
    VDEA = 9,
    VCEA = 10,
    EDEA = 11,
    LTSG = 12,
    OCLEAN = 13,
    ODIRTY = 14,
    COMP = 15,
    HSU = 16,
    VC_INSPECTED = 17,
    STAY = 22,
    ACCARR = 23,
    UN_ASSIGN = 99
}
export enum ColorStatus{
    OOO = "187, 107, 217",
    OOS = "172, 88, 250",
    OCC = "",
    ATD = "",
    EA = "86, 204, 242",
    ED = "255, 152, 0",
    VC = "86, 204, 242",
    VD = "76, 175, 80",
    EC = "",
    VDEA = "",
    VCEA = "",
    EDEA = "255, 152, 0",
    LTSG = "247, 67, 82",
    OCLEAN = "",
    ODIRTY = "",
    COMP = "187, 107, 217",
    HSU = "187, 107, 217",
    VC_INSPECTED = "86, 204, 242",
    STAY = "247, 67, 82",
    ACCARR = "247, 67, 82",
    UN_ASSIGN = ""
}
export enum TypeCancelRoom{
    CHECKIN_TO_DAY = 1,
    CHECKIN_YESTERDAY = 2,
    SEARCH_CANCEL = 3,
    CANCEL_CHECK_OUT = 4
}
export enum TypeStatusTsRoom {
    Dirty = 0,
    Clean = 1, 
    OutOfOther = 3,
    OutOfService = 4
}
export enum FlagTypeUpdateStatusRoom{
    ToRoom = 0,
    ToFloor = 1,
    ToAllRoom = 2,
    ToInspected = 3,
    ToOutOfOrder = 4
}
export enum ContextMenuRoomPlan{
    Folio = 0,
    CheckIn = 1,
    GroupCheckOut = 2,
    GroupCheckIn = 3
}