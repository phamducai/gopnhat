/*eslint-disable*/
import React from 'react'
import Utils from 'common/utils';
import { useStyleTheme } from "theme";
import { styleCashier } from "../../styles/styleCashier";
import ClassBox from 'components/CClassBox';
import { Divider, Input } from "antd";
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataAmountRoomChat, FolioStat } from 'common/cashier/model-cashier';
import CLoading from 'components/CLoading';

interface CashierSideBarProps {
    setGroupCode: React.Dispatch<React.SetStateAction<string>>;
    control?: any,
    info: FolioStat,
    amountRoomChat: DataAmountRoomChat,
    groupCode?: string,
    roomNo?: string,
    loading?: boolean
}
export const SideBar = ({ setGroupCode, control, info, amountRoomChat, roomNo, loading }: CashierSideBarProps): JSX.Element => {
    const classes = useStyleTheme(styleCashier);
    const { t } = useTranslation('translation');

    return (
        <CLoading visible={loading}>
            <ClassBox className={`${classes.classBox} flex flex-col`}>
                <div className={`text-sm pt-4`}>
                    <label className="cursor-pointer font-semibold">
                        {t("CASHIER.roomNo")}: {roomNo}
                    </label>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                placeholder={"Enter Room Number"}
                                type="text"
                                className={`${classes.input}`}
                                style={{ background: "#F5F6F7", height: 40, marginTop: "0.5rem" }}
                                onChange={(e) => { onChange(setGroupCode(e.target.value)) }}
                            />
                        }
                        defaultValue=""
                        name="groupCode" control={control} />
                    <button
                        className={`${classes.btn} text-white font-bold py-2 px-4 mt-3 rounded flex justify-center`}
                    >
                        {t("BOOKING.SEARCHVALUE.apply")}
                    </button>
                </div>
                <Divider />
                <section className="custom-scrollbar-pkm pr-2">
                    <div className="flex justify-between">
                        <span className="cursor-default">
                            {t("CASHIER.FOLIO.balanceOfGuest")}:
                        </span>
                        <span className={`${info?.balanceOfSharedGuest !== 0 ? classes.redText : classes.blueText} cursor-default `}>
                            <u>{Utils.formatNumber(info.balanceOfSharedGuest)}</u>
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="cursor-default">
                            {t("CASHIER.FOLIO.deposit")}:
                        </span>
                        <span className={`font-semibold cursor-default `}>
                            {Utils.formatNumber(info.deposit)}
                        </span>
                    </div>
                    <div
                        className="cursor-default text-gray-400 font-semibold"
                    >
                        {t("CASHIER.FOLIO.balanceOfFolio")}
                    </div>
                    <div className="flex justify-between">
                        <span className="cursor-default">{t("CASHIER.FOLIO.debit")}:</span>
                        <span className="cursor-default font-semibold">
                            {Utils.formatNumber(info.debit)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="cursor-default">
                            {t("CASHIER.FOLIO.credit")}:
                        </span>
                        <span className="cursor-default font-semibold">
                            {Utils.formatNumber(info.credit)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="cursor-default">
                            {t("CASHIER.FOLIO.balance")}:
                        </span>
                        <span className={`${info.balance !== 0 ? classes.redText : classes.blueText} cursor-default font-semibold`}>
                            {Utils.formatNumber(info.balance)}
                        </span>
                    </div>
                </section>
                <div className="mt-auto px-4 py-3 font-semibold text-center rounded bg-gray-50">{`${amountRoomChat.roomChats + " " + amountRoomChat.maTk} - amount: ${Utils.formatNumber(amountRoomChat.amount)}đ`}</div>
            </ClassBox>
        </CLoading>
    )
}
