import { Checkbox, Input, InputNumber } from 'antd';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';
import FolioService from "services/cashier/folio.service";
import { IFixCharge } from 'common/model-hcfg';
import { useSelectorRoot } from 'redux/store';
import { ServiceHotelMa } from "common/enum/cashier.enum";
import { IFormRoomCharge } from 'common/cashier/model-form';
import { POSTING_FOLIO_DEFAULT } from 'common/const/postingMiniBarDefault';
import { IParam, IPostingCommonFoodAndOther, PropsServiceCommon } from 'common/cashier/model-folio';
import Utils from 'common/utils';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

interface PropsRoomChange extends PropsServiceCommon {
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    isDayUse?: boolean,
    title: string,
    fetchGroup(tsRomGuid: string): void
}
const PostRoomChange = ({ setShowModal, isShowModal, title, fullName, roomNumber, guestGuid, groupGuidId, getDataFolio, getListGroupFolio, isDayUse, fetchGroup }: PropsRoomChange): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);
    const params: IParam = useParams();
    const { t } = useTranslation("translation");
    const { handleSubmit, control, setValue, getValues } = useForm();
    const [chargeObject, setChargeObject] = useState<IFixCharge | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    useEffect(() => {
        const fetchCharge = async () => {
            const getChargeByCode = await FolioService.filterDataFixChargeByMa(hotelId, isDayUse ? ServiceHotelMa.DayUse : ServiceHotelMa.PostRoomChange)
            setChargeObject(getChargeByCode)
        }
        fetchCharge();
        //eslint-disable-next-line
    }, [hotelId])

    const onSubmit = handleSubmit(async (data: IFormRoomCharge) => {

        const dataPosting = Object.assign({}, POSTING_FOLIO_DEFAULT);

        const formCommon: IPostingCommonFoodAndOther = {
            tsRoomId: params.tsRoomGuid,
            tinhChat: chargeObject?.tinhChat ?? "",
            thanhTien: 0
        }
        const basicInfo = {
            hotelGuid: hotelId,
            parentGuid: groupGuidId,
            ma: chargeObject?.ma ?? "",
            nguoiDung2: Utils.getValueLocalStorage("username"),
            language: ""
        }
        if (chargeObject && roomNumber) {
            await FolioService.postingRoomCharge(dataPosting, formCommon, chargeObject, guestGuid, basicInfo, data, roomNumber);
            getDataFolio(groupGuidId);
            getListGroupFolio(params.tsRoomGuid)
        }
        fetchGroup(params.tsRoomGuid)
        setShowModal(false)
    })

    const getTotalWithVAT = (value: number): number => {
        if (chargeObject) {
            const serviceCharge = value * chargeObject.tyLePhiDichVu / 100;
            const vatCharge = (value + serviceCharge) * chargeObject.tyLeThueVat / 100;
            return value + serviceCharge + vatCharge;
        }
        return -1;
    }
    const handleTotal = () => {
        let totalAmount = 0;
        if (getValues("autoService")) {
            const donGia = parseFloat(getValues("donGia"));
            const tyLePhiDichVu = chargeObject?.tyLePhiDichVu ?? 0;
            const tyLeThueVat = chargeObject?.tyLeThueVat ?? 0;
            const serviceCharge = (donGia * tyLePhiDichVu) / 100 + donGia;
            totalAmount = serviceCharge + serviceCharge * (tyLeThueVat / 100);
        }
        else {
            totalAmount = getValues("donGia");
        }
        setTotalAmount(totalAmount);
    }
    return (
        <CModel
            visible={isShowModal}
            title={title}
            onOk={() => onSubmit()}
            onCancel={() => setShowModal(false)}
            width={"40%"}
            content={
                <form onSubmit={onSubmit} id="form-minibar">
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
                                control={control} defaultValue={new Date()} />
                        </div>
                        <div className="xl:col-span-3 col-span-3">
                            <label className="m-0 font-base font-bold">{t("CASHIER.FOLIO.value")}:</label>
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
                                            getValues("autoService") && setValue("total", getTotalWithVAT(e))
                                            handleTotal()
                                        }}
                                    />
                                }
                                name="donGia" control={control} defaultValue={0} />
                        </div>
                        <div className="xl:col-span-3 col-span-3">
                            <label className="m-0 font-base font-bold" style={{ color: '#fff' }}>a</label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        className={`${classes.input}`}
                                        placeholder={"0"}
                                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(Number.parseInt(e.target.value))
                                        }} >
                                    </Input>}
                                name="tyGia" control={control} defaultValue={0} />
                        </div>
                        <div className="col-span-12">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.description")} :
                            </label>
                            <Controller render={({ onChange, value, ref }) =>
                                <TextArea className={`${classes.textArea} w-full col-span-12`}
                                    style={{ height: 100, backgroundColor: "#F5F6F7", borderRadius: 6 }}
                                    placeholder="Input comment here"
                                    onChange={(e) => onChange(e.target.value)}
                                />
                            }
                            name="dienGiai" defaultValue="" control={control}
                            />
                        </div>
                        <div className={`col-span-7 flex items-center`}>
                            <Controller render={(
                                { onChange, onBlur, value, name, ref }) => (
                                <Checkbox
                                    className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                    defaultChecked={false}
                                    onChange={(e) => {
                                        onChange(e.target.checked)
                                        e.target.checked && setValue("total", getTotalWithVAT(getValues('donGia')))
                                        handleTotal()
                                    }}>
                                    {t("CASHIER.FOLIO.autoPost")}
                                </Checkbox>
                            )}
                            name="autoService" defaultValue={false} control={control} />
                        </div>
                        <div className="col-span-5 flex justify-end">
                            <label className="m-0 font-base font-bold pr-4"> {t("CASHIER.FOLIO.total")}:</label>
                            {totalAmount ? Utils.formatNumber(totalAmount) : ""}
                        </div>
                    </div>
                </form>
            }
        />
    );
}
export default React.memo(PostRoomChange);