import PkmApi from "api/pkm/pkm.api";
import { RevenueBySourceMarket } from "common/dashboard/define-api-dashboard";
import { IReqStatistic } from "common/dashboard/PropsDashboard";
import { ListTsRoomPlan } from "common/model-booking";
import { IResArrivalsDepartures, OccupiedToNight, RevenueInDaysData, SourceData } from "common/model-statistic";
import { HotelConfigInfo, ReservationMarkets, ReservationSources } from "common/shared/hotelconfig.model";
import Utils from "common/utils";
import StatisticService from "services/frontdesk/statistic.service";


export default class DashBoardService {
    static async loadFrontDesk(businessDate: string, hotelId: string): Promise<IResArrivalsDepartures> {
        const date = Utils.convertMiddleDate(businessDate)
        return await StatisticService.getRoomAndGuestByDate(hotelId, date);
    }

    static async UserRoomDetail(data: IReqStatistic): Promise<OccupiedToNight> {
        const response: ListTsRoomPlan[] =  await PkmApi.getUserRoomDetail(data).toPromise();
        let tmp = 0
        response.forEach((item) => tmp += item.transactRoom.length)
        return {room : response.length, guest: tmp}
    }
    static async getRevenueInDay(dataRevenue: IReqStatistic): Promise<RevenueInDaysData[]> {
        return PkmApi.getRevenueInDay(dataRevenue).toPromise()
    }
    static async fetchRevenueBySource(dataSourceMarket: RevenueBySourceMarket): Promise<SourceData[]> {
        return PkmApi.getRevenuebySourceMarket(dataSourceMarket).toPromise()
    }

    static handleSourceData(sourceData: SourceData[], hcfgInfo: HotelConfigInfo): RevenueInDaysData[] {
        let item: ReservationSources | undefined  = {id: 0,guid: "",parent: 0,parentGuid: "",ma: "",
            ten: "", ghiChu: "", seq: 0, hotelGuid: "", statusRec: 0}
        let dataSouce: RevenueInDaysData[] = []
        const hcfg = hcfgInfo.sources

        sourceData.forEach((sourceItem: SourceData) => {
            item = hcfg.find((item) => sourceItem.sourceMarketGuid === item.guid)
            let valueSource = 0
            if(sourceItem.sourceMarketGuid === "00000000-0000-0000-0000-000000000000"){
                sourceItem.value.forEach((element) => valueSource += element.Value);
                dataSouce = [...dataSouce, {Key: "Other", Value: valueSource}]
            }
            else if(item){
                sourceItem.value.forEach((element) => valueSource += element.Value);
                dataSouce = [...dataSouce, {Key: item?.ten, Value: valueSource}]
            }
        })
        return dataSouce
    }

    static handleMarketData(marketData: SourceData[], hcfgInfo: HotelConfigInfo): RevenueInDaysData[] {
        let item: ReservationMarkets | undefined  = {id: 0,guid: "",parent: 0,parentGuid: "",ma: "",
            ten: "", ghiChu: "", seq: 0, hotelGuid: "", statusRec: 0}
        let dataSouce: RevenueInDaysData[] = []
        const hcfg = hcfgInfo.markets
        
        marketData.forEach((sourceItem: SourceData) => {
            item = hcfg.find((item) => sourceItem.sourceMarketGuid === item.guid)
            let valueSource = 0
            if(item){
                sourceItem.value.forEach((element) => valueSource += element.Value);
                dataSouce = [...dataSouce, {Key: item?.ten, Value: valueSource}]
            }else if(sourceItem.sourceMarketGuid === "00000000-0000-0000-0000-000000000000"){
                sourceItem.value.forEach((element) => valueSource += element.Value);
                dataSouce = [...dataSouce, {Key: "Other", Value: valueSource}]
            }
        })
        return dataSouce
    }

    static handleLabelChart(dataRevenue: RevenueInDaysData[]): string[] {
        const dataLable: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        dataRevenue.forEach((item, index) => {
            const tmp = dataLable[index]
            const getDay = Utils.formatDateToStringRevenue(item.Key)
            dataLable[index] = tmp + " " + getDay
        })
        return dataLable
    }

    static getHeightSizeTable(windowSize: string): string {
        switch (windowSize) {
        case "2xl":
            return 'calc(100vh - 565px)';
        case "xl":
            return 'calc(100vh - 330px)';
        case "lg":
            return 'calc(100vh - 300px)';
        case "md":
            return 'calc(100vh - 300px)';
        case "sm":
            return 'calc(100vh)';
        default:
            break;
        }
        return 'calc(100vh - 400px)'
    }
}