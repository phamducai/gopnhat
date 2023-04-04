import { Col, Row } from "antd";
import { IFormSearch } from "common/define-booking";
import CFormSearch from "components/CFormSearch";
import CLoading from "components/CLoading";
import CSidebar from "components/CSidebar";
import useWindowSize from "hooks/useWindowSize";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { getListHouseKeeping, searchProfileIdsRequest, searchRequest, searchWithQueryParam } from "redux/controller";
import { listDmucColorRequest, setListEmptyRooms } from 'redux/controller/frontdesk/roomplan.slice';
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { useStyleTheme } from "theme";
import HouseStatus from "../front-desk/houseStatus/HouseStatus";
import { styleFrontDesk } from "../front-desk/styles/styleFrontDesk";
import TableStatistic from "../front-desk/table/TableStatistic";
import MessageColumn from "./MessageColumn";
import TracerColumn from "./TracerColumn";

function Miscellaneous(): JSX.Element {
    const { loadingSearch, loading, loadingSearchProfile, companyAgent,
    } = useSelectorRoot((state) => state.booking);
    const dispatch = useDispatchRoot();
    const history = useHistory();
    const size = useWindowSize();
    const arrPathname = history.location.pathname.toString().split("/");
    const pathname = arrPathname[arrPathname.length - 1];
    const { hotelId, numberOfRooms } = useSelectorRoot((state) => state.app);
    const hotel = useSelectorRoot(state => state.app.hotelName);
    const classes = useStyleTheme(styleFrontDesk);
    const { t } = useTranslation("translation")
    const [isIpadScreen, setIsIpadScreen] = useState(false)
    const [visible, setVisible] = useState(false)

    React.useEffect(() => {
        dispatch(listDmucColorRequest(true));
        dispatch(setListEmptyRooms([]));
        dispatch(getListHouseKeeping(hotelId))  //getDateHouseKeeping
    }, [dispatch, hotelId])

    React.useEffect(() => {
        if(size === "md") {
            setIsIpadScreen(true) 
            setVisible(!visible)
        }else{
            setIsIpadScreen(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size])

    const selectCompanyAgent = (e: string) => {
        if (e && hotelId)
            dispatch(searchProfileIdsRequest({ hotelGuid: hotelId, input: e }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSearch = (formSearch: IFormSearch | any) => {
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
            rsvnId: formSearch.rsvn,
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
    };

    return (
        <CSidebar
            className=""
            setVisible={setVisible}
            visible={visible}
            isIpadScreen={isIpadScreen}
            contentSidebar={
                <CFormSearch
                    isLoading={loadingSearch || loading}
                    loadingSearchProfile={loadingSearchProfile}
                    companyAgent={companyAgent}
                    propsOnChange={handleSearch}
                    selectCompanyAgent={selectCompanyAgent}
                />
            }
        >
            <div>
                <CLoading visible={loading}>
                    <Helmet>
                        <title>{hotel} - Miscellaneous</title>
                    </Helmet>
                    <div className="grid grid-cols-12 gap-2 mt-3">
                        <div className="col-span-12 xl:col-span-4">
                            <label className={`${classes.breadcrumb} cursor-pointer`}>{t("MISCELLANEOUS.miscellaneous")}</label>
                            <TableStatistic />
                        </div>
                        <div className="col-span-12 xl:col-span-8 ml-2 mt-8">
                            <Row gutter={[16, 0]}>
                                <Col span={8} style={{ paddingRight: "0px !important" }}>
                                    <HouseStatus />
                                </Col>
                                <Col span={8}>
                                    <TracerColumn />
                                </Col>
                                <Col span={8}>
                                    <MessageColumn />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </CLoading>
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
            </div >
        </CSidebar >
    );
}

export default Miscellaneous;