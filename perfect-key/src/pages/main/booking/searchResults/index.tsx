/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/*eslint indent: ["warn", 4, { "SwitchCase": 1 }]*/
import { Button, Checkbox, Modal, Pagination, notification, Dropdown, Menu } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
    guestProfileInBookingRSVN, selectProfile,
    getAllGuestAndQueryRequest,
    updateCombineGuestRequest, getGuestProfilesRsvnData,
    cancelPmRequest, searchWithQueryParam,
    addGroupMasterRequest, unsetGroupMasterRequest, setStatusGroupRSVN, updateQueryParamStatus, setRoomTypeLoadPage
} from 'redux/controller/booking.slice';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { themeValue, useStyleTheme } from "theme/Theme";
import TableSearchResults from './TableSearchResults';
import CIconSvg from 'components/CIconSvg';
import { getBookingByRsvnId, setNoShowRSVN, setDataFoextraCharge } from 'redux/controller/reservation.slice';
import CombineGuest from './CombineGuest'
import CModel from 'components/CModal';
import ModelAddShared from './ModelAddShared';
import { styleSearchResults } from './styles/styleSearchResults';
import GroupMasterService from 'services/search/groupmaster.service';
import { DataFormConfirm, ISearchResult } from 'common/model-booking';
import { ExpandStatus, ReservationStatus } from 'common/enum/booking.enum';
import ModalReinstateRSVN from './ModalReinstateRSVN';
import search from 'services/search/search.service'
import ModalAddReservation from 'components/CModalAddRSVN/ModalAddReservation';
import ModalEditGuestProfile from 'components/CModalEditProfiles/CModalEditGuestProfile'
import ModalEditCompanyProfile from 'components/CModalEditProfiles/CModalEditCompanyProfile'
import ModalMergeGuests from 'components/CModalEditProfiles/CModalMergeGuests'
import ModalMergeCompanies from 'components/CModalEditProfiles/CModalMergeCompanies'
import ModalAddSeriReservation from 'components/CModalAddRSVN/ModalAddSeriReservation';
import ModalAddOnGroupRsvn from 'components/CModalAddRSVN/ModalAddOnGroupRsvn';
import ModalAddRsvnToGroup from 'components/CModalAddRSVN/ModalAddRsvnToGroup';
import setStatusRSVN from 'services/booking/statusRsvn/status.service';
import ReservationService from 'services/reservation/reservation.service.';
import ModalInputRoomingList from '../reservation/InputRoomingList/ModalInputRoomingList';
import BreakSharedBooking from './breakShared';
import { useTranslation } from 'react-i18next';

import DrawerProfiles from "../reservation/drawerProfiles"
import FuncEditGroup from './FuncEditGroup';
import useWindowSize from 'hooks/useWindowSize';
import { styleInforRoomPlan } from 'pages/main/front-desk/RoomPlan/styles/index.styles';
import CModelConfirm from 'components/CModalConfirm';
import CConfirm from 'components/CConfirm';
import PrintService from 'services/cashier/print.service';
import FrontDeskService from 'services/frontdesk/frontdesk.service';
import { TypeTracer } from 'common/enum/cashier.enum';
import { setAlertMessage } from 'redux/controller';
import Auth from 'services/auth/auth.service';
import Role from 'common/roles';

