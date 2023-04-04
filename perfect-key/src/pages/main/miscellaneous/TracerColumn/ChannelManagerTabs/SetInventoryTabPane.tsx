/* eslint-disable */
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { Button, Checkbox, DatePicker, Input, InputNumber, Table } from 'antd';
import { ColumnProps } from "antd/lib/table";
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import { ResRoomType } from 'common/define-api-booking';
import { styleCashier } from 'pages/main/cashier/styles/styleCashier';
import MiscellaneousService from 'services/miscellaneous/miscellaneous.service';
import { Availability, ChannelAllotment, DEFAULT_SET_INVENTORY, HlsHotel, Inventory, RatePackage, RatePlanData, SetInventoryAction } from 'common/define-hls';
import moment from 'moment';
import CLoading from 'components/CLoading';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { cloneDeep } from 'lodash';
import { format } from 'date-fns';

interface TableRoomTypeRecord {
    roomId: string,
    name: string,
    key: number
}
interface TableMappingRecord {
    pmsRoomTypeId: string,
    hlsRoomTypeId: string,
    key: number,
    pmsRoomTypeName: string,
    hlsRoomTypeName: string,
}
interface TableRatePlanRecord {
    ratePlanId: string,
    name: string,
    key: number,
    minRoomRate: number
}
enum SetInventoryType {
    Availabilities, ReleasePeriod = 0,
    SaveRatePlan = 2,
    ExtraAdult = 3,
    ExtraChild = 4,
    MinNight = 5,
    MaxNight = 6,
    CTA = 7,
    CTD = 8,
    StopSell = 9,
    IncreaseAvailabilities = 1,
    DecreaseAvailabilities = -1,
}

