/* eslint-disable */
import CModel from 'components/CModal';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { useStyleTheme } from 'theme';
import { Input, InputNumber, Select } from 'antd';
import { addDays, differenceInDays } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import TableShedule from "../../booking/reservation/guestSchedule/CTableSchedule";
import Checkbox from 'antd/lib/checkbox/Checkbox';
import CIconSvg from 'components/CIconSvg';
import { companyProfilesFilterByInputRequest, fetchNumberOfRooms, ReservatedRoomsEachRoomType, setAccountNameFixCharge, setDataFoextraCharge, setSelectedBookingRoomType } from 'redux/controller/reservation.slice';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import DatePicker from 'components/CDatePicker';
import { NewReservationData, SelectedBookingRoomType } from 'common/model-rsvn';
import { fetchReservatedRooms } from 'redux/controller/reservation.slice';
import PkmApi from 'api/pkm/pkm.api';
import { MasterAndMemberProfiles } from 'common/model-profile';
import { cloneDeep } from 'lodash';
import MASTER_AND_MEMBER_PROFILES from 'common/const/masterAndMemberProfilesDefaultValue';
import Utils from 'common/utils';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import GLobalPkm from 'common/global';
import rSVN_DEFAULT_DATA from 'common/const/newRSVNDefaultValue';
import { TypeReservaion } from 'common/enum/booking.enum';
import { useHistory } from 'react-router-dom';
import ProfileApi from 'api/profile/prf.api';
import { RoomsInARoomType } from 'common/model-inventory';
import InventoryApi from 'api/inv/inv.api';
import { guestProfileInBookingRSVN } from 'redux/controller';
import GUEST_PROFILE_DEFAULT_VALUE from 'common/const/guestProfileDefaultValue';
import CLoading from 'components/CLoading';

