/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useStyleTheme } from "theme/Theme";
import CEndOfDay from './CEndOfDay';
import CRevenue from './CRevenue';
import CChartCircle from './CChartCircle';
import CFrontDesk from './CFrontDesk';
import Cashier from "./CCashier";
import Statistic from "./CStatistic";
import CScrollView from 'components/CScrollView';
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { styleDashboard } from './style/styleDashboard';
import { listStaticGuest, setAvaiableToNight, setRoomTypeLoadPage } from 'redux/controller';
import Utils from 'common/utils';
import StatisticService from 'services/frontdesk/statistic.service';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import { IResArrivalsDepartures } from 'common/model-statistic';
import { addDays } from 'date-fns';
import GLobalPkm from 'common/global';
import Auth from "services/auth/auth.service";
import Role from 'common/roles';
import CUnAuthorzied from 'components/CUnAuthorzied';

function Dashboard(): JSX.Element {
    const classes = useStyleTheme(styleDashboard);
    const { hotelName, hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { t } = useTranslation("translation")
    const dispatch = useDispatchRoot();

    const roomTypeGuid = GLobalPkm.defaultBytes32

    useEffect(() => {
        dispatch(setRoomTypeLoadPage({ hotelGuid: hotelId }))
    }, [hotelId, dispatch])

    useEffect(() => {
        const arrivalDate = Utils.convertMiddleDate(businessDate)
        const departureDate = Utils.convertMiddleDate(addDays(new Date(businessDate), 1))
        const loadFrontDesk = async () => { //getRoomAndGuestByDate
            const date = Utils.convertMiddleDate(businessDate)
            const response: IResArrivalsDepartures = await StatisticService.getRoomAndGuestByDate(hotelId, date);
            dispatch(listStaticGuest(response))
        }
        const getAvailableRooms = async () => { // getAvailableRooms
            const roomTypeGuid = GLobalPkm.defaultBytes32
            const dataRooms = await RoomPlanService.getAvailableRooms(hotelId, roomTypeGuid, arrivalDate, departureDate);
            dispatch(setAvaiableToNight(dataRooms.length))
        }
        businessDate && loadFrontDesk()
        businessDate && getAvailableRooms()
        //eslint-disable-next-line
    }, [hotelId, businessDate, roomTypeGuid])

    return (
        <CScrollView overlayClassScroll="custom-scrollbar-pkm" className={`${classes.dashboard} p-4 lg:p-7`}>
            <Helmet>
                <title>{hotelName} - {t("DASHBOARD.dashboard")}</title>
            </Helmet>
            {Auth.hasRole(Role.FO_FOM_GM) ?
                <>
                    <div className={`${classes.dashboardTitle} flex items-center font-semibold mb-3`}>{t("DASHBOARD.overviewSummary")}</div>
                    <div className="grid mx-auto grid-cols-12 gap-2 mb-2">
                        <CEndOfDay className="col-span-12 order-1 sm:col-span-6 xl:col-span-3 xl:order-1" />
                        <CRevenue className={`col-span-12 order-3 sm:col-span-12 xl:col-span-5 xl:order-2`} />
                        <CChartCircle className={`col-span-12 order-2 sm:col-span-6 xl:col-span-4 xl:order-3`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className={`grid grid-cols-10 xl:col-span-1 lg:col-span-2 md:col-span-2 col-span-2 gap-2`}>
                            <CFrontDesk className={`col-span-10 xl:col-span-10 lg:col-span-5 md:col-span-5 `} />
                            <Cashier className={`col-span-10 xl:col-span-10 lg:col-span-5 md:col-span-5 `} />
                            {/* <CHouseKeeping className={`col-span-10`} />  */}
                        </div>
                        <div className={`grid grid-cols-10 xl:col-span-1 col-span-2 `}>
                            <div className="col-span-10">
                                <Statistic />
                            </div>
                            <div className={`col-span-10`}>
                                {/*  <CTimeline />  */}
                            </div>
                        </div>
                    </div>
                </> :
                <CUnAuthorzied />
            }

        </CScrollView>
    )
}

export default React.memo(Dashboard)