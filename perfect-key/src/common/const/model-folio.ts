export interface FolioHistoryRequest {
    hotelGuid: string,
    dateFrom: string,
    dateTo: string,
    guestName: string,
    room: string,
    groupFolioId: string,
    tsRoomId: string, 
    timezone: number
}