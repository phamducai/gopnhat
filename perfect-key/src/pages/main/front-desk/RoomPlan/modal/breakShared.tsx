/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Select, Modal, Input } from 'antd';
import CModel from 'components/CModal';
import { useStyleTheme } from 'theme'
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import {IExtraGuest } from 'common/model-rsvn';
import { styleCombineGuest } from 'pages/main/booking/searchResults/styles/styleCombineGuest';
import { styleCForm } from 'pages/main/booking/styles/styleCForm';
import { useTranslation } from 'react-i18next';
import { ListCardRoomPlan } from 'common/model-inventory';
import { ListTsRoomPlan } from 'common/model-booking';
import Utils from 'common/utils';
import { GuestProfile } from 'common/model-profile';
import { searchByRoomNoRequest } from "redux/controller/frontdesk/roomplan.slice";
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import BreakSharedService from 'services/search/breadshared.service';
import { updateQueryParamStatus } from 'redux/controller/booking.slice';
const { Option } = Select;
const { confirm } = Modal;

interface Props{
    isVisbleBreak: boolean, 
    setIsVisbleBreak: React.Dispatch<React.SetStateAction<boolean>>, 
    selectedRows?: ListCardRoomPlan,
    ableBreakShared: boolean,
    dataTsRoom?: ListTsRoomPlan,
    listGuestProfile?: GuestProfile[]
}
const BreakSharedRoomPlan = ({ isVisbleBreak, setIsVisbleBreak, selectedRows, ableBreakShared, dataTsRoom,listGuestProfile }: Props) => {
    const classes = useStyleTheme(styleCombineGuest);
    const classesInput = useStyleTheme(styleCForm);

    const { hotelId } = useSelectorRoot(state => state.app);
    const { listRoom } = useSelectorRoot(state => state.roomPlan);
    const { changeStatusProfiles, roomType } = useSelectorRoot(state => state.booking);
    const dispatch = useDispatchRoot();

    const { handleSubmit, control, setValue, getValues } = useForm();
    const [listExtraGuest,setListExtraGuest] = useState<IExtraGuest[]>([]);

    const [roomNo, setRoomNo] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [isEmpty,setIsEmpty] = useState<boolean>(false);
    const [isVisable,setIsVisable] = useState<boolean>(false);
    const [ableInput, setAbleInput] = useState<boolean>(false);
    const [rate, setRate] = useState<number>(0);
    const { t } = useTranslation("translation");
    const typingTimeoutRef = useRef(0);

    useEffect(() => {
        if (ableBreakShared) {
            setRate(Utils.parseLocaleNumber(selectedRows?.rate.toString() ?? "0") ?? 0);
            if(selectedRows && dataTsRoom){
                const tmpGuest = BreakSharedService.mapDataExtraGuest(dataTsRoom,listGuestProfile ?? []);
                setValue("trsGuid", tmpGuest.length > 0 ? tmpGuest[0].guid : "");
                tmpGuest.length > 0 ? setAbleInput(true) : setAbleInput(false);
                setListExtraGuest(tmpGuest);
            }
        }
        onSearchRoom("1");
    }, [selectedRows])
    const onSearchRoom = (value : string) => {
        value.length > 0 ? value = value : value = "1"
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            dispatch(searchByRoomNoRequest({
                hotelGuid: hotelId,
                roomNo: value,
                roomType: roomType
            }))
        }, 300)
    }
    const handleOnchange = async (value: any) => {
        setIsVisable(true);
        const strValue = value.split("/");
        const roomGuid = strValue[0];
        const startDate = dataTsRoom?.arrivalDate;
        const checkHasGuest = await BreakSharedService.checkRoomHasGuest(hotelId,[roomGuid], startDate);
        if(checkHasGuest){
            setFullName(checkHasGuest);
            setRoomNo(strValue[1]);
            setIsEmpty(false);
        }else{
            setIsEmpty(true);
        }
    }
    const showConfirm = (data: any) => {
        const newTitle = isEmpty ? 'Do you want to Break Shared ?' 
            : `Do you want to move this guest to the room ${roomNo} name ${fullName}?`;
        confirm({
            title: newTitle,
            content: '',
            className: "custom-modal-confirm-pkm",
            async onOk () {
                await BreakSharedService.postBreakShared(data, true);
                dispatch(updateQueryParamStatus(!changeStatusProfiles))
                setIsVisbleBreak(false);
            }
        });
    }
    const handelOk = () => {
        const roomGuid = getValues("roomId").split("/")[0];
        const startDate = dataTsRoom?.arrivalDate;
        const endDate = dataTsRoom?.departureDate;
        let data;
        if(isEmpty){
            if(rate !== 0 || rate){
                data = BreakSharedService.converDataBreakShared(roomGuid, getValues("trsGuid") ,listRoom, startDate , endDate ,rate);
                showConfirm(data);
            }else{
                alert("rate is no null");
            }
        }else{
            data = BreakSharedService.converDataBreakShared(roomGuid, getValues("trsGuid") ,listRoom, startDate , endDate ,0);
            showConfirm(data);
        }
    }
    return (
        <CModel
            title={"Break Shared"}
            visible={isVisbleBreak}
            onOk={() => handelOk()}
            onCancel={() => setIsVisbleBreak(false)}
            content={
                <form className="grid xl:grid-cols-12 col-span-12" id="breakShared">
                    <div className={`${classes.borderContent} col-span-12`}>
                        <table className="table-fixed">
                            <tbody>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.arrival")} :</th>
                                    <td style={{ width: '40%' }}>{Utils.formatDateString((dataTsRoom?.arrivalDate ?? "").toString())}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.departure")} :</th>
                                    <td>{Utils.formatDateString((dataTsRoom?.departureDate ?? "").toString())}</td>
                                </tr>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.roomType")} :</th>
                                    <td>{selectedRows?.roomName}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.roomNumber")} :</th>
                                    <td>{selectedRows?.roomNumber}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-span-5 my-2.5">
                        <p className={`${classes.text} m-0 font-base font-bold`}>Shared guest:</p>
                        <Controller 
                            render={({ onChange, value, ref }) =>
                            <Select
                                showSearch
                                className={`${classes.selectBackground} w-full !rounded-md`}
                                placeholder="Select guest"
                                value={getValues("trsGuid")}
                                onChange={(e) => {
                                    setAbleInput(true);
                                    onChange(e)
                                }}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {listExtraGuest.map((item: any) =>
                                    <Option key={item.guid} value={item.guid}>{item.fullName}</Option>
                                )}
                            </Select>
                        }
                        name="trsGuid" control={control} defaultValue=""
                        />
                    </div>
                    <div className={`col-span-2 flex justify-center items-center mt-5`}>
                        <b className={`${classes.text}`}>Break</b>
                    </div>
                    <div className="col-span-5 my-2.5">
                        <p className={`${classes.text} m-0 font-base font-bold`}>Room Name:</p>
                        <Controller 
                            render={({ onChange, value, ref }) =>
                                <Select
                                    showSearch
                                    disabled={!ableInput}
                                    className={`${classes.selectBackground} w-full !rounded-md`}
                                    placeholder="Search room no"
                                    onSearch={onSearchRoom}
                                    onChange={(e) => {
                                        onChange(e)
                                        handleOnchange(e)
                                    }}
                                    filterOption={false}
                                    notFoundContent={"Khong tim thay phong"}
                                >
                                    {listRoom.map((item) =>
                                        <Option key={item.roomGuid} value={`${item.roomGuid}/${item.roomName}`}>{item.roomName} - {item.roomTypeName}</Option>
                                    )}
                                </Select>
                            }
                            name="roomId" control={control} defaultValue=""
                        />
                    </div>
                    {isVisable ?
                        <>
                            {isEmpty ? 
                            <div className="col-span-12 my-2.5">
                                <p className={`${classes.text} m-0 font-base font-bold`}>Rate:</p>
                                <Input className={`${classesInput.input} w-full !rounded-md`}
                                    value={rate}
                                    onChange={(e) => {
                                            setRate(e.target.valueAsNumber)
                                        } 
                                    }
                                    type="number" required/>
                            </div>
                            : 
                            <div className={`${classes.borderContent} col-span-12 my-2.5`}>
                                <table className="table-fixed">
                                    <tbody>
                                        <tr style={{ verticalAlign: 'top' }}>
                                            <th scope="row" className={`${classes.text}`}>Full Name:</th>
                                            <td style={{ width: '50%' }}>{fullName}</td>
                                            <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.roomNumber")} :</th>
                                            <td>{roomNo}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            }
                        </>
                    : ""}
                </form>
            }
        />
    );
};

export default React.memo(BreakSharedRoomPlan);