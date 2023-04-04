import React from "react";
import ClassBox from "components/CClassBox";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { styleCEndOfDay } from "./style/styleCEndOfDay";
import { useStyleTheme } from "theme";
import { useSelectorRoot } from "redux/store";
import Utils from "common/utils";


const CEndOfDay = (props: Props): JSX.Element => {
    const classes = useStyleTheme(styleCEndOfDay);
    const { t } = useTranslation("translation")
    const { listStatisticGuest, availableTonight, revenueInDay } = useSelectorRoot(state => state.frontdesk);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);

    const revenueInBusinessDate = revenueInDay.find((item) => item.Key === Utils.formatDateCallApi(businessDate))?.Value ?? 0

    const occupiedTonight = Object.is(NaN, (listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room) * 100 ))? 0 : (listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room) * 100 ).toFixed(2)

    const averageDaily = Object.is(NaN, (revenueInBusinessDate / (availableTonight + listStatisticGuest.inHouse.room))) ? 0 : (revenueInBusinessDate / (listStatisticGuest.walkIns.room + listStatisticGuest.inHouse.room) )
    
    const averageAvailable = Object.is(NaN, (availableTonight / (availableTonight + listStatisticGuest.inHouse.room) * 100)) ? 0 : (availableTonight / (availableTonight + listStatisticGuest.inHouse.room) * 100).toFixed(2)

    const data = [
        {
            name: t("DASHBOARD.occupiedTonight"), items: {
                percent: occupiedTonight ? occupiedTonight : 0,
                room: listStatisticGuest.inHouse.room,
                pax: listStatisticGuest.inHouse.guest
            }
        },
        {
            name: t("DASHBOARD.availableTonight"), items: {
                percent: averageAvailable ? averageAvailable : 0,
                room: availableTonight ? availableTonight : 0,
                pax: ""
            }
        },
        {
            name: t("DASHBOARD.roomRevenue"), items: {
                percent: Utils.formatNumber(revenueInBusinessDate),
                room: "",
                pax: null
            }
        },
        {
            name: t("DASHBOARD.avarageRoomRate"), items: {
                percent: Utils.formatNumber(averageDaily),
                room: "",
                pax: ""
            }
        },

    ]

    return (
        <ClassBox title={t("DASHBOARD.endOfDay")} className={clsx(props.className)}>
            <table className={`${classes.text} ${classes.table}`}>
                <thead>
                    <tr>
                        <th className={`w-2/5 px-1`}></th>
                        <th className={`w-1/5 px-1`}>%</th>
                        <th className={`w-1/5 px-1`}>{t("DASHBOARD.room")}</th>
                        <th className={`w-1/5 px-1`}>{t("DASHBOARD.pax")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((items, index) => (
                            <tr key={index} className={`${clsx(classes.borderTable)}`}>
                                <td className={`${classes.tableItemName}`}>{items.name}</td>
                                <td className="text-center px-1">{items.items.percent}</td>
                                <td className="text-center px-1">{items.items.room}</td>
                                <td className="text-center px-1">{items.items.pax}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

        </ClassBox>
    );
};

export default React.memo(CEndOfDay);
