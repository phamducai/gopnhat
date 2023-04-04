/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Modal, notification, Select } from "antd";
import CLoading from "components/CLoading";
import { themeValue, useStyleTheme } from 'theme';
import { styleReservation } from 'pages/main/booking/reservation/styles/reservation';
import { styleCForm } from 'pages/main/booking/styles/styleCForm';
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import CIconSvg from "components/CIconSvg";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice";
import { addGroupMasterRequest } from "redux/controller/booking.slice";
import CModelTable from "components/CModalTable";
import { ISearchResult } from "common/model-booking";
import { SelectedGuestProfile } from 'common/define-api-booking';
import TableSearchFrontDesk from "../table/TableSearchFrontDesk";
import CPagination from "components/CPagination";
import { searchRequest, searchWithQueryParam } from "redux/controller";
import ModalAssignRoom from "../RoomPlan/modal/ModalAssignRoom";
import { IFormSearchReq } from "common/define-booking";
import FrontDeskService from 'services/frontdesk/frontdesk.service';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import ModalInputRoomingList from 'pages/main/booking/reservation/InputRoomingList/ModalInputRoomingList';
import CModel from 'components/CModal';
import GroupMasterService from 'services/search/groupmaster.service';
import { setStatusGroupRSVN } from 'redux/controller/booking.slice';
import clsx from "clsx";
import { useHistory } from "react-router";
import GLobalPkm from "common/global";
import ReservationService from "services/reservation/reservation.service.";
import Utils from "common/utils";
import { ResCheckInToGroup } from "common/model-rsvn-edit";
const { Option } = Select;
interface Props {
    showModalAssign: boolean,
    setShowModalAssign: React.Dispatch<React.SetStateAction<boolean>>
}
const CheckInModal = ({ showModalAssign, setShowModalAssign }: Props) => {
    const { fullScreen, navbar, paddingYPage } = themeValue.height;
    const classes = useStyleTheme(styleReservation);
    const classeForm = useStyleTheme(styleCForm);
    const dispatch = useDispatchRoot();
    const history = useHistory();

    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { dataSearchResults, loadingSearch, titleDataSearchResults, inforPage, formSearch, roomType, roomTypePm } = useSelectorRoot(state => state.booking);
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
    const [checkedGRMaster, setCheckedGRMaster] = useState<boolean>(true);
    const [checkedComment, setCheckedComment] = useState<boolean>(true);
    const [isAssign, setIsAssign] = useState<boolean>(false);
    const [ableCheckin, setAbleCheckin] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<ISearchResult[]>([]);
    const [transactRoomId, setTransactRoomId] = useState<any>('');
    const [heightHeader, setHeightHeader] = useState(65)
    const { t } = useTranslation("translation");
    const refHeader = useRef<HTMLDivElement>(null);

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
    const onOk = () => {
        console.log("test");
    }
    const renderSelect = (data: any[]) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }
    const clickCancel = () => {
        const data: any = []
        const setTitle = t("BOOKING.SEARCHVALUE.doUWantToCancel");
        Modal.confirm({
            title: setTitle,
            okText: 'Yes',
            cancelText: 'No',
            className: "custom-modal-confirm-pkm",
            onOk() {
                const IsIncludeChild = true;
                guidTsRoom.forEach((elm: string) => {
                    data.push({
                        transactRoomId: elm,
                        status: 3,
                        totalRooms: 0
                    })
                })
                dispatch(setStatusGroupRSVN({ data, IsIncludeChild }))
                onSubmit();
            }
        });
    }
    const onPagination = (pageNumber: number, pageSize: any) => {
        const dataSearch = {
            ...formSearch,
            pageNumber: pageNumber,
            pageSize: pageSize ? parseInt(pageSize) : 10,
            listRoomType: numberOfRooms //roomType
        }
        dispatch(searchWithQueryParam(dataSearch));
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
    const clickEditRsvn = () => {
        //await search.editGroupRsvn(idRsvn);
        const roomGuid = selectedRows[0]?.room.id ?? GLobalPkm.defaultBytes32;
        const rsvnNo = selectedRows[0]?.rsvnNo.name ?? "";
        const status = selectedRows[0]?.status.name ?? "";
        const isMain = selectedRows[0]?.parentMeGuid === 0 ? true : false;
        history.push(`/main/booking/edit-rsvn/${guidTsRoom}?isMain=${isMain}`, { roomGuid, rsvnNo, status });
    }
    const handleCheckInGroup = () => {
        Modal.confirm({
            title: "Do you want check in group?",
            okText: t("FRONTDESK.ROOMPLAN.yes"),
            cancelText: t("FRONTDESK.ROOMPLAN.no"),
            className: "custom-modal-confirm-pkm",
            async onOk() {
                const res = await ReservationService.checkInToGroup(idRsvn ?? "", Utils.formatDateByUTC(businessDate)) as ResCheckInToGroup;
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
                                    <span>{`This room ${res.listRoomName.join(",")} is already occupied !`}</span>
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
    const handleUnAssign = () => {
        Modal.confirm({
            title: t("FRONTDESK.ROOMPLAN.confirmUnassignMes"),
            okText: t("FRONTDESK.ROOMPLAN.yes"),
            cancelText: t("FRONTDESK.ROOMPLAN.no"),
            className: "custom-modal-confirm-pkm",
            async onOk() {
                if (listGuestSelected) {
                    const tsrIds: string[] = listGuestSelected.map((transactRoom: any) => transactRoom.guid)
                    await RoomPlanService.unAssignRoom(tsrIds)
                    onSubmit();
                }
            }
        });
    }

    return (
        <CModelTable
            title={`Arrival List`}
            visible={showModalAssign}
            onOk={() => onOk()}
            onCancel={() => setShowModalAssign(false)}
            width={"85%"}
            style={{ top: 6 }}
            isFooter={false}
            content={
                <CLoading visible={isLoading}>
                    <div>
                        <Button disabled={guidTsRoom.length === 0} onClick={() => clickCancel()} className={`${clsx(classes.styleBtn, classes.btnDanger)} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.cancel")}</Button>
                        <Button disabled={guidTsRoom.length !== 1} onClick={clickEditRsvn} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Edit</Button>
                        <Button disabled={!isAssign} onClick={handleCheckInGroup} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.groupCI")}</Button>
                        <Button disabled={!ableCheckin} onClick={handleCheckIn} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.checkin")}</Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Reg.Card</Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Print FIT Registration Card</Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Reactive</Button>
                        <Button onClick={() => setIsVisibleAssign(true)} disabled={listGuestSelected.length === 0} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.assign")}</Button>
                        <Button onClick={() => setIsVisableMasterG(true)} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>{t("FRONTDESK.ROOMPLAN.setGroupMaster")}</Button>
                        <Button disabled={!ableToInput} onClick={() => setToggleModalInputRooming(true)} className={`${classes.styleBtn} mb-1 ml-1`}
                        >
                            {t("BOOKING.SEARCHVALUE.inputRoomingList")}
                        </Button>
                        <Button disabled={listGuestSelected.length === 0} className={`${classes.styleBtn} mb-1 ml-1`}
                            onClick={handleUnAssign}> {t("FRONTDESK.ROOMPLAN.unAssign")} </Button>
                        <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Queue Rooms</Button>

                    </div>
                    <TableSearchFrontDesk
                        propsOnChange={handleOnChange}
                        heightHeader={`${heightHeader + 85}px`}
                        dataSearchResults={dataSearchResults}
                        visible={loadingSearch}
                        titleDataSearchResults={titleDataSearchResults}
                        handleClickContextMenu=""
                        heightTable={`calc(${fullScreen} - (52px + ${paddingYPage} + ${navbar} + ${heightHeader}px) + 25px)`}
                    />
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
                                defaultChecked={checkedGRMaster}
                                style={{ fontSize: 16, color: "#00293B" }}
                                checked={checkedComment}
                                className="font-semibold"
                                onChange={(e) => setCheckedComment(e.target.checked)}
                            >
                                {t("BOOKING.SEARCHVALUE.doUWantAddCmtForTheRsvn")}
                            </Checkbox>
                        }
                    />
                    <div className={`table form-search w-full mt-4`} style={{ height: "30vh" }}>
                        <form onSubmit={onSubmit} className={`grid grid-cols-12 gap-x-2`}>
                            <label className="col-span-6 "></label>
                            {/* Nguyen Huy Thang: 4 Room and 8 Guests */}
                            <div className="col-span-6">
                                <div className="float-right">
                                    <CPagination
                                        current={inforPage.CurrentPage}
                                        pageSize={inforPage.PageSize}
                                        total={inforPage.TotalCount}
                                        onChange={(page, pageSize) => onPagination(page, pageSize)}
                                    />
                                </div>
                            </div>
                            <div className={`grid grid-cols-8 col-span-8`}>
                                <div className={`grid grid-cols-12 gap-2 col-span-8`}>
                                    <div className="col-span-4">
                                        <label className={classeForm.labelInput}>{t("BOOKING.firstname")}:</label>
                                        <Controller
                                            as={<Input {...register("firstName", {
                                                required: false,
                                                maxLength: 20,
                                                // pattern: /^[A-Za-z]+$/i,
                                            })} autoComplete='off' className={`${classeForm.input} w-full `}
                                            type="text" />} name="firstName" defaultValue="" control={control} />
                                    </div>

                                    <div className="col-span-4">
                                        <label className={classeForm.labelInput}>{t("BOOKING.lastname")}:</label>
                                        <Controller as={<Input {...register("guestName", {
                                            required: false,
                                            maxLength: 20,
                                            // pattern: /^[A-Za-z]+$/i,
                                        })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />} name="guestName" control={control} defaultValue={""} />
                                    </div>
                                    <div className="col-span-4 flex items-center mt-8">
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
                                </div>
                                <div className={`grid grid-cols-12 gap-2 col-span-8`}>
                                    <div className="col-span-4">
                                        <label className={classeForm.labelInput}>{t("BOOKING.groupOrBookingCode")}:</label>
                                        <Controller
                                            as={<Input {...register("groupCode", {
                                                required: false,
                                                maxLength: 20,
                                                // pattern: /^[A-Za-z]+$/i,
                                            })} autoComplete='off' className={`${classeForm.input} w-full `}
                                            type="text" />} name="groupCode" defaultValue="" control={control} />
                                    </div>
                                    <div className="col-span-4">
                                        <label className={classeForm.labelInput}>Birthday:</label>
                                        <Controller as={<Input {...register("birthday", {
                                            required: false,
                                            maxLength: 20,
                                            // pattern: /^[A-Za-z]+$/i,
                                        })} autoComplete='off' disabled className={`${classeForm.input} w-full`} type="text" />} name="birthday" control={control} defaultValue={""} />
                                    </div>
                                    <div className="col-span-3">
                                        <label className={classeForm.labelInput}>{t("BOOKING.rsvnNo")}:</label>
                                        <Controller as={<Input {...register("rsvnNo", {
                                            required: false,
                                            maxLength: 20,
                                            // pattern: /^[A-Za-z]+$/i,
                                        })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />}
                                        name="rsvnNo" control={control} defaultValue={""} />
                                    </div>
                                </div>
                                <div className={`grid grid-cols-12 gap-2 col-span-8`}>
                                    <div className="col-span-6">
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
                                    <div className="col-span-6">
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
                                </div>
                            </div>
                            <div className={`grid grid-cols-3 col-span-4 flex items-center`}>
                                <div className="grid grid-cols-4 col-span-4 gap-y-2">
                                    <Button disabled className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Help</Button>
                                    <Button
                                        htmlType="submit"
                                        style={{ display: "flex" }}
                                        className={`${classes.styleBtn} mb-1 ml-1 col-span-2 gap-1 justify-center items-center`}
                                    >
                                        <CIconSvg name="search" hexColor="#1A87D7" svgSize="medium" /> Search
                                    </Button>
                                    <Button className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Done</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </CLoading>
            }
        />
    )
}
export default React.memo(CheckInModal);