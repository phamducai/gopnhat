/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useDispatchRoot } from "redux/store";
import DrawerInfo from "components/CDrawerProfile/CDrawerInfo";
import { setLoading, setShowStat } from "redux/controller";
import { useStyleTheme } from 'theme';
import { statStyle } from './style';
import CLoading from "components/CLoading";
import BookingStatService from "services/booking/stat.service";
import { BookingStat } from "common/model-statistic";
import Utils from 'common/utils';

interface IDrawersInfo {
    visible: boolean,
    loading: boolean,
    transactStat: any
}

const Index = ({ visible, loading, transactStat, ...props }: IDrawersInfo): JSX.Element => {
    const [bookingStat, setBookingStat] = useState<BookingStat>();
    const dispatch = useDispatchRoot();
    const classes = useStyleTheme(statStyle);

    const fetchStat = async (rsvnId: string) => {
        const dataBookingStat: BookingStat = await BookingStatService.getBookingStatByRsvnId(rsvnId);
        setBookingStat(dataBookingStat);
    }
    useEffect(() => {
        dispatch(setLoading(true));
        if (transactStat?.parentGuid) {
            fetchStat(transactStat.parentGuid);
        }
        dispatch(setLoading(false));
        return () => dispatch(setShowStat(false));
    }, [])

    const onClose = () => {
        dispatch(setShowStat(false));
    }
    return (
        <CLoading visible={loading}>
            <DrawerInfo
                visible={visible}
                title={transactStat?.fullName.name ?? ""}
                propsOnChange={onClose}
                zIndex={30}
                bookingStat={bookingStat}
            >
                <div className="text-sm leading-7 pl-7">
                    <div>Room Rev: <span className={classes.blueText}><u>{bookingStat ? Utils.formatNumber(bookingStat.roomRevenue) : 0}</u></span></div>
                    <div>Fix Charge: <span className={classes.blueText}><u>{bookingStat ? Utils.formatNumber(bookingStat.totalFixCharge) : 0}</u></span></div>
                    <div>Total Rev: <span className={classes.blueText}><u>
                        {bookingStat ? Utils.formatNumber(bookingStat.totalRevenue) : 0}</u></span></div>
                    <div>Deposit: <span className={classes.blueText}><u>{bookingStat ? Utils.formatNumber(bookingStat.deposit) : 0}</u></span></div>
                </div>
            </DrawerInfo>
        </CLoading>
    )
}

export default Index;