const Index = (props: Props): JSX.Element => {
    const classes = useStyleTheme(styleSearchResults);
    const classesBtn = useStyleTheme(styleInforRoomPlan)
    const [selectedRows, setSelectedRows] = useState<ISearchResult[]>([])
    const [idRsvn, setIdRsvn] = useState('')
    const [, setTransactRoomGuids] = useState([])
    const { fullScreen, navbar, paddingYPage } = themeValue.height;
    const refHeader = useRef<HTMLDivElement>(null)
    const [heightHeader, setHeightHeader] = useState(65)
    const [visible, setVisible] = useState(false)
    const heightHeaderTable = "52px"
    const dispatch = useDispatchRoot();
    const { dataSearchResults, listGuestProfiles, queryParam, formSearch,
        titleDataSearchResults, loadingSearch, reservationData, guestProfile, inforPage
    } = useSelectorRoot(state => state.booking);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { numberOfRooms, roomTypePMId } = useSelectorRoot(state => state.app);
    const [ableToEdit, setAbleToEdit] = useState(false);
    const [isVisbleCombine, setIsVisbleCombine] = useState(false);
    const [ableToCombine, setAbleToCombine] = useState<boolean>(false);
    const [isVisblePM, setIsVisblePM] = useState<boolean>(false);
    const [checkedGRMaster, setCheckedGRMaster] = useState<boolean>(true);
    const [toggleModalAddReservation, setToggleModalAddReservation] = useState<boolean>(false);
    const [toggleModalAddOnGroupRsvn, setToggleModalAddOnGroupRsvn] = useState<boolean>(false);
    const [modalInputRoomingVisible, setToggleModalInputRooming] = useState<boolean>(false);
    const [toggleModalReinstateRSVN, setToggleModalReinstateRSVN] = useState<boolean>(false);
    const [transactRoomId, setTransactRoomId] = useState<any>('');
    const [visibleGuestProfile, setVisibleGuestProfile] = useState(false)
    const [ableCancelPM, setAbleCancelPM] = useState<boolean>(false);
    const [ableToConfirm, setAbleToConfirm] = useState<boolean>(false);
    const [isAddShared, setIsAddShared] = useState<boolean>(false);
    const [ableAddShared, setAbleAddShared] = useState<boolean>(false);
    const [isApplyGroup, setIsApplyGroup] = useState<boolean>(false);
    const [ableReinstate, setAbleReinstate] = useState<boolean>(false);
    const [isVisableMasterG, setIsVisableMasterG] = useState<boolean>(false);
    const [checkedComment, setCheckedComment] = useState<boolean>(true);
    const [lstSelectedData, setLstSelectedData] = useState<any>();
    const [selectKind, setSelectKind] = useState<any>('')
    const [visibleCompanyProfile, setVisibleNewCompanyProfile] = useState<boolean>(false);
    const [visibleNewGuestProfile, setVisibleNewGuestProfile] = useState<boolean>(false)
    const [guestGuidBeUpdated, setGuestGuidBeUpdated] = useState<string>("")
    const [companyGuidBeUpdated, setCompanyGuidBeUpdated] = useState<string>("")
    const [visibleEditGuest, setVisibleEditGuest] = useState<boolean>(false)
    const [visibleEditCompany, setVisibleEditCompany] = useState<boolean>(false)
    const [visibleMergeGuest, setVisibleMergeGuest] = useState<boolean>(false)
    const [visibleMergeCompany, setVisibleMergeCompany] = useState<boolean>(false)
    const [ableBreakShared, setAbleBreakShared] = useState<boolean>(false);
    const [isShowBreakShared, setShowBreakShared] = useState<boolean>(false);
    const [isShowFuncEdit, setShowFuncEdit] = useState<boolean>(false);
    const [isShowCancel, setShowCancel] = useState<boolean>(false);
    const [isDisableEdit, setIsDisableEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const size = useWindowSize();
    const [sizeWindown, setSizeWinDown] = useState<string>("");
    const history = useHistory();
    const { t } = useTranslation("translation")
    //Get height element
    useLayoutEffect(() => {
        if (refHeader.current && refHeader.current.clientHeight) {
            setHeightHeader(refHeader.current.clientHeight)
        }
    }, [refHeader?.current?.clientHeight])

    useEffect(() => {
        dispatch(setRoomTypeLoadPage({hotelGuid: hotelId}))
    }, [dispatch, hotelId])
    useEffect(() => {
        setSizeWinDown(size);
    }, [size])
    const handleOnChange = (e: { select: ISearchResult[] }) => {
        setSelectedRows(e.select)
        const select = e.select;
        const lstSelectedData: any[] = [];
        const noShowFilter = select.filter((x: any) => x.status.id === ReservationStatus.NoShow);
        dispatch(setNoShowRSVN(noShowFilter));
        setAbleReinstate(noShowFilter.length > 0);
        select.forEach((item: any) => {
            // setListGuestId()
            // setListGuestId(listGuestId.concat(item.guestId))
            const tmp = listGuestProfiles.find(x => x?.guid === item.guestId);
            item.parentMeGuid === 0 ? setAbleAddShared(true) : setAbleAddShared(false);
            const transactionRooms = queryParam.find(x => x.guid === item.guid);
            if (tmp) lstSelectedData.push({
                ...tmp,
                transactRoomGuid: transactionRooms?.guid,
                transactParentGuid: transactionRooms?.parentGuid,
                roomType: transactionRooms?.roomType
            });
        });

        if (lstSelectedData.length === 1) {
            setIdRsvn(lstSelectedData[0].transactParentGuid)
        } else {
            setIsApplyGroup(false);
        }
        setLstSelectedData(lstSelectedData);
        lstSelectedData.length === 1 ? setAbleToEdit(true) : setAbleToEdit(false);
        const dataTransactRoomGuids: any = [];
        lstSelectedData.forEach(element => {
            dataTransactRoomGuids.push(element.transactRoomGuid)
        });
        setTransactRoomGuids(dataTransactRoomGuids);
        if (lstSelectedData) {
            dispatch(selectProfile(lstSelectedData));
            if (lstSelectedData.length > 0) dispatch(guestProfileInBookingRSVN(lstSelectedData[0]));
        }
        if (lstSelectedData.length === 1) {
            select.forEach((item: ISearchResult) => {
                const selectQueryParm = queryParam.find(x => x.guid === item.guid);
                setTransactRoomId(selectQueryParm?.guid);
                roomTypePMId === item.roomType.id ? setAbleCancelPM(true) : setAbleCancelPM(false);
                selectQueryParm?.parentMeGuid === null && roomTypePMId !== item.room.id ? setAbleToCombine(true) : setAbleToCombine(false);
                selectQueryParm?.parentMeGuid === null ? setAbleToEdit(true) : setAbleToEdit(false);
                selectQueryParm?.parentMeGuid !== null &&
                    (selectQueryParm?.status === 1 || selectQueryParm?.status === 0) ? setAbleBreakShared(true) : setAbleBreakShared(false);
                setAbleToConfirm(true);
            })
        } else {
            setAbleToEdit(false)
            setAbleToCombine(false);
            setAbleCancelPM(false);
            setAbleToConfirm(false);
            setAbleBreakShared(false);
        }
    }
    const addToRsvnProfile = async () => {
        const res = await search.editGroupRsvn(idRsvn);
        dispatch(getBookingByRsvnId(res));
        history.push("/main/booking/new", { isAddRSVN: true });
    }


    const showModalAddReservation = () => {
        dispatch(getGuestProfilesRsvnData(idRsvn))
        // setTimeout(() => {
        setToggleModalAddReservation(true)
        // }, 300)
    }

    const showModalAddOnGroupReservation = () => {
        dispatch(getGuestProfilesRsvnData(idRsvn))
        setToggleModalAddOnGroupRsvn(true)
    }

    const clickEditGroupRsvn = async () => {
        const res = await search.editGroupRsvn(idRsvn);
        dispatch(getBookingByRsvnId(res));
        history.push(`/main/booking/edit-group/${idRsvn}`, { isEditGroup: true });
    }
    const clickEditRsvn = () => {
        //await search.editGroupRsvn(idRsvn);
        if(Auth.hasRole(Role.FO_FOM_GM)){
            const rsvnNo = selectedRows[0]?.rsvnNo.name ?? "";
            const status = selectedRows[0]?.status.name ?? "";
            history.push(`/main/booking/edit-rsvn/${transactRoomId}?isMain=${ableToEdit}`, { rsvnNo, status, isTableSearch : true });
        }
    }

    const activeGroupRSVN = async () => {
        const res = await search.apiSearch(idRsvn, hotelId);
        const IsIncludeChild = true;
        await setStatusRSVN.dataActiveRsvn(res, numberOfRooms, IsIncludeChild, false);
        onPagination(inforPage.CurrentPage, inforPage.PageSize)
    }

    const clickActiveRsvn = () => {
        Modal.confirm({
            title: t("BOOKING.SEARCHVALUE.doUWantToActive"),
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            async onOk() {
                if (isApplyGroup) {
                    activeGroupRSVN()
                } else {
                    const IsIncludeChild = true;
                    await setStatusRSVN.dataActiveRsvn(selectedRows, numberOfRooms, IsIncludeChild, false);
                    onPagination(inforPage.CurrentPage, inforPage.PageSize)
                }
            }
        });
    }

    const confirmRsvn = async () => {
        try {
            const confirmRsvnRes = await ReservationService.confirmReservation(transactRoomId).toPromise();
            if (confirmRsvnRes === "Update succsessfull") notification.success({ message: "Confirm successfully!" })
            else notification.error({ message: "Confirm fail! Please try again!" })
        } catch (error) {
            console.log(error);
            notification.error({ message: "Error!" })
        }
    }

    const handleConfirmRsvn = () => {
        Modal.confirm({
            title: t("BOOKING.SEARCHVALUE.doUWantToConfirm"),
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            onOk() {
                confirmRsvn()
            }
        });
    }

    const printRsvnConfirmation = async (isGroup: boolean) => {
        const fileURL = await PrintService.printRsvnConfirmation({
            hotelGuid: hotelId,
            transactRoomGuid: selectedRows[0].guid ?? "00000000-0000-0000-0000-000000000000",
            rsvnGuid: idRsvn,
            isGroup
        })
        if (fileURL) {
            window.open(fileURL)
        }
    }

    const printRegCard = async (isGroup: boolean) => {
        const fileURL = await PrintService.printRegCard({
            hotelGuid: hotelId,
            transactRoomGuid: selectedRows[0].guid ?? "00000000-0000-0000-0000-000000000000",
            rsvnGuid: idRsvn,
            isGroup
        })
        if (fileURL) {
            window.open(fileURL)
        }
    }

    const handlePrintConfirmation = () => {
        if (selectedRows.length > 0) {
            Modal.confirm({
                title: t("BOOKING.applyForGroupQuestion"),
                okText: 'Yes',
                cancelText: 'No',
                className: "custom-modal-confirm-pkm",
                onOk() {
                    printRsvnConfirmation(true);
                },
                onCancel() {
                    printRsvnConfirmation(false)
                }
            });
        }
    }
    const handlePrintRegCard = () => {
        if (selectedRows.length > 0) {
            Modal.confirm({
                title: t("BOOKING.applyForGroupQuestion"),
                okText: 'Yes',
                cancelText: 'No',
                className: "custom-modal-confirm-pkm",
                onOk() {
                    printRegCard(true);
                },
                onCancel() {
                    printRegCard(false)
                }
            });
        }
    }

    const cancelGroupRSVN = async (IsIncludeChild: boolean) => {
        const res = await search.apiSearch(idRsvn, hotelId);
        const data = setStatusRSVN.dataCancelRsvn(res, numberOfRooms);
        dispatch(setStatusGroupRSVN({ data, IsIncludeChild, isCheckin: false }))
    }

    const clickCancelRsvn = (IsIncludeChild: boolean) => {
        if (!ableCancelPM) {
            if (isApplyGroup) {
                cancelGroupRSVN(IsIncludeChild);
            } else {
                const isCheckin = (!IsIncludeChild && formSearch.status === ReservationStatus.CheckIn) ? true : false;
                const data = setStatusRSVN.dataCancelRsvn(selectedRows, numberOfRooms, true);
                dispatch(setStatusGroupRSVN({ data, IsIncludeChild, isCheckin: isCheckin }))
            }
        } else {
            dispatch(cancelPmRequest({
                roomTypeId: roomTypePMId,
                rSVNId: idRsvn
            }))
        }
    }

    function showConfirmAddSeri() {
        dispatch(getGuestProfilesRsvnData(idRsvn))
        setVisibleGuestProfile(true)
    }

    function showModalAddRsvnToGroup() {
        dispatch(getGuestProfilesRsvnData(idRsvn))
        setVisible(true)
    }

    const clickCombineGuest = () => {
        const getTransactRoom: any = queryParam.find(x => x.guid === transactRoomId);
        if (getTransactRoom) {
            const dateArriAndDepart = [getTransactRoom.arrivalDate, getTransactRoom.departureDate];
            dispatch(getAllGuestAndQueryRequest({
                hotelGuid: hotelId,
                arrivalDates: dateArriAndDepart,
                // departureDates: dateArriAndDepart,
            }));
            setIsVisbleCombine(true);
        }
    }
    const handleCombineGuest = (data: any) => {
        dispatch(updateCombineGuestRequest(data))
        setIsVisbleCombine(false);
        setAbleToCombine(false);
    }
    const newRsvn = () => {
        if(Auth.hasRole(Role.FO_FOM_GM)){
            dispatch(getBookingByRsvnId(null))
            dispatch(guestProfileInBookingRSVN({ ...guestProfile, firstName: "", guestName: "" }));
            dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));// reset fixcharge
            history.push("/main/booking/new")
        }
    }
    const clickAddPM = async () => {
        // const data: any = await search.addPM(transactRoomId);
        // if (data) {
        //     const newData = {
        //         rSVNId: idRsvn,
        //         data: {
        //             ...data,
        //             roomType: roomTypePm[0]?.guid
        //         },
        //         pmRoomId: roomTypePm[0]?.guid,
        //         isCreateGrm: checkedGRMaster
        //     }
        //     delete newData.data.id;
        //     delete newData.data.guid;
        //     dispatch(addPmRequest(newData))
        //     setIsVisblePM(false);
        //     setCheckedGRMaster(true);
        // }
        setIsLoading(true);
        await ReservationService.addPmByToGroup(transactRoomId, idRsvn, checkedGRMaster, roomTypePMId);
        setIsVisblePM(false);
        setCheckedGRMaster(true);
        dispatch(updateQueryParamStatus(true));
        setIsLoading(false);
    }

    const onPagination = (pageNumber: number, pageSize: any) => {
        const dataSearch = {
            ...formSearch,
            pageNumber: pageNumber,
            pageSize: pageSize ? parseInt(pageSize) : 10,
            listRoomType: numberOfRooms
        }
        dispatch(searchWithQueryParam(dataSearch));
    }
    const clickSetGroupMaster = () => {
        const data = {
            rSVNId: idRsvn,
            trRoomId: transactRoomId,
            checkedComment: checkedComment,
            comment: GroupMasterService.converComment(selectedRows[0], true)
        };
        dispatch(addGroupMasterRequest(data));
        setIsVisableMasterG(false);
    }
    const clickUnsetGroupMaster = () => {
        Modal.confirm({
            title: t("BOOKING.SEARCHVALUE.doUWantToUnsetThisRsvnAsGroupMaster"),
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            onOk() {
                const data = {
                    rSVNId: idRsvn,
                    trRoomId: transactRoomId,
                    comment: GroupMasterService.converComment(selectedRows[0], false)
                }
                dispatch(unsetGroupMasterRequest(data));
            }
        });
    }
    const clickAddSharedGuest = () => {
        setIsAddShared(true);
    }
    const showNewCompanyDrawer = () => {
        setSelectKind('null');
        setVisibleNewCompanyProfile(true);
    };
    const handleClickFolio = async () => {
        const fullName = selectedRows[0].fullName.name;
        const res = selectedRows[0].guid && await FrontDeskService.getMessageAlert(selectedRows[0].guid, TypeTracer.AlertCheckOut, hotelId)
        if(typeof res !== "string"){
            res && dispatch(setAlertMessage(res))
        }
        history.push(`/main/cashier/folio/${selectedRows[0].guid}`,
            {
                fullName, tsRomGuid: selectedRows[0].guid,
                roomNumber: selectedRows[0].room.name ?? "",
                guestGuid: selectedRows[0].guestId, status: selectedRows[0].status.id,
                parentMeGuid: selectedRows[0].parentMeGuid
            }
        )
    }
    const renderMenuItem = (
        <Menu className={`${classesBtn.styleDropdown} custom-scrollbar-pkm`}>
            {
                sizeWindown === "xl" ?
                    <>
                        <Menu.Item key="sr-15">
                            <Button disabled={!ableToCombine} onClick={() => clickCombineGuest()}
                                className={`${classes.styleBtn} mb-1 ml-1`} style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.combine")}</Button>
                        </Menu.Item>
                        <Menu.Item key="sr-14">
                            <Button disabled={!ableToEdit} onClick={() => setIsVisblePM(true)}
                                className={`${classes.styleBtn} mb-1 ml-1`} style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.addPm")}</Button>
                        </Menu.Item>
                    </>
                    : ""}
            <Menu.Item key="srf-1">
                <Button disabled={!ableToEdit} onClick={handleClickFolio}
                    className={`${clsx(classes.styleBtn)} mb-1 ml-1`}
                    style={{ width: '100%' }}>Folio</Button>
            </Menu.Item>
            <Menu.Item key="sr-1">
                <Button disabled={!ableToEdit} onClick={clickUnsetGroupMaster} danger
                    className={`${clsx(classes.styleBtn, classes.btnDanger)} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.unsetGroupMaster")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-2">
                <Button disabled={!ableToEdit} onClick={() => setIsVisableMasterG(true)}
                    className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.setGroupMaster")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-3">
                <Button onClick={clickEditGroupRsvn} className={`${classes.styleBtn} mb-1 ml-1`}
                    //disabled={!ableToEdit}
                    disabled={true}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.editGroupRsvn")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-4">
                <Button onClick={clickEditRsvn} className={`${classes.styleBtn} mb-1 ml-1`}
                    disabled={selectedRows.length < 2 ? false : true}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.editRsvn")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-5">
                <Button onClick={handleConfirmRsvn} disabled={!ableToConfirm}
                    className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.confirm")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-6">
                <Button onClick={showModalAddReservation} disabled={!ableToEdit}
                    className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.addOnRsvn")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-7">
                <Button onClick={showModalAddOnGroupReservation} disabled={!ableToEdit}
                    className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}> {t("BOOKING.SEARCHVALUE.addOnGroupRsvn")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-8">
                <Button onClick={showConfirmAddSeri} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}> {t("BOOKING.SEARCHVALUE.addSeriRsvn")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-9">
                <Button onClick={clickAddSharedGuest} disabled={!ableAddShared}
                    className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.addShared")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-10">
                <Button onClick={showModalAddRsvnToGroup} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.addRsvnToGroup")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-11">
                <Button onClick={() => setToggleModalInputRooming(true)} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.inputRoomingList")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-12">
                <Button disabled={selectedRows.length !== 1} onClick={handlePrintConfirmation} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("PRINT.RSVN_CONFIRM")}</Button>
            </Menu.Item>
            <Menu.Item key="sr-13">
                <Button disabled={selectedRows.length !== 1} onClick={handlePrintRegCard} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("PRINT.REG_CARD")}</Button>
            </Menu.Item>
        </Menu>
    )
    const renderMenuNewProfiles = (
        <Menu>
            <Menu.Item key="it-1">
                <Button onClick={() => setVisibleNewGuestProfile(true)} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.newGuestProfiles")}</Button>
            </Menu.Item>
            <Menu.Item key="it-2">
                <Button onClick={showNewCompanyDrawer} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.newCompanyOrAgentProfile")}</Button>
            </Menu.Item>
            <Menu.Item key="it-3">
                <Button onClick={() => setVisibleEditGuest(true)} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.editGuestProfile")}</Button>
            </Menu.Item>
            <Menu.Item key="it-4">
                <Button onClick={() => setVisibleEditCompany(true)} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.editCompanyProfile")}</Button>
            </Menu.Item>
            <Menu.Item key="it-5">
                <Button onClick={() => setVisibleMergeGuest(true)} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.mergeGuestProfiles")}</Button>
            </Menu.Item>
            <Menu.Item key="it-6">
                <Button onClick={() => setVisibleMergeCompany(true)} className={`${classes.styleBtn} mb-1 ml-1`}
                    style={{ width: '100%' }}>{t("BOOKING.SEARCHVALUE.mergeCompanyProfiles")}</Button>
            </Menu.Item>
        </Menu>
    )
    const handleContext = (nameHandle: string) => {
        switch (nameHandle) {
            case 'clickCancelRsvn':
                setShowCancel(true)
                break;
            case 'clickActiveRsvn':
                clickActiveRsvn()
                break;
            case 'addToRsvnProfile':
                addToRsvnProfile()
                break;
            case 'reinstateReservation':
                reinstateReservation()
                break;
            case 'clickCombineGuest':
                clickCombineGuest()
                break;
            case 'addPm':
                setIsVisblePM(true)
                break;
            case 'clickUnsetGroupMaster':
                clickUnsetGroupMaster()
                break;
            case 'setGroupMaster':
                setIsVisableMasterG(true)
                break;
            case 'clickEditGroupRsvn':
                clickEditGroupRsvn()
                break;
            case 'clickEditRsvn':
                clickEditRsvn()
                break;
            case 'handleConfirmRsvn':
                handleConfirmRsvn()
                break;
            case 'showModalAddReservation':
                showModalAddReservation()
                break;
            case 'showModalAddOnGroupReservation':
                showModalAddOnGroupReservation()
                break;
            case 'showConfirmAddSeri':
                showConfirmAddSeri()
                break;
            case 'clickAddSharedGuest':
                clickAddSharedGuest()
                break;
            case 'showModalAddRsvnToGroup':
                showModalAddRsvnToGroup()
                break;
            case 'showModalFuncEditGroup':
                showModalFuncEditGroup();
                break;
            default:
                break;
        }
    }
    const reinstateReservation = () => {
        setToggleModalReinstateRSVN(true);
    }
    const handleClickButtonContextMenu = (nameHandle: string) => { handleContext(nameHandle) }

    const handleBreakShared = () => {
        Modal.confirm({
            title: "Do you want break shared ?",
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            onOk() {
                setShowBreakShared(true)
            }
        });
    }
    const showModalFuncEditGroup = () => {
        setShowFuncEdit(true);
    }
    return (
        <div className={`${props.className} `}>
            <div ref={refHeader} className="grid grid-cols-12 xl:grid-cols-12 g h-auto gap-2 pb-3">
                <div className="col-span-2 xl:col-span-2">
                    <div className={`text-xl font-semibold`}>{t("BOOKING.SEARCHVALUE.searchResults")}</div>
                    <div className={`${classes.subTitle} text-base`}>
                        {dataSearchResults?.length} {t("BOOKING.SEARCHVALUE.result")}{(dataSearchResults?.length > 1) && (t("BOOKING.SEARCHVALUE.result") === "result") && "s"}
                    </div>
                </div>
                <div className="col-span-10 xl:col-span-10 flex flex-wrap xl:justify-end transition-opacity">
                    {selectedRows.length > 0 ?
                        <div className="col-span-12 xl:col-span-12">
                            <Button onClick={() => setShowCancel(true)} danger
                                className={`${clsx(classes.styleBtn, classes.btnDanger)} mb-1 ml-1`}>{t("BOOKING.SEARCHVALUE.cancel")}</Button>
                            <Button onClick={clickActiveRsvn}
                                className={`${classes.styleBtn} mb-1 ml-1`}>{t("BOOKING.SEARCHVALUE.active")}</Button>
                            <Button onClick={addToRsvnProfile}
                                className={`${classes.styleBtn} mb-1 ml-1`}>{t("BOOKING.SEARCHVALUE.addRsvn")}</Button>
                            <Button disabled={!ableReinstate} onClick={() => reinstateReservation()}
                                className={`${classes.styleBtn} mb-1 ml-1`}>{t("BOOKING.SEARCHVALUE.reinstate")}</Button>
                            <Button disabled={!ableBreakShared} onClick={handleBreakShared}
                                className={`${classes.styleBtn} mb-1 ml-1`}>{t("BOOKING.SEARCHVALUE.break")}</Button>
                            {
                                sizeWindown !== "xl" ?
                                    <>
                                        <Button disabled={!ableToCombine} onClick={() => clickCombineGuest()}
                                            className={`${classes.styleBtn} mb-1 ml-1`}>{t("BOOKING.SEARCHVALUE.combine")}</Button>
                                        <Button disabled={!ableToEdit} onClick={() => setIsVisblePM(true)}
                                            className={`${classes.styleBtn} mb-1 ml-1`}>{t("BOOKING.SEARCHVALUE.addPm")}</Button>
                                    </>
                                    : ""
                            }
                            <Dropdown overlay={renderMenuItem} trigger={['click']} placement="topLeft">
                                <Button className={`${classes.styleBtn} mb-1 ml-1`}>...</Button>
                            </Dropdown>
                        </div> :
                        <div className="col-span-12 xl:col-span-12">
                            <Dropdown overlay={renderMenuNewProfiles} trigger={['click']} placement="topLeft">
                                <Button className={`${classes.styleBtn} mb-1 ml-1`}>...</Button>
                            </Dropdown>
                        </div>
                    }
                    <div style={{ marginLeft: '0.25rem' }}>
                        <button onClick={newRsvn} className={`${classes.btn} flex items-center`}>
                            <CIconSvg name="plus-circle" svgSize="medium" colorSvg="background" />
                            <span className="pl-2">{t("BOOKING.SEARCHVALUE.newRsvnAndGroup")}</span>
                        </button>
                    </div>
                </div>
            </div>
            <Checkbox
                disabled={selectedRows.length > 1 || selectedRows.length === 0}
                className={`${classes.checkBox} !pb-2 !pl-2 font-bold`}
                onChange={(e) => {
                    setIsApplyGroup(e.target.checked);
                }}
            >
                {t("BOOKING.SEARCHVALUE.applyForThisGroup")}
            </Checkbox>
            <TableSearchResults
                visible={loadingSearch}
                dataSearchResults={dataSearchResults}
                titleDataSearchResults={titleDataSearchResults}
                propsOnChange={handleOnChange}
                heightHeader={`${heightHeader + 85}px`}
                handleClickContextMenu={handleClickButtonContextMenu}
                heightTable={`calc(${fullScreen} - (${heightHeaderTable} + ${paddingYPage} + ${navbar} + ${heightHeader}px) + 30px)`}
            />

            <div className={`${classes.stylePanigation} col-span-12 flex justify-end pr-1`}>
                <Pagination
                    size="default"
                    showQuickJumper={{ goButton: <Button>{t("BOOKING.SEARCHVALUE.ok")}</Button> }}
                    showSizeChanger
                    current={inforPage.CurrentPage}
                    pageSize={inforPage.PageSize}
                    pageSizeOptions={["10", "20", "50"]}
                    total={inforPage.TotalCount}
                    onChange={(page, pageSize) => onPagination(page, pageSize)}
                    showTotal={total => `Total ${total} item`}
                />

            </div>
            <CModel
                title={t("BOOKING.SEARCHVALUE.addPm")}
                visible={isVisblePM}
                onOk={clickAddPM}
                onCancel={() => setIsVisblePM(false)}
                isLoading={isLoading}
                content={
                    <Checkbox
                        defaultChecked={checkedGRMaster}
                        style={{ fontSize: 16 }}
                        checked={checkedGRMaster}
                        className={`${classes.label} font-semibold`}
                        onChange={(e) => setCheckedGRMaster(e.target.checked)}
                    >
                        {t("BOOKING.SEARCHVALUE.doUWantSetGroupMasterForPm")}
                    </Checkbox>
                }
            />
            <CModel
                title={t("BOOKING.SEARCHVALUE.setGroupMaster")}
                visible={isVisableMasterG}
                onOk={clickSetGroupMaster}
                onCancel={() => setIsVisableMasterG(false)}
                content={
                    <Checkbox
                        defaultChecked={checkedGRMaster}
                        style={{ fontSize: 16 }}
                        checked={checkedComment}
                        className={`${classes.label} font-semibold`}
                        onChange={(e) => setCheckedComment(e.target.checked)}
                    >
                        {t("BOOKING.SEARCHVALUE.doUWantAddCmtForTheRsvn")}
                    </Checkbox>
                }
            />
            {visibleEditGuest && <ModalEditGuestProfile
                title={t("BOOKING.SEARCHVALUE.editGuestProfile")}
                visibleEditGuest={visibleEditGuest}
                setVisibleEditGuest={setVisibleEditGuest}
                guestGuid={(guid: string) => setGuestGuidBeUpdated(guid)}
            />}
            {visibleEditCompany && <ModalEditCompanyProfile
                title={t("BOOKING.SEARCHVALUE.editCompanyProfile")}
                visibleEditCompany={visibleEditCompany}
                setVisibleEditCompany={setVisibleEditCompany}
                companyGuid={(guid: string) => setCompanyGuidBeUpdated(guid)}
            />}
            {visibleMergeGuest && <ModalMergeGuests
                title={t("BOOKING.SEARCHVALUE.mergeGuestProfiles")}
                visibleMergeGuest={visibleMergeGuest}
                setVisibleMergeGuest={setVisibleMergeGuest}
                guestGuid={(guid: string) => setGuestGuidBeUpdated(guid)}
                setVisibleNewGuestProfile={setVisibleNewGuestProfile}
                setIsDisableEdit={setIsDisableEdit}
            />}
            {visibleMergeCompany && <ModalMergeCompanies
                title={t("BOOKING.SEARCHVALUE.mergeCompanyProfiles")}
                visibleMergeCompany={visibleMergeCompany}
                setVisibleMergeCompany={setVisibleMergeCompany}
                companyGuid={(guid: string) => setCompanyGuidBeUpdated(guid)}
                setVisibleNewCompanyProfile={setVisibleNewCompanyProfile}
                setIsDisableEdit={setIsDisableEdit}
            />}
            <ModalAddReservation
                modalAdd={toggleModalAddReservation}
                setToggleModalAddReservation={setToggleModalAddReservation}
                selectedRows={selectedRows}
                reservationData={reservationData}
            />
            {toggleModalAddOnGroupRsvn && <ModalAddOnGroupRsvn
                modalAdd={toggleModalAddOnGroupRsvn}
                setToggleModalAddOnGroupRsvn={setToggleModalAddOnGroupRsvn}
                reservationData={reservationData}
                selectedRows={selectedRows}
            />}
            {visibleGuestProfile && <ModalAddSeriReservation
                modalAddSeri={visibleGuestProfile}
                setVisibleGuestProfile={setVisibleGuestProfile}
                selectedRow={selectedRows}
                reservationData={reservationData}
            />}
            <ModalAddRsvnToGroup
                visible={visible}
                selectedRow={selectedRows}
                reservationData={reservationData}
                setVisible={setVisible}
                getData={() => console.log('booking')}
            />
            {selectedRows.length > 0 ?
                <CombineGuest
                    isVisbleCombine={isVisbleCombine}
                    setIsVisbleCombine={setIsVisbleCombine}
                    selectedRows={selectedRows[0]}
                    handleCombineGuest={handleCombineGuest}
                    ableCombine={ableToCombine}
                />
                : ''}
            {idRsvn !== "" && (
                <ModalInputRoomingList
                    modalInputRoomingVisible={modalInputRoomingVisible}
                    toggleModalInputRooming={setToggleModalInputRooming}
                    rsvnId={idRsvn}
                    getInHouse={false}
                />
            )}
            {isAddShared ?
                <ModelAddShared
                    isVisbleAddShared={isAddShared}
                    setIsVisbleAddShared={setIsAddShared}
                    selectedRows={selectedRows}
                    isApplyGroup={isApplyGroup}
                /> : ""}
            {toggleModalReinstateRSVN &&
                <ModalReinstateRSVN setVisibleModal={setToggleModalReinstateRSVN} />}
            {isShowBreakShared &&
                <BreakSharedBooking
                    isVisbleBreak={isShowBreakShared}
                    setIsVisbleBreak={setShowBreakShared}
                    selectedRows={selectedRows[0]}
                />
            }
            <DrawerProfiles
                guestGuidBeUpdated={guestGuidBeUpdated}
                setGuestGuidBeUpdated={setGuestGuidBeUpdated}
                visibleNewGuestProfile={visibleNewGuestProfile}
                setVisibleNewGuestProfile={setVisibleNewGuestProfile}
                companyGuidBeUpdated={companyGuidBeUpdated}
                setCompanyGuidBeUpdated={setCompanyGuidBeUpdated}
                visibleCompanyProfile={visibleCompanyProfile}
                setVisibleNewCompanyProfile={setVisibleNewCompanyProfile}
                isDisableEdit={isDisableEdit}
            />
            {isShowFuncEdit &&
                <FuncEditGroup
                    isShowFuncEdit={isShowFuncEdit}
                    setShowFuncEdit={setShowFuncEdit}
                    selectedRows={selectedRows}
                />
            }
            <CModelConfirm
                title={t(setStatusRSVN.mapTitleTranslation(ableCancelPM ? ExpandStatus.PM : formSearch.status))}
                visible={isShowCancel}
                onCancel={() => setShowCancel(false)}
                myForm="form-apply-group"
                width={400}
                content={
                    <CConfirm
                        title={t("COMMON.apply_for_shared_guest")}
                        idForm="form-apply-group"
                        defaultValue={true}
                        status={formSearch.status}
                        propsGetData={(data: DataFormConfirm) => {
                            clickCancelRsvn(data.isChild)
                            setShowCancel(false)
                        }}
                    />
                }
            />
        </div>
    )
}

const SearchResults = React.memo(Index);
export default SearchResults;