/* eslint-disable */
import { Col, Collapse, Row } from "antd";
import { IReqStatistic } from "common/dashboard/PropsDashboard";
import { IFormSearch } from "common/define-booking";
import { NotificationStatus } from "common/enum/shared.enum";
import GLobalPkm from "common/global";
import Role from "common/roles";
import Utils from "common/utils";
import CFormSearch from "components/CFormSearch";
import CLoading from "components/CLoading";
import openNotification from "components/CNotification";
import CSidebar from "components/CSidebar";
import useWindowSize from "hooks/useWindowSize";
import gridIcon from "image/dashboard_grid.svg";
import houseIcon from "image/dashboard_house.svg";
import house from "image/house.png";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import {
    getListHouseKeeping, reqListRevenueInDay, searchProfileIdsRequest, searchRequest, searchWithQueryParam
} from "redux/controller";
import { listDmucColorRequest, setListEmptyRooms } from 'redux/controller/frontdesk/roomplan.slice';
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import Auth from "services/auth/auth.service";
import DashBoardService from "services/dashboard/dashboard.service";
import { useStyleTheme } from "theme";
import HouseStatus from "./houseStatus/HouseStatus";
import RoomPlan from "./RoomPlan/RoomPlan";
import RoomRack from "./RoomRack/RoomRack";
import { styleFrontDesk } from "./styles/styleFrontDesk";
import TableStatistic from "./table/TableStatistic";

