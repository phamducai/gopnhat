/* eslint-disable react-hooks/exhaustive-deps */
import ClassBox from 'components/CClassBox';
import React, { useEffect } from 'react';
import { useStyleTheme } from 'theme';
import { styleHouseStatus } from './styles/styleHouseStatus';
import { useTranslation } from 'react-i18next';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import Utils from 'common/utils';
import { addDays } from 'date-fns';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import { setAvaiableToNight } from 'redux/controller';
import GLobalPkm from 'common/global';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';
import CUnAuthorzied from 'components/CUnAuthorzied';

const HouseStatus = (props: Props): JSX.Element => {
    const classes = useStyleTheme(styleHouseStatus);
    const { availableTonight, listHousekeeping, revenueInDay, listStatisticGuest } = useSelectorRoot(state => state.frontdesk);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { t } = useTranslation("translation");
    const dispatch = useDispatchRoot();

    const arrivalDate = Utils.convertMiddleDate(businessDate)
    const departureDate = Utils.convertMiddleDate(addDays(new Date(businessDate), 1))

    const revenueInBusinessDate = revenueInDay.find((item) => item.Key === Utils.formatDateCallApi(businessDate))?.Value ?? 0

    const widhProgress = Object.is(NaN, (listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room) * 100)) ? 0 : (listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room) * 100).toFixed(2)

    const averageDaily = Object.is(NaN, (revenueInBusinessDate / (availableTonight + listStatisticGuest.inHouse.room))) ? 0 : (revenueInBusinessDate / (listStatisticGuest.walkIns.room + listStatisticGuest.inHouse.room))

    useEffect(() => {
        getAvailableRooms()
    }, [hotelId, businessDate, dispatch])

    const getAvailableRooms = async () => { // getAvailableRooms
        const roomTypeGuid = GLobalPkm.defaultBytes32
        const dataRooms = await RoomPlanService.getAvailableRooms(hotelId, roomTypeGuid, arrivalDate, departureDate);
        dispatch(setAvaiableToNight(dataRooms.length))
    }

    return (
        <React.Fragment>
            <ClassBox className={`${classes.classBox} mt-4`}>
                {Auth.hasRole(Role.FO_FOM_GM) ?
                    <>
                        <div className={`${classes.title}`}>{t("FRONTDESK.HOUSESTATUS.endOfDay")}</div>
                        <div className={`${classes.contentText} mt-4`}>{t("FRONTDESK.HOUSESTATUS.occupiedTonight")}:
                            <span className={classes.contentTextBold}> {listStatisticGuest.inHouse.room} {t("FRONTDESK.HOUSESTATUS.rms")} / {listStatisticGuest.inHouse.guest} {t("FRONTDESK.HOUSESTATUS.guests")}</span></div>
                        <div className={`${classes.progressParent} flex items-end w-full`}>
                            <div className={`${classes.progressChild}`} style={{ width: `${widhProgress}%` }}>
                                {`${widhProgress}%`}
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8 mt-4">
                            <div className={`col-span-5 mt-4`} >
                                <div className={`${classes.contentText}`}>{t("FRONTDESK.HOUSESTATUS.availableTonight")}</div>
                            </div>
                            <div className={`col-span-3 mt-4 `} >
                                <div className={`${classes.contentText}`}>{availableTonight} {t("FRONTDESK.HOUSESTATUS.rooms")}</div>
                            </div>
                            <div className={`col-span-5 mt-4`} >
                                <div className={`${classes.contentText}`}>{t("FRONTDESK.HOUSESTATUS.roomRevenue")}</div>
                            </div>
                            <div className={`col-span-3 mt-4 `} >
                                <div className={`${classes.contentText}`}>{Utils.formatNumber(revenueInBusinessDate)}</div>
                            </div>
                            <div className={`col-span-5 mt-4`} >
                                <div className={`${classes.contentText}`}>{t("FRONTDESK.HOUSESTATUS.averageDailyRate")}</div>
                            </div>
                            <div className={`col-span-3 mt-4 `} >
                                <div className={`${classes.contentText}`}>{Utils.formatNumber(averageDaily)}</div>
                            </div>
                        </div>
                    </>
                    : <CUnAuthorzied />
                }

            </ClassBox>
            <ClassBox className={`${classes.classBox} mt-4  `}>
                {Auth.hasRole(Role.FO_FOM_GM) ?
                    <>
                        <div className={`${classes.title}`}>{t("FRONTDESK.HOUSESTATUS.housekeeping")}</div>
                        <div className="grid sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8">
                            <div className={`col-span-5`} >
                                <div className={`${classes.contentText}`} >{t("FRONTDESK.HOUSESTATUS.vacantClean")}</div>
                            </div>
                            <div className={`col-span-3`} >
                                <div className={`${classes.contentText}`}>{listHousekeeping.clean} {t("FRONTDESK.HOUSESTATUS.rooms")}</div>
                            </div>
                            <div className={`col-span-5`} >
                                <div className={`${classes.contentText}`}>{t("FRONTDESK.HOUSESTATUS.vacantDirty")}</div>
                            </div>
                            <div className={`col-span-3`} >
                                <div className={`${classes.contentText}`}>{listHousekeeping.dirty} {t("FRONTDESK.HOUSESTATUS.rooms")}</div>
                            </div>
                            <div className={`col-span-5`} >
                                <div className={`${classes.contentText}`} >{t("FRONTDESK.HOUSESTATUS.inspected")}</div>
                            </div>
                            <div className={`col-span-3`} >
                                <div className={`${classes.contentText}`}>{listHousekeeping.inspected} {t("FRONTDESK.HOUSESTATUS.rooms")}</div>
                            </div>
                        </div>
                    </>
                    : <CUnAuthorzied />
                }
            </ClassBox>
        </React.Fragment >
    )
}
export default React.memo(HouseStatus)