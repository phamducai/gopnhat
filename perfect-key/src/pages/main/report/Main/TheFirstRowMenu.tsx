import React, { useState } from "react";
import { Menu, } from "antd";
import { useStyleTheme } from "theme";
import { styleReport } from "pages/main/report/styles/styleReport";
import { NationalityReportModal } from "../ModalReport/NationalityReport";
import { HouseKeepingReportModal } from "../ModalReport/HouseKeepingReport";
import { GuestInHouseReportModal } from "../ModalReport/GuestInHouseReport";
import { IDataDateFromReport, IDataNationalityReport, IGuestInHouseReport } from "common/report/define-report";
import { useSelectorRoot } from "redux/store";
import PrintReportService from "services/report/printReport.service";
import { ByOderOption, GuestInHouseOption, RateOption, TypeHouseKeeping, TypeMonthly } from "common/enum/report.enum";
import { useTranslation } from "react-i18next";
const { SubMenu } = Menu;

interface IPropsRowMenu {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const TheFirstRow = ({setIsLoading}: IPropsRowMenu): JSX.Element => {
    const classes = useStyleTheme(styleReport);
    const {hotelId} = useSelectorRoot(state => state.app)
    const { listStatisticGuest, availableTonight } = useSelectorRoot(state => state.frontdesk);
    const { t } = useTranslation("translation");

    const [isLoadingPrint, setIsLoadingPrint] = useState(false)
    const [isDetail, setIsDetail] = useState(false)
    const [isItems, setIsItems] = useState(false)
    const [isShowNationlityReport, setIsShowNationlityReport] = useState<boolean>(false);
    const [isShowHouseKeepingReport, setIsShowHouseKeepingReport] = useState<boolean>(false);
    const [isShowGuestInHouseReport, setIsShowGuestInHouseReport] = useState<boolean>(false);
    const [isShowGuestBalanceReport, setIsShowGuestBalanceReport] = useState<boolean>(false);
    const [monthType, setMonthType] = useState("");
    const [housekeepingType, setHousekeepingType] = useState("");
    const [orderBy, setOrderBy] = useState("");

    const occupiedTonight =((listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room)) * 100 ).toFixed(2)

