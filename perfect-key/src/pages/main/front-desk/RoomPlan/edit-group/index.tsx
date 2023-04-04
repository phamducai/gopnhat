/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import CGuestProfileEdit from 'pages/main/booking/reservation/editReservation/GuestProfileEdit';
import { useStyleTheme } from 'theme';
import { Button } from "antd";
import CIconSvg from "components/CIconSvg";
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { useHistory, useParams } from 'react-router-dom';
import CReservationCommentEdit from 'pages/main/booking/reservation/editReservation/ReservationCommentEdit';
import CGuestScheduleEditGroup from 'pages/main/booking/reservation/editReservation/GuestScheduleEdit';
import { useEffect } from 'react';
import { styleEditReservation } from 'pages/main/booking/reservation/editReservation/styles/index.style';
import { useState } from 'react';
import search from 'services/search/search.service';
import GuestProfileService from 'services/booking/guestprofile.service';
import { setDataFoextraCharge, setDateRsvn, companyProfilesFilterByInput } from 'redux/controller/reservation.slice';
import { guestProfileInBookingRSVN } from 'redux/controller/booking.slice';
import FixChargesService from 'services/booking/fixcharges.service';

import { useTranslation } from "react-i18next"
import { Helmet } from 'react-helmet';
import { DataCEditRsvn, TrRoomHistory } from 'common/model-rsvn';
import CLoading from 'components/CLoading';
import ReservationService from 'services/reservation/reservation.service.';
import Utils from 'common/utils';
import { RoomsInARoomType } from 'common/model-inventory';
import { TypeStateHistory } from 'common/model-rsvn-edit';
import RoomPlanService from 'services/frontdesk/roomplan.service';
import GLobalPkm from 'common/global';
import { useForm } from 'react-hook-form';
import { addDays } from 'date-fns';
import CHeaderRSVNLeft from 'components/CRsvn/CHeaderRSVNLeft';
import CompanyService from 'services/booking/company.service';
import CHandleProfile from 'components/CRsvn/CHandleProfileAndCompany';
import CModelTracerTo from 'components/CModalAlert/CModalTracerTo';
import { AlertModal } from 'components/CModalTracerAndMessage/CModalAlert';
import CModalTraceInHouse from 'components/CTrace/CModalTraceInHouse';

