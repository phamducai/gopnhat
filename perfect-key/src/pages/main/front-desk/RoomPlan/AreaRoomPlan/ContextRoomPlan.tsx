/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Modal } from 'antd';
import { ContextMenuRoomPlan, FlagTypeUpdateStatusRoom } from 'common/enum/roomplan.enum';
import GLobalPkm from 'common/global';
import { IUpdateStatusRoom, ListCardRoomPlan } from 'common/model-inventory';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import FrontDeskService from 'services/frontdesk/frontdesk.service';
import RoomPlanHeper from 'services/frontdesk/roomPlanHeper/roomplanheper';

interface IContextRoom extends Props{
    anchorPoint: any,
    handleContextMenu(type: number): void,
    ableButton: boolean,
    isCheckIn: boolean,
    isCheckOut: boolean,
    dataRoom: ListCardRoomPlan | undefined,
    searchAndMapData: any
}
const ContextRoomPlan  = ({ anchorPoint, className, handleContextMenu,ableButton, isCheckIn, isCheckOut, ...props }: IContextRoom): JSX.Element => {
    const { dataRoom,searchAndMapData }  = props
    const { t } = useTranslation("translation");
    const { hotelId } = useSelectorRoot(x => x.app);
    const handleChangeStatusRoom = (flagType: number, value: number) => {
        Modal.confirm({
            title: "Do you want change status ?",
            okText: t("FRONTDESK.ROOMPLAN.yes"),
            cancelText: t("FRONTDESK.ROOMPLAN.no"),
            className: "custom-modal-confirm-pkm",
            async onOk() {
                const mapData = RoomPlanHeper.setFlagTypeUpdateRoomStatus(flagType);
                const dataUpdateStatus: IUpdateStatusRoom = {
                    hotelGuid : hotelId,
                    floor: dataRoom?.floor ?? 0,
                    flagType: mapData.flagType,
                    status: mapData.status,
                    roomId: dataRoom?.roomGuid ?? GLobalPkm.defaultBytes32
                }
                await FrontDeskService.changeStatusRoom(dataUpdateStatus);
                searchAndMapData();
            }
        });
    }
    return(
        <div className={`absolute context-room-plan pt-3 custom-scrollbar-pkm ${className}`} 
            style={{ 
                top: anchorPoint.y, left: anchorPoint.x,
            }}
        >
            <Menu>
                <Menu.Item
                    key={"cxrp"+1}
                    className={`text-sm font-medium`}
                    disabled={ableButton}
                    onClick={() => handleContextMenu(ContextMenuRoomPlan.Folio)}
                >
                    Folio
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+4}
                    className={`text-sm font-medium`}
                    disabled={isCheckIn}
                    onClick={() => handleContextMenu(ContextMenuRoomPlan.CheckIn)}
                >
                    Check In
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+2}
                    className={`text-sm font-medium`}
                    disabled={isCheckIn}
                    onClick={() => handleContextMenu(ContextMenuRoomPlan.GroupCheckIn)}
                >
                    Group Check In
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+3}
                    className={`text-sm font-medium`}
                    disabled={isCheckOut}
                    onClick={() => handleContextMenu(ContextMenuRoomPlan.GroupCheckOut)}
                >
                    Group Check Out
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item
                    key={"cxrp"+5}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(0, FlagTypeUpdateStatusRoom.ToRoom)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeToClear")}
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+6}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(1,FlagTypeUpdateStatusRoom.ToFloor)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeFloorToClear")}
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+7}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(2,FlagTypeUpdateStatusRoom.ToAllRoom)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeAllRoomToClear")}
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item
                    key={"cxrp"+8}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(3,FlagTypeUpdateStatusRoom.ToRoom)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeToDirty")}
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+9}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(4,FlagTypeUpdateStatusRoom.ToFloor)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeFloorToDirty")}
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+10}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(5,FlagTypeUpdateStatusRoom.ToAllRoom)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeAllRoomToDirty")}
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item
                    key={"cxrp"+11}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(6,FlagTypeUpdateStatusRoom.ToOutOfOrder)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.setOOO")}
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+12}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(7,FlagTypeUpdateStatusRoom.ToOutOfOrder)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.unblockOOO")}
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item
                    key={"cxrp"+14}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(8,FlagTypeUpdateStatusRoom.ToInspected)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.setInspected")}
                </Menu.Item>
                <Menu.Item
                    key={"cxrp"+15}
                    className={`text-sm font-medium`}
                    onClick={() => handleChangeStatusRoom(9,FlagTypeUpdateStatusRoom.ToInspected)}
                >
                    {t("FRONTDESK.ROOMPLAN.changeStatusRooms.unsetInspected")}
                </Menu.Item>
            </Menu>
        </div>
    )
}
export default ContextRoomPlan;