/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { useStyleTheme } from 'theme';
import CIconSvg from 'components/CIconSvg';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import ModalRoom from 'pages/main/front-desk/RoomPlan/modal/ModalRoom';
import { IFormSearch } from 'common/define-booking';
import { searchRequest, searchWithQueryParam } from 'redux/controller';
import { addDays } from 'date-fns';
import Utils from 'common/utils';
import { styleButtonDropdown } from './style/styleButtonDropdown';
import { useHistory } from 'react-router';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';

interface PropRoomPlan {
    status: number,
    name: string,
    children: string
}
export default function CDropdown({ status, name, ...other }: PropRoomPlan): JSX.Element {
    const dispatch = useDispatchRoot();
    const classes = useStyleTheme(styleButtonDropdown);
    const history = useHistory();
    const arrPathname = history.location.pathname.toString().split("/");
    const pathname = arrPathname[arrPathname.length - 1];
    const { hotelId, numberOfRooms } = useSelectorRoot((state) => state.app);
    const { businessDate } = useSelectorRoot((state) => state.hotelConfig);

    const [isVisible, setIsVisible] = useState(false)
    const [now, setNow] = useState("")
    const [arrivalDate, setArrivalDate] = useState(addDays(new Date(), 0));
    const [departureDate, setDepartureDate] = useState(addDays(new Date(), 1));
    const [isOnlyMainGuest, setIsOnlyMainGuest] = useState<boolean>(false)
    const [isCancel, setIsCancel] = useState(false)

    useEffect(() => {
        if (now) handleButtonClick(now)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCancel])

    const checkDate = (dayPresent: string) => {
        let chooseDate: string[] = []
        if (dayPresent === "present")
            chooseDate = [convertDate(new Date(businessDate), 0), convertDate(new Date(businessDate), 0)]
        else if (dayPresent === "yesterday")
            chooseDate = [convertDate(new Date(businessDate), -1), convertDate(new Date(businessDate), -1)]
        else if (dayPresent === 'tomorrow')
            chooseDate = [convertDate(new Date(businessDate), 1), convertDate(new Date(businessDate), 1)]
        else
            chooseDate = [convertDate(arrivalDate, 0), convertDate(departureDate, 0)]
        return chooseDate
    }

    const convertDate = (date: Date, amount: number): string => {
        return Utils.convertToVNTimeZone(addDays(date, amount))
    }

    const handleButtonClick = (present: string) => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            const formSearch: IFormSearch | any = []
            const date: string[] = checkDate(present)
            setNow(present)
            let data = {
                hotelGuid: hotelId,
                isOnlyMainGuest: isOnlyMainGuest ? isOnlyMainGuest : formSearch.isOnlyMainGuest,
                arrivalDates: formSearch.dateArrival,
                departureDates: formSearch.dateDeparture,
                companyAgentGuid: formSearch.companyAgent,
                status: formSearch?.searchBy,
                rsvnCode: "",
                rsvnId: formSearch.rsvn,
                rsvnNo: formSearch.rsvn,
                room: "",
                availableDate: formSearch?.availableDate,
                groupCode: "",
                pageNumber: 1,
                profiles: {
                    phone: formSearch.phone,
                    passport: formSearch.passport,
                    firstName: formSearch.firstName,
                    guestName: formSearch.guestName,
                },
                roomType: formSearch.roomType,
                listRoomType: numberOfRooms,
            }
            if (name === 'Arrival')
                data = { ...data, arrivalDates: date !== [] && date, status: status }
            else
                data = { ...data, departureDates: date !== [] && date, status: status }

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

            if (present !== 'byDate' || isCancel) {
                if (pathname !== "search") {
                    history.push("booking/search", formSearch);
                } else {
                    history.push("search", undefined);
                }
            } else
                setIsVisible(true)

            setIsCancel(false)
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const menu = (
        <Menu onClick={(e) => handleButtonClick(e.key)}
            style={name === 'Departure' ? { margin: "-4rem -8rem 0px 2.5rem" } : {}}
            className={`w-full ${classes.controlDropdown}`}
            triggerSubMenuAction="click"
        >
            <Menu.Item key="yesterday" >
                Yesterday
            </Menu.Item>
            <Menu.Item key="tomorrow">
                Tomorrow
            </Menu.Item>
            <Menu.Item key="byDate">
                By date
            </Menu.Item>
        </Menu>
    )

    return (
        <>
            <Dropdown.Button onClick={() => handleButtonClick('present')} overlay={menu}
                icon={<CIconSvg name="more" svgSize="small" hexColor="#00293B" style={{ paddingLeft: '10px', position: "absolute", right: "3px", top: '8px' }} />}
                trigger={["click"]}
                placement="bottomRight"
                className={` ${classes.AntBtnGroup} customer-icon mx-3  w-full ${classes.frontDeskControl} ${classes.controlColorBlue} py-2 rounded flex justify-center mt-3`}
            >
                {other.children}
            </Dropdown.Button>
            <ModalRoom
                visibleModal={isVisible} setIsVisible={setIsVisible}
                arrivalDate={arrivalDate} setArrivalDate={setArrivalDate}
                departureDate={departureDate} setDepartureDate={setDepartureDate}
                isOnlyMainGuest={isOnlyMainGuest} setIsOnlyMainGuest={setIsOnlyMainGuest}
                setIsCancel={setIsCancel} name={name}
            >
                {other.children}
            </ModalRoom>
        </>
    )
}