/* eslint-disable @typescript-eslint/no-explicit-any */
import InventoryApi from "api/inv/inv.api";
import { ColorStatus, InfoRoomPlan, TypeStatusTsRoom } from "common/enum/roomplan.enum";
import { FloorInv, ListCardRoomPlan, NumberOfRooms, PaginationRoom, PaginationUnAssign, ResHeaderINV, ResListRoom, ResPagination, ResRoomPlan, RoomInfo, RoomInfoUpdateStatus, RoomsInARoomType } from "common/model-inventory";
import Utils from 'common/utils';
import functionPkmApi from 'api/pkm/function.api';
import PkmApi from "api/pkm/pkm.api";
import { IParamCheckIn, ListTsRoomPlan, ResParamCheckIn, TransactRoom } from "common/model-booking";
import { ResGuestProfiles } from "common/define-api-booking";
import { CompanyProfile } from "common/model-profile";
import ProfileApi from 'api/profile/prf.api';
import { DMColorType } from "common/shared/dmuccolor.model";
import { AssignRoom } from "common/model-rsvn";
//import RoomPlanHeper from "./roomPlanHeper/roomplanheper";
import { NotificationStatus } from 'common/enum/shared.enum';
import openNotification from "components/CNotification";
import { PaginationHeaders } from "common/front-desk/define-api-roomPlan";
import { addDays, format } from "date-fns";
import { ReservationStatus } from "common/enum/booking.enum";
class RoomPlanService {
    static async mapDataFloor(hotelGuid: string): Promise<FloorInv[] | []> {
        const newDataFloor: FloorInv[] = [];
        try {
            const res = await InventoryApi.getAllFLoorByGuid(hotelGuid).toPromise();
            if (res) {
                for (let i = 0; i < res.length; i++) {
                    newDataFloor.push({
                        key: res[i],
                        name: `Floor ${res[i]}`
                    });
                }
            }
        } catch (error) {
            console.log(error)
        }
        return newDataFloor;
    }
    static setInspected(inspected: number): boolean {
        if (inspected === 1) {
            return true;
        }
        return false;
    }
    static setColorIcon(cleanDirty: number, inspected: number): string {
        if (cleanDirty === TypeStatusTsRoom.Dirty && inspected !== 1) {
            return InfoRoomPlan.IconRed
        }
        if (inspected === 1) {
            return InfoRoomPlan.IconBlue;
        }
        return InfoRoomPlan.IconGreen;
    }
    static setColorInforRoom(inspected: number, tinhTrang: number, cleanDirty: number): string {
        if ((inspected === 1 || cleanDirty === 1) && tinhTrang !== TypeStatusTsRoom.OutOfOther) {
            return ColorStatus.VC_INSPECTED;
        }
        if (tinhTrang === TypeStatusTsRoom.OutOfOther) {
            return ColorStatus.OOO;
        }
        if (tinhTrang === TypeStatusTsRoom.OutOfService) return ColorStatus.OOS
        return ColorStatus.VD;
    }
    static setNameIcon(status: number): string {
        if (status === 0) {
            return InfoRoomPlan.UserCheckLight
        }
        return InfoRoomPlan.UserCheck;
    }
    static async getAllRoomByHotelGuid(data: PaginationRoom): Promise<RoomInfo[] | null> {
        
        return await InventoryApi.getAllRoomInHotel(data, false).toPromise();
    }
    static async mapDataRoomType(data: PaginationRoom, hotelGuid: string, hotelName: string, numberOfRooms: NumberOfRooms[]): Promise<ResListRoom | null> {
        const dataMapRoomType: ListCardRoomPlan[] = [];
        const newListRoomGuid: string[] = [];
        const pageHeader: ResPagination = {
            TotalCount: 1,
            TotalPages: 1
        }
        let resHeaderInv: ResHeaderINV = {
            TotalCount: 0,
            TotalPages: 0,
            inspected: 0,
            orderService: 0,
            outOfOrder: 0,
            unInspected: 0,
            vacantClean: 0,
            vacantDirty: 0
        }
        try {
            const res: any = await this.getAllRoomByHotelGuid(data);
            if (res) {
                const resPage = JSON.parse(res.xhr.getResponseHeader("x-pagination")) as ResHeaderINV;
                pageHeader.TotalCount = resPage.TotalCount;
                pageHeader.TotalPages = resPage.TotalPages;
                const resDataRoom = res.response as RoomInfo[];
                resHeaderInv = resPage;
                resDataRoom.forEach((item) => {
                    newListRoomGuid.push(item.guid);
                    const getRoomType = numberOfRooms.find(x => x.id === item.loai);
                    dataMapRoomType.push(
                        {
                            roomGuid: item.guid,
                            guestGuid: "",
                            guid: "",
                            parentGuid: "",
                            roomNumber: item.so ?? "",
                            guestNumber: "",
                            roomName: getRoomType?.name ?? "",
                            fullNameGuestMain: "huythang",
                            amountGuest: 1,
                            groupCode: "123",
                            rate: 100000,
                            dateToAndForm: "26 - 28/08",
                            iconName: InfoRoomPlan.Home,
                            colorIcon: this.setColorIcon(item.cleanDirty ?? TypeStatusTsRoom.Dirty, item.inspected ?? 0),
                            colorInfor: this.setColorInforRoom(item.inspected ?? 0, item.tinhTrang ?? 0, item.cleanDirty ?? 0),
                            nameCompanyOrAgent: "",
                            hotelGuid: hotelGuid,
                            statusRoom: this.setInspected(item.inspected ?? 0),
                            statusInfor: false,
                            cleanDirty: item.cleanDirty ?? TypeStatusTsRoom.Dirty,
                            floor: item.floor ?? 1,
                            roomType: item.loai ?? "",
                            status: 0,
                            arrivalDate: "",
                            departureDate: "",
                            tinhTrang: item?.tinhTrang ?? 0,
                            isChecked: false
                        },
                    )
                })// push infor room to list room plan
            }
        } catch (error) {
            console.log(error)
        }
        return { listCardRoomPlan: dataMapRoomType, resPagination: pageHeader, listRoomGuid: newListRoomGuid, resHeaderInv };
    }
    static async getDataListRoom(data: PaginationRoom, numberOfRooms: NumberOfRooms[], hotelGuid: string, hotelName: string, selectDate: Date, listDmColor: DMColorType[]): Promise<ResRoomPlan | null> {
        const dataMapTypeRoom = await this.mapDataRoomType(data, hotelGuid, hotelName, numberOfRooms);//call API get data room and map name icon, infor,status
        const dataTransactRoom = await this.getDataTrsRoomByListRoom(dataMapTypeRoom?.listRoomGuid ?? [], hotelGuid, selectDate);//Call API get transaction room by list roomGuid, hotel and selectDate
        const listGuestID: string[] = [];
        const listGuidCompany: string[] = [];
        if (dataTransactRoom.length > 0) {
            dataTransactRoom.forEach(item => {
                for (let i = 0; i < item.transactRoom.length; i++) {
                    if (item.transactRoom[i].parentMeGuid === null && item.transactRoom[i].companyAgentGuid) {
                        listGuidCompany.push(item.transactRoom[i].companyAgentGuid ?? "");
                    }
                    listGuestID.push(item.transactRoom[i].guestId);
                }
            })
        }// get array guestId by transaction room
        const guestProfile = await this.getDataGuestProfile(listGuestID);// call api guestProfile by list guestID
        const companyProfile = await this.getListCompany(hotelGuid, listGuidCompany);// call api company
        const dataTmp = dataMapTypeRoom?.listCardRoomPlan ?? [];// assign array listCardRoomPlan
        if (dataTransactRoom.length > 0) {
            dataTmp.forEach((item, index) => {
                const trsRoom: ListTsRoomPlan | undefined = dataTransactRoom.find((x: any) => x.mappingRoomId === item.roomGuid);// get trSroom bay roomGuid
                const trsRoomMain = trsRoom?.transactRoom.find((x: any) => x.parentMeGuid === null);// get guest main in transaction room
                const selectGuest = guestProfile?.find((x: any) => x.guid === trsRoomMain?.guestId);// get guest profile by guestId
                const getCompany = companyProfile?.find(x => x.guid === trsRoomMain?.companyAgentGuid);
                const getColor = listDmColor?.find(x => parseInt(x.code) === trsRoom?.code);
                let date = "";
                if (trsRoom) {
                    const arrDate = format(new Date(trsRoom?.arrivalDate ?? ""), "dd/MM");
                    const depDate = format(new Date(trsRoom?.departureDate ?? ""), "dd/MM");
                    date = `${arrDate} - ${depDate}`;
                    dataTmp[index] = {
                        ...item,
                        guid: trsRoomMain?.guid ?? "",
                        fullNameGuestMain: `${selectGuest?.firstName ?? ""} ${selectGuest?.guestName ?? ""}`,
                        nameCompanyOrAgent: getCompany?.ten ?? "",
                        guestNumber: trsRoom.transactRoom.filter(x => x.status === ReservationStatus.CheckIn || x.status === ReservationStatus.Reservation).length,
                        guestGuid: selectGuest.guid,
                        rate: Utils.formatNumber(trsRoomMain?.rate ?? 0),
                        dateToAndForm: date,
                        iconName: InfoRoomPlan.UserCheck,
                        colorInfor: getColor?.colorName ?? ColorStatus.VD,
                        colorIcon: this.setColorIcon(item.cleanDirty, 0),
                        statusInfor: true,
                        statusRoom: false,
                        groupCode: trsRoom.reservation.groupCode ?? "",
                        roomType: trsRoom.roomType,
                        status: trsRoomMain?.status ?? 0,
                        arrivalDate: trsRoom?.arrivalDate,
                        departureDate: trsRoom?.departureDate,
                    }
                }//map data list room plan by guest profile and transaction room
            })
        }
        return {
            listCardRoomPlan: dataTmp,
            resPagination: dataMapTypeRoom?.resPagination ?? { TotalCount: 1, TotalPages: 1 },
            dataTransactRoom: dataTransactRoom,
            listGuestProfile: guestProfile ?? [],
            resHeaderInv: dataMapTypeRoom?.resHeaderInv ?? {
                TotalCount: 0,
                TotalPages: 0,
                inspected: 0,
                orderService: 0,
                outOfOrder: 0,
                unInspected: 0,
                vacantClean: 0,
                vacantDirty: 0
            }
        };
    }
    static async getDataTrsRoomByListRoom(listRoomGuid: string[], hotelGuid: string, selectDate: Date): Promise<ListTsRoomPlan[] | []> {
        let result: any[] = [];
        if (listRoomGuid.length > 0) {
            selectDate.setHours(0);
            selectDate.setMinutes(0);
            selectDate.setSeconds(0);
            selectDate.setMilliseconds(0);

            const data = {
                hotelGuid: hotelGuid,
                arrival: selectDate,
                departure: addDays(selectDate,1)
            }
            try {
                const res = await functionPkmApi.searchGroupListRoomPlan(data, listRoomGuid).toPromise();
                if (res) {
                    result = result.concat(res);
                }
            } catch (error: any) {
                openNotification(NotificationStatus.Error, "", "", error.status);
            }
        }
        return result;
    }
    static async getDataGuestProfile(listGuestID: string[]): Promise<any[] | null> {
        return await ProfileApi.getGuestProfiles({'guids': listGuestID }).toPromise();
    }
    static async getListCompany(hotelGuid: string, listGuid: string[]): Promise<CompanyProfile[] | null> {
        if (listGuid.length !== 0) {
            try {
                return await ProfileApi.getListCompanyByListGuid(hotelGuid, listGuid).toPromise();
            } catch (error) {
                return null;
            }
        }
        return [];
    }
    static async getDataUnAssignRoom(selectedDate: Date, hotelGuid: string, room: any[], filter: PaginationUnAssign): Promise<{ table: ResGuestProfiles[]; pagination: PaginationHeaders }> {
        let result: any[] = [];
        const data = {
            selectedDate: selectedDate,
            hotelGuid,
            pageNumber: filter.pageNumber,
            pageSize: filter.pageSize
        }
        const table: any[] = []
        const listGuest: string[] = []
        let pagination: PaginationHeaders = {
            pageSize: 0,
            TotalCount: 0,
            CurrentPage: 0,
            TotalPages: 0,
            HasNext: false,
            HasPrevious: false
        }
        try {
            const res = await PkmApi.getTrsByStatus(data).toPromise();
            if (res) {
                pagination = JSON.parse(res.xhr.getResponseHeader('x-pagination'))
                result = result.concat(res.response);
                result.map((item) => {
                    listGuest.push(item.transactRoom[0].guestId)
                    const tmp = room.find(x => x.id === item.roomType)
                    const date = Utils.formatDateToTable(item.arrivalDate, item.departureDate)
                    return table.push({ ...item, roomName: tmp?.name, date: date })
                })
                const dataGuest = await ProfileApi.getGuestProfiles({ 'guids': listGuest }).toPromise();
                dataGuest?.forEach((tmp) => {
                    for (let index = 0; index < table.length; index++) {
                        if (table[index].transactRoom[0].guestId === tmp.guid)
                            table[index] = { ...table[index], fullName: `${tmp.guestName ?? ""} ${tmp.firstName ?? ""}` }
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
        const dataTable: { table: ResGuestProfiles[]; pagination: PaginationHeaders } = { table: table, pagination: pagination }
        return dataTable
    }
    static async getDataSourcePMRoom(hotelGuid: string, selectedDate: Date, pmGuid: string[]): Promise<RoomInfo[]> {
        const listPMGuid: string[] = []
        const guestID: string[] = []
        const dataListRoom: RoomsInARoomType[] = await InventoryApi.getRoomsInRoomTypes(hotelGuid, pmGuid)
        dataListRoom && dataListRoom[0].rooms.forEach((item) => listPMGuid.push(item.guid))

        const dataGuestList: ListTsRoomPlan[] =  await this.getDataTrsRoomByListRoom(listPMGuid, hotelGuid, selectedDate);
        const data: RoomInfo[] = dataListRoom && dataListRoom[0]?.rooms

        dataGuestList && dataGuestList.map((item) => guestID.push(item.reservation.bookedBy ? item.reservation.bookedBy : item.transactRoom[0].guestId))
        const dataGuest = await ProfileApi.getGuestProfiles({ 'guids': guestID }).toPromise()

        if (data) {
            for (let index = 0; index < data.length; index++) {
                const guestInRoom = dataGuestList?.find((x) => x.roomName === data[index].so)
                if (guestInRoom) {
                    const guest: ResGuestProfiles | undefined = dataGuest && dataGuest.find((item) => item.guid === guestInRoom.reservation.bookedBy)
                    const date = Utils.formatDateToTable(guestInRoom.arrivalDate.toLocaleString(), guestInRoom?.departureDate.toLocaleString())
                    data[index] = {
                        ...data[index],
                        roomName: guestInRoom?.roomName,
                        date: date,
                        fullName: guest ? `${guest?.firstName ?? ""} ${guest?.guestName ?? ""}` : ""
                    }
                }
                data[index].trangThai = RoomPlanService.updateStatus(data[index].trangThai)
            }
        }
        return data
    }

    static updateStatus(status: number | string): string {
        switch (status) {
        case 0:
            return status = "Reservation"
        case 1:
            return status = "CheckIn"
        case 2:
            return status = "CheckOut"
        case 3:
            return status = "Cancel"
        case 4:
            return status = "NoShow"
        case 5:
            return status = "WaitingList"
        default:
            break;
        }
        return "";
    }
    static async getListRoomsByRoomType(hotelGuid: string, roomTypeGuid: string[]): Promise<RoomsInARoomType[] | []> {
        let result: any[] = [];
        if (roomTypeGuid.length > 0) {
            try {
                const res = await InventoryApi.getRoomsInRoomTypes(hotelGuid, roomTypeGuid);
                if (res) {
                    result = result.concat(res);
                }
            } catch (error) {
                console.log(error)
            }
        }
        return result;
    }
    static async getAvailableRooms(hotelGuid: string, roomTypeGuid: string, arrivalDate: string, departureDate: string): Promise<RoomInfo[] | []> {
        let result: RoomInfo[] = [];
        try {
            const res = await InventoryApi.getAvailableRooms(hotelGuid, roomTypeGuid, arrivalDate, departureDate);
            if (res) {
                const tmp = result.concat(res);
                result = tmp.filter((item) => {return !item.so.includes("9900")})
            }
        } catch (error) {
            console.log(error)
        }
        return result;
    }
    static async assignRoom(data: AssignRoom[]): Promise<any> {
        try {
            const res = await functionPkmApi.assignRoom(data).toPromise();
            if (res.result) {
                return res;
            }else{
                openNotification(NotificationStatus.Error, res.message, "");
            }
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "Assign Failed", "", error.status);
            return error.response;
        }
    }
    static async unAssignRoom(transactionGuid: string[]): Promise<any> {
        try {
            const res = await functionPkmApi.unAssignRoom(transactionGuid).toPromise();
            if (res)
                return res;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, "UnAssign Failed !", "", error.status);
        }
    }
    static async updateDoNotMove(transactionGuid: string[], value: boolean): Promise<any> {
        try {
            const res = await functionPkmApi.updateTransactRoom(transactionGuid, value).toPromise();
            if (res)
                return res;
        } catch (error) {
            console.log(error)
        }
    }
    static async updateStatusRoom(transactionGuid: string, data: RoomInfoUpdateStatus): Promise<boolean> {
        try {
            const res = await InventoryApi.updateStatus(transactionGuid, data).toPromise();
            if (res)
                return true;
        } catch (error) {
            console.log(error)
            return false
        }
        return false
    }
    static mapDataParamCheckin(listMasterTsRoom: TransactRoom[], dataTransactRoom: ListTsRoomPlan[], ListCardRoomPlan: ListCardRoomPlan[]): ResParamCheckIn{
        const listParamCheckin: IParamCheckIn[] = [];
        const roomDirty: any[] = [];
        listMasterTsRoom.forEach(item => {
            const getDataTsRoom = dataTransactRoom.find(x => x.mainGuest === item.guid);
            listParamCheckin.push({
                roomName: getDataTsRoom?.roomName.toString() ?? "",
                mainTsRoom: getDataTsRoom?.mainGuest ?? "",
                rsvnNo: getDataTsRoom?.reservation.id?.toString() ?? "",
                status: this.updateStatus(getDataTsRoom?.status ?? 0),
                parentMeGuid: null
            })
            if(getDataTsRoom){
                getDataTsRoom?.transactRoom.forEach(item => {
                    if(item.parentMeGuid){
                        listParamCheckin.push({
                            roomName: getDataTsRoom?.roomName.toString() ?? "",
                            mainTsRoom: item.guid ?? "",
                            rsvnNo: getDataTsRoom?.reservation.id?.toString() ?? "",
                            status: this.updateStatus(getDataTsRoom?.status ?? 0),
                            parentMeGuid: getDataTsRoom?.mainGuest ?? ""
                        })
                    }
                })
                ListCardRoomPlan.forEach(element => {
                    if(element.guid === item.guid){
                        if(element.cleanDirty === 0){
                            roomDirty.push(element.roomNumber);
                        }
                    }
                })
            }
            
        })
        return{ listParamCheckin, roomDirty }
    }
}
export default RoomPlanService;