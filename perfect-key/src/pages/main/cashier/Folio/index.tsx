/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { DownOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Menu, Modal, notification, Pagination, Tooltip } from 'antd';
import { DefaultAmountRoomChat, DefaultFolioStat } from 'common/cashier/define-cashier';
import { FolioStat, IFEGroupFolio, DataAmountRoomChat, ITableFolio, FilterFolio, } from 'common/cashier/model-cashier';
import { IParam, IStateHistoryFolio } from 'common/cashier/model-folio';
import { listGroupFolio } from 'common/const/groupFolioDefaultValue';
import { IFormSearch } from 'common/define-booking';
import { ReservationStatus } from 'common/enum/booking.enum';
import { ChildModalCashier, ServiceHotelMaTK } from 'common/enum/cashier.enum';
import { IFixCharge, ITableLaundry } from 'common/model-hcfg';
import { dataGuest } from 'common/model-profile';
import Utils from 'common/utils';
import CDrawer from 'components/CDrawerProfile/CDrawer';
import CFormSearch from 'components/CFormSearch';
import CIconSvg from 'components/CIconSvg';
import CLoading from "components/CLoading";
import CScrollView from 'components/CScrollView';
import CButtonFrontDesk from 'components/FrontDesk/CButtonFrontDesk';
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { searchProfileIdsRequest, searchRequest, searchWithQueryParam, setFormSearchQuery } from 'redux/controller';
import { fetchVoucherNumberFolio } from 'redux/controller/cashier/folio/folio.slice';
import { bussinessDateReq } from 'redux/controller/hotelconfig.slice';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import CashierService from 'services/cashier/cashier.service';
import FolioService from 'services/cashier/folio.service';
import { useStyleTheme } from "theme";
import { styleCashier } from "../styles/styleCashier";
import FolioFooter from './folio-footer';
import { AdvanceRoomChange } from './folio-modal/AdvanceRoomChange';
import { Combine } from './folio-modal/CombineModal';
import { CorrectionModal } from './folio-modal/CorrectionModal';
import MiniBarOrLaundry from './folio-modal/MiniBarOrLaundry';
import MoveFolio from "./folio-modal/MoveModal";
import PostRoomChange from './folio-modal/PostRoomChange';
import { Rebate } from './folio-modal/Rebate';
import { ServicesModal } from './folio-modal/ServicesModal';
import { SplitModal } from './folio-modal/SplitModal';
import { SideBar } from './folio-sidebar';
import TableFolio from './TableFolio';
import { Filter } from './folio-modal/FilterModal';
import { RangePickerModal } from './folio-modal/RangePickerModal';
import { MenuInfo } from 'common/global';
import PaymentModal from './folio-modal/PaymentModal';
import search from 'services/search/search.service';
import { companyProfilesFilterByInputRequest } from 'redux/controller/reservation.slice';
import ReservationService from 'services/reservation/reservation.service.';
import PrintService from 'services/cashier/print.service';
import { FolioHistoryRequest } from 'common/const/model-folio';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';


