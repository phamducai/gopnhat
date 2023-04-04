/* eslint-disable @typescript-eslint/no-explicit-any */
import HotelConfigApi from 'api/hcfg/hcfg.api';
import functionPkmApi from 'api/pkm/function.api';
import CashierAPI from 'api/cashier/cashier.api';
import InventoryApi  from 'api/inv/inv.api';
import { InForRunNightReqDTO, IRoomChargeRunNight, IRoomRevenue, IRunNightCommon, ITableRunNight } from 'common/end-of-day/model-runNight';
import Utils from 'common/utils';
import { IQueryParam } from 'common/define-booking';
import { IQueryParamRunNight, ISearchResult } from 'common/model-booking';
import GLobalPkm from 'common/global';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import ProfileApi from 'api/profile/prf.api';
import { NumberOfRooms } from 'common/model-inventory';
import setStatusRSVN from 'services/booking/statusRsvn/status.service';
class RunNightService {

    static async getTotalRoomByHotelId(hotelGuid: string): Promise<number> { 
        try {
            return await InventoryApi.getTotalRoomByHotelId(hotelGuid).toPromise();
        } catch (error) {
            return 0;
        }
    }
    static async getRoomChargeRunNight(hotelGuid: string): Promise<IRoomChargeRunNight | null> { 
        try {
            return await CashierAPI.getTotalRoomChargeByNight(hotelGuid).toPromise();
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.response, "", error.status);
            return null;
        }
    }
    static async getRoomRevenue(hotelGuid: string, bussinessDate: Date, listTsRoomId: string[]): Promise<IRoomRevenue | null> { 
        try {
            return await functionPkmApi.getRoomRevenue(hotelGuid, Utils.formatDateCallApi(bussinessDate), listTsRoomId).toPromise();
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    static async getInfoNightByQueryParam(data: IQueryParamRunNight, numberOfRoom: NumberOfRooms[]): Promise<any>{
        try {
            const queryParamsReq: IQueryParamRunNight = {
                pageNumber: data.pageNumber ?? 1,
                pageSize: data.pageSize ?? 20,
                status: data.status ?? 1,
                isOnlyMainGuest: data.isOnlyMainGuest ?? false,
                occupiedTonight: data.occupiedTonight ?? false,
                houseUse: data.houseUse ?? false,
                complimentary: data.complimentary ?? false,
                expectedArrivals: data.expectedArrivals ?? false,
                expectedDepartures: data.expectedDepartures ?? false,
                roomRevenue: data.roomRevenue ?? false,
                RoomCharge: data.RoomCharge ?? false,
                businnesDate: data.businnesDate,
                hotelGuid: data.hotelGuid,
                listInHouseId: data.listInHouseId ?? [],
            }
            const res = await functionPkmApi.getInforRunNightByParam(queryParamsReq).toPromise();
            const tsRoomResp = res.response;
            const listGuestId: string[] = [];
            const newData: ISearchResult[] = []
            if(tsRoomResp){
                const resPage = res.xhr.getResponseHeader("x-pagination");
                tsRoomResp.forEach((element: IQueryParam) => {
                    listGuestId.push(element.guestId)
                });
                const newListRoomType = JSON.stringify(listGuestId).slice(1, -1);
                const dataGuestProfile = await ProfileApi.getGuestProfiles({ 'guids': newListRoomType }).toPromise();
                tsRoomResp.forEach((element: IQueryParam) => {
                    const findData = dataGuestProfile.find((item: any) => element?.guestId === item?.guid);
                    const nameRoomType = numberOfRoom.find((items: NumberOfRooms) => items.id === element.roomType);
                    if(findData && nameRoomType){
                        newData.push({
                            guestId: element?.guestId,
                            parentMeGuid: element?.parentMeGuid === null ? 0 : element?.parentMeGuid,
                            fullName: { name: `${findData?.firstName ?? ""} ${findData.guestName ?? ""}` , id : ""},
                            room: { name: element?.transactRoomsGroup?.roomName, id: element?.transactRoomsGroup?.mappingRoomId },
                            rate: { name: (element?.rate)?.toString(), id: element?.rate },
                            roomType: { name: nameRoomType.name, id: element?.roomType },
                            code: { name: element?.dataForeservation.reservCode ?? "", id: "" },
                            arrival: { name: Utils.formatDateString(element?.arrivalDate), id: element?.arrivalDate },
                            departure: { name: Utils.formatDateString(element?.departureDate), id: element?.departureDate },
                            groupCode: { name: element?.dataForeservation?.groupCode ?? "", id: element?.dataForeservation?.groupCode ?? "" },
                            rsvnNo: { name: element?.dataForeservation.id, id: element?.dataForeservation.id },
                            status: { name: setStatusRSVN.getStatus(element?.status), id: element?.status },
                            comments: { name: element?.comments, id: element?.comments },
                            guid: element?.guid,
                            parentGuid: element?.parentGuid
                        })
                    }
                });
                return {
                    dataSearchResults: newData,
                    queryParam: tsRoomResp,
                    inforPage: JSON.parse(resPage),
                    queryParamsReq: queryParamsReq
                };
            }
            return {
                dataSearchResults: [],
                queryParam: [],
                inforPage: null,
                queryParamsReq: queryParamsReq
            };
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "No data", "", error.status);
            return {
                dataSearchResults: [],
                queryParam: [],
                inforPage: null,
                queryParamsReq: null
            };
        }
    }
    static async mapDataTableSearch(hotelGuid: string, dataSearchResults: ISearchResult[], queryParam: IQueryParam[]): Promise<ITableRunNight[]> { 
        try {
            const data: InForRunNightReqDTO[] = [];
            queryParam.forEach((item) => {
                data.push({
                    tsRoomGuid: item.guid,
                    market: [item.resMarket ?? GLobalPkm.defaultBytes32],
                    sources: [item.resSource ?? GLobalPkm.defaultBytes32],
                    chanels: [item.resChanel ?? GLobalPkm.defaultBytes32],
                    specials: item.specialsCodes !== null ? JSON.parse(item.specialsCodes).specialsCodes : [GLobalPkm.defaultBytes32],
                    packages: [item.packageCodes ?? GLobalPkm.defaultBytes32]
                })
            })
            const resp = await HotelConfigApi.getInfoRunNight(hotelGuid, data).toPromise();
            const dataTable: ITableRunNight[] =[];
            if(resp){
                dataSearchResults.forEach(item => {
                    const tmp = resp.find(x => x.tsRoomGuid === item.guid);
                    dataTable.push({
                        guestId: item.guestId ?? "",
                        parentMeGuid: item.parentMeGuid ?? "",
                        fullName: item.fullName.name ?? "",
                        room: item.room.name ?? "",
                        rate: Utils.formatNumber(parseInt(item.rate.name ?? "0")),
                        roomType: item.roomType.name ?? "",
                        code: item.code.name ?? "",
                        arrival: item.arrival.name ?? "",
                        departure: item.departure.name ?? "",
                        groupCode: item.groupCode.name ?? "",
                        rsvnNo: item.rsvnNo.name ?? 0,
                        status: item.status.name ?? "",
                        comments: item.comments.name ?? "",
                        guid: item.guid,
                        parentGuid: item.parentGuid ?? "",
                        market: tmp?.tenMarket ?? "",
                        sources: tmp?.tenSource ?? "",
                        chanels: tmp?.tenChanel ?? "",
                        specials: tmp?.tenSpecial ?? "",
                        packages: tmp?.tenPackage ?? ""
                    })
                })
            }
            return dataTable;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    static async ProceedRunNight(data: IRunNightCommon): Promise<boolean>{
        try {
            await CashierAPI.postRunNightByHotel(data).toPromise();
            openNotification(NotificationStatus.Success,"Run night success","");
            return true;
        } catch (error: any) {
            if(Utils.handleErrosMessaeg(error)){
                openNotification(NotificationStatus.Error,"Run night failed","", error.status);
            }
            return false;
        }
    }
}
export default RunNightService;