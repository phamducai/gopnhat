/* eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useState } from 'react';
import { useStyleTheme } from "theme/Theme";
import { Select, Input, AutoComplete } from 'antd';
import CScrollView from 'components/CScrollView';
import CIconSvg from 'components/CIconSvg';
import { Controller } from "react-hook-form";
import { useSelectorRoot } from 'redux/store';
import { styleFormMain } from '../styles/index.style';
import { styleCForm } from '../../../pages/main/booking/styles/styleCForm';
import { useTranslation } from 'react-i18next';

const FormMoreCompanyProfile = (props: any): JSX.Element => {
    const { Option } = Select;
    const classes = useStyleTheme(styleFormMain);
    const classesForm = useStyleTheme(styleCForm);
    const [yearNumber, setYearNumber] = useState<string>("");
    const { customerMarket, commissionType, loaiHinhHD } = useSelectorRoot(state => state?.company);
    const patternNumber = new RegExp(/^\d+$/);
    const { control } = props;
    const { t } = useTranslation("translation")

    const renderOptionYears = () => {
        const newListYear: any = [];
        const date = new Date();
        const currentYear = date.getFullYear();
        for (let year = currentYear; year >= 1995; year--) {
            newListYear.push({ value: year.toString() })
        }
        return newListYear;
    }
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }
    return (
        <CScrollView overlayClassScroll="custom-scrollbar-pkm">
            <div className={`grid grid-cols-12 mt-1 gap-2 text-xs font-bold leading-7 ${classes.textColor}`} style={{ padding: '15px' }}>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.yearOfEstablish")}</div>
                    <Controller
                        border={false}
                        defaultValue={"1900"}
                        name="namThanhLap"
                        control={control}
                        render={({ onChange, value }) =>
                            <AutoComplete
                                bordered={false}
                                className={`${classesForm.input} w-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0px" }}
                                value={yearNumber}
                                onChange={e => {
                                    onChange(e);
                                    patternNumber.test(e) ? setYearNumber(e) : setYearNumber("");
                                }}
                                maxLength={4}
                                options={renderOptionYears()}
                                filterOption={(input: any, option: any) => option.value.toString().indexOf(input) >= 0}

                            >
                                <Input
                                    className={`${classesForm.input}`}
                                    style={{ width: "calc(152% - 10px)" }}
                                    type={"number"}
                                    placeholder={"1900"}
                                    suffix={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                />
                            </AutoComplete>
                        }
                    />
                </div>
                <div className={`col-span-8`}>
                    <div>Loại hình hoạt động</div>
                    <Controller
                        border={false}
                        defaultValue=""
                        name="loaiHinhHd"
                        control={control}
                        as={
                            <Select showSearch bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {loaiHinhHD ? renderSelect(loaiHinhHD) : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                </div>
                <div className={`col-span-8`}>
                    <div>Thị trường chính</div>
                    <Controller
                        border={false}
                        defaultValue=""
                        name="thiTruongChinhId"
                        control={control}
                        as={
                            <Select showSearch bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {customerMarket ? renderSelect(customerMarket) : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                </div>
                <div className={`col-span-8`}>
                    <div>Thị trường phát triển</div>
                    <Controller
                        border={false}
                        defaultValue=""
                        name="thiTruongPtId"
                        control={control}
                        as={
                            <Select showSearch bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {customerMarket ? renderSelect(customerMarket) : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                </div>
                <div className={`col-span-8`}>
                    <div>Thị trường mục tiêu</div>
                    <Controller
                        border={false}
                        defaultValue=""
                        name="thiTruongHuongToiId"
                        control={control}
                        as={
                            <Select showSearch bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {customerMarket ? renderSelect(customerMarket) : ""}
                            </Select>
                        }
                    />
                </div>
                <div className={`col-span-4`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.commissionValue")}</div>
                    <Controller
                        defaultValue="0" name="commission" control={control}
                        render={({ onChange, value }) =>
                            <Input
                                onChange={e => {
                                    onChange(e);
                                }}
                                placeholder={"0"}
                                className={`${classesForm.input} w-full`} type="text" />
                        }
                    />
                </div>
                <div className={`col-span-8`}>
                    <div>{t("BOOKING.RESERVATION.COMPANYAGENTPROFILE.commissionType")}</div>
                    <Controller
                        border={false}
                        defaultValue=""
                        name="commissionType"
                        control={control}
                        as={
                            <Select showSearch bordered={false} className={`${classesForm.input} p-0 w-full h-full`}
                                style={{ display: "flex", alignItems: "center", padding: "0" }}
                                suffixIcon={<CIconSvg name="vector" hexColor="#1A87D7" svgSize="small" />}
                                filterOption={(input: any, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {commissionType ? renderSelect(commissionType) : ""}
                            </Select>
                        }
                    />
                </div>
            </div>
            {/* </form> */}
        </CScrollView >
    )
};

export default React.memo(FormMoreCompanyProfile);