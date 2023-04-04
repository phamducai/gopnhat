/* eslint-disable*/
import ClassBox from 'components/CClassBox'
import React, { useEffect, useRef, useState } from 'react'
import { Input, Select, Button, notification } from "antd";
import { Controller } from 'react-hook-form';
import { createStyles, useStyleTheme } from 'theme';
import clsx from 'clsx';
import { ISearchGuest } from "common/define-reversation"
import { useHistory } from 'react-router';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { guestProfileInBookingRSVN, searchRequest, searchWithQueryParam } from 'redux/controller';
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice"
import { ShortCompanyProfileData, ShortGuestProfileData } from 'common/model-profile';
import GUEST_PROFILE_DEFAULT_VALUE from 'common/const/guestProfileDefaultValue';
import ProfileApi from 'api/profile/prf.api';
import { styleInput } from './styles/guestProfile';
import { useTranslation } from 'react-i18next';
const { Option } = Select;
interface ICGuestProfile extends Props {
    openDrawerGuestProfile?: any,
    setIsPrintRateByCompany?: any,
    isFit?: boolean,
    control?: any,
    data?: any,
    filteredCompanyProfile: any,
    setSelectValueSource?: any,
    valueSource?: any,
    getGuestProfileByRsvnId?: any,
    setValue?: any,
    getValue?: any,
    pathname?: string
}

export interface ShortDataProfile {
    isFit: ShortGuestProfileData,
    isGit: ShortCompanyProfileData
}

