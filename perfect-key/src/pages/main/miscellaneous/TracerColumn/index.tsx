/* eslint-disable @typescript-eslint/no-explicit-any */

import { DatePicker, Menu } from "antd";
import ModalRangePicker from "components/CModalRangePicker";
import { ControlTracerModal } from "components/CModalTracerAndMessage/CModalControlTracer";
import { TracerMessageModal } from "components/CModalTracerAndMessage/TracerMessageModal";
import CButtonFrontDesk from "components/FrontDesk/CButtonFrontDesk";
import { styleButtonDropdown } from "components/FrontDesk/style/styleButtonDropdown";
import { addMonths, format } from "date-fns";
import moment from "moment";
import { styleCorrection } from "pages/main/cashier/Folio/folio-modal/styles/stylesCorrection";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelectorRoot } from "redux/store";
import MiscellaneousService from "services/miscellaneous/miscellaneous.service";
import { useStyleTheme } from "theme";
import { ChannelManagerModal } from "../miscellaneous-modals/ChannelManagerModal";
import ModalAllotmentView from "./AllotmentView/ModalAllotmentView";
import "./style.css";

// interface Props{}
const { SubMenu } = Menu;
const TracerColumn = () => {
    const classes = useStyleTheme(styleButtonDropdown);
    const classesControls = useStyleTheme(styleCorrection);

    const { t } = useTranslation("translation");
    const currentDate = moment(new Date());

    const { hotelId } = useSelectorRoot(state => state.app);


    const [isTracerModal, setIsTracerModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isControlTracer, setIsControlTracer] = useState<boolean>(false);
    const [isChannelModalVisible, setChannelModalVisible] = useState<boolean>(false);
    const [isChannelAllomentModalVisible, setChannelAllotmentModalVisible] = useState<boolean>(false);
    const [isRangePickerModal, setRangePickerModal] = useState<boolean>(false);
    const [dataAllotment, setDataAllotment] = useState<any>();
    const [date, setDate] = useState<any>([currentDate, moment(addMonths(currentDate.toDate(), 1))])

    //Handle New Tracer 
    const handleNewTracer = () => {
        setIsTracerModal(true)
    }

    const getAllotmentData = async () => {
        try {
            setLoading(true)
            const data = await MiscellaneousService.getDataAllotment(
                hotelId,
                format(new Date(date[0]), "yyyy-MM-dd"),
                format(new Date(date[1]), "yyyy-MM-dd")
            );
            if (data) {
                setDataAllotment(data);
                setRangePickerModal(false)
                return data;
            }
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllotmentData()
        //eslint-disable-next-line
    }, [date])
    
    return (
        <div className={`${classes.AntBtnGroup}`} style={{ marginTop: "1rem" }}>
            <Menu
                style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
                className={`customer-icon mx-3 more-items w-full control-color-blue focus-grey ${classes.frontDeskControl}  `}
                // mode="vertical"
                triggerSubMenuAction="click"
            >
                <SubMenu key="sub1" title={t("MISCELLANEOUS.tracer")}
                    popupClassName={`${classes.controlSubMenu} `}
                    style={{ marginLeft: "1.5rem", width: "100%" }}
                >
                    <Menu.Item
                        key={"sub11"}
                        className={` font-bold `}
                        onClick={() => handleNewTracer()}
                    >
                        {t("BOOKING.RESERVATION.newTracer")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12"}
                        onClick={() => setIsControlTracer(true)}
                    >
                        {t("MISCELLANEOUS.managingTracer")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
                className={`customer-icon mx-3 more-items w-full control-color-blue focus-grey ${classes.frontDeskControl}  `}
                triggerSubMenuAction="click"
            >
                <SubMenu key="submenu2" title={t("MISCELLANEOUS.channelManager")}
                    popupClassName={`${classes.controlSubMenu} `}
                    style={{ marginLeft: "1.5rem", width: "100%" }}
                >
                    <Menu.Item
                        key={"sub21"}
                        className={` font-bold `}
                        onClick={() => setChannelModalVisible(true)}
                    >
                        {t("MISCELLANEOUS.channelManagerSettings")}
                    </Menu.Item>
                    <Menu.Item
                        key={"sub22"}
                        className={` font-bold `}
                        onClick={() => setRangePickerModal(true)}
                    >
                        {t("MISCELLANEOUS.channelManagerAllotmentView")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                style={{ marginTop: "1rem", marginLeft: "0.75rem", opacity: "0.5" }}
                className={`customer-icon mx-3 more-items w-full control-color-blue focus-grey ${classes.frontDeskControl}  `}
                // mode="vertical"
                triggerSubMenuAction="click" disabled={true}
            >
                <SubMenu key="sub1" title={t("MISCELLANEOUS.telephoneBook")}
                    popupClassName={`${classes.controlSubMenu} `}
                    style={{ marginLeft: "1.5rem", width: "100%" }}
                >
                    <Menu.Item
                        key={"sub11"}
                        className={` font-bold `}
                    // onClick={() => handelCancelChecked(TypeCancelRoom.CHECKIN_TO_DAY)}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelToday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12"}
                    // onClick={() => handelCancelChecked(TypeCancelRoom.CHECKIN_YESTERDAY)}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelYesterday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"}
                    // onClick={() => handelCancelChecked(TypeCancelRoom.SEARCH_CANCEL)}
                    >
                        {t("FRONTDESK.ROOMRACK.searchToCancel")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <CButtonFrontDesk className="mt-3" disabled={true}
            >
                {t("MISCELLANEOUS.option")}
            </CButtonFrontDesk>
            <CButtonFrontDesk className="mt-3" disabled={true}
            >
                {t("MISCELLANEOUS.convertData")}
            </CButtonFrontDesk>
            {isTracerModal && <TracerMessageModal
                title={t("BOOKING.RESERVATION.chooseInHouse")}
                isShowModal={isTracerModal}
                setIsShowModal={setIsTracerModal}
                isTracer={true}
            />}
            {isControlTracer && <ControlTracerModal
                setIsShowModal={setIsControlTracer}
                isShowModal={isControlTracer}
                title={"Manual Tracer Message"}
            />}
            {isChannelModalVisible &&
                <ChannelManagerModal isShowModal={isChannelModalVisible} setShowModal={setChannelModalVisible} />
            }
            {isRangePickerModal &&
                <ModalRangePicker
                    title={"Input"}
                    isLoading={loading}
                    isVisible={isRangePickerModal}
                    setVisible={setRangePickerModal}
                    handleOk={() => {
                        getAllotmentData();
                        setChannelAllotmentModalVisible(true);
                    }}
                >
                    <div className="flex justify-center">
                        <DatePicker.RangePicker
                            className={`${classesControls.datePicker}`}
                            value={date}
                            onChange={val => setDate(val)}
                        />
                    </div>
                </ModalRangePicker>
            }
            {isChannelAllomentModalVisible && dataAllotment &&
                <ModalAllotmentView
                    setVisible={setChannelAllotmentModalVisible}
                    visible={isChannelAllomentModalVisible}
                    date={date}
                    setDate={setDate}
                    dataAllotment={dataAllotment}
                    getAllotmentData={getAllotmentData}
                    loading={loading}
                    setLoading={setLoading}
                />
            }
        </div>
    );
};
export default React.memo(TracerColumn);
