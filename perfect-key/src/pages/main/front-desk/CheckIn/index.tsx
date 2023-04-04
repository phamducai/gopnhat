/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import CGuestProfileEdit from "pages/main/booking/reservation/editReservation/GuestProfileEdit";
//import CGuestScheduleCheckIn from './GuestScheduleCheckIn';
import CGuestScheduleCheckInT from "pages/main/booking/reservation/editReservation/GuestScheduleEdit";
import { useStyleTheme } from 'theme';
import { Button, Checkbox, Modal } from "antd";
import CIconSvg from "components/CIconSvg";
import { useForm } from 'react-hook-form';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { useHistory, useParams } from 'react-router-dom';
import CReservationCommentEdit from 'pages/main/booking/reservation/editReservation/ReservationCommentEdit';
import { useEffect } from 'react';
import { styleEditReservation } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { useState } from 'react';
import search from 'services/search/search.service';
import GuestProfileService from 'services/booking/guestprofile.service';
import { setDataFoextraCharge,setDateRsvn, companyProfilesFilterByInput } from 'redux/controller/reservation.slice';
import { guestProfileInBookingRSVN } from 'redux/controller/booking.slice';
import FixChargesService from 'services/booking/fixcharges.service';
import { useTranslation } from "react-i18next"
import { Helmet } from 'react-helmet';
import { DataCEditRsvn, TrRoomHistory } from 'common/model-rsvn';
import CLoading from 'components/CLoading';
import ReservationService from 'services/reservation/reservation.service.';
import Utils from 'common/utils';
import { TypeStateHistory } from 'common/model-rsvn-edit';
import { RoomsInARoomType } from 'common/model-inventory';
import { IParamCheckIn } from 'common/model-booking';
import CModel from 'components/CModal';
import { TracerMessageModal } from 'components/CModalTracerAndMessage/TracerMessageModal';
import { AlertModal } from 'components/CModalTracerAndMessage/CModalAlert';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import GLobalPkm from 'common/global';
import { addDays } from 'date-fns';
import CHeaderRSVNLeft from 'components/CRsvn/CHeaderRSVNLeft';
import CHandleProfile from 'components/CRsvn/CHandleProfileAndCompany';
import CompanyService from 'services/booking/company.service';
import { resetTraceInHouse, setTraceInHouse, setTraceInHouseRequest } from 'redux/controller/trace.slice';
import CModalTraceInHouse from 'components/CTrace/CModalTraceInHouse';
import { TypeActionCode } from 'common/enum/tracer.enum';

