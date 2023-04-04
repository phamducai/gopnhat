/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Radio } from 'antd';
import { TypeTracer, typeTracerTo } from 'common/enum/cashier.enum';
import { DataCEditRsvn } from 'common/model-rsvn';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CIconSvg from 'components/CIconSvg';
import { AlertModal } from 'components/CModalTracerAndMessage/CModalAlert';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { useStyleTheme } from 'theme';

interface PropsModal {
    isShowModal: boolean;
    setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    dataRsvn: DataCEditRsvn | undefined
}

const CModelTracerTo = ({setIsShowModal, isShowModal, title, dataRsvn}: PropsModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { control } = useForm();

    const [arrivalDate, setArrivalDate] = useState<Date>(new Date())
    const [departureDate, setDepartureDate] = useState<Date>(new Date())
    const [typeTracer, setTypeTracer] = useState<number>(typeTracerTo.GuestOnly);
    const [, setIsClick] = useState<boolean>(false)
    const [isAlertModal, setIsAlertModal] = useState<boolean>(false);

    console.log(dataRsvn);
    
    const handleOkTracerTo = () => {
        setIsAlertModal(true)
    }
    const onCancelTracerTo = () => {
        setIsShowModal(false)
    }
    
    return (
        <Modal
            title={<span className={`${classes.titleStyle}`}>{title}</span>}
            visible={isShowModal}
            destroyOnClose={true}
            className={classes.antModalStyle}
            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => onCancelTracerTo()} />}
            width={"50%"}
            style={{top: '5%'}}
            footer={
                <div className="flex justify-between m-auto w-full">
                    <div className="footer-left">
                    </div>
                    <div className="footer-right">
                        <Button
                            style={{ color: "#F74352", border: "1px solid #F74352" }}
                            className={`!rounded-md ${classes.buttonStyle}`}
                            // disabled={disableClose}
                            onClick={() => onCancelTracerTo()}
                        >
                            {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                        </Button >
                        <Button
                            type="primary" 
                            className={`!rounded-md ${classes.buttonStyle}`}
                            onClick={handleOkTracerTo}
                        >
                            {t("BOOKING.RESERVATION.ok")}
                        </Button>
                    </div>
                </div >
            }
        >
            <div >
                <Controller
                    control={control}
                    defaultValue={typeTracerTo.GuestOnly}
                    name="typeDate"
                    render={({ onChange }) => (
                        <Radio.Group
                            className={`${classes.radioGroup} font-semibold text-base`}
                            onChange={e => { 
                                onChange(e.target.value); 
                                setTypeTracer(e.target.value)
                            }}
                            defaultValue={typeTracerTo.GuestOnly}
                        >
                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                value={typeTracerTo.GuestOnly}>{t("BOOKING.guestOnly")}</Radio>
                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                value={typeTracerTo.AllGuestInGroup}>{t("BOOKING.allGuestInGroup")}</Radio>
                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                value={typeTracerTo.GuestSameArrival}>{t("BOOKING.guestSameArrival")}</Radio>
                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                value={typeTracerTo.GuestSameDeparture}>{t("BOOKING.guestSameDeparture")}</Radio>
                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} 
                                value={typeTracerTo.GuestInHouseBetween}>
                                <span>{t("BOOKING.guestInHouse")}</span>
                                <Controller
                                    name="dateArrival1"
                                    control={control} render={({ onChange, value }) => (
                                        <div className="inline-flex items-center ">
                                            <DatePicker
                                                defaultValue={arrivalDate}
                                                onClick={() => onChange({ ...value, isOpen: false })}
                                                placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                className={`${classes.datePicker} w-2/7`}
                                                format={Utils.typeFormatDate()}
                                                disabledDate={(date) => (date) && date < new Date()}
                                                onChange={(date) => {
                                                    onChange({ ...value, from: date, isOpen: true })
                                                    date && setArrivalDate(date)
                                                }
                                                }
                                            />
                                            <div style={{ width: "40px", padding: "7px 4px" }} className="font-bold flex justify-center"> and </div>
                                            <DatePicker
                                                defaultValue={departureDate}
                                                onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                                onBlur={() => { onChange({ ...value, isOpen: false }); ; setIsClick(false) }}
                                                open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                className={`${classes.datePicker} w-2/7`}
                                                format={Utils.typeFormatDate()}
                                                onChange={(date) => {
                                                    onChange({ ...value, to: date, isOpen: false })
                                                    date && setDepartureDate(date)
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </Radio>
                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} value={typeTracerTo.GuestArrivalBetween}>
                                <span>{t("BOOKING.guestArrivalBetween")}</span>
                                <Controller
                                    name="dateArrival2"
                                    control={control} render={({ onChange, value }) => (
                                        <div className="inline-flex items-center ">
                                            <DatePicker
                                                defaultValue={arrivalDate}
                                                onClick={() => onChange({ ...value, isOpen: false })}
                                                placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                className={`${classes.datePicker} w-2/7`}
                                                format={Utils.typeFormatDate()}
                                                disabledDate={(date) => (date) && date < new Date()}
                                                onChange={(date) => {
                                                    onChange({ ...value, from: date, isOpen: true })
                                                    date && setArrivalDate(date)
                                                }
                                                }
                                            />
                                            <div style={{ width: "40px", padding: "7px 4px" }} className="font-bold flex justify-center"> and </div>
                                            <DatePicker
                                                defaultValue={departureDate}
                                                onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                                onBlur={() => { onChange({ ...value, isOpen: false }); ; setIsClick(false) }}
                                                open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                className={`${classes.datePicker} w-2/7`}
                                                format={Utils.typeFormatDate()}
                                                onChange={(date) => {
                                                    onChange({ ...value, to: date, isOpen: false })
                                                    date && setDepartureDate(date)
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </Radio>
                            <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} value={typeTracerTo.GuestDepartureBetween}>
                                <span>{t("BOOKING.guestDepartureBetween")}</span>
                                <Controller
                                    name="dateArrival3"
                                    control={control} render={({ onChange, value }) => (
                                        <div className="inline-flex items-center ">
                                            <DatePicker
                                                defaultValue={arrivalDate}
                                                onClick={() => onChange({ ...value, isOpen: false })}
                                                placeholder={t("BOOKING.SEARCHVALUE.from")}
                                                className={`${classes.datePicker} w-2/7`}
                                                format={Utils.typeFormatDate()}
                                                disabledDate={(date) => (date) && date < new Date()}
                                                onChange={(date) => {
                                                    onChange({ ...value, from: date, isOpen: true })
                                                    date && setArrivalDate(date)
                                                }
                                                }
                                            />
                                            <div style={{ width: "40px", padding: "7px 4px" }} className="font-bold flex justify-center"> and </div>
                                            <DatePicker
                                                defaultValue={departureDate}
                                                onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                                onBlur={() => { onChange({ ...value, isOpen: false }); ; setIsClick(false) }}
                                                open={value?.isOpen} placeholder={t("BOOKING.SEARCHVALUE.to")}
                                                disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                className={`${classes.datePicker} w-2/7`}
                                                format={Utils.typeFormatDate()}
                                                onChange={(date) => {
                                                    onChange({ ...value, to: date, isOpen: false })
                                                    date && setDepartureDate(date)
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </Radio>
                        </Radio.Group>
                    )}
                />
            </div>
            {isAlertModal && <AlertModal
                titleAlert={t("BOOKING.RESERVATION.inputMessage")}
                isAlertModal={isAlertModal}
                setIsAlertModal={setIsAlertModal}
                typeTracer={typeTracer}
                inHouseGuid={dataRsvn ? dataRsvn.dataFotransactRoomDTO.guid : null}
                guest={dataRsvn ? dataRsvn.dataFotransactRoomDTO.guestId: null}
                dateFrom={arrivalDate}
                dateUtil={departureDate}
                setIsTracerTo={setIsShowModal}
                setIsNewTracer={setIsShowModal}
                flagType={TypeTracer.Tracer}
            />}
        </Modal >
    );
};

export default CModelTracerTo;
