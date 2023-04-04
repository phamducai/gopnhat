import { Input, InputNumber, Select } from 'antd';
import { PropsServiceCommon } from 'common/cashier/model-folio';
import { IFormRebate } from 'common/cashier/model-form';
import { POSTING_FOLIO_DEFAULT } from 'common/const/postingMiniBarDefault';
import { ServiceHotelMaTK2 } from 'common/enum/cashier.enum';
import { TypeActionCode } from 'common/enum/tracer.enum';
import { IFixCharge } from 'common/model-hcfg';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CLoading from 'components/CLoading';
import CModel from 'components/CModal';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { setTraceFolioRequest } from 'redux/controller/trace.slice';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';
const { TextArea } = Input;
const { Option } = Select
interface PropsRebate extends PropsServiceCommon {
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    tsRoomGuid: string,
    totalFolioDebit: number,
    fetchGroup(tsRomGuid: string): void,
    indexGroupFolio: number
}

export const Rebate = ({ isShowModal, setShowModal, totalFolioDebit, getDataFolio, getListGroupFolio, roomNumber, guestGuid, tsRoomGuid, groupGuidId, fetchGroup, indexGroupFolio }: PropsRebate): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { voucherNumberFolio } = useSelectorRoot(state => state.folio)
    const dispatch =  useDispatchRoot();

    const { handleSubmit, control, setValue } = useForm();
    const [chargeObject, setChargeObject] = useState<IFixCharge[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCharge = async () => {
            setIsLoading(true);
            const getChargeByCode = await FolioService.filterDataFixChargeByMaTK2(hotelId, ServiceHotelMaTK2.Rebate);
            setChargeObject(getChargeByCode)
            if (getChargeByCode.length > 0) {
                setValue("maTK", getChargeByCode[0].ma);
            }
            setIsLoading(false);
        }
        fetchCharge();
    }, [hotelId, setValue])
    const onSubmit = handleSubmit(async (dataForm: IFormRebate) => {
        const dataPosting = Object.assign({}, POSTING_FOLIO_DEFAULT);
        const getChargeByMa = chargeObject.find(x => x.ma === dataForm.maTK);
        if (getChargeByMa) {
            const dataComon = {
                tsRoomId: tsRoomGuid,
                tinhChat: getChargeByMa.tinhChat,
                thanhTien: dataForm.thanhTien
            }
            const basicInfo = {
                hotelGuid: hotelId,
                parentGuid: groupGuidId,
                ma: getChargeByMa.ma,
                nguoiDung2: Utils.getValueLocalStorage("username"),
                language: ""
            }
            await FolioService.postingRebate(dataPosting, dataComon, dataForm, guestGuid, getChargeByMa, basicInfo, roomNumber ?? "");
            traceFolio(dataComon.thanhTien);
            getDataFolio(groupGuidId);
            getListGroupFolio(tsRoomGuid);
            fetchGroup(tsRoomGuid);
        }
        setShowModal(false);

    })
    const traceFolio =(amountValue: number)=> {
        dispatch(setTraceFolioRequest({
            actionCode: TypeActionCode.FolioRebate,
            objectGuid: tsRoomGuid,
            oldString: `In Folio ${indexGroupFolio} - Debit :  ${Utils.formatNumber(totalFolioDebit)}`,
            newString: `In Folio ${indexGroupFolio} - Rebate: ${Utils.formatNumber(amountValue)}`,
            oldDate: new Date(),
            newDate: new Date(),
            hotelGuid: hotelId,
            parentGuid: groupGuidId
        }));
    }
    const renderSelectOption = (data: IFixCharge[]) => {
        return data.map(item => {
            return (
                <Option key={item.id} value={item.ma}>{item.ten}</Option>
            )
        })
    }
    return (
        <CModel
            visible={isShowModal}
            title={t("CASHIER.FOLIO.rebate")}
            onOk={() => { console.log("") }}
            onCancel={() => setShowModal(false)}
            width={"35%"}
            style={{ top: "3%" }}
            myForm={"form-rebate"}
            content={
                <CLoading visible={isLoading}>
                    <form onSubmit={onSubmit} id="form-rebate">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">{t("BOOKING.date")}:</label>
                                <Controller
                                    name="ngayThang"
                                    render={({ onChange, value }) =>
                                        <DatePicker
                                            onChange={(date) => {
                                                onChange(date)
                                            }}
                                            defaultValue={new Date(businessDate)}
                                            value={value}
                                            className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                            name="ngayThang"
                                            disabled
                                        />}
                                    control={control} defaultValue={new Date(businessDate)} />
                            </div>
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">{t("CASHIER.FOLIO.voucherNumber")}:</label>
                                <Controller
                                    render={({ onChange, value }) =>
                                        <Input
                                            className={`${classes.input}`}
                                            placeholder={""}
                                            type="number" style={{ background: "#F5F6F7", height: 40 }}
                                            value={voucherNumberFolio !== 0 ? voucherNumberFolio : value}
                                            onChange={(e) => {
                                                onChange(e.target.value)
                                            }}
                                            required={true}
                                        >
                                        </Input>}
                                    name="ma" control={control} defaultValue={voucherNumberFolio} />
                            </div>
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">{t("CASHIER.FOLIO.amount")}(%):</label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <InputNumber
                                            className={`${classes.inputNumber}`}
                                            min={0}
                                            style={{ background: "#F5F6F7", height: 40, width: "100%" }}
                                            value={value}
                                            onChange={(e) => {
                                                onChange(e)
                                                setValue("thanhTien", (totalFolioDebit * e) / 100)
                                            }} >
                                        </InputNumber>}
                                    name="tyLeGiamTru" control={control} defaultValue={0} />
                            </div>
                            <div className="col-span-6">
                                <label className="m-0 font-base font-bold">{t("CASHIER.FOLIO.amountValue")}:</label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <InputNumber
                                            className={`${classes.inputNumber} hiden-handler-wrap`}
                                            style={{ background: "#F5F6F7", height: 40, width: "100%" }}
                                            value={value}
                                            min={0}
                                            formatter={e => `${Utils.formatNumber(e)}`}
                                            onChange={(e) => {
                                                onChange(e)
                                                setValue("tyLeGiamTru", 0)
                                            }}
                                        />
                                    }
                                    name="thanhTien" control={control} defaultValue={0} />
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("CASHIER.FOLIO.accountCode")}:
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                            showSearch
                                            value={value}
                                            onChange={(e) => {
                                                onChange(e);
                                            }}
                                        >
                                            {chargeObject ? renderSelectOption(chargeObject) : ""}
                                        </Select>
                                    }
                                    name="maTK" control={control} defaultValue={""} />
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("CASHIER.FOLIO.description")}:
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            className={`${classes.input}`}
                                            type="text" style={{ background: "#F5F6F7", height: 40 }}
                                            value={value}
                                            onChange={(e) => {
                                                onChange(e.target.value)
                                            }} >
                                        </Input>}
                                    name="dienGiai" control={control} defaultValue={""} />
                            </div>
                            <div className="col-span-12">
                                <label className="m-0 font-base font-bold">
                                    {t("CASHIER.FOLIO.remark")}:
                                </label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <TextArea className={`${classes.textArea} w-full col-span-12`}
                                            style={{ height: 80, backgroundColor: "#F5F6F7", borderRadius: 6 }}
                                            placeholder="Input comment here"
                                            onChange={(e) => onChange(e.target.value)}
                                        />}
                                    name="ghiChu" control={control} defaultValue={""} />
                            </div>
                        </div>
                    </form>
                </CLoading>
            }
        />
    );
}
