/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { RefObject, useEffect, useRef, useState } from 'react'
import CIconSvg from 'components/CIconSvg';
import { Table, InputNumber, Popconfirm, Row, Col } from "antd";
import { ColumnProps } from 'antd/lib/table';
import { useStyleTheme } from 'theme';
import { styleCTable } from 'components/CStyleTable';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { SelectedBookingRoomType } from 'common/model-rsvn';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { setSelectedBookingRoomType } from 'redux/controller/reservation.slice';
import Utils from 'common/utils';
import { useTranslation } from "react-i18next"
import { styleTableSchedule } from '../styles/guestSchedule';

interface IMyTableData {
    roomType: string;
    Available: string;
    rooms: number;
    guest: number;
    rate: number;
}
//let check = false
let dataClone: any = null
let dataRecord: any = null

function CTableSchedule(props: any) {
    const { data, nights, checked } = props;
    // let dataTableClone = [...data];
    if (!checked && data.length >= 2) {
        dataClone = JSON.stringify(data);
        //check = true;
        // handleChecked(true);
    }
    const dispatch = useDispatchRoot();
    const inputRef: RefObject<HTMLInputElement> = useRef<any>()
    const [isEditingRow, setisEditingRow] = useState();
    const [dataSource, setDataSource] = useState<any>([]);
    const [flag, setFlag] = React.useState(true);
    const classesTable = useStyleTheme(styleCTable);
    const classes = useStyleTheme(styleTableSchedule);
    const { t } = useTranslation("translation")
    const { totalFixCharge } = useSelectorRoot(state => state.rsvn);
    // if ((!isEditingRow || isEditingRow === -1) && isEditingRow !== 0) {
    //     dataTableClone = dataSource;
    // }

    useEffect(() => {
        if (isEditingRow)
            inputRef?.current?.focus();
    }, [isEditingRow])
    useEffect(() => {
        setDataSource(data)
    }, [data])
    const columns: ColumnProps<IMyTableData>[] = [
        {
            title: t("BOOKING.RESERVATION.GUESTSCHEDULE.roomType"),
            dataIndex: 'Roomtype',
            width: "30%"
        },
        {
            title: t("BOOKING.RESERVATION.GUESTSCHEDULE.available"),
            dataIndex: 'Available',
            width: "19%",
        },
        {
            title: `#${t("BOOKING.RESERVATION.GUESTSCHEDULE.rooms")}`,
            dataIndex: 'Rooms',
            render: (text, record, index) => (
                isEditingRow === index ? <InputNumber ref={inputRef} min={0} max={
                    JSON.parse(dataClone)[index]?.AvailableRoom ?? JSON.parse(dataClone)[index].Available
                }
                defaultValue={text}
                disabled={Number.parseInt(record.Available) === 0 ? true : false}
                style={{ width: "100%" }}
                onPressEnter={() => handleEditRow(-1, record)}
                onChange={(e: any) => e !== null && handleInputNumberChange(e, index, "Rooms", record)}
                name="Rooms" type="number" /> :
                    <div className={`${classes.inputEdit}`} style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}>
                        {parseInt(text)}
                    </div>
            ),
            width: "18%",
        },
        {
            title: `#${t("BOOKING.RESERVATION.GUESTSCHEDULE.guest")}`,
            dataIndex: 'Guest',
            render: (text, record, index) => (
                isEditingRow === index ?
                    <InputNumber ref={inputRef} min={0} max={4} defaultValue={text}
                        style={{ width: "100%" }}
                        onPressEnter={() => handleEditRow(-1, record)}
                        onChange={(e: any) => e !== null && handleInputNumberChange(e, index, "Guest", record)}
                        disabled={Number.parseInt(record.Available) === 0 ? true : false}
                        name="Rooms" type="number" />
                    :
                    <div className={`${classes.inputEdit}`} style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}>
                        {parseInt(text)}
                    </div>
            ),
            width: "17%"
        },
        {
            title: t("BOOKING.RESERVATION.GUESTSCHEDULE.rate"),
            dataIndex: 'Rate',
            render: (text, record, index) => (
                isEditingRow === index ? <InputNumber  min={0} ref={inputRef} style={{ width: "110%" }}
                    onPressEnter={() => handleEditRow(-1, record)}
                    defaultValue={parseInt(text)}
                    disabled={Number.parseInt(record.Available) === 0 ? true : false}
                    formatter={record => `${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(e: any) => e !== null && handleInputNumberChange(e, index, "Rate")}
                    name="rate"
                /> :
                    <div className={`${classes.inputEdit}`} style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}>
                        {Utils.formatNumber(text)}
                    </div>
            ),
            width: "28%"
        },
        {
            title: '',
            dataIndex: 'Edit',
            width: "15%",
            render: (_: any, record: any, index: any) => isEditingRow === index ? renderSave(record, index) : renderEdit(record, index),
        }
    ];
    const handleInputNumberChange = (e: number, index: any, name: string, value?: any) => {
        if (name === "Rooms") {
            const rest = JSON.parse(dataClone)[index].Available - e;
            if (rest >= 0) {
                //data[index].Available = rest;
                dataSource[index][name] = e;
            }
            else {
                dataSource[index][name] = dataSource[index].Available;
                //data[index].Available = 0;
            }
            setFlag(!flag)
        }
        else {
            dataSource[index][name] = e;
            setFlag(!flag);
        }
    }

    function handleDeleteRow(index: any, record: any) {
        dataSource.splice(index, 1);
        setFlag(!flag);
    }

    const handleEditRow = (index: any, record: any) => {
        dataRecord = { ...record };
        setisEditingRow(index)
    }

    const handlePlusRow = (index: any, record: any) => {
        if(record.Available !== 0 && (record.Available - record.Rooms) > 0 ){
            let countAvailable = record.Available
            dataSource.forEach((item : any) => {
                if(item.roomTypeGuid === record.roomTypeGuid){
                    console.log(item);
                    countAvailable = countAvailable - item.Rooms
                }
            })

            if(countAvailable > 0){
                const tmp: SelectedBookingRoomType = {
                    key: dataSource.length.toString(),
                    Roomtype: "",
                    Available: countAvailable,
                    Rooms: record.Rooms,
                    Guest: record.Guest,
                    Rate: record.Rate,
                    Edit: record.Edit,
                    TotalRooms: record.TotalRooms,
                    roomTypeGuid: record.roomTypeGuid
                };
                const valueSchedule = [...dataSource]
                valueSchedule.splice((index + 1), 0, tmp )
                setDataSource(valueSchedule)
            }
        }
    }

    const renderEdit = (record: any, index: any) => {
        return (
            <div className={`flex justify-start gap-2`}>
                <CIconSvg name="edit" svgSize="small" style={{ cursor: "pointer" }} onClick={() => {
                    handleEditRow(index, record);
                }} />
                <Popconfirm
                    title="Are you sure delete this row?"
                    onConfirm={() => { handleDeleteRow(index, record) }}
                >
                    <CIconSvg name="trash" svgSize="small" style={{ cursor: "pointer" }} />
                </Popconfirm>
            </div>
        )
    }
    
    const renderSave = (record: any, index: any) => {
        return (
            <div className={`flex flex-start gap-2`}>
                <CIconSvg name="plus-circle" svgSize="small" style={{ cursor: "pointer" }} onClick={() => {
                    handlePlusRow(index, record);
                }} />
                <SaveOutlined className={`${classes.icon}`} onClick={() => { handleSaveRow(record, index) }} />
                <CloseOutlined className={`${classes.icon}`} onClick={() => {
                    dataSource[index] = dataRecord;
                    handleEditRow(-1, record);
                }} />
            </div>
        )
    }

    const handleSaveRow = (record: any, indexTable: any) => {
        const tmp: SelectedBookingRoomType[] = [];
        dataSource.forEach((item: SelectedBookingRoomType, index: number) => {
            if (item.Rooms > 0 ) {
                if(tmp.length === 0) {
                    tmp.push({
                        key: item.key,
                        Roomtype: item.Roomtype,
                        Available: item.Available,
                        Rooms: item.Rooms,
                        Guest: item.Guest,
                        Rate: item.Rate,
                        Edit: item.Edit,
                        TotalRooms: item.TotalRooms,
                        roomTypeGuid: item.roomTypeGuid
                    });
                }else{
                    tmp.push({
                        key: item.key,
                        Roomtype: item.Roomtype,
                        Available: item.Available,
                        Rooms: (item.Available && item.Available <= item.Rooms) ? item.Available : item.Rooms,
                        Guest: item.Guest,
                        Rate: item.Rate,
                        Edit: item.Edit,
                        TotalRooms: item.TotalRooms,
                        roomTypeGuid: item.roomTypeGuid
                    });
                    item.Rooms = (item.Available && item.Available <= item.Rooms) ? item.Available : item.Rooms;
                }
            }
        });
        dispatch(setSelectedBookingRoomType(tmp));
        handleEditRow(-1, record);
    }

    return (
        <Table dataSource={[...dataSource]} columns={columns} className={`${classesTable.table} col-span-12 ${classes.table}`} pagination={false}
            scroll={{ y: 400 }}
            footer={() => { return (<div style={{ width: "50%" }}>Hoang</div>) }}
            onRow={(record, rowIndex) => {
                return {
                    onMouseLeave: event => {
                        handleSaveRow(record, rowIndex)
                    }, // mouse leave row
                };
            }}
            rowClassName={`${classes.tableEdit}`}
            summary={(data) => {
                let totalRoom = 0;
                let totalGuest = 0;
                let totalRate = 0;
                let totalAmount = 0;
                data.forEach(({ Rooms, Guest, Rate }: any) => {
                    totalRoom += parseInt(Rooms);
                    totalGuest += parseInt(Guest);
                    totalRate += (parseInt(Rate) * nights * Rooms);
                })
                totalAmount = totalFixCharge + totalRate;
                return (
                    <Table.Summary.Row style={{ background: "#FFF" }} className={`${classes.tableSummary} ant-table-footer `} key={1}>
                        <Table.Summary.Cell index={1} colSpan={2} key={2}>
                            <Row >
                                <Col span={10}><span className="opacity-40 font-semibold" style={{ fontSize: 10, marginRight: 6 }}>{t("BOOKING.RESERVATION.GUESTSCHEDULE.totalFixCharge")}: </span>
                                </Col>
                                <Col span={8}><span className="font-bold ">{Utils.formatNumber(totalFixCharge)}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}><p className="absolute opacity-40 font-semibold mb-0" style={{ fontSize: 10 }}>{t("BOOKING.RESERVATION.GUESTSCHEDULE.totalAmount")}: </p>
                                </Col>
                                <Col span={8}><p className="absolute font-bold  mb-0">{Utils.formatNumber(totalAmount)}</p>
                                </Col>
                            </Row>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} colSpan={1} key={5} >
                            <span className="font-bold">{totalRoom}</span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3} colSpan={1} key={3} >
                            <span className="font-bold">{totalGuest}</span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4} colSpan={1} key={4} >
                            <span className="font-bold whitespace-nowrap" style={{ paddingTop: 16, color: "#FF9800" }}>{Utils.formatNumber(totalRate)}</span>
                            <p className="font-bold" style={{ fontSize: 10, marginBottom: 0, color: "#666666", position: "absolute" }}>({t("BOOKING.RESERVATION.GUESTSCHEDULE.roomRevenue")})</p>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={5} />
                    </Table.Summary.Row>
                )
            }}
        />
    )
}
export default React.memo(CTableSchedule);