const SEARCH_INVENTION = {
    firstName: 'firstName',
    lastName: 'lastName',
    groupCode: 'groupCode',
    groupName: 'groupName',
    bookingCode: 'bookingCode'

}
//export let logData: ReplaySubject<IQueryParam[]>;
function CGuestProfile({ getGuestProfileByRsvnId, openDrawerGuestProfile, setIsPrintRateByCompany, isFit, control, data, ...props }: ICGuestProfile): JSX.Element {
    const history = useHistory();
    const classes = useStyleTheme(styleInput);
    const { selectedProfile, guestProfile, dataSearchResults } = useSelectorRoot(state => state.booking);
    let guestInfo: ISearchGuest = { title: "Mr." };
    const { filteredCompanyProfile, isEdit } = useSelectorRoot(state => state.rsvn);
    const { guidNewCompany } = useSelectorRoot(state => state.company);
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const dispatch = useDispatchRoot();
    const [firstName, setFirstName] = useState(guestProfile ? guestProfile?.firstName : "");
    const [lastName, setLastName] = useState(guestProfile ? guestProfile?.guestName : "");
    const [bookingCode, setBookingCode] = useState(guestProfile ? guestProfile?.bookingCode : "");
    const [groupName, setGroupName] = useState(guestProfile ? guestProfile?.groupName : "");
    const [groupCode, setGroupCode] = useState(guestProfile ? guestProfile?.groupCode : "");
    const [dataRateCode, setDataRateCode] = useState("");
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const { valueSource, setSelectValueSource, setValue, getValue, pathname } = props;
    const typingTimeoutRef = useRef(0);
    const { t } = useTranslation("translation")

    useRef(() => {
        setFirstName(guestProfile?.firstName);
        setLastName(guestProfile?.guestName);
        setBookingCode(guestProfile?.bookingCode);
        setGroupCode(guestProfile?.groupCode);
        setGroupName(guestProfile?.groupName);
    });
    // ====================================================
    // set masterGuestProfile trong lần đầu render
    // 
    useEffect(() => {
        if (guidNewCompany !== "") {
            setValue("companyAgentGuid", guidNewCompany);
        }
    }, [guidNewCompany])
    useEffect(() => {
        dispatch(companyProfilesFilterByInputRequest({
            hotelGuid: hotelId,
            input: "g"
        }))
        let isAddRSVN: boolean = false
        if (history.location.state) {
            const state: any = history.location.state;
            isAddRSVN = state.isAddRSVN;
        }
        if ((pathname === "edit-group" && getGuestProfileByRsvnId) || isAddRSVN) {
            setValue("companyAgentGuid", getGuestProfileByRsvnId.companyAgentGuid)
            setValue("rateCode", getGuestProfileByRsvnId.rateCode)
            setValue("paymentMethod", getGuestProfileByRsvnId.paymentMethod)
            setValue("resSource", getGuestProfileByRsvnId.resSource)
            setValue("resMarket", getGuestProfileByRsvnId.resMarket)            
            ProfileApi.getGuestProfileById(getGuestProfileByRsvnId.guestId).subscribe(
                (res: any) => {
                    setValue("firstName", res.firstName)
                    setValue("lastName", res.guestName)
                    dispatch(guestProfileInBookingRSVN({ ...res }));
                },
                (err) => {
                    alert("Error when booking a reservation!");
                    console.log(err);
                }
            )
        }
    }, [])
    // ====================================================    
    useEffect(() => {
        dispatch(guestProfileInBookingRSVN({ ...GUEST_PROFILE_DEFAULT_VALUE }));
    }, [isFit])
    useEffect(() => {
        if (isSearch) {
            if (dataSearchResults.length === 0) {
                notification.error({
                    message: <b>{t("BOOKING.RESERVATION.weCouldntFind")} "{firstName} {lastName}"</b>,
                    placement: "topLeft",
                    style: { borderRadius: 6, top: "8vh" }
                });
            }
            else {
                history.push("/main/booking/search", {
                    firstName: firstName,
                    guestName: lastName,
                    bookingCode: bookingCode,
                    groupCode: groupCode,
                    groupName: groupName,
                    searchBy: 5
                });
            }
            setIsSearch(false);
        }

    }, [dataSearchResults]);
    const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // console.log(e.target.name);
        guestInfo = { ...guestInfo, [name]: value };
        switch (e.target.name) {
            case SEARCH_INVENTION.firstName:
                setFirstName(e.target.value);
                //getGuestProfileByRsvnId.roomType = e.target.value;
                //let tmp = {...guestProfile, firstName: firstName};
                dispatch(guestProfileInBookingRSVN({ ...guestProfile, firstName: e.target.value }));
                break;
            case SEARCH_INVENTION.lastName:
                setLastName(e.target.value);
                let tmp = { ...guestProfile, guestName: e.target.value };
                dispatch(guestProfileInBookingRSVN(tmp));
                break;
            case SEARCH_INVENTION.bookingCode:
                setBookingCode(e.target.value);
                dispatch(guestProfileInBookingRSVN({ ...guestProfile, bookingCode: e.target.value }));
                break;
            case SEARCH_INVENTION.groupCode:
                setGroupCode(e.target.value);
                dispatch(guestProfileInBookingRSVN({ ...guestProfile, groupCode: e.target.value }));
                break;
            case SEARCH_INVENTION.groupName:
                setGroupName(e.target.value);
                dispatch(guestProfileInBookingRSVN({ ...guestProfile, groupName: e.target.value }));
                break;
            default:
                break;
        }
    }
    const handleOnChangeSelect = (e: string) => {
        guestInfo.title = e;
        // console.log(guestInfo);
    }
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }
    const onSearch = (val: any) => {
        val.length > 0 ? val = val : val = "g"
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
    const onSubmit = (data: any) => {
        setIsSearch(true);
        propsOnChangeForm();
        if (isSearch) {
            setTimeout(() => {
                setIsSearch(false)
            }, 1000);
        }
    }

    const propsOnChangeForm = () => {
        const data = {
            hotelGuid: hotelId,
            arrivalDates: [],
            departureDates: [],
            companyAgentGuid: '00000000-0000-0000-0000-000000000000',
            status: 5,
            rsvnCode: '',
            profiles: {
                phone: '',
                passport: '',
                firstName: firstName || '',
                guestName: lastName || ''
            },
            listRoomType: numberOfRooms
        }
        const transform: any = history.location.state;
        //   console.log(transform);
        if (data.profiles?.firstName === "" && data.profiles?.guestName === "" && data.profiles?.passport === "" && data.profiles?.phone === "") {
            dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
        } else {
            dispatch(searchRequest(data))
        }
    }
    // const getRSVNTypeByIdGuid = (idGuid: any, data: Array<any>) =>{
    //     let resultRsvnType = data.find(x => x.guid === idGuid);
    //     if(resultRsvnType === undefined){
    //         setCheckedIsConfirm(false);
    //         return;
    //     }
    //     setCheckedIsConfirm(resultRsvnType.isConfirm);
    // }
    const getRateCodeByCompany = (guidSelect: any): void => {
        let newRateCode: any = [];
        const selectCompanyOrAgent = filteredCompanyProfile.find(x => x.guid === guidSelect)
        if ((selectCompanyOrAgent?.rateCode !== 0 || selectCompanyOrAgent?.rateCode2 !== 0 || selectCompanyOrAgent?.rateCode3 !== null) && guidSelect !== "") {
            data.rateCodes.forEach((item: any) => {
                if (selectCompanyOrAgent?.rateCode === item.id || selectCompanyOrAgent?.rateCode2 === item.id || selectCompanyOrAgent?.rateCode3 === item.id) {
                    newRateCode.push(item);
                }
            });
        }
        else {
            newRateCode = data.rateCodes;
        }
        if (selectCompanyOrAgent?.resSource !== 0) {
            data.sources.forEach((item: any) => {
                if (selectCompanyOrAgent?.resSource === item.id) {
                    setSelectValueSource(item.guid)
                    setValue("resSource", item.guid)
                }

            });
        }
        else {
            setSelectValueSource("")
        }
        selectCompanyOrAgent?.kind === 0 ? setIsPrintRateByCompany(true) : setIsPrintRateByCompany(false);
        setDataRateCode(newRateCode);
    }
    return (
        <>
            <ClassBox className={clsx(props.className)}>
                {isFit ?
                    <div className="grid xl:grid-cols-12 col-span-12 pt-4 md:w-11/12 xl:w-full">
                        <div className="col-span-2" style={{ marginRight: 15 }} >
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.title")}:</p>
                            <Controller as={<Select className={` ${classes.selectBackground} w-full !rounded-md`} onChange={handleOnChangeSelect}>
                                <Option value="Mr.">{t("BOOKING.RESERVATION.mr")}</Option>
                                <Option value="Mrs">{t("BOOKING.RESERVATION.mrs")}</Option>
                                <Option value="Ms">{t("BOOKING.RESERVATION.ms")}</Option>
                            </Select>}
                                name="title" defaultValue="Mr." control={control} />
                        </div>
                        <div className="col-span-4">
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.name")}:</p>
                            <Controller render={({ onChange, value }) =>
                                <Input
                                    className={`${classes.input}`}
                                    onChange={e => {
                                        onChange(e)
                                        handleOnChangeInput(e)
                                    }}
                                    style={{ background: "#F5F6F7", height: 40 }}
                                    value={guestProfile.firstName ? guestProfile.firstName : ""} 
                                    defaultValue={guestProfile.firstName ? guestProfile.firstName: firstName ? firstName : ""}
                                    name="firstName"
                                    // value={getValue("firstName") || undefined}
                                    placeholder={t("BOOKING.RESERVATION.enterName")}
                                    required={true} 
                                />}
                                name={SEARCH_INVENTION.firstName} control={control} placeholder={t("BOOKING.RESERVATION.enterName")}
                                defaultValue={guestProfile.firstName ? guestProfile.firstName: firstName ? firstName : ""}
                            />
                        </div>
                        <div className="col-span-4 w-full" style={{ marginLeft: 15 }}>
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.lastname")}:</p>
                            <Controller render={({ onChange, value }) => 
                                <Input
                                    className={`${classes.input} w-full`}
                                    onChange={e => {
                                        onChange(e)
                                        handleOnChangeInput(e)
                                    }}
                                    style={{ background: "#F5F6F7", height: 40 }}
                                    // value={getValue("lastName") || undefined}
                                    defaultValue={guestProfile.guestName ? guestProfile.guestName : undefined}
                                    value={guestProfile.guestName ? guestProfile.guestName : ""} 
                                    name="lastName"
                                    placeholder={t("BOOKING.RESERVATION.enterLastname")} 
                                />}
                                name={SEARCH_INVENTION.lastName} control={control} defaultValue={guestProfile.guestName ? guestProfile.guestName : ""}
                            />
                        </div>
                        <div className="col-span-12" style={{ marginTop: 10 }}>
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.bookingCode")}:</p>
                            <Controller render={({ onChange, value }) => 
                                <Input
                                    onChange={e => {
                                        onChange(e)
                                        handleOnChangeInput(e)
                                    }}
                                    style={{ background: "#F5F6F7", height: 40, width: "100%" }}
                                    defaultValue={guestProfile.bookingCode ? guestProfile.bookingCode: ""}
                                    value={guestProfile.bookingCode ? guestProfile.bookingCode : ""}
                                    name={SEARCH_INVENTION.bookingCode}
                                    placeholder={t("BOOKING.RESERVATION.enterGroupOrBookingCode")} 
                                />}
                                name="bookingCode" control={control} defaultValue={guestProfile.bookingCode ? guestProfile.bookingCode: ""}
                            />
                        </div>
                    </div>
                    :
                    <div className="grid xl:grid-cols-12 col-span-12 gap-2 pt-4 md:w-11/12 xl:w-full">
                        <div className="col-span-12">
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.groupCode")}:</p>
                            <Controller render={({ onChange, value }) => 
                                <Input
                                    onChange={e => {
                                        onChange(e)
                                        handleOnChangeInput(e)
                                    }}
                                    style={{ background: "#F5F6F7", height: 40, width: "100%", borderRadius: 6 }}
                                    defaultValue={guestProfile.groupCode ?guestProfile.groupCode : ""}
                                    value={guestProfile.groupCode ?guestProfile.groupCode : ""} 
                                    name={SEARCH_INVENTION.groupCode}
                                    // value={getValue("groupCode") || undefined}
                                    placeholder={t("BOOKING.RESERVATION.enterGroupOrBookingCode")} 
                                />}
                                defaultValue={guestProfile.groupCode ?guestProfile.groupCode : ""}
                                name={SEARCH_INVENTION.groupCode}
                                control={control}
                            />
                        </div>
                        <div className="col-span-12">
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.groupName")}:</p>
                            <Controller render={({ onChange, value }) => 
                                <Input
                                    onChange={e => {
                                        onChange(e)
                                        handleOnChangeInput(e)
                                    }}
                                    style={{ background: "#F5F6F7", height: 40, width: "100%" }}
                                    defaultValue={guestProfile.groupName ?guestProfile.groupName : ""}
                                    value={guestProfile.groupName ? guestProfile.groupName : ""}
                                    // value={getValue("groupName") || undefined}
                                    name={SEARCH_INVENTION.groupName}
                                    placeholder={t("BOOKING.RESERVATION.enterGroupOrBookingName")} 
                                />}
                                name={SEARCH_INVENTION.groupName}
                                control={control}
                                defaultValue={groupName}
                             />
                        </div>
                    </div>
                }
                <div className="flex justify-end col-span-12 pt-4 gap-3">
                    <Button style={{ color: "#1A87D7" }} onClick={onSubmit} className={`${classes.buttonStyle} !rounded-md`} loading={isSearch}>{t("BOOKING.RESERVATION.search")}</Button>
                    <Button type="primary"
                        className={`${classes.buttonStyle} !rounded-md !font-semibold`}
                        onClick={() => {
                            openDrawerGuestProfile(true);
                        }}>{t("BOOKING.RESERVATION.guestProfile")}</Button>
                </div>
                <div className="col-span-9 border-dashed border-t"></div>
                <div className="col-span-6" style={{ padding: "0" }}>
                    <p className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.companyOrAgent")}:
                    </p>
                    <Controller render={({ onChange, value }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`}
                            showSearch
                            onSearch={onSearch}
                            value={value}
                            placeholder={t("BOOKING.RESERVATION.nameOrCodeOrVatForFilter")}
                            filterOption={false}
                            onChange={(e) => {
                                onChange(e)
                                console.log(value);
                                //getRateCodeByCompany(e)
                            }}
                        >
                            {/* <Option value=""> </Option> */}
                            {filteredCompanyProfile.length ? renderSelect(filteredCompanyProfile) : ""}
                        </Select>
                    }
                        name="companyAgentGuid" control={control} defaultValue="" />
                </div>
                <div className="col-span-6" style={{ padding: "0" }}>
                    <p className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.rateCode")}:
                    </p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.selectHere")}
                                showSearch
                                value={getValue("rateCode") || undefined}
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value=""> </Option>
                                {data ? renderSelect(dataRateCode === "" ? data.rateCodes : dataRateCode) : ""}
                            </Select>
                        }
                        name="rateCode" control={control} defaultValue="" />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.rsvnSource")}:</p>
                    <Controller render={({ onChange, value, ref }) =>
                        <Select
                            showSearch
                            value={getValue("resSource") || undefined}
                            onChange={(e) => {
                                onChange(e)
                                setSelectValueSource(e)
                            }}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            className={`${classes.selectBackground} w-full !rounded-md`}
                            placeholder={t("BOOKING.RESERVATION.selectHere")}>
                            <Option value=""> </Option>
                            {data ? renderSelect(data.sources) : ""}
                        </Select>
                    }
                        name="resSource" control={control} defaultValue="" />
                </div>
                <div className="col-span-6">
                    <p className="font-base font-bold m-0">{t("BOOKING.RESERVATION.rsvnMarket")}:</p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.selectHere")}
                                showSearch
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                value={getValue("resMarket") || undefined}
                            >
                                <Option value=""> </Option>
                                {data ? renderSelect(data.markets) : ""}
                            </Select>
                        }
                        name="resMarket" control={control} defaultValue="" />
                </div>
                <div className="col-span-6" style={{ padding: "0" }}>
                    <p className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.paymentBy")}:
                    </p>
                    <Controller
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.selectHere")}
                                showSearch
                                onChange={(e) => {
                                    onChange(e)
                                }}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                value={getValue("paymentMethod") || undefined}
                            >
                                <Option value=""> </Option>
                                {data ? renderSelect(data.paymentMethods) : ""}
                            </Select>
                        }
                        name="paymentMethod" control={control} defaultValue="" />
                </div>
            </ClassBox >
        </ >
    )
}
export default React.memo(CGuestProfile);