interface PropsNewAllotmentModal {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isShowModal: boolean,
}
interface RSVNFormData {
    arrivalDate: Date,
    bookByEmail?: string,
    bookByFax?: string,
    bookByPhone?: string,
    bookedBy?: string,
    bookingCode?: string
    cod?: number,
    comment?: string
    companyAgentGuid?: string
    confirmed?: boolean
    departureDate: Date,
    firstName: string,
    isNet: boolean,
    isNoBkf: boolean,
    lastName: string
    nights?: number
    packageCodes?: string | null,
    paymentMethod?: string,
    printRate: boolean,
    rateCode?: string,
    resChanel?: string,
    resMarket?: string,
    resOrigin?: string,
    resSource?: string,
    resType?: string,
    specialsCodes?: string | null,
    title: string,
    isSeperate: boolean,
    dateFrom: Date,
    dateTo: Date
}
export const NewAllotmentModal = ({ setShowModal, isShowModal }: PropsNewAllotmentModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const dispatch = useDispatchRoot();
    const { t } = useTranslation("translation");
    const history = useHistory();
    const [arrivalDate, setArrivalDate] = useState(addDays(new Date(), 1));
    const [listRsvn, setListRsvn] = useState<NewReservationData[]>([])
    const [departureDate, setDepartureDate] = useState(addDays(new Date(), 30));
    const [nights, setNights] = useState(differenceInDays(departureDate, arrivalDate));
    const [checked, setChecked] = useState<boolean>(false);
    const [roomTypeInfos, setRoomTypeInfos] = useState<SelectedBookingRoomType[]>([{
        key: '-1',
        Roomtype: 'Deluxe',
        Available: 12,
        Rooms: 0,
        Guest: 0,
        Rate: 12413321,
        Edit: "",
        TotalRooms: 0,
        roomTypeGuid: ""
    }]);
    const [isFinishData, setIsFinishData] = useState<boolean>(false);
    const { guestProfile } = useSelectorRoot(state => state?.booking);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { getBookingByRsvnId, reservatedRooms, numberOfRooms, data, loading } = useSelectorRoot(state => state?.rsvn);
    const { filteredCompanyProfile, roomTypesidnCounts } = useSelectorRoot(state => state.rsvn);

    const [loadingBtn, setLoadingBtn] = useState(false);
    const { control, setValue, getValues, handleSubmit } = useForm();
    const typingTimeoutRef = React.useRef(0);

    const onCancel = () => {
        setShowModal(false)
    }
    const handleChecked = (value: boolean) => {
        setChecked(value);
    }
    const fetchData = async () => {
        setLoadingBtn(true);
        dispatch(fetchNumberOfRooms({
            hotelGuid: hotelId
        }))
        setValue("cutOfDate", 0);
        setLoadingBtn(false);
    }
    const onSetArrivalDateChange = (dateValue: any) => {
        setNights(differenceInDays(departureDate, dateValue) + 1);
        setArrivalDate(dateValue);
    }
    const onSetDepartureDateChange = (dateValue: any) => {
        setDepartureDate(dateValue);
        setNights(differenceInDays(dateValue, arrivalDate) + 1)
    }

    const renderSelect = (data: any, isGuidValue = true) => {
        return data?.map((item: any) => {
            return (
                <Select.Option value={isGuidValue ? item.guid : item.ten} key={item.guid}>{item.ten}</Select.Option>
            )
        })
    }

    useEffect(() => {
        if (numberOfRooms.length > 0 && arrivalDate && departureDate) {
            const lstRoomTypes: string[] = [];
            numberOfRooms.forEach((item) => {
                lstRoomTypes.push(item.id);
            })
            //const roomtypeIds = JSON.stringify(lstRoomTypes).slice(1, -1) 
            dispatch(fetchReservatedRooms({
                roomTypes: lstRoomTypes,
                arivalDay: arrivalDate,
                depatureDay: departureDate
            }));
        }
    }, [arrivalDate, departureDate, hotelId, dispatch, numberOfRooms])


    const transformData = (obj: any, destination: any) => {
        Object?.keys(destination)?.map(key => {
            if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined)
                destination[key] = obj[key];
            return null;
        });
    }
    const newRsvnRequest = async (data: RSVNFormData, tempArrival: Date, tempDeparture: Date) => {
        const masterAndMemberProfiles: MasterAndMemberProfiles = cloneDeep(MASTER_AND_MEMBER_PROFILES);
        // set master profile
        // transformData(profileFormData.main, masterAndMemberProfiles.masterProfile);
        // transformData(profileFormData.more, masterAndMemberProfiles.masterProfile);

        // set member profile

        // duplicate master profile in member profile
        // change when has Create Member profile UI
        transformData(guestProfile, masterAndMemberProfiles.masterProfile);
        masterAndMemberProfiles.masterProfile.firstName = filteredCompanyProfile.find(x => x.guid === data.companyAgentGuid)?.ten ?? "";


        if (Utils.isNullOrEmpty(masterAndMemberProfiles.masterProfile.firstName)) {
            openNotification(NotificationStatus.Warning, "Please fill out required fields in Guest Profile!", "");
            setLoadingBtn(false);
            return;
        }
        else {
            if (roomTypesidnCounts?.length === 0) {
                openNotification(NotificationStatus.Warning, "You haven't selected rooms!", "");
                setLoadingBtn(false);
                return;
            }
            data = { ...data, arrivalDate: tempArrival, departureDate: tempDeparture };
            data.arrivalDate = Utils.middayTime(new Date(data.arrivalDate.getTime()));
            data.departureDate = Utils.middayTime(new Date(data.departureDate.getTime()));

            data.printRate = true;
            data.resSource = GLobalPkm.defaultBytes32;
            data.confirmed = false;
            data.specialsCodes = null;
            data.packageCodes = GLobalPkm.defaultBytes32;
            const rsvnData: NewReservationData = {
                ...rSVN_DEFAULT_DATA,
                dataFoextraCharges: { ...rSVN_DEFAULT_DATA.dataFoextraCharges },
                dataFotransactRoomDTO: { ...rSVN_DEFAULT_DATA.dataFotransactRoomDTO },
                flyInfor: { ...rSVN_DEFAULT_DATA.flyInfor },
                dataForeservationDTO: { ...rSVN_DEFAULT_DATA.dataForeservationDTO },
                pickup: { ...rSVN_DEFAULT_DATA.pickup },
                roomTypeidnCounts: [],
            };
            // transform data - Mapping data
            transformData(data, rsvnData.dataFotransactRoomDTO);
            transformData(data, rsvnData.dataForeservationDTO);

            // set COD int value to DateTime value
            const cutOfDate: Date = new Date();
            const tmp = data.cod ? data.cod : 0;
            cutOfDate.setDate(data.arrivalDate.getDate() - tmp);

            // set cutOfDate value
            rsvnData.dataFotransactRoomDTO.cutOfDate = cutOfDate;

            // set hotelId to appropriate field in each object
            rsvnData.dataFotransactRoomDTO.hotelGuid = hotelId;
            rsvnData.dataFotransactRoomDTO.nguoiDung2 = Utils.getValueLocalStorage("username");//thang_dev
            // rsvnData.dataFoextraCharge.hotelGuid = hotelId;
            rsvnData.dataForeservationDTO.hotelGuid = hotelId;
            rsvnData.dataForeservationDTO.flagType = TypeReservaion.ReservationGroup;
            rsvnData.pickup.hotelGuid = hotelId;
            rsvnData.flyInfor.hotelGuid = hotelId;
            rsvnData.dataFoextraCharges = [];

            // set roomTypeidnCounts
            let countGuests = 0;
            // var arrRoomTypesidnCounts = Object.keys(roomTypesidnCounts).map((key: any) => roomTypesidnCounts[key])
            const lstRoomTypes: string[] = [];
            roomTypesidnCounts.forEach((item: SelectedBookingRoomType) => {
                // this is key for resolve null positive
                item.roomTypeGuid && lstRoomTypes.push(item.roomTypeGuid);
                rsvnData.roomTypeidnCounts.push({
                    roomType: item.roomTypeGuid,
                    count: item.Rooms,
                    guestGuid: [],
                    maxPerson: 4,
                    totalRooms: item.TotalRooms,
                    rate: item.Rate,
                    mappingRooms: []
                });
                countGuests += item.Guest * item.Rooms;
            })

            // set Reservated Date
            rsvnData.dataForeservationDTO.reservationDate = Utils.convertToVNTimeZone(new Date());

            // set some DateTime value that not null
            rsvnData.dataForeservationDTO.ccexpDate = Utils.convertToVNTimeZone(new Date());

            const historyState: any = history.location.state;
            let isSet = false;
            if (historyState?.isSelectedProfile) {
                isSet = true;
            }
            else {
                isSet = false;
            }
            countGuests--;
            masterAndMemberProfiles.masterProfile.hotelGuid = hotelId;
            for (let i = 0; i < countGuests; i++) {
                masterAndMemberProfiles.memberProfiles.push({ ...masterAndMemberProfiles.masterProfile })
            }


            // call api to set masterGuestGuid and guestGuid
            const res = await ProfileApi.postMasterProfileAndMemberProfiles(!isSet, masterAndMemberProfiles).toPromise();

            rsvnData.masterGuestGuid = res?.masterGuestGuid;
            //res?.masterGuestGuid ? rsvnData.guestGuid.push(res?.masterGuestGuid) : "";
            rsvnData.dataForeservationDTO.bookedBy = res?.masterGuestGuid;
            // Set guestGuid
            const len = roomTypesidnCounts.length;
            let begin = 0;
            const allGuestGuid: string[] = [];
            allGuestGuid.push(res.masterGuestGuid ?? '');
            allGuestGuid.push(...res.guestGuid);

            for (let i = 0; i < len; i++) {
                rsvnData.roomTypeidnCounts[i].guestGuid = allGuestGuid?.slice(begin, begin + roomTypesidnCounts[i].Guest * roomTypesidnCounts[i].Rooms);
                begin += roomTypesidnCounts[i].Guest * roomTypesidnCounts[i].Rooms;
            }
            const roomsInRoomTypes: RoomsInARoomType[] = await InventoryApi.getRoomsInRoomTypes(hotelId, lstRoomTypes) || [];
            roomsInRoomTypes?.forEach((item: RoomsInARoomType) => {
                const tmp = rsvnData.roomTypeidnCounts.find(x => x.roomType === item.roomType);
                tmp && (tmp.mappingRooms = item.rooms.map((x) => {
                    return { roomGuid: x.guid, roomName: x.so }
                }));
            })

            if (data.isSeperate) {
                setListRsvn((list) => [...list, rsvnData]);
            }
            else {
                const newRes = await PkmApi.newReservation(rsvnData).toPromise()
                if (newRes) {
                    resetRoomBooking();
                    openNotification(NotificationStatus.Success, "New allotment successful!", "")
                    setLoadingBtn(false)
                }
                dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));// reset data fixcharge when new success
                dispatch(setAccountNameFixCharge({ accountName: "ACCOUNT NAME", dataSelectedFixcharge: [] }));// reset data fixcharge when new success 
            }
        }
    }

    const newRsvn = async (data: RSVNFormData) => {
        try {
            setLoadingBtn(true)
            const countDay = differenceInDays(data.dateTo, data.dateFrom);
            let tempArrival = data.dateFrom,
                tempDeparture = addDays(data.dateFrom, 1);
            const promiseArr = []
            if (data.isSeperate) {
                const masterAndMemberProfiles: MasterAndMemberProfiles = cloneDeep(MASTER_AND_MEMBER_PROFILES);
                // set master profile
                // transformData(profileFormData.main, masterAndMemberProfiles.masterProfile);
                // transformData(profileFormData.more, masterAndMemberProfiles.masterProfile);

                // set member profile

                // duplicate master profile in member profile
                // change when has Create Member profile UI
                transformData(guestProfile, masterAndMemberProfiles.masterProfile);
                masterAndMemberProfiles.masterProfile.firstName = filteredCompanyProfile.find(x => x.guid === data.companyAgentGuid)?.ten ?? "";


                if (Utils.isNullOrEmpty(masterAndMemberProfiles.masterProfile.firstName)) {
                    openNotification(NotificationStatus.Warning, "Please fill out required fields in Guest Profile!", "");
                    setLoadingBtn(false);
                    return;
                }
                else {
                    if (roomTypesidnCounts?.length === 0) {
                        openNotification(NotificationStatus.Warning, "You haven't selected rooms!", "");
                        setLoadingBtn(false);
                        return;
                    }
                    else {
                        for (let i = 0; i <= countDay; i++) {
                            promiseArr.push(newRsvnRequest(data, tempArrival, tempDeparture));
                            tempArrival = addDays(tempArrival, 1);
                            tempDeparture = addDays(tempDeparture, 1);
                        }
                        Promise.all(promiseArr).then(() => setIsFinishData(true));
                    }
                }
            }
            else {
                newRsvnRequest(data, arrivalDate, departureDate)
            }
        } catch (error) {
            console.log(error);
            openNotification(NotificationStatus.Error, "Error when booking a reservation!", "");
        }
    }

    const newAllotmentRequest = async () => {
        try {
            setLoadingBtn(true)
            const res = await PkmApi.newAllotment(listRsvn).toPromise()
            if (res) {
                openNotification(NotificationStatus.Success, "New Allotment successful!", "");
                setShowModal(false);
                resetRoomBooking();
                setLoadingBtn(false);
            }
        } catch (error) {
            console.log(error);
            openNotification(NotificationStatus.Error, "Error when booking a reservation!", "");
            setLoadingBtn(false)
        } finally {
            setLoadingBtn(false)
        }
    }
    useEffect(() => {
        if (isFinishData) {
            newAllotmentRequest();
        };
    }, [isFinishData])

    const resetRoomBooking = () => {
        dispatch(setSelectedBookingRoomType([]));
        dispatch(guestProfileInBookingRSVN({ ...GUEST_PROFILE_DEFAULT_VALUE }));
        setIsFinishData(false);
        setShowModal(false);
    }

    const onSearch = (val: any) => {
        val.length > 0 ? val = val : val = "g";
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: val
            }))
        }, 300)
    }

    const findMaxxReservatedRoom = () => {
        //setTimeout(() => {
        const tmpRoomInfos: SelectedBookingRoomType[] = [];
        numberOfRooms.forEach((element, index) => {
            const filtered = reservatedRooms.filter((item: ReservatedRoomsEachRoomType) => item.roomTypesCount[element.id]?.length > 0 ? true : false);
            let maxx = 0;
            filtered.sort((a: ReservatedRoomsEachRoomType, b: ReservatedRoomsEachRoomType) => {
                return b.roomTypesCount[element.id].filter((item: any) => item.status < 2).length - a.roomTypesCount[element.id].filter((item: any) => item.status < 2).length;
            })
            maxx = filtered[0] ? filtered[0].roomTypesCount[element.id].filter((item: any) => item.status < 2).length : 0;
            // filtered.forEach((item: any) => {
            //     let len = item.roomTypesCount[element.id].length;
            //     if(len > maxx){
            //         maxx = len;
            //     }
            // });
            tmpRoomInfos.push(
                {
                    key: index.toString(),
                    Roomtype: element.name,
                    Available: element.count - maxx,
                    Rooms: 0,
                    Guest: 0,
                    Rate: 0,
                    Edit: "",
                    TotalRooms: element.count,
                    roomTypeGuid: element.id
                }
            )
        });
        setRoomTypeInfos(tmpRoomInfos);
    }

    useEffect(() => {
        if (numberOfRooms.length > 0 && arrivalDate && departureDate) {
            const lstRoomTypes: string[] = [];
            numberOfRooms.forEach((item) => {
                lstRoomTypes.push(item.id);
            })
            //const roomtypeIds = JSON.stringify(lstRoomTypes).slice(1, -1) 
            dispatch(fetchReservatedRooms({
                roomTypes: lstRoomTypes,
                arivalDay: arrivalDate,
                depatureDay: departureDate
            }));
        }
    }, [arrivalDate, departureDate, hotelId, dispatch, numberOfRooms])

    useEffect(() => {
        findMaxxReservatedRoom();
    }, [reservatedRooms])


    useEffect(() => {
        isShowModal && fetchData();
        //eslint-disable-next-line
    }, [isShowModal])

    return (
        <CModel
            style={{ top: "3%", paddingTop: "0px", paddingBottom: "0px" }}
            isLoading={loadingBtn}
            visible={isShowModal}
            title={t("MISCELLANEOUS.newAllotment")}
            onCancel={onCancel}
            width={"80%"}
            onOk={() => console.log("submit")}
            myForm='new-allotment'
            content={
                <CLoading visible={loading}>
                    <form id="new-allotment" className='custom-scrollbar-pkm' onSubmit={handleSubmit(newRsvn)}>
                        <div className="grid grid-cols-12 gap-1 gap-y-2">
                            <div className="col-span-2 flex items-center">
                                <label>{t("BOOKING.SEARCHVALUE.from")}</label>
                            </div>
                            <div className="col-span-2">
                                <Controller
                                    name="dateFrom"
                                    render={({ onChange, value }) =>
                                        <DatePicker className={`${classes.datePicker} h-8`} value={value} onChange={(e) => {
                                            onChange(e);
                                            onSetArrivalDateChange(e)
                                        }} />
                                    }
                                    control={control} defaultValue={arrivalDate} />
                            </div>
                            <div className="col-span-1 flex items-center">
                                <label>{t("BOOKING.SEARCHVALUE.to")}</label>
                            </div>
                            <div className="col-span-2">
                                <Controller
                                    name="dateTo"
                                    render={({ onChange, value }) =>
                                        <DatePicker className={`${classes.datePicker} h-8`} value={value} onChange={(e) => {
                                            onChange(e)
                                            onSetDepartureDateChange(e)
                                        }} />
                                    }
                                    control={control} defaultValue={departureDate} />
                            </div>
                            <div className="col-span-3 flex items-center">
                                <Controller
                                    name="isSeperate"
                                    render={({ onChange, value }) =>
                                        <Checkbox className={``} checked={value} onChange={(e) => onChange(e.target.checked)} >Seperate Booking</Checkbox>
                                    }
                                    control={control} defaultValue={false} />
                            </div>
                            <div className="col-span-1 flex items-center">
                                <label>{t("PRINT.FORM.cutOfDate")}</label>
                            </div>
                            <div className="col-span-1 flex align-middle">
                                <Controller
                                    name="cutOfDate"
                                    render={({ onChange, value }) =>
                                        <InputNumber className={`${classes.input}  hiden-handler-wrap`} value={value} onChange={(e) => onChange(e)} />
                                    }
                                    control={control} defaultValue={""} />
                            </div>
                            <div className="col-span-2 flex items-center">
                                <label>{t("BOOKING.RESERVATION.EDITRESERVATION.companyOrAgent")}</label>
                            </div>
                            <div className="col-span-10">
                                <Controller
                                    name='companyAgentGuid' control={control}
                                    defaultValue={""}
                                    render={({ onChange, value }) => (
                                        <Select
                                            showSearch
                                            onSearch={onSearch}
                                            filterOption={false}
                                            bordered={false} className={`${classes.input} p-0 w-full h-10`}
                                            style={{ display: "flex", alignItems: "center", padding: "0" }}
                                            // Company field is a drop down.
                                            suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />} placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.selectCompany")}
                                            value={value} onChange={e => onChange(e)} >
                                            <Select.Option value=""> </Select.Option>
                                            {renderSelect(filteredCompanyProfile)}
                                        </Select>
                                    )} />
                            </div>
                            <div className="col-span-2 flex items-center">
                                <label>{t("BOOKING.RESERVATION.rateCode")}</label>
                            </div>
                            <div className="col-span-4">
                                <Controller
                                    name='rateCode' control={control}
                                    defaultValue={""}
                                    render={({ onChange, value }) => (
                                        <Select
                                            showSearch
                                            onSearch={onSearch}
                                            filterOption={false}
                                            bordered={false} className={`${classes.input} p-0 w-full h-10`}
                                            style={{ display: "flex", alignItems: "center", padding: "0" }}
                                            // Company field is a drop down.
                                            suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />} placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.selectCompany")}
                                            value={value} onChange={e => onChange(e)} >
                                            <Select.Option value=""> </Select.Option>
                                            {renderSelect(data.rateCodes)}
                                        </Select>
                                    )} />
                            </div>
                            <div className="col-span-1 flex justify-center items-center">
                                <label>{t("CASHIER.payment")}</label>
                            </div>
                            <div className="col-span-5">
                                <Controller
                                    name='payment' control={control}
                                    defaultValue={""}
                                    render={({ onChange, value }) => (
                                        <Select
                                            showSearch
                                            onSearch={onSearch}
                                            filterOption={false}
                                            bordered={false} className={`${classes.input} p-0 w-full h-10`}
                                            style={{ display: "flex", alignItems: "center", padding: "0" }}
                                            // Company field is a drop down.
                                            suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />} placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.selectCompany")}
                                            value={value} onChange={e => onChange(e)} >
                                            <Select.Option value=""> </Select.Option>
                                            {renderSelect(data.paymentMethods)}
                                        </Select>
                                    )} />
                            </div>
                            <div className="col-span-2 flex items-center">
                                <label>{t("BOOKING.RESERVATION.EDITRESERVATION.roomType")}</label>
                            </div>
                            <div className="col-span-10">
                                <TableShedule nights={nights} getGuestProfile={getBookingByRsvnId} data={roomTypeInfos} checked={checked} handleChecked={handleChecked} />
                            </div>
                            <div className="col-span-2 flex items-center">
                                <label>{t("BOOKING.RESERVATION.EDITRESERVATION.comments")}</label>
                            </div>
                            <div className="col-span-10">
                                <Controller
                                    name="comments"
                                    render={({ onChange, value }) =>
                                        <Input.TextArea rows={3} value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                    }
                                    control={control} defaultValue={""} />
                            </div>
                        </div>
                    </form>
                </CLoading>
            }
        />
    );
}
