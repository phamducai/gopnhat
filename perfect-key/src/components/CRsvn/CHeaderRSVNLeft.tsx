/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ButtonHeaderRight from "components/CButtonHeaderRight";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useStyleTheme } from "theme";
import { styleEditReservation } from "pages/main/booking/reservation/editReservation/styles/index.style";
import { useTranslation } from "react-i18next";
import { TypeTracer } from 'common/enum/cashier.enum';

interface Props{
    handleClickFolio: any,
    handleNewTracer: any,
    handleNewAlert: any,
    isCheckIn: boolean,
    showDrawer: any,
    handleTracerInHouse: any
}

const CHeaderRSVNLeft = ({ handleClickFolio, handleNewTracer, handleNewAlert, isCheckIn, showDrawer, handleTracerInHouse }: Props): JSX.Element => {
    const classes = useStyleTheme(styleEditReservation);
    const { t } = useTranslation("translation");

    return (
        <div className={`flex items-center justify-center`}>
            <div>
                <ButtonHeaderRight active={false} title={t("BOOKING.RESERVATION.EDITRESERVATION.moreActions")} />
            </div>
            <div onClick={handleClickFolio}>
                <ButtonHeaderRight active={true} title={t("BOOKING.RESERVATION.EDITRESERVATION.folio")} />
            </div>
            <div>
                <Menu
                    className={`${classes.dropDownBtn} ${classes.buttonHeaderRightActive} rounded cursor-pointer col-span-3 more-items flex items-center`}
                    triggerSubMenuAction="click"
                    key={1}
                >
                    <SubMenu key="sub1" title={t("BOOKING.RESERVATION.trace")}
                        className={`rounded mx-2 text-base font-semibold w-full`}>
                        <Menu.Item key={"sub10"+1} className={` font-bold `}
                            onClick={() => handleTracerInHouse()}
                        >
                            {t("BOOKING.RESERVATION.traceInHouse")}
                        </Menu.Item>
                        <Menu.Item key={"sub11"+1} className={` font-bold `}
                            onClick={() => handleNewTracer()}
                        >
                            {t("BOOKING.RESERVATION.newTracer")}
                        </Menu.Item>
                        <Menu.Item className={` font-bold `} key={"sub12"+1}
                            disabled={isCheckIn}
                            onClick={() => handleNewAlert(t("BOOKING.RESERVATION.newCheckIn"), TypeTracer.AlertCheckIn)}
                        >
                            {t("BOOKING.RESERVATION.alertCheckIn")}
                        </Menu.Item>
                        <Menu.Item className={` font-bold `} key={"sub13"+1}
                            onClick={() => handleNewAlert(t("BOOKING.RESERVATION.newCheckOut"), TypeTracer.AlertCheckOut)}
                        >
                            {t("BOOKING.RESERVATION.alertCheckOut")}
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
            <div onClick={showDrawer}>
                <ButtonHeaderRight active={true} title={t("BOOKING.RESERVATION.EDITRESERVATION.newCompany")} />
            </div>
        </div>
    )
}

export default CHeaderRSVNLeft;