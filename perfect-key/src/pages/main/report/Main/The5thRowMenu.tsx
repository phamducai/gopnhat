import React, { useState } from "react";
import { Menu, } from "antd";
import { useStyleTheme } from "theme";
import { useTranslation } from "react-i18next";
import { styleReport } from "pages/main/report/styles/styleReport";
import { ArrivalDepartureReportModal } from "../ModalReport/ArrivalDepartureReport";
import { IDataAPIInputDataReport } from "common/report/define-api-report";
import { IInputDataReport } from "common/report/define-report";
import { useSelectorRoot } from "redux/store";
import PrintReportService from "services/report/printReport.service";
import { ByOderOption } from "common/enum/report.enum";
const { SubMenu } = Menu;

const The5thRow = (): JSX.Element => {
    const classes = useStyleTheme(styleReport);
    const { t } = useTranslation("translation");
    const {hotelId} = useSelectorRoot(state => state.app)

    const [isLoadingPrint, setIsLoadingPrint] = useState(false)
    const [isShowTimeReport, setIsShowTimeReport] = useState<boolean>(false); 
    const [isGroupCode, setIsGroupCode] = useState<boolean>(false); 
    const [isRate, setIsRate] = useState(false)
    const [orderBy, setOrderBy] = useState("")
    
    const onSubmitDeparture = async (data: IInputDataReport) => {
        setIsLoadingPrint(true)
        let dataApi: IDataAPIInputDataReport = {
            hotelGuid: hotelId,
            isRate: isRate,
            isComments: data.isComments,
            orderBy: orderBy,
            isMainGuestOnly: data.mainGuest,
            departureDate: data.date,
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
    return(
        <div className="grid grid-cols-12 gap-2 my-2">
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={17}
            >
                <SubMenu key="sub1" title={t("REPORT.The5thRow.departureReport")}
                >
                    <Menu.Item
                        key={"sub11"+1}
                        className={` font-bold `}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(false); setIsRate(false); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The5thRow.departureNoRate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub12"+1}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(false); setIsRate(true); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The5thRow.departureWithRate")}
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+1}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(true); setIsRate(false); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The5thRow.groupDepatureNoRate")}
                    </Menu.Item>
                    <Menu.Item
                        className={` font-bold `}
                        key={"sub13"+3}
                        onClick={() => {setIsShowTimeReport(true); setIsGroupCode(true); setIsRate(true); setOrderBy(ByOderOption.ByRoom)}}
                    >
                        {t("REPORT.The5thRow.groupDepatureWithRate")}
                    </Menu.Item>
                </SubMenu>
            </Menu>
            <Menu
                className={`${classes.dropDownBtn} col-span-12 more-items w-full relative sm:col-span-12 md:col-span-6 lg:col-span-3`}
                triggerSubMenuAction="click"
                key={18}
                disabled
            >
                <SubMenu key="sub1" title={t("REPORT.The5thRow.POSReport")}
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
                    isShowModal={isShowTimeReport}
                    setIsShowModal={setIsShowTimeReport}
                    title={t("REPORT.TheFirstRow.inputData")}
                    typeModal={"Departure"}
                    onSubmitArrival={onSubmitDeparture}
                    isGroupCode={isGroupCode}
                    isLoading={isLoadingPrint}
                />
                : ""}
        </div>
    )
}
export default The5thRow;