/* eslint-disable @typescript-eslint/no-explicit-any */

import { Menu, Modal } from "antd";
import Utils from "common/utils";
import DatePicker from "components/CDatePicker";
import { ControlMessageModal } from "components/CModalTracerAndMessage/CModalControlMessage";
import { TracerMessageModal } from "components/CModalTracerAndMessage/TracerMessageModal";
import CButtonFrontDesk from "components/FrontDesk/CButtonFrontDesk";
import { styleButtonDropdown } from "components/FrontDesk/style/styleButtonDropdown";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getDonViTienTeRequest } from "redux/controller/hotelconfig.slice";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { useStyleTheme } from "theme";
import { NewAllotmentModal } from "../miscellaneous-modals/NewAllotmentModal";
import ExchangeRateModal from "./Modals/ExchangeRateModal";
import "./style.css";

const { SubMenu } = Menu;
// interface Props{}
const MessageColumn = () => {
    const classes = useStyleTheme(styleButtonDropdown);
    const { t } = useTranslation("translation");
    const { control } = useForm();

    const {hotelId} = useSelectorRoot(state => state.app)
    const dispatch = useDispatchRoot();

    const [isTracerModal, setIsTracerModal] = useState<boolean>(false);
    const [isControlMessage, setIsControlMessage] = useState<boolean>(false);
    const [isNewAllotment, setNewAllotment] = useState<boolean>(false);
    const [arrivalDate, setArrivalDate] = useState<Date>(new Date())
    const [departureDate, setDepartureDate] = useState<Date>(new Date())
    const [, setIsClick] = useState<boolean>(false)
    const [showModalExchangeRate, setShowModalExchangeRate] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getDonViTienTeRequest(hotelId));
    },[hotelId, dispatch])
    

    //Handle New Message 
    const handleNewMessage = () => {
        setIsTracerModal(true)
    }

    const handleConfirmInput = () => {
        Modal.confirm({
            title: t("MISCELLANEOUS.inputDate"),
            content: (
                <>
                    <label className={"font-semibold"}>{t("BOOKING.SEARCHVALUE.arrival")}:</label>
                    <label className={"font-semibold"} style={{ marginLeft: '40%' }}>{t("BOOKING.SEARCHVALUE.departure")}:</label>
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
                                    onChange={(date) => {
                                        onChange({ ...value, from: date, isOpen: true })
                                        date && setArrivalDate(date)
                                    }}
                                />
                                <div style={{ width: "40px", padding: "7px 4px" }} className="font-bold flex justify-center"> ~ </div>
                                <DatePicker
                                    defaultValue={departureDate}
                                    onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                    onBlur={() => { onChange({ ...value, isOpen: false });; setIsClick(false) }}
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
                </>
            ),
            className: "custom-modal-confirm-pkm",
            onOk() {
                setIsControlMessage(true)
            },
        });
    }

    return (
        <div className={`${classes.AntBtnGroup}`} style={{ marginTop: "1rem" }}>
            <Menu
                style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
                className={`customer-icon mx-3 more-items w-full control-color-blue focus-grey ${classes.frontDeskControl}  `}
                triggerSubMenuAction="click"
            >
                <SubMenu key="sub1" title={t("MISCELLANEOUS.message")}
                    popupClassName={`${classes.controlSubMenu} `}
                    style={{ marginLeft: "1.5rem", width: "100%" }}
                >
                    <Menu.Item
                        key={"sub11"}
                        className={` font-bold `}
                        onClick={handleNewMessage}
                    >
                        {t("MISCELLANEOUS.newMessage")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold mt-6`}
                        key={"sub12"}
                        onClick={handleConfirmInput}
                    >
                        {t("MISCELLANEOUS.managingMessage")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <CButtonFrontDesk className="mt-4"
                onClick={() => setShowModalExchangeRate(true)}
            >
                {t("MISCELLANEOUS.exchangeRate")}
            </CButtonFrontDesk>
            <CButtonFrontDesk className="mt-4" disabled={true}
            >
                {t("MISCELLANEOUS.listNightRun")}
            </CButtonFrontDesk>
            <CButtonFrontDesk className="mt-3" disabled={true}
            >
                {t("MISCELLANEOUS.member")}
            </CButtonFrontDesk>
            <CButtonFrontDesk className="mt-3" disabled={true}
            >
                {t("MISCELLANEOUS.event")}
            </CButtonFrontDesk>
            <CButtonFrontDesk onClick={() => setNewAllotment(true)} className="mt-3"
            >
                {t("MISCELLANEOUS.newAllotment")}
            </CButtonFrontDesk>
            {isTracerModal && <TracerMessageModal
                title={t("BOOKING.RESERVATION.chooseInHouse")}
                isShowModal={isTracerModal}
                setIsShowModal={setIsTracerModal}
                isTracer={false}
            />}
            {isControlMessage && <ControlMessageModal
                setIsShowModal={setIsControlMessage}
                isShowModal={isControlMessage}
                title={"Manual Received Message"}
                arrivalDate={arrivalDate}
                departureDate={departureDate}
            />}
            {isNewAllotment && <NewAllotmentModal
                setShowModal={setNewAllotment}
                isShowModal={isNewAllotment}
            />}
            {showModalExchangeRate && <ExchangeRateModal
                setShowModal={setShowModalExchangeRate}
                isShowModal={showModalExchangeRate}
            />}
        </div>
    );
};
export default React.memo(MessageColumn);