    const handleSubmitGuestBalance = async (data: IDataDateFromReport) => {
        setIsLoadingPrint(true)
        const res = await PrintReportService.guestBalanceReport(data, hotelId)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowGuestBalanceReport(false)
    }
    const handleSubmitGuestInHouse = async (data: IGuestInHouseReport, optionGuestInHouse: number, rateOption: number) => {
        setIsLoadingPrint(true)
        !isShowGuestInHouseReport && setIsLoading(true)
        const res = await PrintReportService.guestInHouseReport(data, hotelId, optionGuestInHouse, rateOption, orderBy, occupiedTonight)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        !isShowGuestInHouseReport && setIsLoading(false)
        setIsShowGuestInHouseReport(false)
    }
    const handleSubmitNationality = async (data: IDataNationalityReport) => {
        setIsLoadingPrint(true)
        const res = await PrintReportService.nationalityReport(data, hotelId, monthType)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowNationlityReport(false)
    }
    const handleSubmitHousekeeping = async (data: IDataDateFromReport) => {
        setIsLoadingPrint(true)
        const res = await PrintReportService.housekeepingReport(data, hotelId, housekeepingType, isDetail, isItems)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowHouseKeepingReport(false)
    }
    return (
        <div className="grid grid-cols-12 gap-2 my-2">
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={1}
            >
                <SubMenu key="sub11" title={t("REPORT.TheFirstRow.guestInhouse")}
                    popupClassName={`custom-submenu ${classes.popupMenu}`}
                >
                    <Menu.Item
                        key={"sub11"+1}
                        className={` font-bold `}
                        onClick={() => {setIsShowGuestInHouseReport(true); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.TheFirstRow.room")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+2}
                        onClick={() => {setIsShowGuestInHouseReport(true); setOrderBy(ByOderOption.ByGuestName)}}
                    >
                        {t("REPORT.TheFirstRow.guestName")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+3}
                        onClick={() => {setIsShowGuestInHouseReport(true); setOrderBy(ByOderOption.ByArrivalDate)}}
                    >
                        {t("REPORT.TheFirstRow.arrivalDate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+4}
                        onClick={() => {setIsShowGuestInHouseReport(true); setOrderBy(ByOderOption.ByDepartureDate)}}
                    >
                        {t("REPORT.TheFirstRow.departureDate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+5}
                        onClick={() => {setIsShowGuestInHouseReport(true); setOrderBy(ByOderOption.ByCompanyAgent)}}
                    >
                        {t("REPORT.TheFirstRow.companyAgent")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+6}
                        onClick={() => {setIsShowGuestInHouseReport(true); setOrderBy(ByOderOption.ByGroupMaster)}}
                    >
                        {t("REPORT.TheFirstRow.groupMaster")}
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+7}
                        onClick={() => {handleSubmitGuestInHouse({groupCode: ""}, GuestInHouseOption.RateCode, RateOption.WithRate)}}
                    >
                        {t("REPORT.TheFirstRow.guestInhouseWithRate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+8}
                        onClick={() => {handleSubmitGuestInHouse({groupCode: ""}, GuestInHouseOption.RateCode, RateOption.WithRateCode)}}
                    >
                        {t("REPORT.TheFirstRow.guestInhouseWithRateCode")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+9}
                        onClick={() => {handleSubmitGuestInHouse({groupCode: ""}, GuestInHouseOption.RateCode, RateOption.WithGroupCode)}}
                    >
                        {t("REPORT.TheFirstRow.guestInhouseWithGroupCode")}
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+10}
                        onClick={() => {handleSubmitGuestInHouse({groupCode: ""}, GuestInHouseOption.GroupCode, RateOption.NoRate)}}
                    >
                        {t("REPORT.TheFirstRow.groupInhouseNoRate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub11"+11}
                        onClick={() => {handleSubmitGuestInHouse({groupCode: ""}, GuestInHouseOption.GroupCode, RateOption.WithRate)}}
                    >
                        {t("REPORT.TheFirstRow.groupInhouseWithRate")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={2}
            >
                <SubMenu key="sub12" title={t("REPORT.TheFirstRow.nationalityReport")}
                >
                    <Menu.Item
                        key={"sub12" + 1}
                        className={` font-bold `}
                        onClick={() => {setIsShowNationlityReport(true); setMonthType(TypeMonthly.Monthly)}}
                    >
                        {t("REPORT.TheFirstRow.monthStatistic")}
                    </Menu.Item>
                    <Menu.Item className={` font-bold `} key={"sub12" + 2}
                        onClick={() => {setIsShowNationlityReport(true); setMonthType(TypeMonthly.RoomType)}}
                    >
                        {t("REPORT.TheFirstRow.nationalityRoomType")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12" + 3}
                        onClick={() => {setIsShowNationlityReport(true); setMonthType(TypeMonthly.Statistic)}}
                    >
                        {t("REPORT.TheFirstRow.nationality")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12" + 4}
                        onClick={() => setIsShowNationlityReport(true)}
                        disabled
                    >
                        {t("REPORT.TheFirstRow.nationalityStatisticBreakdown")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={3}
            >
                <SubMenu key="sub13" title={t("REPORT.TheFirstRow.housekeepingReport")}
                    popupClassName={`custom-submenu ${classes.popupMenu}`}
                >
                    <Menu.Item
                        key={"sub13" + 1}
                        className={` font-bold `}
                        disabled
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.ExtraCharge)
                        }}
                    >
                        {t("REPORT.TheFirstRow.roomsStatus")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 2}
                        disabled
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.ExtraCharge)
                        }}
                    >
                        {t("REPORT.TheFirstRow.extraBed")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 3}
                        disabled
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.ExtraCharge)
                        }}
                    >
                        {t("REPORT.TheFirstRow.supervisorCheckList")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 4}
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Laundry)
                            setIsDetail(false)
                            setIsItems(false)
                        }}
                    >
                        {t("REPORT.TheFirstRow.laundryByDate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 5}
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Laundry)
                            setIsDetail(true)
                            setIsItems(true)
                        }}
                    >
                        {t("REPORT.TheFirstRow.laundryDetailsItems")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 6}
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Laundry)
                            setIsDetail(false)
                            setIsItems(true)
                        }}
                    >
                        {t("REPORT.TheFirstRow.laundrySummaryItems")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 7}
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Laundry)
                            setIsDetail(false)
                            setIsItems(false)
                        }}
                    >
                        {t("REPORT.TheFirstRow.laundrySummaryControl")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 8}
                        disabled
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Minibar)
                        }}
                    >
                        {t("REPORT.TheFirstRow.minibarControl")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 9}
                        disabled
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Minibar)
                        }}
                    >
                        {t("REPORT.TheFirstRow.minibarByDate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 10}
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Minibar)
                            setIsDetail(true)
                            setIsItems(true)
                        }}
                    >
                        {t("REPORT.TheFirstRow.minibarDetailItem")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 11}
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.Minibar)
                            setIsDetail(false)
                            setIsItems(true)
                        }}
                    >
                        {t("REPORT.TheFirstRow.minibarSummaryItem")}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13" + 12}
                        disabled
                        onClick={() => {
                            setIsShowHouseKeepingReport(true)
                            setHousekeepingType(TypeHouseKeeping.LostBroken)
                        }}
                    >
                        {t("REPORT.TheFirstRow.lostAndFoundRecord")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={4}
            >
                <SubMenu key="sub14" title={t("REPORT.TheFirstRow.guestBalanceReport")}
                    onTitleClick={() => setIsShowGuestBalanceReport(true)}
                >
                </SubMenu>
            </Menu>
            {isShowNationlityReport ?
                <NationalityReportModal
                    isShowModal={isShowNationlityReport}
                    setIsShowModal={setIsShowNationlityReport}
                    title={t("REPORT.TheFirstRow.inputDate")}
                    isLoading={isLoadingPrint}
                    onSubmit={handleSubmitNationality}
                    monthType={monthType}
                />
                : ""}
            {isShowHouseKeepingReport ?
                <HouseKeepingReportModal
                    isShowModal={isShowHouseKeepingReport}
                    setIsShowModal={setIsShowHouseKeepingReport}
                    title={t("REPORT.TheFirstRow.selectDate")}
                    onSubmit={handleSubmitHousekeeping}
                    isLoadingPrint={isLoadingPrint}
                />
                : ""}
            {isShowGuestInHouseReport ?
                <GuestInHouseReportModal
                    isShowModal={isShowGuestInHouseReport}
                    setIsShowModal={setIsShowGuestInHouseReport}
                    title={"Print Group InHouse No Rate"}
                    onSubmit={handleSubmitGuestInHouse}
                    isLoadingPrint={isLoadingPrint}
                />
                : ""}
            {isShowGuestBalanceReport ?
                <HouseKeepingReportModal
                    isShowModal={isShowGuestBalanceReport}
                    setIsShowModal={setIsShowGuestBalanceReport}
                    title={t("REPORT.TheFirstRow.selectDate")}
                    onSubmit={handleSubmitGuestBalance}
                    isLoadingPrint={isLoadingPrint}
                />
                : ""}
        </div>
    )
}
export default TheFirstRow;