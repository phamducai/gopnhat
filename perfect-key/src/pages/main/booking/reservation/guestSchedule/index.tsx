/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ClassBox from 'components/CClassBox'
import React, { useEffect, useState } from 'react';
import { Input, Select } from "antd";
import DatePicker from "components/CDatePicker";
import clsx from 'clsx';
import { Checkbox } from "antd";
import { createStyles, useStyleTheme } from 'theme';
import { Controller } from 'react-hook-form';
import { useDispatchRoot } from 'redux/store';
import TableShedule from "./CTableSchedule";
import { addDays, differenceInDays } from 'date-fns';
import { useLocation } from 'react-router';
import { setSelectedBookingRoomType, setDateRsvn } from 'redux/controller/reservation.slice';
import { RoomTypeIdnCounts, SelectedBookingRoomType } from 'common/model-rsvn';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const styleGuestSchedule = createStyles((theme) => ({
    datePicker: {
        borderRadius: "6px !important",
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
    input: {
        background: "#F5F6F7",
        height: 40,
        borderRadius: 6,
    },
    selectBackground: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            height: "40px !important",
            alignItems: "center !important",
            borderRadius: "6px !important",
            '& span': {
                '& .ant-select-selection-search-input': {
                    height: "38px !important"
                }
            }
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        }
    },
    titleCheckbox: {
        color: "#00293B"
    },
    // tableSummary: {
    //     "& .ant-table-cell": {
    //         padding: "15px 16px !important",
    //         paddingBottom: "20px !important"
    //     }
    // },
    table: {
        "& .ant-table-tbody > tr > td": {
            padding: "0px 16px !important",
        },
        "& ::-webkit-scrollbar-track": {
            background: "white !important"
        },
        "& ::-webkit-scrollbar": {
            height: 0,
            width: 0
        },
        "& .ant-table-wrapper .ant-spin-nested-loading .ant-spin-container .ant-table.ant-table-fixed-header .ant-table-containe": {
            height: "auto !important"
        }
    },
}))

