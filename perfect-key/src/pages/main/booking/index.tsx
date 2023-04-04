/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useStyleTheme } from 'theme';
import CTableBooking from './CTableBooking';
import CTipsAndGuides from './CTipsAndGuides';
import CTimelineBooking from './CTimelineBooking';
import CFormSearch from '../../../components/CFormSearch';
import { IFormSearch } from 'common/define-booking';
import CHeaderBooking from './CHeaderBooking';
import CSidebar from 'components/CSidebar';
import SearchResults from './searchResults';
import CLoading from 'components/CLoading';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import {  searchRequest, fetchReservatedRooms, searchProfileIdsRequest, searchWithQueryParam, setFormSearchQuery, setTimeLineGuid } from 'redux/controller';
import CViewStyle from './CViewStyle';
import Utils from 'common/utils';
import { useHistory } from 'react-router';
import { Collapse } from 'antd';
import useGetDimElement from 'hooks/useGetDimElement';
import { Helmet } from "react-helmet";
import { styleBooking } from './styles/styleBooking';
import { fetchNumberOfRooms } from 'redux/controller/reservation.slice';
import { useTranslation } from 'react-i18next';
import useWindowSize from 'hooks/useWindowSize';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';
import CUnAuthorzied from 'components/CUnAuthorzied';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';

const { Panel } = Collapse;

