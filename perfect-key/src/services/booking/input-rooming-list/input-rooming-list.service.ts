/* eslint-disable*/

import PkmApi from "api/pkm/pkm.api";
import Utils from "common/utils";
import { GuestProfile } from 'common/model-profile';
import GLobalPkm from "common/global";
interface IFormSearch {
    pageNumber?: number,
    pageSize?: number,
    isOnlyMainGuest: boolean,
    hotelGuid: string,
    rsvnId?: string | number,
    rsvnNo?: string | number,
    rsvnCode: string,
    room?: string,
    status: number,
    profileIds: any[],
    companyAgentGuid: string,
    roomType: string,
    arrivalDates: any[],
    departureDates: any[],
    groupCode: string
}
class InputRoomingListService {
    static getInitData = async (rsvnId: string, roomType: any[], companyAgent: any, listGuestProfiles: GuestProfile[], getInHouse: boolean, hotelGuid: string, status: number) => {
        try {
            const formSearch: IFormSearch = {
                pageNumber: 1,
                pageSize: 1000,
                hotelGuid,
                isOnlyMainGuest: false,
                rsvnNo: 0,
                rsvnId,
                rsvnCode: '',
                room: "",
                status: status ?? 5,
                profileIds: [],
                companyAgentGuid: GLobalPkm.defaultBytes32,
                roomType: GLobalPkm.defaultBytes32,
                groupCode: "",
                arrivalDates: [],
                departureDates: [],
            }
            const getRsvnRes = await PkmApi.rsvnQueryParam(formSearch).toPromise();
            if (getRsvnRes) {
                const getStatus = (status: string | number) => {
                    switch (status) {
                        case 0:
                            return (status = "Reservation");
                        case 1:
                            return (status = "CheckIn");
                        default:
                            break;
                    }
                    return "";
                };
                const _dataInputRoomingList: any[] = [];
                getRsvnRes.map((dt: any, index: number) => {
                    const _guest = listGuestProfiles.find(x => x.guid === dt.guestId);
                    if (!getInHouse) {
                        if (dt.status < 2) {
                            _dataInputRoomingList.push({
                                key: index,
                                guid: dt.guestId,
                                status: getStatus(dt.status),
                                groupCode: dt.dataForeservation.groupCode,
                                parentMeGuid: dt.parentMeGuid,
                                roomType: roomType.find(
                                    (roomType) => roomType.guid === dt.roomType
                                )?.ten ?? null,
                                room: dt.transactRoomsGroup.roomName,
                                agent: companyAgent.find(
                                    (company: any) => company.guid === dt.companyAgentGuid
                                )?.ten ?? null,
                                arrival: Utils.formatDateString(dt.arrivalDate !== null ? dt.arrivalDate : ""),
                                departure: Utils.formatDateString(dt.departureDate !== null ? dt.departureDate : ""),
                                firstName: _guest?.firstName,
                                guestName: _guest?.guestName,
                                titlesGuid: _guest?.titlesGuid,
                                passport: _guest?.passport,
                                birthDay: _guest?.birthDay,
                                nationalityGuid: _guest?.nationalityGuid,
                            });
                        }
                    }
                    else
                        if (dt.status === 1) {
                            _dataInputRoomingList.push({
                                key: index,
                                guid: dt.guestId,
                                status: getStatus(dt.status),
                                groupCode: dt.dataForeservation.groupCode,
                                parentMeGuid: dt.parentMeGuid,
                                roomType: roomType.find(
                                    (roomType) => roomType.guid === dt.roomType
                                )?.ten ?? null,
                                room: dt.transactRoomsGroup.roomName,
                                agent: companyAgent.find(
                                    (company: any) => company.guid === dt.companyAgentGuid
                                )?.ten ?? null,
                                arrival: Utils.formatDateString(dt.arrivalDate !== null ? dt.arrivalDate : ""),
                                departure: Utils.formatDateString(dt.departureDate !== null ? dt.departureDate : ""),
                                firstName: _guest?.firstName,
                                guestName: _guest?.guestName,
                                titlesGuid: _guest?.titlesGuid,
                                passport: _guest?.passport,
                                birthDay: _guest?.birthDay,
                                nationalityGuid: _guest?.nationalityGuid,
                            });
                        }
                })
                return _dataInputRoomingList
            }
        } catch (error) {
            console.log(error);
        }
    };
}
export default InputRoomingListService;
