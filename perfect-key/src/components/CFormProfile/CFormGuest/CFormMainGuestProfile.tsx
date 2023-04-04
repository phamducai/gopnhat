/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { createStyles, useStyleTheme } from "theme/Theme";
import { Controller, useForm } from 'react-hook-form';
import { Input, Select } from 'antd';
import CScrollView from 'components/CScrollView';
import DatePicker from 'components/CDatePicker';
import { styleCRangePicker } from 'components/CRangePicker';
import clsx from 'clsx';
import CIconSvg from 'components/CIconSvg';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import Utils from 'common/utils';
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice"
import { styleCForm } from '../../../pages/main/booking/styles/styleCForm';
import { useTranslation } from 'react-i18next';
import { GuestProfileNoRsvn } from "common/model-profile";
import GLobalPkm from 'common/global';
const { TextArea } = Input;
const { Option } = Select;

export const styleFormMain = createStyles((theme) => ({
    title: {
        color: "#1A87D7",
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    borderColor: {
        borderColor: "#E7E7E7 !important"
    },
    colorLabel: {
        color: '#1A87D7'
    },
    customrPicker: {
        "& .ant-picker-input": {
            height: "38px !important"
        }
    }
}));

interface IFormMainGuestProfile extends Props {
    valueForm: any,
    onSearchFirstName: any,
    openNewCompanyOrAgent: any,
    valueGuestProfile: any,
    guestInfoByGuid?: GuestProfileNoRsvn | null
}

const FormMainGuestProfile = ({ valueForm, onSearchFirstName, openNewCompanyOrAgent, valueGuestProfile, guestInfoByGuid, ...props }: IFormMainGuestProfile): JSX.Element => {
    const classes = useStyleTheme(styleFormMain);
    const classesForm = useStyleTheme(styleCForm);
    const classesDatepicker = useStyleTheme(styleCRangePicker);
    const { handleSubmit, control, setValue, getValues, reset } = useForm();
    const dispatch = useDispatchRoot();
    const { hotelId } = useSelectorRoot(state => state.app);
    const { guestProfile } = useSelectorRoot(state => state?.booking);
    const mapGuestProfile = { ...guestProfile }
    const { guestDetailOptions, filteredCompanyProfile } = useSelectorRoot(state => state?.rsvn);
    const typingTimeoutRef = React.useRef(0);
    //const dispatch = useDispatchRoot();
    //const { formatBirthDay, setFormatBirthDay } = useState(selectedProfile?.birthday);
    const { t } = useTranslation("translation")

    const onSubmit = handleSubmit((data) => {
        valueForm(data);
        setTimeout(() => {
            if (guestInfoByGuid == null) {
                reset({})
            }
        }, 1000);
    });

    useEffect(() => {
        if (valueGuestProfile !== null) {
            const dataForm: any = Object.assign({}, valueGuestProfile);
            for (const key of Object.keys(dataForm)) {
                if (dataForm[key] !== null || dataForm[key] !== "0") {
                    setValue(key, dataForm[key]);
                }
            }
        }
        if (guestInfoByGuid !== null) {
            const dataForm: any = Object.assign({}, guestInfoByGuid);
            for (const key of Object.keys(dataForm)) {
                if (dataForm[key] !== null || dataForm[key] !== "0") {
                    setValue(key, dataForm[key]);
                }
            }
        } else {
            reset({})
        }
    }, [valueGuestProfile, guestInfoByGuid])
    const renderSelect = (data: any, isGuidValue = true) => {
        return data?.map((item: any) => {
            return (
                <Option value={isGuidValue ? item.guid : item.ten} key={item.guid}>{item.ten}</Option>
            )
        })
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

    return (
        <div className={`${props.className}`}>
            <CScrollView overlayClassScroll="custom-scrollbar-pkm">
                <form id='formMainGuestProfile' style={{ height: 'calc(100vh - 230px)', padding: "24px" }} onSubmit={onSubmit}>
                    <div className="grid grid-cols-12 !pb-4 gap-2 text-xs font-bold leading-7">
                        <div className={`${classes.title} mt-2 col-span-12`}>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.generalInformation")}</div>
                        <div className={`col-span-4`}>
                            <div className={classes.colorLabel}>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.firstname")}:</div>
                            <Controller
                                name='firstName' control={control}
                                defaultValue={guestProfile ? (guestProfile?.firstName ?? "") : undefined}
                                render={({ onChange, value }) => (
                                    <Input
                                        onChange={(e: any) => onChange(e)}
                                        value={value}
                                        suffix={<CIconSvg tooltip={{ title: "Search" }} className='cursor-pointer' onClick={() => onSearchFirstName(value)} name="search" hexColor="#1A87D7" svgSize="small" />}
                                        className={`${classesForm.input} w-full`}
                                        type="text" placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.enterFirstname")} />
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div className={classes.colorLabel}>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.lastname")}:</div>
                            <Controller
                                defaultValue={guestProfile ? guestProfile?.guestName : ""} name='guestName' control={control}
                                as={<Input className={`${classesForm.input} w-full`} type="text" placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.enterLastname")} />} />
                        </div>
                        <div className={`col-span-2`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.title")}:</div>
                            <Controller
                                name='titlesGuid' control={control}
                                defaultValue={guestProfile ? guestProfile?.titlesGuid : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value={GLobalPkm.defaultBytes32} > </Option>
                                        {guestDetailOptions ? renderSelect(guestDetailOptions.guestTitle) : ""}

                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-2`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.category")}:</div>
                            <Controller
                                name='guestType' control={control}
                                defaultValue={guestProfile ? guestProfile?.guestType : guestDetailOptions?.guestType[0]?.ten}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestDetailOptions ? renderSelect(guestDetailOptions?.guestType) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-8`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.address")}:</div>
                            <Controller
                                name='adress' control={control}
                                defaultValue={guestProfile ? guestProfile?.adress : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.enterAddress")} />} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.profession")}:</div>
                            <Controller
                                name='profession' control={control}
                                defaultValue={guestProfile ? guestProfile?.profession : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.enterProfession")} />} />
                        </div>
                        <div className={`col-span-8`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.email")}:</div>
                            <Controller
                                name='email' control={control}
                                defaultValue={guestProfile ? guestProfile?.email : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.exampleEmail")} />} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.guestCity")}:</div>
                            <Controller
                                name='city' control={control}
                                defaultValue={guestProfile ? guestProfile?.city : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-8`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.nationality")}:</div>
                            <Controller
                                name='nationalityGuid' control={control}
                                defaultValue={guestProfile?.nationalityGuid ? guestProfile?.nationalityGuid : guestDetailOptions?.nationality.find(x => x.ma === "VNM").guid}
                                render={({ onChange, value }) => (
                                    <Select
                                        showSearch
                                        bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.selectTheNational")}
                                        value={value} onChange={e => onChange(e)}
                                        filterOption={(input: any, option: any) => (option.children.toString()).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {guestDetailOptions ? renderSelect(guestDetailOptions?.nationality) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.guestType")}:</div>
                            <Controller
                                name='guestType' control={control}
                                defaultValue={guestProfile ? guestProfile?.guestType : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.language")}:</div>
                            <Controller
                                defaultValue={guestProfile ? guestProfile?.languages : ""}
                                name='languages' control={control}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value}
                                        onChange={e => onChange(e)}
                                    >
                                        {guestDetailOptions ? renderSelect(guestDetailOptions?.languages) : ""}
                                        <Option value={GLobalPkm.defaultBytes32}>Orther</Option>
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div className={classes.colorLabel}>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.birthday")}:</div>
                            <Controller
                                name='birthDay' control={control}
                                defaultValue={""}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        clearIcon
                                        placeholder="DD/MM/YYYY"
                                        format="DD/MM/YYYY"
                                        defaultValue={guestProfile ? Utils.convertBirthDateFormat(guestProfile?.birthDay) : undefined}
                                        className={`${clsx(classesDatepicker.datePicker, classesForm.input, classes.borderColor)} w-full`}
                                        onChange={(date, dateString) => onChange(date)} />
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.phoneOrFax")}:</div>
                            <Controller
                                name='phone' control={control}
                                defaultValue={guestProfile ? guestProfile?.phone : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" placeholder="000-000-0000" />} />
                        </div>
                        <div className={`col-span-12 my-2 border-dashed border-b-2 border-gray-200`} />
                        <div className={`${classes.title} col-span-12`}>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.passportInformation")}</div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.passport")}:</div>
                            <Controller
                                name='passport' control={control}
                                defaultValue={guestProfile ? guestProfile?.passport : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.date")}:</div>
                            <Controller
                                name='passportDate' control={control}
                                defaultValue={""}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        clearIcon
                                        placeholder="DD/MM/YYYY"
                                        format="DD/MM/YYYY"
                                        defaultValue={guestProfile ? Utils.convertBirthDateFormat(guestProfile?.passportDate) : undefined}
                                        className={`${clsx(classesDatepicker.datePicker, classesForm.input, classes.borderColor)} w-full`}
                                        onChange={(date, dateString) => onChange(date)} />
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div className="flex items-center">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.company")}: <CIconSvg onClick={() => openNewCompanyOrAgent(0)} tooltip={{ title: t("BOOKING.RESERVATION.FORMGUESTPROFILE.addNewCompany") }} className="pl-1 cursor-pointer" name="info" hexColor="#1A87D7" svgSize="small" /></div>
                            <Controller
                                defaultValue={guestProfile ? guestProfile?.companyGuid : ""}
                                name='companyGuid' control={control}
                                render={({ onChange, value }) => (
                                    <Select
                                        showSearch
                                        onSearch={onSearch}
                                        filterOption={false}
                                        bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        // Company field is a drop down.
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />} placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.selectCompany")}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value=""> </Option>
                                        {filteredCompanyProfile ? renderSelect(filteredCompanyProfile) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.visa")}#</div>
                            <Controller
                                name='visaNumber' control={control}
                                defaultValue={guestProfile ? guestProfile?.visaNumber : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.expDate")}:</div>
                            <Controller
                                defaultValue={""}
                                name='visaExpDate' control={control}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        clearIcon
                                        placeholder="DD/MM/YYYY"
                                        format="DD/MM/YYYY"
                                        defaultValue={guestProfile ? Utils.convertBirthDateFormat(guestProfile?.visaExpDate) : undefined}
                                        className={`${clsx(classesDatepicker.datePicker, classesForm.input, classes.borderColor)} w-full`}
                                        onChange={(date, dateString) => onChange(date)} />
                                )} />
                        </div>
                        {/* <div className={`col-span-4`}>
                            <div className="flex items-center">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.agent")}: <CIconSvg onClick={() => openNewCompanyOrAgent(1)} tooltip={{ title: t("BOOKING.RESERVATION.FORMGUESTPROFILE.addNewAgent") }} className="pl-1 cursor-pointer" name="info" hexColor="#1A87D7" svgSize="small" /></div>
                            <Controller
                                name='agentGuid' control={control}
                                defaultValue={guestProfile ? guestProfile?.agentGuid : ""}
                                render={({ onChange, value }) => (
                                    <Select
                                        showSearch
                                        onSearch={onSearch}
                                        filterOption={false}
                                        bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg className='cursor-pointer' name="vector" hexColor="#1A87D7" svgSize="small" />} placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.selectAgent")}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value=""> </Option>
                                        {filteredCompanyProfile ? renderSelect(filteredCompanyProfile.filter(x => x.kind === 1)) : ""}
                                    </Select>
                                )} />
                        </div> */}
                        <div className={`col-span-12 my-2 border-dashed border-b-2 border-gray-200`} />
                        <div className={`${classes.title} col-span-12`}>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.purchaseInformation")}</div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.purpose")}:</div>
                            <Controller
                                defaultValue='' name='source' control={control}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />} placeholder={t("BOOKING.RESERVATION.FORMGUESTPROFILE.selectPurpose")}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value=""> </Option>
                                        {guestDetailOptions ? renderSelect(guestDetailOptions?.sources, false) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.cardNo")}</div>
                            <Controller
                                name='ccno' control={control}
                                defaultValue={guestProfile ? guestProfile?.ccno : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.type")}:</div>
                            <Controller
                                defaultValue='' name='ccmadeBy' control={control}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />} placeholder="Select the national"
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value=""> </Option>
                                        <Option value={0}>Option 1</Option>
                                        <Option value={1}>Option 2</Option>
                                        <Option value={2}>Option 3</Option>
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-2`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.expDate")}:</div>
                            <Controller
                                name='ccexpDate' control={control}
                                defaultValue={""}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        clearIcon
                                        placeholder="DD/MM/YYYY"
                                        format="DD/MM/YYYY"
                                        defaultValue={guestProfile ? Utils.convertBirthDateFormat(guestProfile?.ccexpDate) : undefined}
                                        className={`${clsx(classesDatepicker.datePicker, classesForm.input, classes.borderColor, classes.customrPicker)} w-full`}
                                        style={{ width: "144px", height: "40px" }}
                                        onChange={(date, dateString) => onChange(date)} />
                                )} />
                        </div>
                        <div className={`col-span-2`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.entryDate")}:</div>
                            <Controller
                                name='entryDate' control={control}
                                defaultValue={""}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        clearIcon
                                        placeholder="DD/MM/YYYY"
                                        format="DD/MM/YYYY"
                                        defaultValue={guestProfile ? Utils.convertBirthDateFormat(guestProfile?.entryDate) : undefined}
                                        className={`${clsx(classesDatepicker.datePicker, classesForm.input, classes.borderColor, classes.customrPicker)} w-full`}
                                        style={{ width: "144px", height: "40px" }}
                                        onChange={(date, dateString) => onChange(date)} />
                                )} />
                        </div>
                        <div className={`col-span-8`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.entryPort")}:</div>
                            {/* <Controller 
                                name='entryPort' control={control}
                                defaultValue={guestProfile ? guestProfile?.entryPort : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} /> */}
                            <Controller
                                name='entryPort' control={control}
                                defaultValue={guestProfile ? guestProfile?.entryPort : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value=""> </Option>
                                        {guestDetailOptions ? renderSelect(guestDetailOptions?.entryPorts) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.adNo")}</div>
                            <Controller
                                name='adnumber' control={control}
                                defaultValue={guestProfile ? guestProfile?.adnumber : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.groupGuest")}:</div>
                            <Controller render={({ onChange, value }) => <Input
                                className={`${classesForm.input} w-full text-right`}
                                type="number" placeholder="0" value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} ></Input>}
                                name="groupsGuest" defaultValue={guestProfile ? guestProfile?.groupsGuest : 0} control={control} />
                            {/* <Controller 
                                name='groupsGuest' control={control}
                                defaultValue={guestProfile ? guestProfile?.groupsGuest : 0}
                                as={<Input className={`${classesForm.input} w-full text-right`}
                                    placeholder='0' type="number" />} /> */}
                        </div>
                        <div className={`col-span-4`}>
                            <div>#{t("BOOKING.RESERVATION.FORMGUESTPROFILE.guest")}:</div>
                            <Controller render={({ onChange, value }) => <Input
                                className={`${classesForm.input} w-full text-right`}
                                type="number" placeholder="0" value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} ></Input>}
                                name="noOfGuest" defaultValue={guestProfile ? guestProfile?.noOfGuest : 0} control={control} />
                            {/* <Controller 
                                name='noOfGuest' control={control}
                                defaultValue={guestProfile ? guestProfile?.noOfGuest : 0}
                                as={<Input className={`${classesForm.input} w-full text-right`}
                                    placeholder="0" type="number" />} /> */}
                        </div>
                        <div className={`col-span-3`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.deposit")}:</div>
                            <Controller render={({ onChange, value }) => <Input
                                className={`${classesForm.input} w-full text-right`}
                                type="number" placeholder="0" value={value} onChange={(e) => { onChange(e.target.valueAsNumber) }} ></Input>}
                                name="deposit" defaultValue={guestProfile ? guestProfile?.deposit : 0} control={control} />
                            {/* <Controller 
                                name='deposit' control={control}
                                defaultValue={guestProfile ? guestProfile?.deposit : 0}
                                as={<Input className={`${classesForm.input} w-full text-right`}
                                    defaultValue={0} type="number" />} /> */}
                        </div>
                        <div className={`col-span-3`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.accCode")}:</div>
                            <Controller
                                name='accountCode' control={control}
                                defaultValue={guestProfile ? guestProfile?.accountCode : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-3`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.vatCode")}:</div>
                            <Controller
                                name='taxCode' control={control}
                                defaultValue={guestProfile ? guestProfile?.taxCode : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-3`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.prefOrLast")}:</div>
                            <Controller
                                name='prefLast' control={control}
                                defaultValue={guestProfile ? guestProfile?.prefLast : ""}
                                as={<Input className={`${classesForm.input} w-full`}
                                    type="text" />} />
                        </div>
                        <div className={`col-span-12`}>
                            <div>{t("BOOKING.RESERVATION.FORMGUESTPROFILE.remark")}:</div>
                            <Controller
                                name='comments' control={control}
                                defaultValue={guestProfile ? guestProfile?.comments : ""}
                                as={<TextArea className={`${classesForm.input} !py-1 w-full`} autoSize={{ minRows: 3, maxRows: 6 }} />} />
                        </div>
                    </div>
                </form>
            </CScrollView>
        </div>
    )
};

export default React.memo(FormMainGuestProfile);