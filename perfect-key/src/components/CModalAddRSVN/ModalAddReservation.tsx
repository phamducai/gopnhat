/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputNumber } from 'antd';
import { NotificationStatus } from 'common/enum/shared.enum';
import { PropsAddReservation } from 'common/search/PropsAddReservation';
import Utils from 'common/utils';
import DatePicker from "components/CDatePicker";
import CModel from 'components/CModal';
import openNotification from 'components/CNotification';
import { addDays, differenceInDays } from 'date-fns';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelectorRoot } from 'redux/store';
import AddOnReservstionService from 'services/booking/addOn/addOnReservation.service';
import { useStyleTheme } from 'theme';
import { modalAddRSVN } from './styles/modalAddRSVN';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';


const ModalAddReservation = ({ selectedRows, modalAdd, setToggleModalAddReservation, reservationData }: PropsAddReservation): JSX.Element => {
    const classes = useStyleTheme(modalAddRSVN);
    const { hotelId } = useSelectorRoot(state => state.app);
    const [arrivalDate, setArrivalDate] = useState(addDays(new Date(), 7));
    const [departureDate, setDepartureDate] = useState(addDays(new Date(), 8));
    const [rate, setRate] = useState<number>(1);
    const [, setIsClick] = useState<boolean>(false)
    const [nights, setNights] = useState(differenceInDays(departureDate, arrivalDate));
    const [room, setRoom] = useState({ roomType: "", roomName: "", rate: 1 })
    const { control } = useForm();
    const { t } = useTranslation("translation")

    useEffect(() => {
        if (Array.isArray(selectedRows)) {
            selectedRows && setRoom({
                roomType: selectedRows[0]?.roomType.id,
                roomName: selectedRows[0]?.roomType?.name,
                rate: selectedRows[0]?.rate?.name
            })
        } else {
            selectedRows && setRoom({
                roomType: selectedRows.roomType,
                roomName: selectedRows.roomName,
                rate: selectedRows.rate
            })
        }
    }, [selectedRows])

    const handleOk = async () => {
        const date = {
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            nights: nights
        }
        
        const data = await AddOnReservstionService.addOnReservationData(reservationData, date, hotelId, rate, room)
        AddOnReservstionService.newRsvnData(data).then(() => {
            openNotification(NotificationStatus.Success, 'Done', 'Create RSVN successfully!')
        }, ((err) => {
            // alert("Error when booking a reservation!");
            console.log(err);
            openNotification(NotificationStatus.Error, 'Wrong!', "Room type '" + room.roomName + "' has no capacity")
        })
        )
        setToggleModalAddReservation(false);
    };

    return (
        <React.Fragment>
            <CModel
                visible={modalAdd}
                title="Add On Reservation"
                onOk={handleOk}
                onCancel={() => setToggleModalAddReservation(false)}
                content={
                    <form onSubmit={handleOk}>
                        <div className="grid grid-cols-12 !pb-4 gap-2 text-xs font-bold leading-7">
                            <div className="grid xl:grid-cols-12 col-span-12 pt-4 md:w-11/12 xl:w-full">
                                <div className="col-span-12">
                                    <label >{t("BOOKING.SEARCHVALUE.arrival")}:</label>
                                    <label style={{ marginLeft: '11.5rem' }}>{t("BOOKING.SEARCHVALUE.departure")}:</label>
                                    <Controller
                                        name="dateArrival"
                                        control={control} render={({ onChange, value }) => (
                                            <div className="flex items-center">
                                                <DatePicker
                                                    defaultValue={arrivalDate}
                                                    onClick={() => onChange({ ...value, isOpen: false })}
                                                    placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                    className={classes.datePicker}
                                                    disabledDate={(date: Date) => date < arrivalDate }
                                                    format={Utils.typeFormatDate()}
                                                    onChange={(date: any) => {
                                                        setArrivalDate(date)
                                                        setNights(differenceInDays(departureDate, date))
                                                        onChange({ ...value, from: date, isOpen: true, })
                                                    }
                                                    }
                                                />
                                                <div style={{ width: "12px", padding: "0 4px" }} className="font-bold flex justify-center">~</div>
                                                <DatePicker
                                                    defaultValue={departureDate}
                                                    onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                                    onBlur={() => { onChange({ ...value, isOpen: false }); setIsClick(false) }}
                                                    open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                    disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                    className={classes.datePicker}
                                                    format={Utils.typeFormatDate()}
                                                    onChange={(date: any) => {
                                                        onChange({ ...value, to: date, isOpen: false })
                                                        setDepartureDate(date)
                                                        setNights(differenceInDays(date, arrivalDate))
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="col-span-6 w-full" style={{ marginTop: 10 }}>
                                    <p className="m-0 font-base font-bold">{t("BOOKING.SEARCHVALUE.rate")}:</p>
                                    <Controller
                                        render={({ onChange, value }) => 
                                            <InputNumber
                                                min={0}
                                                className={`${classes.inputNumber} hiden-handler-wrap`}
                                                style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                                value={value} 
                                                formatter={e => `${Utils.formatNumber(e)}`}
                                                onChange={(e) => { 
                                                    onChange(e) 
                                                    setRate(e)
                                                }}
                                                defaultValue={room.rate}
                                                name="rate" required
                                            />
                                        }
                                        defaultValue={room.rate}
                                        value={rate}
                                        name="Rate"
                                        control={control}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                }
            />
        </React.Fragment>
    );
}

export default ModalAddReservation;