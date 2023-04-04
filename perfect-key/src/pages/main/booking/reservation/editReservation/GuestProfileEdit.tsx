/* eslint-disable @typescript-eslint/no-explicit-any */
import ClassBox from 'components/CClassBox'
import React, { useRef,useEffect,useState } from 'react'
import { Input, Select, Button, Checkbox,notification } from "antd";
import { Controller } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import clsx from 'clsx';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice";
import { guestProfileInBookingRSVN, searchRequest, searchWithQueryParam } from 'redux/controller';
import GLobalPkm from 'common/global';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {styleInput} from './styles/index.style';
import { setTraceInHouse } from 'redux/controller/trace.slice';
import { DataCEditRsvn } from 'common/model-rsvn';
import { TypeActionCode } from 'common/enum/tracer.enum';
const { Option } = Select;

interface ICGuestProfile extends Props {
    openDrawerGuestProfile?: any,
    setIsPrintRateByCompany?: any,
    control?: any,
    data?: any,
    setSelectValueSource?: any,
    valueSource?: any,
    getValues: any,
    setValue: any,
    dataEditRsvn?: DataCEditRsvn | null
}
const CGuestProfileEdit = ({ getValues, setValue, openDrawerGuestProfile, setIsPrintRateByCompany, control, data, dataEditRsvn, ...props }: ICGuestProfile): JSX.Element => {
    const classes = useStyleTheme(styleInput);
    const history = useHistory();
    const typingTimeoutRef = useRef(0);
    const dispatch = useDispatchRoot();
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const { dataSearchResults, guestProfile } = useSelectorRoot(state => state.booking);
    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const { t } = useTranslation("translation")
    useEffect(() => {
        if(isSearch){
            if(dataSearchResults.length === 0){
                notification.error({
                    message: <b>{`We couldn't find "${getValues("firstName") ?? ""} ${getValues("lastName") ?? ""}`}</b>,
                    placement : "topLeft",
                    style : { borderRadius : 6, top : "8vh" }
                });
            }
            else{
                history.push("/main/booking/search", {
                    firstName: getValues("firstName") ?? "",
                    guestName: getValues("lastName") ?? "",
                    bookingCode: getValues("bookingCode") ?? "",
                    searchBy: 5
                });
            }
            setIsSearch(false);
        }
        
    },[dataSearchResults, getValues, history, isSearch]);

    useEffect(() => {
        if(filteredCompanyProfile.length === 0){
            onSearch("")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dispatch, filteredCompanyProfile.length, getValues])
    const onSearchTransaction = () => {
        setIsSearch(true);
        const data = {
            hotelGuid: hotelId,
            arrivalDates: [],
            departureDates: [],
            companyAgentGuid: GLobalPkm.defaultBytes32,
            status: 5,
            rsvnCode: '',
            rsvnNo: 0,
            groupCode: getValues("bookingCode") ?? "",
            profiles: {
                phone: '',
                passport: '',
                firstName: getValues("firstName") ?? '',
                guestName: getValues("lastName") ?? ''
            },
            listRoomType: numberOfRooms
        }
        if (data.profiles?.firstName === "" && data.profiles?.guestName === "" && data.profiles?.passport === "" && data.profiles?.phone === "") {
            dispatch(searchWithQueryParam({ ...data, profileIds: [] }))
        } else {
            dispatch(searchRequest(data))
        }
    }
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }
    const onSearch = (val: any) => {
        let valueSearch = "";
        if(val.length > 0){
            valueSearch = val;
        }else{
            valueSearch = "g"
        }
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: valueSearch
            }))
        }, 300)
    }
    const getRSVNTypeByIdGuid = (idGuid: any, data: Array<any>) => {
        const resultRsvnType = data.find(x => x.guid === idGuid);
        if (resultRsvnType === undefined) {
            setValue("confirmed",false);
            return;
        }
        setValue("confirmed",resultRsvnType.isConfirm);
    }
    
    const getRateCodeByCompany = (guidSelect: any): void => {
        const selectCompanyOrAgent = filteredCompanyProfile.find((x: any) => x.guid === guidSelect);
        if (selectCompanyOrAgent?.resSource !== 0) {
            data.sources.forEach((item: any) => {
                if (selectCompanyOrAgent?.resSource === item.id) {
                    setValue("resSource", item.guid)
                }

            });
        }
        else {
            setValue("resSource", "")
        }
    }
    const pushFullName = () => {
        dispatch(guestProfileInBookingRSVN({
            ...guestProfile,
            firstName: getValues("firstName"),
            guestName: getValues("lastName")
        }))
    }
    const traceChange = (actionCode: number, oldValue: string, newValue: string) => {
        dispatch(setTraceInHouse({
            actionCode : actionCode,
            objectId: dataEditRsvn?.dataFotransactRoomDTO.id ?? 0,
            oldString: oldValue,
            newString: newValue,
            oldDate: new Date(dataEditRsvn?.dataFotransactRoomDTO.arrivalDate ?? "") ?? new Date(),
            newDate: new Date(),
            hotelGuid: hotelId
        }))
    }
    return (
        <ClassBox className={clsx(props.className)} key={"guest-profile-key"}>
            <div className="grid xl:grid-cols-12 col-span-12 pt-4 md:w-11/12 xl:w-full">
                <div className="col-span-2" style={{ padding: "0px 4px", marginRight: 15 }} >
                    <label className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.title")}:</label>
                    <Controller
                        render={({ onChange, value }) =>
                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                showSearch
                                value={value}
                                onChange={(e) => {
                                    onChange(e)
                                    traceChange(TypeActionCode.ChangeGuestTitle, value, e)
                                }}
                            >
                                <Option value="Mr.">{t("BOOKING.RESERVATION.EDITRESERVATION.mr")}</Option>
                                <Option value="Mrs">{t("BOOKING.RESERVATION.EDITRESERVATION.mrs")}</Option>
                                <Option value="Ms">{t("BOOKING.RESERVATION.EDITRESERVATION.ms")}</Option>
                            </Select>}
                        name="title" defaultValue="Mr." control={control} />
                </div>
                <div className="col-span-4">
                    <label className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.name")}:</label>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input}`}
                                onChange={e => {
                                    onChange(e)
                                    pushFullName()
                                    traceChange(TypeActionCode.ChangeGuestFirstName, value, e.target.value)
                                }}
                                value={value}
                                style={{ background: "#F5F6F7", height: 40 }}
                                placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.enterName")} required={true} />
                        }
                        control={control} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.enterName")} name="firstName" defaultValue=""
                    />
                </div>
                <div className="col-span-4 w-full" style={{ marginLeft: 15 }}>
                    <label className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.lastname")}:</label>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input} w-full`}
                                onChange={e => {
                                    onChange(e)
                                    pushFullName()
                                    traceChange(TypeActionCode.ChangeGuestLastName, value, e.target.value)
                                }}
                                style={{ background: "#F5F6F7", height: 40 }}
                                value={value}
                                placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.enterLastname")} />
                        }
                        control={control} name="lastName" defaultValue=""
                    />
                </div>
                <div className="col-span-12" style={{ marginTop: 10 }}>
                    <label className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.bookingCode")}:</label>
                    <Controller render={({ onChange, value }) =>
                        <Input
                            onChange={e => {
                                onChange(e)
                                traceChange(TypeActionCode.ChangeGroupCode, value, e.target.value)
                            }}
                            style={{ background: "#F5F6F7", height: 40, width: "100%" }} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.enterGroupOrBookingCode")} />
                    } name="bookingCode" control={control} defaultValue={""}
                    />
                </div>
            </div>
            <div className="flex justify-end col-span-12 pt-4 gap-3">
                <Button 
                    style={{ color: "#1A87D7" }} className={`${classes.buttonStyle} !rounded-md`} 
                    onClick={onSearchTransaction} loading={isSearch}>
                    {t("BOOKING.RESERVATION.EDITRESERVATION.search")}
                </Button>
                <Button type="primary"
                    className={`${classes.buttonStyle} !rounded-md !font-semibold`}
                    onClick={() => {
                        openDrawerGuestProfile(true);
                    }}>{t("BOOKING.RESERVATION.EDITRESERVATION.guestProfile")}</Button>
            </div>
            <div className="col-span-12 border-dashed border-t"></div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.paymentBy")}:
                </label>
                <Controller
                    // as={<Select className={` ${classes.selectBackground} w-full !rounded-md`} placeholder="Select here">
                    // {data ? renderSelect(data.paymentMethods) : ""}
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                onChange(e)
                                const getPayment = data.paymentMethods.find((x: any) => x.guid === value)
                                traceChange(TypeActionCode.ChangePaymentMethod, getPayment ? getPayment.ten : "", option.children)
                            }}
                            value={value}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.paymentMethods) : ""}
                        </Select>
                    }
                    name="paymentMethod" defaultValue="" control={control} />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.rsvnMarket")}:
                </label>
                <Controller
                    render={({ onChange, value }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                onChange(e)
                                const getResMarket = data.markets.find((x: any) => x.guid === value)
                                traceChange(TypeActionCode.ChangeResMarket, getResMarket ? getResMarket.ten : "", option.children)
                            }}
                            value={value}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.markets) : ""}
                        </Select>
                    }
                    name="resMarket" defaultValue="" control={control} />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <label className="font-base font-bold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.rsvnSource")}:</label>
                <Controller render={({ onChange, value, ref }) =>
                    <Select
                        showSearch
                        onChange={(e, option: any) => {
                            onChange(e)
                            const getSources = data.sources.find((x: any) => x.guid === value)
                            traceChange(TypeActionCode.ChangeResSouce, getSources ? getSources.ten : "", option.children)
                        }}
                        value={value}
                        filterOption={(input: any, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        className={`${classes.selectBackground} w-full !rounded-md`}
                        placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}>
                        <Option value=""> </Option>
                        {data ? renderSelect(data.sources) : ""}
                    </Select>
                }
                name="resSource" control={control} defaultValue="" />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <div className="col-span-12">
                    <label className="m-0 font-base font-bold">
                        {t("BOOKING.RESERVATION.EDITRESERVATION.rsvnType")}:
                    </label>

                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%", float: 'right', pointerEvents: "none", cursor: "no-drop", color: "#00293B" }}
                            className={`flex-row items-end font-base font-bold`}
                            checked={value}
                            onChange={(e) => {
                                onChange(e.target.checked)
                                traceChange(TypeActionCode.Confirm, value, `${e.target.checked}`)
                            }}

                        >
                            {t("BOOKING.RESERVATION.EDITRESERVATION.confirmed")}
                        </Checkbox>
                    )} name="confirmed" control={control} defaultValue={false} />
                </div>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                onChange(e)
                                getRSVNTypeByIdGuid(e, data ? data.rsvnTypes : [])

                                const getResType = data.rsvnTypes.find((x: any) => x.guid === value)
                                traceChange(TypeActionCode.ChangeResType, getResType ? getResType.ten : "", option.children)
                            }}
                            value={value}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.rsvnTypes) : ""}
                        </Select>
                    }
                    name="resType" control={control} defaultValue="" />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.rsvnOrigin")}:
                </label>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                onChange(e)
                                const getOrigin = data.origins.find((x: any) => x.guid === value)
                                traceChange(TypeActionCode.ChangeResOrigin, getOrigin ? getOrigin.ten : "", option.children)
                            }}
                            value={value}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.origins) : ""}
                        </Select>
                    }
                    name="origin" control={control} defaultValue="" />
            </div>

            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <label className="font-base font-bold m-0">{t("BOOKING.RESERVATION.EDITRESERVATION.rsvnChannel")}:</label>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                            showSearch
                            onChange={(e, option: any) => {
                                onChange(e)
                                const getResChanel = data.channels.find((x: any) => x.guid === value)
                                traceChange(TypeActionCode.ChangeResChanel, getResChanel ? getResChanel.ten : "", option.children)
                            }}
                            value={value}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.channels) : ""}
                        </Select>
                    }
                    name="resChanel" control={control} defaultValue="" />
            </div>

            <div className="col-span-8" style={{ padding: "0px 2px" }}>
                <label className="m-0 font-base font-bold">
                    {t("BOOKING.RESERVATION.EDITRESERVATION.companyOrAgent")}:
                </label>
                <Controller render={({ onChange, value }) =>
                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                        showSearch
                        onSearch={onSearch}
                        value={value}
                        filterOption={false}
                        onChange={(e, option: any) => {
                            onChange(e)
                            getRateCodeByCompany(e)

                            const companyAgentGuid = filteredCompanyProfile.find((x: any) => x.guid === value)
                            traceChange(TypeActionCode.ChangeCompanyOrAgent, companyAgentGuid ? companyAgentGuid.ten ?? "": "", option.children)
                        }}
                    >
                        <Option value=""> </Option>
                        {filteredCompanyProfile.length ? renderSelect(filteredCompanyProfile) : ""}
                    </Select>
                }
                name="companyAgentGuid" control={control} defaultValue="" />
            </div>
        </ClassBox >
    );
};

export default React.memo(CGuestProfileEdit);