function CBooking(): JSX.Element {
    const classes = useStyleTheme(styleBooking);
    const [selectedViewStyle, setSelectedViewStyle] = useState<string>();
    const dispatch = useDispatchRoot();
    const size = useWindowSize();
    const { room, roomType, reservatedRooms, loadingSearch, loading, loadingTable, loadingSearchProfile, companyAgent, changeStatusProfiles } = useSelectorRoot(state => state.booking)
    const formSearchState = useSelectorRoot(state => state.booking.formSearch);
    const { hotelId, isTimeLineGuid, numberOfRooms, roomTypePMId } = useSelectorRoot(state => state.app)
    const history = useHistory()
    const arrPathname = history.location.pathname.toString().split("/")
    const pathname = arrPathname[arrPathname.length - 1]
    const [hiddenCollapse, setHiddenCollapse] = useState(isTimeLineGuid)
    const { refElement, dimElement } = useGetDimElement()
    const hotel = useSelectorRoot(state => state.app.hotelName);
    const [isIpadScreen, setIsIpadScreen] = useState(false)
    const [visible, setVisible] = useState(false)
    const { t } = useTranslation("translation")
    const selectCompanyAgent = (e: string) => {
        if (hotelId) {
            dispatch(searchProfileIdsRequest({
                hotelGuid: hotelId,
                input: e ? e : "g"
            }));
        }
    }

    const handleSearch = (formSearch: IFormSearch | any) => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {

            dispatch(setFormSearchQuery(formSearch));
            if (pathname !== 'search') {
                history.push(`${history.location.pathname}/search`, formSearch)
            } else {
                history.push(`search`, undefined)
            }
            const data = {
                pageNumber: changeStatusProfiles ? formSearchState.pageNumber : 1,
                pageSize: formSearchState.pageSize !== 1 ? formSearchState.pageSize : 10,
                hotelGuid: hotelId,
                isOnlyMainGuest: formSearch.isOnlyMainGuest,
                arrivalDates: formSearch.dateArrival,
                departureDates: formSearch.dateDeparture,
                companyAgentGuid: formSearch.companyAgent,
                status: formSearch?.searchBy,
                rsvnCode: '',
                rsvnNo: formSearch.rsvn,
                room: formSearch.room,
                availableDate: formSearch?.availableDate,
                profiles: {
                    phone: formSearch.phone,
                    passport: formSearch.passport,
                    firstName: formSearch.firstName,
                    guestName: formSearch.guestName
                },
                roomType: formSearch.roomType,
                groupCode: formSearch.groupCode,
                listRoomType: numberOfRooms //roomType
            }
            if (!formSearch?.firstName && !formSearch?.guestName && !formSearch?.passport && !formSearch?.phone) {
                dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
            } else {
                dispatch(searchRequest(data))
            }
            size === "md" && setVisible(false)
        } else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    useEffect(() => {
        ///pathname !== 'search' && dispatch(getReservation(hotelId))
        // dispatch(fetchNumberOfRooms({
        //     hotelGuid: hotelId
        // }));
        dispatch(fetchReservatedRooms({
            numberOfRooms: numberOfRooms.filter(x => x.id !== roomTypePMId),
        }))
    }, [hotelId])

    React.useEffect(() => {
        if (size === "md") {
            setIsIpadScreen(true)
            setVisible(!visible)
        } else {
            setIsIpadScreen(false)
        }
    }, [size])

    const handleSelectDate = (e: {
        fromDate: Date,
        toDate: Date
    }) => {
        dispatch(fetchReservatedRooms({
            numberOfRooms: numberOfRooms.filter(x => x.id !== roomTypePMId),
            arivalDay: Utils.formatDateCallApi(e.fromDate),
            depatureDay: Utils.formatDateCallApi(e.toDate)
        }))
    }

    const handleAddBooking = (data: {
        dateArrival: Date,
        dateDeparture: Date
    }) => {
        history.push("booking/new", data);
    }
    return (<>
        <Helmet>
            <title>{hotel} - Booking</title>
        </Helmet>
        {
            Auth.hasRole(Role.FO_FOM_GM) ?
                <CSidebar
                    className=""
                    setVisible={setVisible}
                    visible={visible}
                    isIpadScreen={isIpadScreen}
                    contentSidebar={
                        <CFormSearch className={``}
                            isLoading={loadingSearch || loading}
                            loadingSearchProfile={loadingSearchProfile}
                            companyAgent={companyAgent}
                            propsOnChange={handleSearch}
                            selectCompanyAgent={selectCompanyAgent} />
                    } >

                    <CLoading visible={loading}>
                        {pathname !== "search" ?
                            <div>
                                <div ref={refElement} className="grid grid-cols-6 xl:grid-cols-12 gap-2">
                                    <div className="col-span-5">
                                        <div className={`${classes.breadcrumb} col-span-12 w-full`}><span className="cursor-pointer">{t("BOOKING.booking")} | <span className="opacity-50">{t("BOOKING.roomForecast")}</span></span></div>
                                        <div className={`${classes.selectedRoom} col-span-12 mt-2`}>
                                            <CViewStyle selectedViewStyle={(e: string) => setSelectedViewStyle(e)} />
                                        </div>
                                    </div>
                                    <CHeaderBooking className={`col-span-7`}
                                        visible={loadingTable}
                                        setSelectedDate={handleSelectDate} />
                                </div>
                                <CLoading visible={loadingTable}>
                                    <CTableBooking
                                        heightHeader={dimElement?.clientHeight}
                                        hiddenCollapse={hiddenCollapse}
                                        onClickValue={(formSearch: any) => handleSearch({ ...formSearch, searchBy: 5 })}
                                        room={room}
                                        selectedViewStyle={selectedViewStyle}
                                        reservatedRooms={reservatedRooms}
                                        handleAddBooking={handleAddBooking}
                                        className={`mt-3`} />
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
                                <div className="grid grid-cols-12 gap-2 mt-3" style={{ visibility: isTimeLineGuid ? "hidden" : "visible"}}>
                                    <CTimelineBooking className={`col-span-12 xl:col-span-7`} />
                                    <CTipsAndGuides className={`${classes.bgTipsAndGuides} col-span-12 xl:col-span-5`} />
                                </div>
                            </Panel>
                        </Collapse> */}
                            </div>
                            :
                            <SearchResults className="" />
                        }
                    </CLoading>

                </CSidebar>
                :
                <CUnAuthorzied />
        }
    </>
    )
}

const Booking = React.memo(CBooking);
export default Booking