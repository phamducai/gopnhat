import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import ClassBox from "components/CClassBox";
import { useTranslation } from "react-i18next";
import { useSelectorRoot } from "redux/store";
import DashBoardService from "services/dashboard/dashboard.service";
import { IReqStatistic } from "common/dashboard/PropsDashboard";
import { addDays, subDays } from "date-fns";
import Utils from "common/utils";
import GLobalPkm from "common/global";
import { useDispatch } from "react-redux";
import { reqListRevenueInDay } from "redux/controller";
import openNotification from "components/CNotification";
import { NotificationStatus } from "common/enum/shared.enum";

const options = {
    legend: {
        display: true,
        position: "top",
        align: "end",
        fontColor: "#00293B",
    },
    responsive: true,
    scales: {
        xAxes: [
            {
                gridLines: {
                    display: true,
                    lineWidth: 1,
                    drawBorder: false,
                    borderDash: [3, 3],
                    zeroLineColor: "transparent"
                },
                categoryPercentage: 0.7,
                barPercentage: 0.9,
                ticks: {
                    beginAtZero: false,
                    tickMarkLength: 20
                }
            }
        ],
        yAxes: [
            {
                display: true,
                gridLines: {
                    display: true,
                    borderDash: [6, 6],
                    zeroLineColor: "#BDBDBD",
                },
                ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                }
            }
        ]
    }
}

const CRevenue = (props: Props): JSX.Element => {
    const { t } = useTranslation("translation")
    const { hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const dispatch = useDispatch()
    // const [revenueInLast7Day, setRevenueInLast7Day] = useState<number[]>([])
    const [revenueInLNext7Day, setRevenueInLNext7Day] = useState<number[]>([])
    const [labelChart, setLabelChart] = useState<string[]>([])
    const [departureNext7, setDepartureNext7] = useState<string | null>(null)
    const [arrivalDateNext7, setArrivalDateNext7] = useState<string | null>(null)

    // const arrivalDateLast7 = Utils.convertEndDate(subDays(new Date(businessDate), 6))
    // const departureLast7 = Utils.convertEndDate(businessDate)
    useEffect(() => {
        const calculateWeek = () => {
            if (businessDate) {
                const calculateMonday = new Date(businessDate).getDay()
                const getMonday = new Date(subDays(new Date(businessDate), calculateMonday))
                const arrivalDateNext7 = Utils.convertEndDate(getMonday)
                const departureNext7 = Utils.convertEndDate(addDays(new Date(getMonday), 6))
                if (arrivalDateNext7 && departureNext7) {
                    setArrivalDateNext7(arrivalDateNext7)
                    setDepartureNext7(departureNext7)
                }
            }
        }
        calculateWeek()
    }, [businessDate])

    useEffect(() => {
        try {
            const roomTypeGuid = GLobalPkm.defaultBytes32
            const dataRevenueInLNext7Day = async (dataRevenue: IReqStatistic) => {
                const res = await DashBoardService.getRevenueInDay(dataRevenue)
                dispatch(reqListRevenueInDay(res))
                const label = DashBoardService.handleLabelChart(res)
                setLabelChart(label)
                setRevenueInLNext7Day(res.map(i => i.Value))
            }
            if (arrivalDateNext7 && departureNext7) {
                // dataRevenueLast7Day({hotelGuid: hotelId, roomTypeGuid, arrivalDate: arrivalDateLast7, departureDate: departureLast7})// getRevenueInLast7Day
                dataRevenueInLNext7Day({ hotelGuid: hotelId, roomTypeGuid, arrivalDate: arrivalDateNext7, departureDate: departureNext7 }) // getRevenueInLNext7Day
            }
        } catch (error) {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrivalDateNext7, departureNext7, hotelId])

    // const dataRevenueLast7Day = async (dataRevenue: IReqStatistic) => {
    //     const res = await DashBoardService.getRevenueInDay(dataRevenue)
    //     setRevenueInLast7Day(res.map(i => i.Value))
    // }

    const data = {
        labels: labelChart,
        datasets: [
            // {
            //     label: t("DASHBOARD.last7Day"),
            //     data: revenueInLast7Day,
            //     fill: true,
            //     backgroundColor: "transparent",
            //     borderColor: "#1A87D7",
            //     pointRadius: null,
            //     borderWidth: 1
            // },
            {
                label: t("DASHBOARD.next7Day"),
                data: revenueInLNext7Day,
                fill: false,
                borderColor: "#E91E63",
                pointRadius: null,
                borderWidth: 1
            }
        ],
    };

    return (
        <ClassBox title={t("DASHBOARD.revenue")} className={props.className}>
            <Line
                height={80}
                data={data}
                options={options}
            />
        </ClassBox>
    )
}

export default React.memo(CRevenue)