import InventoryApi from "api/inv/inv.api";
// import functionPkmApi from "api/pkm/function.api";
import PkmApi from "api/pkm/pkm.api";
import ProfileApi from "api/profile/prf.api";
import { ResGuestProfilesSearch, ResRoom } from "common/define-api-booking";
import { UpdateRoomRackData } from "common/front-desk/define-api-roomRack";
import { ResListRoom, RoomRackFooter, Task } from "common/front-desk/define-roomRack";

import { PaginationRoom, ResPagination } from "common/model-inventory";

class RoomRackService{
    static async getAllRoomByHotelGuid(data: PaginationRoom): Promise<ResRoom[] | null> {
        
        return await InventoryApi.getAllRoomInHotel(data, false).toPromise();
    }
    //eslint-disable-next-line
    static async getDetailOfAllRoom(hotelGuid : string , arrival : string | Date, departure : string | Date, listRoomId : string[]): Promise<any | null>{
        return await PkmApi.getDetailAllRoom({
            hotelGuid,
            arrival,
            departure
        },listRoomId).toPromise();
    }
    //eslint-disable-next-line
    static async updateTask(data : UpdateRoomRackData) : Promise<any | null> {
        return await PkmApi.updateTaskRoomRack(data).toPromise();
    }

    static async getDataGuest(data : string[]) : Promise<ResGuestProfilesSearch[] | null>{
        return await ProfileApi.getGuestProfileRunNight(data).toPromise();
    }
    
    //eslint-disable-next-line
    static async getAllRoomByHotelId(data : PaginationRoom, hotelGuid : string,arrival : Date | string, departure : Date | string, roomRackFooter : RoomRackFooter[], length : number ) : Promise<any | undefined> {
        try{
  
            //eslint-disable-next-line
            const res : any = await this.getAllRoomByHotelGuid(data);
            const pageHeader : ResPagination = {
                TotalCount: 1,
                TotalPages: 1,
            }
            //eslint-disable-next-line
            let taskOfRoom : any = {};
            const dataGuestProfile : string[] = [];
            if(res){
                const resPage = JSON.parse(res.xhr.getResponseHeader("x-pagination")) as ResPagination;
                pageHeader.TotalCount = resPage.TotalCount;
                pageHeader.TotalPages = resPage.TotalPages;
                const listRoomId : string[] =  []
                //eslint-disable-next-line
                res.response.map((item : ResRoom) => {
                    taskOfRoom = {...taskOfRoom, [item.guid] : []};
                    listRoomId.push(item.guid);
                })
                const resListRoom : ResListRoom = await this.getDetailOfAllRoom(
                    hotelGuid,
                    arrival,
                    departure,
                    listRoomId,
                );
            
                let cloneRoomRackFooter = [...resListRoom.roomRackFooter]
                if(roomRackFooter.length === 0){
                    cloneRoomRackFooter = resListRoom.roomRackFooter;
                }
                else{
                    //eslint-disable-next-line
                    roomRackFooter.map((item : RoomRackFooter, index : number) => {
                        cloneRoomRackFooter[index].totalItem += item.totalItem;
                        cloneRoomRackFooter[index].totalItemAssign += item.totalItemAssign;
                        cloneRoomRackFooter[index].totalItemUnassign += item.totalItemUnassign;
                    })
                }
                //Get task and put it in Object taskOfRoom
                //eslint-disable-next-line
                resListRoom.data.map((item : Task) => {
                    //eslint-disable-next-line
                    item.dataRooms.transactRoom.map((ele) => {
                        if(!ele.parentMeGuid && !dataGuestProfile.includes(ele.guestId)){
                            dataGuestProfile.push(ele.guestId);
                        }
                    })
                    taskOfRoom[item.dataRooms.mappingRoomId].push(item);        
                });

                const resGuestProfile = await this.getDataGuest(dataGuestProfile);
                let guestProfileData : ResGuestProfilesSearch = {} as ResGuestProfilesSearch
                if(resGuestProfile && resGuestProfile.length > 0){
                    //country: 0
                    // firstName: "Thang Nguyen Huy"
                    // guestName: "WI"
                    // guid: "419c904d-9509-49c5-bbaa-f67d8d91e983"
                    // nationalityGuid: null
                    //eslint-disable-next-line
                    resGuestProfile.map((item: ResGuestProfilesSearch) => {
                        guestProfileData = {...guestProfileData,[item.guid]: item};
                    })
                }
                return {
                    guestProfileData: guestProfileData,
                    listRoom : res.response,
                    taskOfRoom : taskOfRoom,
                    totalPages : pageHeader.TotalPages,
                    totalCount : pageHeader.TotalPages,
                    listRoomRackFooter : cloneRoomRackFooter,
                };
            }
        
        }
        catch(err){
            console.log(err);
        }
    }
}

export default RoomRackService;