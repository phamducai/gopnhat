/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { themeValue, useStyleTheme } from 'theme';
import { styleReservation } from 'pages/main/booking/reservation/styles/reservation';
import { styleCForm } from 'pages/main/booking/styles/styleCForm';
import { Helmet } from "react-helmet";
import ClassBox from "components/CClassBox";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { useHistory } from "react-router";
import CIconSvg from "components/CIconSvg";
import { Button, Checkbox, Dropdown, Input, Select, Menu, Modal, notification } from "antd";
import { Controller, useForm } from "react-hook-form";
import { SelectedGuestProfile } from "common/define-api-booking";
import { DataFormConfirm, ISearchResult } from "common/model-booking";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import TableSearchFrontDesk from "../table/TableSearchFrontDesk";
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice";
import { IFormSearchReq } from "common/define-booking";
import FrontDeskService from "services/frontdesk/frontdesk.service";
import { addGroupMasterRequest, searchRequest, searchWithQueryParam, setStatusGroupRSVN } from "redux/controller";
import CPagination from "components/CPagination";
import GLobalPkm from "common/global";
import GroupMasterService from "services/search/groupmaster.service";
import ReservationService from "services/reservation/reservation.service.";
import Utils from "common/utils";
import { ResCheckInToGroup } from "common/model-rsvn-edit";
import ModalAssignRoom from "../RoomPlan/modal/ModalAssignRoom";
import ModalInputRoomingList from "pages/main/booking/reservation/InputRoomingList/ModalInputRoomingList";
import CModel from "components/CModal";
import CModelConfirm from "components/CModalConfirm";
import setStatusRSVN from "services/booking/statusRsvn/status.service";
import CConfirm from "components/CConfirm";
const { Option } = Select;

