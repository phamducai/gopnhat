import { Input, InputNumber, Select } from 'antd';
import GLobalPkm from 'common/global';
import { ExchangeRate } from 'common/model-hcfg';
import Utils from 'common/utils';
import DatePicker from 'components/CDatePicker';
import CModel from 'components/CModal';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, {  useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import HotelConfigService from 'services/hcfg/hcfg.service';
import { useStyleTheme } from 'theme';

interface PropsServiceModal {
    isShowModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}
const { Option } = Select;
const ExchangeRateModal = ({isShowModal, setShowModal} : PropsServiceModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { handleSubmit, control, setValue, getValues, formState: { errors } } = useForm();

    const {hotelId} = useSelectorRoot(state => state.app)
    const {businessDate, listDonViTienTe} = useSelectorRoot(state => state.hotelConfig);

    const [isLoading, setIsLoading] = useState<boolean>(false);


    const onSubmit = async (dataForm: ExchangeRate) => {
        setIsLoading(true);
        dataForm.hotelGuid = hotelId;
        dataForm.id = 0;
        dataForm.guid = GLobalPkm.defaultBytes32;
        console.log(dataForm);
        await HotelConfigService.postExchageRateByHotel(dataForm);
        setShowModal(false);
        setIsLoading(false);
    }
    return (
        <CModel
            visible={isShowModal}
            title={"Set Exchange Rate"}
            onCancel={() => setShowModal(false)}
            myForm="form-service"
            width={"40%"}
            style={{ top: "5%" }}
            onOk={() => ""}
            isLoading={isLoading}
            content={
                <form onSubmit={handleSubmit(onSubmit)} id="form-service">
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6">
                            <label className="col-span-2 m-0 font-base font-bold">
                                Date
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <DatePicker
                                        disabledDate={(date: Date) => date <= new Date()}
                                        onChange={(date) => {
                                            onChange(date)
                                        }}
                                        value={value}
                                        className={`${classes.datePicker} w-full ${errors.expireDate && "errors-input"}`} 
                                        style={{ background: "#F5F6F7", height : 40 }}
                                    />}
                                name="ngayThang" control={control} defaultValue={businessDate} />
                        </div>
                        <div className="col-span-6">
                            <label className="col-span-2 m-0 font-base font-bold">
                                Origin
                            </label>
                            <Controller
                                rules={{ required : true}}
                                render={({ onChange, value, ref }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md ${errors.maTK && "errors-select"}`} 
                                        placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                        showSearch
                                        value={value}
                                        defaultValue={2}
                                        onChange={(e) => {
                                            onChange(e)
                                        }}
                                    >
                                        {listDonViTienTe ? listDonViTienTe.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>{item.ten}</Option>
                                            )
                                        }) : ""
                                        }
                                    </Select>
                                }
                                name="currency1" control={control} defaultValue={2} />
                            {errors.maTK && <span style={{color: "red"}}>Choose payment method </span>}
                        </div>
                        
                        <div className="col-span-6">
                            <label className="col-span-2 m-0 font-base font-bold">
                                To
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                        showSearch
                                        value={value}
                                        defaultValue={1}
                                        onChange={(e) => { onChange(e) }}
                                    >
                                        {listDonViTienTe ? listDonViTienTe.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.id}>{item.ten}</Option>
                                            )
                                        }) : ""
                                        }
                                    </Select>
                                }
                                name="currency2" control={control} defaultValue={1} />
                        </div>
                        <div className="col-span-6">
                            <label className="m-0 font-base font-bold">
                                Exchange
                            </label>
                            <Controller
                                render={({ onChange, value }) =>
                                    <InputNumber
                                        min={0}
                                        className={`${classes.inputNumber} hiden-handler-wrap`}
                                        style={{ background: "#F5F6F7", height: 40, width: '100%' }}
                                        value={value}
                                        formatter={e => `${Utils.formatNumber(e)}`}
                                        onChange={(e) => {
                                            onChange(e)
                                            setValue("valueAfterEx", parseFloat((parseFloat(e) / parseFloat(getValues("exchangeRate"))).toFixed(4)))
                                        }}>
                                    </InputNumber>}
                                control={control}  name="giaTri" defaultValue={0}/>
                        </div>
                        <div className="col-span-12">
                            <label className="m-0 font-base font-bold">
                                From
                            </label>
                            <Controller
                                render={({ onChange, value, ref }) =>
                                    <Input
                                        className={`${classes.input} ${errors.cvv && "errors-input"}`}
                                        type="text" style={{ background: "#F5F6F7", height: 40 }}
                                        value={value} 
                                        onChange={(e) => onChange(e.target.value)} >
                                    </Input>
                                }
                                name="nguonGoc" control={control} defaultValue={""} />
                        </div>
                    </div>
                </form>
            }
        />
    );
}
export default ExchangeRateModal;