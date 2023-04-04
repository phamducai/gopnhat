/* eslint-disable*/
import ClassBox from 'components/CClassBox'
import React, { useRef, useState } from 'react'
import { Input, Select, Button, Checkbox } from "antd";
import { Controller } from 'react-hook-form';
import { createStyles, useStyleTheme } from 'theme';
import clsx from 'clsx';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import ProfileApi from 'api/profile/prf.api';
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice"
import { useEffect } from 'react';
import { HotelConfigInfo } from 'common/shared/hotelconfig.model';
import { GuestProfile } from 'common/model-profile';
import WalkInService from 'services/frontdesk/walk-in/walkin.services';
import PkmApi from 'api/pkm/pkm.api';
const { Option } = Select;
const styleInput = createStyles((theme) => ({
    inputReservation: {
        background: "#E7E7E7",
    },
    input: {
        background: "#F5F6F7",
        borderRadius: 6,
        border: "1px solid #E7E7E7",
    },
    selectBackground: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            height: "40px !important",
            alignItems: "center !important",
            borderRadius: "6px !important",
            '& span': {
                '& .ant-select-selection-search-input': {
                    height: "38px !important"
                }
            }
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        },
    },
    buttonStyle: {
        height: "36px !important",
        padding: "4px 17px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    }
}))
interface ICGuestProfile extends Props {
    openDrawerGuestProfile?: any,
    setIsPrintRateByCompany?: any,
    isFit?: boolean,
    control?: any,
    data?: HotelConfigInfo,
    filteredCompanyProfile: any,
    setSelectValueSource?: any,
    valueSource?: any,
    getGuestProfileByRsvnId?: any,
    guestProfile: any
    getValues: any,
    setValue: any,
    // setWalkInProfile: React.Dispatch<React.SetStateAction<GuestProfile | null>>,
    // walkInGuestProfile: GuestProfile | null
}
const CGuestProfileWalkin = ({ getValues, setValue, guestProfile, getGuestProfileByRsvnId, openDrawerGuestProfile, setIsPrintRateByCompany, control, data, filteredCompanyProfile, ...props }: ICGuestProfile): JSX.Element => {
    const classes = useStyleTheme(styleInput);
    const typingTimeoutRef = useRef(0);
    const dispatch = useDispatchRoot();
    const { hotelId } = useSelectorRoot(state => state.app);
    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }
    const onSearch = (val: any) => {
        val.length > 0 ? val = val : val = "a"
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

    const getRSVNTypeByIdGuid = (idGuid: any, data: Array<any>) => {
        let resultRsvnType = data.find(x => x.guid === idGuid);
        if (resultRsvnType === undefined) {
            setValue("confirmed",false);
            return;
        }
        setValue("confirmed", resultRsvnType.isConfirm);
    }

    const onChangeNameOrLastName = (tag: string, e: any) => {
        switch (tag) {
            case 'guestName':
                WalkInService.baseProfile.guestName = e.target.value;
            break;
            case 'firstName':
                WalkInService.baseProfile.firstName = e.target.value;
            break;
            default:
            break;
        }
        console.log(WalkInService.baseProfile);
    }
    // useEffect(() => {
    //     ProfileApi.getGuestProfileById(guestProfile.dataForeservationDTO.bookedBy).subscribe(
    //         (res: any) => {
    //             setValue("firstName", res.firstName);
    //             setValue("lastName", res.guestName);
    //         },
    //         (err) => {
    //             alert("Error when booking a reservation!");
    //             console.log(err);
    //         }
    //     )
    //     setValue('paymentMethod', guestProfile.dataFotransactRoomDTO.paymentMethod);
    //     setValue('resMarket', guestProfile.dataFotransactRoomDTO.resMarket);
    //     setValue('resSource', guestProfile.dataFotransactRoomDTO.resSource);
    //     setValue('resType', guestProfile.dataFotransactRoomDTO.resType);
    //     setValue('resOrigin', guestProfile.dataFotransactRoomDTO.resOrigin);
    //     setValue('resChanel', guestProfile.dataFotransactRoomDTO.resChanel);
    //     setValue('companyAgentGuid', guestProfile.dataFotransactRoomDTO.companyAgentGuid);

    // }, [])
    return (
        <ClassBox className={clsx(props.className)}>
            <div className="grid xl:grid-cols-12 col-span-12 pt-4 md:w-11/12 xl:w-full">
                <div className="col-span-4" style={{ padding: "0px 2px" }}>
                    <p className="m-0 font-base font-bold">Title:</p>
                    <Controller
                        // as={<Select className={` ${classes.selectBackground} w-full !rounded-md`}
                        render={({ onChange, value, ref }) =>
                            <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                                showSearch
                                value={getValues("title") || undefined}
                                onChange={(e) => {
                                    onChange(e);
                                }}
                            // filterOption={(input: any, option: any) =>
                            //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Option value="Mr.">Mr.</Option>
                                <Option value="Mrs">Mrs.</Option>
                                <Option value="Ms">Ms.</Option>
                            </Select>}
                        name="title" defaultValue="Mr." control={control} />
                </div>
                <div className="col-span-4" style={{ padding: "0px 4px" }}>
                    <p className="m-0 font-base font-bold">Name:</p>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input}`}
                                onChange={e => {
                                    onChange(e);
                                    onChangeNameOrLastName('firstName', e);
                                }}
                                value={getValues("firstName") || undefined}
                                style={{ background: "#F5F6F7", height: 40 }}
                                placeholder="Enter name" required={true} />
                        }
                        control={control} placeholder="Enter name" name="firstName"
                    />
                </div>
                <div className="col-span-4" style={{ padding: "0px 4px" }}>
                    <p className="m-0 font-base font-bold">Last name:</p>
                    <Controller
                        render={({ onChange, value }) =>
                            <Input
                                className={`${classes.input} w-full`}
                                onChange={e => {
                                    onChange(e);
                                    onChangeNameOrLastName('guestName', e);
                                }}
                                style={{ background: "#F5F6F7", height: 40 }}
                                value={getValues("guestName") || undefined}
                                placeholder="Enter last name" />}
                        control={control} name="guestName"
                    />
                </div>
                {/* <div className="col-span-12" style={{ marginTop: 10 }}>
                    <p className="m-0 font-base font-bold">Booking Code:</p>
                    <Controller render={({ onChange, value }) =>
                        <Input
                            onChange={e => {
                                onChange(e)
                            }}
                            style={{ background: "#F5F6F7", height: 40, width: "100%" }} placeholder="Enter group/booking code here" />
                    } name="bookingCode" control={control} defaultValue={""}
                    />
                </div> */}
            </div>
            <div className="flex justify-end col-span-12 pt-4 gap-3">
                <Button style={{ color: "#1A87D7" }} className={`${classes.buttonStyle} !rounded-md`}>Search</Button>
                <Button type="primary"
                    className={`${classes.buttonStyle} !rounded-md !font-semibold`}
                    onClick={() => {
                        openDrawerGuestProfile(true);
                    }}>Guest profile</Button>
            </div>
            <div className="col-span-12 border-dashed border-t"></div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <p className="m-0 font-base font-bold">
                    Payment by:
                </p>
                <Controller
                    // as={<Select className={` ${classes.selectBackground} w-full !rounded-md`} placeholder="Select here">
                    // {data ? renderSelect(data.paymentMethods) : ""}
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                            }}
                            value={getValues('paymentMethod') || undefined}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.paymentMethods) : ""}
                        </Select>
                    }
                    name="paymentMethod" defaultValue="" control={control} />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <p className="m-0 font-base font-bold">
                    RSVN Market:
                </p>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                            }}
                            value={getValues('resMarket') || undefined}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.markets) : ""}
                        </Select>
                    }
                    name="resMarket" defaultValue="" control={control} />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <p className="font-base font-bold m-0">RSVN source:</p>
                <Controller render={({ onChange, value, ref }) =>
                    <Select
                        showSearch
                        onChange={(e) => {
                            onChange(e)
                        }}
                        value={getValues('resSource') || undefined}
                        filterOption={(input: any, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        className={`${classes.selectBackground} w-full !rounded-md`}
                        placeholder="Select here">
                        <Option value=""> </Option>
                        {data ? renderSelect(data.sources) : ""}
                    </Select>
                }
                    name="resSource" control={control} defaultValue="" />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <div className="col-span-12">
                    <span className="m-0 font-base font-bold">
                        RSVN Type:
                    </span>

                    <Controller render={(
                        { onChange, onBlur, value, name, ref }) => (
                        <Checkbox style={{ height: "50%", float: 'right', pointerEvents: "none", cursor: "no-drop" }}
                            className={`flex-row items-end font-semibold`}
                            checked={getValues("confirmed")}
                            onChange={(e) => onChange(e.target.checked)}

                        >
                            Confirmed
                        </Checkbox>
                    )} name="confirmed" control={control} />
                </div>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                                getRSVNTypeByIdGuid(e, data ? data.rsvnTypes : [])
                            }}
                            value={getValues('resType') || undefined}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.rsvnTypes) : ""}
                        </Select>
                    }
                    name="resType" control={control} defaultValue="" />
            </div>
            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <p className="m-0 font-base font-bold">
                    RSVN Origin:
                </p>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                            }}
                            value={getValues('resOrigin') || undefined}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.origins) : ""}
                        </Select>
                    }
                    name="resOrigin" control={control} defaultValue="" />
            </div>

            <div className="col-span-4" style={{ padding: "0px 2px" }}>
                <p className="font-base font-bold m-0">RSVN Channel:</p>
                <Controller
                    render={({ onChange, value, ref }) =>
                        <Select className={`${classes.selectBackground} w-full !rounded-md`} placeholder="Select here"
                            showSearch
                            onChange={(e) => {
                                onChange(e)
                            }}
                            value={getValues('resChanel') || undefined}
                            filterOption={(input: any, option: any) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value=""> </Option>
                            {data ? renderSelect(data.channels) : ""}
                        </Select>
                    }
                    name="resChanel" control={control} defaultValue="" />
            </div>

            <div className="col-span-8" style={{ padding: "0px 2px" }}>
                <p className="m-0 font-base font-bold">
                    Company/Agent:
                </p>
                <Controller render={({ onChange, value, ref }) =>
                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                        showSearch
                        onSearch={onSearch}
                        value={getValues('companyAgentGuid') || undefined}
                        placeholder="Input name/Code/VAT code for filter"
                        filterOption={false}
                        onChange={(e) => {
                            onChange(e)
                        }}
                    >
                        <Option value=""> </Option>
                        {filteredCompanyProfile.length ? renderSelect(filteredCompanyProfile) : ""}
                    </Select>
                }
                    name="companyAgentGuid" control={control} defaultValue="" />
            </div>
        </ClassBox >
    );
};

export default React.memo(CGuestProfileWalkin);