import CashierAPI from 'api/cashier/cashier.api';
import HotelConfigApi from 'api/hcfg/hcfg.api';
import { ChildModalCashier } from "common/enum/cashier.enum";

class FolioHelper {
    static async getVoucerMiniBarOrLaundry(hotelGuid: string, typeMiniBar: number): Promise<string>{
        try {
            if(typeMiniBar === ChildModalCashier.MiniBar){
                return await CashierAPI.getVoucherIdMiniBar(hotelGuid).toPromise() ?? "";
            }
            if(typeMiniBar === ChildModalCashier.Laundry){
                return await CashierAPI.getVoucherIdLaundry(hotelGuid).toPromise() ?? "";
            }
            return ""
        } catch (error) {
            console.log(error);
            return "";
        }
    }
    static async checkInValidCard(ccNumbers: number): Promise<boolean>{
        try {
            const ccNumber = ccNumbers.toString().replace(/\s/g, "");
            await HotelConfigApi.checkInValidCard(ccNumber).toPromise();
            return true;
        } catch (error) {
            return false;
        }
    }
}
export default FolioHelper;