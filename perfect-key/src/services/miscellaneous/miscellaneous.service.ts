/* eslint-disable @typescript-eslint/no-explicit-any */
import HlsApi from 'api/hls/hls.api';
import functionPkmApi from 'api/pkm/function.api';
import { ChannelAllotment, HlsHotel, RatePlanRes, RoomTypeMapping, SetInventoryReq, SetInventoryRes } from 'common/define-hls';
import { TypeStatusMessage } from 'common/enum/cashier.enum';
import { NotificationStatus } from "common/enum/shared.enum";
import { IDataSearchMessage, IMessage, IMessageByOption, IMessageTable, ITracerMessage, ITracerMessageByOption, ITracerMessageTable, SearchQueryMessage, SearchQueryTracerMessage } from 'common/model-rsvn';
import Utils from 'common/utils';
import openNotification from "components/CNotification";
import { format } from 'date-fns';
import RoomPlanService from 'services/frontdesk/roomplan.service';

export default class MiscellaneousService {
    static async PostTracerMessageByType(data: ITracerMessageByOption): Promise<any> {
        try {
            await functionPkmApi.PostTracerMessageByOption(data).toPromise();
            openNotification(NotificationStatus.Success, "New Tracer Success", "");
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Error, "New Tracer failed", "", error.status);
        }
    }
    static async PostTracerMessage(data: ITracerMessage): Promise<any> {
        try {
            await functionPkmApi.PostTracerMessage(data).toPromise();
            openNotification(NotificationStatus.Success, "New Tracer Success", "");
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Error, "New Tracer failed", "", error.status);
        }
    }
    static async getDataSearchTracerMessage(data: SearchQueryTracerMessage): Promise<ITracerMessage[] | []> {
        try {
            const res = await functionPkmApi.SearchTracerMessage(data).toPromise();
            if (res) {
                return res
            }
            return []
        } catch (error) {
            console.log(error);
            return []
        }
    }
    static async PostMessageByType(data: IMessageByOption): Promise<any> {
        try {
            await functionPkmApi.PostMessageByOption(data).toPromise();
            openNotification(NotificationStatus.Success, "New Message Success", "");
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Error, "New Message failed", "", error.status);
        }
    }
    static async getDataSearchMessage(data: SearchQueryMessage): Promise<IDataSearchMessage[] | []> {
        try {
            const res = await functionPkmApi.SearchMessage(data).toPromise();
            if (res) {
                return res
            }
            return []
        } catch (error) {
            console.log(error);
            return []
        }
    }
    static async UpdateSeenMessage(dataMessage: IMessage): Promise<string | null> {
        try {
            const data = {
                parrent: dataMessage.parrent,
                parrentGuid: dataMessage.parrentGuid,
                ngayThang: dataMessage.ngayThang,
                inHouse: dataMessage.inHouse,
                inHouseGuid: dataMessage.inHouseGuid,
                messageFrom: dataMessage.messageFrom ?? "",
                messageSubject: dataMessage.messageSubject ?? "",
                message: dataMessage.message ?? "",
                comment: dataMessage.comment,
                flagType: dataMessage.flagType,
                nguoiGui: dataMessage.nguoiGui ?? "",
                ngayNhan: dataMessage.ngayNhan ?? new Date(),
                nguoiNhan: dataMessage.nguoiNhan ?? "",
                hotelGuid: dataMessage.hotelGuid,
                status: TypeStatusMessage.Read
            }
            const guid: string = dataMessage.guid ? dataMessage.guid : ""
            const res = await functionPkmApi.UpdateMessage(data, guid).toPromise();
            openNotification(NotificationStatus.Success, res, "");
            return res
        } catch (error) {
            console.log(error);
            return "error"
        }
    }
    static async ConvertDataTableMessage(dataTableMessage: IDataSearchMessage[]): Promise<IMessageTable[] | []> {
        const getStatus = (status: string | number, date: string) => {
            switch (status) {
            case 0:
                return status = "UnRead"
            case 1:
                return status = `Received at ${Utils.convertToVNTimeZoneMbyMoment(date)}`
            case 2:
                return status = `Rely`
            default:
                break;
            }
            return "";
        }
        try {
            const convertData: IMessageTable[] = []
            const list: string[] = []
            dataTableMessage.forEach((item) =>
                list.push(item.guestId)
            )
            const listProfile = await RoomPlanService.getDataGuestProfile(list);
            if (listProfile) {
                dataTableMessage.forEach((element: IDataSearchMessage) => {
                    const profile = listProfile.find((item) => item.guid === element.guestId)
                    const dateVN = Utils.convertToVNTimeZoneMbyMoment(element.dataFomessage.ngayThang)
                    const data: IMessageTable = {
                        ngayThang: element.dataFomessage.ngayThang ? Utils.formatDateVN(new Date(element.dataFomessage.ngayThang)) : "",
                        messageSubject: element.dataFomessage.messageSubject,
                        status: getStatus(element.dataFomessage.status, element.dataFomessage.ngayNhan),
                        time: format(new Date(dateVN), "h:mm a"),
                        roomName: element.roomName,
                        message: element.dataFomessage.message,
                        comment: element.dataFomessage.comment,
                        flagType: element.dataFomessage.flagType,
                        id: element.dataFomessage.id ? element.dataFomessage.id : "",
                        check: element.dataFomessage.status,
                        inHouseGuid: element.dataFomessage.inHouseGuid,
                        hotelId: element.dataFomessage.hotelGuid,
                        nguoiNhan: element.dataFomessage.nguoiNhan,
                        nguoiGui: element.dataFomessage.nguoiGui,
                        guid: element.dataFomessage.guid ? element.dataFomessage.guid : "",
                        guestName: profile.firstName + " " + profile.guestName
                    }
                    convertData.push(data)
                })
                return convertData
            } else
                return []
        } catch (error) {
            console.log(error);
            return []
        }
    }
    static async ConvertDataTableTracer(dataTableTracer: ITracerMessage[]): Promise<ITracerMessageTable[] | []> {
        const getStatus = (status: string | number, userName: string) => {
            switch (status) {
            case 0:
                return status = "UnResolved"
            case 1:
                return status = `Resolved by ${userName}`
            default:
                break;
            }
            return "";
        }
        try {
            const convertData: ITracerMessageTable[] = []
            dataTableTracer.forEach((element: ITracerMessage) => {
                const data: ITracerMessageTable = {
                    ngayThang: element.ngayThang ? Utils.formatDateVN(new Date(element.ngayThang)) : "",
                    department: element.department,
                    dateFrom: element.dateFrom ? Utils.formatDateVN(new Date(element.dateFrom)) : "",
                    dateTo: element.dateTo ? Utils.formatDateVN(new Date(element.dateTo)) : "",
                    messageSubject: element.messageSubject,
                    status: getStatus(element?.status, element.userName),
                    message: element.message,
                    comment: element.comment,
                    flagType: element.flagType,
                    id: element.id,
                    check: element.status,
                    inHouseGuid: element.inHouseGuid,
                    guest: element.guest,
                    userName: element.userName
                }
                convertData.push(data)
            })
            return convertData
        } catch (error) {
            console.log(error);
            return []
        }
    }
    static async getOTAConfig(hotelGuid: string): Promise<HlsHotel | null> {
        const configRes = await HlsApi.getHotel().toPromise();
        if (configRes) {
            const hlsHotel = configRes.find(x => x.pmS_ID === hotelGuid);
            if (hlsHotel)
                return hlsHotel;
            else {
                throw Error("This hotel is not mapped with OTA!")
            }
        }
        return null;
    }
    static async getRatePlan(hotelGuid: string): Promise<RatePlanRes | null> {
        const ratePlanRes = await HlsApi.getRatePlan(hotelGuid).toPromise();
        if (ratePlanRes) {
            return ratePlanRes
        }
        return null

    }
    static async getAlreadyMapping(): Promise<RoomTypeMapping[] | null> {
        const mappingRes = await HlsApi.getAlreadyMapping().toPromise();
        if (mappingRes) {
            return mappingRes
        }
        return null

    }
    static async mappingRoomType(data: RoomTypeMapping): Promise<[] | null> {
        const mappingRes = await HlsApi.mappingRoomType(data).toPromise();
        if (mappingRes) {
            return mappingRes
        }
        return null
    }
    static async removeMappingRoomType(guid: string): Promise<string| null> {
        const mappingRes = await HlsApi.removeMapping(guid).toPromise();
        if (mappingRes) {
            return mappingRes
        }
        return null
    }
    static async getLastAllotmentQuantity(hotelGuid: string, roomTypeHls: string): Promise<ChannelAllotment | null> {
        const allotmentRes = await HlsApi.getLastAllotmentQuantity(hotelGuid, roomTypeHls).toPromise();
        if (allotmentRes) {
            return allotmentRes
        }
        return null

    }
    static async setInventory(data: SetInventoryReq): Promise<SetInventoryRes | null> {
        const setInvenRes = await HlsApi.saveInventory(data).toPromise();
        if (setInvenRes) {
            return setInvenRes
        }
        return null

    }
    static async createDataAllotment(data: ChannelAllotment, dateFrom: string, dateTo: string): Promise<string | null> {
        const createRes = await HlsApi.createDataAllotment(data, dateFrom, dateTo).toPromise();
        if (createRes) {
            return createRes
        }
        return null

    }
    static async getDataAllotment(hotelGuid: string, dateFrom: string, dateTo: string): Promise<ChannelAllotment[] | null> {
        const allomentRes = await HlsApi.getDataAllotment(hotelGuid, dateFrom, dateTo).toPromise();
        if (allomentRes) {
            return allomentRes
        }
        return null

    }
}