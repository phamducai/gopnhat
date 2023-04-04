/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useStyleTheme } from 'theme';
import { styleReservation } from 'pages/main/booking/reservation/styles/reservation';
import { useHistory, useLocation } from 'react-router-dom';
import CIconSvg from 'components/CIconSvg';
import { Button, Select, Modal, Space, Tabs, Dropdown, Menu, Checkbox, notification } from 'antd';
import "./style.css";
import CLoading from 'components/CLoading';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import ShortInfo from './ShortInfo';
import { useTranslation } from 'react-i18next';
import Note from './Note';
import CardRoomPlan from './AreaRoomPlan/CardRoomPlan';
import { styleCTabsRoomPlan } from 'components/CStyleTabs';
import { styleInforRoomPlan } from './styles/index.styles';
import { styleSearchResults } from 'pages/main/booking/searchResults/styles/styleSearchResults';
import addDays from 'date-fns/addDays/index';
import Utils from 'common/utils';
import CModel from 'components/CModal';
import { setStatusGroupRSVN, addGroupMasterRequest, unsetGroupMasterRequest } from 'redux/controller/booking.slice';
import UnAssignRoom from './un-assignRoom/UnAssignRoom';
import RoomPlanService from "services/frontdesk/roomplan.service";
import PmRoom from './pmRoom/PmRoom';
import { getAllGuestAndQueryRequest, getGuestProfilesRsvnData, listStaticGuest, resetMessage, setAvaiableToNight, setListEmptyRooms } from 'redux/controller';
import { ListCardRoomPlan } from 'common/model-inventory';
import { DataFormConfirm, ListTsRoomPlan, TransactRoom } from 'common/model-booking';
import CombineRoomPlan from './modal/combineGuest';
import ModalAddReservation from 'components/CModalAddRSVN/ModalAddReservation';
import ModalAddOnGroupRsvn from 'components/CModalAddRSVN/ModalAddOnGroupRsvn';
import BreakShared from './modal/breakShared';
import { noteArray } from 'common/const/roomPlan.const';
import setStatusRSVN from 'services/booking/statusRsvn/status.service';
import search from 'services/search/search.service';
import { useEffect } from 'react';
import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import { ResGuestProfiles, SelectedGuestProfile } from 'common/define-api-booking';
import { getListDataUnAssignRoom } from 'redux/controller';
import { PaginationRoom } from 'common/model-inventory';
import { setListCardRoomPlan, setListGuestAndTsRoom, listDmucColorRequest, setQueryParamRoomPlan, setAlertMessage, setResHeaderINV } from 'redux/controller/frontdesk/roomplan.slice';
import { bussinessDateReq } from 'redux/controller/hotelconfig.slice';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import GLobalPkm from 'common/global';
import { ContextMenuRoomPlan, StatusRoomPlan } from 'common/enum/roomplan.enum';
import { AssignRoom } from 'common/model-rsvn';
import ModalAssignRoom from './modal/ModalAssignRoom';
import ModalAddRsvnToGroup from 'components/CModalAddRSVN/ModalAddRsvnToGroup';
import useWindowSize from 'hooks/useWindowSize';
import { PaginationHeaders } from 'common/front-desk/define-api-roomPlan';
import ModalInputRoomingList from 'pages/main/booking/reservation/InputRoomingList/ModalInputRoomingList';
import DatePicker from 'components/CDatePicker';
import { ExpandStatus, ReservationStatus, TypeReservaion } from 'common/enum/booking.enum';
import { DirectFrom } from './walk-in/CGuestScheduleWalkin';
import ReservationService from 'services/reservation/reservation.service.';
import ModalChangeRoom from './modal/ModalChangeRoom';
import { ResCheckInToGroup } from 'common/model-rsvn-edit';
import CModelConfirm from 'components/CModalConfirm';
import CConfirm from 'components/CConfirm';
import { IResArrivalsDepartures } from 'common/model-statistic';
import StatisticService from 'services/frontdesk/statistic.service';
import FrontDeskService from 'services/frontdesk/frontdesk.service';
import { TypeTracer } from 'common/enum/cashier.enum';
import FolioService from 'services/cashier/folio.service';
import OutOfOrderModel from './modal/OutOfOrder';
import ChangeRoomStatus from './modal/ChangeRoomStatus';
import ContextRoomPlan from './AreaRoomPlan/ContextRoomPlan';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';

const { Option } = Select;
const { TabPane } = Tabs;

