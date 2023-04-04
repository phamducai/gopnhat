/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckinQueryParam } from "common/search/frontDeskDefault";
import CButtonFrontDesk from "components/FrontDesk/CButtonFrontDesk";
import CDropdown from 'components/FrontDesk/CDropdown';
import { styleButtonDropdown } from "components/FrontDesk/style/styleButtonDropdown";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { useStyleTheme } from "theme";
import { searchWithQueryParam } from "redux/controller";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import "./style.css";
import { DirectFrom } from "./walk-in/CGuestScheduleWalkin";
import { bussinessDateReq } from "redux/controller/hotelconfig.slice";
import Auth from "services/auth/auth.service";
import Role from "common/roles";
import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";
interface Props {
    isCashier: boolean
}
const RoomPlan = ({ isCashier }: Props) => {
    const { t } = useTranslation("translation");
    const classes = useStyleTheme(styleButtonDropdown);
    const history = useHistory();
    const location = useLocation<any>()
    const formSearchState = useSelectorRoot(state => state.booking.formSearch);
    const { changeStatusProfiles } = useSelectorRoot(state => state.booking)
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app)
    const arrPathname = history.location.pathname.toString().split("/")
    const pathname = arrPathname[arrPathname.length - 1]

    const dispatch = useDispatchRoot();

    useEffect(() => {
        dispatch(bussinessDateReq(hotelId))
    }, [hotelId, dispatch])

    const onClickWalkInGuests = () => {
        history.push({
            pathname: location.pathname + '/room-plan/walk-in',
            state: {
                direct: DirectFrom.ShortcutFrontDesk
            }
        })
    }
    const handleClickAllGuest = () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            const defaultQuery = CheckinQueryParam;
            if (pathname !== 'search') {
                history.push(`/main/booking/search`, defaultQuery)
            } else {
                history.push(`search`, undefined)
            }
            const data = {
                pageNumber: changeStatusProfiles ? formSearchState.pageNumber : 1,
                pageSize: 1000,
                hotelGuid: hotelId,
                isOnlyMainGuest: defaultQuery.isOnlyMainGuest,
                arrivalDates: [],
                departureDates: [],
                companyAgentGuid: defaultQuery.companyAgent,
                status: defaultQuery.searchBy,
                rsvnCode: '',
                rsvnNo: "",
                room: "",
                profiles: {
                    phone: "",
                    passport: "",
                    firstName: "",
                    guestName: ""
                },
                roomType: '00000000-0000-0000-0000-000000000000',
                groupCode: "",
                listRoomType: numberOfRooms //roomType
            }

            dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }

    }
    const handleClickAllRoom = () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {

            const defaultQuery = CheckinQueryParam;
            if (pathname !== 'search') {
                history.push(`/main/booking/search`, defaultQuery)
            } else {
                history.push(`search`, undefined)
            }
            const data = {
                pageNumber: changeStatusProfiles ? formSearchState.pageNumber : 1,
                pageSize: 1000,
                hotelGuid: hotelId,
                isOnlyMainGuest: true,
                arrivalDates: [],
                departureDates: [],
                companyAgentGuid: defaultQuery.companyAgent,
                status: defaultQuery.searchBy,
                rsvnCode: '',
                rsvnNo: "",
                room: "",
                profiles: {
                    phone: "",
                    passport: "",
                    firstName: "",
                    guestName: ""
                },
                roomType: '00000000-0000-0000-0000-000000000000',
                groupCode: "",
                listRoomType: numberOfRooms //roomType
            }

            dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }
    return (
        <div className={`${classes.AntBtnGroup} mt-1`}>
            <CDropdown status={1} name={"Arrival"}>
                {t("FRONTDESK.ROOMPLAN.actualArrival")}
            </CDropdown>
            <CDropdown status={0} name={"Arrival"}>
                {t("FRONTDESK.ROOMPLAN.expectedArrival")}
            </CDropdown>
            {!isCashier &&
                <CButtonFrontDesk className="mt-3" onClick={onClickWalkInGuests}>
                    {t("FRONTDESK.ROOMPLAN.walkInGuests")}
                </CButtonFrontDesk>
            }
            <CButtonFrontDesk className="mt-3" onClick={handleClickAllGuest}>
                {t("FRONTDESK.ROOMPLAN.allInHouseGuests")}
            </CButtonFrontDesk>
            <CButtonFrontDesk className="mt-3" onClick={handleClickAllRoom}>
                {t("FRONTDESK.ROOMPLAN.allInHouseRooms")}
            </CButtonFrontDesk>
            {!isCashier &&
                <button
                    className={`mx-3 w-full underline font-bold control-color-blue py-2 px-4 rounded flex justify-center col-span-2 mt-3`}
                >
                    {t("FRONTDESK.ROOMPLAN.moreActions")}
                </button>
            }
        </div>
    );
};
export default React.memo(RoomPlan);
