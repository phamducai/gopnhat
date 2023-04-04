/* eslint-disable*/
import ClassBox from 'components/CClassBox'
import React, { useState } from 'react'
import { Input, Select, Button,Checkbox, InputNumber } from "antd";
import { Controller } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import clsx from 'clsx';
import { useSelectorRoot } from 'redux/store';
import CFixCharge from 'components/CModalFixCharge';
import ModelSpecials from 'components/CModelSpecials';
import CIconSvg from 'components/CIconSvg';
import moment from 'moment';
import { styleInput } from './style/guestScheduleWalkin.style';
import { HotelConfigInfo } from 'common/shared/hotelconfig.model';
import DatePicker from 'components/CDatePicker';
import { useEffect } from 'react';
import Utils from 'common/utils';
import { RoomInfo, RoomType } from 'common/model-inventory';
import InventoryApi from 'api/inv/inv.api';
import WalkInService from 'services/frontdesk/walk-in/walkin.services';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import GLobalPkm from 'common/global';

const { Option } = Select;

export enum DirectFrom{
    RoomPlan = 1,
    ShortcutFrontDesk = 2
}

interface ICGuestProfile extends Props {
    setIsPrintRateByCompany?: any,
    isFit?: boolean,
    control?: any,
    data?: HotelConfigInfo,
    filteredCompanyProfile: any,
    setSelectValueSource?: any,
    valueSource?: any,
    getGuestProfileByRsvnId?: any,
    getValues: any,
    setValue: any,
    directFrom: DirectFrom
}
const CGuestScheduleWalkIn = ({ getGuestProfileByRsvnId, control, data,filteredCompanyProfile, getValues, setValue, directFrom, ...props }: ICGuestProfile): JSX.Element => {
    const classes = useStyleTheme(styleInput);
    const [isVisibleMFix,setVisibleMFix] = useState<boolean>(false);
    const [isVisibleMSpecials,setVisibleMSpecials] = useState<boolean>(false);
    const { roomType } = useSelectorRoot(state => state.booking);
    const { lstEmptyRooms } = useSelectorRoot(state => state.roomPlan);
    const [ availableRoom, setAvailableRoom] = useState<RoomInfo[]>([]);
    const { hotelId } = useSelectorRoot(state => state.app);
    
    const renderSelect = (data: any, renderRoom: boolean = false) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.guid}>{renderRoom ? item.so : item.ten}</Option>
            )
        })
    }

    const renderRoomTypeSelect = (data: any, renderRoom: boolean = false) => {
        const tmp = [...data];
        tmp.unshift({
            guid: GLobalPkm.defaultBytes32,
            ten: 'None'
        })
        return tmp?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.guid}>{renderRoom ? item.so : item.ten}</Option>
            )
        })
    }

    useEffect(() => {
        //WalkInService.roomName = "";
        WalkInService.resetAvailableRooms();
        console.log(getValues('arrivalDate'));
        console.log(getValues('departureDate'));
        console.log(getValues('arrival'));
        updateAvailableRoom(getValues('roomType'), getValues('arrivalDate'), getValues('departureDate'));
    }, [])

    const updateAvailableRoom = async (roomType: string, arrival: Date, departure: Date) => {
        Utils.middayTime(departure);
        const res = await InventoryApi.getAvailableRooms(hotelId, roomType, arrival, departure);
        res && setAvailableRoom(res.sort((a, b) => Utils.compareString(a.so, b.so)));
        res && WalkInService.updateAvailableRooms(res);
    }

    const checkRoomIsAvailable = async (roomType: string, fromDate: Date, toDate: Date) => {
        Utils.middayTime(toDate);
        const res = await InventoryApi.getAvailableRooms(hotelId, roomType, fromDate, toDate);
        const indx = res?.findIndex(item => item.guid === getValues('roomGuid'));
        if(indx === -1){
            setValue('roomGuid', null);
            openNotification(NotificationStatus.Warning, `Room is not available`, `${lstEmptyRooms[0].roomNumber} is used from ${fromDate} to ${toDate}`)
            return false;
        }
        return true;
    }

    const onRoomTypeChange = async (roomTypeGuid: string) => {
        //console.log(roomTypeGuid)
        if(directFrom === DirectFrom.ShortcutFrontDesk){
            updateAvailableRoom(roomTypeGuid, getValues('arrival'), getValues('departureDate'));
            setValue('roomGuid', null);
        }
    }

    const calculateNights = async (newDeparture: Date) => {
        if(directFrom === DirectFrom.RoomPlan){
            if(!checkRoomIsAvailable(lstEmptyRooms[0].roomType, getValues('arrival'), newDeparture)) return;
        }
        setValue('nights', Utils.dateDiffInDays(getValues('arrivalDate'), newDeparture));
        setValue('departureDate', newDeparture);
        if(directFrom === DirectFrom.ShortcutFrontDesk){
            setValue('roomGuid', null);
        }
    }

    const onChangeArrivalDate = async (newArrival: Date) => {
        const newDate = new Date(newArrival);
        setValue('arrivalDate', newArrival)
        setValue('arrival', new Date(newArrival.getTime()))
        newDate.setDate(newArrival.getDate() + getValues('nights'));
        setValue('departureDate', newDate);
        if(directFrom === DirectFrom.RoomPlan){
            if(!checkRoomIsAvailable(lstEmptyRooms[0].roomType, newArrival, newDate)) return;
        }
        else{
            setValue('roomGuid', null);
            updateAvailableRoom(getValues('roomType'), getValues('arrival'), newDate);
        }
    }

    const onChangeNight = async (value: any) => {
        const nights = value?.target?.valueAsNumber ?? 0
        //nights = nights < 0 ? 0 : nights;
        const tmpArrivalDate = getValues('arrivalDate');
        if(!tmpArrivalDate) return;
        const newDate = new Date(tmpArrivalDate);
        newDate.setDate(tmpArrivalDate.getDate() + nights);
        if(directFrom === DirectFrom.RoomPlan){
            if(!checkRoomIsAvailable(lstEmptyRooms[0].roomType, getValues('arrival'), newDate)) return;
        }
        setValue('nights', nights);
        setValue('departureDate', newDate);
        if(directFrom === DirectFrom.ShortcutFrontDesk){
            setValue('roomGuid', null);
            const res = await InventoryApi.getAvailableRooms(hotelId, getValues('roomType'), getValues('arrivalDate'), getValues('departureDate'));
            res && setAvailableRoom(res.sort((a, b) => Utils.compareString(a.so, b.so)));
        }
    }

    const onChangeRoom = (roomGuid: string) => {
        const idx = availableRoom.findIndex(item => item.guid === roomGuid);
        idx !== -1 && setValue('roomType', availableRoom[idx].loai);
    }

    return (
        <ClassBox className={clsx(props.className)}>
            <div className="col-span-4 mb-1">
                <p className="m-0 font-base font-bold">
                    Room #
                </p>
                <Controller
                    // as={<Select className={` ${classes.selectBackground} w-full !rounded-md`} placeholder="Select here">
                    // {data ? renderSelect(data.paymentMethods) : ""}
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            value={getValues("roomGuid")}
                            onChange={(e) => {
                                onChange(e);
                                console.log(e);
                                onChangeRoom(e);
                            }}
                            defaultValue={directFrom === DirectFrom.RoomPlan ? lstEmptyRooms[0]?.roomGuid : availableRoom[0]?.guid}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {/* roomGuid: lstEmptyRooms[0].roomGuid,
                roomGuid: lstEmptyRooms[0].roomNumber.toString(), */}
                            {directFrom === DirectFrom.RoomPlan ? 
                                <Option value={lstEmptyRooms[0].roomGuid} key={lstEmptyRooms[0].roomGuid}>{lstEmptyRooms[0]?.roomNumber?.toString()}</Option>
                                : (availableRoom ? renderSelect(availableRoom, true) : "")
                            }
                        </Select>
                    }
                    name="roomGuid" control={control} defaultValue={directFrom === DirectFrom.RoomPlan ? lstEmptyRooms[0]?.roomGuid : availableRoom[0]?.guid}/>
            </div>
            <div className="col-span-4 mb-1">
                <p className="m-0 font-base font-bold">
                    Room Type :
                </p>
                <Controller
                    // as={
                    //     <Select className={` ${classes.selectBackground} w-full !rounded-md`} placeholder="Select here">
                    //         {/* {/ <Option value="Mr.">Mr.</Option> /} */}
                    //         {data ? renderSelect(dataRateCode === "" ? data.rateCodes : dataRateCode) : ""}
                    //     </Select>
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            value={getValues("roomType")}
                            onChange={(e) => {
                                onChange(e);
                                onRoomTypeChange(e);
                            }}
                            defaultValue={directFrom === DirectFrom.RoomPlan ? lstEmptyRooms[0]?.roomType : GLobalPkm.defaultBytes32}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {directFrom === DirectFrom.RoomPlan ? 
                                <Option value={lstEmptyRooms[0].roomType} key={lstEmptyRooms[0].roomType}>{lstEmptyRooms[0]?.roomName.toString()}</Option>
                                : (roomType ? renderRoomTypeSelect(roomType) : "")
                            }
                            {/* <Option value={roomTypeWalkIn ?? roomTypeWalkIn} key={roomTypeWalkIn}>{roomTypeNameWalkIn}</Option> */}
                            
                        </Select>
                    }
                    name="roomType" control={control} defaultValue={directFrom === DirectFrom.RoomPlan ? lstEmptyRooms[0]?.roomType : GLobalPkm.defaultBytes32}/>
            </div>
            <div className="col-span-4 mb-1">
                <p className="font-base font-bold m-0">Upgrade Form:</p>
                <Controller render={({ onChange, value, ref }) =>
                    <Select
                        showSearch
                        onChange={(e) => {
                            onChange(e)
                        }}
                        filterOption={(input: any, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        className={`${classes.selectBackground} w-full !rounded-md`}
                        placeholder="Select here">
                        <Option value=""> </Option>
                        {roomType ? renderSelect(roomType) : ""}
                    </Select>
                }
                    name="roomTypeUgr" control={control} defaultValue={""}  />
            </div>
            <div className="col-span-4 mb-1">
            <p className="m-0 font-base font-bold">Arrival</p>
                <Controller 
                    name="arrivalDate"
                    render={({ onChange, value }) =>
                        <DatePicker 
                            value={getValues("arrivalDate")}
                            defaultValue={moment(moment(), 'YYYY-MM-DD').toDate()}
                            clearIcon={false}
                            onChange={(date) => {
                                onChange(date)
                                date && onChangeArrivalDate(date);
                            }}
                            //value={arrivalDate}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            name="arrivalDate"
                        />}
                    control={control} defaultValue={moment(moment(), 'YYYY-MM-DD').toDate()}  />
            </div>
            <div className="col-span-4 mb-1">
                <p className="m-0 font-base font-bold">Departure:</p>
                <Controller 
                    render={({ onChange, value }) => 
                    <DatePicker
                        disabledDate={(date: Date) => date < getValues('arrivalDate')}
                        clearIcon={false}
                        defaultValue={moment(moment(), 'YYYY-MM-DD').add(1, 'd').toDate()}
                        value={getValues("departureDate")}
                        onChange={(date) => {
                            onChange(date)
                            date && calculateNights(date)
                        }}
                        //value={moment(getValues("departureDate"))}
                        className={`${classes.datePicker} w-full`}
                        style={{ background: "#F5F6F7" }} />}
                        name="departureDate" control={control}
                        defaultValue={moment(moment(), 'YYYY-MM-DD').add(1, 'd').toDate()}  //value={departureDate} 
                    />
            </div>
            
            <div className="col-span-2 mb-1">
                <p className="font-base font-bold m-0">Nights :</p>
                <Controller render={({ onChange, value }) => <Input
                    type="number"
                    className={`${classes.input}`}
                    style={{ background: "#F5F6F7", height: 40 }}
                    value={getValues("nights")}
                    min={0}
                    onChange={(num) => {
                        onChange(num)
                        onChangeNight(num)
                    }}
                    //onChange={(value) => { onChange(onSetDay(value)) }}
                    //defaultValue={nights} value={nights}
                    required />}
                    name="nights" defaultValue={1} control={control}  />
            </div>
            
            <div className="col-span-2">
                <p className="m-0 font-base font-bold">
                    COD:
                </p>
                <Controller render={({ onChange, value }) => 
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }} 
                        value={value} min={0} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="cod" defaultValue={0} control={control} />
            </div>
            <div className="col-span-2 mb-1">
                <p className="m-0 font-base font-bold">
                    Rate Code:
                </p>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                            }}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.rateCodes) : ""}
                        </Select>
                    }
                    name="rateCode" control={control} defaultValue={""}  />
            </div>
            <div className="col-span-2">
                <p className="m-0 font-base font-bold">
                    Rate Ref:
                </p>
                <Controller render={({ onChange, value }) => 
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }} 
                        value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="rateRef" defaultValue={""} control={control} />
            </div>
            <div className="col-span-2">
                <span className="m-0 font-base font-bold flex flex-row">
                    Rate: <CIconSvg name="arrow-up-right" hexColor="#F74352" svgSize="small" />
                </span>
                <Controller render={({ onChange, value }) => 
                    // <Input
                    //     className={`${classes.input}`}
                    //     type="number" style={{ background: "#F5F6F7", height: 40 }} 
                    //     value={value} min={0} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    // </Input>
                    <InputNumber
                        min={0}
                        className={`${classes.input}`}
                        defaultValue={2000000}
                        style={{ background: "#F5F6F7", height: 40, width: '100%' }} 
                        formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        onChange={onChange}
                        />
                    }
                    name="rate" defaultValue={2000000} control={control} />
            </div>
            <div className="col-span-2">
                <p className="m-0 font-base font-bold">
                    Deposit:
                </p>
                <Controller render={({ onChange, value }) => 
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }} 
                        value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="deposit" defaultValue={0} control={control} />
            </div>
            <div className="col-span-2">
                <p className="m-0 font-base font-bold">
                    Adult/Child:
                </p>
                <Controller render={({ onChange, value }) => 
                    <Select disabled={true} className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
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
            <div className="col-span-1">
                <p className="m-0 font-base font-bold">
                    Adult(s):
                </p>
                <Controller render={({ onChange, value }) => 
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }} 
                        value={value} min={1} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="adults" defaultValue={1} control={control} />
            </div>
            <div className="col-span-1">
                <p className="m-0 font-base font-bold">
                    Child(s):
                </p>
                <Controller render={({ onChange, value }) => 
                    <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }} 
                        value={value} min={0} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                    </Input>}
                    name="childs" defaultValue={0} control={control} />
            </div>
            <div className="col-span-12 mb-1">
                <div className={`${classes.input} ${classes.styleCheckbox} flex flex-row items-start`} style={{ height : "50px", alignItems : 'center', paddingLeft : 5, paddingRight : 5 }}>
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={true}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            Fixed rate
                        </Checkbox>
                    )}
                        name="fixedRate" defaultValue={true} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={true}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            No Post
                        </Checkbox>
                    )}
                        name="noPost" defaultValue={true} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={false}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            Print Rate
                        </Checkbox>
                    )}
                        name="printRate" defaultValue={false} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={false}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            BKF
                        </Checkbox>
                    )}
                        name="isNoBkf" defaultValue={false} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={false}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            HSU
                        </Checkbox>
                    )}
                        name="houseUse" defaultValue={false} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={false}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            Comp
                        </Checkbox>
                    )}
                        name="comp" defaultValue={false} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={false}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            Net
                        </Checkbox>
                    )}
                        name="isNet" defaultValue={false} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%" }}
                            //checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={false}
                            onChange={(e) => {
                                onChange(e.target.checked)
                               // setCheckedPrintRate(e.target.checked)
                            }}>
                            Upsell
                        </Checkbox>
                    )}
                        name="Upsell" defaultValue={false} control={control} />
                </div>
            </div>
            <div className="col-span-8 mb-1 grid-cols-12 grid gap-2">
                <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        Package:
                    </p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackgroundTest} w-full !rounded-md`} placeholder="Select here"
                                mode="multiple"
                                showSearch
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
                    <p className="font-base font-bold m-0">Specials:</p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select mode="multiple" className={`${classes.multiSelectBackground} w-full !rounded-md`} placeholder="Select here"
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                value={getValues('specialsCodes') || undefined}
                            >
                                {data ? renderSelect(data.specials) : ""}
                            </Select>
                        }
                        name="specialsCodes" control={control} defaultValue="" />
                </div>
                {/* <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        Specials:
                    </p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackgroundTest} w-full !rounded-md`} 
                                placeholder="Select here"
                                mode="multiple"    
                                showSearch
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                onClick={() => setVisibleMSpecials(true)}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {data ? renderSelect(data.specials) : ""}
                            </Select>
                        }
                        name="specialsCodes" control={control} defaultValue="" />
                </div> */}
                <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        C/I Time:
                    </p>
                    <Controller 
                    name="arrival"
                    render={({ onChange, value }) =>
                        <DatePicker 
                            disabledDate={(date: Date) => date < getValues('arrivalDate') || date > getValues('arrivalDate')}
                            defaultValue={moment(moment(), 'YYYY-MM-DD').toDate()}
                            clearIcon={false}
                            showTime
                            value={getValues("arrival")}
                            onChange={(date) => {
                                console.log(date)
                                onChange(date)
                                // date && onChangeArrivalDate(date);
                            }}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            name="arrival"
                        />}
                    control={control} defaultValue={moment(moment(), 'YYYY-MM-DD').toDate()}  />
                    {/* <Controller render={({ onChange, value }) => 
                        <Input
                            className={`${classes.input}`}
                            type="number" style={{ background: "#F5F6F7", height: 40 }} 
                            value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                        </Input>}
                        name="arrival" defaultValue={""} control={control} /> */}
                </div>
                <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        C/O Time:
                    </p>
                    <Controller 
                    name="departure"
                    render={({ onChange, value }) =>
                        <DatePicker 
                            defaultValue={moment(moment(), 'YYYY-MM-DD').toDate()}
                            allowClear
                            showTime
                            value={getValues("departure")}
                            onChange={(date) => {
                                console.log(date)
                                onChange(date)
                                // date && onChangeArrivalDate(date);
                            }}
                            //value={arrivalDate}
                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            name="departure"
                        />}
                    control={control} defaultValue={null}  />
                    {/* <Controller render={({ onChange, value }) => 
                        <Input
                            className={`${classes.input}`}
                            type="number" style={{ background: "#F5F6F7", height: 40 }} 
                            value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                        </Input>}
                        name="departure" defaultValue={""} control={control} /> */}
                </div>
                <div className="col-span-6">
                    <Input style={{ background: "#F5F6F7" }} className={`${classes.charge}`} addonBefore="Pickup" defaultValue="" placeholder="Car pickup info here" />
                </div>
                <div className="col-span-6">
                    <Input style={{ background: "#F5F6F7" }} className={`${classes.charge}`} addonBefore="Flight" defaultValue="" placeholder="Flight info here" />
                </div>
            </div>
            <div className="col-span-4" style={{ position : 'relative' , padding: "0px 2px" }}>
                <div className={`${classes.styleCircleLeft}`}></div>
                <div className={`${classes.styleCircleRight}`}></div>
                <div className={`${classes.stypeFixCharge}`} style={{ padding: "2px 5px" }}>
                    <div className={`${classes.stypeFixChargeInfo} grid-cols-12 grid gap-1`} style={{ paddingTop: "5px" }}>
                        <div className="col-span-6">
                            <p className="m-0 font-base" style={{color : "F5F6F7"}}>Room Reveneu:</p>
                        </div>
                        <div className="col-span-6 flex justify-end">
                            <p className={`${classes.title} m-0 font-base font-bold`}>24,812,910</p>
                        </div>
                        <div className="col-span-12">
                            <span className="m-0 font-base" style={{color : "F5F6F7"}}>Fix Charge:</span>
                            <Button type="primary" className={`!rounded-md ${classes.buttonStyle} ml-1`} onClick={() => setVisibleMFix(true)}>
                                Click here
                            </Button>
                        </div>
                    </div>
                    <div className={`${classes.stypeFixChargeTotal} grid-cols-12 grid gap-1 items-center`}>
                        <div className="col-span-6">
                            <p className={`${classes.title} m-0 font-base font-bold`}>Total amount:</p>
                        </div>
                        <div className="col-span-6 flex justify-end">
                            <p className={`${classes.title} m-0 font-base font-bold`} style={{ color: "#FF9800" }}>24,812,910</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-12 mb-1 border-dashed border-t"></div>
            {/* <div className="col-span-8 grid-cols-12 grid gap-2">
                <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        Booker Name:
                    </p>
                    <Controller render={({ onChange, value }) => 
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }} 
                            value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                        </Input>}
                        name="bookedBy" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        Booker Phone:
                    </p>
                    <Controller render={({ onChange, value }) => 
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }} 
                            value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                        </Input>}
                        name="bookByPhone" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        Booker Email:
                    </p>
                    <Controller render={({ onChange, value }) => 
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }} 
                            value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                        </Input>}
                        name="bookByEmail" defaultValue={""} control={control} />
                </div>
                <div className="col-span-6">
                    <p className="m-0 font-base font-bold">
                        Booker Fax:
                    </p>
                    <Controller render={({ onChange, value }) => 
                        <Input
                            className={`${classes.input}`}
                            style={{ background: "#F5F6F7", height: 40 }} 
                            value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} >
                        </Input>}
                        name="bookByFax" defaultValue={""} control={control} />
                </div>
            </div> */}
            <div className={`col-span-12 mb-1`}>
                <p className={`${classes.title} m-0 font-base font-bold`}>Guest History</p>
            </div>
            <div className={`col-span-4 mb-0.5`}>
                <p className={`m-0 font-base`}>Stays: <b className={`${classes.title} m-0 font-base font-bold`}>0</b></p>
            </div>
            <div className={`col-span-4`}>
                <p className={`m-0 font-base`}>Room Rate: <b className={`${classes.title} m-0 font-base font-bold`}>0</b></p>
            </div>
            <div className={`col-span-4`}>
                <p className={`m-0 font-base`}>Total Revenue: <b className={`${classes.title} m-0 font-base font-bold`}>0</b></p>
            </div>
            <div className={`col-span-4`}>
                <p className={`m-0 font-base`}>Last Room: <b className={`${classes.title} m-0 font-base font-bold`}>42.880.000</b></p>
            </div>
            <div className={`col-span-4`}>
                <p className={`m-0 font-base`}>Room Revenue: <b className={`${classes.title} m-0 font-base font-bold`}>42.880.000</b></p>
            </div>
            <div className={`col-span-12 h-6`}>

            </div>
            {isVisibleMFix 
                ? 
                <CFixCharge 
                    isMain={true}
                    isEdit={false}
                    visible={isVisibleMFix} setVisibleMFix={setVisibleMFix} />
                : "" 
            }
            <ModelSpecials visible={isVisibleMSpecials} setVisibleMSpecials={setVisibleMSpecials} />
        </ClassBox >
    );
};

export default React.memo(CGuestScheduleWalkIn);