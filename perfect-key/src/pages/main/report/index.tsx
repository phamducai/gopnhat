/* eslint-disable @typescript-eslint/no-unused-vars */
import CFormSearch from 'components/CFormSearch';
import CSidebar from 'components/CSidebar';
import React, { useState }  from 'react';
import { Helmet } from "react-helmet";
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { searchProfileIdsRequest, searchRequest, searchWithQueryParam, setTimeLineGuid
} from "redux/controller";
import { useHistory } from 'react-router';
import { IFormSearch } from 'common/define-booking';
import CLoading from 'components/CLoading';
import { styleFrontDesk } from 'pages/main/front-desk/styles/styleFrontDesk';
import { useStyleTheme } from 'theme';
import { useTranslation } from 'react-i18next';
import { Collapse} from 'antd';
import CTimelineBooking from '../booking/CTimelineBooking';
import CTipsAndGuides from '../booking/CTipsAndGuides';
import OptionReport from './Main';
import "./styles/styles.css";
import useWindowSize from 'hooks/useWindowSize';
const { Panel } = Collapse;

function Report(): JSX.Element {
    const classes = useStyleTheme(styleFrontDesk);
    const history = useHistory();
    const { hotelName, hotelId, isTimeLineGuid, numberOfRooms } = useSelectorRoot(state => state.app);
    const { loadingSearch, loading, loadingSearchProfile, companyAgent
    } = useSelectorRoot((state) => state.booking);
    const dispatch = useDispatchRoot();
    const { t } = useTranslation("translation")
    const size = useWindowSize();

    const [isIpadScreen, setIsIpadScreen] = useState(false)
    const [visible, setVisible] = useState(false)
    
    React.useEffect(() => {
        if(size === "md") {
            setIsIpadScreen(true) 
            setVisible(!visible)
        }else{
            setIsIpadScreen(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size])

    const handleSearch = (formSearch: IFormSearch) => {
        const data = {
            hotelGuid: hotelId,
            isOnlyMainGuest: formSearch.isOnlyMainGuest,
            arrivalDates: formSearch.dateArrival,
            departureDates: formSearch.dateDeparture,
            companyAgentGuid: formSearch.companyAgent,
            status: 1,
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
        history.push("booking/search", formSearch);
    };

    const selectCompanyAgent = (e: string) => {
        if (e && hotelId) 
            dispatch(searchProfileIdsRequest({ hotelGuid: hotelId, input: e}));
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
            <Helmet>
                <title>{hotelName} - Report</title>
            </Helmet>
            <CLoading visible={loading}>
                <div className="grid grid-cols-9 gap-2">
                    <div className="col-span-4 mt-1 flex items-center">
                        <label className={`${classes.breadcrumb} cursor-pointer`}>{t("REPORT.title")}</label>
                    </div>
                    <div className="col-span-12">
                        <OptionReport />
                    </div>
                    {/* <Collapse
                        onChange={(e) => {
                            dispatch(setTimeLineGuid(e.length > 0 ? false : true));
                        }}
                        className={`${classes.collapse} col-span-12`}
                        expandIcon={({ isActive }) => ""}
                        defaultActiveKey={['0']} ghost>
                        <Panel className="" header={
                            <div className="text-base font-bold flex items-center" style={{ color: "#00293B" }}>
                                {isTimeLineGuid ? t("BOOKING.show") : `${t("BOOKING.hidden")} ${t("BOOKING.resolvedTrace")} ${t("BOOKING.and")} ${t("BOOKING.tipAndGuide")}`}
                            </div>
                        } key="1">
                            <div className="grid grid-cols-12 gap-2 mt-3" style={{ visibility: isTimeLineGuid ? "hidden" : "visible" }}>
                                <CTimelineBooking className={`col-span-12 xl:col-span-7`} />
                                <CTipsAndGuides className={`${classes.bgTipsAndGuides} col-span-12 xl:col-span-5`} />
                            </div>
                        </Panel>
                    </Collapse> */}
                </div>
            </CLoading>
        </CSidebar >
    )
}
export default Report