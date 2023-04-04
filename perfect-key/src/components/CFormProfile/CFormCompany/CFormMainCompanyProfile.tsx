/* eslint-disable*/
import React, { useState } from 'react'
import CScrollView from 'components/CScrollView';
import { useStyleTheme } from "theme/Theme";
import { Input, Select, Checkbox } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import CIconSvg from 'components/CIconSvg';
import { useSelectorRoot } from 'redux/store';
import { styleFormMain } from '../styles/index.style';
import { styleCForm } from '../../../pages/main/booking/styles/styleCForm';
import { useTranslation } from 'react-i18next';
const { Option } = Select;
const { TextArea } = Input;

const FormMainCompanyProfile = ({ ...props }: any) => {
    const { control, getValues } = props;
    const { data } = useSelectorRoot(state => state?.rsvn);
    const sources = data?.sources;
    const rateCodes = data?.rateCodes;
    const classes = useStyleTheme(styleFormMain);
    const classesForm = useStyleTheme(styleCForm);
    const { selectedProfile } = useSelectorRoot(state => state?.booking);
    const [numberTel, setNumberTel] = useState<string>("");
    const [numberFax, setNumberFax] = useState<string>("");
    const [activeDel, setActiveDel] = useState<boolean>(false);
    const { t } = useTranslation("translation")

    const handleOnChange = (e: any) => {
        const { name, value } = e.target;
        //console.log(e.target.name);
        // dataMainCompany = { ...dataMainCompany, [name]: value }
        // console.log(dataMainCompany);
    }
    const formatTelAndFaxNumber = (currentValue: string, preValue: string) => {
        let newNumberFormat: string = currentValue;
        if (!activeDel) {
            if (currentValue.length === 4) {
                newNumberFormat = currentValue.slice(0, 3) + '-' + currentValue.slice(3, 4);
            }
            if (currentValue.length === 8) {
                newNumberFormat = currentValue.slice(0, 7) + '-' + currentValue.slice(7, 8);
            }
        }
        return newNumberFormat;
    }
    return (
        <CScrollView overlayClassScroll="custom-scrollbar-pkm" className="h-full">
            <div className={`grid grid-cols-12 mt-1 gap-2 text-xs font-bold leading-7 ${classes.textColor}`} style={{ padding: '15px' }}>
                <div className={`${classes.title} mt-2 col-span-12`}>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.generalInformation")}</div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.code")}:</div>
                    <Controller
                        defaultValue='' name='ma' control={control}
                        as={<Input defaultValue={selectedProfile.length > 0 ? (selectedProfile[0]?.firstName ?? "") : ""} className={`${classesForm.input} w-full`} type="text" placeholder={t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.enterCode")} />} />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.kind")}:</div>
                    <Controller
                        name="kind"
                        control={control}
                        defaultValue={0}
                        render={({ onChange, value }) =>
                            <Select bordered={false} className={`${classesForm.input} font-normal p-0 w-full h-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                placeholder={t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.company")}
                                value={getValues("kind")}
                                onChange={(e: any) => {
                                    onChange(e)
                                }}
                            >
                                <Option value={0}>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.company")}</Option>
                                <Option value={1}>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.agent")}</Option>
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.accCode")}</div>
                    <Controller
                        defaultValue="" name="accCode" control={control}
                        as={
                            <Input
                                className={`${classesForm.input} w-full`} type="text" placeholder={t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.enterCode")} />
                        }
                    />
                </div>
                <div className={`col-span-6`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.briefName")}</div>
                    <Controller
                        defaultValue="" name="ten" control={control}
                        as={
                            <Input
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-6`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.accName")}</div>
                    <Controller
                        defaultValue="" name="tenDayDu" control={control}
                        as={
                            <Input
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-12`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.address")}</div>
                    <Controller
                        defaultValue="" name="diaChiText" control={control}
                        as={
                            <Input
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.tel")}</div>
                    <Controller
                        defaultValue="" name="dienThoai" control={control}
                        render={({ onChange, value }) =>
                            <Input
                                placeholder={"000-000-0000"}
                                value={numberTel}
                                onChange={e => {
                                    onChange(e);
                                    //handleOnChange(e)
                                    let res = formatTelAndFaxNumber(e.target.value, value);
                                    setNumberTel(res);
                                }}
                                onKeyDown={e => {
                                    e.key === "Backspace" ? setActiveDel(true) : setActiveDel(false);
                                }}
                                maxLength={12}
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.fax")}</div>
                    <Controller
                        defaultValue="0000" name="fax" control={control}
                        render={({ onChange, value }) =>
                            <Input
                                placeholder={"000-000-0000"}
                                value={numberFax}
                                onChange={e => {
                                    onChange(e);
                                    //handleOnChange(e)
                                    let res = formatTelAndFaxNumber(e.target.value, value);
                                    setNumberFax(res);
                                }}
                                onKeyDown={e => {
                                    e.key === "Backspace" ? setActiveDel(true) : setActiveDel(false);
                                }}
                                maxLength={12}
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.tax")}</div>
                    <Controller
                        defaultValue="" name="maSoThue" control={control}
                        render={({ onChange, value }) =>
                            <Input
                                placeholder={"000000000"}
                                onChange={e => {
                                    onChange(e);
                                    handleOnChange(e)
                                }}
                                maxLength={10}
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.rateCode")}</div>
                    <Controller
                        name="rateCode"
                        control={control}
                        defaultValue={0}
                        render={({ onChange, value }) =>
                            <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                onChange={(e) => onChange(e)}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                            >
                                {rateCodes ? rateCodes.map((item: any, index: any) => {
                                    return (
                                        <Option key={index} value={item.id}>{item.ten}</Option>
                                    )
                                })
                                    : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.rateCode")} 2</div>
                    <Controller
                        name="rateCode2"
                        control={control}
                        defaultValue={0}
                        render={({ onChange, value }) =>
                            <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                onChange={(e) => onChange(e)}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                            >
                                {rateCodes ? rateCodes.map((item: any, index: any) => {
                                    return (
                                        <Option key={index} value={item.id}>{item.ten}</Option>
                                    )
                                })
                                    : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.rateCode")} 3</div>
                    <Controller
                        name="rateCode3"
                        control={control}
                        defaultValue={0}
                        render={({ onChange, value }) =>
                            <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                onChange={(e) => onChange(e)}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                            >
                                {rateCodes ? rateCodes.map((item: any, index: any) => {
                                    return (
                                        <Option key={index} value={item.id}>{item.ten}</Option>
                                    )
                                })
                                    : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`${classes.title} mt-2 col-span-12`}>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.representativeInformation")}</div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.director")}</div>
                    <Controller
                        defaultValue="" name="giamDoc" control={control}
                        as={
                            <Input
                                className={`${classesForm.input} w-full`} type="text" placeholder={t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.enterName")} />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.salesId")}</div>
                    <Controller defaultValue={0} name="resSource" control={control}
                        render={({ onChange, value }) =>
                            <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                onChange={e => {
                                    onChange(e);
                                }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                            >
                                {sources ? sources.map((item: any, index: any) => {
                                    return (
                                        <Option key={index} value={item.id}>{item.ten}</Option>

                                    )
                                })
                                    : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.bankAcc")}</div>
                    <Controller
                        defaultValue="" name="accCode" control={control}
                        as={
                            <Input
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-8`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.email")}</div>
                    <Controller
                        defaultValue="" name="email" control={control}
                        as={
                            <Input
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.website")}</div>
                    <Controller
                        defaultValue="" name="webSite" control={control}
                        render={({ onChange, value }) =>
                            <Input
                                onChange={e => {
                                    onChange(e);
                                    handleOnChange(e)
                                }}
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.chiefAcc")}</div>
                    <Controller
                        defaultValue="" name="keToanTruong" control={control}
                        render={({ onChange, value }) =>
                            <Input
                                onChange={e => {
                                    onChange(e);
                                    handleOnChange(e)
                                }}
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.contactPerson")}</div>
                    <Controller
                        defaultValue="" name="nguoiGiaoDich" control={control}
                        render={({ onChange, value }) =>
                            <Input
                                onChange={e => {
                                    onChange(e);
                                    handleOnChange(e)
                                }}
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className="col-span-12 flex pt-2">
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (<Checkbox style={{ display: "flex", color: "#00293B", fontWeight: 600 }} checked={value} className="flex-row items-center font-semibold" defaultChecked={true} onChange={(e) => onChange(e.target.checked)}>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.printRate")}</Checkbox>)}
                        name="isPrintRate" defaultValue={false} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (<Checkbox style={{ display: "flex", color: "#00293B", fontWeight: 600 }} className="flex-row items-center font-semibold" checked={value} defaultChecked={true} onChange={(e) => onChange(e.target.checked)}>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.rateIsNet")}</Checkbox>)}
                        name="isRateNet" defaultValue={false} control={control} />
                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (<Checkbox style={{ display: "flex", color: "#00293B", fontWeight: 600 }} checked={value} onChange={(e) => onChange(e.target.checked)} className="flex-row items-center font-semibold" defaultChecked={false}>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.vat")}</Checkbox>)}
                        name="isVat" defaultValue={false} control={control} />
                </div>
                <div className={`col-span-12`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.comment")}</div>
                    <Controller
                        defaultValue="" name="ghiChu" control={control}
                        render={({ onChange, value }) =>
                            <TextArea
                                style={{ height: 73 }}
                                onChange={e => {
                                    onChange(e);
                                    handleOnChange(e)
                                }}
                                className={`${classesForm.input} w-full`} />
                        }
                    />
                </div>
            </div>
        </CScrollView >
    )
}
export default React.memo(FormMainCompanyProfile);