function CGuestSchedule({ getGuestProfile, setDepartureDate, setArrivalDate, arrivalDate, departureDate, dataSelection, data, ...props }: any): JSX.Element {
    const { control, isPrintRateProps, setCheckedPrintRate, isConfirm, setIsConfirm, setValue, getValue } = props;
    const [breakfast, setBreakfast] = useState(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [nights, setNights] = useState(differenceInDays(departureDate, arrivalDate));
    const [arrivalEdit, setArrivalEdit] = useState();
    const [rSVNType, setRsvnType] = useState('');
    const [dataEdit, setDataEdit] = useState([]);
    const location = useLocation<any>();
    const dispatch = useDispatchRoot();
    const classes = useStyleTheme(styleGuestSchedule);
    const { t } = useTranslation("translation")

    const defaultValueForm = location.state
    const onSetDay = (e: any) => {
        setDepartureDate(addDays(arrivalDate, e.target.value));
        setNights(e.target.value);

    }
    useEffect(() => {// save date using modal pickup, fixcharge and flight
        if (nights > 0) {
            dispatch(setDateRsvn({ arrivalDate, departureDate, newNumberNight: nights, defineNight: nights }))
        }
    }, [arrivalDate, departureDate])

    useEffect(() => {
        defaultValueForm?.dateArrival ?
            setArrivalDate(defaultValueForm?.dateArrival) || setDepartureDate(addDays(defaultValueForm?.dateArrival, 1))
            : setArrivalDate(addDays(new Date(), 1));
    }, [defaultValueForm])

    const mapDataTable = async () => {
        if (getGuestProfile !== "") {
            setArrivalDate(new Date(getGuestProfile.dataFotransactRoomDTO.arrivalDate));
            setDepartureDate(new Date(getGuestProfile.dataFotransactRoomDTO.departureDate));
            setCheckedPrintRate(getGuestProfile.dataFotransactRoomDTO.printRate);
            // setRsvnType(getGuestProfile.dataFotransactRoomDTO.resType)  
            console.log(getGuestProfile.dataFotransactRoomDTO.resType);

            setValue("resType", getGuestProfile.dataFotransactRoomDTO.resType);
            const roomTypeidnCounts = getGuestProfile.roomTypeidnCounts;
            const datas: any = data
            
            const selectedBookingRoomType: SelectedBookingRoomType[] = [];
            roomTypeidnCounts.forEach((roomTypeidnCount: RoomTypeIdnCounts, index: number ) => {
                selectedBookingRoomType.push({
                    key: index.toString(),
                    Rooms: roomTypeidnCount.count,
                    TotalRooms: roomTypeidnCount.totalRooms,
                    Rate: roomTypeidnCount.rate,
                    Roomtype: roomTypeidnCount.roomType,
                    Available: 0,
                    Edit: "",
                    Guest: roomTypeidnCount.guestGuid.length,
                    roomTypeGuid: roomTypeidnCount?.roomType
                })
            });
            
            datas.forEach((elm: any, index: any) => {
                roomTypeidnCounts.forEach((roomTypeidnCount: RoomTypeIdnCounts) => {
                    if (elm.key === roomTypeidnCount.roomType) {
                        datas[index].Rooms = roomTypeidnCount.count;
                        datas[index].Guest = roomTypeidnCount.guestGuid.length / roomTypeidnCount.count;
                        datas[index].Rate = roomTypeidnCount.rate;
                        datas[index].AvailableRoom = roomTypeidnCount.count + datas[index].Available;
                    }
                });
            });
            dispatch(setSelectedBookingRoomType(selectedBookingRoomType));
            setDataEdit(datas);
        }
    }

    useEffect(() => {
        mapDataTable();
    }, [dataEdit])

    useEffect(() => {
        // setTableData(data);
        setChecked(false);
    }, [data])
    const handleChecked = (value: boolean) => {
        setChecked(value);
    }
    const onSetArrivalDateChange = (dateValue: any) => {
        setNights(differenceInDays(departureDate, dateValue) + 1);
        setArrivalDate(dateValue);
    }
    const onSetDepartureDateChange = (dateValue: any) => {
        setDepartureDate(dateValue);
        setNights(differenceInDays(dateValue, arrivalDate) + 1)
    }
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.guid}>{item.ten}</Option>
            )
        })
    }
    const getRSVNTypeByIdGuid = (idGuid: any, data: Array<any>) => {
        const resultRsvnType = data.find(x => x.guid === idGuid);
        if (resultRsvnType === undefined) {
            setIsConfirm(false);
            return;
        }
        setIsConfirm(resultRsvnType.isConfirm);
    }
    return (
        <ClassBox className={clsx(props.className)}>
            <div className="col-span-12 flex">
                <div style={{ width: 301, marginRight: 15 }}>
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.GUESTSCHEDULE.arrival")}</p>
                    <Controller defaultValue={defaultValueForm?.dateArrival ? defaultValueForm?.dateArrival : arrivalDate}
                        name="arrivalDate"
                        render={({ onChange, value }) =>
                            <DatePicker value={arrivalDate}
                                onChange={(date) => {
                                    onSetArrivalDateChange(date)
                                    onChange(date)
                                }}
                                defaultValue={arrivalEdit}
                                name="arrivalDate"
                                className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                            />}
                        control={control} />
                </div>
                <div style={{ width: 301 }}>
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.GUESTSCHEDULE.departure")}:</p>
                    <Controller defaultValue={defaultValueForm?.dateDeparture ? defaultValueForm?.dateDeparture : departureDate} render={({ onChange, value }) => <DatePicker
                        disabledDate={(date: Date) => date < arrivalDate}
                        onChange={(date) => {
                            onChange(onSetDepartureDateChange(date))
                            onChange(date)
                        }} className={`${classes.datePicker} w-full`} value={departureDate} defaultValue={defaultValueForm?.dateArrival ?? ""} style={{ background: "#F5F6F7" }} />}
                    name="departureDate" control={control} value={departureDate} />
                </div>
            </div>
            <div className="col-span-12 flex">
                <div style={{ width: 80, marginRight: 15 }}>
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.GUESTSCHEDULE.nights")}:</p>
                    <Controller render={({ onChange, value }) => <Input
                        type="number"
                        className={`${classes.input}`}
                        style={{ background: "#F5F6F7", height: 40 }}
                        onChange={(value) => { onChange(onSetDay(value)) }}
                        defaultValue={nights} value={nights}
                        required />}
                    name="nights" defaultValue={nights} control={control} />
                </div>
                <div style={{ width: 95, marginRight: 15 }}>
                    <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.GUESTSCHEDULE.cod")}:</p>
                    <Controller render={({ onChange, value }) => <Input
                        className={`${classes.input}`}
                        type="number" style={{ background: "#F5F6F7", height: 40 }} value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} ></Input>}
                    name="cod" defaultValue={0} control={control} />
                </div>
                <div className="col-span-6 flex flex-row items-center mt-4">
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ display: "flex", height: "50%" }}
                            checked={isPrintRateProps}
                            className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                            defaultChecked={true}
                            onChange={(e) => {
                                onChange(e.target.checked)
                                setCheckedPrintRate(e.target.checked)
                            }}>
                            {t("BOOKING.RESERVATION.GUESTSCHEDULE.printRate")}
                        </Checkbox>
                    )}
                    name="printRate" defaultValue={true} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (<Checkbox style={{ display: "flex", height: "50%", marginLeft: '1.2rem' }}
                        className={`${classes.titleCheckbox} flex-row items-center font-semibold`} checked={value} defaultChecked={true}
                        onChange={(e) => onChange(e.target.checked)}>{t("BOOKING.RESERVATION.GUESTSCHEDULE.net")}</Checkbox>
                    )}
                    name="isNet" defaultValue={true} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (<Checkbox style={{ display: "flex", height: "50%" }} checked={value}
                        className={`${classes.titleCheckbox} flex-row items-center font-semibold`} onChange={(e) => onChange(e.target.checked)}
                        defaultChecked={false}>BKF</Checkbox>
                    )}
                    name="isNoBkf" defaultValue={breakfast} control={control} />
                </div>
            </div>
            <div className="col-span-12 flex">
                <div style={{ width: 301, marginRight: 15 }}>
                    <p className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.GUESTSCHEDULE.rsvnType")}:
                    </p>
                    <Controller render={({ onChange, value }) =>
                        <Select className={`${classes.selectBackground} w-full`} placeholder={t("BOOKING.RESERVATION.GUESTSCHEDULE.selectHere")}
                            showSearch
                            onChange={(e) => {
                                onChange(e);
                                setRsvnType(e)
                                getRSVNTypeByIdGuid(e, dataSelection ? dataSelection.rsvnTypes : []);
                            }}
                            // value={rSVNType || undefined}
                            value={getValue("resType") || undefined}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {dataSelection ? renderSelect(dataSelection.rsvnTypes) : ""}
                        </Select>}
                    name="resType" control={control} defaultValue="" />
                </div>
                <div className="col-span-6 flex flex-row items-center">
                    <div className="flex-row items-center font-semibold" style={{ display: "flex", height: "50%", cursor: "no-drop", marginTop: 11 }}>
                        <Controller
                            name="confirmed" defaultValue={false} control={control}
                            render={(
                                { onChange, onBlur, value, name, ref }) => (
                                <Checkbox style={{ display: "flex", height: "50%", pointerEvents: "none" }}
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                    checked={isConfirm}
                                    onChange={(e) => onChange(e.target.checked)}
                                >
                                    {t("BOOKING.RESERVATION.GUESTSCHEDULE.confirmed")}
                                </Checkbox>
                            )}
                        />
                    </div>
                </div>
            </div>
            <TableShedule nights={nights} getGuestProfile={getGuestProfile} data={dataEdit.length > 0 ? dataEdit : data} checked={checked} handleChecked={handleChecked} />
        </ClassBox >
    )
}
export default React.memo(CGuestSchedule);