const RoomPlanMain = () => {
    const classes = useStyleTheme(styleReservation);
    const classesTabs = useStyleTheme(styleCTabsRoomPlan);
    const classesRoomPlan = useStyleTheme(styleInforRoomPlan)
    const classesBtn = useStyleTheme(styleSearchResults);
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation("translation");
    const dispatch = useDispatchRoot();
    const size = useWindowSize();
    const [pageSize, setPageSize] = useState<number>(Utils.getPageSize(size));
    const [pageSizeAssign, setPageSizeAssign] = useState<number>(Utils.getPageSizeAssign(size));

    const { hotelId, hotelName } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { loading, reservationData } = useSelectorRoot(state => state.booking);
    const { roomTypePm, room } = useSelectorRoot(state => state.booking);
    const { dataTransactRoom, listGuestProfile, ListCardRoomPlan, message, listDmucColor } = useSelectorRoot(state => state.roomPlan);
    const { numberOfRooms } = useSelectorRoot(state => state.app)

    const [isVisblePM, setIsVisblePM] = useState<boolean>(false);
    const [idRsvn, setIdRsvn] = useState('')
    const [checkedGRMaster, setCheckedGRMaster] = useState<boolean>(true);

    const [toggleModalAddReservation, setToggleModalAddReservation] = useState<boolean>(false);
    const [modalInputRoomingVisible, setToggleModalInputRooming] = useState<boolean>(false);
    const [toggleModalAddOnGroupRsvn, setToggleModalAddOnGroupRsvn] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [ableButton, setAbleButton] = useState<boolean>(false);
    const [ableToUnAssign, setAbleToUnAssign] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<ListCardRoomPlan>();
    const [dataTsRoom, setDataTsRoom] = useState<ListTsRoomPlan>();
    const [dataRoom, setDataRoom] = useState<ListCardRoomPlan[]>([]);
    const [dataTable, setDataTable] = useState<ResGuestProfiles[]>([])
    const [totalItem, setTotalItem] = useState<number>(1);
    const [totalItemUnAssign, setTotalItemUnAssign] = useState<number>(1);

    const [isVisableMasterG, setIsVisableMasterG] = useState<boolean>(false);
    const [checkedComment, setCheckedComment] = useState<boolean>(true);
    const [isCheckIn, setIsCheckIn] = useState<boolean>(false);

    const [isVisbleCombine, setIsVisbleCombine] = useState<boolean>(false);
    const [isVisbleBreak, setIsVisbleBreak] = useState<boolean>(false);
    const [isVisibleAssign, setIsVisibleAssign] = useState<boolean>(false);
    const [isVisibleChange, setIsVisibleChange] = useState<boolean>(false);
    const [isVisbleAddRsvnToGroup, setIsVisbleAddRsvnToGroup] = useState<boolean>(false);
    const [listMasterTsRoom, setListMasterTsRoom] = useState<TransactRoom[]>([])
    const [applyForGroup, setApplyForGroup] = useState(false);
    const [tsRoomGuid, setTsRoomGuid] = useState<string>("");
    const [listUnAssignSelected, setListUnAssignSelected] = useState<SelectedGuestProfile[] | []>([]);
    const [isShowCancel, setShowCancel] = useState<boolean>(false);
    const [statusRoom, setStatusRoom] = useState<number>(0);
    const [isShowBlockRoom, setIsShowBlockRoom] = useState<boolean>(false);
    const [isShowChangeStatusRoom, setShowChangeStatusRoom] = useState<boolean>(false);
    // const [checkSelectAssignRoom, setCheckSelectAssignRoom] = useState(false)

    const [ableToWalkIn, setAbleToWalkIn] = useState(false);
    const filterParam = Utils.querySearchToJson(history.location.search);
    const [lstEmptyRoom, updateLstEmptyRoom] = useState<ListCardRoomPlan[]>([]);
    const [filter, setFilter] = useState({ pageNumber: 1, pageSize: pageSizeAssign })

    const [selectedDate, setSelectedDate] = useState<Date>(
        filterParam?.date ? new Date(filterParam?.date) : new Date(businessDate));
    const [roomFilter, setRoomFilter] = useState<PaginationRoom>({
        hotelGuid: hotelId,
        pageNumber: parseInt(filterParam?.pageNumber ?? 1),
        pageSize: pageSize,
        floor: parseInt(filterParam?.floor ?? -1)
    })
    const [anchorPoint, setAnchorPoint] = useState<any>({ x: 0, y: 0 });
    const [isContextRoom, setConTextRoom] = useState<boolean>(false);


    useEffect(() => {
        setAbleButton(false);
        setListMasterTsRoom([]);
        return () => {
            setAbleButton(false);
            setListMasterTsRoom([]);
        }
    }, [ListCardRoomPlan])
    useEffect(() => {
        const newPageSize = Utils.getPageSize(size);
        setPageSize(newPageSize);
        setPageSizeAssign(newPageSize);
        setRoomFilter({ ...roomFilter, pageSize: filterParam?.pageSize ?? newPageSize })
        //eslint-disable-next-line
    }, [size])

    useEffect(() => {
        message !== "" && notification.info({ message: message });
        //dispatch(updateQueryParamStatus(true));
        dispatch(resetMessage());
        dispatch(bussinessDateReq(hotelId));
    }, [dispatch, message, hotelId])

    useEffect(() => {
        listDmucColor.length === 0 && dispatch(listDmucColorRequest(true));
        dispatch(setListEmptyRooms([]));
    }, [dispatch, hotelId, listDmucColor])

    useEffect(() => {
        const arrivalDate = Utils.convertMiddleDate(businessDate)
        const departureDate = Utils.convertMiddleDate(addDays(new Date(businessDate), 1))
        const roomTypeGuid = GLobalPkm.defaultBytes32
        const loadFrontDesk = async () => { //getRoomAndGuestByDate
            const date = Utils.convertMiddleDate(businessDate)
            const response: IResArrivalsDepartures = await StatisticService.getRoomAndGuestByDate(hotelId, date);
            dispatch(listStaticGuest(response))
        }
        const getAvailableRooms = async () => { // getAvailableRooms
            const dataRooms = await RoomPlanService.getAvailableRooms(hotelId, roomTypeGuid, arrivalDate, departureDate);
            dispatch(setAvaiableToNight(dataRooms.length))
        }
        businessDate && loadFrontDesk()
        businessDate && getAvailableRooms()
    }, [hotelId, dispatch, businessDate])

    function handleChange(value: string) {
        console.log(`selected ${value}`);
    }

    const selectedRoom = (roomGuid: string, isChecked: boolean, isContextRoom = false) => {
        if (isContextRoom) {// is right click just only item checked
            const data = dataRoom.map(item =>
                item.roomGuid === roomGuid ? { ...item, isChecked: true } : { ...item, isChecked: false }
            )
            setDataRoom(data);
        } else {
            const data = dataRoom.map(item =>
                item.roomGuid === roomGuid ? { ...item, isChecked } : item
            )
            setDataRoom(data);
        }
        if (isChecked) {
            const getDataTsRoom = dataTransactRoom.find(x => x.mappingRoomId === roomGuid);
            if (getDataTsRoom) {
                let listTmp: TransactRoom[] = [];
                const selectRows = ListCardRoomPlan.find(x => x.roomGuid === roomGuid);
                const selectRow: any = { ...selectRows, roomType: getDataTsRoom.roomType }
                const masterTrRoom = getDataTsRoom.transactRoom.find(x => x.guid === selectRows?.guid);
                if (masterTrRoom) {
                    setTsRoomGuid(masterTrRoom.guid ?? "");
                    listTmp = isContextRoom ? [masterTrRoom] : [...listMasterTsRoom, masterTrRoom]
                }
                listTmp.length > 0 && setAbleToUnAssign(true);
                listTmp.find(x => x.status !== 0) && setAbleToUnAssign(false);
                listTmp.length === 1 ? setAbleButton(true) : setAbleButton(false);
                getDataTsRoom.code === StatusRoomPlan.EA ? setIsCheckIn(true) : setIsCheckIn(false);
                setListMasterTsRoom(listTmp);
                setSelectedRows(selectRow);
                setDataTsRoom(getDataTsRoom);
                setIdRsvn(getDataTsRoom.rsvnID);
                setAbleToWalkIn(false);
            }
            else {
                const selectRow = ListCardRoomPlan.find(x => x.roomGuid === roomGuid);
                // Update list empty rooms
                const lstUpdateEmptyRoom = [...lstEmptyRoom];
                selectRow && lstUpdateEmptyRoom.push({ ...selectRow });
                (lstUpdateEmptyRoom.length === 1 && listMasterTsRoom.length === 0 && Utils.compareWithoutTime(selectedDate, new Date())) ? setAbleToWalkIn(true) : setAbleToWalkIn(false);
                updateLstEmptyRoom(lstUpdateEmptyRoom);
                setAbleButton(false);
                setAbleToUnAssign(false);
                setIsCheckIn(false);
                setAbleToUnAssign(false);
                setAbleToWalkIn(true);
            }
        }
        else {
            const selectRows = ListCardRoomPlan.find(x => x.roomGuid === roomGuid);
            if (selectRows) {
                // Update list empty rooms
                const lstUpdateEmptyRoom = lstEmptyRoom.filter(item => item.roomGuid !== selectRows.roomGuid);
                updateLstEmptyRoom(lstUpdateEmptyRoom);
                const newListTmp = listMasterTsRoom.filter(x => x.guid !== selectRows.guid);
                // Update Able to Walkdin
                (lstUpdateEmptyRoom.length === 1 && newListTmp.length === 0) ? setAbleToWalkIn(true) : setAbleToWalkIn(false);
                // end update
                setListMasterTsRoom(newListTmp);
                if (newListTmp.length > 0) setAbleToUnAssign(true);
                newListTmp.find(x => x.status !== 0) && setAbleToUnAssign(false);
                if (newListTmp.length === 1) {
                    const tmp1 = ListCardRoomPlan.find(x => x.guid === newListTmp[0].guid);
                    const tmp2 = dataTransactRoom.find(x => x.mappingRoomId === tmp1?.roomGuid);
                    setSelectedRows(tmp1);
                    setDataTsRoom(tmp2);
                    setAbleButton(true);
                    setIsCheckIn(true);
                    tmp2?.code === StatusRoomPlan.EA ? setIsCheckIn(true) : setIsCheckIn(false);
                } else {
                    setAbleButton(false);
                    setIsCheckIn(false);
                    setAbleToUnAssign(false);
                }
            }
        }
    }
    const clickAddPM = async () => {
        setLoading(true);
        await ReservationService.addPmByToGroup(tsRoomGuid, idRsvn, checkedGRMaster, roomTypePm[0]?.guid);
        setIsVisblePM(false);
        setCheckedGRMaster(true);
        setLoading(false);
    }

    const clickSetGroupMaster = () => {
        if (dataTsRoom) {
            const tsrId: TransactRoom | undefined = dataTsRoom.transactRoom.find((d: TransactRoom) => d.parentMeGuid === null)
            if (tsrId) {
                const data = {
                    rSVNId: idRsvn,
                    trRoomId: tsrId.guid,
                    checkedComment: checkedComment,
                    comment: "master,"
                };
                dispatch(addGroupMasterRequest(data));
                setIsVisableMasterG(false);
            }
        }
    }

    const clickUnsetGroupMaster = () => {
        Modal.confirm({
            title: t("FRONTDESK.ROOMPLAN.doUWantToUnsetThisRsvnAsGroupMaster"),
            okText: t("FRONTDESK.ROOMPLAN.yes"),
            cancelText: t("FRONTDESK.ROOMPLAN.no"),
            className: "custom-modal-confirm-pkm",
            onOk() {
                if (dataTsRoom) {
                    const tsrId: any = dataTsRoom.transactRoom.find((d: any) => d.parentMeGuid === null)
                    const data = {
                        rSVNId: idRsvn,
                        trRoomId: tsrId.guid,
                        comment: ""
                    };
                    dispatch(unsetGroupMasterRequest(data));
                }
            }
        });
    }
    const handleUnAssign = () => {
        Modal.confirm({
            title: t("FRONTDESK.ROOMPLAN.confirmUnassignMes"),
            okText: t("FRONTDESK.ROOMPLAN.yes"),
            cancelText: t("FRONTDESK.ROOMPLAN.no"),
            className: "custom-modal-confirm-pkm",
            async onOk() {
                if (listMasterTsRoom) {
                    const tsrIds: string[] = listMasterTsRoom.map((transactRoom: any) => transactRoom.guid)
                    await RoomPlanService.unAssignRoom(tsrIds)
                    getData();
                    searchAndMapData();
                }
            }
        });
    }

    const clickCombineGuest = () => {
        if (Auth.hasRole(Role.FO)) {
            const dateArrAndDepart = [dataTsRoom?.arrivalDate, dataTsRoom?.departureDate];
            dispatch(getAllGuestAndQueryRequest({
                hotelGuid: hotelId,
                arrivalDates: dateArrAndDepart
            }));
            setIsVisbleCombine(true);
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const showModalAddReservation = () => {
        dispatch(getGuestProfilesRsvnData(dataTsRoom?.rsvnID))
        setToggleModalAddReservation(true)
    }

    const showModalAddOnGroupReservation = () => {
        dispatch(getGuestProfilesRsvnData(dataTsRoom?.rsvnID))
        setToggleModalAddOnGroupRsvn(true)
    }

    const showModalAddRsvnToGroup = () => {
        dispatch(getGuestProfilesRsvnData(dataTsRoom?.rsvnID))
        setIsVisbleAddRsvnToGroup(true)
    }
    const clickBreakShared = () => {
        if (Auth.hasRole(Role.FO)) {
            const dateArrAndDepart = [dataTsRoom?.arrivalDate, dataTsRoom?.departureDate];
            dispatch(getAllGuestAndQueryRequest({
                hotelGuid: hotelId,
                arrivalDates: dateArrAndDepart
            }));
            setIsVisbleBreak(true);
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const cancelGroupRSVN = async () => {
        const res = await search.apiSearch(idRsvn, hotelId);
        const data = setStatusRSVN.dataCancelRsvn(res, numberOfRooms);
        const IsIncludeChild = true;
        dispatch(setStatusGroupRSVN({ data, IsIncludeChild, isCheckIn: false }))
    }

    const NewWalkIn = () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            dispatch(setListEmptyRooms(lstEmptyRoom));
            history.push({
                pathname: location.pathname + '/walk-in',
                state: {
                    direct: DirectFrom.RoomPlan
                }
            })
        }
    }
    const handleCancel = (IsIncludeChild: boolean) => {
        if (Auth.hasRole(Role.FO)) {
            if (applyForGroup) {
                cancelGroupRSVN();
                searchAndMapData();
            } else {
                const isCheckin = (!IsIncludeChild && statusRoom === ReservationStatus.CheckIn) ? true : false;
                if (statusRoom === ExpandStatus.Wakin) {
                    const listDataWarking: TransactRoom[] = [];
                    listMasterTsRoom.forEach((item: TransactRoom) => {
                        listDataWarking.push({
                            ...item,
                            status: ExpandStatus.Wakin
                        })
                    })
                    const data = setStatusRSVN.dataCancelRsvn(listDataWarking, numberOfRooms);
                    dispatch(setStatusGroupRSVN({ data, IsIncludeChild, isCheckin: false }));
                } else {
                    const data = setStatusRSVN.dataCancelRsvn(listMasterTsRoom, numberOfRooms);
                    dispatch(setStatusGroupRSVN({ data, IsIncludeChild, isCheckin: isCheckin }));
                }
            }
            searchAndMapData();
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }
    const cancelRsvn = () => {
        const data = setStatusRSVN.dataCancelRsvn(listMasterTsRoom, numberOfRooms);
        console.log(data);
        if (dataTsRoom?.transactRoom[0].flagType === TypeReservaion.ReservationWalkin) {
            setStatusRoom(ExpandStatus.Wakin);
        }
        else {
            if (dataTsRoom?.status === ReservationStatus.CheckIn) {
                setStatusRoom(ReservationStatus.CheckIn);
            } else {
                setStatusRoom(ReservationStatus.Reservation);
            }
        }
        setShowCancel(true);
    }
    const handleCheckIn = async () => {
        if (Auth.hasRole(Role.FO)) {
            const mapParam = RoomPlanService.mapDataParamCheckin(listMasterTsRoom, dataTransactRoom, ListCardRoomPlan);
            if (mapParam.roomDirty.length > 0) {
                Modal.confirm({
                    title: `Room ${mapParam.roomDirty.join(", ")} is dirty! Do you want check in continue ?`,
                    okText: t("FRONTDESK.ROOMPLAN.yes"),
                    cancelText: t("FRONTDESK.ROOMPLAN.no"),
                    className: "custom-modal-confirm-pkm",
                    async onOk() {
                        const res = await FrontDeskService.getMessageAlert(tsRoomGuid, TypeTracer.AlertCheckIn, hotelId)
                        if (typeof res !== "string") {
                            res && dispatch(setAlertMessage(res))
                        }
                        history.push(`/main/front-desk/check-in/${mapParam.listParamCheckin[0].mainTsRoom}`,
                            { listParamCheckin: mapParam.listParamCheckin, isFirst: true, isMain: true });
                    }
                });
            } else {
                const res = await FrontDeskService.getMessageAlert(tsRoomGuid, TypeTracer.AlertCheckIn, hotelId)
                if (typeof res !== "string") {
                    res && dispatch(setAlertMessage(res))
                }
                history.push(`/main/front-desk/check-in/${mapParam.listParamCheckin[0].mainTsRoom}`,
                    { listParamCheckin: mapParam.listParamCheckin, isFirst: true, isMain: true });
            }
            const filterParamIndex = {
                pageNumber: roomFilter.pageNumber,
                floor: roomFilter.floor,
                index: filterParam?.index ?? -1,
                date: Utils.formatDateCallApi(selectedDate)
            }
            const queryString = Utils.querySearchToString(filterParamIndex);
            dispatch(setQueryParamRoomPlan(`?${queryString}`))
        }
    }
    const handleCheckInGroup = () => {
        if (Auth.hasRole(Role.FO)) {
            Modal.confirm({
                title: "Do you want check in group?",
                okText: t("FRONTDESK.ROOMPLAN.yes"),
                cancelText: t("FRONTDESK.ROOMPLAN.no"),
                className: "custom-modal-confirm-pkm",
                async onOk() {
                    console.log(Utils.formatDateByUTC(businessDate).toString());
                    const res = await ReservationService.checkInToGroup(idRsvn, Utils.formatDateByUTC(businessDate)) as ResCheckInToGroup;
                    if (res) {
                        if (res.result) {
                            notification.success({
                                message: <b style={{ color: "#00293B" }}>Check in group success !</b>,
                                style: { borderRadius: 6 },
                                description:
                                    <div>
                                        <span>Date: {Utils.formatDateVN(new Date(res.arrivalDate))} ~ {Utils.formatDateVN(new Date(res.departureDate))}</span>
                                        <br />
                                        <span>Group Code: {selectedRows?.groupCode.toString() ?? ""}</span>
                                        <br />
                                        <span>Total Room: {res.listRoomName.length}</span>
                                        <br />
                                        <span>Total Guest: {res.totalGuest}</span>
                                        <br />
                                        <span>Check in time: {Utils.convertToVNTimeZoneMbyMoment(res.arrival)}</span>
                                    </div>
                            })
                        } else {
                            notification.error({
                                message: <b style={{ color: "#00293B" }}>Check in failed !</b>,
                                style: { borderRadius: 6 },
                                description:
                                    <div>
                                        <span>{`This room ${res.listRoomName.join(",")} is already occupied !`}</span>
                                    </div>
                            })
                        }
                    }
                    searchAndMapData();
                }
            });
        }
    }

    const handleEdit = async () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            const rsvnNo = dataTsRoom?.reservation.id ?? "0";
            const status = RoomPlanService.updateStatus(dataTsRoom?.status ?? 0);
            const roomGuid = dataTsRoom?.mappingRoomId ?? GLobalPkm.defaultBytes32;
            history.push(`/main/booking/edit-rsvn/${tsRoomGuid}?isMain=true`, { roomGuid, rsvnNo, status })
        }
    }

    const getData = async () => {
        const data: { table: ResGuestProfiles[]; pagination: PaginationHeaders } = await RoomPlanService.getDataUnAssignRoom(selectedDate, hotelId, room, filter)
        data && setDataTable(data.table)
        setTotalItemUnAssign(data.pagination.TotalCount)
        dispatch(getListDataUnAssignRoom(data.table));
    }

    const handleSelectedDate = (date: any) => {
        setSelectedDate(date);
        const filterParamIndex = {
            pageNumber: roomFilter.pageNumber,
            floor: roomFilter.floor,
            index: filterParam?.index ?? -1,
            date: Utils.formatDateCallApi(new Date(date))
        }
        const queryString = Utils.querySearchToString(filterParamIndex);
        history.push(`${history.location.pathname}?${queryString}`)
    }
    const searchAndMapData = async () => {
        setLoading(true);
        const res = await RoomPlanService.getDataListRoom(roomFilter, numberOfRooms, hotelId, hotelName, selectedDate, listDmucColor);
        if (res) {
            dispatch(setListCardRoomPlan(res.listCardRoomPlan));
            setDataRoom(res.listCardRoomPlan);
            setTotalItem(res.resPagination.TotalCount);
            setLoading(false);
            setAbleButton(false);
            dispatch(setListGuestAndTsRoom({
                dataTransactRoom: res.dataTransactRoom,
                listGuestProfile: res.listGuestProfile
            }));
            dispatch(setResHeaderINV(res.resHeaderInv))
        }
    }

    const onDragEnd = async (cardRoomPlanItem: ListCardRoomPlan, transactionCardRoom: ResGuestProfiles) => {
        const assign3: AssignRoom = {
            trsGuid: transactionCardRoom ? transactionCardRoom?.mainGuest : "",
            roomGuid: cardRoomPlanItem?.roomGuid,
            roomName: cardRoomPlanItem?.roomNumber.toString(),
            roomType: cardRoomPlanItem?.roomType
        }
        if (cardRoomPlanItem.guid !== "") {
            openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), t("FRONTDESK.ROOMPLAN.roomExist"))
        }
        else if (transactionCardRoom?.mainGuest !== "") {
            if (transactionCardRoom?.roomType === cardRoomPlanItem.roomType) {
                if (cardRoomPlanItem.cleanDirty === 1) {
                    if (transactionCardRoom?.mainGuest) {
                        try {
                            const res = await RoomPlanService.assignRoom([assign3]);
                            if (res.result) {
                                await getData()
                                await searchAndMapData();
                                openNotification(NotificationStatus.Success, t("FRONTDESK.ROOMPLAN.success"), t("FRONTDESK.ROOMPLAN.AssignSuccess"))
                            }
                        } catch (error) {
                            openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), "")
                        }
                    }
                } else if (cardRoomPlanItem.tinhTrang === 4 && cardRoomPlanItem.cleanDirty === 0) {
                    const title = t("FRONTDESK.ROOMPLAN.assignDirtyAndOOS")
                    showConfirm(assign3, title, transactionCardRoom)
                } else if (cardRoomPlanItem.tinhTrang === 4) {
                    const title = t("FRONTDESK.ROOMPLAN.assignOOSRoom")
                    showConfirm(assign3, title, transactionCardRoom)
                } else {
                    const title = t("FRONTDESK.ROOMPLAN.assignDirtyRoom")
                    showConfirm(assign3, title, transactionCardRoom)
                }
            } else {
                const title = `${t("FRONTDESK.ROOMPLAN.wantToChange")} ${transactionCardRoom?.roomName} ${t("FRONTDESK.ROOMPLAN.roomTo")} ${cardRoomPlanItem?.roomName} ${t("FRONTDESK.ROOMPLAN.fromRoom")}`
                showConfirm(assign3, title, transactionCardRoom)
            }
        } else
            openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), t("FRONTDESK.ROOMPLAN.errorEmptyRoom"))

        const el = document.querySelector('.ghost');
        el && el.remove(); // Removes the div with the 'div-02' id
    };

    const dropRoomUnAssign = async (TRSRoom: string[]) => {
        if (TRSRoom) {
            await RoomPlanService.unAssignRoom(TRSRoom)
            openNotification(NotificationStatus.Success, t("FRONTDESK.ROOMPLAN.success"), t("FRONTDESK.ROOMPLAN.unAssignRoomSuccess"))
        } else {
            openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), t("FRONTDESK.ROOMPLAN.errorEmptyRoom"))
        }
        getData()
        searchAndMapData();
    }

    const showConfirm = (assign: AssignRoom, title: string, transactionCardRoom: ResGuestProfiles) => {
        Modal.confirm({
            title: title,
            className: "custom-modal-confirm-pkm",
            async onOk() {
                if (transactionCardRoom?.mainGuest) {
                    try {
                        const res = await RoomPlanService.assignRoom([assign]);
                        if (res.result) {
                            openNotification(NotificationStatus.Success, t("FRONTDESK.ROOMPLAN.success"), t("FRONTDESK.ROOMPLAN.AssignSuccess"))
                            getData()
                            searchAndMapData();
                        }
                    } catch (error) {
                        openNotification(NotificationStatus.Error, t("FRONTDESK.ROOMPLAN.error"), "")
                    }
                }
            }
        });
    }
    const clickEditGroupInHouse = () => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {
            const rsvnNo = dataTsRoom?.reservation.id ?? "0";
            const status = RoomPlanService.updateStatus(dataTsRoom?.status ?? 0);
            const roomGuid = dataTsRoom?.mappingRoomId ?? GLobalPkm.defaultBytes32;
            history.push(`/main/front-desk/edit-group-inhouse/${tsRoomGuid}`, { roomGuid, rsvnNo, status })
        }
    }

    const handleClickFolio = async () => {
        const fullName = selectedRows?.fullNameGuestMain;
        const roomNumber = selectedRows?.roomNumber;
        const guestGuid = selectedRows?.guestGuid
        const res = await FrontDeskService.getMessageAlert(tsRoomGuid, TypeTracer.AlertCheckOut, hotelId)
        if (typeof res !== "string") {
            res && dispatch(setAlertMessage(res))
        }
        history.push(`/main/cashier/folio/${tsRoomGuid}`,
            {
                fullName, tsRomGuid: tsRoomGuid, roomNumber: roomNumber,
                guestGuid: guestGuid, status: selectedRows?.status,
                parentMeGuid: null, idRsvn: idRsvn
            }
        )
    }
    const handleCheckOutGroup = async () => {
        if (Auth.hasRole(Role.FO)) {
            const departureDate = new Date(dataTsRoom?.departureDate ?? "")
            Modal.confirm({
                title: departureDate > businessDate ? "Do you want to check out early ?" : "Do you want check out this group ? ",
                className: "custom-modal-confirm-pkm",
                async onOk() {
                    const respCheckOut = await FolioService.checkBalanceCheckOut("", idRsvn, "", false);
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
                        await ReservationService.checkOutToGroup(idRsvn, businessDate);
                        searchAndMapData();
                    }
                }
            });
        }
    }
    const handleContextMenu = (type: number) => {
        switch (type) {
        case ContextMenuRoomPlan.Folio: handleClickFolio(); break;
        case ContextMenuRoomPlan.CheckIn: handleCheckIn(); break;
        case ContextMenuRoomPlan.GroupCheckIn: handleCheckInGroup(); break;
        case ContextMenuRoomPlan.GroupCheckOut: handleCheckOutGroup(); break;
        default:
            break;
        }
    }
    const renderMenuItem = (
        <Menu className={`${classesRoomPlan.styleDropdown} custom-scrollbar-pkm`}>
            {size === "xl" ?
                <>
                    <Menu.Item key="rp-12">
                        <Button disabled={!ableButton} onClick={handleClickFolio} className={`${classes.styleBtn} mb-1 ml-1`} style={{ width: '100%' }}>{t("FRONTDESK.ROOMPLAN.folio")}</Button>
                    </Menu.Item>
                    <Menu.Item key="rp-14">
                        <Button disabled={(ableButton && selectedRows?.status === 1) ? false : true} onClick={handleCheckOutGroup} className={`${classes.styleBtn} mb-1 ml-1`} style={{ width: '100%' }}>{t("FRONTDESK.ROOMPLAN.groupCO")}</Button>
                    </Menu.Item>
                </> : ""}
            <Menu.Item key="rp-0">
                <Button disabled={!ableButton}
                    className={`${classes.styleBtn} ${classes.btnDanger} mb-1 ml-1 w-full`}
                    onClick={cancelRsvn}>
                    {t("BOOKING.SEARCHVALUE.cancel")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-1">
                <Button disabled={selectedRows?.status === 1 ? false : true} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={clickBreakShared}
                >
                    {t("FRONTDESK.ROOMPLAN.break")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-2">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={clickCombineGuest}
                >
                    {t("FRONTDESK.ROOMPLAN.combine")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-3">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={showModalAddReservation}
                >
                    {t("BOOKING.SEARCHVALUE.addOnRsvn")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-4">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={showModalAddOnGroupReservation}
                >
                    {t("BOOKING.SEARCHVALUE.addOnGroupRsvn")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-5">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={() => setIsVisblePM(true)}>
                    {t("FRONTDESK.ROOMPLAN.addPm")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-6">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${clsx(classes.styleBtn, classes.btnDanger)} mb-1 ml-1`}
                    onClick={clickUnsetGroupMaster}>
                    {t("FRONTDESK.ROOMPLAN.unsetGroupMaster")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-7">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={() => setIsVisableMasterG(true)}>
                    {t("FRONTDESK.ROOMPLAN.setGroupMaster")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-8">
                <Button disabled={!ableToUnAssign} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={handleUnAssign}>
                    {t("FRONTDESK.ROOMPLAN.unAssign")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-9">
                <Button disabled={listUnAssignSelected.length === 0} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={() => {
                        if (Auth.hasRole(Role.FO)) {
                            setIsVisibleAssign(true)
                        }
                        else {
                            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
                        }
                    }}>
                    {t("FRONTDESK.ROOMPLAN.assign")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-10">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={showModalAddRsvnToGroup}>
                    {t("BOOKING.SEARCHVALUE.addRsvnToGroup")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-11">
                <Button disabled={!ableButton} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={() => setToggleModalInputRooming(true)}>
                    {t("BOOKING.SEARCHVALUE.inputRoomingList")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-12">
                <Button disabled={selectedRoom.length > 0 ? false : true} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={() => setIsShowBlockRoom(true)}>
                    {t("BOOKING.SEARCHVALUE.houseKeeping")}
                </Button>
            </Menu.Item>
            <Menu.Item key="rp-14">
                <Button disabled={selectedRoom.length > 0 ? false : true} style={{ width: '100%' }} className={`${classes.styleBtn} mb-1 ml-1`}
                    onClick={() => {
                        if (Auth.hasRole(Role.HSKP)) {
                            setShowChangeStatusRoom(true);
                        }
                        else {
                            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
                        }
                    }}>
                    {t("BOOKING.SEARCHVALUE.changeRoomStatus")}
                </Button>
            </Menu.Item>
        </Menu>
    )

    const menu = (
        <Menu className={`${classes.menuBtn}`}>
            <Menu.Item key="1" className={`${classes.menuItem}`}>
                <Button disabled={!ableButton} type='link'
                    onClick={() => setIsVisibleChange(true)}>
                    Change Room
                </Button>
            </Menu.Item>
            <Menu.Item key="12" className={`${classes.menuItem}`}>
                <Button type='link' disabled={selectedRows?.status === 1 ? false : true} onClick={clickEditGroupInHouse}>
                    Edit Group InHouse
                </Button>
            </Menu.Item>
        </Menu>
    )
    const handleContextRoomPlan = (event: MouseEvent, roomGuid: string) => {
        setConTextRoom(true);
        const element = document.getElementById("el-context-roomp-id");
        const tmp = element?.getBoundingClientRect();
        const heightContext = 450;
        let x = 0;
        let y = 0
        if (tmp) {
            x = (tmp.width - event.pageX - tmp.x) < heightContext ? event.pageX - tmp.x - 300 : event.pageX - tmp.x;
            y = (window.screen.height - event.pageY) < heightContext ? event.pageY - heightContext : event.pageY - tmp.y - 50;
            setAnchorPoint({ x: x, y: y });
        }
        if (!isContextRoom) {
            document.addEventListener(`click`, function onClickOutside(e) {
                setConTextRoom(false)
                selectedRoom(roomGuid, false);
                document.removeEventListener(`click`, onClickOutside)
            })
        }
        selectedRoom(roomGuid, true, true);
        event.preventDefault()
    }
    return (
        <CLoading visible={loading}>
            <Helmet>
                <title>{hotelName} - Room plan</title>
            </Helmet>
            <div id="el-context-roomp-id" className={`${classes.main} custom-scrollbar-pkm relative`} style={{ height: "calc( 100vh - 64px)", color: "#00293B" }}>
                <div className={`grid xl:grid-cols-12 gap-2 mt-4`}>
                    <div className={`xl:col-span-4 col-span-6`}>
                        <div className={` flex flex-wrap items-center justify-start`}>
                            <div className={`${classes.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`} onClick={() => {
                                history.push('/main/front-desk');
                            }}>
                                <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                            </div>
                            <label className="m-0 text-base font-bold ml-3">{t("FRONTDESK.ROOMPLAN.roomPlan")}
                                <br />
                                <div className="flex" style={{ fontSize: 13, color: "#666666" }}>
                                    <label className="m-0">{t("FRONTDESK.ROOMPLAN.businessDate")}: {Utils.formatDateVN(new Date(businessDate))}</label>
                                    <label className="ml-1 mr-1">~</label>
                                    <label className="ml-1 mr-1">{t("FRONTDESK.ROOMPLAN.selectedDate")}:</label>
                                    <DatePicker
                                        className={`${classesRoomPlan.customSelectDate} m-0`}
                                        //disabledDate={(value: Date) => new Date(value) < arrivalDateFrom}
                                        defaultValue={selectedDate}
                                        allowClear={false}
                                        bordered={false}
                                        onChange={(date: any) => {
                                            handleSelectedDate(date);
                                        }}
                                        format="DD/MM/YYYY"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="2xl:col-span-3 xl:col-span-4 col-span-6">
                        <div className='grid grid-cols-12 gap-2'>
                            <div className='2xl:col-span-5 xl:col-span-5 col-span-6 mt-2 text-center'>
                                <label>{t("FRONTDESK.ROOMPLAN.view")}: </label>
                                <Button style={{ borderRadius: '40px', background: 'none' }} className={`${classes.viewBtn} mr-1`} icon={<CIconSvg name="grid" colorSvg="origin" svgSize="medium" />} />
                                <Button style={{ borderRadius: '40px', background: 'none' }} className={`${classes.viewBtn}`} icon={<CIconSvg name="layers" colorSvg="origin" svgSize="medium" />} />
                            </div>
                            <div className='2xl:col-span-7 xl:col-span-7 col-span-6'>
                                <Select className={`room-plan-select w-full h-12`} defaultValue="a" onChange={handleChange}>
                                    <Option className="customer-op-building" value="a">
                                        <CIconSvg className='mr-1 inline-flex' name="home" colorSvg="origin" svgSize="medium" />{t("FRONTDESK.ROOMPLAN.building")} A
                                    </Option>
                                    <Option className="customer-op-building" value="b"><CIconSvg className='mr-1 inline-flex' name="home" colorSvg="origin" svgSize="medium" />{t("FRONTDESK.ROOMPLAN.building")} B</Option>
                                    <Option className="customer-op-building" value="c"><CIconSvg className='mr-1 inline-flex' name="home" colorSvg="origin" svgSize="medium" />{t("FRONTDESK.ROOMPLAN.building")} C</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className={`2xl:col-span-5 xl:col-span-4 col-span-12 flex justify-end items-end`}>
                        <div className="">
                            <Button disabled={!ableButton} className={`${classesRoomPlan.styleBtn} mb-1 ml-1`} type="primary" onClick={handleEdit} style={{ color: ableButton ? "white" : "#1A87D7" }}>Edit</Button>
                            <Dropdown overlay={menu} disabled={!ableButton} trigger={['click']}>
                                <Button className={`${classes.styleBtn} mb-1 ml-1`}>
                                    {t("FRONTDESK.ROOMPLAN.groupIH")}
                                </Button>
                            </Dropdown>
                            <Button disabled={!ableToWalkIn} onClick={NewWalkIn} className={`${classes.styleBtn}  mb-1 ml-1`}>{t("FRONTDESK.ROOMPLAN.walkIn")}</Button>
                            <Button disabled={!isCheckIn} onClick={handleCheckIn} className={`${classes.styleBtn} mb-1 ml-1`}>{t("FRONTDESK.ROOMPLAN.checkin")}</Button>
                            <Button disabled={ableButton && isCheckIn ? false : true} onClick={handleCheckInGroup} className={`${classes.styleBtn} mb-1 ml-1`}>{t("FRONTDESK.ROOMPLAN.groupCI")}</Button>
                            {size !== "xl" ?
                                <>
                                    <Button disabled={!ableButton} className={`${classes.styleBtn} mb-1 ml-1`} onClick={handleClickFolio}>{t("FRONTDESK.ROOMPLAN.folio")}</Button>
                                    <Button disabled={(ableButton && selectedRows?.status === 1) ? false : true} onClick={handleCheckOutGroup} className={`${classes.styleBtn} mb-1 ml-1`}>{t("FRONTDESK.ROOMPLAN.groupCO")}</Button>
                                </> : ""}
                            <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomRight" >
                                <Button className={`${classesBtn.styleBtn} mb-1 ml-1`}>...</Button>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                {/* md:w-11/12 xl:w-full */}
                <section className='room-plan grid grid-cols-12 col-span-12 pt-4 gap-2'>
                    <CardRoomPlan
                        className={`2xl:col-span-9 xl:col-span-9 col-span-12 mb-2`}
                        selectedDate={selectedDate}
                        selectedRoom={selectedRoom}
                        setApplyForGroup={setApplyForGroup}
                        ableButton={ableButton}
                        searchAndMapData={searchAndMapData}
                        roomFilter={roomFilter}
                        setRoomFilter={setRoomFilter}
                        getData={getData}
                        dataRoom={dataRoom}
                        totalItem={totalItem}
                        isLoading={isLoading}
                        setLoading={setLoading}
                        onDragEnd={onDragEnd}
                        onDropRoomUnAssign={dropRoomUnAssign}
                        indexFloor={parseInt(filterParam?.index ?? -1)}
                        setSelectedDate={setSelectedDate}
                        handleContextMenu={handleContextMenu}
                        handleContextRoomPlan={handleContextRoomPlan}
                    />
                    <div className='2xl:col-span-3 xl:col-span-3 col-span-12'>
                        <Tabs className={`${classesTabs.customTabs} flex justify-start h-full`} defaultActiveKey="1">
                            <TabPane tab="UnAssign Rooms" key="assign-rooms-key">
                                <UnAssignRoom
                                    getData={getData} filter={filter}
                                    setFilter={setFilter} dataTable={dataTable}
                                    selectedDate={selectedDate}
                                    setListSelected={setListUnAssignSelected}
                                    totalItem={totalItemUnAssign}
                                />
                            </TabPane>
                            <TabPane tab="PM Rooms" key="pm-rooms-key">
                                <PmRoom selectedDate={selectedDate} />
                            </TabPane>
                        </Tabs>
                    </div>
                </section>
                <section className='room-plan-footer'>
                    <div className='mt-2'><ShortInfo /></div>
                    <div className='my-2'>
                        <Space className={`${classesRoomPlan.inforRoomPlan}`}>
                            {
                                noteArray.map(note =>
                                    <Note key={note.short} short={note.short} info={note.info} />
                                )
                            }
                        </Space>
                    </div>
                </section>
                {isContextRoom &&
                    <ContextRoomPlan
                        anchorPoint={anchorPoint}
                        className={isContextRoom ? 'show-context-room' : ""}
                        handleContextMenu={handleContextMenu}
                        ableButton={!ableButton}
                        isCheckIn={!isCheckIn}
                        isCheckOut={(ableButton && selectedRows?.status === 1) ? false : true}
                        dataRoom={dataRoom.find(x => x.isChecked)}
                        searchAndMapData={searchAndMapData}
                    />}
            </div>
            {isVisbleCombine ?
                <CombineRoomPlan
                    ableCombine={ableButton}
                    selectedRows={selectedRows}
                    isVisbleCombine={isVisbleCombine}
                    setIsVisbleCombine={setIsVisbleCombine}
                    dataTsRoom={dataTsRoom}
                />
                : ""}
            <ModalAddReservation
                modalAdd={toggleModalAddReservation}
                setToggleModalAddReservation={setToggleModalAddReservation}
                selectedRows={selectedRows}
                reservationData={reservationData}
            />
            {toggleModalAddOnGroupRsvn ? <ModalAddOnGroupRsvn
                modalAdd={toggleModalAddOnGroupRsvn}
                setToggleModalAddOnGroupRsvn={setToggleModalAddOnGroupRsvn}
                reservationData={reservationData}
                selectedRows={selectedRows}
            /> : ""}
            {isVisbleBreak ?
                <BreakShared
                    ableBreakShared={ableButton}
                    selectedRows={selectedRows}
                    isVisbleBreak={isVisbleBreak}
                    setIsVisbleBreak={setIsVisbleBreak}
                    dataTsRoom={dataTsRoom}
                    listGuestProfile={listGuestProfile}
                />
                : ""
            }
            {isVisblePM ?
                <CModel
                    title={t("FRONTDESK.ROOMPLAN.addPm")}
                    visible={isVisblePM}
                    onOk={clickAddPM}
                    isLoading={isLoading}
                    onCancel={() => setIsVisblePM(false)}
                    content={
                        <Checkbox
                            defaultChecked={checkedGRMaster}
                            style={{ fontSize: 16, color: "#00293B" }}
                            checked={checkedGRMaster}
                            className="font-semibold"
                            onChange={(e) => setCheckedGRMaster(e.target.checked)}
                        >
                            {t("FRONTDESK.ROOMPLAN.doUWantSetGroupMasterForPm")}
                        </Checkbox>
                    }
                />
                : ""}
            {isVisableMasterG ?
                <CModel
                    title={t("FRONTDESK.ROOMPLAN.setGroupMaster")}
                    visible={isVisableMasterG}
                    onOk={clickSetGroupMaster}
                    onCancel={() => setIsVisableMasterG(false)}
                    content={
                        <Checkbox
                            defaultChecked={checkedGRMaster}
                            style={{ fontSize: 16, color: "#00293B" }}
                            checked={checkedComment}
                            className="font-semibold"
                            onChange={(e) => setCheckedComment(e.target.checked)}
                        >
                            {t("FRONTDESK.ROOMPLAN.doUWantAddCmtForTheRsvn")}
                        </Checkbox>
                    }
                /> : ""
            }
            {isVisibleAssign &&
                <ModalAssignRoom
                    searchAndMapData={searchAndMapData}
                    isInRoomPlan
                    getData={getData} dataSelected={listUnAssignSelected}
                    isVisible={isVisibleAssign} setIsVisble={setIsVisibleAssign}
                />
            }
            {isVisibleChange &&
                <ModalChangeRoom
                    searchAndMapData={searchAndMapData}
                    getData={getData} dataSelected={[selectedRows]}
                    isVisible={isVisibleChange} setIsVisble={setIsVisibleChange}

                />
            }
            {idRsvn !== "" && modalInputRoomingVisible &&
                <ModalInputRoomingList
                    getInHouse={true}
                    modalInputRoomingVisible={modalInputRoomingVisible}
                    toggleModalInputRooming={setToggleModalInputRooming}
                    rsvnId={idRsvn}
                />
            }
            <ModalAddRsvnToGroup
                visible={isVisbleAddRsvnToGroup}
                setVisible={setIsVisbleAddRsvnToGroup}
                reservationData={reservationData}
                selectedRow={selectedRows}
                getData={getData}
            />
            <CModelConfirm
                title={t(setStatusRSVN.mapTitleTranslation(statusRoom))}
                visible={isShowCancel}
                onCancel={() => setShowCancel(false)}
                myForm="form-apply-group"
                width={400}
                content={
                    <CConfirm
                        title={t("COMMON.apply_for_shared_guest")}
                        idForm="form-apply-group"
                        defaultValue={true}
                        status={statusRoom}
                        propsGetData={(data: DataFormConfirm) => {
                            handleCancel(data.isChild)
                            setShowCancel(false)
                        }}
                    />
                }
            />
            {isShowBlockRoom &&
                <OutOfOrderModel
                    isShowModal={isShowBlockRoom}
                    setShowModal={setIsShowBlockRoom}
                    dataRoom={dataRoom.find(x => x.isChecked)}
                    searchAndMapData={searchAndMapData}
                />
            }
            {isShowChangeStatusRoom &&
                <ChangeRoomStatus
                    isVisible={isShowChangeStatusRoom}
                    setIsVisble={setShowChangeStatusRoom}
                    dataRoom={dataRoom.find(x => x.isChecked)}
                    searchAndMapData={searchAndMapData}
                />
            }
        </CLoading >
    );
}

export default React.memo(RoomPlanMain);