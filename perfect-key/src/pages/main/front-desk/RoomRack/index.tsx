/* eslint-disable react-hooks/exhaustive-deps */
import CGrantChart from "components/RoomRack/CGrantChart";
import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { useStyleTheme } from "theme";
import { useHistory } from 'react-router-dom';
import { styleReservation } from 'pages/main/booking/reservation/styles/reservation';
import CIconSvg from "components/CIconSvg";
import { useTranslation } from "react-i18next";
import Utils from "common/utils";
import { Button, Input, Modal, notification, Select } from 'antd';
import DatePicker from "components/CDatePicker";
import { addDays } from "date-fns/esm";
import RoomRackService from "services/frontdesk/roomrack.service";
import {  RoomType } from "common/model-inventory";
import { getListDataRequest, setDateRange, setGuestProfileData, setListRoomPlane, setListRoomPlaneMore, setLoadingRoomRack, setRoomFloors, setRoomrackFooter, setRoomTypeRoomRack, setStartDate, setTaskOfRoom, setTaskOfRoomMore, setDateRangePicker,setCurrentPage } from "redux/controller/frontdesk/roomrack.slice";
import { format } from "date-fns";
import { ResRoom } from "common/define-api-booking";
import { ScrollSync } from "react-scroll-sync";
import { DataRooms, DefaultDataRooms, ResGetAllByHotelId, ResListRoom, RoomRackFilterOptions, RoomRackFooter, Task } from "common/front-desk/define-roomRack";
import { styles } from "./style";
import InventoryApi from "api/inv/inv.api";
import useWindowDimensions from "hooks/useWindowDimensions";
import CLoading from "components/CLoading";
import { styleCForm } from "pages/main/booking/styles/styleCForm";
import RoomPlanService from "services/frontdesk/roomplan.service";
import GLobalPkm from "common/global";
import { ReservationStatus } from "common/enum/booking.enum";
import GuestProfileService from "services/booking/guestprofile.service";
import FrontDeskService from "services/frontdesk/frontdesk.service";
import { TypeTracer } from "common/enum/cashier.enum";
import { setAlertMessage } from "redux/controller";
import FolioService from "services/cashier/folio.service";
import ReservationService from "services/reservation/reservation.service.";
import { ResCheckInToGroup } from "common/model-rsvn-edit";
import { TypeStatusTsRoom } from "common/enum/roomplan.enum";
import { IParamCheckIn, TransactRoom } from "common/model-booking";
import Auth from "services/auth/auth.service";
import Role from "common/roles";

