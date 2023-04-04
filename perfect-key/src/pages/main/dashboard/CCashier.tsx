import clsx from 'clsx';
import ClassBox from 'components/CClassBox';
import React from 'react'
import { useStyleTheme } from 'theme'
import { useTranslation } from 'react-i18next';
import { styleCashier } from './style/styleCashier';
import { useSelectorRoot } from 'redux/store';

export default function Cashier(props: Props): JSX.Element {
    const { listStatisticGuest } = useSelectorRoot(state => state.frontdesk)
    const classes = useStyleTheme(styleCashier);
    const { t } = useTranslation("translation")
    
    const actualDeparture = listStatisticGuest.departures?.actual.room / (listStatisticGuest.departures?.expected.room + listStatisticGuest.departures?.actual.room)
    const widthProcess = actualDeparture ? (actualDeparture * 100).toFixed(2) : 0

    return (
        <ClassBox title={t("DASHBOARD.cashier")} className={clsx(props.className)}>
            <div className={`grid grid-cols-12 gap-3`}>
                <div className={`lg:col-span-6 col-span-12 grid grid-cols-12 gap-3`}>
                    <div className={`col-span-6`}>
                        <p className={`${classes.cashierTitle} text-xs font-bold`}>
                            {t("DASHBOARD.inHouse")}
                        </p>
                        <div className={`${classes.inHouseItemBox} font-bold text-base rounded-md`} style={{ backgroundColor: "#F2C313" }}>
                            {listStatisticGuest.inHouse?.room}
                            <p className="font-normal text-sm">{t("DASHBOARD.rooms")}</p>
                        </div>
                        <div className={`${classes.inHouseItemBox} font-bold text-base rounded-md`} style={{ backgroundColor: "#FF9800" }}>
                            {listStatisticGuest.inHouse.guest}
                            <p className="font-normal text-sm">{t("DASHBOARD.guests")}</p>
                        </div>
                    </div>
                    <div className={`col-span-6`}>
                        <p className={`${classes.cashierTitle} text-xs font-bold`}>
                            {t("DASHBOARD.balance")}
                        </p>
                        <div className={`${classes.inHouseItemBox} rounded-md font-bold text-base`} style={{ backgroundColor: "#E91E63" }}>
                            0
                            <p className="font-normal text-sm">{t("DASHBOARD.rooms")}</p>
                        </div>
                    </div>
                </div>
                <div className={`lg:col-span-5 col-span-12`}>
                    <p className={`${classes.cashierTitle}`}>
                        {t("DASHBOARD.departures")}
                    </p>
                    <h3>{t("DASHBOARD.expected")}: 
                        <b> { listStatisticGuest.departures?.expected.room } {t("DASHBOARD.rms")} / { listStatisticGuest.departures?.expected.guest } {t("DASHBOARD.guests")}
                        </b>
                    </h3>
                    <h3>{t("DASHBOARD.actual")}:  
                        <b> { listStatisticGuest.departures?.actual.room } {t("DASHBOARD.rms")} / { listStatisticGuest.departures?.actual.guest } {t("DASHBOARD.guests")}
                        </b>
                    </h3>
                    <div className={`${classes.cashierRightProcess}`}>
                        <div className={`${classes.cashierRightProcessChild}`} style={widthProcess > 100 ? { width: `100%` } : { width: `${widthProcess}%` }}>
                            {`${widthProcess}%`}
                        </div>
                    </div>
                </div>
            </div>
        </ClassBox >
    )
}
