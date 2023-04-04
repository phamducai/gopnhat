/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ProfileApi from "api/profile/prf.api";
import { GuestProfileNoRsvn } from "common/model-profile";
import { GuestProfile } from "common/model-profile";

class ProfilesService {
    static async createNewGuestProfiles(data: GuestProfileNoRsvn[]): Promise<GuestProfileNoRsvn | null> {
        const res = await ProfileApi.postGuestProfiles(data).toPromise() as GuestProfileNoRsvn || null;
        return res // res = string[guid]
    }
    static async getGuestProfileByGuid(guestGuid: string): Promise<GuestProfileNoRsvn | null> {
        try {
            const res = await ProfileApi.getGuestProfileByGuid(guestGuid).toPromise() as GuestProfileNoRsvn || null
            return res // res = GuestProfileNoRsvn
        }
        catch(err) {
            console.log(err);
        }
        return null
    }
    static async createProfileByCountGuest(data: GuestProfile, countGuest: number): Promise<any | null> {
        return await ProfileApi.createProfileByCountGuest(data, countGuest).toPromise();
    }

    static async updateListProfiles(data:any): Promise<any | null> {
        return await ProfileApi.updateListGuestProfiles(data).toPromise();
    }
    static editGuestProfile(data: GuestProfileNoRsvn, guestGuid: string): string {
        try {
            ProfileApi.editGuestProfileByGuid(data, guestGuid).subscribe();
        } catch (error) {
            console.log(error);
        }
        return "";
    }
}
export default ProfilesService;