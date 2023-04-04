/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import ClassBox from 'components/CClassBox'
import { Input, Select, Button,Checkbox,Modal, InputNumber } from "antd";
import { Controller } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import clsx from 'clsx';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import CFixCharge from 'components/CModalFixCharge';
import CIconSvg from 'components/CIconSvg';
import { styleInput } from './styles/guestScheduleEdit.style'
import ModelSpecials from './ModelSpecials';
import CModalPickUp from 'components/CModalPickUp';
import CModalFlightInfo from 'components/CModalFlightInfo';
import { setDateRsvn } from 'redux/controller/reservation.slice';
import { addDays} from 'date-fns';
import { useTranslation } from 'react-i18next';
import Utils from 'common/utils';
import { DataCEditRsvn, TrRoomHistory } from 'common/model-rsvn';
import { NumberOfRooms, RoomsInARoomType } from 'common/model-inventory';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import GLobalPkm from 'common/global';
import DatePicker from 'components/CDatePicker';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import ReservationService from 'services/reservation/reservation.service.';
import { setTraceInHouse } from "redux/controller/trace.slice";
import { TypeActionCode } from 'common/enum/tracer.enum';
import { IHcfgInfor } from 'common/model-hcfg';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
//import openNotification from 'components/CNotification';
//import { NotificationStatus } from 'common/enum/shared.enum';
const { Option } = Select;

