import React, { useState } from "react";
import { Menu, } from "antd";
import { useStyleTheme } from "theme";
import { useTranslation } from "react-i18next";
import { styleReport } from "pages/main/report/styles/styleReport";
import { ArrivalDepartureReportModal } from "../ModalReport/ArrivalDepartureReport";
import { AccountDetailReportModal } from "../ModalReport/AccountDetailsReport";
import { IAccountDetailReport, IInputDataReport } from "common/report/define-report";
import { useSelectorRoot } from "redux/store";
import { IDataAPIInputDataReport } from "common/report/define-api-report";
import PrintReportService from "services/report/printReport.service";
import { ByOderOption } from "common/enum/report.enum";
const { SubMenu } = Menu;

const The4thRow = (): JSX.Element => {
    const classes = useStyleTheme(styleReport);
    const { t } = useTranslation("translation");
    const {hotelId} = useSelectorRoot(state => state.app)

    const [isLoadingPrint, setIsLoadingPrint] = useState(false)
    const [isShowTimeReport, setIsShowTimeReport] = useState<boolean>(false); 
    const [isShowAccountReport, setIsShowAccountReport] = useState<boolean>(false); 
    const [isGroupCode, setIsGroupCode] = useState<boolean>(false); 
    const [selectAccount, setSelectAccount] = useState<string[]>([]);
    const [isRate, setIsRate] = useState(false)
    const [orderBy, setOrderBy] = useState("")

    
    // submit function arrival report 
    const onSubmitArrival = async (data: IInputDataReport) => {
        setIsLoadingPrint(true)
        let dataApi: IDataAPIInputDataReport = {
            hotelGuid: hotelId,
            isRate: isRate,
            isComments: data.isComments,
            orderBy: orderBy,
            isMainGuestOnly: data.mainGuest,
            arrivalDate: data.date
        }
        if(isGroupCode){ 
            dataApi = {...dataApi,
                groupCode: data.groupCode !== "" ? data.groupCode : null 
            }
        }else{
            dataApi = {...dataApi,
                lastName: data.lastName !== "" ? data.lastName : null
            }
        }
        const res = await PrintReportService.arrivalDepartureReport(dataApi)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowTimeReport(false)
    }

    // submit function print account details 
    const onSubmitAccountDetail = async (data: IAccountDetailReport) => {
        setIsLoadingPrint(true)
        const res = await PrintReportService.accountDetailReport(data, hotelId, selectAccount)
        if (res)
            window.open(res)
        setIsLoadingPrint(false)
        setIsShowAccountReport(false)
    }

    return(
        <div className="grid grid-cols-12 gap-2 my-2">
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={13}
            >
                <SubMenu key="sub1" title={t("REPORT.The4thRow.arrivalReport")}
                >
                    <Menu.Item
                        key={"sub11"+1}
                        className={` font-bold `}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(false); setIsRate(false); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The4thRow.arrivalNoRate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12"+1}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(false); setIsRate(true); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The4thRow.arrivalRate")}
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+1}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(true); setIsRate(false); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The4thRow.groupArrivalNoRateByRoom")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+2}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(true); setIsRate(false); setOrderBy(ByOderOption.ByGuestName)}}
                    >
                        {t("REPORT.The4thRow.groupArrivalNoRateByAl")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+3}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(true); setIsRate(true); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The4thRow.groupArrivalWithRateByRoom")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+4}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(true); setIsRate(true); setOrderBy(ByOderOption.ByGuestName)}}
                    >
                        {t("REPORT.The4thRow.groupArrivalWithRateByAl")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={14}
                disabled
            >
                <SubMenu key="sub1" title={t("REPORT.The4thRow.otherRSVN")}
                >
                    <Menu.Item
                        key={"sub11"+2}
                        className={` font-bold `}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelToday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12"+2}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelYesterday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+2}
                    >
                        {t("FRONTDESK.ROOMRACK.searchToCancel")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={15}
            >
                <SubMenu key="sub1" title={t("REPORT.The4thRow.accountDetails")}
                    onTitleClick={() => setIsShowAccountReport(true)}
                >
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={16}
                disabled
            >
                <SubMenu key="sub1" title={t("REPORT.The4thRow.MICReport")}
                >
                    <Menu.Item
                        key={"sub11"+2}
                        className={` font-bold `}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelToday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12"+2}
                    >
                        {t("FRONTDESK.ROOMRACK.cancelYesterday")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+2}
                    >
                        {t("FRONTDESK.ROOMRACK.searchToCancel")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            {isShowTimeReport ?
                <ArrivalDepartureReportModal
                    isShowModal={ isShowTimeReport }
                    setIsShowModal={ setIsShowTimeReport }
                    title={t("REPORT.TheFirstRow.inputData")}
                    typeModal={ "Arrival" }
                    onSubmitArrival={ onSubmitArrival } 
                    isGroupCode={ isGroupCode }
                    isLoading={isLoadingPrint}
                />
                : ""}
            {isShowAccountReport ?
                <AccountDetailReportModal
                    isShowModal={isShowAccountReport}
                    setIsShowModal={setIsShowAccountReport}
                    title={t("REPORT.TheFirstRow.inputData")}
                    onSubmitAccountDetail={onSubmitAccountDetail}
                    setSelectAccount={setSelectAccount}
                    selectAccount={selectAccount}
                    isLoading={isLoadingPrint}
                />
                : ""}
        </div>
    )
}
export default The4thRow;