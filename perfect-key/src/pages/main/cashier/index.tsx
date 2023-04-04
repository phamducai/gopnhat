import CFormSearch from 'components/CFormSearch';
import CSidebar from 'components/CSidebar';
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import {
    getListHouseKeeping, searchProfileIdsRequest, searchRequest, searchWithQueryParam
} from "redux/controller";
import { useHistory } from 'react-router';
import { IFormSearch } from 'common/define-booking';
import CLoading from 'components/CLoading';
import TableStatistic from 'pages/main/front-desk/table/TableStatistic';
import { styleFrontDesk } from 'pages/main/front-desk/styles/styleFrontDesk';
import { useStyleTheme } from 'theme';
import { useTranslation } from 'react-i18next';
import HouseStatus from 'pages/main/front-desk/houseStatus/HouseStatus';
import house from "image/house.png";
import gridIcon from "image/dashboard_grid.svg";
import houseIcon from "image/dashboard_house.svg";
import RoomRack from 'pages/main/front-desk/RoomRack/RoomRack';
import RoomPlan from 'pages/main/front-desk/RoomPlan/RoomPlan';
import { listDmucColorRequest, setListEmptyRooms } from 'redux/controller/frontdesk/roomplan.slice';
import SearchCashier from './Main/SearchCashier';
import { Button, Pagination } from 'antd';
import CIconSvg from 'components/CIconSvg';
import RunNight from './RunNight';
import GLobalPkm from 'common/global';
import useWindowSize from 'hooks/useWindowSize';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';
import { NotificationStatus } from 'common/enum/shared.enum';
import openNotification from 'components/CNotification';

