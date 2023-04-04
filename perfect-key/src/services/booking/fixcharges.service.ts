import functionPkmApi from 'api/pkm/function.api';
import Utils from 'common/utils';
import { ResultFixCharge } from './../../common/model-hcfg';
import HotelConfigApi from "api/hcfg/hcfg.api";
import { ITableFixCharge } from "common/model-booking";
import { IFixCharge,OjectFixCharge } from "common/model-hcfg";
import { DataFoextraCharge } from "common/model-rsvn";
import { InforExtraBed, PostExtraBed } from 'common/model-rsvn-edit';

class FixChargesService{
    
    static async filterDataFixCharges(hotelGuid: string, isEdit: boolean, dataFoextraCharge: DataFoextraCharge[]): Promise<ResultFixCharge> {
        const dataRes = await HotelConfigApi.getAllFixChareByHotel(hotelGuid).toPromise();
        const newData: ITableFixCharge[] = [];
        if(dataRes){
            dataRes.forEach((item: IFixCharge) =>{
                if(item.maTk2 === "3"){
                    newData.push({
                        id: item.id,
                        guid: item.guid,
                        autoPost: "x",
                        parent: item.parent,
                        ma: item.ma,
                        ten: item.ten,
                        soLuong: 0,
                        donGia: item.soTk5,
                        thanhTien: 0,
                        ghiChu: "",
                        hotelGuid: item.hotelGuid,
                        kieuNgay: 0,
                        soNgay: 0
                    })
                }
            });
            newData.forEach((item) => {
                const itemFixCharge = dataFoextraCharge.find(x => x.maTk === item.ma);
                item.soLuong = itemFixCharge?.soLuong ?? 0;
                item.donGia = itemFixCharge?.donGia ?? 0;
                item.thanhTien = Utils.formatNumber(itemFixCharge?.thanhTien ?? 0);
                item.kieuNgay = itemFixCharge?.kieuNgay ?? 0;
                item.ghiChu = itemFixCharge?.ghiChu ?? "";
            })
            return { listFixCharge : dataRes?.filter(x => x.maTk2 === "3"), tableFixCharge : newData };
        }
        return {listFixCharge : null, tableFixCharge : []};
    }
    static mapDataTable(dataTable: ITableFixCharge[]): ITableFixCharge[]{ //case edit
        let dataSelectedFixcharge: ITableFixCharge[] = []
        dataTable.forEach((item) => {
            if(Utils.parseLocaleNumber(item.thanhTien.toString()) !== 0){ //get row is amount !== 0
                dataSelectedFixcharge = [...dataSelectedFixcharge,Object.assign({},item)]
            }
        })
        return dataSelectedFixcharge;
    }
    static mapDataFoextraCharge(dataTableFixChare: ITableFixCharge[],date?: string): OjectFixCharge{
        const newData: DataFoextraCharge[] = [];
        let totalFx = 0;
        dataTableFixChare.forEach((item: ITableFixCharge) => {
            totalFx += Utils.parseLocaleNumber(item.thanhTien.toString());
            newData.push({
                parent: item.parent,
                inHouse: 0,
                taiKhoan: 0,
                maTk: item.ma,
                tenTk: item.ten,
                soLuong: item.soLuong,
                donGia: Utils.parseLocaleNumber(item.donGia.toString()),
                thanhTien: Utils.parseLocaleNumber(item.thanhTien.toString()),
                flagType: 0,
                nguoiDung: 0,
                nguoiDung2: 0,
                ghiChu: item.ghiChu,
                ngayThang: date,
                kieuNgay: item.kieuNgay,
                tuNgay: 0,
                denNgay: 0,
                autoPost: item.autoPost === "x" ? true : false,
                hotelGuid: item.hotelGuid,
                dataFoextraChargeDetails: []
            })
        })
        return {totalFixCharge: totalFx, dataFoextraCharge: newData};
    }
    static setTotalAmountFixCharge(dataFoextraCharge: DataFoextraCharge[]): number{
        let totalAmount = 0;
        dataFoextraCharge.forEach((item: DataFoextraCharge) => {
            totalAmount += item.thanhTien;
        })
        return totalAmount;
    }
    static handleDateFixCharge(value: number,maxNight: number): number{
        if(value === 0){
            return maxNight;
        }
        if(value === 1 || value === 2){
            return 1;
        }
        if(value === 3){
            return maxNight >= 2 ? 2 : 1;
        }
        return 1;
    }
    static async getInfoExtraBed(arivalDay: Date, depatureDay: Date, hotelGuid: string): Promise<InforExtraBed | null>{
        try {
            const data: PostExtraBed = {
                id : 13,
                hotelGuid: hotelGuid,
                maTk: "304",
                arrivalDate: Utils.formatDateCallApi(arivalDay),
                depatureDate: Utils.formatDateCallApi(depatureDay)
            }
            return await functionPkmApi.getDMucTuyChonAmoutBed(data).toPromise();;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
export default FixChargesService;
