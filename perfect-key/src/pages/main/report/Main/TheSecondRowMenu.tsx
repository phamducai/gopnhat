import React, { useState } from "react";
import { Menu, } from "antd";
import { useStyleTheme } from "theme";
import { useTranslation } from "react-i18next";
import { styleReport } from "pages/main/report/styles/styleReport";
import { CashierReportModal } from "../ModalReport/CashierReport";
import { HouseKeepingReportModal } from "../ModalReport/HouseKeepingReport";
import { IDataDateFromReport } from "common/report/define-report";
import PrintReportService from "services/report/printReport.service";
import { useSelectorRoot } from "redux/store";
const { SubMenu } = Menu;

const TheSecondRow = (): JSX.Element => {
    const classes = useStyleTheme(styleReport);
    const { t } = useTranslation("translation");
    const {hotelId} = useSelectorRoot(state => state.app)

    const [isShowCashierReport, setIsShowCashierReport] = useState<boolean>(false);
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const [isShowManagerReport, setIsShowManagerReport] = useState<boolean>(false);
    const [isShowGuestFolioReport, setIsShowGuestFolioReport] = useState<boolean>(false);
    const [isLoadingPrint, setIsLoadingPrint] = useState(false)

    const handleSubmitGuestFolio = async (data: IDataDateFromReport) => {
        setIsLoadingPrint(true)
        const res = await PrintReportService.guestFolioReport(data, hotelId, isDetail)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowGuestFolioReport(false)
    }
    const handleSubmit = async (data: IDataDateFromReport) => {
        console.log();
    }
    return (
        <div className="grid grid-cols-12 gap-2 my-2">
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={5}
                disabled
            >
                <SubMenu key="sub21" title={t("REPORT.TheSecordRow.managerReport")} onTitleClick={() => setIsShowManagerReport(true)}>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={6}
                disabled
            >
                <SubMenu key="sub22" title={t("REPORT.TheSecordRow.otherFrontdeskReport")}
                >
                    <Menu.Item
                        key={"sub22" + 1}
                        className={` font-bold `}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelToday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub22" + 2}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelYesterday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub22" + 3}
                    >
                        {t("FRONTDESK.ROOMRACK.searchToCancel")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={7}
                disabled
            >
                <SubMenu key="sub23" title={t("REPORT.TheSecordRow.cashierReport")}
                    onTitleClick={() => setIsShowCashierReport(true)} />
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={8}
            >
                <SubMenu key="sub24" title={t("REPORT.TheSecordRow.guestFolioReport")}
                >
                    <Menu.Item
                        key={"sub24" + 1}
                        className={` font-bold `}
                        onClick= {() => {setIsShowGuestFolioReport(true); setIsDetail(false)}}
                    >
                        {t("REPORT.TheSecordRow.guestFolio")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub24" + 2}
                        onClick= {() => {setIsShowGuestFolioReport(true); setIsDetail(true)}}
                    >
                        {t("REPORT.TheSecordRow.guestFolioByDetails")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            {isShowCashierReport ?
                <CashierReportModal
                    isShowModal={isShowCashierReport}
                    setIsShowModal={setIsShowCashierReport}
                    title={t("REPORT.TheFirstRow.cashierDetailReport")}
                    isLoadingPrint={isLoadingPrint}
                    onSubmit={() => console.log("a")}
                />
                : ""}
            {isShowManagerReport ?
                <HouseKeepingReportModal
                    isShowModal={isShowManagerReport}
                    setIsShowModal={setIsShowManagerReport}
                    title={t("REPORT.TheFirstRow.selectDate")}
                    onSubmit={handleSubmit}
                />
                : ""}
            {isShowGuestFolioReport ?
                <HouseKeepingReportModal
                    onSubmit={handleSubmitGuestFolio}
                    isShowModal={isShowGuestFolioReport}
                    setIsShowModal={setIsShowGuestFolioReport}
                    title={t("REPORT.TheFirstRow.selectDate")}
                    isLoadingPrint={isLoadingPrint}
                />
                : ""}
        </div>
    )
}
export default TheSecondRow;