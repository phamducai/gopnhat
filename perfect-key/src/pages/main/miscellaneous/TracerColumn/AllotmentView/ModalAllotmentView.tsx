/* eslint-disable */
import { Button, DatePicker, Table } from 'antd';
import { ChannelAllotment } from 'common/define-hls';
import { FixedType } from 'rc-table/lib/interface'
import Utils from 'common/utils';
import CLoading from 'components/CLoading';
import CModel from 'components/CModal';
import { addMonths, format, isSaturday, isSunday, subMonths } from 'date-fns';
import { styleCashier } from 'pages/main/cashier/styles/styleCashier';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStyleTheme } from 'theme';
import { ColumnProps } from 'antd/lib/table';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import { cloneDeep, isEqual, uniqWith } from 'lodash';
import moment from 'moment';

interface ModalAllotmentViewProps {
    setDate: React.Dispatch<React.SetStateAction<any>>,
    date: any,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    visible: boolean,
    dataAllotment: ChannelAllotment[],
    getAllotmentData(): void,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
function ModalAllotmentView({ loading, setLoading, setDate, date, setVisible, visible, dataAllotment, getAllotmentData }: ModalAllotmentViewProps): JSX.Element {
    const { t } = useTranslation("translation");
    const classes = useStyleTheme(styleCashier);
    const classesControls = useStyleTheme(styleCorrection);

    const [listDate, setListDate] = useState<any>([])
    const { control, setValue } = useForm();
    const fixedColumns: ColumnProps<any>[] = [
        {
            title: `${t("MISCELLANEOUS.CHANNEL_MANAGER.perfectKey")} ${t("BOOKING.roomType")}`,
            dataIndex: "roomTypePMSName",
            key: "roomTypePMSName",
            className: "text-left lg:w-1/12",
            fixed: "left" as FixedType,
        },
        {
            title: `${t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} ${t("BOOKING.roomType")}`,
            dataIndex: "roomTypeHLSName",
            key: "roomTypeHLSName",
            className: "text-left lg:w-1/12",
            fixed: "left" as FixedType
        },
    ]

    const [columns, setColumns] = useState(fixedColumns)
    const [dataSource, setDataSource] = useState<any>([])

    const fetchData = async () => {
        try {
            setLoading(true);
            const dateArray = Utils.getDatesBetween(new Date(date[0]), new Date(date[1]));
            setListDate(dateArray)
            const _columns = [...fixedColumns]
            dateArray.forEach(date => {
                _columns.push({
                    title: <span
                        className={`${isSaturday(new Date(date)) ? "text-green-700" : ""} ${isSunday(new Date(date)) ? "text-red-700" : ""}`}>
                        {format(new Date(date), "dd/MM EEE")}
                    </span>,
                    dataIndex: format(new Date(date), "dd/MM"),
                    key: format(new Date(date), "dd/MM"),
                    className: `${isSaturday(new Date(date)) ? "text-green-700" : ""} ${isSunday(new Date(date)) ? "text-red-700" : ""} text-center whitespace-pre-wrap break-words`,
                })
            })
            setColumns(_columns);
            const tempArray = dataAllotment.map(dt => {
                return {
                    ...dt,
                    [format(new Date(dt.ngayThang), "dd/MM EEE")]: dt.soLuong.toString()
                }
            });
            let groupMappedArray: { [key: string]: any } = uniqWith(tempArray.map(x => {
                return {
                    roomTypePMSName: x.pmS_RoomTypeIdName,
                    roomTypeHLSName: x.hlS_RoomTypeIdName
                }
            }), isEqual);
            groupMappedArray = groupMappedArray.map((groupMapped: any) => {
                tempArray.forEach(dt => {
                    if (dt.hlS_RoomTypeIdName === groupMapped.roomTypeHLSName && dt.pmS_RoomTypeIdName === groupMapped.roomTypePMSName) {
                        groupMapped[format(new Date(dt.ngayThang), "dd/MM")] = dt.soLuong.toString();
                    }
                })
                return {
                    ...groupMapped,
                }
            })
            setDataSource(groupMappedArray)
            await new Promise(r => setTimeout(r, 2000));
        }
        catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [date, dataAllotment])
    const onCancel = () => {
        setVisible(false)
    }
    const prev1Month = () => {
        setDate(
            [moment(subMonths(new Date(date[0]), 1)),
            moment(subMonths(new Date(date[1]), 1))]
        )
        setValue(
            "date",
            [moment(subMonths(new Date(date[0]), 1)),
            moment(subMonths(new Date(date[1]), 1))]
        )
    }
    const next1Month = () => {
        setDate(
            [moment(addMonths(new Date(date[0]), 1)),
            moment(addMonths(new Date(date[1]), 1))]
        )
        setValue(
            "date",
            [moment(addMonths(new Date(date[0]), 1)),
            moment(addMonths(new Date(date[1]), 1))]
        )
    }
    return (
        <CModel
            style={{
                top: "2%",
                paddingTop: "0px",
                paddingBottom: "0px",
            }}
            isLoading={loading}
            visible={visible}
            title={t("MISCELLANEOUS.channelManager")}
            onCancel={onCancel}
            width={"80%"}
            isShowFooter={false}
            onOk={() => console.log("submit")}
            content={
                <CLoading visible={loading}>
                    <div className='grid grid-cols-8 custom-scrollbar-km'>
                        <div className='col-span-3'>
                            <Button size='large' onClick={getAllotmentData} className={`${classes.btn} !bg-transparent !w-auto !rounded-md `}>
                                {t("MISCELLANEOUS.ALLOTMENT_VIEW.refresh")}
                            </Button>
                            <Button size='large' onClick={prev1Month} className={`${classes.btn} !mr-1 !bg-transparent !w-auto !rounded-md `}>
                                {t("MISCELLANEOUS.ALLOTMENT_VIEW.prevMonth")}
                            </Button>
                            <Button size='large' onClick={next1Month} className={`${classes.btn} !mx-1 !bg-transparent !w-auto !rounded-md `}>
                                {t("MISCELLANEOUS.ALLOTMENT_VIEW.nextMonth")}
                            </Button>
                        </div>
                        <div className='col-span-1 no-content'></div>
                        <div className='col-span-4'>
                            <form className='flex items-center'>
                                <span className='mr-4'>
                                    {t("BOOKING.date")}
                                </span>
                                <Controller
                                    name="date"
                                    render={({ onChange, value }) =>
                                        <DatePicker.RangePicker
                                            className={`${classesControls.datePicker}`}
                                            value={value}
                                            onChange={val => {
                                                setDate(val);
                                                onChange(val)
                                            }}
                                        />
                                    }
                                    control={control} defaultValue={date} />

                            </form>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <Table
                            className={`${classes.table} !h-96`}
                            scroll={{ x: 3000 }}
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            summary={(_) => {
                                if (listDate.length > 0) {
                                    const listSummary = cloneDeep(listDate).map((date: any) => {
                                        return { ngayThang: date, soLuong: 0 }
                                    })

                                    listDate.forEach((date: any) => {
                                        dataAllotment.forEach(dt => {
                                            if (date === format(new Date(dt.ngayThang), "MM/dd/yyyy")) {
                                                listSummary.find((x: any) => x.ngayThang === date).soLuong += dt.soLuong
                                            }
                                        })
                                    })

                                    return (
                                        <Table.Summary>
                                            <Table.Summary.Row style={{ background: "#FFF" }} className={`${classes.tableSummary} remove-left`} key={"flfx01"}>
                                                <Table.Summary.Cell colSpan={2} index={1} key={"totalfx02"} >
                                                    <span className="font-bold">Total</span>
                                                </Table.Summary.Cell>
                                                {listSummary.map((dt: any, index: number) => {
                                                    return (<Table.Summary.Cell className='text-center' index={index + 2} colSpan={1} key={index + 2} >
                                                        <span className={`font-bold ${isSaturday(new Date(date)) ? "text-green-700" : ""} ${isSunday(new Date(date)) ? "text-red-700" : ""}`}>
                                                            {dt.soLuong}
                                                        </span>
                                                    </Table.Summary.Cell>)
                                                })}
                                            </Table.Summary.Row>
                                        </Table.Summary>
                                    )
                                }
                            }}
                        />
                    </div>
                </CLoading>
            }
        />
    )
}

export default ModalAllotmentView