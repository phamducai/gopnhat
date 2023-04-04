/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import functionPkmApi from 'api/pkm/function.api';
import { EditGroupRSVN } from 'common/model-rsvn-edit';
class EditGroupService {
    static async updateGroupRsvn(data: EditGroupRSVN, rsvnid: string): Promise<any | null> {
        return await functionPkmApi.updateGroupRSVN(data, rsvnid).toPromise();
    }
}
export default EditGroupService;