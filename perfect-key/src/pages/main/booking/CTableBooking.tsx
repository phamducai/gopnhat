/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Menu, Dropdown, Tooltip, Table } from 'antd';
import { useStyleTheme } from 'theme';
import clsx from 'clsx';
import { styleCTable } from 'components/CStyleTable';
import Utils from 'common/utils';
import { ICTableBooking } from 'common/define-booking';
import { PlusOutlined } from '@ant-design/icons';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
var lodash = require('lodash');

export interface columnType extends Props {
    width?: number | string;
    dataIndex?: string;
    key?: string;
}

const CTableBooking = ({ room, selectedViewStyle, reservatedRooms, onClickValue, hiddenCollapse, heightHeader, handleAddBooking, ...props }: ICTableBooking): JSX.Element => {
    const classes = useStyleTheme(styleCTable);
    const [columnTable, setColumnTable] = useState<columnType[]>()
    const [dataTable, setDataTable] = useState<any>()
    const currentDate = (Utils.formatDate(new Date()));
    const [dataFooter, setDataFooter] = useState([])
    const { t } = useTranslation("translation")

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
            let newDataFooter: any = []
            let count = 0
            reservatedRooms?.forEach((e: any, i: number) => {
                count = Object.keys(e.roomTypesCount).length
                newColumn = [...newColumn, {
                    title: <div className="flex justify-center items-center">{Utils.formatDateString(e.day)}</div>,
                    dataIndex: `data${i + 1}`,
                    key: (i + 1).toString(),
                }]
            });
            let sumTotalColumn: number = 0
            for (let index = 0; index < count; index++) {
                const convertData: any = {};
                const key = Object.entries(reservatedRooms[0].roomTypesCount)[index][0]
                convertData.key = key
                reservatedRooms.forEach((items: any, index: number) => {
                    if (index === 0) {
                        convertData[`data${index}`] = <div style={{ paddingLeft: "16px" }}>{items.roomTypesCount[key].ten}</div>
                    }
                    if (selectedViewStyle === "Room availability") {
                        const countRoom = items.roomTypesCount[key].countRoom
                        const countReservatedRooms = items.roomTypesCount[key].transactRooms.length
                        const count = countRoom - countReservatedRooms
                        const newDate = new Date(format(parseISO(items?.day), 'yyyy-MM-dd'))
                        const menu = (
                            <Menu>
                                <Menu.Item
                                    disabled={Utils.formatDateString(items.day) < currentDate}
                                    onClick={() => {
                                        handleAddBooking({
                                            dateArrival: newDate,
                                            dateDeparture: newDate,
                                        })
                                    }}
                                    className="flex items-center" key="2">
                                    {Utils.formatDateString(items.day) < currentDate ?
                                        <Tooltip placement='right' title="Out of date">
                                            <PlusOutlined style={{ width: "15px" }} /> {t("BOOKING.addBooking")}
                                        </Tooltip> :
                                        <><PlusOutlined style={{ width: "15px" }} /> {t("BOOKING.addBooking")}</>}
                                </Menu.Item>
                            </Menu>
                        );
                        convertData[`data${index + 1}`] =
                            <Dropdown overlay={menu} className="!m-0 !p-0" trigger={['contextMenu']}>
                                <div onClick={() => {
                                    // if (count !== countRoom)
                                    onClickValue({
                                        availableDate: newDate,
                                        roomType: key,
                                    })
                                }}
                                    className={`hover:bg-blue-100 flex justify-center items-center h-10 ${count === countRoom ? 'cursor-pointer' : 'cursor-pointer'}`}>
                                    {count}
                                </div>
                            </Dropdown>
                    } else if (selectedViewStyle === "Reserved rooms") {
                        const countReservatedRooms = items.roomTypesCount[key].transactRooms.length
                        convertData[`data${index + 1}`] = <div className='flex justify-center items-center h-10'>{countReservatedRooms}</div>
                    }
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
            // Handle data row listRow Arrival rooms', 'Departure rooms', 'Room revenue', 'Definite rooms', 'Tentative rooms, 'Total'
            const listRows = ['Arrival rooms', 'Departure rooms', 'Room revenue', 'Definite rooms', 'Tentative rooms']
            let averageOfTotal = 0
            // Add row Total
            let dataTotalRow: any = {
                key: "totalRow",
                data0: t("BOOKING.total"),
            }
            const countArrivalRooms: number[] = []
            const countDepartureRooms: number[] = []
            const countRoomRevenue: string[] = []
            const countDefiniteRooms: number[] = []
            const countTentativeRooms: number[] = []
            newColumn.forEach((column: any, i: number) => {
                let sum: number = 0
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
                    countRoomRevenue.push(Utils.formatNumber(sumRoomRevenue))
                    countDefiniteRooms.push(sumDefiniteRooms)
                    countTentativeRooms.push(sumTentativeRooms)
                    
                    averageOfTotal = ((sum / sumTotalColumn) * 100) + averageOfTotal
                    const countBooking: number = sumTotalColumn - sum

                    dataTotalRow = { ...dataTotalRow, [column.dataIndex]: `${countBooking}/(${(100 - (sum / sumTotalColumn) * 100).toFixed(1)}%)/${sum}` }
                }
            });

            // const countBookingRoom:number = lodash.sum(countArrivalRooms) + lodash.sum(countArrivalRooms)
            // dataTotalRow = {...dataTotalRow, [`total`]: 
            // `${((countBookingRoom))}/${(((countBookingRoom/(sumTotalColumn - countBookingRoom)) * 100)).toFixed(1)}%/${sumTotalColumn - countBookingRoom}`}

            dataTotalRow = { ...dataTotalRow, [`total`]: `${sumTotalColumn}/(Avg-${(averageOfTotal / (newColumn?.length - 2)).toFixed(1)}%)` }

            newDataFooter.push(dataTotalRow)
            const countRevenueRoom: number[] = []
            countRoomRevenue.forEach((item) => {
                countRevenueRoom.push(Utils.parseLocaleNumber(item))
            })
            
            // Add row Arrival rooms', 'Departure rooms', 'Room revenue', 'Definite rooms', 'Tentative rooms
            listRows.forEach((e: any, i: number) => {
                let dataRow: any = {
                    key: e,
                    data0: e,
                }
                if (e === 'Arrival rooms') {
                    countArrivalRooms.forEach((_e: any, _i: number) => {
                        dataRow = { ...dataRow, [`data${_i + 1}`]: _e }
                    });
                    dataRow = { ...dataRow, [`total`]: countArrivalRooms.reduce(((a: number, b: number) => a + b), 0) }
                } else if (e === 'Departure rooms') {
                    countDepartureRooms.forEach((_e: any, _i: number) => {
                        dataRow = { ...dataRow, [`data${_i + 1}`]: _e }
                    });
                    dataRow = { ...dataRow, [`total`]: countDepartureRooms.reduce(((a: number, b: number) => a + b), 0) }
                } else if (e === 'Room revenue') {
                    countRoomRevenue.forEach((_e: any, _i: number) => {
                        dataRow = { ...dataRow, [`data${_i + 1}`]: _e }
                    });
                    dataRow = { ...dataRow, [`total`]: Utils.formatNumber(countRevenueRoom.reduce(((a: number, b: number) => a + b), 0)) }
                } else if (e === 'Definite rooms') {
                    countDefiniteRooms.forEach((_e: any, _i: number) => {
                        dataRow = { ...dataRow, [`data${_i + 1}`]: _e }
                    });
                    dataRow = { ...dataRow, [`total`]: countDefiniteRooms.reduce(((a: number, b: number) => a + b), 0) }
                }
                else if (e === 'Tentative rooms') {
                    countTentativeRooms.forEach((_e: any, _i: number) => {
                        dataRow = { ...dataRow, [`data${_i + 1}`]: _e }
                    });
                    dataRow = { ...dataRow, [`total`]: countTentativeRooms.reduce(((a: number, b: number) => a + b), 0) }
                }
                else {
                    newColumn.forEach((_e: any, _i: number) => {
                        if (_i !== 0 && _i !== 1) {
                            dataRow = { ...dataRow, [`data${_i}`]: '0' }
                        } else {
                            dataRow = { ...dataRow, [`total`]: '0' }
                        }
                    });
                }

                newDataFooter.push(dataRow)
            });
            //  Handle data row listRow -------------

            newColumn?.length > 2 ?
                setColumnTable(newColumn) :
                setColumnTable([...newColumn, {
                    title: <div className="flex justify-center">{t("BOOKING.date")}</div>,
                    dataIndex: `date`,
                    key: "0", 
                }])
            newData?.length > 6 && (
                setDataTable(newData),
                setDataFooter(newDataFooter)
            )
        } catch (error) { }
    }, [reservatedRooms, selectedViewStyle, t("BOOKING.roomType")])

    return (
        <div style={{
            height: hiddenCollapse ? `calc(100vh - (${heightHeader}px + 175px))` : "421px",
            transition: "all 0.8s"
        }} className={clsx(props.className, classes.table)}>
            <Table
                className="tableBooking !relative"
                locale={{
                    emptyText: <div
                        className="flex items-center justify-center"
                        style={{ height: hiddenCollapse ? `calc(100vh - (${heightHeader}px + 245px))` : "350px" }}>{t("BOOKING.noData")}</div>
                }}
                pagination={false}
                columns={columnTable}
                dataSource={dataTable}
                scroll={{ x: `calc(140px + 110px + (${columnTable && columnTable?.length - 2}) * 100px)`, y: hiddenCollapse ? `calc(100vh - (${heightHeader}px + 175px))` : "421px" }}
                summary={() => {
                    return (
                        <>{dataFooter.map((listItems: any, index: any) => {
                            const newListItems = Object.entries(listItems)
                            return (
                                <Table.Summary.Row key={index} className={`${listItems.key === 'totalRow' && 'font-bold'} fakeFooter fakeFooter${index + 1}`}>
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
                                    {
                                        newListItems.map((items: any, i: any) => {
                                            const key = items[0]
                                            const value = items[1]
                                            if (key !== 'key' && key !== 'total' && key !== 'data0') {
                                                return (
                                                    <Table.Summary.Cell key={i} className="cell text-center" index={i}>
                                                        <Tooltip title={`Booked/Remaining`}>
                                                            {value}
                                                        </Tooltip>
                                                    </Table.Summary.Cell>
                                                )
                                            }
                                        })
                                    }
                                </Table.Summary.Row>
                            )
                        })}</>
                    );
                }}
            />
        </div>
    )
}
export default React.memo(CTableBooking)