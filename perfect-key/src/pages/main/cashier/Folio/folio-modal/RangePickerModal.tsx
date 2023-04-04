/* eslint-disable no-self-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsServiceCommon } from 'common/cashier/model-folio';
import Utils from 'common/utils';
import CModel from 'components/CModal';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import PrintService from 'services/cashier/print.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';
import { ITableFolio } from 'common/cashier/model-cashier';
import { Input, Radio, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import CIconSvg from 'components/CIconSvg';
import { companyProfilesFilterByInputRequest } from 'redux/controller/reservation.slice';

interface PropsAdvanceRoomChange extends PropsServiceCommon {
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    tsRoomGuid: string,
    selectedRowsFolio: ITableFolio[],
    printDraft: boolean
}
export const RangePickerModal = ({ setShowModal, isShowModal, printDraft, tsRoomGuid, groupGuidId, selectedRowsFolio }: PropsAdvanceRoomChange): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const dispatch = useDispatchRoot();
    const { t } = useTranslation("translation");

    const { hotelId } = useSelectorRoot(state => state.app);
    const { filteredCompanyProfile, data } = useSelectorRoot(state => state.rsvn);

    const [loading, setLoading] = useState(false);
    const [disabledTextArea, setDisabledTextArea] = useState(false);
    const { control, setValue, getValues } = useForm();
    const typingTimeoutRef = React.useRef(0);

    const printSources = [
        { label: t("PRINT.FORM.deposit"), value: "deposit" },
        { label: t("PRINT.FORM.guestFolio"), value: "guestFolio" },
        { label: t("PRINT.FORM.vatInvoice"), value: "vatInvoice" },
        { label: t("PRINT.FORM.vatWithoutSC"), value: "vatWithoutSC" },
        { label: t("PRINT.FORM.proforma"), value: "proforma" },
        { label: t("PRINT.FORM.others"), value: "others" },
    ]
    const onCancel = () => {
        setShowModal(false)
    }

    const fetchData = async () => {
        setLoading(true);
        const vndCurrencyCode = 2;
        const usCurrencyCode = 1;
        const dataPrint = await FolioService.fetchDataForPrintOpt(tsRoomGuid, hotelId, vndCurrencyCode, usCurrencyCode);
        if (dataPrint) {
            setValue("arrivalDate", Utils.formatDateString(dataPrint.transactRoom?.arrivalDate ?? ""));
            setValue("departureDate", Utils.formatDateString(dataPrint.transactRoom?.departureDate ?? ""));
            setValue("type", "Details");
            setValue("rateCheck", true);
            setValue("exchangeRate", dataPrint.exchangeRate)
            setValue("invoiceDate", Utils.formatDate(new Date))
            if (dataPrint.guest) {
                setValue("guestName", `${dataPrint.guest?.guestName ?? ""} ${dataPrint.guest?.firstName}`);
                setValue("company", dataPrint.company?.guid ?? "");
                setValue("taxCode", dataPrint.guest?.taxCode ?? "");
                setValue("payment", data.paymentMethods.find((x: any) => x.ten === "Cash").guid);
            }
            if (dataPrint.charges) {
                setValue("vat", dataPrint.charges.find(x => x.ma === "VATFCT")?.giaTri)
                setValue("serviceCharge", dataPrint.charges.find(x => x.ma === "SRVFCT")?.giaTri)
            }
        }
        setLoading(false);
    }

    const handlePrintFolio = async () => {
        setLoading(true)

        const fileURL = await PrintService.printFolioInvoice({
            hotelGuid: hotelId,
            transactRoomGuid: tsRoomGuid,
            listFolios: selectedRowsFolio,
            userName: "",
            groupFolioID: groupGuidId,
            guestName: getValues("guestName"),
            arrival: getValues("arrivalDate"),
            departure: getValues("departureDate"),
            payment: getValues("payment"),
            exchangeRate: getValues("exchangeRate"),
            serviceChargePercent: getValues("serviceCharge"),
            vatChargePercent: getValues("vat"),
            companyGuid: getValues("company"),
            printRate: getValues("rateCheck"),
            printType: getValues("type"),
            printForm: getValues("form"),
            isDraft: printDraft
        })
        if (fileURL)
            window.open(fileURL)
        setShowModal(false);
        setLoading(false);
    }
    const renderSelect = (list: any, isGuidValue = true) => {
        return list?.map((item: any) => {
            return (
                <Select.Option value={isGuidValue ? item.guid : item.ten ? item.ten : ""} key={item.guid}>{item.ten}</Select.Option>
            )
        })
    }

    const onSearch = (val: string) => {
        // eslint-disable-next-line no-self-assign
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

    useEffect(() => {
        isShowModal && fetchData();
        //eslint-disable-next-line
    }, [isShowModal, filteredCompanyProfile])

    return (
        <CModel
            style={{ top: "3%", paddingTop: "0px", paddingBottom: "0px" }}
            isLoading={loading}
            visible={isShowModal}
            title={t("PRINT.OPTIONS")}
            onOk={handlePrintFolio}
            onCancel={onCancel}
            width={"65%"}
            content={
                <form className='custom-scrollbar-pkm pr-2' style={{ height: "calc(100vh - 200px)" }}>
                    <div className="grid grid-cols-3 gap-x-4">
                        <div className="col-span-2 border-r-4 pr-6 border-dashed border-gray-200">
                            <div className='grid grid-cols-4 gap-x-3'>
                                <div className='col-span-3'>
                                    <div className='text-lg font-bold mb-2'>Search Company</div>
                                    <div className='mb-2'>
                                        <label className="font-base font-bold text-xs"> {t("PRINT.FORM.name_tax")}:</label>
                                        <Controller
                                            name="name/tax"
                                            render={({ onChange, value }) =>
                                                <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                            }
                                            control={control} defaultValue={""} />
                                    </div>
                                    <div className='mb-2'>
                                        <label className="font-base font-bold text-xs"> {t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.company")}:</label>
                                        <Controller
                                            name='company' control={control}
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
                                                    {renderSelect(filteredCompanyProfile.filter(x => x.kind === 0))}
                                                </Select>
                                            )} />
                                    </div>
                                    <div className='mt-4'>
                                        <div className="text-lg my-4 font-bold"> {t("PRINT.FORM.type")}</div>
                                        <Controller
                                            name="type"
                                            render={({ onChange, value }) =>
                                                <Radio.Group className='font-bold' onChange={e => onChange(e.target.value)} value={value}>
                                                    <Radio value={"Details"}>Details</Radio>
                                                    <Radio value={"Summary"}>Summary</Radio>
                                                </Radio.Group>
                                            }
                                            control={control} defaultValue={"Details"} />
                                    </div>
                                </div>
                                <div className='col-span-1'>
                                    <div className='text-lg font-bold mb-2'>Rate (%)</div>
                                    <div className='mb-2'>
                                        <label className=" font-base font-bold text-xs"> S.C:</label>
                                        <Controller
                                            name="serviceCharge"
                                            render={({ onChange, value }) =>
                                                <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                            }
                                            control={control} defaultValue={""} />
                                    </div>
                                    <div className="mb-2">
                                        <label className=" font-base font-bold text-xs">VAT:</label>
                                        <Controller
                                            name="vat"
                                            render={({ onChange, value }) =>
                                                <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                            }
                                            control={control} defaultValue={""} />
                                    </div>
                                </div>
                                <div className='col-span-4 mt-2'>
                                    <div className="text-lg mt-4 mb-2 font-bold "> {t("PRINT.FORM.form")}</div>
                                    <Controller
                                        name="form"
                                        render={({ onChange, value }) =>
                                            <Radio.Group
                                                className='font-bold w-full' onChange={e => onChange(e.target.value)} value={value} >
                                                {printSources.map(({ label, value }) =>
                                                    <Radio style={{ margin: "0.25rem", marginLeft: "0px" }} key={value} value={value}>{label}</Radio>
                                                )}
                                            </Radio.Group>
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-4 mt-2'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.otherReason")}</label>
                                    <Controller
                                        name="reason"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-4 mt-3'>
                                    <Controller
                                        name='scCheck'
                                        render={({ onChange, value }) =>
                                            <Checkbox onChange={(e) => { onChange(e.target.checked); e.target.checked ? setDisabledTextArea(false) : setDisabledTextArea(true) }} checked={value}> <label className="font-base font-bold text-xs">{t("PRINT.FORM.summarySC")}</label>
                                            </Checkbox>
                                        } control={control} defaultValue={true} />

                                    <Controller
                                        name="summarySC"
                                        render={({ onChange, value }) =>
                                            <Input.TextArea disabled={disabledTextArea} rows={3} value={value} className={`${classes.input}`} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className='grid grid-cols-2 gap-y-1 gap-x-3'>
                                <div className='col-span-2'>
                                    <label className="font-base font-bold text-xs">{t("CASHIER.FOLIO.guestName")}</label>
                                    <Controller
                                        name="guestName"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                    <Controller
                                        name="applyCompanyCheck"
                                        render={({ onChange, value }) =>
                                            <Checkbox style={{ fontSize: '12px' }} className='font-bold small-checkbox' checked={value} onChange={e => onChange(e.target.checked)}>Apply Company for this guest</Checkbox>

                                        }
                                        control={control} defaultValue={false} />
                                </div>
                                <div className='col-span-2'>
                                    <label className="font-base font-bold text-xs">{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.company")}</label>
                                    <Controller
                                        name="companyName"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-2'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.taxCode")}</label>
                                    <Controller
                                        name="taxCode"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.taxCode")}</label>
                                    <Controller
                                        name="taxCode"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("CASHIER.payment")}</label>
                                    <Controller
                                        name="payment"
                                        render={({ onChange, value }) =>
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
                                                {renderSelect(data?.paymentMethods)}
                                            </Select>
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.invoiceNo")}</label>
                                    <Controller
                                        name="invoiceNo"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.seri")}</label>
                                    <Controller
                                        name="seri"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.arrivalDate")}</label>
                                    <Controller
                                        name="arrivalDate"
                                        render={({ onChange, value }) =>
                                            <Input readOnly className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.departureDate")}</label>
                                    <Controller
                                        name="departureDate"
                                        render={({ onChange, value }) =>
                                            <Input readOnly className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.exchangeRate")}</label>
                                    <Controller
                                        name="exchangeRate"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={0} />
                                </div>
                                <div className='col-span-1'>
                                    <label className="font-base font-bold text-xs">{t("PRINT.FORM.invoiceDate")}</label>
                                    <Controller
                                        name="invoiceDate"
                                        render={({ onChange, value }) =>
                                            <Input className={`${classes.input} h-10`} value={value} onChange={(e) => onChange(e.target.value)} />
                                        }
                                        control={control} defaultValue={""} />
                                </div>
                                <div className='col-span-2'>
                                    <Controller
                                        name="paymentMethod"
                                        render={({ onChange, value }) =>
                                            <Radio.Group
                                                className='font-bold w-full' onChange={e => onChange(e.target.value)} value={value} >
                                                <Radio value={"Cash"}>Cash</Radio>
                                                <Radio value={"Dash"}>Dash</Radio>
                                                <Radio value={"CL"}>C/L</Radio>
                                            </Radio.Group>
                                        }
                                        control={control} defaultValue={"Cash"} />
                                </div>
                                <div className='col-span-2'>
                                    <Controller
                                        name="rateCheck"
                                        render={({ onChange, value }) =>
                                            <Checkbox className='font-bold' checked={value} onChange={e => onChange(e.target.checked)}>Print Rate</Checkbox>
                                        }
                                        control={control} defaultValue={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            }
        />
    );
}
