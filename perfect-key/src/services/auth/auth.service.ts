// import { NotificationStatus } from 'common/enum/shared.enum';
import Utils from 'common/utils';
// import openNotification from 'components/CNotification';
class Auth {
    static hasRole(deflautList: string[]): boolean {
        const role = Utils.getValueLocalStorage("role") as string[] ?? []

        if (role.some(x => deflautList.includes(x))) {
            return true;
        } else {
            return false;
        }
    }
}
export default Auth;