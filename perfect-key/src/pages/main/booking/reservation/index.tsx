/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-debugger */
import React, { useEffect, useState } from 'react'
import { useStyleTheme } from 'theme'
import CIconSvg from "components/CIconSvg";
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ButtonHeaderRight from "./CButtonHeaderRight";
import { Radio, Button, RadioChangeEvent } from 'antd';
import GuestProfile from "./CGuestProfile";
import GuestSchedule from "./guestSchedule";
import ReservationComment from "./CReservationComment";
import ReservationInfo from "./CReservationInfo";
import BookerInfo from "./CBookerInfo";
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { guestProfileInBookingRSVN, searchRequest } from 'redux/controller/booking.slice'
import {
    getHcfgInfoRequest, fetchReservatedRooms, fetchNumberOfRooms, getGuestDetailsOptionsRequest, getGuestMoreDetailsRequest,
    ReservatedRoomsEachRoomType, setSelectedBookingRoomType, setOldMultipleValue, setDataFoextraCharge, setAccountNameFixCharge
} from 'redux/controller/reservation.slice';
import CLoading from 'components/CLoading';
import PkmApi from 'api/pkm/pkm.api';
import { NewReservationData, SelectedBookingRoomType, RoomTypeIdnCounts } from 'common/model-rsvn';
import rSVN_DEFAULT_DATA from 'common/const/newRSVNDefaultValue';
import Utils from 'common/utils';
import DrawerProfile from "components/CDrawerProfile/CDrawerProfile";
import CompanyAgentProfile from 'components/CFormProfile/CFormCompany/CFormCompanyProfile';
import FormGuestProfile from 'components/CFormProfile/CFormGuest/CFormGuestProfile';
import clsx from 'clsx';
import { PrinterOutlined } from '@ant-design/icons';
import ProfileApi from 'api/profile/prf.api';
import { MasterAndMemberProfiles } from 'common/model-profile';
import { GuestProfileFormData } from 'common/const/guestProfileFormData';
import { addDays } from 'date-fns'
import GUEST_PROFILE_DEFAULT_VALUE from 'common/const/guestProfileDefaultValue';
import { cloneDeep } from 'lodash';
import MASTER_AND_MEMBER_PROFILES from 'common/const/masterAndMemberProfilesDefaultValue';
import InventoryApi from 'api/inv/inv.api';
import { RoomsInARoomType } from 'common/model-inventory';
import { styleReservation } from './styles/reservation';
import { DEFAULT_RSVN_FORM_DATA } from 'common/model-booking';
import { useTranslation } from "react-i18next";
import { EditGroupRSVN } from 'common/model-rsvn-edit';
import EditGroupService from 'services/booking/editGroupRSVN/editGroup.service';
import ProfilesService from 'services/booking/profilesNoRsvn/profiles.service';
import { TypeReservaion } from 'common/enum/booking.enum';
import { TracerMessageModal } from 'components/CModalTracerAndMessage/TracerMessageModal';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { resetTraceInHouse } from 'redux/controller/trace.slice';

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
    title: string
}

