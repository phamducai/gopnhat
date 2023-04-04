/* eslint-disable */
import React, { useState } from 'react'
import CIconSvg from 'components/CIconSvg';
import { useHistory } from 'react-router-dom';
import { createStyles, useStyleTheme } from 'theme'
import clsx from 'clsx';
import { subDays, addDays } from 'date-fns'
import { Button } from 'antd';
import { ICHeaderBooking } from 'common/define-booking';
import CRangePicker from 'components/CRangePicker';
import { guestProfileInBookingRSVN } from 'redux/controller';
import { getBookingByRsvnId, setDataFoextraCharge } from 'redux/controller/reservation.slice';
import { useDispatchRoot,useSelectorRoot } from 'redux/store';
import { styleCHeaderBooking } from './styles/styleCHeaderBooking';
import { useTranslation } from 'react-i18next';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';

const CHeaderBooking = ({ setSelectedDate, visible, ...props }: ICHeaderBooking): JSX.Element => {
    const classes = useStyleTheme(styleCHeaderBooking);
    const history = useHistory();
    const dispatch = useDispatchRoot();
    const { guestProfile } = useSelectorRoot(state => state.booking);
    const currentDate = new Date();
    const [date, setDate] = useState<any>({ fromDate: currentDate, toDate: addDays(currentDate, 6) })
    const [dateCRangePicker, setCRangePicker] = useState<any>({ fromDate: currentDate, toDate: addDays(currentDate, 6) })
    const { t } = useTranslation("translation")
    const prev7Day = () => {
        setCRangePicker({
            fromDate: subDays(date?.fromDate, 7),
            toDate: subDays(date?.toDate, 7),
        });
        setDate({
            fromDate: subDays(date?.fromDate, 7),
            toDate: subDays(date?.toDate, 7)
        })
        setSelectedDate({
            fromDate: subDays(date?.fromDate, 7),
            toDate: subDays(date?.toDate, 7)
        })
    }
    const next7Day = () => {
        setCRangePicker({
            fromDate: addDays(date?.fromDate, 7),
            toDate: addDays(date?.toDate, 7)
        })
        setDate({
            fromDate: addDays(date?.fromDate, 7),
            toDate: addDays(date?.toDate, 7)
        })
        setSelectedDate({
            fromDate: addDays(date?.fromDate, 7),
            toDate: addDays(date?.toDate, 7)
        })
    }

    const handleDataCRangePicker = (date: { from: Date, to: Date }) => {
        setDate({ fromDate: date.from, toDate: date.to })
        setSelectedDate({ fromDate: date.from, toDate: date.to });
    }

    const handleChangUrl = () => {
        if(Auth.hasRole(Role.FO_FOM_GM)){
            history.push({pathname: "/main/booking/new"})
            dispatch(getBookingByRsvnId(null))
            dispatch(guestProfileInBookingRSVN({...guestProfile, firstName : "", guestName : ""}))
            dispatch(setDataFoextraCharge({ totalFixCharge : 0, dataFoextraCharge: []}));// reset fixcharge
        }
    }

    return (
        <div className={`${props.className} col-span-7`}>
            <div className="col-span-12 flex justify-end">
                <button onClick={() => handleChangUrl()} className={`${classes.btn} flex items-center`}>
                    <CIconSvg name="plus-circle" svgSize="medium" colorSvg="background" />
                    <span className={`${clsx(classes.spanNewRSVNGroup)} pl-2`}>{t("BOOKING.newRsvnAndGroup")}</span>
                </button>
            </div>
            <div className="col-span-12 flex justify-end mt-2 flex-wrap lg:flex-nowrap">
                <CRangePicker className={`${classes.rangePicker}  `} dataDate={dateCRangePicker} setDate={handleDataCRangePicker} />
                <div className="flex mt-2 lg:mt-0">
                    <Button disabled={visible} className={`${clsx(classes.btn, classes.btnSetDate)} lg:ml-2`} onClick={prev7Day} >{t("BOOKING.prev7Days")}</Button>
                    <Button disabled={visible} className={`${clsx(classes.btn, classes.btnSetDate)} ml-2`} onClick={next7Day} >{t("BOOKING.next7Days")}</Button>
                </div>
            </div>
        </div>
    )
}
export default React.memo(CHeaderBooking)