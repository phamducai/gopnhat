/*eslint-disable*/
import ProfileApi from 'api/profile/prf.api';
import PkmApi from 'api/pkm/pkm.api';
import { GuestProfileForRoomingList, GuestProfile } from "common/model-profile";
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { IFormSearch, IPagination } from 'redux/controller/booking.slice';
import GLobalPkm from 'common/global';
import { ReqGuestProfilesSearch, ResGuestProfilesSearch } from "common/define-api-booking";
import { GuestHistoryYear, CompanyHistoryYear } from "common/model-rsvn"
import {ReservationStatus} from "common/enum/booking.enum"
import functionPkmApi from 'api/pkm/function.api';

class GuestProfileService {

    static async getGuestProfileByGuid(guid: string): Promise<GuestProfile | null> {
        return await ProfileApi.getGuestProfileById(guid).toPromise() as GuestProfile || null;
    }
    static async updateListProfiles(data: GuestProfileForRoomingList[]): Promise<any> {
        try {
            const res = await ProfileApi.updateListGuestProfiles(data).toPromise();
            if (res)
                openNotification(NotificationStatus.Success, "Success", res)
            return res;
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Error, "Failed", "Update Failed!", error.status)
            return error.response;
        }
    }
    static async getGuestProfile(data: ReqGuestProfilesSearch) {
        try {
            return ProfileApi.getGuestProfilesSearch(data).toPromise() as any
        } catch (err) {
            console.log(err)
            return []
        }
    }
    static async getHistoryGuest(data: any) {
        const { hotelGuid, profileIds, availableDate, pageNumber, pageSize, companyAgentGuid, arrivalDates, departureDates, getAll } = data;
        const formSearch: IFormSearch = {
            pageNumber: pageNumber ? pageNumber : 1,
            pageSize: pageSize ? pageSize : 4,
            hotelGuid,
            isOnlyMainGuest: false,
            rsvnNo: 0,
            rsvnCode: "",
            room: "",
            status: getAll ? ReservationStatus.WaitingList : ReservationStatus.Cancel,
            profileIds: profileIds,
            companyAgentGuid: companyAgentGuid !== GLobalPkm.defaultBytes32 ? companyAgentGuid : GLobalPkm.defaultBytes32,
            roomType: GLobalPkm.defaultBytes32,
            groupCode: "",
            arrivalDates: arrivalDates ? arrivalDates : [],
            departureDates: [],
        }
        const newFormSearch = availableDate ? { ...formSearch, availableDate: availableDate } : formSearch
        try {
            const res = await PkmApi.rsvnQueryParam(newFormSearch, true).toPromise()
            const dataSearch = res.response
            const resPage = res.xhr.getResponseHeader("x-pagination");
            return {
                dataSearch,
                resPage: JSON.parse(resPage)
            }
        } catch (err) {
            console.log(err)
            return {
                dataSearch: [],
                resPage: {
                    CurrentPage: 1,
                    PageSize: 4,
                    TotalCount: 1,
                    TotalPages: 1,
                    HasNext: false,
                    HasPrevious: false
                }
            }
        }
    }
    static async getHistoryGuestPRF(data: any, checkSearchMerge: boolean) {
        const { hotelGuid, profiles } = data;
        const newData = {
            hotelGuid: hotelGuid,
            ...profiles,
        };
        try {
            const res = await ProfileApi.getGuestProfilesSearch(newData).toPromise() as any
            const profileIds = res.map(
                (profiles: ResGuestProfilesSearch) => profiles.guid
            );
            if (res.length > 0) {
                if (!checkSearchMerge) {
                    return GuestProfileService.getHistoryGuest({
                        ...newData,
                        profileIds: profileIds,
                        getAll: false
                    });
                }else{
                    return GuestProfileService.getHistoryGuest({
                        ...newData,
                        profileIds: profileIds,
                        getAll: true
                    });
                }
            }
            return []
        } catch (err) {
            console.log(err)
            return []
        }
    }
    static async getHistoryYearGuest(data: GuestHistoryYear) {
        try {
            const res = await PkmApi.getGuestHistoryYear(data, true).toPromise()
            const dataSearch = res.response
            const resPage = res.xhr.getResponseHeader("x-pagination");
            console.log(res)
            return {
                dataSearch,
                resPage: JSON.parse(resPage)
            }
        } catch (err) {
            console.log(err)
            return {
                dataSearch: [],
                resPage: {
                    CurrentPage: 1,
                    PageSize: 4,
                    TotalCount: 1,
                    TotalPages: 1,
                    HasNext: false,
                    HasPrevious: false
                }
            }
        }
    }
    static async getHistoryYearCompany(data: CompanyHistoryYear) {
        try {
            const res = await PkmApi.getCompanyHistoryYear(data, true).toPromise()
            const dataSearch = res.response
            const resPage = res.xhr.getResponseHeader("x-pagination");
            console.log(res)
            return {
                dataSearch,
                resPage: JSON.parse(resPage)
            }
        } catch (err) {
            console.log(err)
            return {
                dataSearch: [],
                resPage: {
                    CurrentPage: 1,
                    PageSize: 4,
                    TotalCount: 1,
                    TotalPages: 1,
                    HasNext: false,
                    HasPrevious: false
                }
            }
        }
    }
    static async editGuestProfile(oldGuestId: string, newGuestId: string) {
        try {
            const editGuest = await functionPkmApi.EditGuestInTSRoom(newGuestId, oldGuestId).toPromise()
            if(editGuest.result == true){
                const deleteOldGuest = await ProfileApi.deleteGuest([newGuestId]).toPromise()
                if(deleteOldGuest.result === true) 
                    return true
            }else return false
        } catch (err) {
            console.log(err)
            return false
        }
    }

}
export default GuestProfileService;