const SetInventoryTabPane = (): JSX.Element => {
    const classes = useStyleTheme(styleCashier);

    const { t } = useTranslation("translation");
    const { control, setValue, getValues } = useForm();

    const { roomType } = useSelectorRoot(state => state.booking);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { user } = useSelectorRoot(state => state.login);
    const [hlsHotel, setHlsHotel] = React.useState<HlsHotel | undefined>()

    const [tableMappingDataSource, setTableMappingDataSourse] = React.useState<any>()
    const [loading, setLoading] = React.useState(false);
    const [disabledRatePlanControls, setDisabledRatePlanControls] = React.useState(true);
    const [rowId, setRowId] = React.useState("");
    const [roomId, setRoomId] = React.useState("");
    const [pmsRoomTypeId, setPmsRoomTypeId] = React.useState("");
    const [ratePlanName, setRatePlanName] = React.useState("#");
    const [ratePlanId, setRatePlanId] = React.useState("");
    const [minRoomRate, setMinRoomRate] = React.useState(0);
    const [ratePlanData, setRatePlanData] = React.useState<RatePlanData | undefined>()
    const [tableRoomTypeDataSource, setTableRoomTypeDataSourse] = React.useState<any>()
    const [tableRatePlanDataSource, setTableRatePlanDataSourse] = React.useState<any>()

    const postDataAllotment = () => {
        try {
            if (user) {
                const formData = getValues(["inputFrom", "inputTo", "releasePeriod", "quantity"]);
                const { inputFrom, inputTo, releasePeriod, quantity } = formData;
                const pmsRoomType = roomType.find(x => x.guid === pmsRoomTypeId);
                const data: ChannelAllotment = {
                    hotelGUID: hotelId,
                    ngayThang: moment().format("YYYY-MM-DD"),
                    nguoiDung: user.id,
                    nguoiDung2: user.userName,
                    realesePeriod: Number(releasePeriod),
                    soLuong: Number(quantity),
                    roomTypeHLSCode: roomId,
                    roomTypeHLSId: roomId,
                    roomTypePMSCode: pmsRoomType.ma,
                    roomTypePMSGUID: pmsRoomType.guid,
                    roomTypePMSId: 0,
                }
                MiscellaneousService.createDataAllotment(data, inputFrom, inputTo)
                setValue("inputError", "")
            }

        } catch (error: any) {
            if (error.response)
                setValue("inputError", error.response)
            else
                setValue("inputError", error.message)
        }
    }

    const toggleLoading = () => {
        setLoading(prevState => !prevState)
    }

    const setInventory = async (type: SetInventoryType) => {
        try {
            toggleLoading();
            if (hlsHotel) {
                const formData = getValues(["inputFrom", "inputTo", "rateToSetRatePlan", "releasePeriod", "quantity", "minNights", "maxNights"]);
                const { inputFrom, inputTo, rateToSetRatePlan, releasePeriod, quantity, maxNights, minNights } = formData;

                const data = cloneDeep(DEFAULT_SET_INVENTORY);
                data.hlsCredential.hotelId = hlsHotel.hlS_ID;
                data.saveInventoryRequest.credential.hotelId = hotelId;
                data.saveInventoryRequest.credential.hotelAuthenticationChannelKey = hlsHotel.hotelChannelKey;
                const availabity: Availability = {
                    action: SetInventoryAction.SET,
                    dateRange: {
                        from: inputFrom,
                        to: inputTo
                    },
                    quantity: quantity.toString(),
                    releasePeriod: releasePeriod.toString()
                }

                switch (type) {
                    case SetInventoryType.Availabilities: {
                        const availabilities: Availability[] = [];
                        availabilities.push(availabity)
                        const inventory: Inventory = {
                            roomId: roomId,
                            availabilities
                        }
                        data.saveInventoryRequest.inventories.push(inventory);
                        const setInventoryRes = await MiscellaneousService.setInventory(data);
                        if (setInventoryRes?.result) {
                            postDataAllotment()
                            openNotification(NotificationStatus.Success, "Set Availibities Successful!", "")
                            setValue("inputError", "")
                        }
                        break;
                    }
                    case SetInventoryType.IncreaseAvailabilities: {
                        availabity.action = SetInventoryAction.INCREASE;
                        const availabilities: Availability[] = [];
                        availabilities.push(availabity)
                        const inventory: Inventory = {
                            roomId,
                            availabilities
                        }
                        data.saveInventoryRequest.inventories.push(inventory);
                        const setInventoryRes = await MiscellaneousService.setInventory(data);
                        if (setInventoryRes?.result) {
                            postDataAllotment()
                            openNotification(NotificationStatus.Success, "Set Availibities Successful!", "");
                            setValue("inputError", "")
                        }
                        break;
                    }
                    case SetInventoryType.DecreaseAvailabilities: {
                        availabity.action = SetInventoryAction.DECREASE;
                        const availabilities: Availability[] = [];
                        availabilities.push(availabity)
                        const inventory: Inventory = {
                            roomId,
                            availabilities
                        }
                        data.saveInventoryRequest.inventories.push(inventory);
                        const setInventoryRes = await MiscellaneousService.setInventory(data);
                        if (setInventoryRes?.result) {
                            postDataAllotment()
                            openNotification(NotificationStatus.Success, "Set Availibities Successful!", "")
                            setValue("inputError", "")
                        }
                        break;
                    }
                    case SetInventoryType.SaveRatePlan: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                extraAdultRate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },

                                },
                                extraChildRate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                }

                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set Rate Plan Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }
                    case SetInventoryType.ExtraAdult: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                extraAdultRate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },

                                },
                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set Extra Adult Rate Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }
                    case SetInventoryType.ExtraChild: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                extraChildRate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                }
                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set Extra Child Rate Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }

                    case SetInventoryType.CTA: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                closeToArrival: "1"
                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set Close to Arrival Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }

                    case SetInventoryType.CTD: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                closeToDeparture: "1"
                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set Close to Departure Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }

                    case SetInventoryType.StopSell: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                stopSell: "1"
                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set Stop Sell Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }

                    case SetInventoryType.MaxNight: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                maxNights
                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set Max nights Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }
                    case SetInventoryType.MinNight: {
                        if (ratePlanId) {
                            if (rateToSetRatePlan < minRoomRate) {
                                setValue("inputError", "Rate is lower than min room rate!")
                                return;
                            }
                            const ratePlan: RatePackage = {
                                ratePlanId,
                                dateRange: {
                                    from: inputFrom,
                                    to: inputTo
                                },
                                rate: {
                                    action: SetInventoryAction.SET,
                                    amount: {
                                        currency: "VND",
                                        type: "FIXED_AMOUNT",
                                        value: rateToSetRatePlan.toString()
                                    },
                                },
                                minNights
                            }
                            const ratePackages: RatePackage[] = [];
                            ratePackages.push(ratePlan)
                            const inventory: Inventory = {
                                roomId,
                                ratePackages
                            }
                            data.saveInventoryRequest.inventories.push(inventory);
                            const setInventoryRes = await MiscellaneousService.setInventory(data);
                            if (setInventoryRes?.result) {
                                openNotification(NotificationStatus.Success, "Set min nights Successful!", "")
                                setValue("inputError", "")
                            }
                        }
                        else {
                            setValue("inputError", "Can't find rate plan id")
                        }
                        break;
                    }
                }
            }
            else {
                setValue("inputError", "Please get data first!")
            }
        } catch (error) {
            setValue("inputError", "Set Inventory Failed!")
        } finally {
            toggleLoading();
        }
    }

    const getAlreadyMapping = async () => {
        try {
            toggleLoading();
            let dataSource = await MiscellaneousService.getAlreadyMapping();
            if (dataSource) {
                dataSource = dataSource.filter(x => x.hotelId === hotelId);
                setTableMappingDataSourse(dataSource);
            }
            const otaHotel = await MiscellaneousService.getOTAConfig(hotelId);
            if (!(otaHotel instanceof Error) && otaHotel) {
                setHlsHotel(otaHotel)
                const dataRes = await MiscellaneousService.getRatePlan(otaHotel.hlS_ID);
                if (dataRes) {
                    setRatePlanData(dataRes.data)
                    const hlsRoomType = dataRes.data.rooms.map(x => {
                        return { roomId: x.roomId, name: x.name }
                    })
                    setTableRoomTypeDataSourse(hlsRoomType);
                    setValue("inputError", "")
                }
            }
        } catch (error: any) {
            console.log(error);
            if (error.response) {
                setTableMappingDataSourse([])
            }
        } finally {
            toggleLoading();
        }
    }

    const getLastQuantity = async () => {
        try {
            toggleLoading();
            if (!roomId) {
                setValue("inputError", "Can't get last quantity!")
            }
            let allotment = await MiscellaneousService.getLastAllotmentQuantity(hotelId, roomId);
            if (allotment) {
                setValue("quantity", allotment.soLuong)
                setValue("inputError", "")
            }
        } catch (error) {
            console.log(error);
            setValue("inputError", "Can't get last quantity!")
            setValue('quantity', "0")
        } finally {
            toggleLoading();
        }
    }


    const handleRowSelect = (record: TableMappingRecord) => {
        return {
            onClick: () => {
                setRowId(record.hlsRoomTypeId);
                setRoomId(record.hlsRoomTypeId);
                setPmsRoomTypeId(record.pmsRoomTypeId);
            },
        };
    };
    const handleRowRoomTypeSelect = (record: TableRoomTypeRecord) => {
        return {
            onClick: () => {
                setRoomId(record.roomId);
            },
        };
    };
    const handleRowRatePlanSelect = (record: TableRatePlanRecord) => {
        return {
            onClick: () => {
                setRatePlanName(record.name);
                setRatePlanId(record.ratePlanId);
                setMinRoomRate(record.minRoomRate)
                setDisabledRatePlanControls(false)
            },
        };
    };

    React.useEffect(() => {
        toggleLoading()
        if (ratePlanData) {

            const room = ratePlanData.rooms.find(x => x.roomId === rowId);

            if (room) {
                const dataSource = room.ratePlans;
                setTableRatePlanDataSourse(dataSource);
                setValue("otaRoomId", room.roomId)
                setValue("inputError", "")
            }
        }
        else {
            if (rowId !== "")
                setValue("inputError", "Can't get OTA Room Type! Please get config & data first!")
        }
        toggleLoading()
    }, [rowId])

    React.useEffect(() => {
        toggleLoading()
        if (ratePlanData) {

            const room = ratePlanData.rooms.find(x => x.roomId === roomId);

            if (room) {
                const dataSource = room.ratePlans;
                setTableRatePlanDataSourse(dataSource);
                setValue("otaRoomId", room.roomId)
                setValue("inputError", "")
            }
        }
        else {
            if (roomId !== "")
                setValue("inputError", "Can't get OTA rate plan! Please get data first!")
        }
        toggleLoading()
    }, [roomId])

    React.useEffect(() => {
        roomType.length > 0 && setValue("hotelRoomType", roomType[0].guid);
    }, [roomType]);

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

    const tableOTARatePlanColumns: ColumnProps<TableRatePlanRecord>[] = [
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

    return (
        <CLoading visible={loading}>
            <div className='grid grid-cols-12 gap-x-6'>
                <div className='col-span-6'>
                    <div className='my-1'>
                        <span className='flex justify-between mb-2'>
                            <label className='text-blue-700'>
                                {`${t("MISCELLANEOUS.CHANNEL_MANAGER.result")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.perfectKey")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.and")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.mapping")}`}
                            </label>
                            <Button onClick={getAlreadyMapping} className={`!rounded-md !w-auto ${classes.btn}`}>
                                {t("MISCELLANEOUS.CHANNEL_MANAGER.getAlready")} {t("MISCELLANEOUS.CHANNEL_MANAGER.mapping")}
                            </Button>
                        </span>
                        <div className='h-64'>
                            <Table
                                className={`${classes.table} min-h-full`}
                                columns={tableMapping}
                                dataSource={tableMappingDataSource}
                                pagination={false}
                                scroll={{ y: 200 }}
                                loading={loading}
                                style={{ height: '100%' }}
                                onRow={handleRowSelect}
                                rowClassName={(record) => {
                                    return record.hlsRoomTypeId === rowId ? "row-selected" : "";
                                }}
                            />
                        </div>
                    </div>
                    <div className='my-1'>
                        <label className='text-blue-700'>
                            {`${t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.roomName")} & ${t("MISCELLANEOUS.CHANNEL_MANAGER.roomID")}`}
                        </label>
                        <Table
                            columns={tableRoomTypeColumns}
                            className={`${classes.table}`}
                            dataSource={tableRoomTypeDataSource}
                            pagination={false}
                            scroll={{ y: 200 }}
                            loading={loading}
                            style={{ height: 200 }}
                            onRow={handleRowRoomTypeSelect}
                            rowClassName={(record) => {
                                return record.roomId === roomId ? "row-selected" : "";
                            }}
                        />
                    </div>
                    <div className='my-1'>
                        <label className='text-blue-700'>
                            {`${t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.ratePlan")}`}
                        </label>
                        <Table
                            columns={tableOTARatePlanColumns}
                            className={`${classes.table}`}
                            pagination={false}
                            scroll={{ y: 200 }}
                            loading={loading}
                            onRow={handleRowRatePlanSelect}
                            rowClassName={(record) => {
                                return record.name === ratePlanName ? "row-selected" : "";
                            }}
                            dataSource={tableRatePlanDataSource}
                            style={{ height: 200 }}
                        />
                    </div>
                </div>
                <div className='col-span-6'>
                    <form>
                        <div className='grid grid-cols-8 gap-x-2 mb-2'>
                            <div className='col-span-1'>
                                <label>
                                    {t("MISCELLANEOUS.CHANNEL_MANAGER.quantity")}
                                </label>
                                <Controller
                                    name="quantity"
                                    render={({ onChange, value }) =>
                                        <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                    }
                                    control={control} defaultValue="0" />
                            </div>
                            <div className='col-span-3'>
                                <label>
                                    {t("MISCELLANEOUS.CHANNEL_MANAGER.releasePeriod")}
                                </label>
                                <Controller
                                    name="releasePeriod"
                                    render={({ onChange, value }) =>
                                        <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                    }
                                    control={control} defaultValue="0" />
                            </div>
                            <div className='col-span-4'>
                                <label>
                                    {`${t("MISCELLANEOUS.CHANNEL_MANAGER.ota")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.roomID")}: ${hlsHotel?.hotelName ?? ""}`}
                                </label>
                                <Controller
                                    name="otaRoomId"
                                    render={({ onChange, value }) =>
                                        <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                    }
                                    control={control} defaultValue="" />
                            </div>
                        </div>
                        <div className='grid grid-cols-3'>
                            <div className='col-span-1'>
                                <label>
                                    {t("BOOKING.SEARCHVALUE.from")}
                                </label>
                                <Controller
                                    name="inputFrom"
                                    render={({ onChange, value }) =>
                                        <Input disabled value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                    }
                                    control={control} defaultValue={moment().format("YYYY-MM-DD")} />
                                <div className='mt-1'>
                                    <Controller
                                        name="dateFrom"
                                        render={({ onChange, value }) =>
                                            <DatePicker
                                                format={"MM/DD/YYYY"}
                                                className={`${classes.datePicker} h-8`}
                                                value={value}
                                                onChange={(e) => {
                                                    onChange(e)
                                                    e && setValue("inputFrom", format(new Date(e.toDate()), "yyyy/MM/dd"))
                                                }} />
                                        }
                                        control={control} defaultValue={moment()} />
                                </div>
                            </div>
                            <div className='col-span-1 no-content'></div>
                            <div className='col-span-1'>
                                <label>
                                    {t("BOOKING.SEARCHVALUE.to")}
                                </label>
                                <Controller
                                    name="inputTo"
                                    render={({ onChange, value }) =>
                                        <Input disabled value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                    }
                                    control={control} defaultValue={moment().add(1, 'month').format("YYYY-MM-DD")} />
                                <div className='my-1'>
                                    <Controller
                                        name="dateTo"
                                        render={({ onChange, value }) =>
                                            <DatePicker
                                                format={"MM/DD/YYYY"}
                                                className={`${classes.datePicker} h-8`} value={value}
                                                onChange={(e) => {
                                                    onChange(e)
                                                    e && setValue("inputTo", format(new Date(e.toDate()), "yyyy/MM/dd"))
                                                }} />
                                        }
                                        control={control} defaultValue={moment().add(1, 'month')} />
                                </div>
                            </div>
                        </div>
                        <Button onClick={getLastQuantity} className={`!rounded-md my-1 !w-auto ${classes.btn}`}>
                            {t("MISCELLANEOUS.CHANNEL_MANAGER.getLast")}
                        </Button>
                        <div className='grid grid-cols-3 my-2'>
                            <div >
                                <Button onClick={() => setInventory(SetInventoryType.Availabilities)} className={`!rounded-md !w-auto ${classes.btn}`}>
                                    {`${t("MISCELLANEOUS.CHANNEL_MANAGER.set")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.availabilities")}`}
                                </Button>
                            </div>
                            <div className='flex justify-center'>
                                <Button onClick={() => setInventory(SetInventoryType.IncreaseAvailabilities)} className={`!rounded-md mr-2 !w-auto ${classes.btn}`}>
                                    +
                                </Button>
                                <Button onClick={() => setInventory(SetInventoryType.DecreaseAvailabilities)} className={`!rounded-md !w-auto ${classes.btn}`}>
                                    -
                                </Button>
                            </div>
                            <div className='flex justify-end'>
                                <Button onClick={() => setInventory(SetInventoryType.ReleasePeriod)} className={`!rounded-md !w-auto ${classes.btn}`}>
                                    {`${t("MISCELLANEOUS.CHANNEL_MANAGER.set")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.releasePeriod")}`}
                                </Button>
                            </div>
                        </div>
                        <div className='mt-6 mx-12'>
                            <div className='my-1'>
                                <label>{t("MISCELLANEOUS.CHANNEL_MANAGER.rateToSetRatePlan")}</label>
                                <div className='w-2/3 flex'>
                                    <Controller
                                        name="rateToSetRatePlan"
                                        render={({ onChange, value }) =>
                                            <InputNumber
                                                min={0}
                                                value={value} className={`${classes.inputNumber} !w-3/4 hiden-handler-wrap `} onChange={(e) => onChange(e)} />
                                        }
                                        control={control} defaultValue={0} />
                                    <span className='flex text-blue-700 text-lg ml-2 items-center whitespace-nowrap'>{ratePlanName}</span>
                                </div>
                            </div>
                            <div className='my-2 grid grid-cols-3'>
                                <div>
                                    <Button
                                        onClick={() => setInventory(SetInventoryType.SaveRatePlan)}
                                        disabled={disabledRatePlanControls} className={`!rounded-md !w-auto ${classes.btn}`}>
                                        {`${t("MISCELLANEOUS.CHANNEL_MANAGER.save")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.ratePlan")}`}
                                    </Button>
                                </div>
                                <div className='flex justify-center'>
                                    <Button
                                        onClick={() => setInventory(SetInventoryType.ExtraAdult)}
                                        disabled={disabledRatePlanControls} className={`!rounded-md !w-auto ${classes.btn}`}>
                                        {`${t("MISCELLANEOUS.CHANNEL_MANAGER.extraAdult")}`}
                                    </Button>
                                </div>
                                <div className='flex justify-end'>
                                    <Button
                                        onClick={() => setInventory(SetInventoryType.ExtraChild)}
                                        disabled={disabledRatePlanControls} className={`!rounded-md !w-auto ${classes.btn}`}>
                                        {`${t("MISCELLANEOUS.CHANNEL_MANAGER.extraChild")}`}
                                    </Button>
                                </div>
                            </div>
                            <div className='grid grid-cols-3'>
                                <div className='flex flex-col'>
                                    <div className='my-2'>
                                        <Controller
                                            name="isCloseToArrival"
                                            render={({ onChange, value }) =>
                                                <Checkbox
                                                    checked={value}
                                                    onChange={(e) => onChange(e.target.checked)}
                                                >
                                                    {`${t("MISCELLANEOUS.CHANNEL_MANAGER.closeTo")} ${t("BOOKING.SEARCHVALUE.arrival")}`}
                                                </Checkbox>
                                            }
                                            control={control} defaultValue={false} />
                                    </div>
                                    <div className='my-2'>
                                        <Controller
                                            name="isCloseToDeparture"
                                            render={({ onChange, value }) =>
                                                <Checkbox
                                                    checked={value}
                                                    onChange={(e) => onChange(e.target.checked)}
                                                >
                                                    {`${t("MISCELLANEOUS.CHANNEL_MANAGER.closeTo")} ${t("BOOKING.SEARCHVALUE.departure")}`}
                                                </Checkbox>
                                            }
                                            control={control} defaultValue={false} />
                                    </div>
                                    <div className='my-2'>
                                        <Controller
                                            name="isStopSell"
                                            render={({ onChange, value }) =>
                                                <Checkbox
                                                    checked={value}
                                                    onChange={(e) => onChange(e.target.checked)}
                                                >
                                                    {`${t("MISCELLANEOUS.CHANNEL_MANAGER.stopSell")}`}
                                                </Checkbox>
                                            }
                                            control={control} defaultValue={false} />
                                    </div>
                                </div>
                                <div className='col-span-1 no-content'></div>
                                <div className='flex flex-col items-end'>
                                    <div className='mb-1'>
                                        <Button onClick={() => setInventory(SetInventoryType.CTA)} size='large' disabled={disabledRatePlanControls} className={`!rounded-md !w-auto ${classes.btn}`}>
                                            CTA
                                        </Button>
                                    </div>
                                    <div className='mb-1'>
                                        <Button onClick={() => setInventory(SetInventoryType.CTD)} size='large' disabled={disabledRatePlanControls} className={`!rounded-md !w-auto ${classes.btn}`}>
                                            CTD
                                        </Button>
                                    </div>
                                    <div>
                                        <Button onClick={() => setInventory(SetInventoryType.StopSell)} size='large' disabled={disabledRatePlanControls} className={`!rounded-md !w-auto ${classes.btn}`}>
                                            {`${t("MISCELLANEOUS.CHANNEL_MANAGER.stopSell")}`}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4 flex justify-between'>
                                <div>
                                    <label>
                                        {`${t("MISCELLANEOUS.CHANNEL_MANAGER.min")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.nights")}`}
                                    </label>
                                    <div>
                                        <Controller
                                            name="minNights"
                                            render={({ onChange, value }) =>
                                                <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                            }
                                            control={control} defaultValue="0" />
                                    </div>
                                    <Button onClick={() => setInventory(SetInventoryType.MinNight)} size='large' disabled={disabledRatePlanControls} className={`!rounded-md mt-2 !w-auto ${classes.btn}`}>
                                        {`${t("MISCELLANEOUS.CHANNEL_MANAGER.min")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.nights")}`}
                                    </Button>
                                </div>
                                <div>
                                    <label>
                                        {`${t("MISCELLANEOUS.CHANNEL_MANAGER.max")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.nights")}`}
                                    </label>
                                    <div>
                                        <Controller
                                            name="maxNights"
                                            render={({ onChange, value }) =>
                                                <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                            }
                                            control={control} defaultValue="0" />
                                    </div>
                                    <Button onClick={() => setInventory(SetInventoryType.MaxNight)} size='large' disabled={disabledRatePlanControls} className={`!rounded-md mt-2 !w-auto ${classes.btn}`}>
                                        {`${t("MISCELLANEOUS.CHANNEL_MANAGER.max")} ${t("MISCELLANEOUS.CHANNEL_MANAGER.nights")}`}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex mt-4 items-center'>
                            <label className='mr-4'>Error</label>
                            <Controller
                                name="inputError"
                                render={({ onChange, value }) =>
                                    <Input value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                }
                                control={control} defaultValue="" />
                        </div>
                    </form>
                </div>
            </div>
        </CLoading>
    )
}

export default SetInventoryTabPane