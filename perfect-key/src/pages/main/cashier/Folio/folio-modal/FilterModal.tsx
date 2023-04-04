import React from 'react'
import { Checkbox, Input } from 'antd';
import { PropsServiceCommon } from 'common/cashier/model-folio';
import { FormFilter } from 'common/cashier/model-form';
import CLoading from 'components/CLoading';
import CModel from 'components/CModal';
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { styleCorrection } from './styles/stylesCorrection';
import { ServiceHotelMa } from 'common/enum/cashier.enum';
import { FilterFolio } from 'common/cashier/model-cashier';
import { useTranslation } from 'react-i18next';
import CashierService from 'services/cashier/cashier.service';

interface PropsRebate extends PropsServiceCommon {
    fetchGroup(tsRomGuid: string): void,
    tsRoomGuid: string,
    filter: FilterFolio,
    getListGroupFolio(tsRoomGuid: string): void,
}

export const Filter = ({ isShowModal, setShowModal, fetchGroup, getListGroupFolio, filter, tsRoomGuid, groupGuidId }: PropsRebate): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const { t } = useTranslation("translation");
    const { handleSubmit, control } = useForm();

    const onSubmit = handleSubmit(async (dataForm: FormFilter) => {
        CashierService.FilterGroupFolio(dataForm, tsRoomGuid);
        fetchGroup(tsRoomGuid);
        getListGroupFolio(tsRoomGuid)
        setShowModal(false);
    })

    const services = [
        { label: t("CASHIER.FOLIO.roomCharge"), value: ServiceHotelMa.AdvanceRoomChange },
        { label: t("CASHIER.FOLIO.F&BCharge"), value: ServiceHotelMa.FoodAndBeverage },
        { label: t("CASHIER.FOLIO.minibarCharge"), value: ServiceHotelMa.MiniBar },
        { label: t("CASHIER.FOLIO.laundryCharge"), value: ServiceHotelMa.Laundry },
        { label: t("CASHIER.FOLIO.telephoneCharge"), value: ServiceHotelMa.TelephoneChange },
        { label: t("CASHIER.FOLIO.otherServiceCharge"), value: ServiceHotelMa.Other },
    ]
    return (
        <CModel
            visible={isShowModal}
            title={t("CASHIER.FOLIO.filterFolio")}
            onOk={onSubmit}
            onCancel={() => setShowModal(false)}
            width={"28%"}
            style={{ top: "3%" }}
            myForm={"form-filter"}
            content={
                <CLoading visible={false}>
                    <form onSubmit={onSubmit} id="form-filter">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="md:col-span-7 lg:col-span-6 flex flex-col ">
                                <label className="m-0 font-base font-bold text-transparent"> {t("BOOKING.RESERVATION.EDITRESERVATION.title")}</label>
                                <Controller
                                    name="services"
                                    render={({ onChange, value }) =>
                                        <Checkbox.Group value={value} onChange={(e) => onChange(e)} >
                                            {services.map((service, index) =>
                                                <Checkbox style={{ marginTop: "0.5rem", marginLeft: '0.5rem' }} value={service.value} key={service.value}
                                                >
                                                    {service.label}
                                                </Checkbox>
                                            )
                                            }
                                        </Checkbox.Group>
                                    }
                                    control={control} />
                            </div>
                            <div className="md:col-span-5 lg:col-span-6 flex flex-col justify-evenly">
                                <label className="m-0 font-base text-blue-600">{t("BOOKING.RESERVATION.EDITRESERVATION.folio")}</label>
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            maxLength={1}
                                            type="number"
                                            className={`${classes.input} mt-1`}
                                            style={{ background: "#F5F6F7", height: 25, width: "50%", marginTop: "0.35rem" }}
                                            value={value}
                                            onChange={(e) => {
                                                e.target.value.length <= e.target.maxLength ? onChange(e.target.value) : onChange(e.target.value.slice(0, 1))
                                            }}
                                            required={true}
                                        />
                                    }
                                    name={ServiceHotelMa.AdvanceRoomChange} control={control} />
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            maxLength={1}
                                            type="number"
                                            className={`${classes.input} `}
                                            style={{ background: "#F5F6F7", height: 25, width: "50%", marginTop: "0.25rem" }}
                                            value={value}
                                            onChange={(e) => {
                                                e.target.value.length <= e.target.maxLength ? onChange(e.target.value) : onChange(e.target.value.slice(0, 1))
                                            }}
                                            required={true}
                                        />
                                    }
                                    name={ServiceHotelMa.FoodAndBeverage} control={control} />
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            maxLength={1}
                                            type="number"
                                            className={`${classes.input}`}
                                            style={{ background: "#F5F6F7", height: 25, width: "50%", marginTop: "0.25rem" }}
                                            value={value}
                                            onChange={(e) => {
                                                e.target.value.length <= e.target.maxLength ? onChange(e.target.value) : onChange(e.target.value.slice(0, 1))
                                            }}
                                            required={true}
                                        />
                                    }
                                    name={ServiceHotelMa.MiniBar} control={control} />
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            maxLength={1}
                                            type="number"
                                            className={`${classes.input}`}
                                            style={{ background: "#F5F6F7", height: 25, width: "50%", marginTop: "0.25rem" }}
                                            value={value}
                                            onChange={(e) => {
                                                e.target.value.length <= e.target.maxLength ? onChange(e.target.value) : onChange(e.target.value.slice(0, 1))
                                            }}
                                            required={true}
                                        />
                                    }
                                    name={ServiceHotelMa.Laundry} control={control} />
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            maxLength={1}
                                            type="number"
                                            className={`${classes.input}`}
                                            style={{ background: "#F5F6F7", height: 25, width: "50%", marginTop: "0.25rem" }}
                                            value={value}
                                            onChange={(e) => {
                                                e.target.value.length <= e.target.maxLength ? onChange(e.target.value) : onChange(e.target.value.slice(0, 1))
                                            }}
                                            required={true}
                                        />
                                    }
                                    name={ServiceHotelMa.TelephoneChange} control={control} />
                                <Controller
                                    render={({ onChange, value, ref }) =>
                                        <Input
                                            maxLength={1}
                                            type="number"
                                            className={`${classes.input}`}
                                            style={{ background: "#F5F6F7", height: 25, width: "50%", marginTop: "0.25rem" }}
                                            value={value}
                                            onChange={(e) => {
                                                e.target.value.length <= e.target.maxLength ? onChange(e.target.value) : onChange(e.target.value.slice(0, 1))
                                            }}
                                            required={true}
                                        />
                                    }
                                    name={ServiceHotelMa.Other} control={control} />
                            </div>
                        </div>
                    </form>
                </CLoading>
            }
        />
    );
}
