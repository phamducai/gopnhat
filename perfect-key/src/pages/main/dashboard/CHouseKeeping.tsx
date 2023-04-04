import ClassBox from 'components/CClassBox';
import clsx from 'clsx';
import React from 'react'
import { createStyles, useStyleTheme } from 'theme'
import { useTranslation } from 'react-i18next';
const styleHosueKeeping = createStyles((theme) => ({
    houseKeepingMain: {
        paddingLeft: 24,
        marginTop: 10,
        paddingRight: 24,
        marginBottom: 10,
    },
    houseKeepingItem: {
        border: "1px solid #1A87D7",
        padding: "10px 0px",
        textAlign: "center",
        fontSize: 14,
        color: "#1A87D7",
        borderRadius: 4,
    }
}))
export default function Cashier(props: Props): JSX.Element {
    const classes = useStyleTheme(styleHosueKeeping);
    const { t } = useTranslation("translation")
    return (
        <ClassBox title={t("DASHBOARD.housekeeping")} className={clsx(props.className)}>
            <div className={`${classes.houseKeepingMain} grid grid-cols-4 gap-3`}>
                <div className={`${classes.houseKeepingItem} col-span-1`} >
                    VD: 6 {t("DASHBOARD.rooms")}
                </div>
                <div className={`${classes.houseKeepingItem} col-span-1`} >
                    VD: 6 {t("DASHBOARD.rooms")}
                </div>
                <div className={`${classes.houseKeepingItem} col-span-1`} >
                    VD: 6 {t("DASHBOARD.rooms")}
                </div>
                <div className={`${classes.houseKeepingItem} col-span-1`} >
                    VD: 6 {t("DASHBOARD.rooms")}
                </div>
            </div>
        </ClassBox>
    )
}