const RoomRack = () => {
    const footerRef = useRef<HTMLDivElement>(null);
    const { Option } = Select;
    const { hotelName } = useSelectorRoot(state => state.app);
    const { roomType, roomFloors, currentPage, dateRangePicker } = useSelectorRoot(state => state.roomRack);
    const { loading } = useSelectorRoot(state => state.roomRack);
    const classeForm = useStyleTheme(styleCForm);
    const classes = useStyleTheme(styleReservation);
    const history = useHistory();
    const { t } = useTranslation("translation");
    const dispatch = useDispatchRoot();
    const { hotelId } = useSelectorRoot(state => state.app);
    const { data, roomRackFooter } = useSelectorRoot(state => state.roomRack);
    const businessDateRedux = useSelectorRoot(state => state.hotelConfig.businessDate);
    const classesRoomRack = useStyleTheme(styles);
    const{ height, width } = useWindowDimensions();

    // const [isVisibleChange, setIsVisibleChange] = useState<boolean>(false);
    const [openToDatePicker, setOpenToDatePicker] = useState(false);
    const [selectDataRow, setSelectDataRow] = useState<DataRooms>(DefaultDataRooms)
    const [filterOptions, setFilterOptions] = useState<RoomRackFilterOptions>({
        floor : -1,
        hotelGuid : hotelId,
        pageNumber : currentPage,
        pageSize : 20,
        roomType : null,
        roomName : "",
    })
    const [roomName, setRoomName] = useState("");
    const [listDate, setListDate] = useState<string[]>(getListDayBetween(dateRangePicker));
    const [widthOfColumns, setWidthOfColumns] = useState((window.innerWidth - 60) * 80 / 100 / listDate.length);
    const [columns, setColumns] = useState(listDate.length);

    const refreshDay = () => {
        dispatch(setDateRangePicker({ fromDate: new Date(), toDate: addDays(new Date, 6) }))
    }
    const onChangeFrom = (fromDate: Date | null) => {
        setOpenToDatePicker(true);
        fromDate && dispatch(setDateRangePicker({ ...dateRangePicker, fromDate: fromDate }));
    }
    const onChangeTo = (toDate: Date | null) => {
        setOpenToDatePicker(false);
        toDate && dispatch(setDateRangePicker({ ...dateRangePicker, toDate: toDate }));
    }
    
    const nextOrPrevious7Days = (next: boolean) => {
        if (next) {
            dispatch(setDateRangePicker({ fromDate: addDays(dateRangePicker.fromDate, 6), toDate: addDays(dateRangePicker.toDate, 6) }))
        }
        else {
            dispatch(setDateRangePicker({ fromDate: addDays(dateRangePicker.fromDate, -6), toDate: addDays(dateRangePicker.toDate, -6) }))
        }
    }

    function getListDayBetween (date: { fromDate: Date, toDate: Date }){
        const dates = [];
        const cloneDateRangePicker = { ...dateRangePicker };
        let today = cloneDateRangePicker.fromDate;
        while (today <= dateRangePicker.toDate) {
            dates.push(format(new Date(today), 'eee dd'));
            today = addDays(today, 1)
        }
        return dates;
    }

    useEffect(() => {
        //when reload if data is loaded will not reload
        if(Math.ceil(data.length / 20) === currentPage) return;
        if (currentPage > 1) {
            // const cloneFilterOptions = {...filterOptions, pageNumber : currentPage + 1}
            getDataRoomRack({...filterOptions,pageNumber : currentPage},dateRangePicker, true,roomRackFooter)
        }
    }, [currentPage])

    useEffect(() => {
        const listDayBetween = getListDayBetween(dateRangePicker);
        setListDate(listDayBetween);
        dispatch(setDateRange(listDayBetween));
        dispatch(setRoomrackFooter([]));
        if (!data || data.length <= 0) {
            getDataRoomRack(filterOptions,dateRangePicker, false,roomRackFooter);
        }
        else {
            getDataWhenDateChange();
        }
    }, [dateRangePicker.toDate])

    useEffect(() => {
        getDataRoomRack(filterOptions,dateRangePicker, false,[]);
    },[filterOptions, setFilterOptions])

    useEffect(() => {
        const listDayBetween = getListDayBetween(dateRangePicker);
        setListDate(listDayBetween);
        dispatch(setDateRange(listDayBetween));
        getDataRoomRack(filterOptions,dateRangePicker, false,roomRackFooter);
        fetchRoomType();
        return (()=> {
            dispatch(setCurrentPage(1))
        })
    }, [hotelId]);

    useEffect(() => {
        if(roomType.length === 0){
            fetchRoomType();
        }
        if(roomFloors.length === 0){
            fetchRoomFloor();
        }
    },[roomType.length,roomFloors.length])

    useEffect(() => {
        dispatch(setStartDate(dateRangePicker.fromDate));
    }, [dateRangePicker.toDate])

    const getDataWhenDateChange = async () => {
        const listRoom: string[] = [];
        //eslint-disable-next-line
        let taskOfRoom: any = {};
        data.forEach((item: ResRoom) => {
            listRoom.push(item.guid);
            taskOfRoom = { ...taskOfRoom, [item.guid]: [] };
        })
        try {
            const resGuest: ResGetAllByHotelId = await RoomRackService.getAllRoomByHotelId(filterOptions, hotelId, Utils.convertMiddleDate(dateRangePicker.fromDate), Utils.convertMiddleDate(dateRangePicker.toDate),roomRackFooter,data.length);
            const res: ResListRoom = await RoomRackService.getDetailOfAllRoom(hotelId, Utils.convertMiddleDate(dateRangePicker.fromDate), Utils.convertMiddleDate(dateRangePicker.toDate), listRoom);
            if (res && resGuest) {
                //eslint-disable-next-line
                res.data.map((item: Task) => {
                    taskOfRoom[item.dataRooms.mappingRoomId].push(item);
                });
                dispatch(setGuestProfileData(resGuest.guestProfileData));
                dispatch(setTaskOfRoom(taskOfRoom));
                dispatch(setRoomrackFooter(res.roomRackFooter));
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchRoomFloor = async () => {
        try{
            const res : number[] = await InventoryApi.getAllFLoorByGuid(hotelId).toPromise() as number[];
            if(res){
                dispatch(setRoomFloors(res));
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchRoomType = async () => {
        try{
            const res: RoomType[] = await InventoryApi.invRoomtype(hotelId).toPromise() as RoomType[];
            if(res){
                const roomType = res.filter((e : RoomType) => e.ma !== "PM");
                dispatch(setRoomTypeRoomRack(roomType));
            }
        }
        catch(err){
            console.log(err);
        }
    }
    
    //Call Api when render
    const getDataRoomRack = async (filterOptions : RoomRackFilterOptions,dateRangePicker: { fromDate: string | Date, toDate: string | Date }, isMore: boolean, roomRackFooter : RoomRackFooter[]) => {
        try {
            const res: ResGetAllByHotelId = await RoomRackService.getAllRoomByHotelId(filterOptions, hotelId, Utils.convertMiddleDate(dateRangePicker.fromDate), Utils.convertMiddleDate(dateRangePicker.toDate),roomRackFooter,data.length);
            dispatch(getListDataRequest());
            if (res) {
                if (isMore) {           
                    dispatch(setGuestProfileData(res.guestProfileData));
                    dispatch(setListRoomPlaneMore(res));
                    dispatch(setTaskOfRoomMore(res.taskOfRoom));
                    dispatch(setRoomrackFooter(res.listRoomRackFooter));
                }
                else {
                    dispatch(setRoomrackFooter(res.listRoomRackFooter));
                    dispatch(setGuestProfileData(res.guestProfileData));
                    dispatch(setListRoomPlane(res));
                    dispatch(setTaskOfRoom(res.taskOfRoom));
                }
                dispatch(setLoadingRoomRack(false));
            }
        }
        catch(err){
            console.log(err);
        }
    }

    function handleOnScrollTotal(scrollLeft: number) {
        const footer = document.getElementsByClassName('chart-footer-scroll');
        for (let i = 0; i < footer.length; i++) {
            footer[i].scrollLeft = scrollLeft;
        }
    }

    function onChangeFilter(value : string | number | null, name : string){
        let cloneFilterOptions : RoomRackFilterOptions
        if(value === ""){
            cloneFilterOptions = {...filterOptions, [`${name}`] : null};
            dispatch(setCurrentPage(1));
        }
        else{
            cloneFilterOptions = {...filterOptions, [`${name}`] : value};
            dispatch(setCurrentPage(1));
        }
        setFilterOptions(cloneFilterOptions);
        // dispatch(clearAllData());
    }

    useEffect(() => {
        if(!listDate.length) return;
        setColumns(listDate.length);
        setWidthOfColumns((window.innerWidth - 60) * 80 / 100 / (listDate.length <= 7 ? listDate.length : 7))
    }, [listDate.length])

    useEffect(() => {
        if(width){
            setWidthOfColumns((width - 60) * 80 / 100 / (listDate.length <= 7 ? listDate.length : 7));
        }
        //eslint-disable-next-line
    },[width, height]);

    const clickEditRsvn = () => {
        if(Auth.hasRole(Role.FO_FOM_GM)){
            const rsvnNo = selectDataRow.rsvnID
            const status = selectDataRow.status ?? "";
            history.push(`/main/booking/edit-rsvn/${selectDataRow.mainGuest}?isMain=${true}`, {rsvnNo, status, isTableSearch: true });
        }
    }

    const clickEditGroupInHouse = () => {
        if(Auth.hasRole(Role.FO_FOM_GM)){
            const rsvnNo = selectDataRow.rsvnID
            const status = RoomPlanService.updateStatus(selectDataRow.status ?? 0);
            const roomGuid = selectDataRow.mappingRoomId ?? GLobalPkm.defaultBytes32;
            history.push(`/main/front-desk/edit-group-inhouse/${selectDataRow.mainGuest}`, { roomGuid, rsvnNo, status })
        }
    }

    const handleCheckIn = async () => {
        if(Auth.hasRole(Role.FO)){
            const listParamCheckin: IParamCheckIn[] = [];
            const mainTsRoom = selectDataRow.transactRoom.find(x => x.parentMeGuid === null) as TransactRoom;
            const getDataRoom = data.find(x => x.guid === selectDataRow.mappingRoomId);
            if(mainTsRoom && getDataRoom){
                listParamCheckin.push({
                    roomName: getDataRoom.so,
                    mainTsRoom: mainTsRoom.guid ?? GLobalPkm.defaultBytes32,
                    status: RoomPlanService.updateStatus(0),
                    rsvnNo: "1",
                    parentMeGuid: null
                });
                selectDataRow.transactRoom.forEach(x => {
                    if(x.parentMeGuid !== null){
                        listParamCheckin.push({
                            roomName: getDataRoom.so,
                            mainTsRoom: x.guid ?? GLobalPkm.defaultBytes32,
                            status: RoomPlanService.updateStatus(0),
                            rsvnNo: "1",
                            parentMeGuid: x.parentMeGuid
                        });
                    }
                })
            }
            if (getDataRoom?.nhom === TypeStatusTsRoom.Dirty && getDataRoom?.cleanDirty === TypeStatusTsRoom.Dirty) {
                Modal.confirm({
                    title: `Room ${getDataRoom.so} is dirty! Do you want check in continue ?`,
                    okText: t("FRONTDESK.ROOMPLAN.yes"),
                    cancelText: t("FRONTDESK.ROOMPLAN.no"),
                    className: "custom-modal-confirm-pkm",
                    async onOk() {
                        const res = await FrontDeskService.getMessageAlert(selectDataRow.mainGuest, TypeTracer.AlertCheckIn, hotelId)
                        if (typeof res !== "string") {
                            res && dispatch(setAlertMessage(res))
                        }
                        history.push(`/main/front-desk/check-in/${selectDataRow.mainGuest}`,
                            { listParamCheckin: listParamCheckin, isFirst: true, isMain: true });
                    }
                });
            } else {
                const res = await FrontDeskService.getMessageAlert(selectDataRow.mainGuest, TypeTracer.AlertCheckIn, hotelId)
                if (typeof res !== "string") {
                    res && dispatch(setAlertMessage(res))
                }
                history.push(`/main/front-desk/check-in/${selectDataRow.mainGuest}`,
                    { listParamCheckin: listParamCheckin, isFirst: true, isMain: true });
            }
        }
    }
    const handleGroupCheckin = async () => {
        if(Auth.hasRole(Role.FO)){
            Modal.confirm({
                title: "Do you want check in group?",
                okText: t("FRONTDESK.ROOMPLAN.yes"),
                cancelText: t("FRONTDESK.ROOMPLAN.no"),
                className: "custom-modal-confirm-pkm",
                async onOk() {
                    const res = await ReservationService.checkInToGroup(selectDataRow.rsvnID, Utils.formatDateByUTC(businessDateRedux)) as ResCheckInToGroup;
                    if (res) {
                        setFilterOptions({
                            ...filterOptions
                        })
                        notification.success({
                            message: <b style={{ color: "#00293B" }}>Check in group success !</b>,
                            style: { borderRadius: 6 },
                            description:
                                <div>
                                    <span>Date: {Utils.formatDateVN(new Date(res.arrivalDate))} ~ {Utils.formatDateVN(new Date(res.departureDate))}</span>
                                    <br />
                                    <span>Total Room: {res.listRoomName.length}</span>
                                    <br />
                                    <span>Total Guest: {res.totalGuest}</span>
                                    <br />
                                    <span>Check in time: {Utils.convertToVNTimeZoneMbyMoment(res.arrival)}</span>
                                </div>
                        })
                    }
                }
            });
        }
    }
    const handleClickFolio = async () => {
        let guestId = ""
        let fullName = ""
        selectDataRow.transactRoom.forEach((item) => {
            if(item.guid === selectDataRow.mainGuest){
                guestId = item.guestId
            }
        })
        const resGuest = await GuestProfileService.getGuestProfileByGuid(guestId);  // get infor Guest Profile
        if(resGuest) {
            fullName = resGuest?.firstName ?? "" + resGuest?.guestName ?? ""
        }
        const roomNumber = selectDataRow.roomName;
        const res = await FrontDeskService.getMessageAlert(selectDataRow.mainGuest, TypeTracer.AlertCheckOut, hotelId)
        if (typeof res !== "string") {
            res && dispatch(setAlertMessage(res))
        }
        history.push(`/main/cashier/folio/${selectDataRow.mainGuest}`,
            {
                fullName, tsRomGuid: selectDataRow.mainGuest, roomNumber: roomNumber,
                guestGuid: guestId, status: selectDataRow?.status,
                parentMeGuid: null, idRsvn: selectDataRow.rsvnID
            }
        )
    }

    const handleCheckOutGroup = async () => {
        const departureDate = new Date(selectDataRow.departureDate ?? "")
        Modal.confirm({
            title: departureDate > businessDateRedux ? "Do you want to check out early ?" : "Do you want check out this group ? ",
            className: "custom-modal-confirm-pkm",
            async onOk() {
                const respCheckOut = await FolioService.checkBalanceCheckOut("", selectDataRow.rsvnID, "", false);
                if (respCheckOut.length > 0) {
                    notification["error"]({
                        message: "Check out failed !",
                        description: (
                            <div>
                                {respCheckOut.map((item) => {
                                    return (
                                        <p key={item.tsRoomId}>
                                            Guest {item.fullName}, <b style={{ color: "red" }}>{`folio ${item.positionGroups.join(", ")} invalid !`}</b>
                                        </p>
                                    )
                                })}
                                <i>Note ( All group folio balance must be zero )</i>
                            </div>
                        ),
                        style: { borderRadius: 6, top: "8vh" }
                    })
                }
                else {
                    await ReservationService.checkOutToGroup(selectDataRow.rsvnID, businessDateRedux);
                    getDataRoomRack(filterOptions,dateRangePicker, false,[])
                }
            }
        });
    }

    return (
        <div>
            <Helmet>
                <title>{hotelName} - Room Rack</title>
            </Helmet>
            <ScrollSync>
                <div className={`${classes.main} custom-scrollbar-pkm`} 
                    style={{ height: "calc( 100vh - 64px)", color: "#00293B", overflow : "hidden" }}
                >
                    <CLoading visible = {loading} fullScreen={false}>
                        <div className={'flex justify-between'} style={{ marginTop: 20 }}>
                            <div className={` flex flex-wrap items-center justify-between `} style={{ marginTop: 20 }}>
                                <div className={`${classes.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`} onClick={() => {
                                    history.push('/main/front-desk');
                                }}>
                                    <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                                </div>
                                <label className="m-0 text-base font-bold ml-3">{t("FRONTDESK.ROOMPLAN.roomPlan")}
                                    <br />
                                    <div className="flex" style={{ fontSize: 13, color: "#666666" }}>
                                        <label className="m-0">{t("FRONTDESK.ROOMPLAN.businessDate")}: {Utils.formatDateVN(new Date(businessDateRedux))}</label>
                                    </div>
                                </label>
                            </div>
                            {selectDataRow.id ?
                                <div className={`flex`}>
                                    <Button
                                        onClick={() => setSelectDataRow(DefaultDataRooms)}
                                        type="link" danger
                                        className={`justify-center mt-5 self-center hover:#F74352`}
                                        style={{display: "flex", color: "#F74352 !important"}}
                                    >
                                        {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                                        <CIconSvg name="close-drawer" hexColor="#F74352" svgSize="medium" 
                                            className="ml-2" style={{marginTop: 1}} />
                                    </Button>
                                    <Button
                                        className={`${classeForm.funcBtn} ml-1`}
                                        onClick={clickEditRsvn}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className={`${classeForm.funcBtn} ml-1`}
                                        disabled={selectDataRow.status === 1 ? false : true}
                                        onClick={clickEditGroupInHouse}
                                    >
                                        {t("FRONTDESK.ROOMPLAN.groupIH")}
                                    </Button>
                                    <Button
                                        className={`${classeForm.funcBtn} ml-1`}
                                        // onClick={NewWalkIn}
                                        disabled
                                    >
                                        {t("FRONTDESK.ROOMPLAN.walkIn")}
                                    </Button>
                                    <Button
                                        className={`${classeForm.funcBtn} ml-1`}
                                        disabled={selectDataRow.status === ReservationStatus.Reservation ? false : true}
                                        onClick={handleCheckIn}
                                    >
                                        {t("FRONTDESK.ROOMPLAN.checkin")}
                                    </Button>
                                    <Button
                                        className={`${classeForm.funcBtn} ml-1`}
                                        disabled={selectDataRow.status === ReservationStatus.Reservation ? false : true}
                                        onClick={handleGroupCheckin}
                                    >
                                        {t("FRONTDESK.ROOMPLAN.groupCI")}
                                    </Button>
                                    <Button
                                        onClick={handleClickFolio}
                                        className={`${classeForm.funcBtn} ml-1`}
                                    >
                                        {t("FRONTDESK.ROOMPLAN.folio")}
                                    </Button>
                                    {/* <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomLeft">
                                        <Button  utton className={`${classeForm.funcBtn} ml-1`}>...</Button>
                                    </Dropdown> */}
                                    <Button className={`${classeForm.funcBtn} ml-1`} 
                                        onClick={handleCheckOutGroup}
                                        disabled={selectDataRow.status === 1 ? false : true}
                                    >
                                        {t("FRONTDESK.ROOMPLAN.groupCO")}
                                    </Button>
                                </div>
                                :
                                <div className={`${classesRoomRack.cointainer} flex  grid grid-cols-12 col-span-12 gap-1`}>
                                    <div className={`md:col-span-2 2xl:col-span-2`}></div>
                                    <div className={`px-1 md:col-span-2 2xl:col-span-1`}>
                                        <p>{t("FRONTDESK.ROOMRACK.floor")}</p>
                                        <Select showSearch defaultValue={-1}
                                            onChange = {(e) => {
                                                onChangeFilter(e,"floor")
                                            }}
                                        >
                                            <Option value = {-1}>All Floor</Option>
                                            {roomFloors && roomFloors.length > 0 ? roomFloors.map((item: number, index : number) => {
                                                return <Option value = {item} key = {item}>{`Floor ${item}`}</Option>
                                            }) : ""}
                                        </Select>
                                    </div>
                                    <div className={`px-1 md:col-span-2 2xl:col-span-1`}>
                                        <p>{t("FRONTDESK.ROOMRACK.roomNo")}:</p>
                                        <Input
                                            style={{ width: "100%" }}
                                            suffix={
                                                <CIconSvg tooltip={{ title: "Search" }} className='cursor-pointer' name="search" hexColor="#1A87D7" svgSize="small"
                                                    onClick = {() => {
                                                        onChangeFilter(roomName, "roomname");
                                                    }}
                                                />
                                            }
                                            onChange = {(e) => {
                                                setRoomName(e.target.value)
                                            }}                            
                                            onPressEnter = {(e) => {
                                                onChangeFilter(e.currentTarget.getAttribute("value"), "roomname");
                                            }}
                                        />
                                    </div>
                                    <div className={`px-1 md:col-span-2 2xl:col-span-1`} >
                                        <p>{t("FRONTDESK.ROOMRACK.roomType")}:</p>
                                        <Select showSearch defaultValue={""}
                                            onChange = {(e) => {
                                                onChangeFilter(e,"roomType")
                                            }}
                                        >
                                            <Option value = {""}>All Room Type</Option>
                                            {roomType && roomType.length > 0 ? roomType.map((item: RoomType, index : number) => {
                                                return <Option value = {item.guid} key = {item.guid}>{item.ten}</Option>
                                            }) : ""}
                                        </Select>
                                    </div>
                                    <div className={`px-1 rangePicker md:col-span-4 2xl:col-span-3`}>
                                        <p>{t("FRONTDESK.ROOMRACK.dateRange")}:</p>
                                        <div className={`flex items-center `}>
                                            <DatePicker placeholder="From"
                                                onChange={onChangeFrom}
                                                value={dateRangePicker.fromDate}
                                            />
                                            <div style={{ maxWidth: "8px", padding: "0 6px" }} className="font-bold flex justify-center px-1">~</div>
                                            <DatePicker placeholder="To"
                                                value={dateRangePicker?.toDate}
                                                onChange={onChangeTo}
                                                onClick={() => { setOpenToDatePicker(true) }}
                                                open={openToDatePicker}
                                                disabledDate={(date: Date) => (date && dateRangePicker.fromDate) && date < dateRangePicker.fromDate}

                                            />
                                        </div>                            </div>
                                    <div style={{ marginTop: 24 }} className={'md:col-span-12 justify-self-end 2xl:col-span-4 flex items-start'}>
                                        <Button type="primary" className={classesRoomRack.button}  onClick={() => {
                                            refreshDay()
                                        }}>{t("FRONTDESK.ROOMRACK.refresh")}</Button>
                                        <Button onClick={() => {
                                            nextOrPrevious7Days(false);
                                        }}>{'<<'} 7 days  </Button>
                                        <Button onClick={() => {
                                            nextOrPrevious7Days(true);
                                        }}>{'>>'} 7 days</Button>
                                        <Button disabled>
                                            <CIconSvg name="calendar" />
                                        </Button>
                                        <Button disabled>
                                            <CIconSvg name="calendar-7" />
                                        </Button>
                                        <Button style={{borderColor: "#40a4e3", backgroundColor: "white"}} >
                                            <CIconSvg name="calendar-30" />
                                        </Button>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            listDate.length > 0 && data ? <CGrantChart
                                // currentPage={currentPage}
                                // setCurrentPage={setCurrentPage}
                                setWidthOfColumns = {setWidthOfColumns}
                                widthOfColumns = {widthOfColumns}
                                listDate={listDate}
                                handleOnScrollTotal={handleOnScrollTotal}
                                setSelectDataRow={setSelectDataRow}
                                selectDataRow={selectDataRow}
                            /> : ""
                        }
                        <div className={`${classesRoomRack.footer}`}>
                            <div className='chart-row'>
                                <div className="chart-lines flex items-center chart-footer-scroll" ref={footerRef}>
                                    <div className="px-1 font-bold py-1 footerLeft"
                                        style={{
                                            minWidth: (window.innerWidth - 60) * 20 / 100
                                        }}>
                                        Unassigned
                                    </div>
                                    {roomRackFooter && roomRackFooter.length > 0 ? 
                                        <div
                                            style={{ display: 'grid', gridTemplateColumns: `repeat(${columns},${widthOfColumns}px)` }}>
                                            {listDate.map((item: string, index: number) => {
                                                return <span key={index} className="px-1 font-bold">{roomRackFooter[index].totalItem ? roomRackFooter[index].totalItemUnassign : 1}</span> 
                                            })}
                                        </div>
                                        :""}
                                </div> 
                            </div>
                            <div className='chart-row footer-row' ref={footerRef}>
                                <div className="chart-lines flex items-center chart-footer-scroll">
                                    <div className="flex justify-between px-1 font-bold py-1 footerLeft"
                                        style={{ minWidth: (window.innerWidth - 60) * 20 / 100 }}
                                    >
                                        <span style={{ border: 'none' }}>
                                            Total
                                        </span>
                                        <span style={{ border: 'none' }}>
                                            {data.length}
                                        </span>
                                    </div>
                                    {roomRackFooter && roomRackFooter.length > 0 ? 
                                        <div
                                            style={{ display: 'grid', gridTemplateColumns: `repeat(${columns},${widthOfColumns}px)` }}>
                                            {listDate.map((item: string, index: number) => {
                                                const percentAssign = ((roomRackFooter[index].totalItemAssign / data.length) * 100).toFixed(2);
                                                return <span key={index} className="px-1 font-bold">{roomRackFooter[index].totalItem ? `${percentAssign}%` : 1}</span>
                                            })}
                                        </div>
                                        :""}
                                </div>
                            </div>
                            <div className='chart-row flex items-center justify-between' style={{ padding: '0px 30px' }}>
                                <div className="checkout flex justify-between items-center p-1 font-bold rounded">
                                    Checked-Out
                                </div>
                                <div className="reservation flex justify-between items-center p-1 font-bold rounded">
                                    Reservation
                                </div>
                                <div className="stayOver flex justify-between items-center p-1 font-bold rounded">
                                    Stay Over
                                </div>
                                <div className="outOrder col-span-2 flex justify-between items-center p-1 font-bold rounded">
                                    Out of order
                                </div>
                            </div>
                        </div>
                    </CLoading>
                </div >
            </ScrollSync>
            
        </div >
    )
}
export default React.memo(RoomRack);