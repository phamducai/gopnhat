import { ExchangeRate, IGetDmucTuyChon, ITableLaundry } from './../../common/model-hcfg';
/* eslint-disable @typescript-eslint/no-explicit-any */
import HotelConfigApi from "api/hcfg/hcfg.api";
import { ITableMinibarAndLaundry } from "common/cashier/model-cashier";
import { NotificationStatus } from "common/enum/shared.enum";
import openNotification from "components/CNotification";
import { IDataLaundryMaping } from 'common/cashier/model-folio';
import functionPkmApi from 'api/pkm/function.api';

export default class HotelConfigService {
    static async getAllMiniBar(hotelGuid: string): Promise<ITableMinibarAndLaundry[]>{
        try {
            const res = await HotelConfigApi.getAllMinibarById(hotelGuid).toPromise();
            const sourceTable: ITableMinibarAndLaundry[] = []
            if(res){
                res?.forEach((item, index) => {
                    sourceTable.push({
                        hangHoa: index,
                        hangHoaGuid: item.guid,
                        donGia: item.donGia,
                        soLuong: 0,
                        donGiaUsd: 0,
                        thanhTien: null,
                        status: 0,
                        dienGiai: "",
                        fullName: item.fullName,
                        hotelGuid: item.hotelGuid,
                        ten: item.ten,
                    })
                })
            }
            return sourceTable
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response.message,"", error.status);
            return [];
        }
    }
    static async getAllLDaoDichHangHoa(hotelGuid: string): Promise<any[] >{
        try {
            const res = await HotelConfigApi.getAllHangHoaDichVuById(hotelGuid).toPromise();
            const sourceTable: ITableMinibarAndLaundry[] = []
            if(res){
                res?.forEach((item, index) => {
                    sourceTable.push({
                        hangHoa: index,
                        hangHoaGuid: item.guid,
                        donGia: item.donGia,
                        soLuong: 0,
                        donGiaUsd: 0,
                        thanhTien: null,
                        status: 0,
                        dienGiai: "",
                        fullName: item.fullName,
                        hotelGuid: item.hotelGuid,
                        ten: item.ten,
                    })
                })
            }
            return sourceTable
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response.message,"", error.status);
            return [];
        }
    }
    static async getAllLaundry(hotelGuid: string): Promise<IDataLaundryMaping[] >{
        try {
            const dataTableMap: IDataLaundryMaping[] = [];
            const resp = await HotelConfigApi.getAllQuanAoGiatLaVuById(hotelGuid).toPromise() as ITableLaundry[];
            if(resp){
                resp.forEach((item: ITableLaundry) => {
                    dataTableMap.push({
                        ten: item.ten,
                        dienGiai: "",
                        hangHoa: item.id,
                        hangHoaGuid: item.guid,
                        soLuong: 0,
                        disableIn1: false,
                        laundryUSD: item.laundryUSD,
                        thanhTien: 0,
                        soLuong1: 0,
                        disableIn2: false,
                        dryCleaningUSD: item.dryCleaningUSD,
                        thanhTien1: 0,
                        soLuong2: 0,
                        disableIn3: false,
                        pressingOnlyUSD: item.pressingOnlyUSD,
                        thanhTien2: 0,
                        hotelGuid: item.hotelGuid
                    })
                })
            }
            return dataTableMap;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response.message,"", error.status);
            return [];
        }
    }
    static async getExchageRateByHotel(currency1: number, currency2: number, hotelGuid: string): Promise<number>{
        try {
            const resp = await HotelConfigApi.getExchangeRate(hotelGuid, currency1, currency2).toPromise();
            if(resp){
                return resp.giaTri;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }
    static async postExchageRateByHotel(dataPost: ExchangeRate): Promise<boolean>{
        try {
            await HotelConfigApi.postExchangeRate(dataPost).toPromise();
            openNotification(NotificationStatus.Success, "Post exchange rate success !","");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Post exchange rate failed !","", error.status);
            return false;
        }
    }
    static async getDmucTuyChonByMaAndHotelId(ma: string, hotelGuid: string): Promise<IGetDmucTuyChon | null>{
        try {
            return await functionPkmApi.getDmucTuyChonByMaAndHotelId(ma, hotelGuid).toPromise();
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Get data failed !","", error.status);
            return null;
        }
    }
}