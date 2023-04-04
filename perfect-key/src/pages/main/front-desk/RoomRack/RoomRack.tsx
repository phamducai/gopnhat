/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { Menu } from "antd";
import { TypeCancelRoom } from "common/enum/roomplan.enum";
import CButtonFrontDesk from "components/FrontDesk/CButtonFrontDesk";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import FrontDeskService from "services/frontdesk/frontdesk.service";
import "./style.css";
import { searchWithQueryParam } from 'redux/controller/booking.slice';
import CDropdown from "components/FrontDesk/CDropdown";
import { useStyleTheme } from "theme";
import { styleButtonDropdown } from "components/FrontDesk/style/styleButtonDropdown";
import GLobalPkm from "common/global";
import CancelCheckinModal from "../Modal/CancelCheckInModal"
import CArrivalDates from "components/CInputSearch/CArrivalDates"
import { useForm } from "react-hook-form";
import { ReservationStatus } from "common/enum/booking.enum";
import CModel from "components/CModal";
import { setDateInputCheckIn } from "redux/controller";
import Auth from "services/auth/auth.service";
import Role from "common/roles";
import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";

const { SubMenu } = Menu;
interface Props {
    isCashier: boolean
}
const RoomRack = ({ isCashier }: Props) => {
    const history = useHistory();
    const dispatch = useDispatchRoot();
    const classes = useStyleTheme(styleButtonDropdown);
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);


    const [showModalCancel, setShowModalCancel] = useState<boolean>(false);
    const [showModalArrival, setShowModalArrival] = useState<boolean>(false);
    const [dateArrival, setDateArrival] = useState<Date[]>([]);
    const { control, handleSubmit } = useForm();

    const { t } = useTranslation("translation");

    const handelCancelChecked = (type: number) => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            const resForm = FrontDeskService.handleCancelChecked(hotelId, type, numberOfRooms);
            dispatch(searchWithQueryParam(resForm.dataSearch));
            setShowModalCancel(true);
            setDateArrival(resForm.formSearch.dateArrival);
            //history.push("/main/booking/search", resForm.formSearch);
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const loadData = (date: Date) => {
        const arrivalDates = [date, date]
        const data: any = {
            pageNumber: 1,
            pageSize: 10,
            hotelGuid: hotelId,
            isOnlyMainGuest: false,
            rsvnNo: parseInt("0"),
            groupCode: "",
            rsvnCode: "",
            room: "",
            rsvnId: GLobalPkm.defaultBytes32,
            status: 0,
            profileIds: [],
            companyAgentGuid: GLobalPkm.defaultBytes32,
            roomType: GLobalPkm.defaultBytes32,
            arrivalDates: arrivalDates,
            departureDates: [],
            listRoomType: numberOfRooms
        }
        dispatch(setDateInputCheckIn(arrivalDates))
        dispatch(searchWithQueryParam(data));
    }

    const handTomorrow = () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            loadData(tomorrow);
            history.push("/main/front-desk/arrival-list")
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const handTody = () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            const today = new Date();
            loadData(today);
            history.push("/main/front-desk/arrival-list")
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const handByDate = () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            setShowModalArrival(true)
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const onSubmit = handleSubmit((formSearch: any) => {
        const arrivalDates = [formSearch.arrivalDates.from, formSearch.arrivalDates.to];
        const data: any = {
            pageNumber: 1,
            pageSize: 10,
            hotelGuid: hotelId,
            isOnlyMainGuest: false,
            rsvnNo: parseInt("0"),
            groupCode: "",
            rsvnCode: "",
            room: "",
            rsvnId: GLobalPkm.defaultBytes32,
            status: 0,
            profileIds: [],
            companyAgentGuid: GLobalPkm.defaultBytes32,
            roomType: GLobalPkm.defaultBytes32,
            arrivalDates: arrivalDates,
            departureDates: [],
            listRoomType: numberOfRooms
        }

        dispatch(setDateInputCheckIn(arrivalDates))
        dispatch(searchWithQueryParam(data));
        setShowModalArrival(false)
        history.push("/main/front-desk/arrival-list")
    });

    return (
        <div className={`${classes.AntBtnGroup}`} style={{ marginTop: "1rem" }}>
            {isCashier ?
                <CButtonFrontDesk className="mt-3" disabled={true}>
                    {"Billing System"}
                </CButtonFrontDesk>
                : ""
            }
            {!isCashier &&
                <Menu
                    style={{ marginTop: "1rem", marginLeft: "0.75rem" }}
                    className={`customer-icon mx-3 more-items w-full control-color-blue focus-grey ${classes.frontDeskControl}  `}
                    // mode="vertical"
                    triggerSubMenuAction="click"
                >
                    <SubMenu key="sub1" title={t("FRONTDESK.ROOMRACK.cancelCheckedIn")}
                        popupClassName={`${classes.controlSubMenu} `}
                        style={{ marginLeft: "1.5rem" }}
                    >
                        <Menu.Item
                            key={"sub11"}
                            className={` font-bold `}
                            onClick={() => handelCancelChecked(TypeCancelRoom.CHECKIN_TO_DAY)}
                        >
                            {t("FRONTDESK.ROOMRACK.cancelToday")}
                        </Menu.Item>
                        <Menu.Item
                            className={` font-bold `}
                            key={"sub12"}
                            onClick={() => handelCancelChecked(TypeCancelRoom.CHECKIN_YESTERDAY)}
                        >
                            {t("FRONTDESK.ROOMRACK.cancelYesterday")}
                        </Menu.Item>
                        <Menu.Item
                            className={` font-bold `}
                            key={"sub13"}
                            onClick={() => handelCancelChecked(TypeCancelRoom.SEARCH_CANCEL)}
                        >
                            {t("FRONTDESK.ROOMRACK.searchToCancel")}
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            }
            <CButtonFrontDesk className="mt-3"
                onClick={() => handelCancelChecked(TypeCancelRoom.CANCEL_CHECK_OUT)}
            >
                {t("FRONTDESK.ROOMRACK.cancelCheckedOut")}
            </CButtonFrontDesk>
            <CDropdown status={2} name={'Departure'}>
                {t("FRONTDESK.ROOMRACK.actualDeparture")}
            </CDropdown>
            <CDropdown status={12} name={"Departure"}>
                {t("FRONTDESK.ROOMRACK.expectedDeparture")}
            </CDropdown>
            {!isCashier ?
                <>
                    <CButtonFrontDesk className="mt-3" onClick={() => handTody()}>
                        {t("FRONTDESK.ROOMRACK.assignedCheckinToday")}
                    </CButtonFrontDesk>
                    <Menu
                        style={{ marginTop: "0.75rem", marginLeft: "0.75rem" }}
                        className={`customer-icon mx-3 more-items w-full ${classes.controlColorBlue} focus-grey ${classes.frontDeskControl}  `}
                        // mode="vertical"
                        triggerSubMenuAction="click"
                    >
                        <SubMenu key="sub1" title={t("FRONTDESK.ROOMRACK.assignedEarlyCheckin")}
                            popupClassName={`${classes.controlSubMenu}`}
                            style={{ marginLeft: "-1.8rem" }}
                        >
                            <Menu.Item
                                className="font-bold"
                                key={"sub11"}
                                onClick={() => handTomorrow()}
                            >
                                {t("FRONTDESK.ROOMRACK.Tomorrow")}
                            </Menu.Item>
                            <Menu.Item
                                className="font-bold"
                                key={"sub13"}
                                onClick={() => handByDate()}
                            >
                                {t("FRONTDESK.ROOMRACK.ByDate")}
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </>
                : ""}
            <CancelCheckinModal
                showModalCancel={showModalCancel}
                setShowModalCancel={setShowModalCancel}
                searchBy={ReservationStatus.CheckIn}
                dateArrival={dateArrival}
            />
            <CModel
                title="Arrival"
                visible={showModalArrival}
                onOk={() => onSubmit()}
                onCancel={() => setShowModalArrival(false)}
                width={"30%"}
                content={
                    <div className="flex justify-center">
                        <form onSubmit={onSubmit}>
                            <CArrivalDates
                                control={control}
                                dateArrival={dateArrival}
                            />
                        </form>
                    </div>
                }
            />
        </div>
    );
};
export default React.memo(RoomRack);
