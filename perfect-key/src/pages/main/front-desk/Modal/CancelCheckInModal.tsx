/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Input, Radio } from "antd";
import { themeValue, useStyleTheme } from 'theme';
import { styleReservation } from 'pages/main/booking/reservation/styles/reservation';
import { styleCForm } from 'pages/main/booking/styles/styleCForm';
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import CIconSvg from "components/CIconSvg";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice";
import CModelTable from "components/CModalTable";
import { DataFormConfirm, ISearchResult } from "common/model-booking";
import TableSearchFrontDesk from "pages/main/front-desk/table/TableSearchFrontDesk";
import DatePicker from "components/CDatePicker";
import Utils from "common/utils";
import CPagination from "components/CPagination";
import { searchWithQueryParam, searchRequest } from "redux/controller";
import { IFormSearchReq } from "common/define-booking";
import FrontDeskService from "services/frontdesk/frontdesk.service";
import { ReservationStatus } from "common/enum/booking.enum";
import ModalInputRoomingList from "pages/main/booking/reservation/InputRoomingList/ModalInputRoomingList";
import CModelConfirm from "components/CModalConfirm";
import setStatusRSVN from "services/booking/statusRsvn/status.service";
import CConfirm from "components/CConfirm";

interface Props {
    showModalCancel: boolean,
    setShowModalCancel: React.Dispatch<React.SetStateAction<boolean>>,
    searchBy: number,
    dateArrival: Date[]

}
const CancelCheckinModal = ({ showModalCancel, setShowModalCancel, searchBy, dateArrival }: Props) => {
    const { fullScreen, navbar, paddingYPage } = themeValue.height;
    const classes = useStyleTheme(styleReservation);
    const classeForm = useStyleTheme(styleCForm);
    const dispatch = useDispatchRoot();
    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const { hotelId,numberOfRooms } = useSelectorRoot(state => state.app);
    const { dataSearchResults, loadingSearch, titleDataSearchResults, formSearch, inforPage, queryParam }
        = useSelectorRoot(state => state.booking);

    const { control, handleSubmit, register, getValues } = useForm();

    const [selectedRows, setSelectedRows] = useState<ISearchResult[]>([]);
    const [idRsvn, setIdRsvn] = useState<string>('');
    //const [transactRoomId, setTransactRoomId] = useState<string>('');
    const [isMainGuest, setIsMainGuest] = useState<boolean>(false);
    const [ableToInput, setAbleToInput] = useState<boolean>(false);
    const [dataTsRoom, setTransactRoomGuids] = useState<any[]>([]);
    const [heightHeader, setHeightHeader] = useState(65)
    const [isVisibleInputRooming, setIsVisibleInputRooming] = useState<boolean>(false);
    const [isShowCancel, setShowCancel] = useState<boolean>(false);
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
    }, [dispatch, filteredCompanyProfile.length, hotelId])

    const handleOnChange = (e: { select: ISearchResult[] }) => {
        setSelectedRows(e.select)
        const select = e.select;
        if (select.length > 0) {
            const getQueryParam = queryParam.find(x => x.guid === select[0].guid ?? "");
            const dataTransactRoomGuids: any[] = [];
            select.forEach(element => {
                dataTransactRoomGuids.push({
                    transactRoomId: element.guid ?? "",
                    status: getQueryParam?.status ?? 0,
                    totalRooms: 10
                })
            });
            setTransactRoomGuids(dataTransactRoomGuids);
        }
        if (select.length === 1) {
            setIdRsvn(select[0].parentGuid ?? "");
            //setTransactRoomId(select[0].guid ?? "");
            const isMain = select[0].parentMeGuid ? false : true;
            setIsMainGuest(isMain);
            setAbleToInput(true);
        } else {
            setIsMainGuest(false);
            setAbleToInput(false);
        }

    }
    const onSubmit = handleSubmit((formSearch: IFormSearchReq) => {
        if (formSearch.firstName && formSearch.guestName) {
            const dataSearchNyName = FrontDeskService.mapDataSearchByName(hotelId, formSearch, numberOfRooms);
            dispatch(searchRequest(dataSearchNyName));
        } else {
            const dataSearch = FrontDeskService.mapDataSearch(hotelId, formSearch, numberOfRooms);
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
    const handleCancel = async (isChild: boolean) => {
        const isStatus = getValues('status') === ReservationStatus.CheckIn ? ReservationStatus.Reservation : ReservationStatus.Cancel;
        const data = dataTsRoom.map((item) => ({
            ...item,
            status: isStatus
        }))
        const isCheckin = (getValues('status') === ReservationStatus.CheckIn && isChild === false) ? true : false;
        const IsIncludeChild = (isMainGuest === true && isChild === true) ? true : false;
        await FrontDeskService.setStatusGroup(data, IsIncludeChild, isCheckin);
        onSubmit();
    }
    return (
        <CModelTable
            title={"Search"}
            visible={showModalCancel}
            onCancel={() => setShowModalCancel(false)}
            width={"80%"}
            style={{ top: 10 }}
            isFooter={false}
            content={
                <div>
                    <div className="grid grid-cols-8">
                        <div className="col-span-3">
                            <Button
                                danger
                                onClick={() => setShowCancel(true)}
                                disabled={selectedRows.length === 0 ? true : false}
                                className={`${classes.styleBtn} ${classes.btnDanger} mb-1`}>
                                {t("FRONTDESK.ROOMPLAN.cancel")}
                            </Button>
                            <Button disabled={true} className={`${classes.styleBtn} mb-1 ml-1`}>{t("FRONTDESK.ROOMPLAN.folio")}</Button>
                            <Button disabled={true} className={`${classes.styleBtn} mb-1 ml-1`}>Add On</Button>
                        </div>
                        <div className="col-span-5 flex items-center justify-end">
                            <CPagination
                                current={inforPage.CurrentPage}
                                pageSize={inforPage.PageSize}
                                total={inforPage.TotalCount}
                                onChange={(page, pageSize) => onPagination(page, pageSize)}
                            />
                        </div>
                    </div>
                    <TableSearchFrontDesk
                        propsOnChange={handleOnChange}
                        heightHeader={`${heightHeader + 200}px`}
                        dataSearchResults={dataSearchResults}
                        visible={loadingSearch}
                        titleDataSearchResults={titleDataSearchResults}
                        handleClickContextMenu=""
                        heightTable={`calc(${fullScreen} - (52px + ${paddingYPage} + ${navbar} + ${heightHeader}px) + 30px)`}
                    />
                    {isVisibleInputRooming &&
                        <ModalInputRoomingList
                            toggleModalInputRooming={setIsVisibleInputRooming}
                            modalInputRoomingVisible={isVisibleInputRooming}
                            rsvnId={idRsvn}
                            getInHouse={false}
                            isInFrontDesk={false}
                            loadData={onSubmit}
                        />
                    }
                    <div className={`form-search mt-4`} style={{ height: "25vh" }}>
                        <form onSubmit={onSubmit} className={`grid grid-cols-12 gap-x-2`}>
                            <div className={`grid grid-cols-8 col-span-8 gap-x-2`}>
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
                                    <div className="col-span-3">
                                        <label className={classeForm.labelInput}>{t("BOOKING.lastname")}:</label>
                                        <Controller as={<Input {...register("guestName", {
                                            required: false,
                                            maxLength: 20,
                                            // pattern: /^[A-Za-z]+$/i,
                                        })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />}
                                        name="guestName" control={control} defaultValue={""} />
                                    </div>

                                    <div className="col-span-2">
                                        <label className={classeForm.labelInput}>{t("BOOKING.roomNo")}:</label>
                                        <Controller
                                            as={<Input {...register("room", {
                                                required: false,
                                                maxLength: 20,
                                                // pattern: /^[A-Za-z]+$/i,
                                            })} autoComplete='off' className={`${classeForm.input} w-full `}
                                            type="text" />} name="room" defaultValue="" control={control} />
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
                                </div>
                                <div className={`grid grid-cols-12 gap-2 col-span-8`}>
                                    <div className="col-span-3">
                                        <label className={classeForm.labelInput}>{t("BOOKING.groupOrBookingCode")}:</label>
                                        <Controller as={<Input {...register("guestName", {
                                            required: false,
                                            maxLength: 20,
                                            // pattern: /^[A-Za-z]+$/i,
                                        })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />}
                                        name="groupCode" control={control} defaultValue={""} />
                                    </div>
                                    <div className="col-span-4">
                                        <label className={classeForm.labelInput}>{t("BOOKING.arrival")}:</label>
                                        <Controller
                                            name="arrivalDates"
                                            defaultValue={dateArrival}
                                            control={control} render={({ onChange, value }) => (
                                                <div className="flex items-center">
                                                    <DatePicker
                                                        defaultValue={dateArrival[0]}
                                                        onClick={() => onChange({ ...value, isOpen: false })}
                                                        placeholder={t("BOOKING.from")}
                                                        className={classeForm.datePicker}
                                                        format={Utils.typeFormatDate()}
                                                        onChange={(date) => onChange({ ...value, from: date, isOpen: true })} />
                                                    <div style={{ width: "12px", padding: "0 4px" }} className="font-bold flex justify-center">~</div>
                                                    <DatePicker
                                                        defaultValue={dateArrival[1]}
                                                        open={value?.isOpen} placeholder={t("BOOKING.to")}
                                                        disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                        className={classeForm.datePicker}
                                                        format={Utils.typeFormatDate()}
                                                        onChange={(date,) => onChange({ ...value, to: date, isOpen: false })} />
                                                </div>
                                            )} />
                                    </div>
                                    <div className="col-span-4">
                                        <label className={classeForm.labelInput}>{t("BOOKING.departure")}:</label>
                                        <Controller
                                            name="departureDates"
                                            defaultValue={""}
                                            control={control} render={({ onChange, value }) => (
                                                <div className="flex items-center">
                                                    <DatePicker
                                                        onClick={() => onChange({ ...value, isOpen: false })}
                                                        placeholder={t("BOOKING.from")}
                                                        className={classeForm.datePicker}
                                                        format={Utils.typeFormatDate()}
                                                        onChange={(date) => onChange({ to: '', from: date, isOpen: true })} />
                                                    <div style={{ width: "12px", padding: "0 4px" }} className="font-bold flex justify-center">~</div>
                                                    <DatePicker
                                                        open={value?.isOpen} placeholder={t("BOOKING.to")}
                                                        disabledDate={(date) => (date && value?.from) && date < value?.from}
                                                        className={classeForm.datePicker}
                                                        format={Utils.typeFormatDate()}
                                                        onChange={(date,) => onChange({ ...value, to: date, isOpen: false })} />
                                                </div>
                                            )} />
                                    </div>
                                </div>
                            </div>
                            <div className={`grid grid-cols-3 col-span-4 gap-y-2`}>
                                <div className="col-span-3 ">
                                    <Controller
                                        control={control}
                                        name="status"
                                        defaultValue={searchBy}
                                        render={({ onChange }) => (
                                            <Radio.Group
                                                defaultValue={searchBy}
                                                className={`${classeForm.radioGroup} col-span-12 font-semibold text-base`}
                                                onChange={e => { onChange(e.target.value) }}
                                            >
                                                <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/3`} value={1}>{t("BOOKING.inHouse")}</Radio>
                                                <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/3`} value={2}>{t("BOOKING.history")}</Radio>
                                                <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/3`} value={0}>{t("BOOKING.reservation")}</Radio>
                                                <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/3`} value={4}>{t("BOOKING.noShow")}</Radio>
                                                <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/3`} value={3}>{t("BOOKING.cancelled")}</Radio>
                                                <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/3`} value={5}>{t("BOOKING.all")}</Radio>
                                            </Radio.Group>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-4 col-span-4 gap-y-2">
                                    <Button disabled={true} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Print</Button>
                                    <Button disabled={!ableToInput} onClick={() => setIsVisibleInputRooming(true)} className={`${classes.styleBtn} mb-1 ml-1 col-span-3`}>Input rooming list</Button>
                                    <Button
                                        htmlType="submit"
                                        style={{ display: "flex" }}
                                        className={`${classes.styleBtn} mb-1 ml-1 col-span-2 gap-1 justify-center items-center`}
                                    >
                                        <CIconSvg name="search" hexColor="#1A87D7" svgSize="medium" /> Search
                                    </Button>
                                    <Button disabled={true} className={`${classes.styleBtn} mb-1 ml-1 col-span-1`}>Show</Button>
                                    <Button danger className={`${classes.styleBtn} ${classes.btnDanger} mb-1 ml-1 col-span-1`}
                                        onClick={() => setShowModalCancel(false)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
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
            }
        />
    )
}
export default React.memo(CancelCheckinModal);