/* eslint-disable  */
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { Button, Input, Select, Table } from 'antd';
import { ColumnProps } from "antd/lib/table";
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import { ResRoomType } from 'common/define-api-booking';
import { styleCashier } from 'pages/main/cashier/styles/styleCashier';
import CIconSvg from 'components/CIconSvg';
import MiscellaneousService from 'services/miscellaneous/miscellaneous.service';
import { HlsHotel, RatePlanData, RoomTypeMapping } from 'common/define-hls';
import CLoading from 'components/CLoading';
import { delay } from 'lodash';
import CScrollView from 'components/CScrollView';

interface TableRoomTypeRecord {
    roomId: string,
    name: string,
    key: number
}
interface HlsRoomType {
    guid: string,
    ten: string,
}
interface TableMappingRecord {
    pmsRoomTypeId: string,
    hlsRoomTypeId: string,
    key: number,
    pmsRoomTypeName: string,
    hlsRoomTypeName: string,
    guid: string
}
const MappingTabPane = (): JSX.Element => {
    const classes = useStyleTheme(styleCashier);
    const { t } = useTranslation("translation");
    const { control, setValue, getValues } = useForm();

    const { hotelName, hotelId } = useSelectorRoot(state => state.app);
    const { roomType } = useSelectorRoot(state => state.booking);
    const [hlsHotel, setHlsHotel] = React.useState<HlsHotel | undefined>()
    const [ratePlanData, setRatePlanData] = React.useState<RatePlanData | undefined>()
    const [hlsRoomTypeList, setHlsRoomTypeList] = React.useState<HlsRoomType[]>()
    const [tableRoomTypeDataSource, setTableRoomTypeDataSourse] = React.useState<any>()
    const [tableRatePlanDataSource, setTableRatePlanDataSourse] = React.useState<any>()
    const [tableMappingDataSource, setTableMappingDataSourse] = React.useState<any>([])
    const [rowId, setRowId] = React.useState("");
    const [selectedRow, setSelectedRow] = React.useState<TableMappingRecord>();
    const [loading, setLoading] = React.useState(false);

    const toggleLoading = () => {
        setLoading(prevState => !prevState)
    }
    const renderSelect = (data: any, isGuidValue = true) => {
        return data?.map((item: any) => {
            return (
                <Select.Option value={isGuidValue ? item.guid : item.ten} key={item.guid}>{item.ten}</Select.Option>
            )
        })
    }
    const getConfig = async () => {
        try {
            delay(async () => {
                toggleLoading()
                const otaHotel = await MiscellaneousService.getOTAConfig(hotelId);
                if (!(otaHotel instanceof Error) && otaHotel) {
                    setHlsHotel(otaHotel);
                    setValue("json", JSON.stringify(otaHotel));
                    setValue("pkmHotelGuid", hotelId);
                    setValue("otaHotelGuid", otaHotel.hlS_ID);
                }
            }, 300)
        } catch (error: any) {
            console.log(error);
            if (error) {
                setValue("json", error.message)
            }
        } finally {
            toggleLoading()
        }

    }
    const getFromOTA = async () => {
        try {
            toggleLoading()
            if (hlsHotel) {
                const dataRes = await MiscellaneousService.getRatePlan(hlsHotel.hlS_ID);
                if (dataRes) {
                    setValue("json", JSON.stringify(dataRes))
                    setRatePlanData(dataRes.data)
                    const hlsRoomType = dataRes.data.rooms.map(x => {
                        return { roomId: x.roomId, name: x.name }
                    })
                    setTableRoomTypeDataSourse(hlsRoomType)
                }
            }
            else {
                setValue("json", "Can't get OTA data, please get config!")
            }
        } catch (error: any) {
            console.log(error);
            if (error) {
                setValue("json", error.message)
            }
        } finally {
            toggleLoading()
        }
    }

    const getRoomType = () => {
        try {
            toggleLoading()
            if (ratePlanData) {
                const listRoomType = ratePlanData.rooms.map(x => {
                    return { guid: x.roomId, ten: x.name }
                })
                setHlsRoomTypeList(listRoomType)
                setValue("json", "Get OTA Room Type Successful!")
            }
            else {
                setValue("json", "Can't get OTA Room Type! Please get config & data first!")
            }
        } catch (error) {
            console.log(error);
            setValue("json", "Can't get OTA Room Type!")
        } finally {
            toggleLoading()
        }
    }
    const getAlreadyMapping = async () => {
        try {
            toggleLoading();
            let dataSource = await MiscellaneousService.getAlreadyMapping();
            if (dataSource) {
                dataSource = dataSource.filter(x => x.hotelId === hotelId);
                setTableMappingDataSourse(dataSource);
                setValue("json", "Get data mapping Successful!")
            }
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                setValue("json", error.response);
                setTableMappingDataSourse([])
            }
            else
                setValue("json", "Can't get Data mapping!")
        } finally {
            toggleLoading();
        }
    }
    const addMapping = () => {
        try {
            toggleLoading();
            const formData = getValues(["hotelRoomType", "otaRoomType"]);
            const { hotelRoomType, otaRoomType } = formData;
            const lastId = [...tableMappingDataSource].pop()?.id ?? 0;
            const data: RoomTypeMapping = {
                hotelId: hotelId,
                hlsRoomTypeId: otaRoomType.value,
                pmsRoomTypeId: hotelRoomType.value,
                hlsRoomTypeIdName: otaRoomType.label,
                pmsRoomTypeIdName: hotelRoomType.label,
                id: lastId + 1
            }
            setTableMappingDataSourse((prevState: any) => [...prevState, data])
            console.log(tableMappingDataSource);


        } catch (error: any) {
            console.log(error);
            if (error.response)
                setValue("json", JSON.stringify(error.response))
            else
                setValue("json", "Add mapping failed")
        } finally {
            toggleLoading();
        }
    }
    const mappingRoomType = async () => {
        try {
            toggleLoading();
            const promiseArr: Promise<[] | null>[] = []
            const mapRoomType = async (data: RoomTypeMapping) => {
                try {
                    const mappingRes = await MiscellaneousService.mappingRoomType(data);
                    return mappingRes;
                } catch (error: any) {
                    console.log(error);
                    if (error.response)
                        setValue("json", JSON.stringify(error.response))
                    return null
                }
            }
            tableMappingDataSource.forEach((dt: RoomTypeMapping) => {
                const data: RoomTypeMapping = {
                    hotelId: hotelId,
                    hlsRoomTypeId: dt.hlsRoomTypeId,
                    pmsRoomTypeId: dt.pmsRoomTypeId,
                    hlsRoomTypeIdName: dt.hlsRoomTypeIdName,
                    pmsRoomTypeIdName: dt.pmsRoomTypeIdName
                }
                promiseArr.push(mapRoomType(data))
            })
            const res = await Promise.all(promiseArr);
            if (res) {
                setValue("json", "Mapping successfully!");
                getAlreadyMapping();
            }
        } catch (error: any) {
            console.log(error);
            if (error.response)
                setValue("json", JSON.stringify(error.response))
        } finally {
            toggleLoading();
        }
    }

    const removeMapping = async () => {
        try {
            toggleLoading();
            if (selectedRow) {
                const newDataSource = [...tableMappingDataSource].filter(x => x.hlsRoomTypeId !== selectedRow.hlsRoomTypeId && x.pmsRoomTypeId !== selectedRow.pmsRoomTypeId);
                setTableMappingDataSourse(newDataSource);
                const mappingRes = await MiscellaneousService.removeMappingRoomType(selectedRow.guid);
                if (mappingRes) {
                    setValue("json", "Remove mapping successfully!");
                    getAlreadyMapping();
                }
            }
        } catch (error: any) {
            console.log(error);
            if (error.response)
                setValue("json", JSON.stringify(error.response))
        } finally {
            toggleLoading();
        }
    }

    React.useEffect(() => {
        toggleLoading()
        if (ratePlanData) {

            const room = ratePlanData.rooms.find(x => x.roomId === rowId);

            if (room) {
                const dataSource = room.ratePlans;
                setTableRatePlanDataSourse(dataSource);
            }
        }
        else {
            if (rowId !== "")
                setValue("json", "Can't get OTA Room Type! Please get config & data first!")
        }
        toggleLoading()
    }, [rowId])

    const tableRoomTypeColumns: ColumnProps<TableRoomTypeRecord>[] = [
        {
            title: t("BOOKING.roomType"),
            dataIndex: "name",
            key: "name",
            className: "text-left",
        },
        {
            title: t("MISCELLANEOUS.CHANNEL_MANAGER.roomID"),
            dataIndex: "roomId",
            key: "roomId",
            render: (text) => <div className='whitespace-nowrap'>{text}</div>
        },
    ]

    const tableOTARatePlanColumns: ColumnProps<ResRoomType>[] = [
        {
            title: `${t("MISCELLANEOUS.CHANNEL_MANAGER.ratePlan")} ${t("BOOKING.RESERVATION.name")}`,
            dataIndex: "name",
            key: "name",
            className: "text-left",
        },
        {
            title: `${t("MISCELLANEOUS.CHANNEL_MANAGER.ratePlan")} ${t("BOOKING.id")}`,
            dataIndex: "ratePlanId",
            key: "ratePlanId",
            render: (text) => <div className='whitespace-nowrap'>{text}</div>
        },
    ]
    const tableMapping: ColumnProps<TableMappingRecord>[] = [
        {
            title: `${t("MISCELLANEOUS.CHANNEL_MANAGER.pkm")} ${t("BOOKING.roomType")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.name")}`,
            dataIndex: "pmsRoomTypeIdName",
            key: "pmsRoomTypeIdName",
            className: "text-left",
        },
        {
            title: `${t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} ${t("BOOKING.roomType")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.name")}`,
            dataIndex: "hlsRoomTypeIdName",
            key: "hlsRoomTypeIdName",
            className: "text-left",
        },
        {
            title: `${t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} ${t("BOOKING.roomType")} ${t("BOOKING.id")}`,
            dataIndex: "hlsRoomTypeId",
            key: "hlsRoomTypeId",
            render: (text) => <div className='whitespace-nowrap'>{text}</div>
        },
    ]

    const handleRowSelect = (record: TableRoomTypeRecord) => {
        return {
            onClick: () => {
                setRowId(record.roomId);
            },
        };
    };
    return (
        <CLoading visible={loading}>
            <div className='grid grid-cols-12 gap-x-6'>
                <div className='col-span-6'>
                    <form className='custom-scrollbar-pkm'>
                        <div className='pr-8 mb-3'>
                            <div className='flex justify-between'>
                                <label>
                                    {t("MISCELLANEOUS.CHANNEL_MANAGER.perfectKey")} {t("MISCELLANEOUS.CHANNEL_MANAGER.hotelID")}
                                </label>
                                <span className='mr-8 text-blue-800'>
                                    {hotelName.toLocaleUpperCase()}
                                </span>
                            </div>
                            <Controller
                                name="pkmHotelGuid"
                                render={({ onChange, value }) =>
                                    <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                }
                                control={control} defaultValue="" />
                        </div>
                        <div className='pr-8 mb-3'>
                            <div className='flex justify-between'>
                                <label>
                                    {t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} {t("MISCELLANEOUS.CHANNEL_MANAGER.hotelID")}
                                </label>
                                <span className='mr-8 text-blue-800'>
                                    {hlsHotel?.hotelName}
                                </span>
                            </div>
                            <Controller
                                name="otaHotelGuid"
                                render={({ onChange, value }) =>
                                    <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                }
                                control={control} defaultValue="" />
                        </div>
                        <div className='pr-8 mb-2'>
                            <div className='flex justify-between'>
                                <Button onClick={getConfig} className={`${classes.btn} !w-auto !rounded-md `}>
                                    1. {t("MISCELLANEOUS.CHANNEL_MANAGER.getOTAConfig")}
                                </Button>
                                <Button onClick={getFromOTA} className={`${classes.btn} !w-auto !rounded-md`}>
                                    2. {t("MISCELLANEOUS.CHANNEL_MANAGER.getFromOTA")}
                                </Button>
                                <Button onClick={getRoomType} className={`${classes.btn} !w-auto !rounded-md`}>
                                    3. {t("MISCELLANEOUS.CHANNEL_MANAGER.getRoomType")}
                                </Button>
                            </div>
                        </div>
                        <div className='mb-2'>
                            <label className='font-bold'>
                                {t("MISCELLANEOUS.CHANNEL_MANAGER.roomName")} & {t("MISCELLANEOUS.CHANNEL_MANAGER.roomID")}
                            </label>
                            <Table
                                columns={tableRoomTypeColumns}
                                className={`${classes.table}`}
                                dataSource={tableRoomTypeDataSource}
                                pagination={false}
                                scroll={{ y: 200 }}
                                loading={loading}
                                onRow={handleRowSelect}
                                rowClassName={(record) => {
                                    return record.roomId === rowId ? "row-selected" : "";
                                }}
                            />
                        </div>
                        <div>
                            <label className='font-bold'>
                                {t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} {t("MISCELLANEOUS.CHANNEL_MANAGER.ratePlan")}
                            </label>
                            <Table
                                columns={tableOTARatePlanColumns}
                                className={`${classes.table}`}
                                dataSource={tableRatePlanDataSource}
                                pagination={false}
                                scroll={{ y: 200 }}
                                loading={loading}
                                style={{ height: 200 }}
                            />
                        </div>
                    </form>
                </div>
                <div className='col-span-6'>
                    <form className='custom-scrollbar-pkm'>
                        <div className='grid grid-cols-4 gap-x-6 mb-2'>
                            <div className='col-span-3'>
                                <label>
                                    {t("MISCELLANEOUS.CHANNEL_MANAGER.perfectKey")} {t("BOOKING.roomType")}
                                </label>
                                <Controller
                                    name="hotelRoomType"
                                    render={({ onChange, value }) =>
                                        <Select
                                            labelInValue
                                            showSearch
                                            filterOption={false}
                                            bordered={false} className={`${classes.input} p-0 w-full h-10 !mb-2`}
                                            style={{ display: "flex", alignItems: "center", padding: "0" }}
                                            suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                            value={value} onChange={e => onChange(e)} >
                                            {renderSelect(roomType)}
                                        </Select>
                                    }
                                    control={control} defaultValue="" />
                                <label>
                                    {t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} {t("BOOKING.roomType")}
                                </label>
                                <Controller
                                    name="otaRoomType"
                                    render={({ onChange, value }) =>
                                        <Select
                                            labelInValue
                                            showSearch
                                            filterOption={false}
                                            bordered={false} className={`${classes.input} p-0 w-full h-10`}
                                            style={{ display: "flex", alignItems: "center", padding: "0" }}
                                            suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                            value={value} onChange={e => onChange(e)} >
                                            {renderSelect(hlsRoomTypeList)}
                                        </Select>
                                    }
                                    control={control} defaultValue="" />
                            </div>
                            <div className='col-span-1 mt-4 flex items-center'>
                                <Button onClick={addMapping} className={`${classes.btn} !rounded-md !h-16 !shadow-md`}>
                                    {t("MISCELLANEOUS.CHANNEL_MANAGER.mapping")}
                                </Button>
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <label className='text-blue-700 flex items-center'>
                                {t("MISCELLANEOUS.CHANNEL_MANAGER.result")} {t("MISCELLANEOUS.CHANNEL_MANAGER.mapping")}
                            </label>
                            <Button disabled={!selectedRow} onClick={removeMapping} className={`!rounded-md !w-auto ${classes.btn}`}>
                                {t("MISCELLANEOUS.CHANNEL_MANAGER.remove")} {t("MISCELLANEOUS.CHANNEL_MANAGER.mapping")}
                            </Button>
                            <Button onClick={getAlreadyMapping} className={`!rounded-md !w-auto ${classes.btn}`}>
                                {t("MISCELLANEOUS.CHANNEL_MANAGER.getAlready")} {t("MISCELLANEOUS.CHANNEL_MANAGER.mapping")}
                            </Button>
                            <Button disabled={tableMappingDataSource.length === 0} onClick={mappingRoomType} className={`!rounded-md !w-auto ${classes.btn}`}>
                                {t("MISCELLANEOUS.CHANNEL_MANAGER.submit")} {t("MISCELLANEOUS.CHANNEL_MANAGER.mapping")}
                            </Button>
                        </div>
                        <div className='my-2 h-72'>

                            <Table
                                className={`${classes.table}`}
                                columns={tableMapping}
                                dataSource={tableMappingDataSource}
                                pagination={false}
                                scroll={{ y: 288 }}
                                loading={loading}
                                style={{ height: '100%' }}
                                rowKey="id"
                                rowSelection={{
                                    fixed: true,
                                    hideSelectAll: true,
                                    type: 'radio',
                                    onChange: (_, selectedRows) => {
                                        setSelectedRow(selectedRows[0])
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <label>JSon</label>
                            <Controller
                                name="json"
                                render={({ onChange, value }) =>
                                    <Input.TextArea rows={8} value={value} className={`${classes.input} custom-scrollbar-pkm`} onChange={(e) => onChange(e.target.value)} />
                                }
                                control={control} defaultValue={""} />
                        </div>
                    </form>
                </div >
            </div >
        </CLoading>
    )
}

export default MappingTabPane