interface IParam {
    rsvnId: string
}
const EditGroupInHouse = () => {
    const history = useHistory();
    const classes = useStyleTheme(styleEditReservation);
    const dispatch = useDispatchRoot();
    const { hotelId, hotelName } = useSelectorRoot(state => state.app);
    const { data, dataFoextraCharge } = useSelectorRoot(state => state.rsvn);
    const { guestProfile } = useSelectorRoot(state => state.booking);
    const { handleSubmit, control, getValues, setValue } = useForm();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
    const [dataEditRsvn, setDataEditRsvn] = useState<DataCEditRsvn>();
    const [dataHistory, setDataHistory] = useState<TrRoomHistory | null>(null);
    const [roomListType, setRoomListType] = useState<RoomsInARoomType[] | []>([]);
    const [roomNameGuid, setRoomNameGuid] = useState<string>("");
    const [inHouse, setInHouse] = useState<boolean>(false);
    const [paymentExpenses, setPaymentExpenses] = useState<string>("");
    const [userCreate, setUserCreate] = useState<string>("");
    const [stateHistory,setStateHistory] = useState<TypeStateHistory>({
        rsvnNo: "",
        status: "",
    })
    
    //drawer
    const [visibleCompanyProfile, setVisibleCompanyProfile] = useState<boolean>(false);
    const [visibleGuestProfile, setVisibleGuestProfile] = useState<boolean>(false);
    const [visibleTraceInHouse, setVisibleTraceInHouse] = useState<boolean>(false);

    //tracer
    const [isTracerModal, setIsTracerModal] = useState<boolean>(false);
    const [isAlertModal, setIsAlertModal] = useState<boolean>(false);
    //const [isControlTracer, setIsControlTracer] = useState<boolean>(false);
    const [titleAlert, setTitleAlert] = useState<string>("");
    const [typeTracerNumber, setTypeTracerNumber] = useState<number>(0);

    const param: IParam = useParams();
    const { t } = useTranslation("translation");

    useEffect(() => {
        setValue("firstName", guestProfile.firstName)
        setValue("lastName", guestProfile.guestName)
        if(guestProfile.companyGuid && guestProfile.companyGuid !== ""){
            setValue("companyAgentGuid", guestProfile.companyGuid);
        }
    }, [guestProfile, setValue])

    useEffect(() => {
        const mapDataInput = async (trRoomGuid: string, roomGuid: string, status: string) => {
            try {
                const resDataCEditRsvn = await search.getDataTsRoomByGuid(trRoomGuid, true);
                if (resDataCEditRsvn) {
                    const res = resDataCEditRsvn.dataTrRoom;
                    const guestId = res.dataFotransactRoomDTO ? res.dataFotransactRoomDTO.guestId ?? "" : "";
                    const resGuest = await GuestProfileService.getGuestProfileByGuid(guestId);// get infor Guest Profile

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
                        if (mapData[key] !== null && key.toString() !== "specialsCodes" && key.toString() !== "nights" && mapData[key] !== GLobalPkm.defaultBytes32) {
                            setValue(key, mapData[key]);
                        }
                    });

                    const departureDate = new Date(res.dataFotransactRoomDTO.departureDate ?? "");
                    const arrivalDate = new Date(res.dataFotransactRoomDTO.arrivalDate ?? "");
                    const nights = Utils.differenceInDays(res.dataFotransactRoomDTO.departureDate ?? "", res.dataFotransactRoomDTO.arrivalDate ?? "");
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
                        const resBookeName = await GuestProfileService.getGuestProfileByGuid(res.dataForeservationDTO.bookedBy ?? "");
                        setValue("bookedBy", `${resBookeName?.firstName ?? ""} ${resBookeName?.guestName ?? ""}`);
                        setValue("bookByPhone", res.dataForeservationDTO.bookByPhone);
                        setValue("bookByEmail", res.dataForeservationDTO.bookByEmail);
                        setValue("bookByFax", res.dataForeservationDTO.bookByFax);
                    }
                    if(roomGuid !== GLobalPkm.defaultBytes32 && roomGuid !== ""){
                        const rresRoom = await RoomPlanService.getListRoomsByRoomType(hotelId, [res.dataFotransactRoomDTO.roomType ?? ""]);
                        setRoomListType(rresRoom);
                        setValue("room", roomGuid);
                    } else{
                        setRoomListType([]);
                    }
                    if(status === "CheckIn"){
                        setValue("ciTime", Utils.convertToVNTimeZoneMbyMoment(res.dataFotransactRoomDTO.arrival ?? ""));
                        setInHouse(true);
                    }
                    if(status === "CheckOut"){
                        setValue("coTime", Utils.convertToVNTimeZoneMbyMoment(res?.dataFotransactRoomDTO.departure ?? ""));
                    }
                    setPaymentExpenses(resDataCEditRsvn.paymentExpences ?? (stateHistory?.rsvnNo ?? 0));
                    if (res?.dataFoextraCharges) {
                        const totalFixCharge = FixChargesService.setTotalAmountFixCharge(res.dataFoextraCharges);
                        dispatch(setDataFoextraCharge({ totalFixCharge, dataFoextraCharge: res.dataFoextraCharges }));
                        dispatch(setDateRsvn({ arrivalDate, departureDate, newNumberNight: nights, defineNight: nights }))
                    } else {
                        dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));
                    }
                    if (resGuest) {
                        dispatch(guestProfileInBookingRSVN(resGuest));
                    }
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
        const stateHistory: any = history.location.state;
        if (stateHistory) {
            setStateHistory({
                rsvnNo: stateHistory?.rsvnNo ?? 0,
                status: stateHistory?.status ?? 0
            })
        }
        if (param) {
            mapDataInput(param.rsvnId, stateHistory?.roomGuid ?? "", stateHistory?.status ?? 0);
            setRoomNameGuid(stateHistory?.roomGuid ?? "");
        }
        return () => {
            setIsLoadingBtn(false);
        }
    }, [dispatch, history.location.state, hotelId, param, setValue])

    const onSubmit = handleSubmit( async (data: any) => {
        setIsLoadingBtn(true);
        if (dataEditRsvn) {
            data.specialsCodes = data.specialsCodes ? '{"specialsCodes" : ' + JSON.stringify(data.specialsCodes) + "}" : null;
            const convertData = ReservationService.mapDataEditReservation(data, dataEditRsvn, dataFoextraCharge,true);
            const cutOfDate: Date = new Date(data.arrivalDate);
            if(parseInt(data.cod) === 0){
                convertData.dataFotransactRoomDTO.cutOfDate = Utils.convertMiddleDate(new Date("1900-01-01"));
            }else{
                convertData.dataFotransactRoomDTO.cutOfDate = Utils.convertMiddleDate(addDays(cutOfDate, -parseInt(data.cod)));
            }
            ReservationService.mapDataGuestProfileGroup(dataEditRsvn.dataForeservationDTO.guid ?? "",data.firstName, data.lastName, guestProfile);
            await ReservationService.updateGroupReservation(convertData);
            history.goBack();
        }
    })
    const handleClickFolio = () => {
        const fullName = `${getValues("firstName") ?? ""} ${getValues("lastName") ?? ""}`;
        const getQuery = history.location.search.split("=")[1];
        const isMain = getQuery === 'true' ? true : false;
        const roomS = roomListType?.find(x => x.roomType === getValues("roomType"));
        const roomNumber = roomS?.rooms.find(x => x.guid === getValues("room"))?.so;
        history.push(`/main/cashier/folio/${dataEditRsvn?.dataFotransactRoomDTO.guid}`,
            { 
                fullName: fullName, tsRomGuid : param.rsvnId, 
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
                    <title>{hotelName} - Edit Group InHouse</title>
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
                        handleTracerInHouse={() => setVisibleCompanyProfile(true)}
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
                                openDrawerGuestProfile={(e: boolean) => setVisibleGuestProfile(e)}
                                data={data}
                                getValues={getValues}
                                setValue={setValue}
                                control={control}
                                dataEditRsvn={dataEditRsvn}
                                className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-first`}
                            />
                            <CReservationCommentEdit control={control} dataEditRsvn={dataEditRsvn}/>
                        </div>
                        <div className={`xl:col-span-1 col-span-2 grid grid-cols-1`}>
                            <CGuestScheduleEditGroup
                                isEdit={true}
                                data={data}
                                getValues={getValues}
                                setValue={setValue}
                                control={control}
                                dataHistory={dataHistory ?? null}
                                roomListType={roomListType}
                                roomTypeGuid={dataEditRsvn?.dataFotransactRoomDTO.roomType ?? ""}
                                roomNameGuid={roomNameGuid}
                                setRoomListType={setRoomListType}
                                inHouse={inHouse}
                                isMain={true}
                                dataEditRsvn={dataEditRsvn}
                                className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-3 xl:order-1 !py-4`}
                            />
                        </div>
                        <div className="xl:col-span-2 md:col-span-2 flex justify-end gap-3 py-4 md:order-last">
                            <Button style={{ color: "#F74352", border: "1px solid #F74352" }} className={`!rounded-md ${classes.buttonStyle}`} onClick={() => {
                                history.goBack();
                            }}>{t("BOOKING.RESERVATION.EDITRESERVATION.close")}</Button>
                            <Button loading={isLoadingBtn} type="primary" className={`!rounded-md ${classes.buttonStyle}`} htmlType="submit">{t("BOOKING.RESERVATION.EDITRESERVATION.submit")}</Button>
                        </div>
                    </div>
                </CLoading>
            </form>
            <CHandleProfile 
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

export default React.memo(EditGroupInHouse);
