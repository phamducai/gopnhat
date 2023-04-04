import React, { useState } from "react";
import { Menu, } from "antd";
import { useStyleTheme } from "theme";
import { styleReport } from "pages/main/report/styles/styleReport";
import { HouseKeepingReportModal } from "../ModalReport/HouseKeepingReport";
import { AgentCompanyReportModal } from "../ModalReport/AgentCompanyReport";
import { IAccountDetailReport, ICashierDetailReport, ICompanyAgentReport, IDataDateFromReport } from "common/report/define-report";
import PrintReportService from "services/report/printReport.service";
import { useSelectorRoot } from "redux/store";
import { EODTypeOption, FixChargeCode, OrderByCompanyOption, TypeEODWithOption } from "common/enum/report.enum";
import { useTranslation } from "react-i18next";
import { CashierReportModal } from "../ModalReport/CashierReport";
import { EODReportModal } from "../ModalReport/EODReport";
const { SubMenu } = Menu;

const TheThirdRow = (): JSX.Element => {
    const classes = useStyleTheme(styleReport);
    const { hotelId } = useSelectorRoot(state => state.app)
    const { listStatisticGuest, availableTonight } = useSelectorRoot(state => state.frontdesk);
    const { guestDetailOptions } = useSelectorRoot(state => state?.rsvn);
    const { t } = useTranslation("translation");

    const [isShowEODReport, setIsShowEODReport] = useState<boolean>(false);
    const [isShowNightReport, setIsShowNightReport] = useState<boolean>(false);
    const [isShowUserLogReport, setIsShowUserLogReport] = useState<boolean>(false);
    const [isShowAgentCompanyReport, setIsShowAgentCompanyReport] = useState<boolean>(false);
    const [isChooseDate, setIsChooseDate] = useState<boolean>(false);
    const [isLoadingPrint, setIsLoadingPrint] = useState(false)
    const [fixChargeCode, setFixChargeCode] = useState<string[]>([])
    const [isVAT, setIsVAT] = useState<boolean>(false)
    const [isPayment, setIsPayment] = useState<boolean>(false)
    const [EODType, setEODType] = useState<string>("")
    const [isRate, setIsRate] = useState<boolean>(false)
    const [isTypeEODWith, setIsTypeEODWith] = useState<number>(0)
    const [orderBy, setOrderBy] = useState("");

    const occupiedTonight = ((listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room)) * 100).toFixed(2)

    const handleSubmit = async () => {
        console.log();
    }
    const handleSubmitCompanyAgent = async (data: ICompanyAgentReport) => {
        setIsLoadingPrint(true)
        const res = await PrintReportService.companyAgentReport(data, hotelId, orderBy)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowAgentCompanyReport(false)
    }
    const handleSubmitNightReport = async (data: IDataDateFromReport) => {
        setIsLoadingPrint(true)
        const dataApi: IAccountDetailReport = {
            date: [],
            time: data.dateSchedule,
            dateType: 0,
            isTypeTime: false,
            allAccount: false
        }
        const res = await PrintReportService.accountDetailReport(dataApi, hotelId, fixChargeCode)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowNightReport(false)
    }
    const handleSubmitPaymentNightReport = async (data: ICashierDetailReport) => {
        setIsLoadingPrint(true)
        const dataConvert: IAccountDetailReport = {
            date: data.dateSchedule,
            time: data.time,
            dateType: data.dateType,
            isTypeTime: data.isTypeTime,
            allAccount: false
        } 
        const res = await PrintReportService.accountDetailReport(dataConvert, hotelId, fixChargeCode, isVAT, isPayment, data.username)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowNightReport(false)
    }
    const handleSubmitEOD = async (data: IDataDateFromReport) => {
        setIsLoadingPrint(true)
        let guestVIP = ""
        guestDetailOptions?.guestType.forEach((item) => {
            if (item.ten === "VIP")
                guestVIP = item.guid
        })
        const res = await PrintReportService.EODReport(data, hotelId, isRate, EODType, occupiedTonight,
            guestVIP, isTypeEODWith)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowEODReport(false)
    }
    return (
        <div className="grid grid-cols-12 gap-2 my-2">
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={9}
            >
                <SubMenu key="sub1" title={t("REPORT.TheThirdRow.agentCompany")}
                >
                    <Menu.Item
                        key={"sub11" + 2}
                        className={` font-bold `}
                        onClick={() => { setIsChooseDate(false); setIsShowAgentCompanyReport(true); setOrderBy(OrderByCompanyOption.TopByRevenue) }}
                    >
                        {t("REPORT.TheThirdRow.topRevenue")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12" + 2}
                        onClick={() => { setIsChooseDate(false); setIsShowAgentCompanyReport(true); setOrderBy(OrderByCompanyOption.TopByRoomNight) }}
                    >
                        {t("REPORT.TheThirdRow.topRoomNight")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 2}
                        onClick={() => { setIsChooseDate(false); setIsShowAgentCompanyReport(true); setOrderBy(OrderByCompanyOption.TopByAverageRoomRate) }}
                    >
                        {t("REPORT.TheThirdRow.topAverageRoomRate")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 3}
                        onClick={() => { setIsChooseDate(true); setIsShowAgentCompanyReport(true); setOrderBy(OrderByCompanyOption.TopByRoomNight) }}
                    >
                        {t("REPORT.TheThirdRow.agentStaticByDateTopRoomNight")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 4}
                        onClick={() => { setIsChooseDate(true); setIsShowAgentCompanyReport(true); setOrderBy(OrderByCompanyOption.TopByRevenue) }}
                    >
                        {t("REPORT.TheThirdRow.agentStaticByDateTopRoomRevenue")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={10}
            >
                <SubMenu key="sub1" title={t("REPORT.TheThirdRow.EODReport")}
                    popupClassName={`custom-submenu ${classes.popupMenu}`}
                >
                    <Menu.Item
                        key={"sub13" + 1}
                        className={` font-bold `}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.inHouseGuest")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 2}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(TypeEODWithOption.IsRateCode)
                        }}
                    >
                        {t("REPORT.TheThirdRow.inHouseGuestWithRateCode")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 3}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(TypeEODWithOption.IsVIP)
                        }}
                    >
                        {t("REPORT.TheThirdRow.VIPGuest")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 4}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.WalkIn)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.walkinGuest")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 5}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.DayUse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.dayUseGuest")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 6}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.LTSG)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.longStayGuest")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 7}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.complimentaryGuest")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 8}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(TypeEODWithOption.IsMarket)
                        }}
                    >
                        {t("REPORT.TheThirdRow.guestInhouseWithMarket")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 9}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(TypeEODWithOption.IsSource)
                        }}
                    >
                        {t("REPORT.TheThirdRow.guestInHouseWithSource")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        disabled
                        key={"sub13" + 10}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.roomRate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 11}
                        disabled
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.roomRateAtNight")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 12}
                        disabled
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.roomRateAllDay")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 13}
                        disabled
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.roomRateDayVariance")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 14}
                        disabled
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.roomRateDayVarianceCompany")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 15}
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.guestBalance")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 16}
                        disabled
                        onClick={() => {
                            setIsShowEODReport(true); setEODType(EODTypeOption.InHouse)
                            setIsRate(false); setIsTypeEODWith(0)
                        }}
                    >
                        {t("REPORT.TheThirdRow.guestBalanceDetail")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={11}
            >
                <SubMenu key="sub1" title={t("REPORT.TheThirdRow.nightReport")} popupClassName={`custom-submenu ${classes.popupMenu}`}>
                    <Menu.Item
                        key={"subn14" + 1}
                        className={` font-bold `}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.MINIBAR, FixChargeCode.REBATE_MINIBAR])
                        }}
                    >
                        {t("REPORT.TheThirdRow.minibar")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 2}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.LAUNDRY, FixChargeCode.REBATE_LAUNDRY])
                        }}
                    >
                        {t("REPORT.TheThirdRow.laundry")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 3}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.TELEPHONE])
                        }}
                    >
                        {t("REPORT.TheThirdRow.telephone")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 4}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.TRANSPORTATION, FixChargeCode.REBATE_TRANSPORTATION])
                        }}
                    >
                        {t("REPORT.TheThirdRow.transportation")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 5}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.BUSINESS_CENTRE])
                        }}
                    >
                        {t("REPORT.TheThirdRow.businessCenter")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 6}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.MISC_CHARGE])
                        }}
                    >
                        {t("REPORT.TheThirdRow.misscellaneousCharge")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 7}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.TOUR_SERVICE_INBOUND, FixChargeCode.REBATE_TOURSERVICE_INBOUND])
                        }}
                    >
                        {t("REPORT.TheThirdRow.tourService")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 8}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.ROOM_CHARGE])
                        }}
                    >
                        {t("REPORT.TheThirdRow.roomCharge")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subnr14" + 9}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_FB_MATK1])
                        }}
                    >
                        {t("REPORT.TheThirdRow.F&B")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        key={"subn14" + 9}
                        className={` font-bold `}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.HOUSE_ACCOUNT])
                        }} // peding
                    >
                        {t("REPORT.TheThirdRow.hotelRevenue")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 10}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_DEPOSIT])
                        }} // 
                    >
                        {t("REPORT.TheThirdRow.deposits")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 11}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setFixChargeCode([FixChargeCode.ACCOUNT_RECEIVABLE])
                        }}
                    >
                        {t("REPORT.TheThirdRow.accountReceivable")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 12}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(true); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_PAYMENT_MATK1])
                        }}
                    >
                        {t("REPORT.TheThirdRow.paymentDetailByOutlet")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 14}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(true); setIsVAT(true)
                            setFixChargeCode([FixChargeCode.GET_PAYMENT_MATK1])
                        }}
                    >
                        {t("REPORT.TheThirdRow.paymentReportWithVAT")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 15}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(true); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_PAYMENT_MATK1])
                        }}
                    >
                        {t("REPORT.TheThirdRow.paymentReportWithoutVAT")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 16}
                        disabled
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(true); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_PAYMENT_MATK1])
                        }}
                    >
                        {t("REPORT.TheThirdRow.paymentJouralType")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 17}
                        disabled
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(true); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_PAYMENT_MATK1])
                        }}
                    >
                        {t("REPORT.TheThirdRow.paymentJouralTypeByMOP")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 18}
                        disabled
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(true); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_PAYMENT_MATK1])
                        }}
                    >
                        {t("REPORT.TheThirdRow.paymentJouralTypeByUserName")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 19}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.CITY_LEDGER])
                        }}
                    >
                        {t("REPORT.TheThirdRow.cityLadgerDeatils")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 20}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.CITY_LEDGER])
                        }}
                    >
                        {t("REPORT.TheThirdRow.cityLadgerDeatilsByAgent")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 21}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.CITY_LEDGER])
                        }}
                    >
                        {t("REPORT.TheThirdRow.cityLadgerDeatilsByCompany")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 22}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.CITY_LEDGER])
                        }}
                    >
                        {t("REPORT.TheThirdRow.cityLadgerDeatilsByGroupCode")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 23}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.GET_REBATE])
                        }}
                    >
                        {t("REPORT.TheThirdRow.rebate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"subn14" + 24}
                        onClick={() => {
                            setIsShowNightReport(true)
                            setIsPayment(false); setIsVAT(false)
                            setFixChargeCode([FixChargeCode.TOUR_SERVICE_INBOUND])
                        }}
                    >
                        {t("REPORT.TheThirdRow.folioDetailsOfNonInhouse")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={12}
                disabled
            >
                <SubMenu key="sub1" title={t("REPORT.TheThirdRow.userLogReport")}
                    popupClassName={`custom-submenu ${classes.popupMenu}`}
                >
                    <Menu.Item
                        key={"sub11" + 2}
                        className={` font-bold `}
                        onClick={() => setIsShowUserLogReport(true)}
                    >
                        {t("REPORT.TheThirdRow.userChangeRate")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12" + 2}
                    >
                        {t("REPORT.TheThirdRow.userChangeRoom")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 2}
                    >
                        {t("REPORT.TheThirdRow.userChangeRoomStatus")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 3}
                    >
                        {t("REPORT.TheThirdRow.userChangeRoomInspected")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 4}
                    >
                        {t("REPORT.TheThirdRow.userMadeKeyCard")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 5}
                    >
                        {t("REPORT.TheThirdRow.newRSVN")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 6}
                    >
                        {t("REPORT.TheThirdRow.cancelRSVN")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 7}
                    >
                        {t("REPORT.TheThirdRow.reactiveRSVN")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 8}
                    >
                        {t("REPORT.TheThirdRow.cancelCheckIn")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 9}
                    >
                        {t("REPORT.TheThirdRow.cancelCheckOut")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 1}
                    >
                        {t("REPORT.TheThirdRow.userChangeArrival")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 2}
                    >
                        {t("REPORT.TheThirdRow.userChangeDeparture")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 3}
                    >
                        {t("REPORT.TheThirdRow.userChangeRoomChange")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 4}
                    >
                        {t("REPORT.TheThirdRow.userSpilit")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 5}
                    >
                        {t("REPORT.TheThirdRow.userCorrections")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 6}
                    >
                        {t("REPORT.TheThirdRow.userRouting")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 7}
                    >
                        {t("REPORT.TheThirdRow.userTranfers")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 8}
                    >
                        {t("REPORT.TheThirdRow.userTracking")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub14" + 9}
                    >
                        {t("REPORT.TheThirdRow.printFolioHistory")}
                    </Menu.Item>
                </SubMenu>
            </Menu>

            {isShowEODReport ?
                <EODReportModal
                    onSubmit={handleSubmitEOD}
                    isShowModal={isShowEODReport}
                    setIsShowModal={setIsShowEODReport}
                    title={t("REPORT.TheFirstRow.selectDate")}
                    isLoadingPrint={isLoadingPrint}
                />
                : ""}
            {isShowNightReport ?
                fixChargeCode[0] === FixChargeCode.GET_PAYMENT_MATK1 ?
                    <CashierReportModal
                        onSubmit={handleSubmitPaymentNightReport}
                        isLoadingPrint={isLoadingPrint}
                        isShowModal={isShowNightReport}
                        setIsShowModal={setIsShowNightReport}
                        title={t("REPORT.TheFirstRow.cashierDetailReport")}
                    />
                    :  //hotel staticts pending
                    <HouseKeepingReportModal
                        onSubmit={handleSubmitNightReport}
                        isShowModal={isShowNightReport}
                        setIsShowModal={setIsShowNightReport}
                        title={t("REPORT.TheFirstRow.selectDate")}
                        isLoadingPrint={isLoadingPrint}
                    />
                : ""}
            {isShowUserLogReport ?
                <HouseKeepingReportModal
                    onSubmit={handleSubmit}
                    isShowModal={isShowUserLogReport}
                    setIsShowModal={setIsShowUserLogReport}
                    title={t("REPORT.TheFirstRow.selectDate")}
                    isLoadingPrint={isLoadingPrint}
                />
                : ""}
            {isShowAgentCompanyReport ?
                <AgentCompanyReportModal
                    isShowModal={isShowAgentCompanyReport}
                    setIsShowModal={setIsShowAgentCompanyReport}
                    title={t("REPORT.TheFirstRow.chooseAgent")}
                    isChooseDate={isChooseDate}
                    onSubmit={handleSubmitCompanyAgent}
                    isLoading={isLoadingPrint}
                />
                : ""}
        </div>
    )
}
export default TheThirdRow;