/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, InputNumber, Select } from "antd"
import { NewReservationData } from "common/model-rsvn"
import CModel from "components/CModal"
import React, { useEffect, useState } from "react"
import { useSelectorRoot } from "redux/store"
import AddRsvnToGroupService from "services/booking/addOn/AddRsvnToGroup.service"
import { useStyleTheme } from "theme"
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next"
import { styleSearchResults } from "pages/main/booking/searchResults/styles/styleSearchResults"
import DatePicker from "components/CDatePicker"
import { addDays } from "date-fns"
import Utils from "common/utils"
import openNotification from "components/CNotification"
import { NotificationStatus } from "common/enum/shared.enum"

interface IRsvnToGroup {
    visible: boolean;
    selectedRow: any;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    reservationData: NewReservationData,
    getData(): void
}

const ModalAddRsvnToGroup = ({ visible, selectedRow, setVisible, reservationData, getData }: IRsvnToGroup): JSX.Element => {
    const classes = useStyleTheme(styleSearchResults);
    const { control } = useForm();
    const Option = Select.Option
    const { t } = useTranslation("translation")
    const { hotelId } = useSelectorRoot(state => state.app);
    const { roomType } = useSelectorRoot(state => state.booking);

    const [number, setNumber] = useState<string>("1");
    const [guest, setGuest] = useState<string>("1");
    const [rate, setRate] = useState<number>(1);
    const [arrivalDate, setArrivalDate] = useState(addDays(new Date(), 0));
    const [departureDate, setDepartureDate] = useState<Date>(addDays(new Date(), 1))
    const [room, setRoom] = useState({roomType: "", roomName: "", rate: 1, fullName: ""})
    const [roomTypeAdd, setRoomTypeAdd] = useState('');
    const [inHouse, setInHouse] = useState<boolean>(false);

    useEffect(() => {
        if(Array.isArray(selectedRow)){
            if(selectedRow){ 
                setRoom({
                    roomType: selectedRow[0]?.roomType.id,
                    roomName: selectedRow[0]?.roomType?.name,
                    rate: Number.parseFloat(selectedRow[0]?.rate?.name.replace(/\D/g, "")),
                    fullName: selectedRow[0]?.fullName?.name
                })
                setDepartureDate(selectedRow[0]?.departureDate)
            }
        }else{
            if(selectedRow){
                setRoom({
                    roomType: selectedRow.roomType,
                    roomName: selectedRow.roomName,
                    rate: Number.parseFloat(selectedRow.rate.replace(/\D/g, "")),
                    fullName: selectedRow.fullNameGuestMain
                })
                setDepartureDate(selectedRow?.departureDate)
                setInHouse(true)
            }
        }
    }, [selectedRow])
    
    const onSubmit = async () => {
        const roomTypeName = roomTypeAdd ? roomTypeAdd : room.roomType
        const nameRoom = roomType.filter((x) => x.ten === roomTypeName)
        if(Utils.formatDate(arrivalDate) < Utils.formatDate(new Date())){
            openNotification(NotificationStatus.Error, 'Failure!', "Arrival isn't less than current date ")
        }else{
            const check = await AddRsvnToGroupService.bookingRsvnToGroup(reservationData, room, hotelId, number, guest, rate, nameRoom[0], inHouse, arrivalDate, departureDate)
            if(check && inHouse) getData()
            setRoomTypeAdd("")
            setVisible(false)
        }
    }
    
    return (
        <React.Fragment>
            <CModel
                title="Add Reservation To Group"
                visible={visible}
                onOk={onSubmit}
                style={{top: '5%'}}
                onCancel={() => setVisible(false)}
                content={
                    <Form labelCol={{ span: 11 }} wrapperCol={{ span: 12 }} labelAlign="left" >
                        <div className="col-span-10 mb-4">
                            <label className={"font-semibold"}>{t("BOOKING.SEARCHVALUE.arrival")}:</label>
                            <label className={"font-semibold ml-44"}>{t("BOOKING.SEARCHVALUE.departure")}:</label>
                            <Controller
                                name="dateArrival"
                                control={control} render={({ onChange, value }) => (
                                    <div className="flex items-center">
                                        <DatePicker
                                            defaultValue={arrivalDate}
                                            onClick={() => onChange({ ...value, isOpen: false })}
                                            placeholder={t("BOOKING.SEARCHVALUE.from")}
                                            className={classes.datePickerGroup}
                                            disabledDate={(date: Date) => date < arrivalDate }
                                            format={Utils.typeFormatDate()}
                                            onChange={(date: any) => {
                                                setArrivalDate(date)
                                                onChange({ ...value, from: date, isOpen: true })
                                            }}
                                        />
                                        <div style={{ width: "12px", padding: "0 4px" }} className="font-bold flex justify-center">~</div>
                                        <DatePicker
                                            defaultValue={departureDate ? new Date(departureDate) : addDays(new Date(), 1)}
                                            onClick={() => { onChange({ ...value, isOpen: true }) }}
                                            onBlur={() => { onChange({ ...value, isOpen: false })}}
                                            open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                            disabledDate={(date) => (date && value?.from) && date < value?.from}
                                            className={classes.datePicker}
                                            format={Utils.typeFormatDate()}
                                            onChange={(date: any) => {
                                                onChange({ ...value, to: date, isOpen: false })
                                                setDepartureDate(date)
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        <Form.Item label={t("BOOKING.SEARCHVALUE.inputNumberOfRsvn")}>
                            <Input className={`${classes.input} w-full`} type='text' value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))} />
                        </Form.Item>
                        <Form.Item label={t("BOOKING.SEARCHVALUE.guest")}>
                            <Input className={`${classes.input} w-full`} type='text' value={guest} onChange={(e) => setGuest(e.target.value.replace(/\D/g, ""))} />
                        </Form.Item>
                        <Form.Item label={t("BOOKING.SEARCHVALUE.rate")}>
                            <InputNumber className={`${classes.inputNumber} hiden-handler-wrap`}
                                defaultValue={room.rate ? room.rate : rate}
                                style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                formatter={(e: any) => `${Utils.formatNumber(e)}`}
                                onChange={(e) => setRate(e)}
                            />
                        </Form.Item>
                        <Form.Item label={t("BOOKING.SEARCHVALUE.roomType")}>
                            <Select
                                className={`${classes.selectBackground} w-full !rounded-md`}
                                onChange={(e) => setRoomTypeAdd(e)}
                                defaultValue={room.roomName ? room.roomName : roomType[0]?.ten}
                            >
                                {roomType.map((roomItem) => (
                                    <Option key={ roomItem.guid } value={roomItem.ten}>
                                        {roomItem.ten}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                }
            />
        </React.Fragment>
    )
}
export default ModalAddRsvnToGroup