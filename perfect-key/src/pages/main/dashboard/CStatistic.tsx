/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Tooltip } from "antd";
import Utils from 'common/utils';
import ClassBox from 'components/CClassBox';
import { addDays } from 'date-fns';
import useWindowSize from 'hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchReservatedRooms } from 'redux/controller';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import DashBoardService from 'services/dashboard/dashboard.service';
import { useStyleTheme } from 'theme';
import DatePicker from "../../../components/CDatePicker";
import { columnType } from '../booking/CTableBooking';
import { styleStatistic } from './style/styleStatistic';

export default function Cashier(): JSX.Element {
    const classes = useStyleTheme(styleStatistic);
    const { t } = useTranslation("translation")
    const dispatch = useDispatchRoot();
    const {roomTypePMId, numberOfRooms} = useSelectorRoot(state => state.app)
    const {businessDate} = useSelectorRoot(state => state.hotelConfig)
    const { reservatedRooms, loadingTable } = useSelectorRoot(state => state.booking)
    const size = useWindowSize();

    const [heightSize, setHeightSize] = useState<string>(DashBoardService.getHeightSizeTable(size));
    const [columnTable, setColumnTable] = useState<columnType[]>()
    const [dataTable, setDataTable] = useState<any>([])
    const [dataFooter, setDataFooter] = useState<any>([])

    const { RangePicker } = DatePicker;
    const dateFormat = "dd-MM-yyyy";
    const today = new Date(businessDate);
    const [before7Day, setBefore7Day] = useState(addDays(today, 6))
    const [last7Day, setLast7Day] = useState(new Date())

    useEffect(() => {
        const newPageSize = DashBoardService.getHeightSizeTable(size);
        setHeightSize(newPageSize);
        //eslint-disable-next-line
    }, [size])
    
    useEffect(() => {
        dispatch(fetchReservatedRooms({
            numberOfRooms: numberOfRooms.filter(x => x.id !== roomTypePMId),
            arivalDay: Utils.formatDateCallApi(last7Day),
            depatureDay: Utils.formatDateCallApi(before7Day),
        }))
    },[before7Day, numberOfRooms, roomTypePMId, dispatch, last7Day])
    
    // Only run once default
    useEffect(() => {
        try {
            let newColumn: columnType[] = [
                {
                    title: <div>{t("BOOKING.roomType")}</div>,
                    dataIndex: `data0`,
                    key: "0",
                    width: "140px",
                },
                {
                    title: <div className="flex justify-center items-center">{t("BOOKING.total")}</div>,
                    dataIndex: `total`,
                    key: "total",
                    width: "110px",
                }
            ]
            const newData: any = []
            const newDataFooter: any = []
            let count = 0
            reservatedRooms?.forEach((e: any, i: number) => {
                count = Object.keys(e.roomTypesCount).length
                newColumn = [...newColumn, {
                    title: <div className="flex justify-center items-center">{Utils.formatDateString(e.day)}</div>,
                    dataIndex: `data${i + 1}`,
                    key: (i + 1).toString(),
                }]
            });
            let sumTotalColumn = 0
            for (let index = 0; index < count; index++) {
                const convertData: any = {};
                const key = Object.entries(reservatedRooms[0].roomTypesCount)[index][0]
                convertData.key = key
                reservatedRooms.forEach((items: any, index: number) => {
                    if (index === 0) {
                        convertData[`data${index}`] = <div style={{ paddingLeft: "16px" }}>{items.roomTypesCount[key].ten}</div>
                    }
                    const countRoom = items.roomTypesCount[key].countRoom
                    const countReservatedRooms = items.roomTypesCount[key].transactRooms.length
                    const count = countRoom - countReservatedRooms
                    convertData[`data${index + 1}`] =
                                <div className={`hover:bg-blue-100 flex justify-center items-center h-10`}>
                                    {count}
                                </div>
                });
                // Add column total
                convertData.total = <div className="flex justify-center items-center font-bold" >{reservatedRooms[0].roomTypesCount[key].countRoom}</div>
                sumTotalColumn = parseInt(reservatedRooms[0].roomTypesCount[key].countRoom) + sumTotalColumn // tính sum total column                
                newData.push(convertData)
                // Add column total end ---------
            }
            const convertBed: any = {};
            const convertOOO: any = {};
            reservatedRooms.forEach((items: any, index: number) => {
                if (index === 0) {
                    convertBed.key = index + "rs";
                    convertBed[`data${index}`] = <div style={{ paddingLeft: "16px" }}>Extra bed</div>
                }
            })
            newData.push(convertBed)
            reservatedRooms.forEach((items: any, index: number) => {
                if (index === 0) {
                    convertOOO.key = index + "res";
                    convertOOO[`data${index}`] = <div style={{ paddingLeft: "16px" }}>OOO + OOS</div>
                }
            })
            newData.push(convertOOO)

            let averageOfTotal = 0
            // Add row Total
            let dataTotalRow: any = {
                key: "totalRow",
                data0: t("BOOKING.total"),
            }
            const countArrivalRooms: number[] = []
            const countDepartureRooms: number[] = []
            const countRoomRevenue: number[] = []
            const countDefiniteRooms: number[] = []
            const countTentativeRooms: number[] = []
            newColumn.forEach((column: any, i: number) => {
                let sum = 0
                if (i !== 0 && column.dataIndex !== 'total') {
                    let sumArrivalRooms = 0
                    let sumDepartureRooms = 0
                    let sumRoomRevenue = 0
                    let sumDefiniteRooms = 0
                    let sumTentativeRooms = 0
                    const data = Object.entries(reservatedRooms[i - 2].roomTypesCount)
                    data.forEach((e: any) => {
                        const countArrivalRooms = e[1]?.transactRooms.filter((e: any) =>
                            Utils.formatDateString(e.arrivalDate) === column?.title?.props?.children
                        );
                        const countDepartureRooms = e[1]?.transactRooms.filter((e: any) =>
                            Utils.formatDateString(e.departureDate) === column?.title?.props?.children
                        );
                        sum = (parseInt(e[1].countRoom) - e[1].transactRooms.length) + sum
                        sumArrivalRooms = countArrivalRooms.length + sumArrivalRooms
                        sumDepartureRooms = countDepartureRooms.length + sumDepartureRooms
                        if (e[1].transactRooms.length > 0) {
                            e[1].transactRooms.forEach((e: any, i: number) => sumRoomRevenue = e.rate + sumRoomRevenue)
                        }
                        const countDefiniteRooms = e[1]?.transactRooms.filter((e: any) => e?.confirmed);
                        sumDefiniteRooms += countDefiniteRooms.length

                        const countTentativeRooms = e[1]?.transactRooms.filter((e: any) => !e?.confirmed);
                        sumTentativeRooms += countTentativeRooms.length
                    });
                    countArrivalRooms.push(sumArrivalRooms)
                    countDepartureRooms.push(sumDepartureRooms)
                    countRoomRevenue.push(sumRoomRevenue)
                    countDefiniteRooms.push(sumDefiniteRooms)
                    countTentativeRooms.push(sumTentativeRooms)
                    averageOfTotal = ((sum / sumTotalColumn) * 100) + averageOfTotal
                    const countBooking: number = sumTotalColumn - sum

                    dataTotalRow = { ...dataTotalRow, [column.dataIndex]: `${countBooking}/(${(100 - (sum / sumTotalColumn) * 100).toFixed(1)}%)/${sum}` }
                }
            });

            dataTotalRow = { ...dataTotalRow, [`total`]: `${sumTotalColumn}/(Avg-${(averageOfTotal / (newColumn?.length - 2)).toFixed(1)}%)` }
            newDataFooter.push(dataTotalRow)
            
            newColumn?.length > 2 ?
                setColumnTable(newColumn) :
                setColumnTable([...newColumn, {
                    title: <div className="flex justify-center">{t("BOOKING.date")}</div>,
                    dataIndex: `date`,
                    key: "0",
                }])
            if(newData?.length > 6) {
                setDataTable(newData)
                setDataFooter(newDataFooter)
            }
        } catch (error) { console.log(error)}
        // eslint-disable-next-line
    }, [reservatedRooms, t("BOOKING.roomType")])
    
    // eslint-disable-next-line
    const dateTimeOnChange = (date: any, dateString: [string, string]): void => {
        const startDate = date[0];
        const endDate = date[1];
        setLast7Day(startDate)
        setBefore7Day(endDate)
    }
    
    return (
        <ClassBox title={t("DASHBOARD.7DaysOccupancyStatistic")} >
            <div className={`${classes.statisticMain}`}>
                <RangePicker
                    style={{  marginTop: '10px', marginBottom: "10px" }}
                    className={`inputGray ${classes.datePicker}`}
                    format={dateFormat}
                    defaultValue={[last7Day, before7Day]}
                    onChange={dateTimeOnChange}
                />
                <div className={`${classes.statisticTable}`}>
                    <Table
                        className={`${classes.table} text-2xl`}
                        columns={columnTable}
                        dataSource={dataTable}
                        loading={loadingTable}
                        pagination={false}
                        scroll={{ x: 1300, y: heightSize}}
                        summary={() => {
                            return (
                                <>{dataFooter.map((listItems: any, index: any) => {
                                    // const newListItems = Object.entries(listItems)
                                    return (
                                        <Table.Summary.Row key={index} className={`${listItems.key === 'totalRow' && 'font-bold'} ${classes.tableFooter} fakeFooter `}>
                                            <Table.Summary.Cell key={0} className="cell cellName" index={0}>
                                                {listItems.data0}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={1} className="cell text-center font-bold" index={1}>
                                                {
                                                    listItems.key === 'totalRow' ?
                                                        <Tooltip title={`Total/The average`}>
                                                            {listItems.total}
                                                        </Tooltip>
                                                        : listItems.total
                                                }
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={2} className="cell text-center font-bold" index={2}>
                                                {listItems.data1}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={3} className="cell text-center font-bold" index={3}>
                                                {listItems.data2}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={4} className="cell text-center font-bold" index={4}>
                                                {listItems.data3}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={5} className="cell text-center font-bold" index={5}>
                                                {listItems.data4}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={6} className="cell text-center font-bold" index={6}>
                                                {listItems.data5}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={7} className="cell text-center font-bold" index={7}>
                                                {listItems.data6}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell key={8} className="cell text-center font-bold" index={8}>
                                                {listItems.data7}
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    )
                                })}</>
                            );
                        }}
                    />
                </div>
            </div>
        </ClassBox>
    )
}
