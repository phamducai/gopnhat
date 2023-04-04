/*eslint-disable*/
import { InfoPage } from './../../common/cashier/model-cashier';
import CashierAPI from "api/cashier/cashier.api";
import PkmApi from "api/pkm/pkm.api";
import ProfileApi from "api/profile/prf.api";
import { DataAmountRoomChat, FilterFolio, IFEGroupFolio, IGetDataFolio, IGetGroupFolio, IResDataFolio } from "common/cashier/model-cashier";
import { AmountRoomChat, FilterGroupItem } from "common/cashier/model-folio";
import { listGroupFolio } from "common/const/groupFolioDefaultValue";
import { dataGuest } from "common/model-profile";
import { DefaultAmountRoomChat } from 'common/cashier/define-cashier';

export default class CashierService {
    static async getFolioGroup(inHouseGuid: string): Promise<IFEGroupFolio[] | null> {
        try {
            const res = await CashierAPI.getGroupFolioByInHouseId(inHouseGuid).toPromise() as IGetGroupFolio[];
            listGroupFolio.forEach((item: IFEGroupFolio, index: number) => {
                item.guidGroupFolio = res[index].dataFogroupFolioGetDTO.guid;
                item.debit = res[index].debit;
                item.credit = res[index].credit;
                item.balance = res[index].balance
            });
            return listGroupFolio;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async getDataFolioByGroupId(data: FilterFolio): Promise<IResDataFolio | null> {
        try {
            const res = await CashierAPI.getAllDataFolio(data).toPromise();
            if (res) {
                const resPage = JSON.parse(res.xhr.getResponseHeader("x-pagination")) as InfoPage;
                return { resPage: resPage, dataFolio: res.response as IGetDataFolio[] }
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async getGuestProfileFolio(Tsroom: string): Promise<dataGuest[] | undefined> {
        try {
            const res = await PkmApi.getShareGuestByTRSRoom(Tsroom).toPromise()
            const listGuestID: string[] = [];
            const dataGuest: dataGuest[] = []
            if (res) {
                res.forEach(item => listGuestID.push(item.guestId))
                const listProfile = await ProfileApi.getGuestProfiles({ 'guids': listGuestID }).toPromise();// call api guestProfile by list guestID
                res.forEach((item) => {
                    const guestProfile = listProfile.find(x => x.guid === item.guestId)
                    if (guestProfile) {
                        dataGuest.push(
                            {
                                tsRoomId: item.guid,
                                fullName: `${guestProfile?.firstName ?? ""} ${guestProfile?.guestName ?? ""}`,
                                guestGuid: guestProfile.guid
                            }
                        )
                    }
                })
                return dataGuest
            }
        } catch (error) {
            console.log(error);
            return []
        }
    }
    static getPageSizeMove(windowSize: string): number {
        switch (windowSize) {
            case "2xl":
                return 10;
            case "xl":
                return 6;
            case "lg":
                return 6;
            case "md":
                return 6;
            case "sm":
                return 6;
            default:
                break;
        }
        return 6
    }
    static async getAmountAndRoomChatData(data: AmountRoomChat): Promise<DataAmountRoomChat | undefined> {
        try {
            const res = await CashierAPI.getRoomChatData(data).toPromise()
            if (res) {
                return res
            }
        } catch (error) {
            console.log(error);
            return DefaultAmountRoomChat
        }
    }
    static async FilterGroupFolio(dataForm: any, tsRoomGuid: string): Promise<string | undefined> {
        try {
            const listItem: FilterGroupItem[] = [];
            if (dataForm.services.length > 0) {
                dataForm.services.forEach((service: any) => {
                    listItem.push({
                        maTK: service,
                        groupNumber: parseInt(dataForm[service])
                    })
                })
            }
            const res = await CashierAPI.filterGroupFolio({ tsRoomId: tsRoomGuid, listFilter: listItem }).toPromise()
            if (res) {
                return res
            }
        } catch (error) {
            console.log(error);
        }
    }
}