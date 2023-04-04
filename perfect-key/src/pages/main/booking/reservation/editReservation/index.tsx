/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import CGuestProfileEdit from './GuestProfileEdit';
import { useStyleTheme } from 'theme';
import { Button, Radio } from "antd";
import CIconSvg from "components/CIconSvg";
import { useForm } from 'react-hook-form';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import CReservationCommentEdit from './ReservationCommentEdit';
import CGuestScheduleEdit from './GuestScheduleEdit';
import { styleEditReservation } from './styles/index.style';
import { useState } from 'react';
import search from 'services/search/search.service';
import GuestProfileService from 'services/booking/guestprofile.service';
import { companyProfilesFilterByInput, setDataFoextraCharge, setDateRsvn } from 'redux/controller/reservation.slice';
import { guestProfileInBookingRSVN } from 'redux/controller/booking.slice';
import FixChargesService from 'services/booking/fixcharges.service';
import { Controller } from 'react-hook-form';
import { useTranslation } from "react-i18next"
import CLoading from 'components/CLoading';
import CModel from 'components/CModal';
import ReservationService from 'services/reservation/reservation.service.';
import { DataCEditRsvn, TrRoomHistory } from 'common/model-rsvn';
import GLobalPkm from 'common/global';
import { RoomsInARoomType } from 'common/model-inventory';
import { TypeStateHistory } from 'common/model-rsvn-edit';
import Utils from 'common/utils';
import { Helmet } from 'react-helmet';
import { TypeTracer } from 'common/enum/cashier.enum';
import { AlertModal } from 'components/CModalTracerAndMessage/CModalAlert';
import CModelTracerTo from 'components/CModalAlert/CModalTracerTo';
import FrontDeskService from 'services/frontdesk/frontdesk.service';
import { setAlertMessage } from 'redux/controller';
import { searchWithQueryParam } from "redux/controller";
import { TransactRoomsGroup } from 'common/define-booking';
import { addDays } from 'date-fns';
import CompanyService from 'services/booking/company.service';
import CHeaderRSVNLeft from 'components/CRsvn/CHeaderRSVNLeft';
import CHandleProfileAndCompany from 'components/CRsvn/CHandleProfileAndCompany';
import { resetTraceInHouse, setCommonInforTsRoom, setTraceInHouseRequest } from 'redux/controller/trace.slice';
import CModalTraceInHouse from 'components/CTrace/CModalTraceInHouse';
interface ItrRoomGuid {
    trRoomGuid: string
}
const EditReservation = () => {
    const history = useHistory();
    const classes = useStyleTheme(styleEditReservation);
    const dispatch = useDispatchRoot();
    const { hotelId, hotelName } = useSelectorRoot(state => state.app);
    const { data, dataFoextraCharge} = useSelectorRoot(state => state.rsvn);
    const { numberOfRooms} = useSelectorRoot(state => state.app);
    const { guestProfile, formSearch } = useSelectorRoot(state => state.booking);
    const { handleSubmit, control, getValues, setValue } = useForm();
    const param: ItrRoomGuid = useParams();
    const { t } = useTranslation("translation");

    const location = useLocation();
    const getQuery = location.search.split("=")[1];
    const isMain = getQuery === 'true' ? true : false;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
    const [isShowMConfirm, setShowMConfirm] = useState<boolean>(false);
    const [dataEditRsvn, setDataEditRsvn] = useState<DataCEditRsvn | null>(null);
    const [dataHistory, setDataHistory] = useState<TrRoomHistory | null>(null);
    const [roomListType, setRoomListType] = useState<RoomsInARoomType[] | []>([]);
    const [paymentExpenses, setPaymentExpenses] = useState<string>("");
    const [stateHistory,setStateHistory] = useState<TypeStateHistory>({rsvnNo: "",status: "", isTableSearch : false})
    const [isTracerModal, setIsTracerModal] = useState<boolean>(false);
    const [isAlertModal, setIsAlertModal] = useState<boolean>(false);
    //const [isControlTracer, setIsControlTracer] = useState<boolean>(false);
    const [titleAlert, setTitleAlert] = useState<string>("");
    const [typeTracerNumber, setTypeTracerNumber] = useState<number>(0);
    //const [arrivalDate, setArrivalDate] = useState<Date>(new Date())
    //const [departureDate, setDepartureDate] = useState<Date>(new Date())
    const [tsRoomGroup, setTsRoomGroup] = useState<TransactRoomsGroup | null>(null);

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
        const mapDataInput = async (trRoomGuid: string, status: string) => {
            try {
                const resDataCEditRsvn = await search.getDataTsRoomByGuid(trRoomGuid);
                if (resDataCEditRsvn) {
                    const res = resDataCEditRsvn.dataTrRoom;

                    const resGuest = await GuestProfileService.getGuestProfileByGuid(res.dataFotransactRoomDTO.guestId ?? GLobalPkm.defaultBytes32);// get infor Guest Profile
                    if(res.dataFotransactRoomDTO.companyAgentGuid && res.dataFotransactRoomDTO.companyAgentGuid !== ""){
                        const respCompany = await CompanyService.getCompanyByGuid(res.dataFotransactRoomDTO.companyAgentGuid);
                        dispatch(companyProfilesFilterByInput([respCompany]))
                    }
                    if (resGuest) { // set value input
                        setValue("firstName", resGuest.firstName);
                        setValue("lastName", resGuest.guestName);
                    }
                    const mapData: any = Object.assign({}, res.dataFotransactRoomDTO);// copy new JSON
                    Object.keys(mapData).forEach(function (key) { // set value input
                        if (mapData[key] !== null && key.toString() !== "specialsCodes" && key.toString() !== "nights" && key.toString() !== "room" && mapData[key] !== GLobalPkm.defaultBytes32) {
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
                    if (res?.dataForeservationDTO) {
                        if(res.dataForeservationDTO.bookedBy){
                            const resBookeName = await GuestProfileService.getGuestProfileByGuid(res.dataForeservationDTO.bookedBy ?? "");
                            setValue("bookedBy", `${resBookeName?.firstName ?? ""} ${resBookeName?.guestName ?? ""}`);
                            setValue("bookByPhone", res.dataForeservationDTO.bookByPhone);
                            setValue("bookByEmail", res.dataForeservationDTO.bookByEmail);
                            setValue("bookByFax", res.dataForeservationDTO.bookByFax);
                        }
                    }


                    if(status !== 'Reservation'){
                        setValue("ciTime", Utils.convertToVNTimeZoneMbyMoment(res.dataFotransactRoomDTO.arrival ?? ""));
                        if(status === 'CheckOut'){
                            setValue("coTime", Utils.convertToVNTimeZoneMbyMoment(res.dataFotransactRoomDTO.departure ?? ""));
                        }
                    }
                    setValue("room", resDataCEditRsvn.dataTrsGroup.mappingRoomId)
                    setPaymentExpenses(resDataCEditRsvn.paymentExpences ?? (stateHistory?.rsvnNo ?? 0));
                    if (res?.dataFoextraCharges) {
                        const totalFixCharge = FixChargesService.setTotalAmountFixCharge(res.dataFoextraCharges);
                        dispatch(setDataFoextraCharge({ totalFixCharge, dataFoextraCharge: res.dataFoextraCharges }));
                        dispatch(setDateRsvn({ arrivalDate, departureDate, newNumberNight: nights, defineNight: nights }))
                    } else {
                        dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));
                    }
                    if (resGuest) {
                        dispatch(guestProfileInBookingRSVN(resGuest));// dispatch infor guest up store redux
                        
                        // dispatch infor transaction for room trace in house
                        dispatch(setCommonInforTsRoom({
                            tsRoomId: res.dataFotransactRoomDTO.id ?? 0,
                            arrivalDate: arrivalDate,
                            departureDate: departureDate,
                            status: res.dataFotransactRoomDTO.status ?? 0
                        }))
                    }
                    setDataEditRsvn(res);
                    setDataHistory(resDataCEditRsvn.dataHistory);
                    setTsRoomGroup(resDataCEditRsvn.dataTrsGroup);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }
        const stateHistory: any = history.location.state;
        if (stateHistory) {
            setStateHistory({
                rsvnNo: stateHistory?.rsvnNo ?? 0,
                status: stateHistory?.status ?? 0,
                isTableSearch: stateHistory?.isTableSearch ?? false
            })
        }
        if (param) {
            mapDataInput(param.trRoomGuid, stateHistory?.status ?? 0);
        }
        return () => {
            setShowMConfirm(false);
            setIsLoadingBtn(false);
            dispatch(resetTraceInHouse(""))// reset trace in house to default value
        }
    }, [dispatch, history.location.state, hotelId, param, setValue])
    const onSubmit = handleSubmit((data: any) => {
        updateEditRsvn(data)
    })
    const updateEditRsvn = async (data: any) => {
        setIsLoadingBtn(true);
        const isExtraGuest = data.optionRange === 0 ? false : true;
        const isGroup = data.optionRange === 2 ? true : false;
        
        if (dataEditRsvn) {
            data.specialsCodes = data.specialsCodes ? '{"specialsCodes" : ' + JSON.stringify(data.specialsCodes) + "}" : null;

            const roomType = roomListType?.find(x => x.roomType === data.roomType);

            const convertData = ReservationService.mapDataEditReservation(data, dataEditRsvn, dataFoextraCharge,isGroup);
            convertData.dataRoomGroup.roomName = roomType?.rooms.find(x => x.guid === convertData.dataRoomGroup.roomNameGuid)?.so ?? "";
            convertData.dataRoomGroup.roomTypeName = numberOfRooms.find(x => x.id === convertData.dataRoomGroup.roomTypeGuid)?.name ?? "";
            const cutOfDate: Date = new Date(data.arrivalDate);
            if(parseInt(data.cod) === 0){
                convertData.dataFotransactRoomDTO.cutOfDate = Utils.convertMiddleDate(new Date("1900-01-01"));
            }else{
                convertData.dataFotransactRoomDTO.cutOfDate = Utils.convertMiddleDate(addDays(cutOfDate, -parseInt(data.cod)));
            }
            ReservationService.mapDataGuestProfile(data.firstName, data.lastName, guestProfile, dataEditRsvn.dataFotransactRoomDTO.guestId ?? "");
            if(isGroup){
                await ReservationService.updateGroupReservation(convertData);
            }
            else{
                await ReservationService.updateTsRoomByGuid(convertData, param.trRoomGuid, isExtraGuest);
            }
            dispatch(setTraceInHouseRequest(""))
            if(stateHistory.isTableSearch === true){
                dispatch(searchWithQueryParam({
                    ...formSearch,
                    listRoomType: numberOfRooms
                }));
            }
            history.goBack();
        }
    }
    const handleClickFolio = async () => {
        const fullName = `${getValues("firstName") ?? ""} ${getValues("lastName") ?? ""}`;
        const getQuery = history.location.search.split("=")[1];
        const isMain = getQuery === 'true' ? true : false;
        const roomS = roomListType?.find(x => x.roomType === getValues("roomType"));
        const roomNumber = roomS?.rooms.find(x => x.guid === getValues("room"))?.so;
        const res =  await FrontDeskService.getMessageAlert(param.trRoomGuid, TypeTracer.AlertCheckOut, hotelId)
        if(typeof res !== "string"){
            res && dispatch(setAlertMessage(res))
        }
        history.push(`/main/cashier/folio/${dataEditRsvn?.dataFotransactRoomDTO.guid}`,
            { 
                fullName: fullName, tsRomGuid : param.trRoomGuid, 
                roomNumber: roomNumber, 
                guestGuid: dataEditRsvn?.dataFotransactRoomDTO.guestId, status: dataEditRsvn?.dataFotransactRoomDTO.status,
                parentMeGuid: isMain ? null : ""
            }
        )
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
            <form onSubmit={onSubmit}>
                <Helmet>
                    <title>{hotelName} - Edit Reservation</title>
                </Helmet>
                <div className={`flex justify-between my-4`}>
                    <div className={` flex items-center justify-center`}>
                        <div className={`${classes.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`} onClick={() => {
                            history.goBack();
                        }}>
                            <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                        </div>
                        <label className="m-0 text-base	font-bold ml-3">{t("BOOKING.RESERVATION.EDITRESERVATION.editReservation")}</label>
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
                        <label className="font-semibold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.user")}: {dataEditRsvn?.dataFotransactRoomDTO.nguoiDung2 ?? ""}</label>
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
                                control={control}
                                dataEditRsvn={dataEditRsvn}
                                className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-first`}
                            />
                            <CReservationCommentEdit control={control} dataEditRsvn={dataEditRsvn} />
                        </div>
                        <div className={`xl:col-span-1 col-span-2 grid grid-cols-1`}>
                            <CGuestScheduleEdit
                                isEdit={true}
                                data={data}
                                getValues={getValues}
                                setValue={setValue}
                                control={control}
                                dataHistory={dataHistory ?? null}
                                roomListType={roomListType}
                                roomTypeGuid={dataEditRsvn?.dataFotransactRoomDTO.roomType ?? ""}
                                roomNameGuid={tsRoomGroup?.mappingRoomId ?? ""}
                                setRoomListType={setRoomListType}
                                inHouse={tsRoomGroup?.status === 1 ? true : false}
                                isMain={isMain}
                                dataEditRsvn={dataEditRsvn}
                                className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-3 xl:order-1 !py-4`}
                            />
                        </div>
                        <div className="xl:col-span-2 md:col-span-2 flex justify-end gap-3 py-4 md:order-last">
                            <Button style={{ color: "#F74352", border: "1px solid #F74352" }} className={`!rounded-md ${classes.buttonStyle}`} onClick={() => {
                                history.goBack();
                            }}>{t("BOOKING.RESERVATION.EDITRESERVATION.close")}</Button>
                            <Button type="primary" className={`!rounded-md ${classes.buttonStyle}`} onClick={() => setShowMConfirm(true)}>{t("BOOKING.RESERVATION.EDITRESERVATION.submit")}</Button>
                        </div>
                    </div>
                </CLoading>
                <CModel
                    title={t("BOOKING.RESERVATION.EDITRESERVATION.titleRangeEditRSVN")}
                    visible={isShowMConfirm}
                    onOk={() => onSubmit()}
                    onCancel={() => setShowMConfirm(false)}
                    isLoading={isLoadingBtn}
                    content={
                        <Controller
                            control={control}
                            defaultValue={1}
                            name="optionRange"
                            render={({ onChange }) => (
                                <Radio.Group
                                    className={`text-base`}
                                    defaultValue={1}
                                    onChange={e => {
                                        onChange(e.target.value);
                                    }}
                                >
                                    <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} value={1}>
                                        {t("BOOKING.RESERVATION.EDITRESERVATION.optionAppyExtraGuest")}
                                    </Radio>
                                    <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} value={0}>
                                        {t("BOOKING.RESERVATION.EDITRESERVATION.optionOnlyGuest")}
                                    </Radio>
                                    <Radio style={{ color: "#00293B", marginBottom: "20px" }} className={`w-full`} value={2}>
                                        {t("BOOKING.RESERVATION.EDITRESERVATION.optionApplyForGroup")}
                                    </Radio>
                                </Radio.Group>
                            )}
                        />
                    }
                />
            </form>
            <CHandleProfileAndCompany 
                visibleGuestProfile={visibleGuestProfile}
                visibleCompanyProfile={visibleCompanyProfile}
                setVisibleGuestProfile={setVisibleGuestProfile}
                setVisibleCompanyProfile={setVisibleCompanyProfile}
            />
            {isTracerModal && dataEditRsvn ? <CModelTracerTo
                title={t("BOOKING.RESERVATION.chooseInHouse")}
                isShowModal={isTracerModal}
                setIsShowModal={setIsTracerModal}
                dataRsvn={dataEditRsvn}
            /> : ""}
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

export default React.memo(EditReservation);
