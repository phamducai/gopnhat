import { Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { ICreateDTOFolio, IParam, IPostingCommonFoodAndOther } from 'common/cashier/model-folio';
import { IFixChargeDefault, POSTING_FOOD_OTHER_DEFAULT } from 'common/const/postingDefaultLaundry';
import { Languagues } from 'common/enum/language.enum';
import { IFixCharge, ITableLaundry } from 'common/model-hcfg';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { bussinessDateReq } from 'redux/controller/hotelconfig.slice';
import { useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';

interface PropsServiceModal {
    isServiceModal: boolean;
    setIsServiceModal: React.Dispatch<React.SetStateAction<boolean>>,
    serviceChargeName: string,
    childTable: number,
    chargeObjectSelect: IFixCharge[] | null,
    fullName: string,
    roomNumber: string,
    guestGuid: string,
    groupGuidId: string,
    dataOutLet: ITableLaundry[] | null,
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    fetchGroup(tsRomGuid: string): void
}
const { Option } = Select;
export const ServicesModal = ({
    setIsServiceModal, isServiceModal, serviceChargeName, childTable, chargeObjectSelect,
    fullName, roomNumber, guestGuid, groupGuidId, dataOutLet, getDataFolio, getListGroupFolio, fetchGroup }: PropsServiceModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { handleSubmit, control } = useForm();
    const { hotelId } = useSelectorRoot(state => state.app)
    const { businessDate } = useSelectorRoot(state => state.hotelConfig)
    const { voucherNumberFolio } = useSelectorRoot(state => state.folio)
    const dispatch = useDispatch()
    const params: IParam = useParams();

    useEffect(() => {
        dispatch(bussinessDateReq(hotelId))
    }, [hotelId, dispatch])

    const onCancel = () => {
        setIsServiceModal(false)
    }

    const onSubmit = async (dataForm: ICreateDTOFolio) => {
        const dataPosting = Object.assign({}, POSTING_FOOD_OTHER_DEFAULT)
        let getDataCharge: IFixCharge = Object.assign({}, IFixChargeDefault)
        chargeObjectSelect?.forEach((item) => {
            if (item.guid === dataForm.guest)
                getDataCharge = { ...item }
        })
        let serviceNameForLanguage = ""
        const getValue = localStorage.getItem("LANGUAGE")
        if (getValue === Languagues.VietNam) {
            getDataCharge.tenVn !== "" ?
                serviceNameForLanguage = getDataCharge.tenVn :
                serviceNameForLanguage = getDataCharge.ten
        } else
            serviceNameForLanguage = getDataCharge.ten

        const formCommon: IPostingCommonFoodAndOther = {
            tsRoomId: params.tsRoomGuid,
            tinhChat: getDataCharge?.tinhChat,
            thanhTien: dataForm.thanhTienVnd,
            businessDate: businessDate,
            departureDate: Utils.convertMiddleDate(new Date()),
        }
        const basicInfo = {
            hotelGuid: hotelId,
            parentGuid: groupGuidId,
            nguoiDung2: Utils.getValueLocalStorage("username"),
            language: serviceNameForLanguage
        }
        const res = await FolioService.getFoodAndOtherService(dataPosting, dataForm, formCommon, getDataCharge, guestGuid, basicInfo);
        if (res) {
            getDataFolio(groupGuidId);
            getListGroupFolio(params.tsRoomGuid)
            fetchGroup(params.tsRoomGuid)
        }
        setIsServiceModal(false)
    }

    return (
        <CModel
            visible={isServiceModal}
            title={serviceChargeName}
            onCancel={onCancel}
            myForm="form-service"
            width={"35%"}
            style={{ top: "3%" }}
            onOk={() => ""}
            content={
                <form onSubmit={handleSubmit(onSubmit)} id="form-service">
                    <div className="grid grid-cols-12 gap-4">
                        <div className="xl:col-span-6 col-span-12">
                            <label className="m-0 font-base font-bold">
                                {t("BOOKING.date")}:
                            </label>
                            <Controller
                                name="ngayThang"
                                render={({ onChange, value }) =>
                                    <DatePicker
                                        onChange={(date) => onChange(date)}
                                        defaultValue={new Date()}
                                        value={value}
                                        className={`${classes.datePicker} w-full`} style={{ background: "#F5F6F7" }}
                                        name="ngayThang"
                                        disabled
                                    />}
                                control={control} defaultValue={new Date()} />
                        </div>
                        <div className="xl:col-span-3 col-span-3">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.room")}:
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        className={`${classes.input}`}
                                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                                        value={value}
                                        disabled
                                        onChange={(e) => {
                                            onChange(Number.parseInt(e.target.value))

                                        }} >
                                    </Input>}
                                name="soPhong" control={control} defaultValue={roomNumber} />
                        </div>
                        <div className="xl:col-span-3 col-span-3">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.voucher")}:
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        className={`${classes.input}`}
                                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e.target.value)
                                        }}>
                                    </Input>}
                                name="ma" control={control} defaultValue={voucherNumberFolio} />
                        </div>
                        <div className="col-span-12">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.accountName")}:
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                        showSearch
                                        value={value}
                                        defaultValue={chargeObjectSelect ? chargeObjectSelect[0]?.guid : ''}
                                        onChange={(e) => { onChange(e) }}
                                    >
                                        {chargeObjectSelect ? chargeObjectSelect.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.guid}>{item.ten}</Option>
                                            )
                                        }) : ""
                                        }
                                    </Select>
                                }
                                name="guest" control={control} defaultValue={chargeObjectSelect ? chargeObjectSelect[0]?.guid : ''} />
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
                                        onChange={(e) => onChange(e.target.value)} >
                                    </Input>}
                                name="dienGiai" control={control} defaultValue={""} />
                        </div>
                        <div className="xl:col-span-6 col-span-12">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.amount")}:
                            </label>
                            <Controller
                                name="thanhTienVnd"
                                render={({ onChange, value }) =>
                                    <InputNumber
                                        min={0}
                                        className={`${classes.inputNumber} hiden-handler-wrap`}
                                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                        value={value}
                                        formatter={e => `${Utils.formatNumber(e)}`}
                                        onChange={(e) => {
                                            onChange(e)
                                        }}>
                                    </InputNumber>}
                                control={control} defaultValue={0} />
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
                                name="tyLeGiamTru" control={control} defaultValue={0} />
                        </div>
                        <div className="xl:col-span-3 col-span-3">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.outlet")}:
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                        showSearch
                                        value={value}
                                        defaultValue={dataOutLet ? dataOutLet[0]?.ma : ''}
                                        onChange={(e) => { onChange(e) }}
                                    >
                                        {dataOutLet ? dataOutLet.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.ma}>{item.ten}</Option>
                                            )
                                        }) : ""
                                        }
                                    </Select>
                                }
                                name="outletCode" control={control} defaultValue={dataOutLet ? dataOutLet[0]?.ma : ''} />
                        </div>
                        <div className="col-span-12">
                            <label className="m-0 font-base font-bold">
                                {t("CASHIER.FOLIO.suplement")}:
                            </label>
                            <Controller render={({ onChange, value, ref }) =>
                                <TextArea className={`${classes.textArea} w-full col-span-12`}
                                    style={{ height: 80, backgroundColor: "#F5F6F7", borderRadius: 6 }}
                                    placeholder="Input comment here"
                                    onChange={(e) => onChange(e.target.value)}
                                />
                            }
                            name="suplement" defaultValue="" control={control}
                            />
                        </div>
                    </div>
                </form>
            }
        />
    );
}