interface ICGuestProfile extends Props {
    setIsPrintRateByCompany?: any,
    isFit?: boolean,
    control?: any,
    data?: IHcfgInfor | any,
    setSelectValueSource?: any,
    valueSource?: any,
    getGuestProfileByRsvnId?: any,
    getValues: any,
    setValue: any,
    isEdit: boolean,
    dataHistory: TrRoomHistory | null,
    roomListType: RoomsInARoomType[],
    roomTypeGuid: string,
    roomNameGuid: string,
    setRoomListType: any,
    inHouse: boolean,
    isMain: boolean,
    dataEditRsvn?: DataCEditRsvn | null
}
const CGuestScheduleEdit = ({ getGuestProfileByRsvnId, control, data, getValues, setValue, isMain, ...props }: ICGuestProfile): JSX.Element => {
    const classes = useStyleTheme(styleInput);
    const classesTmp = useStyleTheme(styleCorrection);
    const { isEdit, dataHistory, roomListType, roomTypeGuid, roomNameGuid, setRoomListType, inHouse, dataEditRsvn } = props;
    const [isVisibleMFix,setVisibleMFix] = useState<boolean>(false);
    const [isVisibleMSpecials,setVisibleMSpecials] = useState<boolean>(false);
    const [isVisibleMPickup,setVisibleMPickup] = useState<boolean>(false);
    const [isVisibleMFlight,setVisibleMFlight] = useState<boolean>(false);

    const [nights,setNights] = useState<number>(0);
    const { hotelId} = useSelectorRoot(state => state.app);
    const { totalFixCharge } = useSelectorRoot(state => state.rsvn);
    const { numberOfRooms, roomTypePMId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const [listHasRoom, setListHasRoom] = useState<string[]>([]);
    const [rate, setRate] = useState<number>(-1);
    const [valueAdultAndChilds, setValueAdultAndChilds] = useState<number>(-1);
    const dispatch = useDispatchRoot();
    const { t } = useTranslation("translation")

    useEffect(() => {// save date using modal pickup, fixcharge and flight
        if (nights > 0) {
            const departureDate = new Date(getValues("departureDate"));
            const arrivalDate = new Date(getValues("arrivalDate"));
            dispatch(setDateRsvn({ arrivalDate, departureDate, newNumberNight: nights, defineNight: nights }))
        }
    }, [dispatch, getValues, nights, roomListType])

    const fetchRoom = async (value: string, isSetValue: boolean) => {
        const roomList = await RoomPlanService.getListRoomsByRoomType(hotelId, [value ?? ""]);
        if(roomList){
            setRoomListType(roomList);
            const resp = await ReservationService.hasUserRoomByRoomType(value, hotelId, getValues("arrivalDate"), getValues("departureDate"))
            setListHasRoom(resp)
            if(isSetValue && resp){
                let guid = roomList[0].rooms[0].guid;
                if(resp.length > 0){
                    roomList[0].rooms.forEach(item => {
                        const check = resp.find(x => x === item.guid);
                        if(!check){
                            guid = item.guid
                        }
                    })
                }
                setValue("room", guid)
            }
        }
    }
    useEffect(() => {
        if(roomTypeGuid !== ""){
            fetchRoom(roomTypeGuid, false)
        }
        return () => {
            setListHasRoom([])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[getValues, hotelId, roomTypeGuid, setRoomListType])
    useEffect(() => {
        const setdefaultValue =()=>{
            if(dataEditRsvn?.dataFotransactRoomDTO.adults && dataEditRsvn?.dataFotransactRoomDTO.adults !== 0){
                return 0;
            }else if(dataEditRsvn?.dataFotransactRoomDTO.childs && dataEditRsvn?.dataFotransactRoomDTO.childs !== 0){
                return 1;
            }else{
                return -1;
            }
        }
        setValueAdultAndChilds(setdefaultValue)
        return () => {
            setValueAdultAndChilds(-1)
        }
    },[dataEditRsvn?.dataFotransactRoomDTO.adults, dataEditRsvn?.dataFotransactRoomDTO.childs])

    const onSetArrivalDateChange = (dateValue: any) => {
        const newNight = Utils.differenceInDays(getValues("departureDate"), dateValue);
        setNights(newNight);
        setValue("nights",newNight);
    }
    const onSetDepartureDateChange = (dateValue: any) => {
        const newNight = Utils.differenceInDays(dateValue, getValues("arrivalDate"));
        setNights(newNight);
        setValue("nights",newNight);
    }
    const onSetDay = (e: any) => {
        setValue("departureDate",addDays(new Date(getValues("arrivalDate")), parseInt(e.target.value)));
        setNights(e.target.value);

    }
    const handleEditRoomNumber = async (newRoomNumber: string, oldRoomNumber: string, children: string, onChange: any) => {
        const room = roomListType[0].rooms.find(x => x.guid === oldRoomNumber);
        if(oldRoomNumber === GLobalPkm.defaultBytes32){
            traceChange(TypeActionCode.AssignRoom, `${room?.so ? 'Old room: ' + room.so : ""}`, `New room: ${children}`)
            onChange(newRoomNumber)
        }
        else if(roomListType){
            Modal.confirm({
                title: `${t("FRONTDESK.ROOMPLAN.wantToChange")} ${room?.so ?? ""} ${t("FRONTDESK.ROOMPLAN.roomTo")} ${children} ${t("FRONTDESK.ROOMPLAN.fromRoom")}`,
                okText: t("FRONTDESK.ROOMPLAN.yes"),
                cancelText: t("FRONTDESK.ROOMPLAN.no"),
                className: "custom-modal-confirm-pkm",
                onOk() {
                    onChange(newRoomNumber)
                    traceChange(TypeActionCode.AssignRoom, `${room?.so ? 'Old room: ' + room.so : ""}`, `New room: ${children}`)
                }
            });
        }
        
    }
    const handleEditRoomType = async (newRoomTypeId: string, oldRoomTypeId: string, children: string, onChange: any) => {
        const listOldRoom = numberOfRooms.find(x => x.id === oldRoomTypeId);
        const listNewRoom = numberOfRooms.find(x => x.id === newRoomTypeId);
        const listUsedRoom = await ReservationService.getTotalBookerByRoomTypeId([newRoomTypeId], getValues("arrivalDate"), getValues("departureDate"));
        
        if(listNewRoom && listUsedRoom.length > 0){
            let title = "";
            const avaliableRoom = listNewRoom.count - listUsedRoom[0].countHasRoom;
            if(avaliableRoom > 0 || newRoomTypeId === roomTypeGuid){
                title = `${t("FRONTDESK.ROOMPLAN.wantToChange")} ${listOldRoom?.name} ${t("FRONTDESK.ROOMPLAN.roomTo")} ${children} ${t("FRONTDESK.ROOMPLAN.fromRoom")}`
            }else{
                title = `${listNewRoom?.name} full slot ?`;
            }
            Modal.confirm({
                title: title,
                okText: t("FRONTDESK.ROOMPLAN.yes"),
                cancelText: t("FRONTDESK.ROOMPLAN.no"),
                className: "custom-modal-confirm-pkm",
                async onOk() {
                    if(avaliableRoom > 0 || newRoomTypeId === roomTypeGuid){// check room type avaliable room or new room type compare room current room
                        onChange(newRoomTypeId)
                        traceChange(TypeActionCode.ChangeRoomType, `Old room type: ${listOldRoom?.name ?? ""}`, `New room type: ${children}`)
                        fetchRoom(newRoomTypeId, true)
                    }
                }
            });
        }
    }
    const handleEditDay = async (arrivalDate: Date, departureDate: Date, flagType: boolean, onChange: any) => {
        const listRoom = numberOfRooms.find(x => x.id === getValues("roomType"));
        const listUsedRoom = await ReservationService.getTotalBookerByRoomTypeId([getValues("roomType")], 
            Utils.formatDateCallApi(new Date(arrivalDate)), Utils.formatDateCallApi(new Date(departureDate)));
        if(listRoom && listUsedRoom.length > 0){
            if((8 - listUsedRoom[0].countHasRoom) > 0){
                if(flagType){
                    onChange(arrivalDate)
                    onSetArrivalDateChange(arrivalDate)
                    traceChange(TypeActionCode.ChangeArrival, Utils.formatDateCallApi(new Date(arrivalDate)), Utils.formatDateCallApi(arrivalDate ?? new Date()))
                }else{
                    onChange(departureDate)
                    onSetDepartureDateChange(departureDate)
                    traceChange(TypeActionCode.ChangeDeparture, Utils.formatDateCallApi(new Date(departureDate)), Utils.formatDateCallApi(new Date(departureDate ?? "")))
                }
            }else{
                openNotification(NotificationStatus.Warning, "This room full slot !", "");
            }
        }
    }
    const disableDate = (currentDate: any, isBusinessDate = false): boolean => {
        const newDate = !isBusinessDate ? new Date(getValues("arrivalDate")) : new Date(businessDate);
        if(currentDate <= newDate){
            return true;
        }
        return false;
    }
    const renderSelect = (data: any) => {
        return data.map((item: any) => {
            return (
                <Option value={item.guid} key={item.guid}>{item.ten}</Option>
            )
        })
    }
    const renderRoomType = (data: NumberOfRooms[]) => {
        const valRoomType = getValues("roomType");
        return data.map(item => {
            if(valRoomType === roomTypePMId){
                return (
                    <Option disabled value={item.id} key={item.id}>{item.name}</Option>
                )
            }else{
                return (
                    <Option disabled={item.id !== roomTypePMId ? false : true} value={item.id} key={item.id}>{item.name}</Option>
                )
            }
        })
    }
    const renderRoomName = (data: any) => {
        return data.map((item: any, index: number) => {
            if(item.guid === roomNameGuid){
                return (
                    <Option value={item.guid} key={index}>{item.so} - Current</Option>
                )
            }else{
                const hasRoom = listHasRoom.find(x => x === item.guid);
                return (
                    <Option disabled={hasRoom ? true : false} value={item.guid} key={index}>{hasRoom ? `${item.so} - use has room` : item.so}</Option>
                )
            }
        })
    }
    const traceChange = (actionCode: number, oldValue: string, newValue: string) => {
        dispatch(setTraceInHouse({
            actionCode : actionCode,
            objectId: dataEditRsvn?.dataFotransactRoomDTO.id ?? 0,
            oldString: oldValue,
            newString: newValue,
            oldDate: new Date(dataEditRsvn?.dataFotransactRoomDTO.arrivalDate ?? "") ?? new Date(),
            newDate: new Date(),
            hotelGuid: hotelId
        }))
    }
    
    return (
        <ClassBox className={clsx(props.className)} key={"scchedule-key"}>
            <div className="col-span-4">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.room")} #
                </label>
                <Controller
                    render={({ onChange, value }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                handleEditRoomNumber(e, value, option.children, onChange)
                            }}
                            disabled={!isMain}
                            value={value === GLobalPkm.defaultBytes32 ? "" : value }
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {roomListType && roomListType?.length > 0 ? renderRoomName(roomListType[0].rooms) : ""}
                        </Select>
                    }
                    name="room" control={control} defaultValue={roomNameGuid} />
                
            </div>
            <div className="col-span-4">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.roomType")} :
                </label>
                <Controller
                    render={({ onChange, value }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                handleEditRoomType(e, value, option.children, onChange)
                            }}
                            disabled={!isMain}
                            value={value}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {numberOfRooms ? renderRoomType(numberOfRooms) : ""}
                        </Select>
                    }
                    name="roomType" control={control} defaultValue="" />
            </div>
            <div className="col-span-4">
                <label className="font-base font-bold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.upgradeForm")}:</label>
                <Controller render={({ onChange, value }) =>
                    <Select
                        showSearch
                        onChange={(e, option: any) => {
                            onChange(e)
                            traceChange(TypeActionCode.UpgradeRoom, value, option.children)
                        }}
                        filterOption={(input: any, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        className={`${classes.selectBackground} w-full !rounded-md`}
                        placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}>
                        <Option value=""> </Option>
                        {numberOfRooms ? renderRoomType(numberOfRooms) : ""}
                    </Select>
                }
                name="roomTypeUgr" control={control} defaultValue={""} />
            </div>
            <div className="col-span-4">
                <label className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.arrival")}</label>
                <Controller
                    name="arrivalDate"
                    render={({ onChange, value }) =>
                        <DatePicker
                            disabledDate={(valueDate: any) => {
                                return disableDate(valueDate, true)
                            }}
                            onChange={(date) => {
                                onChange(date)
                                onSetArrivalDateChange(date)
                                traceChange(TypeActionCode.ChangeArrival, Utils.formatDateCallApi(new Date(value)), Utils.formatDateCallApi(date ?? new Date()))
                            }}
                            value={value ? new Date(value) : new Date()}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            disabled={inHouse}
                            name="arrivalDate"
                        />}
                    control={control} defaultValue={""} />
            </div>
            <div className="col-span-4">
                <label className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.departure")}:</label>
                <Controller  
                    name="departureDate" 
                    render={({ onChange, value }) => 
                        <DatePicker
                            // disabledDate={(valueDate: any) => {
                            //     return disableDate(valueDate)
                            // }}
                            onChange={(date) => {
                                handleEditDay(getValues("arrivalDate"), date ?? new Date(), false, onChange)
                                // onChange(value)
                                // onSetDepartureDateChange(value)
                                // traceChange(TypeActionCode.ChangeDeparture, Utils.formatDateCallApi(new Date(value)), Utils.formatDateCallApi(new Date(date ?? "")))
                                
                            }} 
                            value={value ? new Date(value) : new Date()}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            name="departureDate"
                        />}
                    control={control} defaultValue={""}
                />
            </div>

            <div className="col-span-2">
                <label className="font-base font-bold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.nights")}:</label>
                <Controller 
                    render={({ onChange, value }) => 
                        <Input
                            type="number"
                            value={value}
                            min={1}
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }}
                            onChange={(value) => { 
                                onChange(value)
                                onSetDay(value) 
                            }}
                            required />
                    }
                    name="nights" defaultValue={1} control={control}  />
            </div>

            <div className="col-span-2">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.cod")}:
                </label>
                <Controller render={({ onChange, value }) =>
                    <Input
                        className={`${classes.input}`}
                        defaultValue={0}
                        min={0}
                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                        value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                name="cod" defaultValue={0} control={control} />
            </div>
            <div className="2xl:col-span-2 xl:col-span-4 col-span-2">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.rateCode")}:
                </label>
                <Controller
                    render={({ onChange, value }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                onChange(e)
                                const oldRateCode = data.rateCodes.find((x: any) => x.guid === value);
                                traceChange(TypeActionCode.ChangeRateCode, oldRateCode ? oldRateCode.ten : "", option.children)
                            }}
                            value={value}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.rateCodes) : ""}
                        </Select>
                    }
                    name="rateCode" control={control} defaultValue={""} />
            </div>
            <div className="2xl:col-span-2 xl:col-span-4 col-span-2">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.rateRef")}:
                </label>
                <Controller 
                    render={({ onChange, value }) =>
                        <InputNumber
                            min={0}
                            className={`${classesTmp.inputNumber} hiden-handler-wrap`}
                            style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                            value={value}
                            formatter={e => `${Utils.formatNumber(e)}`}
                            onChange={(e) => { 
                                onChange(e)
                                traceChange(TypeActionCode.ChangeRateRef, `${Utils.formatNumber(value)}`, `${Utils.formatNumber(e)}`)
                            }}
                        >
                        </InputNumber>}
                    name="rateRef" defaultValue={""} control={control} />
            </div>
            <div className="2xl:col-span-2 xl:col-span-4 col-span-2">
                <label className="m-0 font-base font-bold flex flex-row">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.rate")}: <CIconSvg name="arrow-up-right" hexColor="#F74352" svgSize="small" />
                </label>
                <Controller render={({ onChange, value }) =>
                    <InputNumber
                        min={0}
                        className={`${classesTmp.inputNumber} hiden-handler-wrap`}
                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                        value={value} 
                        formatter={e => Utils.formatNumber(e)}
                        onChange={(e) => { 
                            onChange(e)
                            setRate(e)
                            traceChange(TypeActionCode.ChangeRate, `${Utils.formatNumber(value)}`, `${Utils.formatNumber(e)}`);
                        }}
                    >
                    </InputNumber>
                }
                name="rate" defaultValue={0} control={control} />
                    
            </div>
            <div className="2xl:col-span-2 xl:col-span-4  col-span-2">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.deposit")}:
                </label>
                <Controller render={({ onChange, value }) =>
                    <InputNumber
                        min={0}
                        className={`${classesTmp.inputNumber} hiden-handler-wrap`}
                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                        value={value} 
                        formatter={e => Utils.formatNumber(e)}
                        onChange={(e) => { 
                            onChange(e)
                            traceChange(TypeActionCode.ChangeDeposit, `${Utils.formatNumber(value)}`, `${Utils.formatNumber(e)}`);
                        }}
                    >
                    </InputNumber>}
                name="deposit" defaultValue={0} control={control} />
            </div>
            <div className="2xl:col-span-2 xl:col-span-4 col-span-2">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.adultOrChild")}:
                </label>
                <Select 
                    className={`${classes.selectBackground} w-full !rounded-md`} 
                    placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                    value={valueAdultAndChilds}
                    onChange={(e) => {
                        if(e === 0){
                            setValue('adults', 1)
                            setValue('childs', 0)
                        }else if(e === 1){
                            setValue('adults', 0)
                            setValue('childs', 1)
                        }else{
                            setValue('adults', 0)
                            setValue('childs', 0)
                        }
                        setValueAdultAndChilds(e)
                    }}
                >
                    <Option value={-1}> </Option>
                    <Option value={0}>Adult</Option>
                    <Option value={1}>Child</Option>
                </Select>
                <Controller render={({ onChange, value }) =>
                    <Input
                        style={{ display: 'none'}}
                        value={value} onChange={(e) => { 
                            onChange(e.target.valueAsNumber) 
                            traceChange(TypeActionCode.ChangeAdult, value, e.target.valueAsNumber.toString());
                        }} >
                    </Input>}
                name="adults" defaultValue={""} control={control} />
                <Controller render={({ onChange, value }) =>
                    <Input
                        style={{ display: 'none'}}
                        value={value} onChange={(e) => { 
                            onChange(e.target.valueAsNumber) 
                            traceChange(TypeActionCode.ChangeAdult, value, e.target.valueAsNumber.toString());
                        }} >
                    </Input>}
                name="childs" defaultValue={""} control={control} />
            </div>
            <div className="2xl:col-span-1 xl:col-span-2 col-span-1">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.adults")}:
                </label>
                <Input
                    //disabled
                    className={`${classes.input} text-center`}
                    value={dataEditRsvn?.adults ?? 0}
                    type="number" style={{ background: "#F5F6F7", height: 40 }}
                />
            </div>
            <div className="2xl:col-span-1 xl:col-span-2 col-span-1">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.childs")}:
                </label>
                <Input
                    //disabled
                    className={`${classes.input} text-center`}
                    value={dataEditRsvn?.childs ?? 0}
                    type="number" style={{ background: "#F5F6F7", height: 40 }}
                />
            </div>
            <div className="col-span-12">
                <div className={`${classes.input} grid grid-cols-4 p-3 gap-y-2`} style={{ alignItems: 'center' }}>
                    <div className="2xl:col-span-3 xl:col-span-4 col-span-3">
                        <Controller render={(
                            { onChange, value}) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                    traceChange(TypeActionCode.SetFixedRate, value, e.target.checked.toString());
                                }}>
                                Fixed rate
                            </Checkbox>
                        )}
                        name="fixedRate" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, value}) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                    traceChange(TypeActionCode.SetNoPost, value, e.target.checked.toString());
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.noPost")}
                            </Checkbox>
                        )}
                        name="noPost" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, value }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                    traceChange(TypeActionCode.SetPrintRate, value, e.target.checked.toString());
                                }}>
                                Print rate
                            </Checkbox>
                        )}
                        name="printRate" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, value}) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.bkf")}
                            </Checkbox>
                        )}
                        name="isNoBkf" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, value}) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                    traceChange(TypeActionCode.SetHouseUse, value, e.target.checked.toString());
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.hsu")}
                            </Checkbox>
                        )}
                        name="houseUse" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, value}) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                    traceChange(TypeActionCode.SetComplimentary, value, e.target.checked.toString());
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.comp")}
                            </Checkbox>
                        )}
                        name="comp" defaultValue={true} control={control} />
                    </div>
                    <div className="2xl:col-span-1 xl:col-span-3 col-span-1">
                        <Controller render={(
                            { onChange, value }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                    traceChange(TypeActionCode.SetIsNet, value, e.target.checked.toString());
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.net")}
                            </Checkbox>
                        )}
                        name="isNet" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, value}) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                checked={value}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.upsell")}
                            </Checkbox>
                        )}
                        name="Upsell" defaultValue={true} control={control} />
                    </div>
                </div>
            </div>
            <div className="2xl:col-span-8 xl:col-span-7 col-span-8 grid-cols-12 grid gap-2">
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.package")}:
                    </label>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackgroundTest} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                showSearch
                                value={value || undefined}
                                onChange={(e, option: any) => {
                                    const getPackage = data.packages.find((x: any) => x.guid === value);
                                    onChange(e)
                                    traceChange(TypeActionCode.ChangePackages, getPackage ? getPackage.ten : "", option.children);
                                }}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {data ? renderSelect(data.packages) : ""}
                            </Select>
                        }
                        name="packageCodes" control={control} defaultValue="" />
                </div>
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.specials")}:
                    </label>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackgroundTest} w-full !rounded-md`}
                                placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                mode="multiple"
                                showSearch
                                value={value || undefined}
                                onChange={(e, option: any) => {
                                    onChange(e)
                                    let oldValue = "";
                                    if(value.length > 0){
                                        oldValue = data.specials.map((item: any) => {
                                            if(item.guid === value){
                                                return item.ten
                                            }
                                            return null;
                                        }).join(",")
                                    }
                                    const newValue = option.map((item: any) => item.children).join(",");
                                    traceChange(TypeActionCode.ChangeSpecials,oldValue, newValue);
                                }}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {data ? renderSelect(data.specials) : ""}
                            </Select>
                        }
                        name="specialsCodes" control={control} defaultValue="" />
                </div>
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.ciTime")}:
                    </label>
                    <Controller render={({ onChange, value }) =>
                        <DatePicker 
                            disabled={!inHouse}
                            clearIcon={false}
                            showTime
                            value={value ? new Date(value) : null}
                            onChange={(date) => {
                                onChange(date)
                                traceChange(TypeActionCode.ChangeCheckInTime, Utils.formatDateTimeCallApi(new Date(value)), Utils.formatDateTimeCallApi(date ? new Date(date) : new Date()))
                            }}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                        />
                    }
                    name="ciTime" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.coTime")}:
                    </label>
                    <Controller render={({ onChange, value }) =>
                        <DatePicker 
                            disabled={!inHouse}
                            clearIcon={false}
                            showTime
                            value={value ? new Date(value) : null}
                            onChange={(date) => {
                                onChange(date)
                                traceChange(TypeActionCode.ChangeCheckOutTime, Utils.formatDateTimeCallApi(new Date(value)), Utils.formatDateTimeCallApi(date ? new Date(date) : new Date()))
                            }}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                        />
                    }
                    name="coTime" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <Input style={{ background: "#F5F6F7" }} className={`${classes.charge}`} 
                        addonBefore={<div className="w-full h-full flex items-center" onClick={() => setVisibleMPickup(true)}>{t("BOOKING.RESERVATION.EDITRESERVATION.pickup")}</div>}  
                        defaultValue="" 
                        placeholder="Car pickup info here" 
                    />
                </div>
                <div className="col-span-6">
                    <Input style={{ background: "#F5F6F7" }} className={`${classes.charge}`} 
                        addonBefore={<div className="w-full h-full flex items-center" onClick={() => setVisibleMFlight(true)}>{t("BOOKING.RESERVATION.EDITRESERVATION.flight")}</div>}
                        defaultValue="" placeholder="Flight info here" 
                    />
                </div>
            </div>
            <div className="2xl:col-span-4 xl:col-span-5 col-span-4" style={{ position: 'relative', padding: "0px 2px" }}>
                <div className={`${classes.styleCircleLeft}`}></div>
                <div className={`${classes.styleCircleRight}`}></div>
                <div className={`${classes.stypeFixCharge}`} style={{ padding: "2px 5px" }}>
                    <div className={`${classes.stypeFixChargeInfo} grid-cols-12 grid gap-1`} style={{ paddingTop: "5px" }}>
                        <div className="col-span-6">
                            <p className="m-0 font-base" style={{ color: "F5F6F7" }}>{t("BOOKING.RESERVATION.EDITRESERVATION.roomRevenue")}:</p>
                        </div>
                        <div className="col-span-6 flex justify-end">
                            <p className={`${classes.title} m-0 font-base font-bold`}>{Utils.formatNumber((rate === -1 ? (dataEditRsvn?.dataFotransactRoomDTO.rate ?? 0) : rate))}</p>
                        </div>
                        <div className="col-span-12">
                            <span className="m-0 font-base" style={{ color: "F5F6F7" }}>{t("BOOKING.RESERVATION.EDITRESERVATION.fixCharge")}:</span>
                            <Button type="primary" className={`!rounded-md ${classes.buttonStyle} ml-1`} onClick={() => setVisibleMFix(true)}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.clickHere")}
                            </Button>
                        </div>
                    </div>
                    <div className={`${classes.stypeFixChargeTotal} grid-cols-12 grid gap-1 items-center`}>
                        <div className="col-span-6">
                            <p className={`${classes.title} m-0 font-base font-bold`}>{t("BOOKING.RESERVATION.EDITRESERVATION.totalAmount")}:</p>
                        </div>
                        <div className="col-span-6 flex justify-end">
                            <p className={`${classes.title} m-0 font-base font-bold`} style={{ color: "#FF9800" }}>
                                {Utils.formatNumber((rate === -1 ? (dataEditRsvn?.dataFotransactRoomDTO.rate ?? 0) : rate) + totalFixCharge)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-12 border-dashed border-t"></div>
            <div className="col-span-8 grid-cols-12 grid gap-2">
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.bookerName")}:
                    </label>
                    <Controller render={({ onChange, value }) =>
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }}
                            value={value} onChange={(e) => { 
                                onChange(e.target.value) 
                                traceChange(TypeActionCode.ChangeResBookBy, value, e.target.value)
                            }} >
                        </Input>}
                    name="bookedBy" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.bookerPhone")}:
                    </label>
                    <Controller render={({ onChange, value }) =>
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }} 
                            value={value}
                            onChange={(e) => { 
                                onChange(e.target.value)
                                traceChange(TypeActionCode.ChangeResBookTel, value, e.target.value) 
                            }} >
                        </Input>}
                    name="bookByPhone" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.bookerEmail")}:
                    </label>
                    <Controller render={({ onChange, value }) =>
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }} 
                            value={value}
                            onChange={(e) => { 
                                onChange(e.target.value) 
                                traceChange(TypeActionCode.ChangeResBookEmail, value, e.target.value)
                            }} >
                        </Input>}
                    name="bookByEmail" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.bookerFax")}:
                    </label>
                    <Controller render={({ onChange, value }) =>
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }}
                            value={value} onChange={(e) => { 
                                onChange(e.target.value) 
                            }
                            } >
                        </Input>}
                    name="bookByFax" defaultValue={""} control={control} />
                </div>
            </div>
            <div className="col-span-4">
                <p className={`${classes.title} m-0 font-base font-bold`}>{t("BOOKING.RESERVATION.EDITRESERVATION.guestHistory")}</p>
                <p className={`m-0 font-base`}>{t("BOOKING.RESERVATION.EDITRESERVATION.stays")}: <b className={`${classes.title} m-0 font-base font-bold`}>{dataHistory?.stay ?? 0}</b></p>
                <p className={`m-0 font-base`}>{t("BOOKING.RESERVATION.EDITRESERVATION.lastRoom")}: <b className={`${classes.title} m-0 font-base font-bold`}>{dataHistory?.lastRoom ?? "0"}</b></p>
                <p className={`m-0 font-base`}>{t("BOOKING.RESERVATION.EDITRESERVATION.roomRate")}: <b className={`${classes.title} m-0 font-base font-bold`}>{Utils.formatNumber(dataHistory?.roomRate ?? 0) ?? "0"}</b></p>
                <p className={`m-0 font-base`}>{t("BOOKING.RESERVATION.EDITRESERVATION.roomRevenue")}: <b className={`${classes.title} m-0 font-base font-bold`}>{Utils.formatNumber(dataHistory?.roomRevenue ?? 0) ?? "0"}</b></p>
                <p className={`m-0 font-base`}>{t("BOOKING.RESERVATION.EDITRESERVATION.totalRevenue")}: <b className={`${classes.title} m-0 font-base font-bold`}>{Utils.formatNumber(dataHistory?.totalRevenue ?? 0) ?? "0"}</b></p>
            </div>
            {isVisibleMFix 
                ? 
                <CFixCharge 
                    isMain={isMain}
                    visible={isVisibleMFix} setVisibleMFix={setVisibleMFix} isEdit={isEdit} />
                : "" 
            }
            <ModelSpecials visible={isVisibleMSpecials} setVisibleMSpecials={setVisibleMSpecials} />
            <CModalPickUp key={`md-02`}
                visible={isVisibleMPickup} setVisible={setVisibleMPickup}
            />
            <CModalFlightInfo key={`md-03`}
                visible={isVisibleMFlight} setVisible={setVisibleMFlight}
            />
        </ClassBox >
    );
};

export default React.memo(CGuestScheduleEdit);