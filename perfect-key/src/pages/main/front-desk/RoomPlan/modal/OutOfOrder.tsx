/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Input, Modal, Select } from 'antd';
import clsx from 'clsx';
import { IHSKBlockRoom, IListStatusRoomHskp } from 'common/model-hskp';
import { ListCardRoomPlan } from 'common/model-inventory';
import DatePicker from 'components/CDatePicker';
import CIconSvg from 'components/CIconSvg';
import { styleReservation } from 'components/CModal';
import { styleCorrection } from 'pages/main/cashier/Folio/folio-modal/styles/stylesCorrection';
import React, {  useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelectorRoot } from 'redux/store';
import HskpService from 'services/hskp/hskp.service';
import { useStyleTheme } from 'theme';

const { TextArea } = Input;

interface PropsServiceModal {
    isShowModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    dataRoom: ListCardRoomPlan | undefined,
    searchAndMapData: any
}
const { Option } = Select;
const OutOfOrderModel = ({isShowModal, setShowModal, dataRoom, searchAndMapData} : PropsServiceModal): JSX.Element => {
    const classes = useStyleTheme(styleCorrection);
    const classesModal = useStyleTheme(styleReservation);

    const { t } = useTranslation("translation");
    const { handleSubmit, control, formState: { errors }, setValue } = useForm();

    const { hotelId } = useSelectorRoot(state => state.app)
    const {businessDate} = useSelectorRoot(state => state.hotelConfig);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listStatusRoom, setListStatusRoom] = useState<IListStatusRoomHskp[]>([])
    const [isShowBtn, setShowBtn] = useState<boolean>(true);
    const [idBlockRoom, setIdBlockRoom] = useState<string>("");


    useEffect(() => {
        const fetchData = async () => {
            const resp = await HskpService.getListStatusRoom();
            setListStatusRoom(resp)
            const getDataBlockRoom = await HskpService.getBlockRoomHskpById(businessDate, dataRoom?.roomGuid ?? "", hotelId);
            if(getDataBlockRoom){
                const mapData: any = Object.assign({}, getDataBlockRoom);// copy new JSON
                Object.keys(mapData).forEach(function (key) { // set value input
                    if(key.toString() === "dateFrom" || key.toString() === "dateTo"){
                        setValue(key, new Date(mapData[key]));
                    }
                    else if (mapData[key] !== null && key.toString() !== "ngayThang" &&  key.toString() !== "roomGuid") {
                        setValue(key, mapData[key]);
                    }
                });
                setShowBtn(false)
                setIdBlockRoom(getDataBlockRoom.guid)
            }
        }
        fetchData();
    },[businessDate, dataRoom?.roomGuid, hotelId,setValue])
    const onSubmit = async (dataForm: IHSKBlockRoom) => {
        setIsLoading(true);
        dataForm.hotelGuid = hotelId;
        dataForm.roomGuid = dataRoom?.roomGuid ?? "";
        dataForm.onlyReservation = dataForm.onlyReservation ? 1 : 0;
        await HskpService.postBlockRoomHskp(dataForm);
        setIsLoading(false);
        setShowModal(false);
        searchAndMapData()
    }
    const onSubmitUnBlockRoom = handleSubmit( async (dataForm: IHSKBlockRoom) => {
        dataForm.hotelGuid = hotelId;
        dataForm.roomGuid = dataRoom?.roomGuid ?? "";
        dataForm.onlyReservation = dataForm.onlyReservation ? 1 : 0;
        dataForm.tinhTrang = 1;
        await HskpService.unBlockRooms(dataForm, idBlockRoom);
        setIsLoading(false);
        setShowModal(false);
        searchAndMapData()
    })
    return (
        <Modal
            title={<span className={`${classes.titleStyle}`}>Block Room</span>}
            visible={isShowModal}
            destroyOnClose={true}
            className={clsx(classesModal.antModalStyle)}
            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => setShowModal(false)} />}
            footer={
                <div className="flex justify-between m-auto w-full">
                    <div className="footer-left">
                        <Button
                            type="primary"
                            className={`!rounded-md ${classes.buttonStyle}`}
                            disabled={isShowBtn}
                            onClick={() => onSubmitUnBlockRoom()}
                        >
                            Un Block 
                        </Button >
                    </div>
                    <div className="footer-right">
                        <Button
                            style={{ color: "#F74352", border: "1px solid #F74352" }}
                            className={`!rounded-md ${classes.buttonStyle}`}
                            onClick={() => setShowModal(false)}
                        >
                            {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                        </Button >
                        <Button
                            form={"form-hskpblock"}
                            type="primary" htmlType="submit"
                            className={`!rounded-md ${classes.buttonStyle}`}
                            loading={isLoading}
                        >
                            Ok
                        </Button>
                    </div>
                </div >
            }
        >
            <form onSubmit={handleSubmit(onSubmit)} id="form-hskpblock">
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6">
                        <label className="m-0 font-base font-bold">
                            Room
                        </label>
                        <Controller
                            render={({ onChange, value, ref }) =>
                                <Input
                                    disabled
                                    className={`${classes.input}`}
                                    type="text" style={{ background: "#F5F6F7", height: 40 }}
                                    value={value} 
                                    onChange={(e) => onChange(e.target.value)} >
                                </Input>
                            }
                            name="roomGuid" control={control} defaultValue={dataRoom?.roomNumber ?? ""} />
                    </div>
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
                            Status
                        </label>
                        <Controller
                            rules={{ required: true }}
                            render={({ onChange, value, ref }) =>
                                <Select className={`${classes.selectBackground} ${errors.tinhTrang && "errors-input"} w-full !rounded-md`} 
                                    placeholder={t("BOOKING.RESERVATION.EDITRESERVATION.selectHere")}
                                    showSearch
                                    value={value}
                                    defaultValue={1}
                                    onChange={(e) => { onChange(e) }}
                                >
                                    {listStatusRoom ? listStatusRoom.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.id}>{item.ten}</Option>
                                        )
                                    }) : ""
                                    }
                                </Select>
                            }
                            name="tinhTrang" control={control} defaultValue={""} />
                    </div>
                    <div className="col-span-6 mt-8">
                        <Controller render={({ onChange, onBlur, value, name, ref }) => (
                            <Checkbox
                                className={`${classes.titleCheckbox} flex-row items-center font-semibold`}
                                defaultChecked={false}
                                onChange={(e) => {
                                    onChange(e.target.checked)
                                }}>
                                Only Reservation
                            </Checkbox>
                        )}
                        name="onlyReservation" defaultValue={false} control={control} />
                    </div>
                    <div className="col-span-6">
                        <label className="col-span-2 m-0 font-base font-bold">
                            From
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
                            name="dateFrom" control={control} defaultValue={new Date()} />
                    </div>
                    <div className="col-span-6">
                        <label className="col-span-2 m-0 font-base font-bold">
                            To
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
                            name="dateTo" control={control} defaultValue={new Date()} />
                    </div>
                    <div className="col-span-12">
                        <label className="m-0 font-base font-bold">
                            Remark
                        </label>
                        <Controller render={({ onChange, value, ref }) =>
                            <TextArea className={`${classes.textArea} w-full col-span-12`}
                                style={{ height: 100, backgroundColor: "#F5F6F7", borderRadius: 6 }}
                                placeholder="Input comment here"
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                            />
                        }
                        name="remark" defaultValue="" control={control} />
                    </div>
                </div>
            </form>
        </Modal >
    );
}
export default OutOfOrderModel;