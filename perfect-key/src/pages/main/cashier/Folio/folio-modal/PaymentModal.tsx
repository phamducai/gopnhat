import { Input, InputNumber, Select } from 'antd';
import { ICreateDTOFolio, IParam, IPostCommon } from 'common/cashier/model-folio';
import { FormPayment } from 'common/cashier/model-form';
import { POSTING_FOLIO_DEFAULT } from 'common/const/postingMiniBarDefault';
import { PaymentMethod, ServiceHotelMaTK } from 'common/enum/cashier.enum';
import { TypeActionCode } from 'common/enum/tracer.enum';
import { IFixCharge, ITableLaundry } from 'common/model-hcfg';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { orderBy } from 'lodash';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { setTraceFolioRequest } from 'redux/controller/trace.slice';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import FolioService from 'services/cashier/folio.service';
import FolioHelper from 'services/cashier/helper/folio.helper';
import HotelConfigService from 'services/hcfg/hcfg.service';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';

interface PropsServiceModal {
    isServiceModal: boolean;
    setIsServiceModal: React.Dispatch<React.SetStateAction<boolean>>,
    fullName: string,
    roomNumber: string,
    guestGuid: string,
    groupGuidId: string,
    dataOutLet: ITableLaundry[] | null,
    getDataFolio(groupGuidId: string): void,
    getListGroupFolio(tsRoomGuid: string): void,
    balance: number,
    fetchGroup(tsRomGuid: string): void,
    indexGroupFolio: number
}
const { Option } = Select;
const PaymentModal = ({setIsServiceModal, isServiceModal,
    guestGuid, groupGuidId, dataOutLet,  getDataFolio, getListGroupFolio, balance, roomNumber, indexGroupFolio} : PropsServiceModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const dispatch = useDispatchRoot();
    const { t } = useTranslation("translation");
    const { handleSubmit, control, setValue, getValues, setError, formState: { errors } } = useForm();
    const {hotelId} = useSelectorRoot(state => state.app)
    const {businessDate} = useSelectorRoot(state => state.hotelConfig)
    const params: IParam = useParams();
    const language = localStorage.getItem("LANGUAGE");

    const [isPaymentCard, setIsPaymentCard] = useState<boolean>(true);

    const [chargeObject, setChargeObject] = useState<IFixCharge[]>([]);
    const [isLoading, setIsloading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCharge = async () => {
            const getChargeByCode = await FolioService.filterDataFixChargeByMaTK(hotelId, ServiceHotelMaTK.PaymentMethod);
            if(getChargeByCode){
                setChargeObject(orderBy(getChargeByCode, ['parent']));
            }
            setValue("exchangeRate", await HotelConfigService.getExchageRateByHotel(2, 1, hotelId));
        }
        fetchCharge();
    }, [hotelId, setValue])

    const onCancel = () => {
        setIsServiceModal(false)
    }
    
    const onSubmit = async (dataForm: FormPayment) => {
        setIsloading(true);
        const getCharge = chargeObject.find(x => x.ma === dataForm.maTK);
        const dataCommon: IPostCommon = {   
            tsRoomId: params.tsRoomGuid,
            tinhChat: getCharge?.tinhChat ?? "D",
            thanhTien: dataForm.valuePay
        }
        const method = chargeObject.find(x => x.ma === dataForm.maTK);
        const dataCreateFolio: ICreateDTOFolio = POSTING_FOLIO_DEFAULT;
        dataCreateFolio.parentGuid = groupGuidId;
        dataCreateFolio.ngayThang = Utils.formatDateCallApi(businessDate);
        dataCreateFolio.ma = dataForm.maTK;
        dataCreateFolio.dienGiai = `${language === "vi" ? method?.tenVn ?? "" : method?.ten ?? ""} - ***`;

        dataCreateFolio.guest = guestGuid;
        dataCreateFolio.soPhong = roomNumber;
        dataCreateFolio.maTk = dataForm.maTK;
        dataCreateFolio.nguoiDung2 = Utils.getValueLocalStorage("username");
        dataCreateFolio.thanhTien1Vnd = dataForm.valueAfterEx;
        
        dataCreateFolio.tyGia = dataForm.exchangeRate;
        dataCreateFolio.suplement = dataForm.creaditCardNo.toString();
        dataCreateFolio.outletCode = dataForm.outletCode;
        dataCreateFolio.hotelGuid = hotelId;
        dataCreateFolio.nguoiDung =  Utils.getValueLocalStorage("idProfile");

        let flag = true;
        if(isPaymentCard){
            const isValidCard = await FolioHelper.checkInValidCard(dataForm.creaditCardNo);
            if(isValidCard){
                flag = true;
            }else{
                setError("creaditCardNo", { type: "", message : "Invalid visa card !" })
                flag = false;
            }
        }
        if(flag === true){
            const isPayment = await FolioService.postPaymentService(dataCommon, dataCreateFolio);
            if(isPayment){
                traceFolio(balance, dataForm.valuePay)
            }
            getDataFolio(groupGuidId);
            getListGroupFolio(params.tsRoomGuid)
            setIsServiceModal(false)
        }
        setIsloading(false);
    }
    const traceFolio =(fromBalance: number, toBalance: number)=> {
        dispatch(setTraceFolioRequest({
            actionCode: TypeActionCode.FolioPayment,
            objectGuid: params.tsRoomGuid,
            oldString: `In Folio : ${indexGroupFolio} - From Balance:  ${Utils.formatNumber(fromBalance)}}`,
            newString: `In Folio : ${indexGroupFolio} - To Blance: ${Utils.formatNumber(fromBalance - toBalance)}}`,
            oldDate: new Date(),
            newDate: new Date(),
            hotelGuid: hotelId,
            parentGuid: groupGuidId
        }));
    }
    const isDisableInput = (maTK: string) => {
        if(maTK === PaymentMethod.VISA || maTK === PaymentMethod.JCBCARD || maTK === PaymentMethod.MASTERCARD ||
            maTK === PaymentMethod.DINNNERCARD || maTK === PaymentMethod.AMEXCARD || maTK === PaymentMethod.OTHERSCARD)
        {
            setIsPaymentCard(true);
        }
        else {
            setIsPaymentCard(false);
        }
        if(maTK === PaymentMethod.CASHUSD){
            setValue("valueAfterEx", parseFloat((parseFloat(getValues("valuePay")) / parseFloat(getValues("exchangeRate"))).toFixed(4)));
        }
    }
    const renderMethod = ( ten: string, tenVn: string) =>{
        if(language === "vi"){
            if(tenVn){
                return tenVn;
            }
            return ten;
        }
        return ten;
    }
    return (
        <CModel
            visible={isServiceModal}
            title={"New Payment"}
            onCancel={onCancel}
            myForm="form-service"
            width={"40%"}
            style={{ top: "5%" }}
            onOk={() => ""}
            isLoading={isLoading}
            content={
                <form onSubmit={handleSubmit(onSubmit)} id="form-service">
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-12">
                            <label className="col-span-2 m-0 font-base font-bold">
                                Method:
                            </label>
                            <Controller
                                rules={{ required : true}}
                                render={({ onChange, value, ref }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md ${errors.maTK && "errors-select"}`} 
                                        placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                        showSearch
                                        value={value}
                                        defaultValue={chargeObject ? chargeObject[0]?.guid : ''}
                                        onChange={(e) => {
                                            onChange(e)
                                            isDisableInput(e)
                                        }}
                                    >
                                        {chargeObject ? chargeObject.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.ma}>{renderMethod(item.ten, item.tenVn)}</Option>
                                            )
                                        }) : ""
                                        }
                                    </Select>
                                }
                                name="maTK" control={control} defaultValue={""} />
                            {errors.maTK && <span style={{color: "red"}}>Choose payment method </span>}
                        </div>
                        <div className="col-span-6">
                            <label className="col-span-2 m-0 font-base font-bold opacity-0">
                                f
                            </label>
                            <Controller
                                render={({ onChange}) =>
                                    <Input
                                        disabled
                                        min={0}
                                        className={`${classes.input}`}
                                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                        defaultValue={`${Utils.formatNumber(balance)}`}
                                        onChange={(e) => {
                                            onChange(e)
                                        }}>
                                    </Input>}
                                name="temp" control={control} defaultValue={0} />
                        </div>
                        <div className="col-span-3">
                            <label className="col-span-2 m-0 font-base font-bold">
                                Expire Date
                            </label>
                            <Controller
                                rules={{ required : isPaymentCard }}
                                render={({ onChange, value, ref }) =>
                                    <DatePicker
                                        disabled={!isPaymentCard}
                                        placeholder='MM / YY'
                                        picker="month"
                                        disabledDate={(date: Date) => date <= new Date()}
                                        onChange={(date) => {
                                            onChange(date)
                                        }}
                                        value={value}
                                        className={`${classes.datePicker} w-full ${errors.expireDate && "errors-input"}`} 
                                        style={{ background: "#F5F6F7", height : 40 }}
                                    />}
                                name="expireDate" control={control} defaultValue={""} />
                        </div>
                        <div className="col-span-3">
                            <label className="col-span-2 m-0 font-base font-bold">
                                CVV
                            </label>
                            <Controller
                                rules={{ required : isPaymentCard }}
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        disabled={!isPaymentCard}
                                        placeholder='CCV'
                                        className={`${classes.input} ${errors.cvv && "errors-input"}`}
                                        type="number" style={{ background: "#F5F6F7", height: 40 }}
                                        value={value} 
                                        onChange={(e) => onChange(e.target.value)} >
                                    </Input>}
                                name="cvv" control={control} defaultValue={""} />
                        </div>
                        <div className="col-span-6">
                            <label className="m-0 font-base font-bold">
                                Value Pay:
                            </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <InputNumber
                                        min={0}
                                        className={`${classes.inputNumber} hiden-handler-wrap`}
                                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                        value={value}
                                        defaultValue={balance}
                                        formatter={e => `${Utils.formatNumber(e)}`}
                                        onChange={(e) => {
                                            onChange(e)
                                            setValue("valueAfterEx", parseFloat((parseFloat(e) / parseFloat(getValues("exchangeRate"))).toFixed(4)))
                                        }}>
                                    </InputNumber>}
                                control={control} defaultValue={balance} name="valuePay"/>
                        </div>
                        <div className="col-span-6">
                            <label className="col-span-2 m-0 font-base font-bold">
                                Credit Card No
                            </label>
                            <Controller
                                rules={{ required : isPaymentCard }}
                                render={({ onChange, value, ref }) =>
                                    <React.Fragment>
                                        <Input
                                            disabled={!isPaymentCard}
                                            placeholder='0000 0000 0000 0000'
                                            className={`${classes.input} ${errors.creaditCardNo && "errors-input"}`}
                                            type="text" style={{ background: "#F5F6F7", height: 40 }}
                                            value={Utils.formatCreditCard(value)}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => onChange(e.target.value)} >
                                        </Input>
                                        <label className="font-base font-bold" style={{ color: "rgb(255, 47, 47)" }}>
                                            {errors.creaditCardNo && errors.creaditCardNo.message}
                                        </label>
                                    </React.Fragment>
                                }
                                name="creaditCardNo" control={control} defaultValue={""} />
                        </div>
                        <div className="col-span-6">
                            <label className="col-span-2 m-0 font-base font-bold">
                                Value after EX
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <InputNumber
                                        min={0}
                                        className={`${classes.inputNumber} hiden-handler-wrap`}
                                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                        value={value} 
                                        defaultValue={balance}
                                        formatter={e => `${Utils.formatNumber(e)}`}
                                        onChange={(e) => { 
                                            onChange(e) 
                                        }}>
                                    </InputNumber>
                                }
                                name="valueAfterEx" control={control} defaultValue={0} />
                        </div>
                        <div className="col-span-6">
                            <label className="col-span-2 m-0 font-base font-bold">
                                Exchange Rate
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        disabled
                                        className={`${classes.inputNumber} hiden-handler-wrap`}
                                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                        value={Utils.formatNumber(value)}
                                        onChange={(e) => {
                                            onChange(e)
                                        }}>
                                    </Input>}
                                name="exchangeRate" control={control} defaultValue={""} />
                        </div>
                        <div className="col-span-12">
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
                    </div>
                </form>
            }
        />
    );
}
export default PaymentModal;