const CheckIn = (): JSX.Element => {
    const history = useHistory();
    const classes = useStyleTheme(styleEditReservation);
    const dispatch = useDispatchRoot();
    const { hotelId, hotelName } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { guestProfile } = useSelectorRoot(state => state.booking);
    const { data, filteredCompanyProfile, dataFoextraCharge } = useSelectorRoot(state => state.rsvn);
    const { queryParamRoomPlan, alertMessage } = useSelectorRoot(state => state.roomPlan);
    const { t } = useTranslation("translation")
    const { trRoomGuid }: any = useParams();
    const { confirm } = Modal;
    const { handleSubmit, control, getValues, setValue } = useForm();
    
    const [paymentExpenses, setPaymentExpenses] = useState<string>("");
    const [isMainGuest, setIsMainGuest] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
    const [dataEditRsvn, setDataEditRsvn] = useState<DataCEditRsvn>();
    const [dataHistory, setDataHistory] = useState<TrRoomHistory | null>(null);
    const [dataTsRoom, setDataTsRoom] = useState<IParamCheckIn[]>([]);
    const [userCreate, setUserCreate] = useState<string>("");
    const [roomListType, setRoomListType] = useState<RoomsInARoomType[] | []>([]);
    const [roomNameGuid] = useState<string>("");
    const [isShowMConfirm, setShowMConfirm] = useState<boolean>(false);
    const [checkedCheckin, setCheckedCheckin] = useState<boolean>(true);
    const [isFirst, setIsFirst] = useState<boolean>(false);
    const [stateHistory, setStateHistory] = useState<TypeStateHistory>({ rsvnNo: "", status: "" })
    const [isTracerModal, setIsTracerModal] = useState<boolean>(false);
    const [isAlertModal, setIsAlertModal] = useState<boolean>(false);
    const [titleAlert, setTitleAlert] = useState<string>("");
    const [guestId, setGuestId] = useState<string>("");
    const [typeTracerNumber, setTypeTracerNumber] = useState<number>(0);

    //drawer
    const [visibleCompanyProfile, setVisibleCompanyProfile] = useState<boolean>(false);
    const [visibleGuestProfile, setVisibleGuestProfile] = useState<boolean>(false);
    const [visibleTraceInHouse, setVisibleTraceInHouse] = useState<boolean>(false);
    

    useEffect(() => {
        setValue("firstName", guestProfile.firstName)
        setValue("lastName", guestProfile.guestName)
        if(guestProfile.companyGuid && guestProfile.companyGuid !== ""){
            setValue("companyAgentGuid", guestProfile.companyGuid);
        }
    }, [guestProfile, setValue])
    

    useEffect(() => {
        const mapDataInput = async () => {
            try {
                const resDataCEditRsvn = await search.getDataTsRoomByGuid(trRoomGuid);
                if (resDataCEditRsvn) {
                    const res = resDataCEditRsvn.dataTrRoom;
                    const guestId = res.dataFotransactRoomDTO ? res.dataFotransactRoomDTO.guestId ?? "" : "";
                    setGuestId(guestId)
                    const resGuest = await GuestProfileService.getGuestProfileByGuid(guestId);// get infor Guest Profile
                    if (resGuest) { // set value input
                        setValue("firstName", resGuest.firstName);
                        setValue("lastName", resGuest.guestName);
                    }
                    if(res.dataFotransactRoomDTO.companyAgentGuid && res.dataFotransactRoomDTO.companyAgentGuid !== ""){
                        const respCompany = await CompanyService.getCompanyByGuid(res.dataFotransactRoomDTO.companyAgentGuid);
                        dispatch(companyProfilesFilterByInput([respCompany]))
                    }

                    const mapData: any = Object.assign({}, res.dataFotransactRoomDTO);// copy new JSON
                    Object.keys(mapData).forEach(function (key) { // set value input
                        if (key.toString() !== "specialsCodes" && key.toString() !== "room" && mapData[key] !== GLobalPkm.defaultBytes32) {
                            setValue(key, mapData[key]);
                        }
                    });
                    const departureDate = new Date(res.dataFotransactRoomDTO.departureDate ?? "");
                    const arrivalDate = new Date(res.dataFotransactRoomDTO.arrivalDate ?? "");
                    const nights = Utils.dateDiffInDays(arrivalDate,departureDate);
                    setValue("nights", nights);
                    const cutOfDate = new Date(res.dataFotransactRoomDTO.cutOfDate ?? "");
                    if(cutOfDate > GLobalPkm.dateDeflaut){
                        setValue("cod", Utils.dateDiffInDays(cutOfDate, arrivalDate));
                    }else{
                        setValue("cod", 0);
                    }
                    const changeObjectSpecials = JSON.parse(res.dataFotransactRoomDTO.specialsCodes !== null ? res.dataFotransactRoomDTO.specialsCodes : JSON.stringify({ specialsCodes: [] }));
                    setValue('specialsCodes', changeObjectSpecials?.specialsCodes)
                    if(res?.dataForeservationDTO){
                        const resBookeName = await GuestProfileService.getGuestProfileByGuid(res.dataForeservationDTO.bookedBy ?? "");
                        setValue("bookedBy", `${resBookeName?.firstName ?? ""} ${resBookeName?.guestName ?? ""}`);
                        setValue("bookByPhone", res.dataForeservationDTO.bookByPhone);
                        setValue("bookByEmail", res.dataForeservationDTO.bookByEmail);
                        setValue("bookByFax", res.dataForeservationDTO.bookByFax);
                    }
                    setRoomListType(await RoomPlanService.getListRoomsByRoomType(hotelId, [res.dataFotransactRoomDTO.roomType ?? ""]));
                    setValue("room", resDataCEditRsvn.dataTrsGroup.mappingRoomId);

                    if(res?.dataFoextraCharges){
                        const totalFixCharge = FixChargesService.setTotalAmountFixCharge(res.dataFoextraCharges);
                        dispatch(setDataFoextraCharge({ totalFixCharge, dataFoextraCharge: res.dataFoextraCharges}));
                        dispatch(setDateRsvn({ arrivalDate, departureDate, newNumberNight: nights, defineNight: nights }))
                    }else{
                        dispatch(setDataFoextraCharge({ totalFixCharge : 0, dataFoextraCharge: []}));
                    }
                    if(resGuest){
                        dispatch(guestProfileInBookingRSVN(resGuest));
                    }
                    setPaymentExpenses(resDataCEditRsvn.paymentExpences ?? (stateHistory?.rsvnNo ?? 0));
                    setUserCreate(res.dataFotransactRoomDTO.nguoiDung2 ?? "");
                    setDataEditRsvn(res);
                    setDataHistory(resDataCEditRsvn.dataHistory);
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
        if (trRoomGuid) {
            setIsLoading(true);
            if(data){
                mapDataInput();
            }
            if(history.location.state){
                const state: any = history.location.state;
                const listParamCheckin = state.listParamCheckin as IParamCheckIn[];
                const getParam = listParamCheckin.find(x => x.mainTsRoom === trRoomGuid);
                setValue("room", getParam?.roomName ?? "")
                setDataTsRoom(listParamCheckin);
                setIsMainGuest(state.isMain);
                setIsFirst(state.isFirst ?? false);
                setStateHistory({
                    rsvnNo: getParam?.rsvnNo ?? "",
                    status: getParam?.status ?? ""
                })
            }
        }
        return () => {
            setShowMConfirm(false);
            setIsLoadingBtn(false);
            dispatch(resetTraceInHouse(""))// reset trace in house to default value
        }
    }, [trRoomGuid, data, setValue, hotelId, stateHistory?.rsvnNo, dispatch, history.location.state])
    
    useEffect(() => {
        if(alertMessage && guestId === alertMessage.guest){
            showConfirm()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[alertMessage, guestId])
    
    const onSubmit = handleSubmit((data: any) => {
        checkInToRSVN(data);
    })
    const checkInToRSVN = async (data: any) => {
        setIsLoadingBtn(true);
        dispatch(setTraceInHouse({
            actionCode : TypeActionCode.CheckIn,
            objectId: dataEditRsvn?.dataFotransactRoomDTO.id ?? 0,
            oldString: "Reservation",
            newString: "Check in",
            oldDate: new Date(dataEditRsvn?.dataFotransactRoomDTO.arrivalDate ?? "") ?? new Date(),
            newDate: new Date(),
            hotelGuid: hotelId
        }))
        if(dataEditRsvn){
            data.arrivalDate = Utils.convertMiddleDate(businessDate);
            data.specialsCodes = data.specialsCodes ? '{"specialsCodes" : ' + JSON.stringify(data.specialsCodes) + "}" : null;
            const convertData = ReservationService.mapDataEditReservation(data, dataEditRsvn, dataFoextraCharge, false);
            const cutOfDate: Date = new Date(data.arrivalDate);
            if(parseInt(data.cod) === 0){
                convertData.dataFotransactRoomDTO.cutOfDate = Utils.convertMiddleDate(new Date("1900-01-01"));
            }else{
                convertData.dataFotransactRoomDTO.cutOfDate = Utils.convertMiddleDate(addDays(cutOfDate, -parseInt(data.cod)));
            }
            ReservationService.mapDataGuestProfile(data.firstName,data.lastName,guestProfile, dataEditRsvn.dataFotransactRoomDTO.guestId ?? "");
            await ReservationService.checkInToRsvn([trRoomGuid], convertData, isMainGuest);
            let dataFilter: IParamCheckIn[] = dataTsRoom;
            if(checkedCheckin){
                dataFilter = dataFilter.filter(x => x.parentMeGuid === null);
            }
            dispatch(setTraceInHouseRequest(""))
            const tsRoom = dataFilter.slice(1);
            if(tsRoom.length > 0){
                const isMainG = tsRoom[0].parentMeGuid !== null ? false : true;
                const countShared = tsRoom.filter(x => x.roomName === tsRoom[0].roomName);
                const title = !isMainG ? `Room ${tsRoom[0].roomName} found ${countShared.length} shared guest(s), do you want to check in continue?` : `Check in next room ${tsRoom[0].roomName}`;
                Modal.confirm({
                    title: <label style={{ color: "#00293B", fontWeight: "bold" }}>{title}</label>,
                    okText: "Continue",
                    cancelText: t("FRONTDESK.ROOMPLAN.no"),
                    className: "custom-modal-confirm-pkm",
                    onOk() {
                        history.push(`/main/front-desk/check-in/${tsRoom[0].mainTsRoom}`, 
                            {listParamCheckin : tsRoom, isFirst : false , isMain : isMainG });
                    },
                    onCancel() {
                        history.push(`/main/front-desk/room-plan${queryParamRoomPlan}`);
                    }
                });

                
            }
            else{
                history.push(`/main/front-desk/room-plan${queryParamRoomPlan}`);
            }
            setShowMConfirm(false);
            setIsLoadingBtn(false);
        }
    }
    const handleClickFolio = () => {
        const fullName = `${getValues("firstName") ?? ""} ${getValues("lastName") ?? ""}`;
        const getQuery = history.location.search.split("=")[1];
        const isMain = getQuery === 'true' ? true : false;
        const roomS = roomListType?.find(x => x.roomType === getValues("roomType"));
        const roomNumber = roomS?.rooms.find(x => x.guid === getValues("room"))?.so;
        history.push(`/main/cashier/folio/${dataEditRsvn?.dataFotransactRoomDTO.guid}`,
            { 
                fullName: fullName, tsRomGuid : trRoomGuid, 
                roomNumber: roomNumber, 
                guestGuid: dataEditRsvn?.dataFotransactRoomDTO.guestId, status: dataEditRsvn?.dataFotransactRoomDTO.status,
                parentMeGuid: isMain ? null : ""
            }
        )
    }
    const showConfirm =()=> {
        const dateForm = alertMessage && alertMessage.dateFrom ? Utils.convertToVNTimeZoneMbyMoment(alertMessage?.dateFrom) : ""
        const dateTo = alertMessage && alertMessage.dateTo ? Utils.convertToVNTimeZoneMbyMoment(alertMessage?.dateTo) : ""
        confirm({
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
    //Handle New Tracer 
    const handleNewTracer = () => {
        setIsTracerModal(true)
    }
    const handleNewAlert = (tilte: string, type: number) => {
        setTypeTracerNumber(type)
        setTitleAlert(tilte)
        setIsAlertModal(true)
    }
    return (
        <div className={`custom-scrollbar-pkm ${classes.main}`} style={{ height: "calc( 100vh - 64px)", color: "#00293B" }}>
            <Helmet>
                <title>{hotelName} - Check in</title>
            </Helmet>
            <form onSubmit={onSubmit}>
                <div className={` flex justify-between my-4`}>
                    <div className={` flex items-center justify-center`}>
                        <div className={`${classes.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`} onClick={() => {
                            history.goBack();
                        }}>
                            <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                        </div>
                        <label className="m-0 text-base	font-bold ml-3">Check In</label>
                    </div>
                    <CHeaderRSVNLeft
                        handleNewTracer={handleNewTracer}
                        handleClickFolio={handleClickFolio}
                        handleNewAlert={handleNewAlert}
                        isCheckIn={dataEditRsvn ? dataEditRsvn.dataFotransactRoomDTO.status !== 0 : true}
                        showDrawer={() => setVisibleCompanyProfile(true)}
                        handleTracerInHouse={() => setVisibleTraceInHouse(true)}
                    />
                </div>
                <CLoading visible={isLoading}>
                    <div className={`${classes.headerInfo} flex my-4 justify items-center`}>
                        <label className="mr-4 font-semibold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.rsvnNo")}: {stateHistory.rsvnNo}</label>
                        <label className="mx-4 font-semibold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.paymentExpences")}: {paymentExpenses}</label>
                        <label className="font-semibold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.user")}: {userCreate}</label>
                        <label className="mx-4 font-semibold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.status")}:
                            <span style={{ color: '#1A87D7' }}> Res: {stateHistory.status}</span>
                        </label>
                    </div>
                    <div className={`grid grid-cols-2 gap-4`}>
                        <div style={{ position: 'unset' }} className={`xl:col-span-1 col-span-2 grid grid-cols-1 grid-cols gap-2`}>
                            <CGuestProfileEdit
                                openDrawerGuestProfile={() => setVisibleGuestProfile(true)}
                                data={data}
                                getValues={getValues}
                                setValue={setValue}
                                filteredCompanyProfile={filteredCompanyProfile}
                                control={control}
                                dataEditRsvn={dataEditRsvn}
                                className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-first`}
                            />
                            <CReservationCommentEdit control={control} dataEditRsvn={dataEditRsvn}/>
                        </div>
                        <div className={`xl:col-span-1 col-span-2 grid grid-cols-1`}>
                            <CGuestScheduleCheckInT
                                isEdit={true}
                                inHouse={false}
                                data={data}
                                getValues={getValues}
                                setValue={setValue}
                                filteredCompanyProfile={filteredCompanyProfile}
                                control={control}
                                dataHistory={dataHistory ?? null}
                                roomListType={roomListType}
                                roomTypeGuid={dataEditRsvn?.dataFotransactRoomDTO.roomType ?? ""}
                                roomNameGuid={roomNameGuid}
                                setRoomListType={setRoomListType}
                                isMainGuest={isMainGuest}
                                isMain={isMainGuest}
                                dataEditRsvn={dataEditRsvn}
                                className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-3 xl:order-1 !py-4`}
                            />
                        </div>
                        <div className="xl:col-span-2 md:col-span-2 flex justify-end gap-3 py-4 md:order-last">
                            <Button style={{ color: "#F74352", border: "1px solid #F74352" }} className={`!rounded-md ${classes.buttonStyle}`} onClick={() => {
                                history.goBack();
                            }}>Cancel</Button>
                            <Button type="primary" loading={isLoadingBtn} onClick={() => setShowMConfirm(true)} 
                                htmlType={isFirst ? "button" : "submit"} className={`!rounded-md ${classes.buttonStyle}`}>
                                Check In
                            </Button>
                        </div>
                    </div>
                </CLoading>
                {isFirst ? 
                    <CModel
                        title={`Do you want check in for shared guest ?`}
                        visible={isShowMConfirm}
                        onOk={() => onSubmit()}
                        onCancel={() => setShowMConfirm(false)}
                        isLoading={isLoadingBtn}
                        content={
                            <Checkbox 
                                checked={checkedCheckin}
                                onChange={(e) => setCheckedCheckin(e.target.checked)}
                            >
                                Checkin for shared guest
                            </Checkbox>
                        }
                    /> 
                    : ""}
            </form>
            <CHandleProfile 
                visibleGuestProfile={visibleGuestProfile}
                visibleCompanyProfile={visibleCompanyProfile}
                setVisibleGuestProfile={setVisibleGuestProfile}
                setVisibleCompanyProfile={setVisibleCompanyProfile}
            />
            {isTracerModal &&<TracerMessageModal
                title={t("BOOKING.RESERVATION.chooseInHouse")}
                isShowModal={isTracerModal}
                setIsShowModal={setIsTracerModal}
                isTracer={true}
            />}
            {isAlertModal && <AlertModal
                titleAlert={titleAlert}
                isAlertModal={isAlertModal}
                setIsAlertModal={setIsAlertModal}
                flagType={typeTracerNumber}
                inHouseGuid={(dataEditRsvn && dataEditRsvn.dataFotransactRoomDTO.guid) ? dataEditRsvn.dataFotransactRoomDTO.guid : null}
                guest={(dataEditRsvn && dataEditRsvn.dataFotransactRoomDTO.guestId) ? dataEditRsvn.dataFotransactRoomDTO.guestId : null}
            />}
            {visibleTraceInHouse && 
                <CModalTraceInHouse 
                    isShowModal={visibleTraceInHouse}
                    setShowModal={setVisibleTraceInHouse}
                    tsRoomId={dataEditRsvn?.dataFotransactRoomDTO.id ?? 0}
                />
            }
        </div>
    );
};

export default CheckIn;