function Index(): JSX.Element {
    //Show Modal
    //const { isSuccess, message } = useSelectorRoot(state => state.company);
    const [visibleCompanyProfile, setVisibleCompanyProfile] = useState(false);
    const [submitCompany, setSubmitCompany] = useState(false);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { handleSubmit, control, setValue, getValues } = useForm();
    //const [roomTypesidnCounts, setRoomTypesidnCounts] = useState<SelectedBookingRoomType[]>([]);
    const classes = useStyleTheme(styleReservation);
    const history = useHistory();
    const arrPathname = history.location.pathname.toString().split("/");
    const pathname = arrPathname[arrPathname.length - 2];
    const [isFit, setisFit] = useState(true);
    const { guestProfile } = useSelectorRoot(state => state?.booking);
    const { getBookingByRsvnId, oldValueInput } = useSelectorRoot(state => state?.rsvn);
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
    const [isMainForm, setisMainForm] = useState(true);
    const dispatch = useDispatchRoot();
    const { data, filteredCompanyProfile, reservatedRooms, numberOfRooms, roomTypesidnCounts, dataFoextraCharge } = useSelectorRoot(state => state.rsvn);
    const guestProfileSelect = useSelectorRoot(state => state.booking.guestProfile);
    const user = Utils.getValueLocalStorage("username")
    const [arrivalDate, setArrivalDate] = useState(addDays(new Date(), 1));
    const [departureDate, setDepartureDate] = useState(addDays(new Date(), 2));
    const [btnLoadingGP, setBtnLoadingGP] = useState(false)
    const [onOkGP, setOnOkGP] = useState(false)
    const [visibleGuestProfile, setVisibleGuestProfile] = useState(false)
    const [changeTabs, setChangeTabs] = useState();
    const [selectKind, setSelectKind] = useState<any>('')
    const [isPrintRate, setIsPrintRate] = useState<boolean>(true);
    const [valueSource, setValueSource] = useState("");
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [countOfRSVN, updateCountOfRSVN] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTracerModal, setIsTracerModal] = useState<boolean>(false);

    const { t } = useTranslation("translation");
    const idRsvn: any = useParams();
    const showDrawer = () => {
        setSelectKind('null');
        setVisibleCompanyProfile(true);
    };
    const onClose = () => {
        setVisibleCompanyProfile(false);
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
        dispatch(getHcfgInfoRequest(hotelId));
        dispatch(fetchNumberOfRooms({
            hotelGuid: hotelId
        }));
        PkmApi.getCountOfRSVN(hotelId).subscribe(
            (res) => {
                updateCountOfRSVN(res.count);
            }
        )
    }, [hotelId])

    // useEffect(() => {
    //     if (isEdit === true) {
    //         history.push({ pathname: "/main/booking/edit" })
    //     }
    // }, [isEdit])
    const mapValueToInput = () => {
        const historyState: any = history.location.state;
        if (historyState) {
            if (historyState.isAddRSVN && getBookingByRsvnId) {
                const dataFotTsRoomDto = getBookingByRsvnId.dataFotransactRoomDTO;
                for (const key of Object.keys(dataFotTsRoomDto)) {
                    if (dataFotTsRoomDto[key] !== null) {
                        if (key === "specialsCodes" || key === "packageCodes") {
                            const temp = JSON.parse(dataFotTsRoomDto[key]);
                            setValue(key, temp[key]);
                        } else {
                            setValue(key, dataFotTsRoomDto[key]);
                        }
                    }
                }
            }
        }
        if (history.action === "POP") {
            if (oldValueInput) {
                for (const key of Object.keys(oldValueInput)) {
                    if (oldValueInput[key] !== "") {
                        setValue(key, oldValueInput[key]);
                    }
                }
            }
        }
    }
    useEffect(() => {
        dispatch(getGuestDetailsOptionsRequest(hotelId));
        dispatch(getGuestMoreDetailsRequest(hotelId));
        mapValueToInput();
        return () => {
            const newData: any = Object.assign({}, DEFAULT_RSVN_FORM_DATA);
            Object.keys(DEFAULT_RSVN_FORM_DATA).forEach(function (key) {
                const tmpVal = getValues(key);
                if (tmpVal) {
                    newData[key] = tmpVal;
                }
            });
            dispatch(setOldMultipleValue(newData));
        }
    }, [])

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

    const handleChange = (e: RadioChangeEvent) => {
        const { value } = e.target;
        if (value === 1) {
            setisFit(true);
        }
        else {
            setisFit(false);
        }
    }

    const transformData = (obj: any, destination: any) => {
        Object?.keys(destination)?.map(key => {
            if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined)
                destination[key] = obj[key];
            return null;
        });
    }

    const newRsvn = (data: RSVNFormData) => {
        const masterAndMemberProfiles: MasterAndMemberProfiles = cloneDeep(MASTER_AND_MEMBER_PROFILES);
        // set master profile
        // transformData(profileFormData.main, masterAndMemberProfiles.masterProfile);
        // transformData(profileFormData.more, masterAndMemberProfiles.masterProfile);

        // set member profile

        // duplicate master profile in member profile
        // change when has Create Member profile UI
        if (guestProfile) {
            transformData(guestProfile, masterAndMemberProfiles.masterProfile);
            if (!isFit) {
                masterAndMemberProfiles.masterProfile.firstName = guestProfile.firstName || guestProfile.groupCode;
                masterAndMemberProfiles.masterProfile.guestName = guestProfile.guestName || guestProfile.groupName;
            }
        }
        if (Utils.isNullOrEmpty(masterAndMemberProfiles.masterProfile.firstName)) {
            openNotification(NotificationStatus.Warning, "Please fill out required fields in Guest Profile!", "");
        }
        else {
            if (roomTypesidnCounts?.length === 0) {
                openNotification(NotificationStatus.Warning, "You haven't selected rooms!", "");
                return;
            }
            data = { ...data, arrivalDate, departureDate };
            data.arrivalDate = Utils.formatDateCallApi(data.arrivalDate);
            data.departureDate = Utils.formatDateCallApi(data.departureDate);
            data.printRate = isPrintRate;
            data.resSource = valueSource;
            data.confirmed = isConfirm;
            data.specialsCodes = data.specialsCodes ? '{"specialsCodes" : ' + JSON.stringify(data.specialsCodes) + "}" : null;
            data.packageCodes = data.packageCodes ? data.packageCodes : null;
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
            if(tmp === 0){
                cutOfDate.setFullYear(1900, 1, 1);
            }else{
                cutOfDate.setDate(data.arrivalDate.getDate() - tmp);
            }

            // set cutOfDate value
            rsvnData.dataFotransactRoomDTO.cutOfDate = Utils.convertMiddleDate(cutOfDate);

            // set hotelId to appropriate field in each object
            rsvnData.dataFotransactRoomDTO.hotelGuid = hotelId;
            rsvnData.dataFotransactRoomDTO.nguoiDung2 = Utils.getValueLocalStorage("username");//thang_dev
            // rsvnData.dataFoextraCharge.hotelGuid = hotelId;
            rsvnData.dataForeservationDTO.hotelGuid = hotelId;
            rsvnData.dataForeservationDTO.flagType = isFit ? TypeReservaion.ReservationIndividual : TypeReservaion.ReservationGroup;
            rsvnData.pickup.hotelGuid = hotelId;
            rsvnData.flyInfor.hotelGuid = hotelId;
            rsvnData.dataFoextraCharges = dataFoextraCharge;

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
            processNewRSVNRequest(isSet, masterAndMemberProfiles, rsvnData, lstRoomTypes);
        }
    }
    const onSubmit = async (data: RSVNFormData) => {
        if (guestProfileSelect) {
            data.firstName = guestProfileSelect.firstName ? guestProfileSelect.firstName : data.firstName
            data.lastName = guestProfileSelect.guestName ? guestProfileSelect.guestName : data.lastName
            data.bookingCode = guestProfileSelect.bookingCode ? guestProfileSelect.bookingCode : data.bookingCode
            data.comment = guestProfileSelect.comments ? guestProfileSelect.comments : data.comment
            data.companyAgentGuid = guestProfileSelect.companyGuid ? guestProfileSelect.companyGuid : data.companyAgentGuid
        }
        const id = idRsvn.idRsvn
        if (id) {
            const rsvnData: EditGroupRSVN = {
                ...getBookingByRsvnId,
                dataFoextraCharges: { ...getBookingByRsvnId.dataFoextraCharges },
                dataFotransactRoomDTO: { ...getBookingByRsvnId.dataFotransactRoomDTO },
                flyInfor: { ...getBookingByRsvnId.flyInfor },
                dataForeservationDTO: { ...getBookingByRsvnId.dataForeservationDTO },
                pickup: { ...getBookingByRsvnId.pickup },
                remainRSVN: { ...getBookingByRsvnId.remainRSVN },
                roomTypeidnCounts: []
            };
            delete rsvnData.dataFotransactRoomDTO.id;
            delete rsvnData.dataFotransactRoomDTO.guestId;
            delete rsvnData.dataFotransactRoomDTO.guid;
            delete rsvnData.dataFotransactRoomDTO.room;
            delete rsvnData.dataFotransactRoomDTO.roomType;
            console.log(rsvnData.dataFotransactRoomDTO);

            data.specialsCodes = data.specialsCodes ? '{"specialsCodes" : ' + JSON.stringify(data.specialsCodes) + "}" : null;
            data.packageCodes = data.packageCodes ? '{"packageCodes" : ' + JSON.stringify(data.packageCodes) + "}" : null;
            // transform data - Mapping data
            transformData(data, rsvnData.dataFotransactRoomDTO);
            transformData(data, rsvnData.dataForeservationDTO);

            rsvnData.dataFotransactRoomDTO.hotelGuid = hotelId;
            rsvnData.dataForeservationDTO.hotelGuid = hotelId;
            rsvnData.pickup.hotelGuid = hotelId;
            rsvnData.flyInfor.hotelGuid = hotelId;
            rsvnData.dataFoextraCharges = dataFoextraCharge;

            roomTypesidnCounts.forEach((item: SelectedBookingRoomType) => {
                rsvnData.roomTypeidnCounts.push({
                    roomType: item.roomTypeGuid,
                    maxPerson: 4,
                    totalRooms: item.TotalRooms,
                    count: item.Rooms,
                    rate: item.Rate,
                    guestCount: item.Guest,
                    newGuestGuids: []
                });
            })
            const dataProfile = {
                ...guestProfile,
                firstName: data.firstName,
                guestName: data.lastName
            }
            const a = createProfiles(rsvnData);
            if (a.countGuest > 0) {
                const profileGuid = await ProfilesService.createProfileByCountGuest(dataProfile, a.countGuest)
                let index = 0;
                rsvnData.roomTypeidnCounts.forEach((dataChange: any, i: number) => {
                    const temp = a.listRoomUpdate.find((x: any) => x.roomType === dataChange.roomType);
                    if (temp) {
                        const arrayGuildGuest = profileGuid.slice(index, temp.countProfile + index);
                        dataChange.newGuestGuids = dataChange.newGuestGuids.concat(arrayGuildGuest);
                        index = temp.countProfile;
                    }
                })
            }
            updateRSVN(rsvnData, id, data);
            dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));// reset data fixcharge when new success
            dispatch(setAccountNameFixCharge({ accountName: "ACCOUNT NAME", dataSelectedFixcharge: [] }));// reset data fixcharge when new success
        } else {
            newRsvn(data);
        }
    };

    const createProfiles = (rsvnData: any) => {
        let countGuest = 0;
        const listRoomUpdate: any = []
        rsvnData.roomTypeidnCounts.forEach((dataChange: any, i: number) => {
            let countProfile = 0;
            const dataUpdate = getBookingByRsvnId.roomTypeidnCounts.find((x: RoomTypeIdnCounts) => x.roomType === dataChange.roomType);
            if (dataUpdate) {
                if (dataChange.guestCount > (dataUpdate.guestGuid.length / dataUpdate.count) && dataChange.count > dataUpdate.count) {
                    countProfile += (dataChange.count * dataChange.guestCount) - dataUpdate.guestGuid.length;
                } else if (dataChange.count < dataUpdate.count && dataChange.guestCount > (dataUpdate.guestGuid.length / dataUpdate.count)) {
                    countProfile += dataChange.guestCount - (dataUpdate.guestGuid.length / dataUpdate.count)
                } else if (dataChange.count > dataUpdate.count && dataChange.guestCount < (dataUpdate.guestGuid.length / dataUpdate.count)) {
                    countProfile += (dataChange.guestCount * dataChange.count) - (dataUpdate.guestGuid.length / dataUpdate.count)
                } else if (dataChange.count > dataUpdate.count && dataChange.guestCount === (dataUpdate.guestGuid.length / dataUpdate.count)) {
                    countProfile += (dataChange.guestCount * dataChange.count) - (dataUpdate.guestGuid.length)
                } else if (dataChange.count === dataUpdate.count && dataChange.guestCount > (dataUpdate.guestGuid.length / dataUpdate.count)) {
                    countProfile += dataChange.guestCount - (dataUpdate.guestGuid.length / dataUpdate.count)
                }
            } else {
                countProfile += (dataChange.count * dataChange.guestCount);
            }
            listRoomUpdate.push({
                countProfile: countProfile,
                roomType: dataChange.roomType
            })
            countGuest += countProfile;
        });
        return {
            countGuest,
            listRoomUpdate
        }
    }

    const updateRSVN = async (dataUpdateTrs: EditGroupRSVN, id: string, dataProfile: RSVNFormData) => {
        const guidProfiles: any = [];
        // dataUpdateTrs.roomTypeidnCounts.forEach((list: any, i: number) => {
        //     guidProfiles.push(list.newGuestGuids);
        // })
        getBookingByRsvnId.roomTypeidnCounts.forEach((list: any, i: number) => {
            guidProfiles.push(list.guestGuid);
        })
        let flatValues: any = []
        flatValues = guidProfiles.reduce((total: any, value: any) => {
            return total.concat(value);
        }, []);
        const dataProfilesUpdate: any = []
        flatValues.forEach((elm: string) => {
            dataProfilesUpdate.push({
                ...dataProfile,
                guid: elm,
                guestName: dataProfile.lastName
            })
        });
        setIsLoading(true);
        await ProfilesService.updateListProfiles(dataProfilesUpdate);
        await EditGroupService.updateGroupRsvn(dataUpdateTrs, id);
        setIsLoading(false);
        history.push('/main/booking');
    }

    const processNewRSVNRequest = (isSet: boolean, masterAndMemberProfiles: MasterAndMemberProfiles, rsvnData: NewReservationData, lstRoomTypes: string[]) => {
        setBtnLoadingGP(true);
        ProfileApi.postMasterProfileAndMemberProfiles(!isSet, masterAndMemberProfiles).subscribe(
            async (res) => {
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
                PkmApi.newReservation(rsvnData).subscribe(
                    (res: string | null) => {
                        resetRoomBooking();
                        setBtnLoadingGP(false);
                        history.push('/main/booking');
                    }
                )
                dispatch(setDataFoextraCharge({ totalFixCharge: 0, dataFoextraCharge: [] }));// reset data fixcharge when new success
                dispatch(setAccountNameFixCharge({ accountName: "ACCOUNT NAME", dataSelectedFixcharge: [] }));// reset data fixcharge when new success
                dispatch(resetTraceInHouse(""))// reset trace in house to default value
            },
            (err) => {
                openNotification(NotificationStatus.Error, "Error when booking a reservation!", "");
                console.log(err);
            }
        )
    }

    //CGuestProfile
    const handleGuestProfile = (formData: GuestProfileFormData) => {
        //setProfileFormData(formData);
        const pre = { ...GUEST_PROFILE_DEFAULT_VALUE };
        transformData(formData.main, pre);
        transformData(formData.more, pre);
        dispatch(guestProfileInBookingRSVN(pre));
        setVisibleGuestProfile(false)
        if (onOkGP) {
            setBtnLoadingGP(true)
            setTimeout(() => {
                setBtnLoadingGP(false)
                setOnOkGP(false)
            }, 200);
        }
    }
    // useEffect(() => {
    //     function showMessage(msgresetRoomBooking:string){
    //         notification.open({
    //             message:msg,
    //             placement: "topRight",
    //         })
    //     }
    //     message && showMessage(message);
    // },[message])

    //Handle search first name
    const handleSearchFirstName = (e: { firstName: string, searchBy: number }) => {
        history.push(`search`, {
            firstName: e.firstName,
            searchBy: e.searchBy
        })
        const data = {
            hotelGuid: hotelId,
            status: e.searchBy,
            profiles: {
                phone: '',
                passport: '',
                firstName: e.firstName,
                guestName: ''
            },
            listRoomType: numberOfRooms
        }
        dispatch(searchRequest(data))
    }

    const resetRoomBooking = () => {
        dispatch(setSelectedBookingRoomType([]));
        dispatch(guestProfileInBookingRSVN({ ...GUEST_PROFILE_DEFAULT_VALUE }))
    }
    //END Handle search first name----

    //Handle New Tracer 
    const handleNewTracer = () => {
        setIsTracerModal(true)
    }

    return (
        <CLoading visible={isLoading}>
            <div className={`custom-scrollbar-pkm ${classes.main}`} style={{ height: "calc( 100vh - 64px)", color: "#00293B" }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={` flex justify-between my-4`}>
                        <div className={` flex items-center justify-center`}>
                            <div className={`${classes.backSquare} cursor-pointer flex  items-center justify-center p-2 rounded`} onClick={() => {
                                history.goBack();
                            }}>
                                <CIconSvg name="back" colorSvg="origin" svgSize="small" />
                            </div>
                            <p className="m-0 text-base	font-bold ml-3">{idRsvn.idRsvn ? t("BOOKING.RESERVATION.editGroupOrReservation") : t("BOOKING.RESERVATION.newGroupOrReservation")}</p>
                        </div>
                        <div className={`flex items-center justify-center`}>
                            <div>
                                <ButtonHeaderRight active={false} title={t("BOOKING.RESERVATION.options")} />
                            </div>
                            <div>
                                <ButtonHeaderRight active={false} title={t("BOOKING.RESERVATION.routing")} />
                            </div>
                            <div onClick={handleNewTracer}>
                                <ButtonHeaderRight active={true} title={t("BOOKING.RESERVATION.trace")} />
                            </div>
                            <div onClick={showDrawer}>
                                <ButtonHeaderRight active={true} title={t("BOOKING.RESERVATION.newCompany")} />
                            </div>
                        </div>
                    </div>

                    <div className={`${classes.headerInfo} flex my-4 justify items-center`}>
                        <Radio.Group defaultValue={1} name="isFit" onChange={handleChange}>
                            <Radio value={1}>
                                <span style={{ color: isFit ? "#1A87D7" : "" }} >{t("BOOKING.RESERVATION.isFit")}</span>
                            </Radio>
                            <Radio value={2}>
                                <span style={{ color: !isFit ? "#1A87D7" : "" }}>{t("BOOKING.RESERVATION.isGit")}</span>
                            </Radio>
                        </Radio.Group>
                        <p className="mx-4 font-semibold m-0">{t("BOOKING.RESERVATION.rsvnNo")}: {countOfRSVN + 1}</p>
                        <p className="font-semibold m-0">{t("BOOKING.RESERVATION.user")}: {user ?? "User created"}</p>
                    </div>
                    {/* {isMainForm ? */}
                    <div>
                        <div style={{ opacity: isMainForm ? 1 : 0, visibility: isMainForm ? 'visible' : 'hidden', position: isMainForm ? 'unset' : 'fixed' }} className={`grid grid-cols-2 gap-4`}>
                            <div className={`xl:col-span-1 col-span-2 grid grid-cols-1 grid-cols gap-2`}>
                                <GuestProfile
                                    openDrawerGuestProfile={(e: boolean) => setVisibleGuestProfile(e)}
                                    getGuestProfileByRsvnId={getBookingByRsvnId ? getBookingByRsvnId.dataFotransactRoomDTO : ""}
                                    setIsPrintRateByCompany={(e: boolean) => setIsPrintRate(e)}
                                    setSelectValueSource={(e: any) => setValueSource(e)}
                                    pathname={pathname}
                                    valueSource={valueSource}
                                    setValue={setValue}
                                    getValue={getValues}
                                    className={`grid grid-cols-12 gap-2 xl:col-span-1 md:col-span-2 md:order-first`}
                                    isFit={isFit} control={control} data={data} filteredCompanyProfile={filteredCompanyProfile} />
                                <ReservationComment setValue={setValue}
                                    getValue={getValues} getGuestProfileByRsvnId={getBookingByRsvnId ? getBookingByRsvnId.dataFotransactRoomDTO : ""} className={`xl:col-span-1 md:col-span-2 md:order-1 xl:oder-3`} control={control} />
                            </div>
                            <div className={`xl:col-span-1 col-span-2 grid grid-cols-1 `}>
                                <GuestSchedule
                                    control={control}
                                    dataSelection={data}
                                    getGuestProfile={getBookingByRsvnId ? getBookingByRsvnId : ""}
                                    data={roomTypeInfos} setArrivalDate={setArrivalDate} arrivalDate={arrivalDate} departureDate={departureDate}
                                    setDepartureDate={setDepartureDate}
                                    //setRoomTypesidnCounts={setRoomTypesidnCounts} 
                                    isPrintRateProps={isPrintRate}
                                    setCheckedPrintRate={(e: boolean) => setIsPrintRate(e)}
                                    isConfirm={isConfirm}
                                    setIsConfirm={(e: boolean) => setIsConfirm(e)}
                                    setValue={setValue}
                                    getValue={getValues}
                                    className={`grid grid-cols-12 gap-4 xl:col-span-1 md:col-span-2 md:order-3 xl:order-1 !py-4`}
                                />
                            </div>
                            <div className="xl:col-span-2 md:col-span-2 flex justify-end gap-3 py-4 md:order-last">
                                <Button style={{ color: "#F74352", border: "1px solid #F74352" }} className={`!rounded-md ${classes.buttonStyle}`} onClick={() => {
                                    history.goBack();
                                    resetRoomBooking();
                                }}>{t("BOOKING.RESERVATION.close")}</Button>
                                <Button className={`!rounded-md ${classes.buttonStyle}`} style={{ color: "#1A87D7", border: "1px solid #1A87D7" }} onClick={() => { setisMainForm(false) }} >{t("BOOKING.RESERVATION.next")}</Button>
                                <Button type="primary" loading={btnLoadingGP} htmlType="submit" className={`!rounded-md ${classes.buttonStyle}`}>{t("BOOKING.RESERVATION.submit")}</Button>
                            </div>
                        </div>
                    </div>
                    <div style={{ opacity: !isMainForm ? 1 : 0, visibility: !isMainForm ? 'visible' : 'hidden', position: !isMainForm ? 'unset' : 'fixed' }} className={`grid grid-cols-2 gap-4`}>
                        <div className="xl:col-span-1 grid grid-cols-2 gap-2 md:col-span-2">
                            <ReservationInfo getValue={getValues} setValue={setValue} getGuestProfileByRsvnId={getBookingByRsvnId ? getBookingByRsvnId.dataFotransactRoomDTO : ""} className={`col-span-2`} control={control} selectOption={data} />
                            <ReservationComment className={`col-span-2`} control={control} />
                        </div>
                        <div className="xl:col-span-1 grid grid-cols-2 gap-2 h-full md:col-span-2">
                            <div className="col-span-2">
                                <BookerInfo getValue={getValues} setValue={setValue}
                                    dataForeservationDTO={getBookingByRsvnId ? getBookingByRsvnId.dataForeservationDTO : ""}
                                    dataFoextraCharges={getBookingByRsvnId ? getBookingByRsvnId.dataFoextraCharges : []}
                                    className={`py-4 grid grid-cols-12 gap-4 col-span-1 md:w-11/12 xl:w-full`} control={control}
                                />
                            </div>
                            <div className="col-span-2 flex justify-end gap-3 py-2">
                                <Button style={{ color: "#F74352", border: "1px solid #F74352", width: "65px" }} className={`!rounded-md ${classes.buttonSubmit}`} onClick={() => {
                                    setisMainForm(true);
                                }}>{t("BOOKING.RESERVATION.back")}</Button>
                                <Button className={`!rounded-md ${classes.buttonSubmit}`} htmlType="submit" style={{ color: "#1A87D7", border: "1px solid #1A87D7", width: "100px" }}>{t("BOOKING.RESERVATION.submit")}</Button>
                                <Button loading={btnLoadingGP} className={`!rounded-md ${classes.buttonSubmit}`} htmlType="submit" style={{ width: 150 }} type="primary">{t("BOOKING.RESERVATION.submit")} & {t("BOOKING.RESERVATION.close")}</Button>
                            </div>
                        </div>
                    </div>
                </form>

                <DrawerProfile
                    visible={visibleGuestProfile}
                    title={t("BOOKING.RESERVATION.guestDetailsInformation")}
                    propsOnChange={() => setVisibleGuestProfile(false)}
                    zIndex={30}
                    customFooter={
                        <div className="flex justify-between m-auto" style={{ width: 951 }}>
                            <div className={"footer-left"}>
                                <Button disabled className={`${clsx(classes.buttonFooterLeft, classes.buttonFooterLeftDisable)} flex items-center`}><div className="btn flex items-center"><PrinterOutlined className='pr-2' /> Print</div></Button>
                                <Button className={`${classes.buttonFooterLeft}`}>{t("BOOKING.RESERVATION.toIss")}</Button>
                                <Button className={`${classes.buttonFooterLeft}`}>{t("BOOKING.RESERVATION.member")}</Button>
                            </div>
                            <div className={"footer-right gap-1"}>
                                <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                    onClick={() => setVisibleGuestProfile(false)}
                                    style={{ color: "#F74352", border: "1px solid #F74352" }}>{t("BOOKING.RESERVATION.cancel")}</Button>
                                <Button form={changeTabs} htmlType='submit'
                                    onClick={() => setOnOkGP(true)}
                                    loading={btnLoadingGP}
                                    className={`${classes.buttonFooterRight} !rounded-md`}
                                    style={{ background: "#1A87D7", color: "white" }}>{t("BOOKING.RESERVATION.ok")}</Button>
                            </div>
                        </div>
                    } >
                    <FormGuestProfile
                        openNewCompanyOrAgent={(e: any) => {
                            setSelectKind(e)
                            setVisibleCompanyProfile(true)
                        }}
                        onSearchFirstName={(e: string) => handleSearchFirstName({ firstName: e, searchBy: 1 })}
                        valueForm={(data: GuestProfileFormData) => handleGuestProfile(data)}
                        getBookingByRsvnId={getBookingByRsvnId}
                        onChangetabs={(key: any) => setChangeTabs(key)} />

                </DrawerProfile>

                <DrawerProfile visible={visibleCompanyProfile} title={t("BOOKING.RESERVATION.newCompany")} propsOnChange={onClose} zIndex={100}
                    customFooter={
                        <div className="flex justify-between m-auto" style={{ width: 951 }}>
                            <div className={"footer-left"} />
                            `       <div className={"footer-right gap-1"}>
                                <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                    onClick={() => setVisibleCompanyProfile(false)}
                                    style={{ color: "#F74352", border: "1px solid #F74352" }}>{t("BOOKING.RESERVATION.cancel")}</Button>
                                <Button form={"hook-form-company"} htmlType='submit'
                                    loading={btnLoadingGP}
                                    className={`${classes.buttonFooterRight} !rounded-md`}
                                    style={{ background: "#1A87D7", color: "white" }}
                                    onClick={() => {
                                        setSubmitCompany(!submitCompany)
                                    }}
                                >{t("BOOKING.RESERVATION.ok")}</Button>
                            </div>
                        </div>
                    }
                >
                    <CompanyAgentProfile
                        submitCompany={submitCompany}
                        visibleCompanyProfile={setVisibleCompanyProfile}
                        selectKind={selectKind}
                    />
                </DrawerProfile>
                {isTracerModal && <TracerMessageModal
                    title={t("BOOKING.RESERVATION.chooseInHouse")}
                    isShowModal={isTracerModal}
                    setIsShowModal={setIsTracerModal}
                    isTracer={true}
                />}
            </div>
        </CLoading>
    )
}
export default React.memo(Index)
