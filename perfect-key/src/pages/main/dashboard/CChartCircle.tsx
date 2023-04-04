/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { createStyles, useStyleTheme } from "theme";
import { Doughnut } from "react-chartjs-2";
import ClassBox from "components/CClassBox";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSelectorRoot } from "redux/store";
import Utils from "common/utils";
import { RevenueBySourceMarket } from "common/dashboard/define-api-dashboard";
import { subDays } from "date-fns";
import DashBoardService from "services/dashboard/dashboard.service";
import { RevenueInDaysData } from "common/model-statistic";

const styleCChartCircle = createStyles((theme) => ({
    nameChart: {
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "16px",
        color: "#00293B",
        height: "30px"
    },
    chart: {
        height: "calc(100% - 40px)",
    }
}))

const CChartCircle = (props: Props): JSX.Element => {
    const classes = useStyleTheme(styleCChartCircle);
    const { t } = useTranslation("translation")
    const { hcfgInfo, businessDate} = useSelectorRoot(state => state.hotelConfig);
    const { hotelId } = useSelectorRoot(state => state.app);
    
    const [dataSourceChart, setDataSourceChart] = useState<RevenueInDaysData[]>([])
    const [dataMarketChart, setDataMarketChart] = useState<RevenueInDaysData[]>([])
    const arrivalDate = Utils.convertEndDate(subDays(new Date(businessDate), 7))
    const departureDate = Utils.convertEndDate(businessDate)
    const dataRevenueSource: RevenueBySourceMarket = {isSource: true, hotelGuid: hotelId, arrivalDate, departureDate}
    const dataRevenueMarket: RevenueBySourceMarket = {isSource: false, hotelGuid: hotelId, arrivalDate, departureDate}

    useEffect(() => {
        dataCompanySource(dataRevenueSource)
        dataRateMarket(dataRevenueMarket)
    }, [hotelId])
    
    const dataCompanySource = async (dataSourceMarket: RevenueBySourceMarket) => {
        const res = await DashBoardService.fetchRevenueBySource(dataSourceMarket)
        const dataSource = DashBoardService.handleSourceData(res, hcfgInfo)
        setDataSourceChart(dataSource)
    }
    const dataRateMarket = async (dataSourceMarket: RevenueBySourceMarket) => {
        const res = await DashBoardService.fetchRevenueBySource(dataSourceMarket)
        const dataMarket = DashBoardService.handleMarketData(res, hcfgInfo)
        setDataMarketChart(dataMarket)
    }

    const valueSource = [];
    const valueMarket = [];
    const labelsSource = [];
    const labelsMarket = [];

    if (dataSourceChart === undefined) {
        console.log("dataSource undefined");
    } else {
        for (let i = 0; i < dataSourceChart.length; i++) {
            valueSource.push(dataSourceChart[i].Value);
            labelsSource.push(dataSourceChart[i].Key);
        }
        for (let i = 0; i < dataMarketChart.length; i++) {
            valueMarket.push(dataMarketChart[i].Value);
            labelsMarket.push(dataMarketChart[i].Key);
        }
    }

    //Random color
    const randomColor = (isSource: boolean) => {
        const ict_unit = [];
        const efficiency = [];
        const coloR = [];
        const dynamicColors = function () {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        };
        if(isSource){
            for (const i in dataSourceChart) {
            // ict_unit.push("ICT Unit " + dataSource[i].ict_unit);
            // efficiency.push(dataSource[i].efficiency);
                ict_unit.push("ICT Unit " + dataSourceChart[i]);
                efficiency.push(dataSourceChart[i]);
                coloR.push(dynamicColors());
            }
        }else{
            for (const i in dataMarketChart) {
                ict_unit.push("ICT Unit " + dataMarketChart[i]);
                efficiency.push(dataMarketChart[i]);
                coloR.push(dynamicColors());
            }
        }
        return coloR
    }
    //End random color
    const source = {
        labels: labelsSource,
        datasets: [
            {
                label: "Source",
                backgroundColor: randomColor(true),
                borderColor: "#fff",
                borderWidth: 2,
                hover: true,
                data: valueSource,
            },
        ],
    };
    const market = {
        labels: labelsMarket,
        datasets: [
            {
                label: "Market",
                backgroundColor: randomColor(false),
                borderColor: "#fff",
                borderWidth: 2,
                hover: false,
                data: valueMarket,
            },
        ],
    };

    const options = {
        cutoutPercentage: 25,
        legend: {
            display: false,
        },
    };

    return (
        <ClassBox title={t("DASHBOARD.revenueForNext7Days")} className={clsx(props.className)}>
            <div className={`${classes.chart} grid grid-cols-2 items-center`}>
                <div>
                    <div className={`${classes.nameChart} flex flex-wrap content-center justify-center`}>{t("DASHBOARD.source")}</div>
                    <div className="border-r">
                        <Doughnut options={options} data={source} />
                    </div>
                </div>
                <div>
                    <div className={`${classes.nameChart} flex flex-wrap content-center justify-center`}>{t("DASHBOARD.market")}</div>
                    <Doughnut options={options} data={market} />
                </div>
            </div>
        </ClassBox>
    )
}

export default React.memo(CChartCircle)