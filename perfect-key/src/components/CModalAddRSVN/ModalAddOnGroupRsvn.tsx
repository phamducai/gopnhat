/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsAddOnReservation } from 'common/search/PropsAddOnReservation';
import DatePicker from "components/CDatePicker";
import CModel from 'components/CModal';
import { addDays, differenceInDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelectorRoot } from 'redux/store';
import { useStyleTheme } from 'theme';
import { modalAddOnGroupRsvn } from './styles/modalAddOnGroupRsvn';
import AddGroupReservstionService from 'services/booking/addOn/addGroupReservation.service';
import { IDate } from 'services/booking/addOn/addSeriReservation.service';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { useTranslation } from 'react-i18next';
import Utils from 'common/utils';

const ModalAddOnGroupRsvn = ({ modalAdd, setToggleModalAddOnGroupRsvn, selectedRows, reservationData }: PropsAddOnReservation): JSX.Element => {
    const classes = useStyleTheme(modalAddOnGroupRsvn);
    const { hotelId } = useSelectorRoot(state => state.app);
    const [arrivalDate, setArrivalDate] = useState(addDays(new Date(), 7));
    const [departureDate, setDepartureDate] = useState(addDays(new Date(), 8));
    const [nights, setNights] = useState(differenceInDays(departureDate, arrivalDate));
    const [, setIsClick] = useState<boolean>(false)
    const [room, setRoom] = useState({roomType: "", roomName: "", rate: 1})
    const { control } = useForm();
    const { t } = useTranslation("translation")

    useEffect(() => {
        if(Array.isArray(selectedRows)){
            selectedRows && setRoom({
                roomType: selectedRows[0]?.roomType.id,
                roomName: selectedRows[0]?.roomType?.name,
                rate: selectedRows[0]?.rate?.name
            })
        }else{
            selectedRows && setRoom({
                roomType: selectedRows.roomType,
                roomName: selectedRows.roomName,
                rate: selectedRows.rate
            })
        }
    }, [selectedRows])

    const handleOk = async () => {
        const date: IDate = {
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            nights: nights
        }
        const data = await AddGroupReservstionService.addGroupReservationData(reservationData, date, hotelId)
        AddGroupReservstionService.newRsvnData(data).then(() => {
            openNotification(NotificationStatus.Success, 'Done', 'Create Group RSVN successfully!')
        }, ((err) => {
            // alert("Error when booking a reservation!");
            console.log(err);
            openNotification(NotificationStatus.Error, 'Wrong!', "Room type '" + room.roomName + "' has no capacity")
        })
        )
        setToggleModalAddOnGroupRsvn(false);
    };

    return (
        <React.Fragment>
            <CModel
                visible={modalAdd}
                title="Add On Group Reservation"
                onOk={handleOk}
                onCancel={() => setToggleModalAddOnGroupRsvn(false)}
                content={
                    <form onSubmit={handleOk}>
                        <div className="grid xl:grid-cols-12 col-span-12 pt-4 md:w-11/12 xl:w-full">
                            <div className="col-span-12">
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
                                                className={classes.datePicker}
                                                format={Utils.typeFormatDate()}
                                                disabledDate={(date: Date) => date < arrivalDate }
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
                        </div>
                    </form>
                }
            />
        </React.Fragment>
    );
}

export default ModalAddOnGroupRsvn;