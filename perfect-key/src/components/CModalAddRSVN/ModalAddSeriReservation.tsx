/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Checkbox, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import confirm from 'antd/lib/modal/confirm';
import { NotificationStatus } from 'common/enum/shared.enum';
import { RemainRSVN } from 'common/model-rsvn';
import { RenderItemBookingSeri } from 'common/search/RenderItemBookingSeri';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import openNotification from 'components/CNotification';
import { addDays, differenceInDays } from 'date-fns';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelectorRoot } from 'redux/store';
import AddSeriReservstionService from 'services/booking/addOn/addSeriReservation.service';
import { useStyleTheme } from "theme/Theme";
import { useTranslation } from 'react-i18next';
import { styleFormMain } from 'pages/main/booking/searchResults/styles/styleFormMain';
import { styleCForm } from 'pages/main/booking/styles/styleCForm';

const ModalAddSeriReservation = ({ reservationData, selectedRow, modalAddSeri, setVisibleGuestProfile, ...props }: RenderItemBookingSeri): JSX.Element => {
    const classes = useStyleTheme(styleFormMain);
    const classesForm = useStyleTheme(styleCForm);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { handleSubmit, control } = useForm();
    const [, setVisibleConfirm] = useState(false)
    const [arrivalDate, setArrivalDate] = useState(addDays(new Date(), 7));
    const [departureDate, setDepartureDate] = useState(addDays(new Date(), 8))
    const [, setIsClick] = useState<boolean>(false)
    const [groupCode, setGroupCode] = useState<string>(" ")
    const [confirmRsvn, setConfirmRsvn] = useState<boolean>(false)
    const [checkedRemain, setCheckedRemain] = useState(false)
    const [nights, setNights] = useState(differenceInDays(departureDate, arrivalDate));
    const { t } = useTranslation("translation")

    const onSubmit = handleSubmit(async () => {
        let check = true
        const date = {
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            nights: nights
        }
        const remain: RemainRSVN = {
            isRemain: checkedRemain,
            confirmed: confirmRsvn,
            groupCode: groupCode,
            rsvnId: ''
        }
        departureDate.getTime() < arrivalDate.getTime() ? check = false : check = true;
        if (check) {
            const data = await AddSeriReservstionService.addSeriReservationData(reservationData, date, hotelId, remain, groupCode, checkedRemain, selectedRow)
            data && AddSeriReservstionService.newRsvnData(data).then(
                () => {
                    notification.success({
                        message: 'Success',
                        description: 'Create Seri RSVN success',
                    })
                    setVisibleConfirm(true)
                    showConfirm()
                }, ((err) => {
                    console.log(err);
                    notification.error({
                        message: 'Failure',
                        description: "Room type '" + selectedRow[0]?.roomType?.name + "' has no capacity",
                    })
                })
            )
            setGroupCode(" ")
        } else {
            openNotification(NotificationStatus.Error, 'Wrong!', 'Error when the arrival larger the departure!')
        }
    });

    function showConfirm() {
        confirm({
            title: 'Do you want to book other reservation?',
            content: '',
            className: "custom-modal-confirm-pkm",
            onOk() {
                setVisibleConfirm(false)
            },
            onCancel() {
                setVisibleConfirm(false)
                setVisibleGuestProfile(false)
            },
        });
    }

    return (
        <React.Fragment>
            <CModel
                visible={modalAddSeri}
                title="Add Seri Reservation"
                onOk={onSubmit}
                onCancel={() => setVisibleGuestProfile(false)}
                content={
                    <form onSubmit={onSubmit}>
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
                                                    format={Utils.typeFormatDate()}
                                                    disabledDate={(date) => (date) && date < arrivalDate}
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
                            <div className={`col-span-6`} style={{ marginTop: 10 }}>
                                <Controller render={(
                                    { onChange, onBlur, value, name, ref }) => (
                                    <Checkbox style={{ display: "flex", height: "50%" }}
                                        checked={checkedRemain}
                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                        defaultChecked={true}
                                        onChange={(e) => {
                                            onChange(e.target.checked)
                                            setCheckedRemain(e.target.checked)
                                        }}>
                                        {t("BOOKING.SEARCHVALUE.remainRsvnNumber")}
                                    </Checkbox>
                                )}
                                name="remain" defaultValue={checkedRemain} control={control} />
                            </div>
                            <div className={`col-span-6`} style={{ marginTop: 10 }}>
                                <Controller render={(
                                    { onChange, onBlur, value, name, ref }) => (
                                    <Checkbox style={{ display: "flex", height: "50%" }}
                                        checked={confirmRsvn}
                                        className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                        defaultChecked={true}
                                        onChange={(e) => {
                                            onChange(e.target.checked)
                                            setConfirmRsvn(e.target.checked)
                                        }}>
                                        {t("BOOKING.SEARCHVALUE.confirmed")}
                                    </Checkbox>
                                )}
                                name="confirm" defaultValue={confirmRsvn} control={control} />
                            </div>
                            <div className={`col-span-6`}>
                                <div>{t("BOOKING.SEARCHVALUE.rsvnNo")}:</div>
                                <Controller
                                    name='rsvnNo' control={control}
                                    defaultValue={selectedRow[0]?.rsvnNo?.name ?? undefined}
                                    render={({ onChange, value }) => (
                                        <Input
                                            // onChange={(e:any) => {
                                            //     onChange(e) 
                                            //     setRoom(e.target.value)}}
                                            value={value}
                                            disabled
                                            className={`${classesForm.input} w-full`}
                                            type="number" />
                                    )}
                                    value={selectedRow[0]?.rsvnNo?.name}
                                />
                            </div>
                            <div className={`col-span-12`}>
                                <div >{t("BOOKING.SEARCHVALUE.groupCode")}:</div>
                                <Controller
                                    name="groupCode"
                                    // defaultValue={selectedRow[0]?.groupCode?.name}
                                    control={control} value={groupCode}
                                    render={({ onChange, value }) => (
                                        <TextArea className={`${classes.textArea} w-full col-span-12`}
                                            style={{ height: 60, backgroundColor: "#F5F6F7" }}
                                            placeholder={t("BOOKING.SEARCHVALUE.inputGroupCodeHere")}
                                            onChange={(e: any) => {
                                                onChange(e)
                                                setGroupCode(e.target.value)
                                            }}
                                            defaultValue={selectedRow[0]?.groupCode?.name ? selectedRow[0]?.groupCode?.name : ""}
                                        />
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

export default ModalAddSeriReservation;