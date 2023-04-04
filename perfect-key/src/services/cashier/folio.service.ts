import CashierService from 'services/cashier/cashier.service';
import { addDays, differenceInDays } from 'date-fns';
import { IPostingLaundry, IMapDataDetailLaundry, IChiTietGiaoDichLaundryCreateDTOs, IPostingFoodAndOther, IPostingCommonFoodAndOther, ICreateDTOFolio, IPostingAdvanceRoomCharge, IPostingCommon, ISplitFolio, IPostingSplit, IPostingCorrection, IPostingMove, IPostingPaymentDTO, IPostCommon } from './../../common/cashier/model-folio';
/* eslint-disable @typescript-eslint/no-explicit-any */
import Utils from 'common/utils';
import { IFormMiniBarOrLaundry, IFormCommonPosting, IPostingMiniBar } from './../../common/cashier/model-folio';
import { IDataCharge, IDataCheckBalanceDTO, IGetDataFolio,  ITableMinibarAndLaundry } from './../../common/cashier/model-cashier';
import CashierAPI from 'api/cashier/cashier.api';
import { ICreateChiTietGiaoDichMiniBar, IMapDataChiTiet, ICombineFolio } from 'common/cashier/model-folio';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import HotelConfigApi from 'api/hcfg/hcfg.api';
import { IFixCharge, ITableLaundry } from 'common/model-hcfg';
import { ITableFixCharge } from 'common/model-booking';
import { ServiceHotelMa } from 'common/enum/cashier.enum';
import { IFormRebate, IFormRoomCharge } from 'common/cashier/model-form';
import functionPkmApi from 'api/pkm/function.api';
import ProfileApi from 'api/profile/prf.api';
import { DataPrintOption } from 'common/cashier/model-print-folio';
import PkmApi from 'api/pkm/pkm.api';
import { DataFoTransactRoomDTO } from 'common/model-rsvn';
import rSVN_DEFAULT_DATA from "common/const/newRSVNDefaultValue";
import { ReservationStatus } from 'common/enum/booking.enum';

