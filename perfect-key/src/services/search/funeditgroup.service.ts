/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationStatus } from 'common/enum/shared.enum';
import GLobalPkm from 'common/global';
import { ISearchResult } from 'common/model-booking';
import { IDataFuncEditGroup } from "common/model-rsvn";
import openNotification from 'components/CNotification';
import functionPkmApi from 'api/pkm/function.api';
import Utils from 'common/utils';

class SmallFuncEditGroup{
    static mapDataFuncEdit(data: IDataFuncEditGroup, isChild: boolean, selectedRows?: ISearchResult[], typeSubMenu?: string): IDataFuncEditGroup[]{
        const newData: IDataFuncEditGroup[] = [];
        if(isChild){
            if(typeSubMenu === "departureDate"){
                newData.push({
                    guidTsRoom: GLobalPkm.defaultBytes32,
                    ...data,
                    departureDate: Utils.formatDateCallApi(new Date(data.departureDate ?? ""))
                })
            }
            else if(typeSubMenu === "arrivalDate"){
                newData.push({
                    guidTsRoom: GLobalPkm.defaultBytes32,
                    ...data,
                    arrivalDate: Utils.formatDateCallApi(new Date(data.arrivalDate ?? ""))
                })
            }
            else if(typeSubMenu === "edit-arr-de-date"){
                newData.push({
                    guidTsRoom: GLobalPkm.defaultBytes32,
                    ...data,
                    arrivalDate: Utils.formatDateCallApi(new Date(data.arrivalDate ?? "")),
                    departureDate: Utils.formatDateCallApi(new Date(data.departureDate ?? ""))
                })
            }else{
                newData.push({
                    guidTsRoom: GLobalPkm.defaultBytes32,
                    ...data
                })
            }
        }else{
            if(selectedRows){
                selectedRows.forEach(item => {
                    if(typeSubMenu === "departureDate"){
                        newData.push({
                            guidTsRoom: item.guid ?? "",
                            ...data,
                            departureDate: Utils.formatDateCallApi(new Date(data.departureDate ?? ""))
                        })
                    }
                    else if(typeSubMenu === "arrivalDate"){
                        newData.push({
                            guidTsRoom: item.guid ?? "",
                            ...data,
                            arrivalDate: Utils.formatDateCallApi(new Date(data.arrivalDate ?? ""))
                        })
                    }
                    else if(typeSubMenu === "edit-arr-de-date"){
                        newData.push({
                            guidTsRoom: item.guid ?? "",
                            ...data,
                            arrivalDate: Utils.formatDateCallApi(new Date(data.arrivalDate ?? "")),
                            departureDate: Utils.formatDateCallApi(new Date(data.departureDate ?? ""))
                        })
                    }else{
                        newData.push({
                            guidTsRoom: item.guid ?? "",
                            ...data
                        })
                    }
                })
            }
        }
        return newData;
    }
    static async updateFuncEditGroup(rsvnId: string, isChild: boolean, data: IDataFuncEditGroup[]): Promise<boolean>{
        try {
            await functionPkmApi.updateSmallEditGroup(data,rsvnId,isChild).toPromise();
            openNotification(NotificationStatus.Success, "Edit Group Successfully","");
            return  true;
        } catch (error: any) {
            openNotification(NotificationStatus.Error, error.message,"", error.status);
            return false;
        }   
    }
}
export default SmallFuncEditGroup;