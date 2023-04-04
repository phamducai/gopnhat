/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import CModel from 'components/CModal';
import { useStyleTheme } from 'theme'
import { useSelectorRoot } from 'redux/store';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Radio } from 'antd';
import { styleCTableFixCharge } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { IUpdateStatusRoom, ListCardRoomPlan } from 'common/model-inventory';
import GLobalPkm from 'common/global';
import RoomPlanHeper from 'services/frontdesk/roomPlanHeper/roomplanheper';
import FrontDeskService from 'services/frontdesk/frontdesk.service';


interface Props {
    isVisible: boolean,
    setIsVisble: React.Dispatch<React.SetStateAction<boolean>>,
    dataRoom: ListCardRoomPlan | undefined,
    searchAndMapData: any
}
interface FormSetStatuRoom{
    value: number
}
const ChangeRoomStatus = ({ isVisible, setIsVisble, dataRoom, searchAndMapData }: Props) => {
    const classes = useStyleTheme(styleCTableFixCharge);
    const { hotelId } = useSelectorRoot(state => state.app)
    const { t } = useTranslation("translation");
    const { handleSubmit, control } = useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async (data: FormSetStatuRoom) => {
        const mapData = RoomPlanHeper.setFlagTypeUpdateRoomStatus(data.value);
        const dataUpdateStatus: IUpdateStatusRoom = {
            hotelGuid : hotelId,
            floor: dataRoom?.floor ?? 0,
            flagType: mapData.flagType,
            status: mapData.status,
            roomId: dataRoom?.roomGuid ?? GLobalPkm.defaultBytes32
        }
        await FrontDeskService.changeStatusRoom(dataUpdateStatus);
        searchAndMapData();
        setIsLoading(false);
        setIsVisble(false);
    }
    return (
        <CModel
            title={t("FRONTDESK.ROOMPLAN.changeStatusRoom")}
            visible={isVisible}
            onOk={() => setIsLoading(true)}
            onCancel={() => {
                setIsVisble(false);
            }}
            width={600}
            myForm="formChangeStatus"
            isLoading={isLoading}
            content={
                <form onSubmit={handleSubmit(onSubmit)} id="formChangeStatus">
                    <div className="col-span-12">
                        <Controller
                            control={control}
                            defaultValue={0}
                            name="value"
                            render={({ onChange }) => (
                                <Radio.Group
                                    className={`${classes.radioGroup} font-semibold text-base w-full`}
                                    onChange={e => { 
                                        onChange(e.target.value); 
                                    }}
                                    defaultValue={0}
                                >
                                    <div className='grid grid-cols-12 gap-y-4'>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B" }} value={0}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeToClear")}</Radio>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B" }} value={1}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeFloorToClear")}</Radio>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B" }} value={2}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeAllRoomToClear")}</Radio>
                                        </div>
                                        <div className="col-span-12 flex items-center justify-center">
                                            <div className="w-3/4 border-dashed border-t"></div>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B"}} value={3}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeToDirty")}</Radio>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B"}} value={4}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeFloorToDirty")}</Radio>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B"}} value={5}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.changeAllRoomToDirty")}</Radio>
                                        </div>
                                        <div className="col-span-12 flex items-center justify-center">
                                            <div className="w-3/4 border-dashed border-t"></div>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B"}} value={6}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.setOOO")}</Radio>
                                        </div>
                                        <div className="col-span-8">
                                            <Radio style={{ color: "#00293B"}} value={7}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.unblockOOO")}</Radio>
                                        </div>
                                        <div className="col-span-12 flex items-center justify-center">
                                            <div className="w-3/4 border-dashed border-t"></div>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B"}} value={8}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.setInspected")}</Radio>
                                        </div>
                                        <div className="col-span-4">
                                            <Radio style={{ color: "#00293B"}} value={9}>{t("FRONTDESK.ROOMPLAN.changeStatusRooms.unsetInspected")}</Radio>
                                        </div>
                                    </div>
                                </Radio.Group>
                            )}
                        />
                    </div>
                </form>
            }
        />
    );
};

export default React.memo(ChangeRoomStatus);