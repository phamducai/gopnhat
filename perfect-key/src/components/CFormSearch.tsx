/* eslint-disable */
import React, { useState } from 'react';
import { createStyles, useStyleTheme } from "theme/Theme";
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Radio, Select } from 'antd';
import { ICFormSearch, IFormSearch } from 'common/define-booking';
import CScrollView from 'components/CScrollView';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import CIconSvg from 'components/CIconSvg';
import { LoadingOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';
import DatePicker from 'components/CDatePicker';
import { useSelectorRoot } from 'redux/store';
import Utils from 'common/utils';
import { styleCForm } from '../pages/main/booking/styles/styleCForm';
import { useTranslation } from 'react-i18next';
const { Option } = Select;

type FormData = {
    searchBy: number,
    lastName: string;
    isOnlyMainGuest: boolean;
    rsvn: string,
    room: string,
    id: string,
    groupCode: string,
    phone: string,
    passport: string,
    firstName: string;
    guestName: string,
    dateArrival: any,
    companyAgent: string,
    dateDeparture: any,
};


const CFormSearch = ({ propsOnChange, isLoading = false, selectCompanyAgent, companyAgent, loadingSearchProfile, ...props }: ICFormSearch): JSX.Element => {
    const classes = useStyleTheme(styleCForm);
    const [valueSelect, setValueSelect] = useState()
    const location = useLocation<any>()
    
    const defaultValueForm = location.state
    const { changeStatusProfiles } = useSelectorRoot(state => state.booking);
    const [isClick, setIsClick] = useState<boolean>(false)
    const { t } = useTranslation("translation")
    const { control, handleSubmit, register, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            searchBy: defaultValueForm?.searchBy ?? 0,
            isOnlyMainGuest: defaultValueForm?.isOnlyMainGuest ?? false,
            rsvn: defaultValueForm?.rsvn ?? "",
            room: defaultValueForm?.room ?? "",
            id: defaultValueForm?.id ?? "",
            groupCode: defaultValueForm?.groupCode ?? "",
            phone: defaultValueForm?.phone ?? "",
            passport: defaultValueForm?.passport ?? "",
            firstName: defaultValueForm?.firstName ?? "",
            guestName: defaultValueForm?.guestName ?? "",
            dateArrival: defaultValueForm?.dateArrival ? { from: defaultValueForm.dateArrival[0], to: defaultValueForm.dateArrival[1], isOpen: false } : {},
            companyAgent: defaultValueForm?.companyAgent ?? '00000000-0000-0000-0000-000000000000',
            dateDeparture: defaultValueForm?.dateDeparture ? { from: defaultValueForm.dateDeparture[0], to: defaultValueForm.dateDeparture[1], isOpen: false } : {}
        }
    });

    const onSubmit = handleSubmit((formSearch: IFormSearch) => {
        propsOnChange({
            ...formSearch,
            dateArrival: (formSearch.dateArrival.from && formSearch.dateArrival.to) ? [formSearch.dateArrival.from, formSearch.dateArrival.to] : [],
            dateDeparture: (formSearch.dateDeparture.from && formSearch.dateDeparture.to) ? [formSearch.dateDeparture.from, formSearch.dateDeparture.to] : []
        });
    });

    React.useEffect(() => {
        if (changeStatusProfiles) {
            onSubmit()
        }
    }, [changeStatusProfiles])

    const onSearch = React.useCallback((value: any) => {
        selectCompanyAgent(value)
    }, [valueSelect])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(valueSelect)
        }, 800)
        return () => clearTimeout(timeout)
    }, [valueSelect])

    return (
        <div className={`${props.className}`}>
            <div className={`${classes.header} col-span-12 flex items-center px-7`}>
                {t("BOOKING.searchCriteria")}:
            </div>
            <CScrollView overlayClassScroll={isClick ? 'custom-scrollbar-pkm-hidden' : 'custom-scrollbar-pkm'}>
                <form onSubmit={onSubmit}>
                    <div className={`${classes.siderbarForm} grid grid-cols-12 gap-x-3 gap-y-2 px-7`}>
                        <div className={`${classes.label} font-semibold col-span-12`}>{t("BOOKING.searchBy")}:</div>
                        <Controller
                            control={control}
                            name="searchBy"
                            render={({ onChange }) => (
                                <Radio.Group
                                    className={`${classes.radioGroup} col-span-12 font-semibold text-base`}
                                    defaultValue={defaultValueForm?.searchBy ?? 0}
                                    onChange={e => { onChange(e.target.value) }}
                                >
                                    <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/2`} value={1}>{t("BOOKING.inHouse")}</Radio>
                                    <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/2`} value={2}>{t("BOOKING.history")}</Radio>
                                    <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/2`} value={0}>{t("BOOKING.reservation")}</Radio>
                                    <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/2`} value={4}>{t("BOOKING.noShow")}</Radio>
                                    <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/2`} value={3}>{t("BOOKING.cancelled")}</Radio>
                                    <Radio style={{ color: "#00293B", marginBottom: "10px" }} className={`w-1/2`} value={5}>{t("BOOKING.all")}</Radio>
                                </Radio.Group>
                            )}
                        />
                        <hr className="col-span-12" />
                        <Controller
                            name="isOnlyMainGuest"
                            control={control}
                            render={({ onChange }) => <Checkbox
                                defaultChecked={defaultValueForm?.isOnlyMainGuest ?? false}
                                style={{ color: '#00293B' }}
                                className={`col-span-12 font-bold`}
                                onChange={e => { onChange(e.target.checked) }}>{t("BOOKING.mainGuestOnly")}</Checkbox>} />
                        <div className={`${classes.label} font-semibold col-span-12 `}>{t("BOOKING.searchValue")}:</div>
                        <div className="col-span-4">
                            <label className={classes.labelInput}>{t("BOOKING.rsvnNo")}:</label>
                            <Controller as={<Input {...register("rsvn", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classes.input} w-full ${errors.rsvn && '!border-red-500'}`} type="number" />} name="rsvn" control={control} />
                        </div>

                        <div className="col-span-4">
                            <label className={classes.labelInput}>{t("BOOKING.roomNo")}:</label>
                            <Controller as={<Input {...register("room", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classes.input} w-full ${errors.room && '!border-red-500'}`} type="text" />} name="room" control={control} />
                        </div>

                        <div className="col-span-4">
                            <label className={classes.labelInput}>{t("BOOKING.id")}:</label>
                            <Controller as={<Input {...register("id", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classes.input} w-full ${errors.id && '!border-red-500'}`} type="text" />} name="id" control={control} />
                        </div>

                        <div className="col-span-12">
                            <label className={classes.labelInput}>{t("BOOKING.groupOrBookingCode")}:</label>
                            <Controller as={<Input {...register("groupCode", {
                                required: false,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' placeholder={t("BOOKING.enterGroupOrBookingCode")} className={`${classes.input} w-full ${errors.groupCode && '!border-red-500'}`} type="text" />} name="groupCode" control={control} />
                        </div>

                        <div className="col-span-6">
                            <label className={classes.labelInput}>{t("BOOKING.mobileNumber")}:</label>
                            <Controller
                                as={<Input {...register("phone", {
                                    required: false,
                                    maxLength: 20,
                                    // pattern: /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
                                })}
                                    autoComplete='off' className={`${classes.input} w-full ${errors.phone && '!border-red-500'}`} type="text" />}
                                name="phone" control={control} />
                        </div>
                        <div className="col-span-6">
                            <label className={classes.labelInput}>{t("BOOKING.passport")}:</label>
                            <Controller
                                as={<Input {...register("passport", {
                                    required: false,
                                    maxLength: 20,
                                    // pattern: /^[A-Za-z]+$/i,
                                })} autoComplete='off' className={`${classes.input} w-full ${errors.passport && '!border-red-500'}`}
                                    type="text" />} name="passport" control={control} />
                        </div>
                        <div className="col-span-6">
                            <label className={classes.labelInput}>{t("BOOKING.firstname")}:</label>
                            <Controller
                                as={<Input {...register("firstName", {
                                    required: false,
                                    maxLength: 20,
                                    // pattern: /^[A-Za-z]+$/i,
                                })} autoComplete='off' className={`${classes.input} w-full ${errors.firstName && '!border-red-500'}`} type="text" />} name="firstName" control={control} />
                        </div>
                        <div className="col-span-6">
                            <label className={classes.labelInput}>{t("BOOKING.lastname")}:</label>
                            <Controller as={<Input {...register("guestName", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classes.input} w-full ${errors.guestName && '!border-red-500'}`} type="text" />} name="guestName" control={control} defaultValue={defaultValueForm?.guestName ?? ""} />
                        </div>
                        <div className="col-span-12">
                            <label className={classes.labelInput}>{t("BOOKING.arrival")}:</label>
                            <Controller
                                name="dateArrival"
                                control={control} render={({ onChange, value }) => (
                                    <div className="flex items-center">
                                        <DatePicker
                                            defaultValue={defaultValueForm?.dateArrival && defaultValueForm.dateArrival[0]}
                                            onClick={() => onChange({ ...value, isOpen: false })}
                                            placeholder={t("BOOKING.from")}
                                            className={classes.datePicker}
                                            format={Utils.typeFormatDate()}
                                            onChange={(date) => onChange({ ...value, from: date, isOpen: true })} />
                                        <div style={{ width: "12px", padding: "0 4px" }} className="font-bold flex justify-center">~</div>
                                        <DatePicker
                                            defaultValue={defaultValueForm?.dateArrival && defaultValueForm.dateArrival[1]}
                                            onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                            onBlur={() => { onChange({ ...value, isOpen: false }); setIsClick(false) }}
                                            open={value?.isOpen} placeholder={t("BOOKING.to")}
                                            disabledDate={(date) => (date && value?.from) && date < value?.from}
                                            className={classes.datePicker}
                                            format={Utils.typeFormatDate()}
                                            onChange={(date,) => onChange({ ...value, to: date, isOpen: false })} />
                                    </div>
                                )} />
                        </div>
                        <div className="col-span-12">
                            <label className={classes.labelInput}>{t("BOOKING.companyOrAgent")}:</label>
                            <Controller
                                name="companyAgent" control={control} render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classes.input} p-0 w-full h-full`}
                                        showSearch optionFilterProp="children"
                                        onSearch={(value: any) => {
                                            setValueSelect(value)
                                        }}
                                        filterOption={(input: any, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        filterSort={(optionA: any, optionB: any) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={loadingSearchProfile ? <LoadingOutlined style={{ color: '#1A87D7' }} /> : <CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        placeholder={t("BOOKING.chooseHere")} value={value} onChange={e => onChange(e)} >
                                        {
                                            companyAgent?.map((items: any, index: number) =>
                                                <Option key={index + 1} value={`${items?.guid}`} >{`${items?.ten} `}</Option>
                                            )
                                        }
                                        <Option key={0} value={'00000000-0000-0000-0000-000000000000'} >None</Option>
                                    </Select>
                                )} />
                        </div>
                        <div className="col-span-12">
                            <label className={classes.labelInput}>{t("BOOKING.departure")}:</label>
                            <Controller
                                name="dateDeparture"
                                control={control} render={({ onChange, value }) => (
                                    <div className="flex items-center">
                                        <DatePicker
                                            defaultValue={defaultValueForm?.dateDeparture && defaultValueForm.dateDeparture[0]}
                                            onClick={() => onChange({ ...value, isOpen: false })}
                                            placeholder={t("BOOKING.from")}
                                            className={classes.datePicker}
                                            format={Utils.typeFormatDate()}
                                            onChange={(date) => onChange({ to: '', from: date, isOpen: true })} />
                                        <div style={{ width: "12px", padding: "0 4px" }} className="font-bold flex justify-center">~</div>
                                        <DatePicker
                                            defaultValue={defaultValueForm?.dateDeparture && defaultValueForm.dateDeparture[1]}
                                            onClick={() => { onChange({ ...value, isOpen: true }); setIsClick(true) }}
                                            onBlur={() => { onChange({ ...value, isOpen: false }); setIsClick(false) }}
                                            open={value?.isOpen} placeholder={t("BOOKING.to")}
                                            disabledDate={(date) => (date && value?.from) && date < value?.from}
                                            className={classes.datePicker}
                                            format={Utils.typeFormatDate()}
                                            onChange={(date,) => onChange({ ...value, to: date, isOpen: false })} />
                                    </div>
                                )} />
                        </div>
                        <div className={`${classes.label} col-span-12 underline my-3 mb-14 cursor-pointer font-semibold`}>{t("BOOKING.moreSearchValue")}</div>
                    </div>
                    <div className={`${classes.footer} absolute bottom-0 left-0 bg-white w-full px-7`}>
                        <hr className={``} />
                        <div className={`${classes.btn}`}> <Button loading={isLoading} className={`w-full`} type="primary" htmlType="submit" >{t("BOOKING.submit")}</Button></div>
                    </div>
                </form>
            </CScrollView>
        </div>
    )
};

export default React.memo(CFormSearch);