interface ICommonInfo {
    hotelGuid: string,
    parentGuid: string,
    nguoiDung2: string,
    language: string
}
export default class FolioService {
    static idProfile = Utils.getValueLocalStorage("idProfile");
    static mapDataChiTietMiniBar(dataChiTietMiniBar: ITableMinibarAndLaundry[]): IMapDataChiTiet {
        const data: ICreateChiTietGiaoDichMiniBar[] = [];
        let dienGiai = "";
        dataChiTietMiniBar.forEach((item: ITableMinibarAndLaundry) => {
            data.push({
                hangHoa: item.hangHoa,
                hangHoaGuid: item.hangHoaGuid,
                soLuong: item.soLuong,
                donGia: item.donGia,
                thanhTien: item.thanhTien ?? 0,
                status: item.status,
                hotelGuid: item.hotelGuid
            })
            dienGiai += item.dienGiai
        })
        return {
            dienGiai: dienGiai,
            chiTietGiaoDichMiniBarCreateDTO: data
        };
    }
    static async postingMiniBar(data: IPostingMiniBar, dataChiTietMiniBar: ITableMinibarAndLaundry[], dataForm: IFormMiniBarOrLaundry,
        dataCommon: IFormCommonPosting, maService: string, dataCharge: IDataCharge): Promise<string | null> {
        const mapChiTiet = this.mapDataChiTietMiniBar(dataChiTietMiniBar);
        data.tsRoomId = dataCommon.tsRoomId;
        data.tinhChat = dataCommon.tinhChat;

        //data.giaoDichHangHoaMiniBarCreateDTO.guest = dataForm.guest;
        data.giaoDichHangHoaMiniBarCreateDTO.ngayThang = Utils.convertMiddleDate(dataForm.ngayThang);
        data.giaoDichHangHoaMiniBarCreateDTO.so = `${dataForm.so}`;
        data.giaoDichHangHoaMiniBarCreateDTO.guest = dataForm.guest;
        data.giaoDichHangHoaMiniBarCreateDTO.ghiChu = dataForm.ghiChu;
        data.giaoDichHangHoaMiniBarCreateDTO.hotelGuid = dataCommon.hotelGuid;

        data.giaoDichHangHoaMiniBarCreateDTO.thanhTien = dataCharge.thanhTien;
        data.giaoDichHangHoaMiniBarCreateDTO.tyLeGiamTru = dataCharge.tiLeGiamTru ?? 0
        data.giaoDichHangHoaMiniBarCreateDTO.soTienGiamTru = dataCharge.soTienGiamTru
        data.giaoDichHangHoaMiniBarCreateDTO.servicesCharge = dataCharge.valueSC
        data.giaoDichHangHoaMiniBarCreateDTO.vatcharge = dataCharge.valueVAT
        data.giaoDichHangHoaMiniBarCreateDTO.freeCharge = dataForm.freeCharge;
        data.giaoDichHangHoaMiniBarCreateDTO.tongSoTien = dataForm.freeCharge ? 0 : dataCharge.totalValue
        data.giaoDichHangHoaMiniBarCreateDTO.nguoiDung = this.idProfile;

        data.chiTietGiaoDichMiniBarCreateDTO = mapChiTiet.chiTietGiaoDichMiniBarCreateDTO;

        if (maService === ServiceHotelMa.MiniBar) {
            data.dataFofolioCreateDTO.dienGiai = `${dataCommon.ten} - #${dataForm.so}(${mapChiTiet.dienGiai})`;
        } else {
            data.dataFofolioCreateDTO.dienGiai = `${dataCommon.ten} - #${dataForm.so}(${mapChiTiet.dienGiai})`;
        }

        data.dataFofolioCreateDTO.parentGuid = dataCommon.parentGuid;
        data.dataFofolioCreateDTO.ma = dataCommon.ma;
        data.dataFofolioCreateDTO.maTk = dataCommon.maTk;
        data.dataFofolioCreateDTO.nguoiDung2 = dataCommon.nguoiDung2;
        data.dataFofolioCreateDTO.hotelGuid = dataCommon.hotelGuid;
        data.dataFofolioCreateDTO.guest = dataForm.guest;
        data.dataFofolioCreateDTO.soPhong = dataForm.soPhong ?? "";
        data.dataFofolioCreateDTO.ngayThang = Utils.formatDateCallApi(dataForm.ngayThang);
        data.dataFofolioCreateDTO.nguoiDung = this.idProfile;

        try {
            await CashierAPI.postingMiniBar(data).toPromise()
            openNotification(NotificationStatus.Success, " ", "Create post minibar success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }

    static async filterDataFixChargeByMa(hotelGuid: string, ma: string): Promise<IFixCharge | null> {
        const dataRes = await HotelConfigApi.getAllFixChareByHotel(hotelGuid).toPromise();
        if (dataRes) {
            const data = dataRes.find(x => x.ma === ma)
            return data ?? null
        }
        return null
    }
    static async filterDataFixChargeByMaTK(hotelGuid: string, maTK: string): Promise<IFixCharge[] | null> {
        const dataRes = await HotelConfigApi.getAllFixChareByHotel(hotelGuid).toPromise();
        if (dataRes) {
            return dataRes.filter(x => x.maTk1 === maTK);
        }
        return null
    }
    static async filterDataFixChargeByMaTK2(hotelGuid: string, maTK2: string): Promise<IFixCharge[]> {
        try {
            const dataRes = await HotelConfigApi.getAllFixChareByHotel(hotelGuid).toPromise();
            if (dataRes) {
                return dataRes.filter(x => x.maTk2 === maTK2);
            }
        } catch (error) {
            return [];
        }

        return []
    }
    static mapDataTable(dataTable: ITableFixCharge[]): ITableFixCharge[] { //case edit
        let dataSelectedFixcharge: ITableFixCharge[] = []
        dataTable.forEach((item) => {
            if (Utils.parseLocaleNumber(item.thanhTien.toString()) !== 0) { //get row is amount !== 0
                dataSelectedFixcharge = [...dataSelectedFixcharge, Object.assign({}, item)]
            }
        })
        return dataSelectedFixcharge;
    }

    //Posting Laundry
    static mapListDataDetailLaundry(dataChiTietMiniBar: ITableMinibarAndLaundry[]): IMapDataDetailLaundry {
        const data: IChiTietGiaoDichLaundryCreateDTOs[] = [];
        let dienGiai = "";
        dataChiTietMiniBar.forEach((item: ITableMinibarAndLaundry) => {
            data.push({
                hangHoa: item.hangHoa,
                hangHoaGuid: item.hangHoaGuid,
                soLuong: item.soLuong,
                donGia: item.donGia,
                thanhTien: item.thanhTien ?? 0,
                status: item.status,
                flagType: item.flagType ?? 0,
                hotelGuid: item.hotelGuid
            })
            dienGiai += item.dienGiai
        })
        return {
            dienGiai: dienGiai,
            chiTietGiaoDichLaundryCreateDTOs: data
        };
    }
    static async postingLaundry(data: IPostingLaundry, dataTableLaundry: ITableMinibarAndLaundry[], dataForm: IFormMiniBarOrLaundry,
        dataCommon: IFormCommonPosting, dataCharge: IDataCharge): Promise<string | null> {
        const mapData = this.mapListDataDetailLaundry(dataTableLaundry);
        data.tsRoomId = dataCommon.tsRoomId;
        data.tinhChat = dataCommon.tinhChat;

        data.giaoDichLaundryCreateDTO.guest = dataForm.guest;
        data.giaoDichLaundryCreateDTO.ngayThang = Utils.convertMiddleDate(dataForm.ngayThang);
        data.giaoDichLaundryCreateDTO.so = `${dataForm.so}`;
        data.giaoDichLaundryCreateDTO.guest = dataForm.guest;
        data.giaoDichLaundryCreateDTO.ghiChu = dataForm.ghiChu;
        data.giaoDichLaundryCreateDTO.hotelGuid = dataCommon.hotelGuid;

        data.giaoDichLaundryCreateDTO.thanhTien = dataCharge.thanhTien;
        data.giaoDichLaundryCreateDTO.tyLeGiamTru = dataCharge.tiLeGiamTru ?? 0
        data.giaoDichLaundryCreateDTO.soTienGiamTru = dataCharge.soTienGiamTru
        data.giaoDichLaundryCreateDTO.servicesCharge = dataCharge.valueSC
        data.giaoDichLaundryCreateDTO.vatcharge = dataCharge.valueVAT
        data.giaoDichLaundryCreateDTO.freeCharge = dataForm.freeCharge;
        data.giaoDichLaundryCreateDTO.tongSoTien = dataForm.freeCharge ? 0 : dataCharge.totalValue
        data.giaoDichLaundryCreateDTO.nguoiDung = this.idProfile;
        data.giaoDichLaundryCreateDTO.expressServiceValue = dataCharge.expressService ?? 0;

        data.chiTietGiaoDichLaundryCreateDTOs = mapData.chiTietGiaoDichLaundryCreateDTOs;

        data.dataFofolioCreateDTO.dienGiai = `Laundry - #${dataForm.so}`;

        data.dataFofolioCreateDTO.parentGuid = dataCommon.parentGuid;
        data.dataFofolioCreateDTO.ma = dataCommon.ma;
        data.dataFofolioCreateDTO.maTk = dataCommon.maTk;
        data.dataFofolioCreateDTO.nguoiDung2 = dataCommon.nguoiDung2;
        data.dataFofolioCreateDTO.hotelGuid = dataCommon.hotelGuid;
        data.dataFofolioCreateDTO.guest = dataForm.guest;
        data.dataFofolioCreateDTO.soPhong = dataForm.soPhong ?? "";
        data.dataFofolioCreateDTO.ngayThang = Utils.formatDateCallApi(dataForm.ngayThang);
        data.dataFofolioCreateDTO.nguoiDung = this.idProfile;
        //console.log(data);

        try {
            //console.log(data);
            await CashierAPI.postingLaundry(data).toPromise();
            openNotification(NotificationStatus.Success, " ", "Create post laundry success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async getDmucOutLet(hotelGuid: string): Promise<ITableLaundry[] | null> {
        const dataRes = await HotelConfigApi.getDmucOutLet(hotelGuid).toPromise();
        if (dataRes)
            return dataRes ?? null
        return null
    }
    static async getFoodAndOtherService(data: IPostingFoodAndOther, dataForm: ICreateDTOFolio, dataCommon: IPostingCommonFoodAndOther,
        getDataCharge: IFixCharge, guestGuid: string, basicInfo: ICommonInfo): Promise<string | null> {

        data.postingCommon.tinhChat = dataCommon.tinhChat;
        data.postingCommon.tsRoomId = dataCommon.tsRoomId;
        data.postingCommon.thanhTien = dataCommon.thanhTien;

        data.dataFofolioCreateDTO.parentGuid = basicInfo.parentGuid;
        data.dataFofolioCreateDTO.nguoiDung2 = basicInfo.nguoiDung2;
        data.dataFofolioCreateDTO.hotelGuid = basicInfo.hotelGuid;

        data.dataFofolioCreateDTO.ma = dataForm.ma.toString();
        data.dataFofolioCreateDTO.dienGiai = `${basicInfo.language} - #${dataForm.ma}(${dataForm.dienGiai})`;
        data.dataFofolioCreateDTO.maTk = getDataCharge.ma;
        data.dataFofolioCreateDTO.guest = guestGuid;
        data.dataFofolioCreateDTO.soPhong = dataForm.soPhong ?? "";
        data.dataFofolioCreateDTO.ngayThang = Utils.formatDateCallApi(dataForm.ngayThang);
        data.dataFofolioCreateDTO.suplement = dataForm.suplement;
        data.dataFofolioCreateDTO.outletCode = dataForm.outletCode;
        data.dataFofolioCreateDTO.nguoiDung = this.idProfile;

        try {
            const res = await CashierAPI.postingFoodAndOtherService(data).toPromise();
            if (res) {
                openNotification(NotificationStatus.Success, " ", "Create post service success");
                return res
            } else
                return ""
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async postingRoomCharge(data: ICreateDTOFolio, dataCommon: IPostingCommonFoodAndOther,
        getDataCharge: IFixCharge, guestGuid: string, basicInfo: ICommonInfo, dataForm: IFormRoomCharge, roomNumber: string): Promise<string | null> {

        if (dataForm.autoService) {
            const serviceCharge = (dataForm.donGia * getDataCharge.tyLePhiDichVu) / 100 + dataForm.donGia;
            dataCommon.thanhTien = serviceCharge + serviceCharge * (getDataCharge.tyLeThueVat / 100);
        }
        else {
            dataCommon.thanhTien = dataForm.donGia;
        }
        data.ma = `${roomNumber}.${getDataCharge.ma}`;
        data.parentGuid = basicInfo.parentGuid;
        data.nguoiDung2 = basicInfo.nguoiDung2;
        data.hotelGuid = basicInfo.hotelGuid;
        data.nguoiDung = this.idProfile;

        data.dienGiai = dataForm.dienGiai;
        data.maTk = getDataCharge.ma;
        data.guest = guestGuid;
        data.soPhong = `${roomNumber}`;
        data.ngayThang = Utils.formatDateCallApi(dataForm.ngayThang);
        data.nguoiDung = this.idProfile;
        const dataPostingRoomCharge: IPostingFoodAndOther = {
            postingCommon: dataCommon,
            dataFofolioCreateDTO: data
        }
        //console.log(dataPostingRoomCharge);
        try {
            await CashierAPI.postingRoomCharger(dataPostingRoomCharge).toPromise();
            openNotification(NotificationStatus.Success, " ", "Create post room charge success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async postingAdvanceRoomCharge(data: ICreateDTOFolio, dataCommon: IPostingCommonFoodAndOther,
        getDataCharge: IFixCharge, guestGuid: string, basicInfo: ICommonInfo, dataForm: IFormRoomCharge, roomNumber: string, typeDate: number): Promise<string | null> {

        data.ma = `${roomNumber}.${getDataCharge.ma}.A`;
        data.parentGuid = basicInfo.parentGuid;
        data.nguoiDung2 = basicInfo.nguoiDung2;
        data.hotelGuid = basicInfo.hotelGuid;

        data.dienGiai = `${getDataCharge.ten}-${roomNumber}`;
        data.maTk = getDataCharge.ma;
        data.guest = guestGuid;
        data.soPhong = `${roomNumber}`;

        data.ngayThang = Utils.formatDateCallApi(dataForm.ngayThang);

        data.nguoiDung = this.idProfile;

        const listFolio: ICreateDTOFolio[] = [];
        if (typeDate === 3 || typeDate === 2) {
            if (dataForm.dateFrom && dataForm.dateTo) {
                const countDay = differenceInDays(dataForm.dateTo, dataForm.dateFrom);
                for (let i = 0; i <= countDay; i++) {
                    listFolio.push({
                        ...data,
                        ngayThang: Utils.formatDateCallApi(addDays(dataForm.dateFrom, i))
                    });
                }
            }
        }
        else {
            listFolio.push(data);
        }
        const dataPostingRoomCharge: IPostingAdvanceRoomCharge = {
            postingCommon: dataCommon,
            dataFofolioCreateDTO: listFolio
        }
        try {
            await CashierAPI.postingAdvanceRoomCharger(dataPostingRoomCharge).toPromise();
            openNotification(NotificationStatus.Success, " ", "Create post advance room charge success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async postingRebate(data: ICreateDTOFolio, dataCommon: IPostingCommon, dataForm: IFormRebate,
        guestGuid: string, getDataCharge: IFixCharge, basicInfo: ICommonInfo, roomNumber: string): Promise<string | null> {

        data.ma = `${dataForm.ma}`;
        data.parentGuid = basicInfo.parentGuid;
        data.nguoiDung2 = basicInfo.nguoiDung2;
        data.hotelGuid = basicInfo.hotelGuid;
        const dienGiai = dataForm.dienGiai ? `(${dataForm.dienGiai})` : "";
        data.dienGiai = `${getDataCharge.ten} - #${dataForm.ma}${dienGiai}`;
        data.maTk = getDataCharge.ma;
        data.guest = guestGuid;
        data.soPhong = `${roomNumber}`;

        data.ngayThang = Utils.formatDateCallApi(dataForm.ngayThang);

        data.nguoiDung = this.idProfile;

        const dataPostingRebate: IPostingFoodAndOther = {
            postingCommon: dataCommon,
            dataFofolioCreateDTO: data
        }
        try {
            await CashierAPI.postingRebate(dataPostingRebate).toPromise();
            openNotification(NotificationStatus.Success, " ", "Create post rebate success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async combineFolio(data: ICombineFolio): Promise<string | null> {
        try {
            await CashierAPI.combineFolio(data).toPromise();
            openNotification(NotificationStatus.Success, " ", "Combine folio success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async getDataFolio(folioGuid: string): Promise<IGetDataFolio | null> {
        try {
            return await CashierAPI.getDataFolioByFolioGuid(folioGuid).toPromise();
        } catch (error: any) {
            return null;
        }
    }
    static async postingSplit(data: IGetDataFolio, dataForm: ISplitFolio, dienGiai: string, priceCommon: number): Promise<string | null> {
        let value = 0
        if (dataForm.thanhTien !== 0) {
            dataForm.isPieces = false
            value = dataForm.thanhTien
        } else if (dataForm.pieces !== 0) {
            dataForm.isPieces = true
            value = Math.trunc((priceCommon / dataForm.pieces) * Math.pow(10, 0)) / Math.pow(10, 0)
        }
        if (value) {
            data.suplement = dataForm.suplement
            data.suplement = dataForm.suplement
            data.dienGiai = `Split Folio: ${dienGiai} - Value: ${value}`;
            data.nguoiDung = this.idProfile;
            const dataPostingSplit: IPostingSplit = {
                isPieces: dataForm.isPieces,
                thanhTien: dataForm.thanhTien,
                pieces: dataForm.pieces,
                datafolioGetDTO: data
            }
            try {
                await CashierAPI.postingSplit(dataPostingSplit).toPromise();
                openNotification(NotificationStatus.Success, " ", "Create post split success");
                return "";
            } catch (error: any) {
                openNotification(NotificationStatus.Error, error.response, "", error.status);
                return null;
            }
        } else {
            openNotification(NotificationStatus.Error, "", "Errors when posting split");
            return null;
        }
    }
    static getSizeFolioCard(windowSize: string): string {
        switch (windowSize) {
        case "2xl":
            return "200px"
        case "xl":
            return '100px'
        case "lg":
            return "100px";
        case "md":
            return "100px";
        case "sm":
            return "100px";
        default:
            break;
        }
        return "100px"
    }
    static async postingCorrection(dataForm: IPostingCorrection, folioGuid: string, tinhChat: string): Promise<string | null> {
        const dataApi: IPostingCorrection = {
            folioId: folioGuid,
            suplement: dataForm.suplement,
            ngayThang: Utils.formatDateCallApi(new Date(dataForm.ngayThang)),
            description: `CORRECTION: ${dataForm.description}(${dataForm.suplement})`,
            tinhChat
        }
        try {
            console.log(dataApi);
            await CashierAPI.postingCorrection(dataApi).toPromise();
            openNotification(NotificationStatus.Success, " ", "Create post correction success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async postingMove(dataApi: IPostingMove): Promise<string | null> {
        try {
            await CashierAPI.postingMove(dataApi).toPromise();
            openNotification(NotificationStatus.Success, " ", "Move folio success");
            return "";
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }

    static async fetchDataForPrintOpt(transactRoomGuid: string, hotelId: string, currency1: number, currency2: number): Promise<DataPrintOption | null> {
        try {
            let guest, company = null;
            const transactRoomRes = await functionPkmApi.getTransactRoomByID(transactRoomGuid).toPromise();
            if (transactRoomRes) {
                guest = await ProfileApi.getGuestProfileByGuid(transactRoomRes.guestId).toPromise();
                const exchangeRate = await HotelConfigApi.getExchangeRate(hotelId, currency1, currency2).toPromise();
                const chargesRes = await functionPkmApi.getDMucTuyChonServiceAndVat(hotelId).toPromise()
                if (transactRoomRes.companyAgentGuid) {
                    company = await ProfileApi.getCompanyProfileByGuid(transactRoomRes.companyAgentGuid).toPromise();
                }

                return {
                    transactRoom: transactRoomRes,
                    guest,
                    company,
                    exchangeRate: exchangeRate?.giaTri ?? 0,
                    charges: chargesRes
                }
            }
            return null;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Can't get data", "Can't get data", error.status);
            return null;
        }
    }
    static async resultCheckBalanceFolio(dataTsRoom: DataFoTransactRoomDTO[]): Promise<IDataCheckBalanceDTO[]>{
        try {
            const listTsRoomId: string[] = [];
            const listGuestId: string[]= [];
            dataTsRoom.forEach(x => {
                listTsRoomId.push(x.guid ?? "")
                listGuestId.push(x.guestId ?? "");
            });
            const listResp: IDataCheckBalanceDTO[] = [];
            const respBalance = await CashierAPI.checkBalanceChecOut(listTsRoomId).toPromise();//get guest balance check out
            if(respBalance && respBalance.length > 0){
                const listProfile = await ProfileApi.getGuestProfiles({ 'guids': listGuestId }).toPromise();// call api guestProfile by list guestID
                dataTsRoom.forEach(item => {
                    const guestProfile = listProfile.find(x => x.guid === item.guestId);// find guest id 
                    const getPositionGroup = respBalance.find(x => x.tsRoomId === item .guid);// find postionGroup(1 => 6) by tsroomid
                    if (guestProfile || getPositionGroup) {
                        if(getPositionGroup?.positionGroups){
                            listResp.push({
                                tsRoomId: item.guid ?? "",
                                fullName: `${guestProfile?.firstName ?? ""} ${guestProfile?.guestName ?? ""}`,
                                positionGroups: getPositionGroup?.positionGroups ?? []
                            }); 
                        }
                    }
                })
            }
            return listResp;
        } catch (error) {
            return [];
        }
    }
    static async checkBalanceCheckOut(tsRoomId: string, rsvnId: string | null, guestId: string, isCheckRoom: boolean): Promise<IDataCheckBalanceDTO[]>{
        try {
            if(rsvnId !== null){// check out group
                const resp = await PkmApi.getReservationById(rsvnId).toPromise();// get all guest by rsvnId with status = checkin
                if(resp){
                    return await this.resultCheckBalanceFolio(resp.dataFotransactRoomDTO.filter(x => x.status === ReservationStatus.CheckIn));
                }
                return [];
            }
            else{
                if(isCheckRoom){// check out room
                    const res = await PkmApi.getShareGuestByTRSRoom(tsRoomId).toPromise();// get all shared room in room
                    return await this.resultCheckBalanceFolio(res as DataFoTransactRoomDTO[]);
                }else{// check out guest
                    const dataTsRooms: DataFoTransactRoomDTO = { // if check out guest, get tsRoomId and guestId
                        ...rSVN_DEFAULT_DATA.dataFotransactRoomDTO,
                        guid: tsRoomId,
                        guestId: guestId,
                    }
                    return await this.resultCheckBalanceFolio([dataTsRooms]);
                }
            }
        } catch (error) {
            return [];
        }
        
    }
    static async checkBalanceGuestCheckOut(tsRoomID: string, isCheckRoom: boolean): Promise<IDataCheckBalanceDTO[]>{
        try {
            const guestResp = await CashierService.getGuestProfileFolio(tsRoomID);
            const listTsRoomId: string[] = [];
            if(guestResp){
                if(isCheckRoom){
                    guestResp.forEach(x => {
                        listTsRoomId.push(x.tsRoomId);
                    });
                }
                else{
                    listTsRoomId.push(tsRoomID);
                }
                const resp = await CashierAPI.checkBalanceChecOut(listTsRoomId).toPromise();
                if(resp){
                    if(resp.length > 0){
                        let message = "";
                        resp.forEach(item => {
                            const guest = guestResp.find(x => x.tsRoomId === item.tsRoomId);
                            message += `${guest?.fullName ?? ""}, in folio ${item.positionGroups.join(",")}`;
                        })
                        openNotification(NotificationStatus.Error, "Check out failed !", `Guest ${message} the balance must be zero !`);
                        return [];
                    }
                }
            }
            
            return [];
        } catch (error) {
            return [];
        }
    }
    static async postPaymentService(dataCommon: IPostCommon, dataCreateFolio: ICreateDTOFolio): Promise<boolean>{
        try {
            const data: IPostingPaymentDTO = {
                postingCommon: dataCommon,
                dataFofolioCreateDTO: dataCreateFolio
            } 
            await CashierAPI.postPaymentFolio(data).toPromise();
            openNotification(NotificationStatus.Success, " ", "Create post payment success");
            return true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
        }
        return false;
    }
}