function Cashier(): JSX.Element {
    const classes = useStyleTheme(styleFrontDesk);
    const history = useHistory();
    const { hotelName, hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const { loading, loadingSearchProfile, companyAgent, inforPage, formSearch,
    } = useSelectorRoot((state) => state.booking);
    const dispatch = useDispatchRoot();
    const { t } = useTranslation("translation")
    const size = useWindowSize();

    const [isIpadScreen, setIsIpadScreen] = useState(false)
    const [visible, setVisible] = useState(false)
    const [isShowRunNight, setShowRunNight] = useState<boolean>(false);

    React.useEffect(() => {
        dispatch(listDmucColorRequest(true));
        dispatch(setListEmptyRooms([]));
        dispatch(getListHouseKeeping(hotelId))
        const data = {
            hotelGuid: hotelId,
            status: 1,
            listRoomType: numberOfRooms
        }
        dispatch(searchWithQueryParam({ ...data, profileIds: [] }));
    }, [dispatch, hotelId, numberOfRooms])

    React.useEffect(() => {
        if (size === "md") {
            setIsIpadScreen(true)
            setVisible(!visible)
        } else {
            setIsIpadScreen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size])

    const handleSearch = (formSearch: IFormSearch, isRedirect = true) => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
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
            if (isRedirect) {
                history.push("booking/search", formSearch);
            }
        } else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    };

    const selectCompanyAgent = (e: string) => {
        if (e && hotelId)
            dispatch(searchProfileIdsRequest({ hotelGuid: hotelId, input: e }));
    };
    const goRoomPlan = () => {
        if (Auth.hasRole(Role.FO_FOM_GM_HSKP)) {
            history.push({ pathname: "/main/front-desk/room-plan" });
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }
    const goRoomRack = () => {
        if (Auth.hasRole(Role.FO_FOM_GM_HSKP)) {
            history.push({ pathname: "/main/front-desk/room-rack" });
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }
    const onPagination = (pageNumber: number, pageSize: number) => {
        const dataSearch = {
            ...formSearch,
            pageNumber: pageNumber,
            pageSize: pageSize,
            listRoomType: numberOfRooms
        }
        dispatch(searchWithQueryParam(dataSearch));
    }
    return (
        <CSidebar
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
            <Helmet>
                <title>{hotelName} - Cashier</title>
            </Helmet>
            <CLoading visible={loading}>
                <div className="grid grid-cols-9 gap-2">
                    <div className="col-span-12 xl:col-span-3 mt-1">
                        <label className={`${classes.breadcrumb} cursor-pointer`}>{t("CASHIER.cashier")}</label>
                        {(size !== "md" && size !== "lg") ? <TableStatistic /> : ""}
                    </div>
                    {(size === "md" || size === "lg") ?
                        <div className="grid grid-cols-4 gap-2 col-span-12">
                            <button
                                className={`${classes.btn} col-span-1 text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center`}
                            >
                                <img src={house} className="px-3" alt="" />
                                {t("FRONTDESK.houseStatus")}
                            </button>
                            <button
                                className={`${classes.btn} col-span-1 text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center`}
                                onClick={goRoomRack}
                            >
                                <img src={gridIcon} className="px-3" alt="" />
                                {t("FRONTDESK.roomRack")}
                            </button>
                            <button
                                className={`${classes.btn} col-span-1 text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center`}
                                onClick={goRoomPlan}
                            >
                                <img src={houseIcon} className="px-3" alt="" /> {t("FRONTDESK.roomPlan")}
                            </button>
                            {/* UI Run Night btn for < desktop */}
                            <button
                                className={`${classes.btn} col-span-1 text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center`}
                                onClick={(e) => {
                                    if (Auth.hasRole(Role.NIGHT_AUDITOR)) {
                                        setShowRunNight(true);
                                    }
                                    else {
                                        openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
                                    }
                                }}
                            >
                                <CIconSvg
                                    name={"end-of-day"}
                                    svgSize="default"
                                    colorSvg={'light'} />
                                Run Night
                            </button>
                            <div className="col-span-2" style={{ marginTop: "-0.86em" }}>
                                <TableStatistic />
                            </div>
                            <div className="col-span-2">
                                <HouseStatus />
                            </div>
                            <div className="col-span-2">
                                <RoomRack isCashier={true} />
                            </div>
                            <div className="col-span-2">
                                <RoomPlan isCashier={true} />
                            </div>
                        </div>
                        :
                        <React.Fragment>
                            <div className="col-span-12 xl:col-span-2">
                                <button
                                    className={`${classes.btn} text-white font-bold py-2 px-4 rounded flex justify-center`}
                                >
                                    <img src={house} className="px-3" alt="" />
                                    {t("FRONTDESK.houseStatus")}
                                </button>
                                <HouseStatus />
                            </div>
                            <div className="col-span-12 xl:col-span-2">
                                <button
                                    className={`${classes.btn} text-white font-bold py-2 px-4 rounded  flex justify-center ml-3`}
                                    onClick={goRoomRack}
                                >
                                    <img src={gridIcon} className="px-3" alt="" />
                                    {t("FRONTDESK.roomRack")}
                                </button>
                                <RoomRack isCashier={true} />
                                <button
                                    className={`${classes.btn} text-white font-bold py-2 px-4 rounded  flex items-center gap-3 justify-center ml-3 mt-3`}
                                    onClick={(e) => {
                                        if (Auth.hasRole(Role.NIGHT_AUDITOR)) {
                                            setShowRunNight(true);
                                        }
                                        else {
                                            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
                                        }
                                    }}
                                >
                                    <CIconSvg
                                        name={"end-of-day"}
                                        svgSize="default"
                                        colorSvg={'light'} />
                                    Run Night
                                </button>
                            </div>

                            <div className="col-span-12 xl:col-span-2">
                                <button
                                    className={`${classes.btn} text-white font-bold py-2 px-4 rounded flex justify-center ml-3`}
                                    onClick={goRoomPlan}
                                >
                                    <img src={houseIcon} className="px-3" alt="" /> {t("FRONTDESK.roomPlan")}
                                </button>
                                <RoomPlan isCashier={true} />
                            </div>
                        </React.Fragment>
                    }
                    <div className="col-span-12 my-3" style={{ height: 3, background: "#00293B", opacity: 0.05 }} />
                    <div className="col-span-12 relative">
                        {Auth.hasRole(Role.FO_FOM_GM)
                            ?
                            <>
                                <SearchCashier
                                    handleSearch={handleSearch}
                                    visible={visible}
                                />
                                <div className={`w-full flex justify-end absolute z-50`} style={{ marginTop: "-4rem" }}>
                                    <Pagination
                                        size="default"
                                        showQuickJumper={{ goButton: <Button>{t("BOOKING.SEARCHVALUE.ok")}</Button> }}
                                        showSizeChanger
                                        current={inforPage.CurrentPage}
                                        pageSize={inforPage.PageSize}
                                        pageSizeOptions={["10", "20", "50"]}
                                        total={inforPage.TotalCount}
                                        onChange={(page, pageSize) => onPagination(page, pageSize ?? 10)}
                                        showTotal={total => `Total ${total} item`}
                                    />
                                </div>
                            </>
                            : <></>}

                    </div>
                </div>
            </CLoading>
            {isShowRunNight ?
                <RunNight
                    isShowModal={isShowRunNight}
                    setShowModal={setShowRunNight}
                />
                : ""}
        </CSidebar >
    )
}
export default Cashier