const Folio = (): JSX.Element => {
    const dispatch = useDispatchRoot();
    const history = useHistory();
    const arrPathname = history.location.pathname.toString().split("/")
    const pathname = arrPathname[arrPathname.length - 1]
    const param: IParam = useParams()

    const { hotelName, hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const formSearchState = useSelectorRoot(state => state.booking.formSearch);
    const { loadingSearch, loadingSearchProfile, companyAgent, changeStatusProfiles } = useSelectorRoot((state) => state.booking);
    const { alertMessage } = useSelectorRoot(state => state.roomPlan);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig)

    const classes = useStyleTheme(styleCashier);
    const { t } = useTranslation('translation');
    const { control } = useForm();

    const [loadingTable, setLoadingTable] = useState<boolean>(true);
    const [visiblSideBar, setVisibleSideBar] = useState<boolean>(false);
    const [folioStat, setFolioStat] = useState<FolioStat>(DefaultFolioStat);
    const [loading, setLoading] = useState<boolean>(true);
    const [groupCode, setGroupCode] = useState<string>('');
    const [selectedFolioKey, setSelectedFolioKey] = useState<string>("1");
    const [amountAndRoomChat, setAmountAndRoomChat] = useState<DataAmountRoomChat>(DefaultAmountRoomChat);
    const [selectedRowsFolio, setSelectedRowsFolio] = useState<ITableFolio[]>([]);
    const [selectedGroupFolioGuid, setSelectedGroupFolioGuid] = useState<string>("");
    const [isApplyGroup, setIsApplyGroup] = useState<boolean>(false);
    const [isMiniBarOrLaundry, setMiniBarOrLaundry] = useState<boolean>(false);
    const [isCorrectionModal, setIsCorrectionModal] = useState<boolean>(false);
    const [isVisibleFilter, setIsVisibleFilter] = useState<boolean>(false);
    const [isSplitModal, setIsSplitModal] = useState<boolean>(false);
    const [isServiceModal, setIsServiceModal] = useState<boolean>(false);
    const [isDraft, setIsDraft] = useState<boolean>(false);
    const [isPostRoomChange, setIsPostRoomChange] = useState<boolean>(false);
    const [showModalRangePicker, setModalRangePicker] = useState<boolean>(false);
    const [isDayUseVisible, setIsDayUseVisible] = useState<boolean>(false);
    const [isAdvanceRoomChange, setIsAdvanceRoomChange] = useState<boolean>(false);
    const [isCombine, setIsCombine] = useState<boolean>(false);
    const [isRebate, setIsRebate] = useState<boolean>(false);
    const [isShowChildModal, setShowChildModal] = useState<number>(ChildModalCashier.MiniBar);
    const [serviceChargeName, setServiceChargeName] = useState<string>("");
    const [listGroupFolios, setListGroupFolio] = useState<IFEGroupFolio[]>(listGroupFolio);
    const [dataFolio, setDataFolio] = useState<ITableFolio[]>([]);
    const [dataGuestSelector, setDataGuestSelector] = useState<dataGuest[]>([]);
    const [chargeObject, setChargeObject] = useState<IFixCharge[] | null>(null)
    const [dataOutLet, setDataOutLet] = useState<ITableLaundry[] | null>(null)
    const [isShowMove, setShowMove] = useState<boolean>(false);
    const [isAllItemCombine, setIsAllItemCombine] = useState<boolean>(false);
    const [isPaymentModal, setIsPaymentModal] = useState<boolean>(false);
    const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
    const [stateHistory, setStateHistory] = useState<IStateHistoryFolio>({
        fullName: "",
        roomNumber: "",
        guestGuid: "",
        status: 0,
        parentMeGuid: "",
        idRsvn: ""
    })
    const [filter, setFilter] = useState<FilterFolio>({
        pageNumber: 1,
        pageSize: 10,
        groupFolioId: selectedGroupFolioGuid
    })
    const [totalCount, setTotalCount] = useState<number>(0);

    useEffect(() => {
        dispatch(bussinessDateReq(hotelId))
    }, [hotelId, dispatch])

    const fetchGroup = async (tsRomGuid: string) => {
        const res = await CashierService.getFolioGroup(tsRomGuid);
        if (res) {
            setListGroupFolio(res);
            getDataFolio(res.find((item) => item.guidGroupFolio === selectedGroupFolioGuid)?.guidGroupFolio ?? res[0].guidGroupFolio)
            setSelectedGroupFolioGuid(res.find((item) => item.guidGroupFolio === selectedGroupFolioGuid)?.guidGroupFolio ?? res[0].guidGroupFolio)
            setFolioStat({
                debit: res.reduce<number>((previousValue: number, curr: IFEGroupFolio) => previousValue + curr.debit, 0),
                credit: res.reduce<number>((previousValue: number, curr: IFEGroupFolio) => previousValue + curr.credit, 0),
                balance: res.reduce<number>((previousValue: number, curr: IFEGroupFolio) => previousValue + curr.balance, 0),
                deposit: 0,
                balanceOfSharedGuest: 0
            })
        }
        const result = await CashierService.getGuestProfileFolio(tsRomGuid)
        if (result)
            setDataGuestSelector(result)
        setLoading(false);
        setLoadingTable(false);
    }

    useEffect(() => {
        const stateHistory: any = history.location.state;
        if (stateHistory) {
            setStateHistory({
                fullName: stateHistory.fullName,
                roomNumber: stateHistory.roomNumber,
                guestGuid: stateHistory.guestGuid,
                status: stateHistory.status,
                parentMeGuid: stateHistory.parentMeGuid,
                idRsvn: stateHistory.idRsvn
            })
            if (stateHistory.status === ReservationStatus.CheckIn || stateHistory.status === ReservationStatus.Reservation) {
                setIsCheckOut(false)
            } else {
                setIsCheckOut(true);
            }
            fetchGroup(param.tsRoomGuid);
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: "g"
            }))
        }
    }, [history.location.state, param.tsRoomGuid])

    useEffect(() => {
        selectedGroupFolioGuid && getDataFolio(selectedGroupFolioGuid)
    }, [selectedGroupFolioGuid])

    useEffect(() => {
        dispatch(bussinessDateReq(hotelId))
        const getListOutLet = async () => {
            const getData = await FolioService.getDmucOutLet(hotelId)
            setDataOutLet(getData)
        }
        getListOutLet();
    }, [dispatch, hotelId])

    useEffect(() => {
        if (alertMessage && stateHistory.guestGuid === alertMessage.guest) {
            showConfirm()
        }
    }, [alertMessage, stateHistory])

    const getListGroupFolio = async () => {
        setLoading(true)
        const res = await CashierService.getFolioGroup(param.tsRoomGuid);
        if (res) {
            setListGroupFolio(res);
        }
        setLoading(false)
    }
    const getDataFolio = async (groupId: string, query = filter) => {
        setLoadingTable(true);
        const dataQuery = {
            groupFolioId: groupId,
            pageNumber: query.pageNumber,
            pageSize: query.pageSize,
        }
        const resFolio = await CashierService.getDataFolioByGroupId(dataQuery);
        if (resFolio) {
            const data = resFolio.dataFolio.map((dt) => { return { ...dt, ngayThang: Utils.formatDateString(dt.ngayThang), thanhTien: Utils.formatNumber(dt.thanhTien), thanhTien1: Utils.formatNumber(dt.thanhTien1) } })
            setFilter({
                ...query,
            })
            setDataFolio(data)
            setTotalCount(resFolio.resPage.TotalCount);
        }
        setLoadingTable(false);
    }

    const handleMenuMorePosting = async (e: any) => {
        setServiceChargeName(e.domEvent.target.textContent);
        dispatch(fetchVoucherNumberFolio(hotelId))

        if (Number.parseInt(e.key) === ChildModalCashier.PostFoodAndBeverage) {
            if (Auth.hasRole(Role.FB_FO)) {
                setShowChildModal(ChildModalCashier.PostFoodAndBeverage);
                const getChargeInHotel = await FolioService.filterDataFixChargeByMaTK(hotelId, ServiceHotelMaTK.FoodAndBeverage);
                setChargeObject(getChargeInHotel);
                setIsServiceModal(true);
            }
            else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }

        }
        else if (Number.parseInt(e.key) === ChildModalCashier.PostOtherService) {
            if (Auth.hasRole(Role.FO)) {
                setShowChildModal(ChildModalCashier.PostOtherService);
                const getChargeInHotel = await FolioService.filterDataFixChargeByMaTK(hotelId, ServiceHotelMaTK.OtherService);
                setChargeObject(getChargeInHotel);
                setIsServiceModal(true)
            }
            else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }
        }
    }
    const handleMenuOther = (e: any) => {
        switch (Number.parseInt(e.key)) {
        case ChildModalCashier.PostRoomChange: {
            if (Auth.hasRole(Role.FOM)) {
                setIsPostRoomChange(true)
            }
            else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }
            break;
        }
        case ChildModalCashier.AdvanceRoomChange:
            if (Auth.hasRole(Role.FO)) {
                clickAdvanceRoomCharge();
            }
            else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }
            break;
        case ChildModalCashier.DayUse:
            setIsDayUseVisible(true)
            break;
        case ChildModalCashier.Combine:
            clickCombine()
            break;
        case ChildModalCashier.CombineAll:
            clickCombineAll()
            break;
        case ChildModalCashier.Filter: {
            if (Auth.hasRole(Role.FO)) {
                setIsVisibleFilter(true);
            } else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }
            break;
        }
        case ChildModalCashier.Split: {
            if (Auth.hasRole(Role.FO)) {
                setIsSplitModal(true);
            } else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }
            break;
        }
        default:
            break;
        }
    }

    const clickMinbarOrLaundry = (child: number) => {
        if (Auth.hasRole(Role.FO_HSKP)) {
            setShowChildModal(child);
            setMiniBarOrLaundry(true);
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }
    const folioHistoryRequest = async () => {
        setLoading(true);
        setLoadingTable(true);
        const data: FolioHistoryRequest = {
            dateFrom: new Date().toISOString(),
            dateTo: new Date().toISOString(),
            guestName: stateHistory.fullName,
            room: stateHistory.roomNumber,
            tsRoomId: param.tsRoomGuid,
            groupFolioId: selectedGroupFolioGuid,
            hotelGuid: hotelId,
            //getTimezoneOffset return negative value if timezone ahead of UTC
            timezone: -new Date().getTimezoneOffset() / 60
        }
        const fileURL = await PrintService.printFolioHistoryRequest(data);
        if (fileURL) {
            window.open(fileURL);
        }
        setLoading(false);
        setLoadingTable(false);
    }
    const handlePrintOption = ({ key }: MenuInfo) => {
        switch (key) {
        case "print":
            if (Auth.hasRole(Role.FO)) {
                setIsDraft(false);
                setModalRangePicker(true);
            }
            else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }
            break;
        case "draft":
            setIsDraft(true);
            setModalRangePicker(true);
            break;
        case "rePrint":
            if (Auth.hasRole(Role.FO)) {
                setIsDraft(true);
                setModalRangePicker(true);
            }
            else {
                openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
            }
            break;
        case "folioHistory":
            folioHistoryRequest();
            break;
        default:
            break;
        }
    }
    const selectCompanyAgent = (e: string) => {
        if (hotelId) {
            dispatch(searchProfileIdsRequest({ hotelGuid: hotelId, input: e ? e : "g" }));
        }
    }

    const handleSearch = (formSearch: IFormSearch | any) => {
        if (Auth.hasRole(Role.FO_FOM_GM)) {

            dispatch(setFormSearchQuery(formSearch));
            if (pathname !== 'search') {
                history.push(`/main/booking/search`, formSearch)
            } else {
                history.push(`search`, undefined)
            }
            const data = {
                pageNumber: changeStatusProfiles ? formSearchState.pageNumber : 1,
                pageSize: formSearchState.pageSize !== 1 ? formSearchState.pageSize : 10,
                hotelGuid: hotelId,
                isOnlyMainGuest: formSearch.isOnlyMainGuest,
                arrivalDates: formSearch.dateArrival,
                departureDates: formSearch.dateDeparture,
                companyAgentGuid: formSearch.companyAgent,
                status: formSearch?.searchBy,
                rsvnCode: '',
                rsvnNo: formSearch.rsvn,
                room: formSearch.room,
                availableDate: formSearch?.availableDate,
                profiles: {
                    phone: formSearch.phone,
                    passport: formSearch.passport,
                    firstName: formSearch.firstName,
                    guestName: formSearch.guestName
                },
                roomType: formSearch.roomType,
                groupCode: formSearch.groupCode,
                listRoomType: numberOfRooms //roomType
            }
            if (!formSearch?.firstName && !formSearch?.guestName && !formSearch?.passport && !formSearch?.phone) {
                dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
            } else {
                dispatch(searchRequest(data))
            }
        }
        else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }

    const clickAdvanceRoomCharge = () => {
        Modal.confirm({
            title: "Do you want to Advance Room Charge",
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            onOk() {
                setIsAdvanceRoomChange(true)
            }
        });
    }

    const clickCombine = () => {
        Modal.confirm({
            title: "Are you sure to Combine?",
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            onOk() {
                setIsCombine(true)
                setIsAllItemCombine(false);
            }
        });
    }
    const clickCombineAll = () => {
        Modal.confirm({
            title: "Are you sure to Combine All?",
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            onOk() {
                setIsAllItemCombine(true)
                setIsApplyGroup(false)
                setIsCombine(true)
            }
        });
    }

    const handleTotalDebit = (): number => {
        return listGroupFolios.find(x => x.guidGroupFolio === selectedGroupFolioGuid)?.debit ?? 0;
    }
    const onPagination = (pageNumber: number, pageSize: number) => {
        const data: FilterFolio = {
            groupFolioId: selectedGroupFolioGuid,
            pageNumber: pageNumber,
            pageSize: pageSize

        }
        getDataFolio(selectedGroupFolioGuid, data);
    }
    function showConfirm() {
        const dateForm = alertMessage && alertMessage.dateFrom ? Utils.convertToVNTimeZoneMbyMoment(alertMessage?.dateFrom) : ""
        const dateTo = alertMessage && alertMessage.dateTo ? Utils.convertToVNTimeZoneMbyMoment(alertMessage?.dateTo) : ""
        Modal.confirm({
            title: `${alertMessage?.messageSubject}`,
            content: (
                <div>
                    <p>{dateForm} ~ {dateTo}</p>
                    <p>{alertMessage?.department}</p>
                    <p>{alertMessage?.message}</p>
                </div>
            ),
            className: "custom-modal-confirm-pkm",
            // async onOk() {
            //     alertMessage && await FrontDeskService.SeenMessageAlert(alertMessage)
            // }
        });
    }

    const checkEarlyCheckOut = async (tsRoomId: string, isCheckOutRoom: boolean) => {
        const dataTsRoom = await search.addPM(tsRoomId);
        const departureDate = new Date(dataTsRoom.departureDate);
        if (departureDate > businessDate) {
            return "Do you want to check out early ?";
        }
        return isCheckOutRoom ? "Do you want check out room ?" : "Do you want check out guest ?";
    }

    const handleCheckOutRoom = async () => {
        if (Auth.hasRole(Role.FO)) {
            const title = await checkEarlyCheckOut(param.tsRoomGuid, true);
            Modal.confirm({
                title: title,
                okText: 'Yes',
                cancelText: 'No',
                className: "custom-modal-confirm-pkm",
                async onOk() {
                    const respCheckOut = await FolioService.checkBalanceCheckOut(param.tsRoomGuid, null, stateHistory.guestGuid, true);
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
                    } else {
                        await ReservationService.checkOutRoomOrGuest(param.tsRoomGuid, true, businessDate);
                    }
                }
            });
        }
    }
    const handleCheckOutGuest = async () => {
        if (Auth.hasRole(Role.FO)) {
            const title = await checkEarlyCheckOut(param.tsRoomGuid, false);
            Modal.confirm({
                title: title,
                okText: 'Yes',
                cancelText: 'No',
                className: "custom-modal-confirm-pkm",
                async onOk() {
                    const respCheckOut = await FolioService.checkBalanceCheckOut(param.tsRoomGuid, null, stateHistory.guestGuid, false);
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
                    } else {
                        await ReservationService.checkOutRoomOrGuest(param.tsRoomGuid, false, businessDate);
                    }
                }
            });
        }
    }
    const handleRebate = () => {
        if (Auth.hasRole(Role.FO)) {
            dispatch(fetchVoucherNumberFolio(hotelId))
            setIsRebate(true)
        } else {
            openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
        }
    }
    return (
        <CLoading>
            <CDrawer
                placement='left'
                visible={visiblSideBar}
                width={"347px"}
                onClose={() => setVisibleSideBar(false)}
                content={
                    <CFormSearch className={``}
                        isLoading={loadingSearch || loading}
                        loadingSearchProfile={loadingSearchProfile}
                        companyAgent={companyAgent}
                        propsOnChange={handleSearch}
                        selectCompanyAgent={selectCompanyAgent}
                    />}

            />
            <Tooltip title={!visiblSideBar ? 'Show' : 'Hide'}>
                <div
                    onClick={() => setVisibleSideBar(!visiblSideBar)}
                    style={{ top: !visiblSideBar ? "35px" : "30px", left: !visiblSideBar ? "5px" : "30px", zIndex: 300 }}
                    className={`${classes.bgIconBack} transform ${!visiblSideBar && 'rotate-180'} z-50 flex items-center justify-center absolute cursor-pointer`}>
                    <CIconSvg className="absolute" name="back" svgSize="small" />
                </div>
            </Tooltip>
            <Helmet>
                <title> {hotelName} - Folio</title>
            </Helmet>
            <CScrollView overlayClassScroll="custom-scrollbar-pkm">
                <div className="grid grid-cols-12 p-7 pb-4">
                    <div className={`${classes.breadcrumb} col-span-3 w-full`}>
                        <span className="cursor-pointer">
                            Folio Guest: {stateHistory.fullName}
                        </span>
                    </div>
                    <div className="col-span-9">
                        <div className="flex justify-evenly">
                            <CButtonFrontDesk disabled={isCheckOut} onClick={() => clickMinbarOrLaundry(ChildModalCashier.MiniBar)}>
                                {t("CASHIER.miniBar")}
                            </CButtonFrontDesk>
                            <CButtonFrontDesk disabled={isCheckOut} onClick={() => clickMinbarOrLaundry(ChildModalCashier.Laundry)}>
                                {t("CASHIER.laundry")}
                            </CButtonFrontDesk>
                            <Dropdown disabled={isCheckOut} destroyPopupOnHide placement="bottomRight" overlayClassName={classes.dropDown} trigger={["click"]}
                                overlay={
                                    <Menu onClick={(e) => handleMenuOther(e)}>
                                        <Menu.Item disabled={stateHistory.status === ReservationStatus.CheckIn ? false : true} key="2">
                                            {t("CASHIER.FOLIO.roomCharge")}
                                        </Menu.Item>
                                        <Menu.Item key="3" disabled={stateHistory.status === ReservationStatus.CheckIn && !stateHistory.parentMeGuid ? false : true}>
                                            {t("CASHIER.FOLIO.advanceRoomCharge")}
                                        </Menu.Item>
                                        <Menu.Item key="9" disabled={selectedRowsFolio.length > 1 || isApplyGroup ? false : true}>
                                            {t("CASHIER.FOLIO.combine")}
                                        </Menu.Item>
                                        <Menu.Item key="10" disabled={dataFolio.length > 0 ? false : true}>
                                            {t("CASHIER.combineAll")}
                                        </Menu.Item>
                                        <Menu.Item key="8">
                                            {t("CASHIER.dayUse")}
                                        </Menu.Item>
                                        <Menu.Item key="11"
                                            disabled={selectedRowsFolio.length === 1 ? false : true}>
                                            {t("CASHIER.split")}
                                        </Menu.Item >
                                        <Menu.Item key="12">
                                            {t("CASHIER.filter")}
                                        </Menu.Item>
                                    </Menu>}
                            >
                                <CButtonFrontDesk>
                                    {t("CASHIER.others")}
                                </CButtonFrontDesk>
                            </Dropdown>
                            <Dropdown disabled={isCheckOut} destroyPopupOnHide placement="bottomRight" overlayClassName={classes.dropDown} trigger={["click"]}
                                overlay={
                                    <Menu onClick={(e) => handleMenuMorePosting(e)}>
                                        <Menu.Item key="4">
                                            {t("CASHIER.F&B")}
                                        </Menu.Item>
                                        <Menu.Item key="5">
                                            {t("CASHIER.otherService")}
                                        </Menu.Item>
                                    </Menu>}
                            >
                                <CButtonFrontDesk>
                                    {t("BOOKING.RESERVATION.EDITRESERVATION.moreActions")}
                                </CButtonFrontDesk>
                            </Dropdown>
                            <Dropdown disabled={isCheckOut} destroyPopupOnHide placement="bottomRight" overlayClassName={classes.dropDown} trigger={["click"]} overlay={
                                <Menu onClick={handlePrintOption}>
                                    <Menu.Item disabled={!selectedGroupFolioGuid} key="print">
                                        {t("CASHIER.FOLIO.print")}
                                    </Menu.Item>
                                    <Menu.Item disabled={!selectedGroupFolioGuid} key='draft'>
                                        {t("CASHIER.FOLIO.printDraft")}
                                    </Menu.Item>
                                    <Menu.Item key="rePrint">
                                        {t("CASHIER.FOLIO.rePrint")}
                                    </Menu.Item>
                                    <Menu.Item key="folioHistory">
                                        {t("CASHIER.FOLIO.folioHistory")}
                                    </Menu.Item>
                                </Menu>} >
                                <CButtonFrontDesk>
                                    {t("BOOKING.RESERVATION.print")} &nbsp;| <DownOutlined className='ml-2' />
                                </CButtonFrontDesk>
                            </Dropdown>

                            <CButtonFrontDesk disabled={isCheckOut}
                                onClick={() => {
                                    if (Auth.hasRole(Role.FO_FB)) {
                                        setIsPaymentModal(true)
                                    }
                                    else {
                                        openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
                                    }
                                }
                                }>
                                {t("CASHIER.payment")}
                            </CButtonFrontDesk>
                            <CButtonFrontDesk
                                onClick={() => {
                                    if (Auth.hasRole(Role.FO)) {
                                        setIsCorrectionModal(true)
                                    }
                                    else {
                                        openNotification(NotificationStatus.Error, "Get data failed !", "", 403);
                                    }
                                }}
                                disabled={selectedRowsFolio.length === 1 && !isCheckOut ? false : true}
                            >
                                {t("CASHIER.correction")}
                            </CButtonFrontDesk>
                            <CButtonFrontDesk disabled={isCheckOut} onClick={handleRebate}>
                                {t("CASHIER.FOLIO.rebate")}
                            </CButtonFrontDesk>
                            <CButtonFrontDesk onClick={() => setShowMove(true)}
                                disabled={selectedRowsFolio.length > 0 && !isCheckOut ? false : true}>
                                {t("CASHIER.move")}
                            </CButtonFrontDesk>
                            <Dropdown disabled={stateHistory.status === 1 ? false : true}
                                destroyPopupOnHide placement="bottomRight" overlayClassName={classes.dropDown} trigger={["click"]}
                                overlay={
                                    <Menu>
                                        <Menu.Item key="checkOutRoom" onClick={() => handleCheckOutRoom()}
                                            disabled={stateHistory.parentMeGuid !== null ? true : false}
                                        >
                                            {t("CASHIER.checkOutRoom")}
                                        </Menu.Item>
                                        <Menu.Item key="checkOutGuest" onClick={() => handleCheckOutGuest()}>
                                            {t("CASHIER.checkOutGuest")}
                                        </Menu.Item>
                                    </Menu>}
                            >
                                <Button className={`${classes.dropDownBtn} !text-white !rounded flex justify-center px-4 ml-3 front-desk-control`}>
                                    {t("CASHIER.checkOut")} | <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-2 mt-3 px-7">
                    <div
                        style={{ height: "calc(100vh - 370px)" }}
                        className={`col-span-2`}>
                        <SideBar
                            control={control}
                            setGroupCode={setGroupCode}
                            groupCode={groupCode}
                            info={folioStat}
                            amountRoomChat={amountAndRoomChat}
                            roomNo={stateHistory.roomNumber}
                            loading={loading}
                        />
                    </div>
                    <div className="col-span-10 ml-3">
                        <div className="px-2">
                            <Checkbox
                                className="font-bold"
                                style={{ color: "#00293B" }}
                                checked={isApplyGroup}
                                disabled={selectedRowsFolio.length === 1 ? false : true}
                                onChange={(e) => {
                                    setIsApplyGroup(e.target.checked)
                                }}
                            >
                                {t("CASHIER.FOLIO.applyForAll")}
                            </Checkbox>
                            <div className={`col-span-10 flex justify-end`} style={{ marginTop: "-1.6rem" }}>
                                <Pagination
                                    size="default"
                                    showSizeChanger
                                    current={filter.pageNumber}
                                    pageSize={filter.pageSize}
                                    pageSizeOptions={["10", "20", "50"]}
                                    total={totalCount}
                                    showTotal={total => `Total ${total} item`}
                                    onChange={(page, pageSize) => onPagination(page, pageSize ?? 10)}
                                />
                            </div>
                        </div>
                        <TableFolio
                            dataFolio={dataFolio}
                            setIsApplyGroup={setIsApplyGroup}
                            loadingTable={loadingTable}
                            setSelectedRowsFolio={setSelectedRowsFolio}
                            selectedRowsFolio={selectedRowsFolio}
                            setAmountAndRoomChat={setAmountAndRoomChat}
                        />
                    </div>
                </div>
                <FolioFooter
                    setSelectedFolioKey={setSelectedFolioKey}
                    setSelectedGroupFolioGuid={setSelectedGroupFolioGuid}
                    selectedFolioKey={selectedFolioKey}
                    listFolio={listGroupFolios}
                    loading={loading}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    isApplyGroup={isApplyGroup}
                    fetchGroup={fetchGroup}
                />
            </CScrollView>
            {isMiniBarOrLaundry &&
                <MiniBarOrLaundry
                    isMiniBarOrLaundry={isMiniBarOrLaundry}
                    setMiniBarOrLaundry={setMiniBarOrLaundry}
                    fetchGroup={fetchGroup}
                    childTable={isShowChildModal}
                    groupGuidId={selectedGroupFolioGuid}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    fullName={stateHistory.fullName}
                    roomNumber={stateHistory.roomNumber}
                    guestGuid={stateHistory.guestGuid}
                    dataGuestSelector={dataGuestSelector}

                />}
            {isPostRoomChange &&
                <PostRoomChange
                    setShowModal={setIsPostRoomChange}
                    fetchGroup={fetchGroup}
                    isShowModal={isPostRoomChange}
                    groupGuidId={selectedGroupFolioGuid}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    fullName={stateHistory.fullName}
                    roomNumber={stateHistory.roomNumber}
                    guestGuid={stateHistory.guestGuid}
                    title={t("CASHIER.postRoomCharge")}
                />
            }
            {isDayUseVisible &&
                <PostRoomChange
                    setShowModal={setIsDayUseVisible}
                    fetchGroup={fetchGroup}
                    isShowModal={isDayUseVisible}
                    groupGuidId={selectedGroupFolioGuid}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    fullName={stateHistory.fullName}
                    roomNumber={stateHistory.roomNumber}
                    guestGuid={stateHistory.guestGuid}
                    isDayUse={true}
                    title={t("CASHIER.dayUse")}
                />
            }
            {isAdvanceRoomChange && <AdvanceRoomChange
                getDataFolio={getDataFolio}
                fetchGroup={fetchGroup}
                getListGroupFolio={getListGroupFolio}
                setShowModal={setIsAdvanceRoomChange}
                isShowModal={isAdvanceRoomChange}
                tsRoomGuid={param.tsRoomGuid}
                fullName={stateHistory.fullName}
                roomNumber={stateHistory.roomNumber}
                guestGuid={stateHistory.guestGuid}
                groupGuidId={selectedGroupFolioGuid}
            />}
            {showModalRangePicker && <RangePickerModal
                printDraft={isDraft}
                getDataFolio={getDataFolio}
                getListGroupFolio={getListGroupFolio}
                setShowModal={setModalRangePicker}
                isShowModal={showModalRangePicker}
                tsRoomGuid={param.tsRoomGuid}
                fullName={stateHistory.fullName}
                roomNumber={stateHistory.roomNumber}
                guestGuid={stateHistory.guestGuid}
                groupGuidId={selectedGroupFolioGuid}
                selectedRowsFolio={dataFolio}
            />}
            {isCombine &&
                <Combine
                    fetchGroup={fetchGroup}
                    setIsCombine={setIsCombine}
                    isCombine={isCombine}
                    isApplyGroup={isApplyGroup}
                    selectedRowsFolio={selectedRowsFolio}
                    isAllItem={isAllItemCombine}
                    groupFolioId={selectedGroupFolioGuid}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    tsRoomGuid={param.tsRoomGuid}
                    indexGroupFolio={listGroupFolios.find(x => x.guidGroupFolio === selectedGroupFolioGuid)?.key ?? 1}
                />
            }
            {isRebate &&
                <Rebate
                    fetchGroup={fetchGroup}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    setShowModal={setIsRebate}
                    isShowModal={isRebate}
                    tsRoomGuid={param.tsRoomGuid}
                    fullName={stateHistory.fullName}
                    roomNumber={stateHistory.roomNumber}
                    guestGuid={stateHistory.guestGuid}
                    groupGuidId={selectedGroupFolioGuid}
                    totalFolioDebit={handleTotalDebit()}
                    indexGroupFolio={listGroupFolios.find(x => x.guidGroupFolio === selectedGroupFolioGuid)?.key ?? 1}
                />
            }
            {isServiceModal &&
                <ServicesModal
                    fetchGroup={fetchGroup}
                    setIsServiceModal={setIsServiceModal}
                    isServiceModal={isServiceModal}
                    serviceChargeName={serviceChargeName}
                    childTable={isShowChildModal}
                    chargeObjectSelect={chargeObject}
                    fullName={stateHistory.fullName}
                    roomNumber={stateHistory.roomNumber}
                    guestGuid={stateHistory.guestGuid}
                    groupGuidId={selectedGroupFolioGuid}
                    dataOutLet={dataOutLet}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                />
            }
            {isCorrectionModal &&
                <CorrectionModal
                    isCorrectionModal={isCorrectionModal}
                    setIsCorrectionModal={setIsCorrectionModal}
                    selectedRowsFolio={selectedRowsFolio}
                    groupGuidId={selectedGroupFolioGuid}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    fetchGroup={fetchGroup}
                />
            }
            {isSplitModal &&
                <SplitModal
                    isSplitModal={isSplitModal}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    groupGuidId={selectedGroupFolioGuid}
                    setIsSplitModal={setIsSplitModal}
                    selectedRowsFolio={selectedRowsFolio}
                    fetchGroup={fetchGroup}
                    indexGroupFolio={listGroupFolios.find(x => x.guidGroupFolio === selectedGroupFolioGuid)?.key ?? 1}
                />
            }
            {isShowMove &&
                <MoveFolio
                    fetchGroup={fetchGroup}
                    isShowModal={isShowMove}
                    setShowModal={setShowMove}
                    fullName={stateHistory.fullName}
                    roomNumber={stateHistory.roomNumber}
                    guestGuid={stateHistory.guestGuid}
                    idRsvn={stateHistory.idRsvn}
                    groupGuidId={selectedGroupFolioGuid}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    listFolio={listGroupFolios}
                    selectedRowsFolio={selectedRowsFolio}
                />
            }
            {isVisibleFilter &&
                <Filter
                    fetchGroup={fetchGroup}
                    isShowModal={isVisibleFilter}
                    setShowModal={setIsVisibleFilter}
                    tsRoomGuid={param.tsRoomGuid}
                    guestGuid={stateHistory.guestGuid}
                    groupGuidId={selectedGroupFolioGuid}
                    filter={filter}
                    getListGroupFolio={getListGroupFolio}
                />
            }
            {isPaymentModal &&
                <PaymentModal
                    setIsServiceModal={setIsPaymentModal}
                    fetchGroup={fetchGroup}
                    isServiceModal={isPaymentModal}
                    fullName={stateHistory.fullName}
                    roomNumber={stateHistory.roomNumber}
                    guestGuid={stateHistory.guestGuid}
                    groupGuidId={selectedGroupFolioGuid}
                    dataOutLet={dataOutLet}
                    getDataFolio={getDataFolio}
                    getListGroupFolio={getListGroupFolio}
                    balance={listGroupFolios.find(x => x.guidGroupFolio === selectedGroupFolioGuid)?.balance ?? 0}
                    indexGroupFolio={listGroupFolios.find(x => x.guidGroupFolio === selectedGroupFolioGuid)?.key ?? 1}
                />
            }
        </CLoading>
    )
}
export default React.memo(Folio);