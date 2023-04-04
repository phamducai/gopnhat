
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useStyleTheme } from 'theme';
import { Checkbox, Modal, Popover, Empty } from 'antd';
import { styleAreaRoomPlan } from '../styles/arearoomplan.style';
import ClassBox from 'components/CClassBox';
import clsx from 'clsx';
import CIconSvg from 'components/CIconSvg';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import { useSelectorRoot } from 'redux/store';
import { FloorInv, ListCardRoomPlan, PaginationRoom, RoomInfoUpdateStatus } from 'common/model-inventory';
import CLoading from 'components/CLoading';
import CPagination from 'components/CPagination';
import CTag from 'components/CTag';
import { NotificationStatus } from 'common/enum/shared.enum';
import openNotification from 'components/CNotification';
import { AssignRoom } from 'common/model-rsvn';
import { useHistory } from 'react-router';
import Utils from 'common/utils';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import FormFilter from './FormFilter';
import DashBoardService from 'services/dashboard/dashboard.service';
import { IReqStatistic } from 'common/dashboard/PropsDashboard';
import { addDays } from 'date-fns';
import GLobalPkm from 'common/global';
import { ResGuestProfiles } from 'common/define-api-booking';
import { TypeStatusTsRoom } from 'common/enum/roomplan.enum';
import { RevenueInDaysData } from 'common/model-statistic';
import { ReservationStatus } from 'common/enum/booking.enum';
interface ProprCard extends Props {
    data?: string,
    selectedDate: Date,
    ableButton: boolean,
    selectedRoom(roomGuid: string, isChecked: boolean, isContextRoom?: boolean): void
    setApplyForGroup: React.Dispatch<React.SetStateAction<boolean>>,
    searchAndMapData(): void,
    roomFilter: PaginationRoom,
    setRoomFilter: Dispatch<SetStateAction<PaginationRoom>>,
    getData(): void,
    dataRoom: ListCardRoomPlan[] | [],
    totalItem: number,
    isLoading: boolean,
    indexFloor: number,
    setLoading: Dispatch<SetStateAction<boolean>>,
    onDragEnd(cardRoomPlanItem: ListCardRoomPlan, transactionCardRoom: ResGuestProfiles): void,
    onDropRoomUnAssign(TRSRoom: string[]): void,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
    handleContextRoomPlan: any
}

