/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useEffect } from 'react';
import { createStyles, useStyleTheme } from "theme/Theme";
import { Controller, useForm } from 'react-hook-form';
import { Input, Select } from 'antd';
import CScrollView from 'components/CScrollView';
import { Radio } from 'antd';
import { styleCRangePicker } from 'components/CRangePicker';
import DatePicker from 'components/CDatePicker';
import clsx from 'clsx';
import CIconSvg from 'components/CIconSvg';
import { useSelectorRoot } from 'redux/store';
import Utils from 'common/utils';
import { styleCForm } from '../../../pages/main/booking/styles/styleCForm';
const { TextArea } = Input;
const { Option } = Select;

export const styleFormMore = createStyles((theme) => ({
    title: {
        color: "#1A87D7",
        textTransform: 'uppercase',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    borderColor: {
        borderColor: "#E7E7E7 !important"
    }
}));

const FormMoreGuestProfile = ({ valueForm, valueGuestProfile, guestInfoByGuid, ...props }: any): JSX.Element => {
    const classes = useStyleTheme(styleFormMore);
    const classesForm = useStyleTheme(styleCForm);
    const classesDatepicker = useStyleTheme(styleCRangePicker);
    const { selectedProfile } = useSelectorRoot(state => state?.booking);
    const { handleSubmit, control, setValue, reset } = useForm();
    const { guestMoreDetailInfos } = useSelectorRoot(state => state?.rsvn);

    const onSubmit = handleSubmit((data) => {
        valueForm(data)
        setTimeout(() => {
            if (guestInfoByGuid == null) {
                reset({})
            }
        }, 1000);
    });
    useEffect(() => {
        if (valueGuestProfile !== null) {
            const dataForm: any = Object.assign({}, valueGuestProfile);
            for (const key of Object.keys(dataForm)) {
                if (dataForm[key] !== null || dataForm[key] !== "0") {
                    setValue(key, dataForm[key]);
                }
            }
        }
        if (guestInfoByGuid !== null) {
            const dataForm: any = Object.assign({}, guestInfoByGuid);
            for (const key of Object.keys(dataForm)) {
                if (dataForm[key] !== null || dataForm[key] !== "0") {
                    setValue(key, dataForm[key]);
                }
            }
        } else {
            reset({})
        }
    }, [])
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.ten} key={item.guid}>{item.ten}</Option>
            )
        })
    }

    return (
        <div className={`${props.className}`}>
            <CScrollView overlayClassScroll="custom-scrollbar-pkm">
                <form id='formMoreGuestProfile' style={{ height: 'calc(100vh - 230px)', padding: "24px" }} onSubmit={onSubmit}>
                    <div className="grid grid-cols-12 !pb-4 gap-2 text-xs font-bold leading-7">
                        <div className={`${classes.title} mt-2 col-span-12`}>thông tin chung</div>
                        <div className={`col-span-4`}>
                            <div>Khách NN</div>
                            <Controller
                                name='khachNn' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.khachNn : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.khachNN) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Giới tính</div>
                            <Controller
                                name='gioiTinh' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.gioiTinh : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.gioiTinh) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Loại giấy tờ</div>
                            <Controller
                                name='loaiGiayTo' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.loaiGiayTo : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.plGiayTo) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-8`}>
                            <div>Nghề nghiệp</div>
                            <Controller
                                name='ngheNghiep' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.ngheNghiep : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.ngheNghiep) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Mục đích lưu trú</div>
                            <Controller
                                name='mucDichLuuTru' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.mucDichLuuTru : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.mucDichLuuTru) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Dân tộc</div>
                            <Controller
                                name='danToc' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.danToc : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.danToc) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Tôn giáo</div>
                            <Controller
                                name='tonGiao' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.tonGiao : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.tonGiao) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Quốc gia</div>
                            <Controller
                                name='quocGiaNew' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.quocGiaNew : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value="Option 1">Option 1</Option>
                                        <Option value="Option 2">Option 2</Option>
                                        <Option value="Option 3">Option 3</Option>
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Tỉnh/thành phố</div>
                            <Controller
                                name='tinh' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.tinh : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value="Option 1">Option 1</Option>
                                        <Option value="Option 2">Option 2</Option>
                                        <Option value="Option 3">Option 3</Option>
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Quận/huyện</div>
                            <Controller
                                name='quan' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.huyen : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value="Option 1">Option 1</Option>
                                        <Option value="Option 2">Option 2</Option>
                                        <Option value="Option 3">Option 3</Option>
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Xã/phường</div>
                            <Controller
                                name='xa' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.xa : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        <Option value="Option 1">Option 1</Option>
                                        <Option value="Option 2">Option 2</Option>
                                        <Option value="Option 3">Option 3</Option>
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-12`}>
                            <div>Số nhà, phố</div>
                            <Controller
                                name='soNhaDuong' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.soNhaDuong : ""}
                                as={<Input className={`${classesForm.input} w-full`} type="text" />} />
                        </div>
                        <div className={`col-span-12 my-2 border-dashed border-b-2 border-gray-200`} />
                        <div className={`${classes.title} col-span-12`}>thông tin tạm trú</div>
                        <div className={`col-span-4`}>
                            <div>Hạn tạm trú</div>
                            <Controller
                                name='hanTamTru' control={control}
                                defaultValue={""}
                                render={({ onChange, value }) => (
                                    <DatePicker
                                        clearIcon
                                        placeholder="DD/MM/YYYY"
                                        format="DD/MM/YYYY"
                                        defaultValue={selectedProfile.length > 0 ? Utils.convertBirthDateFormat(selectedProfile[0]?.hanTamTru) : undefined}
                                        className={`${clsx(classesDatepicker.datePicker, classesForm.input, classes.borderColor)} w-full`}
                                        onChange={(date, dateString) => onChange(date)} />
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Là Việt kiều?</div>
                            <Controller
                                name='laVietKieu' control={control} defaultValue={false}
                                render={({ onChange, value }) => (
                                    <Radio.Group style={{ height: "40px", display: "flex", alignItems: "center", marginLeft: "2px" }} className={`${classesForm.radioGroup} !flex !items-center font-semibold text-base`} defaultValue={1} value={value}
                                        onChange={e => { onChange(e.target.value) }}>
                                        <Radio style={{ color: "#00293B" }} className={`w-1/3`} value={false}>Không</Radio>
                                        <Radio style={{ color: "#00293B" }} className={`w-1/3`} value={true}>Có</Radio>
                                    </Radio.Group>
                                )} />
                        </div>
                        <div className={`col-span-4`}>

                        </div>
                        <div className={`col-span-4`}>
                            <div>Loại thị thực</div>
                            <Controller
                                name='loaiThiThuc' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.loaiThiThuc : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.loaiThiThuc) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>
                            <div>Nơi cấp thị thực</div>
                            <Controller
                                name='noiCapThiThuc' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.noiCapThiThiThuc : ""}
                                render={({ onChange, value }) => (
                                    <Select bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                        style={{ display: "flex", alignItems: "center", padding: "0" }}
                                        suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                        value={value} onChange={e => onChange(e)} >
                                        {guestMoreDetailInfos ? renderSelect(guestMoreDetailInfos?.noiCapTT) : ""}
                                    </Select>
                                )} />
                        </div>
                        <div className={`col-span-4`}>

                        </div>
                        <div className={`col-span-12`}>
                            <div>Lý do hết hạn tạm trú</div>
                            <Controller
                                name="lyDoHetHanTamTru" control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.lyDoHetHanTamTru : ""}
                                as={<TextArea className={`${classesForm.input} !py-1 w-full`} autoSize={{ minRows: 3, maxRows: 6 }} />} />
                        </div>
                        <div className={`col-span-12`}>
                            <div>Ghi chú</div>
                            <Controller
                                name='ghiChu' control={control}
                                defaultValue={selectedProfile.length > 0 ? selectedProfile[0]?.ghiChu : ""}
                                as={<TextArea className={`${classesForm.input} !py-1 w-full`} autoSize={{ minRows: 3, maxRows: 6 }} />} />
                        </div>
                    </div>
                </form>
            </CScrollView>
        </div>
    )
};

export default React.memo(FormMoreGuestProfile);