/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SYSTEM_CONSTANTS from 'common/constants';
import { CompanyProfile, GuestProfileNoRsvn, MasterAndMemberProfiles, MasterAndMembersGuid, PostGuestProfileDTO } from 'common/model-profile';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import HttpClient from '../http-client';
import { GuestProfile, GuestProfileForRoomingList } from "common/model-profile";
import { ReqGuestProfilesSearch, ResGuestProfiles, ResGuestProfilesSearch } from 'common/define-api-booking';
export default class ProfileApi {
    public static profileHost: string;
    profileHost = '';
    
    static getCompanyProfileFilterByInput(hotelGuid: string, input: string): Observable<CompanyProfile[] | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.COMPANY_PROFILE}/${hotelGuid}/${input}`;
        return HttpClient.get(api).pipe(
            map((res) => res as CompanyProfile[] || null)
        );
    }
    static getCompanyProfileByGuid(guid: string): Observable<CompanyProfile | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.COMPANY_PROFILE}/${guid}`;
        return HttpClient.get(api).pipe(
            map((res) => res as CompanyProfile || null)
        );
    }
    static editCompanyProfileByGuid(data: CompanyProfile, guid: string): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.COMPANY_PROFILE}/${guid}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }

    static getGuestDetailInformationOptions(hotelGuid: string): Observable<CompanyProfile[] | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.PRF_COMPONENT.GUEST_DETAIL_OPTIONS}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res as CompanyProfile[] || null)
        );
    }

    static getGuestMoreInforsOptions(hotelGuid: string): Observable<CompanyProfile[] | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.PRF_COMPONENT.GUEST_MORE_DETAILS}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res as CompanyProfile[] || null)
        );
    }
    static getCompanyMoreCustomerMarket(hotelGuid: string): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.PRF_COMPONENT.COMPANY_MORE_CUSTOMER_MARKET}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res)
        );
    }
    static getCompanyMoreCommissionType(hotelGuid: string): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.PRF_COMPONENT.COMPANY_MORE_COMMISSION_TYPE}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res)
        );
    }

    static getGuestProfiles(data: any): Observable<ResGuestProfiles[]> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_PROFILES}`;
        return HttpClient.get(api, {headers: data}).pipe(
            map((res) => (res as ResGuestProfiles[]))
        );
    }
    static postGuestProfiles(data: GuestProfileNoRsvn[]): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_PROFILES}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as any) || null));
    }
    static getGuestProfileByGuid(guestGuid: string): Observable<GuestProfile | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_NEW_PROFILES}/${guestGuid}`;
        return HttpClient.get(api).pipe(map((res) => (res as any) || null));
    }
    static editGuestProfileByGuid(data: GuestProfileNoRsvn, guestGuid: string): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_NEW_PROFILES}/${guestGuid}`;
        return HttpClient.put(api, data).pipe(map((res) => (res as string) || null));
    }
    static postGuestNewProfiles(
        isOverride: boolean,
        data: PostGuestProfileDTO
    ): Observable<any | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_NEW_PROFILES}/${isOverride}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as any) || null));
    }
    static getGuestProfilesSearch(data: ReqGuestProfilesSearch): Observable<ResGuestProfilesSearch[] | []> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_PROFILES_SEARCH}`;
        return HttpClient.post(api, data).pipe(
            map((res) => (res as ResGuestProfilesSearch[]) || null)
        );
    }

    static getCompanyMoreLoaiHinhHD(hotelGuid: string): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.PRF_COMPONENT.COMPANY_MORE_LOAI_HINH_HD}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res)
        );
    }

    static getGuestProfileById(guestId: string): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GET_PROFILE_BY_GUEST_ID}/${guestId}`;
        return HttpClient.get(api).pipe(
            map((res) => res)
        );
    }
    static getTitlesGuestProfile(hotelGuid: string): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.PRF_COMPONENT.TITLE}/${hotelGuid}`;
        return HttpClient.get(api).pipe(
            map((res) => res)
        );
    }
    static getListCompanyByListGuid(hotelGuid: string, listGuid: string[]): Observable<CompanyProfile[] | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.COMPANY_PROFILE_GUID}/${hotelGuid}`;
        return HttpClient.get(api, { headers: { 'lstGuids': listGuid} }).pipe(
            map((res) => res as CompanyProfile[] || null)
        );
    }
    static createProfileByCountGuest(data: GuestProfile, guestCount: number): Observable<string[] | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.CREATE_PROFILE_BY_COUNT_GUEST}/${guestCount}`;
        return HttpClient.post(api, data).pipe(
            map((res) => res as string[] || null)
        )
    }
    static updateListGuestProfiles(data: GuestProfileForRoomingList[]): Observable<string | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.LIST_GUEST_PROFILES}`;
        return HttpClient.put(api, data).pipe(
            map((res) => res as string || null)
        );
    }
    static getListGuestIdbyRsvnId(rsvnId: string): Observable<string[] | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.RSVN.LIST_GUEST_GUID_PROFILE}/${rsvnId}`;
        return HttpClient.get(api).pipe(
            map((res) => res as string[] || null)
        );
    }
    static addCompanyProfile(data: any): Observable<unknown | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.COMPANY_PROFILE}`;
        return HttpClient.post(api, data).pipe(map((res) => (res as any) || null));
    }
    static postMasterProfileAndMemberProfiles(createMaster: boolean, data: MasterAndMemberProfiles): Observable<MasterAndMembersGuid> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.POST_MAIN_AND_MEMBER_PROFILES}/${createMaster}`;
        return HttpClient.post(api, data).pipe(
            map((res) => res as MasterAndMembersGuid || null)
        )
    }

    static guestProfilesClone(data: string[]): Observable<GuestProfile[] | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_PROFILES}/Clone`;
        return HttpClient.get(api, { headers: { guids: data} }).pipe(
            map((res) => (res as GuestProfile[]) || null)
        );
    }

    static editGuestProflie(data: GuestProfile, guestGuid: string): Observable<string | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_NEW_PROFILES}/${guestGuid}`;
        return HttpClient.put(api, data).pipe(
            map((res) => (res as string) || null)
        );
    }
    static deleteGuest(guestGuid: string[]): Observable<any | null> {
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.DELETE_GUEST}`;
        return HttpClient.delete(api, guestGuid).pipe(
            map((res) => (res as any) || null)
        );
    }
    static getGuestProfileRunNight(data : string[]): Observable<any | null>{
        const api = `${ProfileApi.profileHost}/${SYSTEM_CONSTANTS.API.PRF.GUEST_PROFILE_RUN_NIGHTS}`;
        return HttpClient.get(api,{ headers: { 'guids': data }}).pipe(
            map((res) => (res as any) || null)
        )
    }
}