const CardRoomPlan = ({
    ableButton, setApplyForGroup, selectedDate, selectedRoom, getData,
    searchAndMapData, roomFilter, setRoomFilter, dataRoom, totalItem, isLoading, setLoading, onDragEnd,
    onDropRoomUnAssign, indexFloor, setSelectedDate,handleContextMenu, handleContextRoomPlan, ...props }: ProprCard) => {
    const classes = useStyleTheme(styleAreaRoomPlan);
    const history = useHistory();
    const { t } = useTranslation("translation");
    const { hotelId } = useSelectorRoot(state => state.app);
    const { changeStatusProfiles } = useSelectorRoot(state => state.booking);
    const { listDmucColor } = useSelectorRoot(state => state.roomPlan);
    const { listStatisticGuest, availableTonight } = useSelectorRoot(state => state.frontdesk);
    const { handleSubmit, control, setValue, getValues } = useForm();
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);

    const [activeFloor, setActiveFloor] = useState<number>(indexFloor);
    const [valueTranslate, setValueTranslate] = useState<number>(0);
    const [indexRow, setIndexRow] = useState<number>(0);
    const [dataFloor, setDataFloor] = useState<FloorInv[]>([]);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [revenueInDay, setRevenueInDay] = useState<RevenueInDaysData>({Key: "", Value: 0})
    const [cardRoomPlanItem, setCardRoomPlanItem] = useState<ListCardRoomPlan>()
    const [widthProgress, setWidthProgress] = useState<string>("");

    useEffect(() => {
        const progress = Object.is(NaN, listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room) * 100) ? "0" :(listStatisticGuest.inHouse.room / (availableTonight + listStatisticGuest.inHouse.room) * 100).toFixed(2)
        setWidthProgress(progress)
        return () => {
            setWidthProgress("")
        }
    }, [availableTonight, listStatisticGuest.inHouse.room])
    useEffect(() => {
        const getFloor = async () => {
            if (dataFloor.length === 0) {
                const resFloor = await RoomPlanService.mapDataFloor(hotelId);
                if (resFloor) {
                    setDataFloor(resFloor);
                }
            }
        }
        getFloor();

    }, [businessDate, dataFloor.length, hotelId])

    useEffect(() => {
        const dataRevenueInLNext7Day = async (dataRevenue: IReqStatistic) => {
            const res = await DashBoardService.getRevenueInDay(dataRevenue)
            const revenueBusinessDate = res.find((item) => item.Key === Utils.formatDateCallApi(businessDate)) ?? {Key: "", Value: 0}
            revenueBusinessDate && setRevenueInDay(revenueBusinessDate)
        }
        const roomTypeGuid = GLobalPkm.defaultBytes32
        businessDate && dataRevenueInLNext7Day({hotelGuid: hotelId, roomTypeGuid, arrivalDate: Utils.convertStartDate(new Date(businessDate)), departureDate: Utils.convertEndDate(addDays(new Date(businessDate), 1))})
    },[businessDate, hotelId])

    useEffect(() => {
        if (listDmucColor.length > 0) {
            searchAndMapData();
            setValue("floor", roomFilter.floor);
            setValue("selectedDate", selectedDate);
        }
        return () => {
            setShowFilter(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomFilter, selectedDate, changeStatusProfiles, listDmucColor]);

    const handleActiveFloor = (index: number, key: number) => {
        setActiveFloor(index);
        setRoomFilter({
            ...roomFilter,
            pageNumber: 1,
            floor: key,
            roomName: null,
            roomType: null
        })
        const filterParam = {
            pageNumber: 1,
            floor: key,
            index: index,
            date: Utils.formatDateCallApi(selectedDate)
        }
        const queryString = Utils.querySearchToString(filterParam);
        history.push(`${history.location.pathname}?${queryString}`)
    }
    const backHandle = () => {
        if (indexRow === 0) {
            setValueTranslate(0);
            setIndexRow(0);
        } else {
            setValueTranslate(valueTranslate + 400);
            setIndexRow(indexRow - 1);
        }
    }

    const nextHandle = () => {
        if (Math.floor(dataFloor.length / 3) === indexRow) {
            setIndexRow(0);
            setValueTranslate(0);
        } else {
            setIndexRow(indexRow + 1);
            setValueTranslate(valueTranslate - 400);
        }
    }
    const onPagination = (page: number) => {
        setRoomFilter({
            ...roomFilter,
            pageNumber: page
        })
        const filterParam = {
            pageNumber: page,
            floor: roomFilter.floor,
            index: activeFloor,
            date: Utils.formatDateCallApi(selectedDate)
        }
        const queryString = Utils.querySearchToString(filterParam);
        history.push(`${history.location.pathname}?${queryString}`)
    }
    const renderListFloor = () => {
        return dataFloor.map((item, index) => {
            return (
                <button key={item.key}
                    className={`${activeFloor === index ? classes.btnActive : classes.btn} 
                    flex items-center justify-center`}
                    onClick={() => handleActiveFloor(index, item.key)}
                >
                    {activeFloor === index
                        ? <CIconSvg name="floor-room" svgSize="medium" colorSvg="background" />
                        : <CIconSvg name="floor-room" svgSize="medium" />}
                    <span className={`pl-2`}>{item.name}</span>
                </button>
            )
        })
    }
    const handleChecked = (value: string, checked: boolean) => {
        selectedRoom(value, checked);
    }

    const dragStartRoom = (item: ListCardRoomPlan) => {
        setCardRoomPlanItem(item)
    }

    const dropRoom = async (e: React.DragEvent<HTMLDivElement>, item: ListCardRoomPlan) => {
        e.preventDefault();
        if (e.dataTransfer.getData("transactionCardRoom")) {
            const transactionCardRoom = JSON.parse(e.dataTransfer.getData("transactionCardRoom"));
            onDragEnd(item, transactionCardRoom)
        } else {
            if (cardRoomPlanItem?.guid === item.guid)
                return
            else if (item.guid !== "")
                openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), t("FRONTDESK.ROOMPLAN.roomExist"))
            else if (cardRoomPlanItem?.guid && cardRoomPlanItem?.roomType === item.roomType) {
                const assign1: AssignRoom = {
                    trsGuid: cardRoomPlanItem ? cardRoomPlanItem?.guid : "",
                    roomGuid: item?.roomGuid,
                    roomName: item?.roomNumber.toString(),
                    roomType: item?.roomType
                }
                if (item?.cleanDirty === TypeStatusTsRoom.Clean) {
                    if (cardRoomPlanItem?.guid) {
                        try {
                            const res = await RoomPlanService.assignRoom([assign1]);
                            if (res.result) {
                                const roomUpdate: RoomInfoUpdateStatus = { cleanDirty: 0 }
                                openNotification(NotificationStatus.Success, t("FRONTDESK.ROOMPLAN.success"), t("FRONTDESK.ROOMPLAN.changeRoomSuccess"))
                                await RoomPlanService.updateStatusRoom(cardRoomPlanItem?.roomGuid, roomUpdate)
                                await getData()
                                await searchAndMapData();
                            }else{
                                openNotification(NotificationStatus.Error, t("FRONTDESK.error"), res.message)
                            }
                        } catch (error) {
                            openNotification(NotificationStatus.Error, t("FRONTDESK.error"), "")
                        }
                    }
                } else if (item?.tinhTrang === TypeStatusTsRoom.OutOfService && item?.cleanDirty === TypeStatusTsRoom.Dirty) {
                    const title = t("FRONTDESK.ROOMPLAN.assignDirtyAndOOS")
                    showConfirm(assign1, title, cardRoomPlanItem)
                } else if (item?.tinhTrang === TypeStatusTsRoom.OutOfService) {
                    const title = t("FRONTDESK.ROOMPLAN.assignOOSRoom")
                    showConfirm(assign1, title, cardRoomPlanItem)
                }
                else {
                    const title = t("FRONTDESK.ROOMPLAN.assignDirtyRoom")
                    showConfirm(assign1, title, cardRoomPlanItem)
                }
            } else if (cardRoomPlanItem?.guid && cardRoomPlanItem?.roomType !== item.roomType) {
                const assign2: AssignRoom = {
                    trsGuid: cardRoomPlanItem ? cardRoomPlanItem?.guid : "",
                    roomGuid: item?.roomGuid,
                    roomName: item?.roomNumber.toString(),
                    roomType: item?.roomType
                }
                const title = `${t("FRONTDESK.ROOMPLAN.wantToChange")} ${cardRoomPlanItem?.roomName} ${t("FRONTDESK.ROOMPLAN.roomTo")} ${item?.roomName} ${t("FRONTDESK.ROOMPLAN.fromRoom")}`
                showConfirm(assign2, title, cardRoomPlanItem)
            }
        }
        setCardRoomPlanItem(undefined)
    }

    const dragOverRoom = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const el = document.querySelector('.ghost');
        el && el.remove(); // Removes the div with the 'div-02' id
    }

    const dropRoomUnAssign = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if(cardRoomPlanItem && cardRoomPlanItem?.status === ReservationStatus.Reservation){
            cardRoomPlanItem?.guid && onDropRoomUnAssign([cardRoomPlanItem?.guid])
        }else{
            openNotification(NotificationStatus.Error, "Room is currently in house, cannot be unassigned", "")
        }
    }

    const showConfirm = (assign: AssignRoom, title: string, cardRoomPlanItem: ListCardRoomPlan) => {
        Modal.confirm({
            title: title,
            className: "custom-modal-confirm-pkm",
            async onOk() {
                if (cardRoomPlanItem?.guid) {
                    try {
                        const res = await RoomPlanService.assignRoom([assign]);
                        if (res.result) {
                            const roomUpdate: RoomInfoUpdateStatus = { cleanDirty: TypeStatusTsRoom.Dirty }
                            if (cardRoomPlanItem?.guid) {
                                await RoomPlanService.updateStatusRoom(cardRoomPlanItem?.roomGuid, roomUpdate)
                                openNotification(NotificationStatus.Success, t("FRONTDESK.ROOMPLAN.success"), t("FRONTDESK.ROOMPLAN.AssignSuccess"))
                                getData()
                                searchAndMapData();
                            }
                        }
                    } catch (error) {
                        openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), "")
                    }
                }
            },
        });
    }
    const onSubmitSearch = (data: any) => {
        let indexFloor = -1;
        if (data.floor !== -1) {
            indexFloor = dataFloor.findIndex(x => x.key === data.floor);
        }
        setRoomFilter({
            ...roomFilter,
            pageNumber: 1,
            roomName: data.roomName === "" ? null : data.roomName,
            roomType: data.roomType === "" ? null : data.roomType,
            floor: data.floor
        })
        setActiveFloor(indexFloor);
        setSelectedDate(data.selectedDate)
        const filterParam = {
            pageNumber: 1,
            floor: roomFilter.floor,
            index: indexFloor,
            date: Utils.formatDateCallApi(data.selectedDate)
        }
        const queryString = Utils.querySearchToString(filterParam);
        history.push(`${history.location.pathname}?${queryString}`)
        setShowFilter(false);
    }
    const renderListCard = () => {
        return dataRoom.map((item: ListCardRoomPlan, index: number) => {
            const tmpClass = item.guestNumber > 0 ? "style-number-guest" : "";
            return (
                <div key={item.roomGuid} className={`${classes.styleItemCard} col-span-1 shadow-sm`}
                    id={item.roomGuid}
                    onDragStart={() => dragStartRoom(item)}
                    draggable
                    onDrop={(e) => dropRoom(e, item)}
                    onDragOver={(e) => dragOverRoom(e)}
                    onContextMenu={(e) => handleContextRoomPlan(e, item.roomGuid)}
                >
                    <div className="top-item-card grid items-center">
                        <span className={`${tmpClass} flex m-0 font-base font-bold`}>{item.guestNumber}
                            <CIconSvg className="ml-1" name={`${item.iconName}`} hexColor={item.colorIcon} svgSize="small" />
                        </span>
                        <span className="room-name text-center font-base font-bold">{item.roomNumber} {item.roomName}</span>
                        <div className='flex justify-end'>
                            <Checkbox value={item.roomGuid} checked={item.isChecked}
                                onChange={(e) => handleChecked(e.target.value, e.target.checked)}
                            />
                        </div>
                        
                    </div>
                    <div className={`content-item-card grid grid-cols-3`}>
                        {item.statusInfor ?
                            <>
                                <div className={`col-span-2`}>
                                    <div className="mb-1 font-bold">{item.fullNameGuestMain}</div>
                                    <p className="mb-1">Group Code:
                                        <span className="font-bold"> {item.groupCode}</span>
                                    </p>
                                    <p className="m-0">Rate:
                                        <span className="font-bold"> {item.rate}</span>
                                    </p>
                                </div>
                                <span className={`col-span-1`}>{item.dateToAndForm}</span>
                            </>
                            :
                            <p className="no-info">No Info</p>
                        }
                    </div>
                    <div className={`footer-item-card`}>
                        <CTag title={item.nameCompanyOrAgent} color={item.colorInfor}
                            icon="check-circle" isShowIcon={item.statusRoom} />
                    </div>
                </div>
            )
        })
    }
    const contentPoPover = (
        <form onSubmit={handleSubmit(onSubmitSearch)}>
            <FormFilter
                control={control}
                getValues={getValues}
                setValue={setValue}
                dataFloor={dataFloor}
                selectedDate={selectedDate}
            />
        </form>
    )
    return (
        <ClassBox className={clsx(props.className, classes.roomBody)}>
            <div className={`${classes.header}  grid grid-cols-12 col-span-12 gap-1`}>
                <button className={`${classes.titleRoomPlan} ${activeFloor === -1 ? classes.titleRoomPlanActive : ""} col-span-2`}
                    style={{ whiteSpace: "nowrap" }}
                    onClick={() => handleActiveFloor(-1, -1)}
                >
                    All Rooms In Hotel
                </button>
                <div className={`grid grid-cols-12 col-span-10`}>
                    <div className={`col-span-11 flex relative items-center overflow-hidden`}>
                        <button className={`${classes.backOrNextBtn} absolute left-0 shadow-sm z-10`}
                            onClick={() => backHandle()}
                        >
                            <CIconSvg name="back" hexColor="#00293B" svgSize="small" />
                        </button>
                        <div className={`${classes.animationRow} flex w-full h-full gap-1`}
                            style={{ transform: `translateX(${valueTranslate}px)` }}
                        >
                            {renderListFloor()}
                        </div>
                        <button className={`${classes.backOrNextBtn} absolute right-0 shadow-sm z-10`}
                            onClick={() => nextHandle()}
                        >
                            <CIconSvg name="next" hexColor="#00293B" svgSize="small" />
                        </button>
                    </div>
                    <Popover visible={showFilter} overlayClassName={`${classes.customPopoFilter} col-span-1`} placement="bottomRight"
                        title={false} content={contentPoPover} trigger="click"
                        onVisibleChange={() => setShowFilter(!showFilter)}
                    >
                        <button className={`${classes.titleRoomPlan} ${classes.titleRoomPlanActive} col-span-1 flex gap-1 items-center justify-center`}>
                            <CIconSvg name="filter" hexColor="#FFFFFF" svgSize="medium" />
                        </button>
                    </Popover>
                </div>
            </div>
            {/*boby room plan*/}
            <div className="pt-2 px-5 pb-0" onContextMenu={(e) => e.preventDefault()}>
                <div className={`grid grid-cols-12 col-span-12 grid-flow-col gap-1`}>
                    <Checkbox
                        className={`${classes.checkBox} xl:col-span-3 col-span-12 font-bold`}
                        style={{ color: "#00293B", cursor: "context-menu" }}
                        onChange={e => setApplyForGroup(e.target.checked)}
                        disabled={!ableButton}
                    >
                        Apply for this group
                    </Checkbox>
                    <div className={`${classes.styleColor} xl:col-span-9 col-span-12 flex justify-end`}>
                        <label className="mr-4  m-0">Room Revenue:
                            <span> {Utils.formatNumber(revenueInDay.Value)}</span>
                        </label>
                        <label className="mx-4  m-0">OCC:
                            <span> {listStatisticGuest.inHouse.room + listStatisticGuest.arrivals.actual.room + listStatisticGuest.arrivals.expected.room}</span>
                        </label>
                        <label className="mx-4 m-0">Current OCC:
                            <span> {listStatisticGuest.inHouse.room} / {listStatisticGuest.inHouse.room + listStatisticGuest.arrivals.actual.room + listStatisticGuest.arrivals.expected.room}</span>
                        </label>
                        <label className="mx-4  m-0">Vacant:
                            <span> {availableTonight}</span>
                        </label>
                        <label className="mx-4  m-0 mr-0">Occupancy:
                            <span> {widthProgress}%</span>
                        </label>
                    </div>
                </div>
                {/* list card item room plan */}
                <CLoading visible={isLoading} >
                    <div className={`${classes.styleCardContent} custom-scrollbar-room-plan grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2`}>
                        {dataRoom.length > 0 ? renderListCard() : <Empty className="2xl:col-span-5 xl:col-span-4 md:col-span-3" style={{ marginTop: "10rem" }} />}
                    </div>
                </CLoading>
                <div className="flex items-center justify-end gap-3 mt-1">
                    <CPagination
                        total={totalItem}
                        current={roomFilter.pageNumber}
                        onChange={(page) => onPagination(page)}
                        pageSize={roomFilter.pageSize}
                    />
                    <div className={`${classes.styleDargZoom} flex`}>
                        <button>
                            <CIconSvg name="plus" hexColor="#00293B" svgSize="default" />
                        </button>
                        <button>
                            <CIconSvg name="darg" hexColor="#00293B" svgSize="default" />
                        </button>
                        <button>
                            <CIconSvg name="minus" hexColor="#00293B" svgSize="default" />
                        </button>
                    </div>
                </div>

                {/* end */}
                <div className={`${classes.footerCardRoomPlan} grid items-center justify-center mt-2`}
                    onDragOver={(e) => dragOverRoom(e)}
                    onDrop={(e) => dropRoomUnAssign(e)}
                >
                    <span className="w-full" style={{ marginTop: '0.3rem' }}>
                        <CIconSvg name="calendar-clear" hexColor="#666666" svgSize="big" />
                    </span>
                    <p className="w-full" style={{ color: '#666666' }}>Kéo & Thả các phòng vào đây để hủy xếp phòng</p>
                </div>
            </div>
            {/*end*/}
        </ClassBox>
    );
};

export default React.memo(CardRoomPlan);