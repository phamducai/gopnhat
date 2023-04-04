/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Select, Modal, Input,Alert } from 'antd';
import CModel from 'components/CModal';
import { useStyleTheme } from 'theme'
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { styleCombineGuest } from 'pages/main/booking/searchResults/styles/styleCombineGuest';
import { styleCForm } from 'pages/main/booking/styles/styleCForm';
import { useTranslation } from 'react-i18next';
import { ISearchResult } from 'common/model-booking';
import { searchByRoomNoRequest } from "redux/controller/frontdesk/roomplan.slice";
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import BreakSharedService from 'services/search/breadshared.service';
import { fetchReservatedRooms } from 'redux/controller/reservation.slice';
import { IQueryParam } from 'common/define-booking';
import { updateQueryParamStatus } from 'redux/controller/booking.slice';
const { Option } = Select;
const { confirm } = Modal;

interface Props{
    isVisbleBreak: boolean, 
    setIsVisbleBreak: React.Dispatch<React.SetStateAction<boolean>>, 
    selectedRows: ISearchResult
}
const BreakSharedBooking = ({ isVisbleBreak, setIsVisbleBreak, selectedRows }: Props) => {
    const classes = useStyleTheme(styleCombineGuest);
    const classesInput = useStyleTheme(styleCForm);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { reservatedRooms } = useSelectorRoot(state => state.rsvn);
    const { numberOfRooms } = useSelectorRoot(state => state.app);
    const { listRoom } = useSelectorRoot(state => state.roomPlan);
    const { queryParam, roomType} = useSelectorRoot(state => state.booking);
    const dispatch = useDispatchRoot();
    const { handleSubmit, control, setValue, getValues } = useForm();

    const [roomNo, setRoomNo] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [status, setStatus] = useState<number>(selectedRows.status.id ?? 0);
    const [selectTsRoom, setSelectTsRoom] = useState<IQueryParam | null>(null);
    const [logError, setLogErros] = useState<boolean>(false);
    const { t } = useTranslation("translation");
    const typingTimeoutRef = useRef(0);
    
    useEffect(() => {
        const getTsRoom = queryParam.find(x => x.guid === selectedRows?.guid);
        if(status === 0){
            const getTsMain = queryParam.find(x => x.guid === getTsRoom?.parentMeGuid);
            setValue("roomType", getTsRoom?.roomType);
            setValue("rate", getTsMain?.rate);
            dispatch(fetchReservatedRooms({
                roomTypes: [getTsRoom?.roomType],
                arivalDay: new Date(getTsRoom?.arrivalDate ?? ""),
                depatureDay: new Date(getTsRoom?.departureDate ?? "")
            }));
        }
        setSelectTsRoom(getTsRoom ?? null);
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
        if(status !== 0){
            const strValue = value.split("/");
            const roomGuid = strValue[0];
            const startDate = selectTsRoom?.arrivalDate ?? "";
            const checkHasGuest = await BreakSharedService.checkRoomHasGuest(hotelId,[roomGuid], startDate);
            if(checkHasGuest){
                setFullName(checkHasGuest);
                setRoomNo(strValue[1]);
                setStatus(3)
            }else{
                setStatus(2);
            }
        } 
    }
    const checkIsAvaliableRoom = (e: any) => {
        dispatch(fetchReservatedRooms({
            roomTypes: [e],
            arivalDay: new Date(selectTsRoom?.arrivalDate ?? ""),
            depatureDay: new Date(selectTsRoom?.departureDate ?? "")
        }));
    }
    const showConfirm = (dataBreak: any) => {
        const newTitle = status === 0 || status === 2 ? 'Do you want to Break Shared ?' 
            : `Do you want to move this guest to the room ${roomNo} name ${fullName}?`;
        confirm({
            title: newTitle,
            content: '',
            className: "custom-modal-confirm-pkm",
            async onOk () {
                await BreakSharedService.postBreakShared(dataBreak, true);
                dispatch(updateQueryParamStatus(true));
                setIsVisbleBreak(false);
            }
        });
    }
    const handelOk = handleSubmit((data: any) => {
        let dataBreak;
        let avaliable = 0;
        if(status === 0){
            const tmp = numberOfRooms.find(x => x.id === data.roomType);
            if(tmp){
                const roomTypeGuid = tmp.id;
                console.log(reservatedRooms);
                reservatedRooms.forEach(item => {
                    if(item.roomTypesCount[roomTypeGuid]?.length){
                        const tmps: any[] = item.roomTypesCount[tmp.id].filter((item: any) => item.status < 2);
                        avaliable = tmp.count - tmps.length;
                    }else{
                        avaliable = tmp.count;
                    }
               })
                dataBreak = {
                    hotelGuid: hotelId,
                    trsGuid: selectedRows?.guid ?? "",
                    roomGuid: hotelId,
                    roomName: "",
                    roomType: data.roomType,
                    roomTypeName: tmp?.name,
                    breakShareStartDate: selectTsRoom?.arrivalDate,
                    breakShareEndDate: selectTsRoom?.departureDate,
                    rate: parseInt(data.rate)
                }
            }
        }else{
            const tmp = data.roomId.split("/")[0];
            const selectRoom = listRoom.find(x => x.roomGuid === tmp);
            dataBreak = {
                hotelGuid: hotelId,
                trsGuid: selectedRows?.guid ?? "",
                roomGuid: selectRoom?.roomGuid,
                roomName: selectRoom?.roomName,
                roomType: selectRoom?.roomType,
                roomTypeName: selectRoom?.roomTypeName,
                breakShareStartDate: selectTsRoom?.arrivalDate,
                breakShareEndDate: selectTsRoom?.departureDate,
                rate: status === 2 ? parseInt(data.rate) : 0
            }
        }
        if(avaliable <= 0 && status === 0){
            setLogErros(true);
        }else{
            showConfirm(dataBreak)
        }
       
    })
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
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.fullname")} :</th>
                                    <td style={{ width: '40%' }}>{selectedRows?.fullName.name ?? ""}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.rsvnNo")} :</th>
                                    <td>{selectedRows?.rsvnNo.name ?? ""}</td>
                                </tr>
                                <tr style={{ verticalAlign: 'top' }}>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.arrival")} :</th>
                                    <td>{selectedRows?.arrival.name ?? ""}</td>
                                    <th scope="row" className={`${classes.text}`}>{t("BOOKING.SEARCHVALUE.departure")} :</th>
                                    <td>{selectedRows?.departure.name ?? ""}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={`col-span-12 flex justify-center items-center mt-5`}>
                        <b className={`${classes.text}`}>Break</b>
                    </div>
                    {selectedRows.status.id === 1 ?
                        <div className="col-span-12 my-2.5">
                            <p className={`${classes.text} m-0 font-base font-bold`}>Room Name:</p>
                            <Controller 
                                render={({ onChange, value, ref }) =>
                                    <Select
                                        showSearch
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
                    :
                        <div className="col-span-6 my-2.5">
                            <p className={`${classes.text} m-0 font-base font-bold`}>Room Type:</p>
                            <Controller 
                                render={({ onChange, value, ref }) =>
                                    <Select
                                        showSearch
                                        className={`${classes.selectBackground} w-full !rounded-md`}
                                        placeholder="Search room type"
                                        onSearch={onSearchRoom}
                                        value={getValues("roomType")}
                                        onChange={(e) => {
                                            onChange(e)
                                            checkIsAvaliableRoom(e);
                                        }}
                                        filterOption={(input: any, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {roomType.map((item) =>
                                            <Option key={item.id} value={item.guid}>{item.ten}</Option>
                                        )}
                                    </Select>
                                }
                                name="roomType" control={control} defaultValue=""
                            />
                        </div>
                    }
                    {status === 0 || status === 2 ? 
                        <div className={`${status === 0 ? "col-span-6 ml-5" : "col-span-12"} my-2.5`}>
                            <p className={`${classes.text} m-0 font-base font-bold`}>Rate:</p>
                            <Controller 
                                render={({ onChange, value, ref }) =>
                                    <Input className={`${classesInput.input} w-full !rounded-md`}
                                        placeholder="input rate"
                                        value={getValues("rate")}
                                        onChange={(e) => onChange(e)} type="number" required/>
                                }
                                name="rate" control={control} defaultValue=""
                            />
                        </div>
                    : ""}
                    {status === 3 ? 
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
                    : ""}
                    {logError ?
                        <div className={`col-span-12 my-2.5`}>
                            <Alert message="This room type is sold out" type="error" />
                        </div>
                    : ""}
                </form>
            }
        />
    );
};

export default React.memo(BreakSharedBooking);