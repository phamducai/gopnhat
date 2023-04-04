/* eslint-disable*/
import React, { useState, useEffect } from 'react'
import ClassBox from 'components/CClassBox'
import { Input, Select, Button,Checkbox,Modal, InputNumber } from "antd";
import { Controller } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import clsx from 'clsx';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import CFixCharge from 'components/CModalFixCharge';
import CIconSvg from 'components/CIconSvg';
import { styleInput } from 'pages/main/booking/reservation/editReservation/styles/guestScheduleEdit.style';
import CModalPickUp from 'components/CModalPickUp';
import CModalFlightInfo from 'components/CModalFlightInfo';
import { setDateRsvn } from 'redux/controller/reservation.slice';
import { addDays} from 'date-fns';
import { useTranslation } from 'react-i18next';
import Utils from 'common/utils';
import { TrRoomHistory } from 'common/model-rsvn';
import { useLocation } from 'react-router';
import { RoomsInARoomType } from 'common/model-inventory';
import BreakSharedService from 'services/search/breadshared.service';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import GLobalPkm from 'common/global';
import DatePicker from 'components/CDatePicker';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
const { Option } = Select;

interface ICGuestProfile extends Props {
    setIsPrintRateByCompany?: any,
    isFit?: boolean,
    control?: any,
    data?: any,
    filteredCompanyProfile: any,
    setSelectValueSource?: any,
    valueSource?: any,
    getGuestProfileByRsvnId?: any,
    getValues: any,
    setValue: any,
    isEdit: boolean,
    dataHistory: TrRoomHistory | null,
    roomListType: RoomsInARoomType[] | null,
    roomTypeGuid: string,
    roomNameGuid: string,
    setRoomListType: any,
    isMainGuest: boolean
}
const CGuestScheduleCheckIn = ({ getGuestProfileByRsvnId, control, data,filteredCompanyProfile, getValues, setValue, ...props }: ICGuestProfile): JSX.Element => {
    const classes = useStyleTheme(styleInput);
    const location = useLocation();
    //const getQuery = location.search.split("=")[1];
    const classesTmp = useStyleTheme(styleCorrection);
    const { isEdit, dataHistory, roomListType, roomTypeGuid, roomNameGuid,setRoomListType, isMainGuest } = props;
    const [isVisibleMFix,setVisibleMFix] = useState<boolean>(false);
    //const [isVisibleMSpecials,setVisibleMSpecials] = useState<boolean>(false);
    const [isVisibleMPickup,setVisibleMPickup] = useState<boolean>(false);
    const [isVisibleMFlight,setVisibleMFlight] = useState<boolean>(false);
    const [nights,setNights] = useState<number>(0);
    const { hotelId} = useSelectorRoot(state => state.app);
    const { totalFixCharge } = useSelectorRoot(state => state.rsvn);
    const { numberOfRooms } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const dispatch = useDispatchRoot();
    const { t } = useTranslation("translation")

    useEffect(() => {// save date using modal pickup, fixcharge and flight
        if (nights > 0) {
            const departureDate = new Date(getValues("departureDate"));
            const arrivalDate = new Date(getValues("arrivalDate"));
            dispatch(setDateRsvn({ arrivalDate, departureDate, newNumberNight: nights, defineNight: nights }))
        }
    }, [nights, roomListType])
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.guid}>{item.ten}</Option>
            )
        })
    }
    const renderRoomType = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.id} key={item.id}>{item.name}</Option>
            )
        })
    }
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
    const checkAvailableRoomType = async (newRoomType: string, odlRoomType: string) => {
        const arrivale = new Date(getValues("arrivalDate"));
        const departureDate = new Date(getValues("departureDate"));
        const aConvert = Utils.formatDateCallApi(arrivale);
        const dConver = Utils.formatDateCallApi(departureDate);
        if(newRoomType !== roomTypeGuid){
            const res = await BreakSharedService.checkAvailableRoomType([newRoomType], aConvert, dConver, numberOfRooms);
            if(!res && newRoomType !== roomTypeGuid){
                setValue("roomType",odlRoomType);
                Modal.warning({
                    title: "This room type is sold out",
                    content: '',
                    async onOk () {}
                });
            }else{
                const rresRoom = await RoomPlanService.getListRoomsByRoomType(hotelId, [newRoomType]);
                if(roomNameGuid !== GLobalPkm.defaultBytes32 && roomNameGuid != ""){
                    setRoomListType(rresRoom);
                }else{
                    setRoomListType([]);
                }
                setValue("room",GLobalPkm.defaultBytes32);
            }
        }
    }
    const checkAvailableRoomNumber = async (newRoomNumber: string, oldRoomNumber: string) => {
        const arrivale = new Date(getValues("arrivalDate"));
        const aConvert = Utils.formatDateCallApi(arrivale);
        if(newRoomNumber !== roomNameGuid){
            const res = await BreakSharedService.checkRoomHasGuest(hotelId, [newRoomNumber], aConvert);
            if(res !== null && newRoomNumber !== roomNameGuid){
                setValue("room",oldRoomNumber);
                Modal.warning({
                    title: "This room name is sold out",
                    content: '',
                    async onOk () {}
                });
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
    const renderRoomName = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.guid}>{item.so}</Option>
            )
        })
    }
    return (
        <ClassBox className={clsx(props.className)} key={"scchedule-key"}>
            <div className="col-span-4">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.room")} #
                </label>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                                checkAvailableRoomNumber(e, value)
                            }}
                            disabled={!isMainGuest}
                            value={value === GLobalPkm.defaultBytes32 ? undefined : value }
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {roomListType && roomListType?.length > 0 ? renderRoomName(roomListType[0].rooms) : ""}
                        </Select>
                    }
                    name="room" control={control} defaultValue={""} />
                
            </div>
            <div className="col-span-4">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.roomType")} :
                </label>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                                checkAvailableRoomType(e, value)
                            }}
                            disabled={!isMainGuest}
                            value={getValues("roomType")}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {numberOfRooms ? renderRoomType(numberOfRooms) : ""}
                        </Select>
                    }
                    name="roomType" control={control} defaultValue="" />
            </div>
            <div className="col-span-4">
                <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.upgradeForm")}:</p>
                <Controller render={({ onChange, value, ref }) =>
                    <Select
                        showSearch
                        onChange={(e) => {
                            onChange(e)
                        }}
                        disabled={!isMainGuest}
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
                            }}
                            value={getValues("arrivalDate") ? new Date(getValues("arrivalDate")) : new Date()}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
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
                            disabledDate={(valueDate: any) => {
                                return disableDate(valueDate)
                            }}
                            onChange={(date) => {
                                onChange(date)
                                onSetDepartureDateChange(date)
                            }} 
                            value={getValues("departureDate") ? new Date(getValues("departureDate")) : new Date()}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            name="departureDate"
                        />}
                    control={control} defaultValue={""}
                />
            </div>

            <div className="col-span-2">
                <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.nights")}:</p>
                <Controller 
                    render={({ onChange, value }) => 
                    <Input
                        type="number"
                        value={getValues("nights")}
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
                        min={0}
                        defaultValue={0}
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
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                            }}
                            disabled={!isMainGuest}
                            value={getValues("rateCode")}
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
                <Controller render={({ onChange, value }) =>
                    <Input
                        disabled={isMainGuest}
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                        value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="rateRef" defaultValue={""} control={control} />
            </div>
            <div className="2xl:col-span-2 xl:col-span-4 col-span-2">
                <span className="m-0 font-base font-bold flex flex-row">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.rate")}: <CIconSvg name="arrow-up-right" hexColor="#F74352" svgSize="small" />
                </span>
                <Controller render={({ onChange, value }) =>
                    <InputNumber
                        min={0}
                        className={`${classesTmp.inputNumber} hiden-handler-wrap`}
                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                        value={value} 
                        formatter={e => `${Utils.formatNumber(e)}`}
                        onChange={(e) => { 
                            onChange(e)
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
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                        value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="deposit" defaultValue={""} control={control} />
            </div>
            <div className="2xl:col-span-2 xl:col-span-4 col-span-2">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.adultOrChild")}:
                </label>
                <Controller render={({ onChange, value }) =>
                    <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                        showSearch
                        onChange={(e) => {
                            onChange(e)
                        }}
                        filterOption={(input: any, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option value=""> </Option>
                        {data ? renderSelect(data.rateCodes) : ""}
                    </Select>}
                    name="adultChild" defaultValue={""} control={control} />
            </div>
            <div className="2xl:col-span-1 xl:col-span-2 col-span-1">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.adults")}:
                </label>
                <Controller render={({ onChange, value }) =>
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                        value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="adults" defaultValue={""} control={control} />
            </div>
            <div className="2xl:col-span-1 xl:col-span-2 col-span-1">
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.childs")}:
                </label>
                <Controller render={({ onChange, value }) =>
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                        value={getValues('childs')} onChange={(e) => onChange(e.target.valueAsNumber)} >
                    </Input>}
                    name="childs" defaultValue={""} control={control} />
            </div>
            <div className="col-span-12">
                <div className={`${classes.input} grid grid-cols-4 p-3 gap-y-2`} style={{ alignItems: 'center' }}>
                    <div className="2xl:col-span-3 xl:col-span-4 col-span-3">
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={true}
                                disabled={!isMainGuest}
                                checked={getValues("fixedRate")}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                Fixed rate
                            </Checkbox>
                        )}
                            name="fixedRate" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={true}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.noPost")}
                            </Checkbox>
                        )}
                            name="noPost" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={false}
                                disabled={!isMainGuest}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                Print rate
                            </Checkbox>
                        )}
                            name="printRate" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={false}
                                checked={getValues("isNoBkf")}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.bkf")}
                            </Checkbox>
                        )}
                            name="isNoBkf" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={true}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.hsu")}
                            </Checkbox>
                        )}
                            name="houseUse" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={false}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.comp")}
                            </Checkbox>
                        )}
                            name="comp" defaultValue={true} control={control} />
                    </div>
                    <div className="2xl:col-span-1 xl:col-span-3 col-span-1">
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={false}
                                checked={getValues("isNet")}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                {t("BOOKING.RESERVATION.EDITRESERVATION.net")}
                            </Checkbox>
                        )}
                            name="isNet" defaultValue={true} control={control} />
                        <Controller render={(
                            { onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={false}
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
                            <Select 
                                className={`${classes.selectBackgroundTest} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                showSearch
                                value={value}
                                onChange={(e) => {
                                    onChange(e)
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
                                onChange={(e) => {
                                    onChange(e)
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
                        <Input
                            className={`${classes.input}`}
                            type="text" style={{ background: "#F5F6F7", height: 40 }}
                            value={getValues("ciTime")} onChange={(e) => { onChange(e.target.value) }} >
                        </Input>}
                        name="ciTime" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.coTime")}:
                    </label>
                    <Controller render={({ onChange, value }) =>
                        <Input
                            className={`${classes.input}`}
                            type="text" style={{ background: "#F5F6F7", height: 40 }}
                            value={getValues("coTime")} onChange={(e) => { onChange(e.target.value) }} >
                        </Input>}
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
                            <p className={`${classes.title} m-0 font-base font-bold`}>{Utils.formatNumber(parseInt(getValues("rate")))}</p>
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
                                {Utils.formatNumber(parseInt(getValues('rate')) + totalFixCharge)}
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
                            value={getValues("bookedBy")} onChange={(e) => { onChange(e.target.value) }} >
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
                            value={getValues("bookByPhone")}
                            onChange={(e) => { onChange(e.target.value) }} >
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
                            value={getValues("bookByEmail")}
                            onChange={(e) => { onChange(e.target.value) }} >
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
                            value={getValues("bookByFax")} onChange={(e) => { onChange(e.target.value) }} >
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
                    isMain={isMainGuest}
                    visible={isVisibleMFix} setVisibleMFix={setVisibleMFix} isEdit={isEdit} />
                : "" 
            }
            <CModalPickUp key={`md-02`}
                visible={isVisibleMPickup} setVisible={setVisibleMPickup}
            />
            <CModalFlightInfo key={`md-03`}
                visible={isVisibleMFlight} setVisible={setVisibleMFlight}
            />
        </ClassBox >
    );
};

export default React.memo(CGuestScheduleCheckIn);