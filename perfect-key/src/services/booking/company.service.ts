/* eslint-disable @typescript-eslint/no-explicit-any */
import functionPkmApi from 'api/pkm/function.api';
import ProfileApi  from 'api/profile/prf.api';
import { NotificationStatus } from 'common/enum/shared.enum';
import { CompanyProfile } from "common/model-profile";
import openNotification from 'components/CNotification';

class CompanyService{
    static async getCompanyByGuid(companyOrAgentGuid: string): Promise<CompanyProfile | null> {
        try {
            return await ProfileApi.getCompanyProfileByGuid(companyOrAgentGuid).toPromise(); // res = GuestProfileNoRsvn
        }
        catch(err) {
            console.log(err);
        }
        return null
    }
    
    static editCompanyProfile(data: CompanyProfile, companyGuid: string): string {
        try {
            ProfileApi.editCompanyProfileByGuid(data, companyGuid).subscribe();
        } catch (error) {
            console.log(error);
        }
        return "";
    }

    static async mergeCompanyProfile(oldGuestId: string, newGuestId: string): Promise<void> {
        try {
            const editGuest = await functionPkmApi.EditCompany(oldGuestId, newGuestId).toPromise()
            if(editGuest.result)
                openNotification(NotificationStatus.Success, "Success", editGuest.message)
            else 
                openNotification(NotificationStatus.Error, "Error", editGuest.message);
        } catch (err: any) {
            console.log(err)
            openNotification(NotificationStatus.Error, "Error", "Merge profile failed", err.status);
        }
    }
}
export default CompanyService;