function FrontDesk(): JSX.Element {
    const { loading, loadingSearchProfile, companyAgent,
    } = useSelectorRoot((state) => state.booking);
    const dispatch = useDispatchRoot();
    const history = useHistory();
    const arrPathname = history.location.pathname.toString().split("/");
    const pathname = arrPathname[arrPathname.length - 1];
    const { hotelId, numberOfRooms } = useSelectorRoot((state) => state.app);
    const { businessDate } = useSelectorRoot((state) => state.hotelConfig);
    const hotel = useSelectorRoot(state => state.app.hotelName);
    const classes = useStyleTheme(styleFrontDesk);
    const { t } = useTranslation("translation")
    const size = useWindowSize();

    const [isIpadScreen, setIsIpadScreen] = useState(false)
    const [visible, setVisible] = useState(false)

    const dataRevenueInLNext7Day = async (dataRevenue: IReqStatistic) => {
        try {
            const res = await DashBoardService.getRevenueInDay(dataRevenue)
            dispatch(reqListRevenueInDay(res))
        } catch (error) {
            throw error
        }
    }
    React.useEffect(() => {
        try {
            dispatch(listDmucColorRequest(true));
            dispatch(setListEmptyRooms([]));
            dispatch(getListHouseKeeping(hotelId))  //getDateHouseKeeping
            const roomTypeGuid = GLobalPkm.defaultBytes32

            // dataRevenueLast7Day({hotelGuid: hotelId, roomTypeGuid, arrivalDate: arrivalDateLast7, departureDate: departureLast7, businessDate})// getRevenueInLast7Day
            dataRevenueInLNext7Day({ hotelGuid: hotelId, roomTypeGuid, arrivalDate: Utils.convertStartDate(businessDate), departureDate: Utils.convertEndDate(businessDate) }) // getRevenueInLNext7Day
        } catch (error) {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }

    }, [])

    React.useEffect(() => {
        if (size === "md") {
            setIsIpadScreen(true)
            setVisible(!visible)
        } else {
            setIsIpadScreen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size])

    const selectCompanyAgent = (e: string) => {
        if (e && hotelId)
            dispatch(searchProfileIdsRequest({ hotelGuid: hotelId, input: e }));
    };

    const handleSearch = (formSearch: IFormSearch | any) => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            if (pathname !== "search") {
                history.push("booking/search", formSearch);
            } else {
                history.push("search", undefined);
            }
            const data = {
                hotelGuid: hotelId,
                isOnlyMainGuest: formSearch.isOnlyMainGuest,
                arrivalDates: formSearch.dateArrival,
                departureDates: formSearch.dateDeparture,
                companyAgentGuid: formSearch.companyAgent,
                status: formSearch?.searchBy,
                rsvnCode: "",
                rsvnId: formSearch.rsvn === "" ? GLobalPkm.defaultBytes32 : formSearch.rsvn,
                rsvnNo: formSearch.rsvn,
                room: formSearch.room,
                availableDate: formSearch?.availableDate,
                profiles: {
                    phone: formSearch.phone,
                    passport: formSearch.passport,
                    firstName: formSearch.firstName,
                    guestName: formSearch.guestName,
                },
                roomType: formSearch.roomType,
                listRoomType: numberOfRooms,
            };
            if (
                !formSearch?.firstName &&
                !formSearch?.guestName &&
                !formSearch?.passport &&
                !formSearch?.phone
            ) {
                dispatch(searchWithQueryParam({ ...data, profileIds: [] }));
            } else {
                dispatch(searchRequest(data));
            }
            size === "md" && setVisible(false)
        } else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    };
    const goRoomPlan = () => {
        history.push({ pathname: "/main/front-desk/room-plan" });
    }
    const goRoomRack = () => {
        history.push({ pathname: "/main/front-desk/room-rack" });
    }
    return (
        <CLoading visible={loading}>
            <Helmet>
                <title>{hotel} - Front Desk</title>
            </Helmet>
            <CSidebar
                className=""
                setVisible={setVisible}
                visible={visible}
                isIpadScreen={isIpadScreen}
                contentSidebar={
                    <CFormSearch
                        isLoading={loading}
                        loadingSearchProfile={loadingSearchProfile}
                        companyAgent={companyAgent}
                        propsOnChange={handleSearch}
                        selectCompanyAgent={selectCompanyAgent}
                    />
                }
            >
                <div className="grid grid-cols-12 gap-2 mt-3">
                    <div className="col-span-12 xl:col-span-4">
                        <label className={`${classes.breadcrumb} cursor-pointer`}>{t("FRONTDESK.frontDesk")}</label>
                        {(size !== "md" && size !== "lg") ? <TableStatistic /> : ""}
                    </div>
                    {(size === "md" || size === "lg") ?
                        <div className="grid grid-cols-6 gap-2 col-span-12">
                            <button
                                className={`${classes.btn} col-span-2 text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center`}
                            >
                                <img src={house} className="px-3" alt="" />
                                {t("FRONTDESK.houseStatus")}
                            </button>
                            <button
                                className={`${classes.btn} col-span-2 text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center`}
                                onClick={goRoomRack}
                            >
                                <img src={gridIcon} className="px-3" alt="" />
                                {t("FRONTDESK.roomRack")}
                            </button>
                            <button
                                className={`${classes.btn} col-span-2 text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center`}
                                onClick={goRoomPlan}
                            >
                                <img src={houseIcon} className="px-3" alt="" /> {t("FRONTDESK.roomPlan")}
                            </button>
                            <div className="col-span-3" style={{ marginTop: "-0.86em" }}>
                                <TableStatistic />
                            </div>
                            <div className="col-span-3">
                                <HouseStatus />
                            </div>
                            <div className="col-span-3">
                                <RoomRack isCashier={false} />
                            </div>
                            <div className="col-span-3">
                                <RoomPlan isCashier={false} />
                            </div>
                        </div>
                        :
                        <div className="col-span-12 xl:col-span-8 ml-2">
                            <Row gutter={[16, 0]}>
                                <Col span={8} sm={{ span: 24 }} xl={{ span: 8 }} style={{ paddingRight: "0px !important", marginTop: "10px" }}>
                                    <button
                                        className={`${classes.btn} text-white font-bold py-2 px-4 rounded flex justify-center col-span-2`}
                                    >
                                        <img src={house} className="px-3" alt="" />
                                        {t("FRONTDESK.houseStatus")}
                                    </button>
                                    <HouseStatus />
                                </Col>
                                <Col span={8} sm={{ span: 24 }} md={{ span: 12 }} xl={{ span: 8 }} style={{ marginTop: "10px" }}>
                                    <button
                                        className={`${classes.btn} mx-3 text-white font-bold py-2 px-4 rounded flex justify-center col-span-2`}
                                        onClick={goRoomRack}
                                    // disabled={true}
                                    >
                                        <img src={gridIcon} className="px-3" alt="" />
                                        {t("FRONTDESK.roomRack")}
                                    </button>
                                    <RoomRack isCashier={false} />
                                </Col>
                                <Col span={8} sm={{ span: 24 }} md={{ span: 12 }} xl={{ span: 8 }} style={{ marginTop: "10px" }}>
                                    <button
                                        className={`${classes.btn} mx-3 text-white font-bold py-2 px-4 rounded flex justify-center col-span-2`}
                                        onClick={goRoomPlan}
                                    >
                                        <img src={houseIcon} className="px-3" alt="" /> {t("FRONTDESK.roomPlan")}
                                    </button>
                                    <RoomPlan isCashier={false} />
                                </Col>
                            </Row>
                        </div>
                    }
                </div>
                {/* <Collapse
                    onChange={(e) => {
                        dispatch(setTimeLineGuid(e.length > 0 ? false : true));
                    }}
                    className={`${classes.collapse}`}
                    expandIcon={({ isActive }) => ""}
                    defaultActiveKey={['0']} ghost>
                    <Panel className="" header={
                        <div className="text-base font-bold flex items-center" style={{ color: "#00293B" }}>
                            {isTimeLineGuid ? t("BOOKING.show") : t("BOOKING.hidden")} "{t("BOOKING.resolvedTrace")}" {t("BOOKING.and")} "{t("BOOKING.tipAndGuide")}"
                        </div>
                    } key="1">
                        <div className="grid grid-cols-12 gap-2 mt-3" style={{ visibility: isTimeLineGuid ? "hidden" : "visible" }}>
                            <CTimelineBooking className={`col-span-12 xl:col-span-7`} />
                            <CTipsAndGuides className={`${classes.bgTipsAndGuides} col-span-12 xl:col-span-5`} />
                        </div>
                    </Panel>
                </Collapse> */}
            </CSidebar >
        </CLoading>

    );
}

export default FrontDesk;