const ArrivalList = (): JSX.Element => {
    const classes = useStyleTheme(styleReservation);
    const classeForm = useStyleTheme(styleCForm);
    const history = useHistory();
    const dispatch = useDispatchRoot();

    const refHeader = useRef<HTMLDivElement>(null);
    const { fullScreen, navbar, paddingYPage } = themeValue.height;

    const { hotelName, hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const { numberOfRooms } = useSelectorRoot(state => state.rsvn);
    const { dataSearchResults, loadingSearch, titleDataSearchResults, inforPage, formSearch } = useSelectorRoot(state => state.booking);
    const { dateInputCheckIn } = useSelectorRoot(state => state.roomPlan);
    const { control, handleSubmit, register } = useForm();

    const [listGuestSelected, setListGuestSelected] = useState<SelectedGuestProfile[]>([])
    const [idRsvn, setIdRsvn] = useState<string | null>()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isVisibleAssign, setIsVisibleAssign] = useState<boolean>(false);
    const [guidTsRoom, setGuidTsRoom] = useState([]);
    const [modalInputRoomingVisible, setToggleModalInputRooming] = useState<boolean>(false);
    const [ableToInput, setAbleToInput] = useState<boolean>(false);
    const [isVisableMasterG, setIsVisableMasterG] = useState<boolean>(false);
    const [checkedComment, setCheckedComment] = useState<boolean>(true);
    const [isAssign, setIsAssign] = useState<boolean>(false);
    const [ableCheckin, setAbleCheckin] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<ISearchResult[]>([]);
    const [transactRoomId, setTransactRoomId] = useState<any>('');
    const [heightHeader, setHeightHeader] = useState(65)
    const [isShowCancel, setShowCancel] = useState<boolean>(false);
    const { t } = useTranslation("translation");

    useLayoutEffect(() => {
        if (refHeader.current && refHeader.current.clientHeight) {
            setHeightHeader(refHeader.current.clientHeight)
        }
    }, [refHeader?.current?.clientHeight])
    useEffect(() => {
        if (filteredCompanyProfile.length === 0) {
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: 'g'
            }))
        }
        setIsLoading(false);
    }, [dispatch, filteredCompanyProfile.length, hotelId])
    const handleOnChange = (e: { select: ISearchResult[] }) => {
        setSelectedRows(e.select)
        const data: SelectedGuestProfile[] = [];
        const tsRoomGuid: any = []
        e.select.forEach(record => {
            if (record.guid
                && record.roomType.id
                && record.arrival.id
                && record.departure.id
                && (record.parentMeGuid === 0 || record.parentMeGuid === null))
                data.push({
                    guid: record.guid,
                    roomName: record.roomType.name,
                    roomType: record.roomType.id,
                    arrivalDate: record.arrival.id,
                    departureDate: record.departure.id
                })
            tsRoomGuid.push(record.guid)
            if (record.parentMeGuid === 0 && record.room.name) {
                setAbleCheckin(true);
            } else {
                setAbleCheckin(false);
            }
        })
        console.log(e.select);
        setGuidTsRoom(tsRoomGuid);

        if (e.select.length === 1) {
            setIdRsvn(e.select[0].parentGuid)
            setTransactRoomId(e.select[0].guid)
            setIsAssign(e.select[0].room.name ? true : false)
            setAbleToInput(true)
        } else {
            setIsAssign(false)
            setAbleToInput(false)
        }
        setListGuestSelected(data);
        setSelectedRows(e.select);
    }
    const renderSelect = (data: any[]) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }
    const onSubmit = handleSubmit((formSearch: IFormSearchReq) => {
        if (formSearch.firstName && formSearch.guestName) {
            const dataSearchNyName = FrontDeskService.mapDataSearchForCheckin(hotelId, formSearch, numberOfRooms, dateInputCheckIn);
            dispatch(searchRequest(dataSearchNyName));
        } else {
            const dataSearch = FrontDeskService.mapDataSearchForCheckin(hotelId, formSearch, numberOfRooms, dateInputCheckIn);
            dispatch(searchWithQueryParam(dataSearch));
        }
    })
    const onPagination = (pageNumber: number, pageSize: any) => {
        const dataSearch = {
            ...formSearch,
            pageNumber: pageNumber,
            pageSize: pageSize ? parseInt(pageSize) : 10,
            listRoomType: numberOfRooms //roomType
        }
        dispatch(searchWithQueryParam(dataSearch));
    }
    const clickEditRsvn = () => {
        //await search.editGroupRsvn(idRsvn);
        const roomGuid = selectedRows[0]?.room.id ?? GLobalPkm.defaultBytes32;
        const rsvnNo = selectedRows[0]?.rsvnNo.name ?? "";
        const status = selectedRows[0]?.status.name ?? "";
        const isMain = selectedRows[0]?.parentMeGuid === 0 ? true : false;
        history.push(`/main/booking/edit-rsvn/${guidTsRoom}?isMain=${isMain}`, { roomGuid, rsvnNo, status });
    }
    const handleCancel = (IsIncludeChild: boolean) => {
        const data = setStatusRSVN.dataCancelRsvn(selectedRows, numberOfRooms, true);
        dispatch(setStatusGroupRSVN({ data, IsIncludeChild, isCheckin: false }))
        onSubmit();
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
    const handleCheckInGroup = () => {
        Modal.confirm({
            title: "Do you want check in group?",
            okText: t("FRONTDESK.ROOMPLAN.yes"),
            cancelText: t("FRONTDESK.ROOMPLAN.no"),
            className: "custom-modal-confirm-pkm",
            async onOk() {
                const res = await ReservationService.checkInToGroup(idRsvn ?? "", Utils.convertMiddleDate(businessDate)) as ResCheckInToGroup;
                if (res) {
                    if(res.result){
                        notification.success({
                            message: <b style={{ color: "#00293B" }}>Check in group success !</b>,
                            style: { borderRadius: 6 },
                            description:
                                <div>
                                    <span>Group Code: {selectedRows[0]?.groupCode.name ?? ""}</span>
                                    <br />
                                    <span>Total Room: {res.listRoomName.length}</span>
                                    <br />
                                    <span>Check in time: {Utils.convertToVNTimeZoneMbyMoment(res.arrival)}</span>
                                    <br />
                                    <span>Date: {Utils.formatDateVN(new Date(res.arrivalDate))} ~ {Utils.formatDateVN(new Date(res.departureDate))}</span>
                                </div>
                        })
                    }else{
                        notification.error({
                            message: <b style={{ color: "#00293B" }}>Check in failed !</b>,
                            style: { borderRadius: 6 },
                            description:
                                <div>
                                    <span>List Room InValid: {res.listRoomName.join(",")}</span>
                                    <br />
                                    <span>Total Room: {res.listRoomName.length}</span>
                                    <br />
                                    <span>Date: {Utils.formatDateVN(new Date(res.arrivalDate))} ~ {Utils.formatDateVN(new Date(res.departureDate))}</span>
                                </div>
                        })
                    }
                    
                }
                onSubmit();
            }
        });
    }
    const handleCheckIn = () => {
        const listParamCheckin = FrontDeskService.mapDataParamCheckinTable(selectedRows, dataSearchResults);
        history.push(`/main/front-desk/check-in/${listParamCheckin[0].mainTsRoom}`,
            { listParamCheckin: listParamCheckin, isFirst: true, isMain: true });
    }
    const renderMenuItem = (
        <Menu className={`custom-scrollbar-pkm grid gap-2`}>
            <Menu.Item key="1" className={`${classes.menuItem}`}>
                <Button disabled={guidTsRoom.length !== 1} onClick={clickEditRsvn} style={{ width: '100%' }}  
                    className={`${classes.styleBtn} mb-1 mt-1`}>Edit</Button>
            </Menu.Item>
            <Menu.Item key="12" className={`${classes.menuItem}`}>
                <Button disabled={!ableToInput} onClick={() => setToggleModalInputRooming(true)} style={{ width: '100%' }} 
                    className={`${classes.styleBtn} mb-1 mt-1`}
                >
                    {t("BOOKING.SEARCHVALUE.inputRoomingList")}
                </Button>
            </Menu.Item>
            <Menu.Item key="13" className={`${classes.menuItem}`}>
                <Button disabled={listGuestSelected.length === 0} style={{ width: '100%' }} 
                    className={`${classes.styleBtn} mb-1 mt-1`}
                > {t("FRONTDESK.ROOMPLAN.unAssign")} </Button>
            </Menu.Item>
        </Menu>
    )
    return(
        <div className={`${classes.main} custom-scrollbar-pkm`} style={{ height: "calc( 100vh - 64px)", color: "#00293B" }}>
            <Helmet>
                <title>Arrival List - {hotelName}</title>
            </Helmet>
            <div className="grid grid-cols-12 gap-4">
                <div className={`grid grid-cols-12 col-span-12 my-4`}>
                    <div className={`col-span-2 flex flex-wrap items-center justify-start`}>
                        <div className={`${classes.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`} onClick={() => {
                            history.push('/main/front-desk');
                        }}>
                            <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                        </div>
                        <label className="m-0 text-base	font-bold ml-3">Arrival List</label>
                    </div>
                    <div className={`xl:col-span-10 col-span-12 flex flex-wrap items-end justify-end`}>
                        <Button disabled={!isAssign} onClick={handleCheckInGroup}  className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.groupCI")}</Button>
                        <Button disabled={!ableCheckin} onClick={handleCheckIn}  className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.checkin")}</Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Reg.Card</Button>
                        <Button disabled={guidTsRoom.length === 0} onClick={() => setShowCancel(true)} className={`${clsx(classes.styleBtn, classes.btnDanger)} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.cancel")}</Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Print FIT Registration Card</Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Reactive</Button>
                        <Button onClick={() => setIsVisibleAssign(true)} disabled={listGuestSelected.length === 0} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.assign")}</Button>
                        <Button onClick={() => setIsVisableMasterG(true)} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.setGroupMaster")}</Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Queue Rooms</Button>
                        <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomRight" >
                            <Button className={`${classes.styleBtn} mb-1 ml-1`}>...</Button>
                        </Dropdown>

                    </div>
                </div>
                <ClassBox className={`col-span-3`}>
                    <form onSubmit={onSubmit} className={`grid grid-cols-2 gap-2 pt-5`}>
                        <label className="col-span-1 flex items-center m-0 font-base font-bold" style={{ color: "#666666" }}>
                            Total Rooms: 4
                        </label>
                        <label className="col-span-1 flex items-center m-0 font-base font-bold" style={{ color: "#666666" }}>
                            Total Guests: 8
                        </label>
                        <div className="col-span-2 flex items-center">
                            <Controller
                                name="isOnlyMainGuest"
                                control={control}
                                defaultValue={false}
                                render={({ onChange }) => <Checkbox
                                    defaultChecked={false}
                                    style={{ color: '#00293B' }}
                                    className={`col-span-12 font-bold`}
                                    onChange={e => { onChange(e.target.checked) }}>{t("BOOKING.mainGuestOnly")}</Checkbox>} />
                        </div>
                        <div className="col-span-1">
                            <label className={classeForm.labelInput}>{t("BOOKING.firstname")}:</label>
                            <Controller
                                as={<Input {...register("firstName", {
                                    required: false,
                                    maxLength: 20,
                                    // pattern: /^[A-Za-z]+$/i,
                                })} autoComplete='off' className={`${classeForm.input} w-full `}
                                type="text" />} name="firstName" defaultValue="" control={control} />
                        </div>
                        <div className="col-span-1">
                            <label className={classeForm.labelInput}>{t("BOOKING.lastname")}:</label>
                            <Controller as={<Input {...register("guestName", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />} name="guestName" control={control} defaultValue={""} />
                        </div>
                        <div className="col-span-1">
                            <label className={classeForm.labelInput}>{t("BOOKING.groupOrBookingCode")}:</label>
                            <Controller
                                as={<Input {...register("groupCode", {
                                    required: false,
                                    maxLength: 20,
                                    // pattern: /^[A-Za-z]+$/i,
                                })} autoComplete='off' className={`${classeForm.input} w-full `}
                                type="text" />} name="groupCode" defaultValue="" control={control} />
                        </div>
                        <div className="col-span-1">
                            <label className={classeForm.labelInput}>Birthday:</label>
                            <Controller as={<Input {...register("birthday", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' disabled className={`${classeForm.input} w-full`} type="text" />} name="birthday" control={control} defaultValue={""} />
                        </div>
                        <div className="col-span-2">
                            <label className={classeForm.labelInput}>{t("BOOKING.rsvnNo")}:</label>
                            <Controller as={<Input {...register("rsvnNo", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />}
                            name="rsvnNo" control={control} defaultValue={""} />
                        </div>
                        <div className="col-span-2">
                            <label className={classeForm.labelInput}>Agent:</label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                        showSearch
                                        onChange={(e) => {
                                            onChange(e)
                                        }}
                                    >
                                        <Option value=""> </Option>
                                        {filteredCompanyProfile ? renderSelect(filteredCompanyProfile.filter(x => x.kind === 0)) : ""}
                                    </Select>
                                }
                                control={control} defaultValue="" name={"companyAgentGuid"}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className={classeForm.labelInput}>Company:</label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                        showSearch
                                        onChange={(e) => {
                                            onChange(e)
                                        }}
                                    >
                                        <Option value=""> </Option>
                                        {filteredCompanyProfile ? renderSelect(filteredCompanyProfile.filter(x => x.kind === 1)) : ""}
                                    </Select>
                                }
                                control={control} defaultValue="" name={"company"}
                            />
                        </div>
                        <div className={`${classeForm.btn} col-span-2`}> 
                            <Button loading={isLoading} className={`w-full`} type="primary" htmlType="submit" >Search</Button>
                        </div>
                    </form>
                </ClassBox>
                <div className={`col-span-9`} >
                    <TableSearchFrontDesk
                        propsOnChange={handleOnChange}
                        heightHeader={`${heightHeader + 85}px`}
                        dataSearchResults={dataSearchResults}
                        visible={loadingSearch}
                        titleDataSearchResults={titleDataSearchResults}
                        handleClickContextMenu=""
                        heightTable={`calc(${fullScreen} - (52px + ${paddingYPage} + ${navbar} + ${heightHeader}px) + 25px)`}
                    />
                </div>
                <div className="col-span-9 float-right">
                    <CPagination
                        current={inforPage.CurrentPage}
                        pageSize={inforPage.PageSize}
                        total={inforPage.TotalCount}
                        onChange={(page, pageSize) => onPagination(page, pageSize)}
                    />
                </div>
                {isVisibleAssign &&
                    <ModalAssignRoom
                        isVisible={isVisibleAssign}
                        setIsVisble={setIsVisibleAssign}
                        dataSelected={listGuestSelected}
                        isInRoomPlan={false}
                        getData={onSubmit}
                    />
                }
                {modalInputRoomingVisible &&
                    <ModalInputRoomingList
                        modalInputRoomingVisible={modalInputRoomingVisible}
                        toggleModalInputRooming={setToggleModalInputRooming}
                        rsvnId={idRsvn}
                        getInHouse={false}
                        loadData={onSubmit}
                        isInFrontDesk={true}
                    />
                }
                <CModel
                    title={t("BOOKING.SEARCHVALUE.setGroupMaster")}
                    visible={isVisableMasterG}
                    onOk={clickSetGroupMaster}
                    onCancel={() => setIsVisableMasterG(false)}
                    content={
                        <Checkbox
                            defaultChecked={true}
                            style={{ fontSize: 16, color: "#00293B" }}
                            checked={checkedComment}
                            className="font-semibold"
                            onChange={(e) => setCheckedComment(e.target.checked)}
                        >
                            {t("BOOKING.SEARCHVALUE.doUWantAddCmtForTheRsvn")}
                        </Checkbox>
                    }
                />
                <CModelConfirm
                    title={t(setStatusRSVN.mapTitleTranslation(formSearch.status))}
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
                                handleCancel(data.isChild)
                                setShowCancel(false)
                            }}
                        />
                    }
                />
            </div>
        </div>
    )
}
export default ArrivalList;