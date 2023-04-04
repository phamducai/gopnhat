/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, Modal, notification, Select } from "antd";
import { DataFormConfirm, ISearchResult } from "common/model-booking";
import { styleReservation } from 'pages/main/booking/reservation/styles/reservation';
import TableSearchResults from "pages/main/booking/searchResults/TableSearchResults";
import { styleCForm } from "pages/main/booking/styles/styleCForm";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { themeValue, useStyleTheme } from "theme";
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice";
import { IFormSearch } from "common/define-booking";
import { Dropdown } from 'antd';
import CModelConfirm from "components/CModalConfirm";
import setStatusRSVN from "services/booking/statusRsvn/status.service";
import CConfirm from "components/CConfirm";
import { useHistory } from "react-router";
import { ExpandStatus, ReservationStatus } from "common/enum/booking.enum";
import { cancelPmRequest, searchWithQueryParam, setStatusGroupRSVN } from "redux/controller";
import FolioService from "services/cashier/folio.service";
import ReservationService from "services/reservation/reservation.service.";
import useWindowSize from "hooks/useWindowSize";
import Auth from "services/auth/auth.service";
import Role from "common/roles";
const { Option } = Select;

export interface Props {
    handleSearch(formSearch: IFormSearch, isRedirect: boolean): void,
    visible: boolean
}
const SearchCashier = ({ handleSearch, visible }: Props) => {
    const { fullScreen, navbar, paddingYPage } = themeValue.height;

    const classes = useStyleTheme(styleReservation);
    const classeForm = useStyleTheme(styleCForm);
    const { control, handleSubmit, register } = useForm();
    const dispatch = useDispatchRoot();
    const history = useHistory();
    const { numberOfRooms, hotelId } = useSelectorRoot(state => state.app);
    const { businessDate } = useSelectorRoot(state => state.hotelConfig);

    const typingTimeoutRef = useRef(0);

    const { dataSearchResults, loadingSearch, titleDataSearchResults, formSearch, listGuestProfiles, queryParam, roomTypePm } = useSelectorRoot(state => state.booking);
    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);

    const [heightHeader, setHeightHeader] = useState(65)
    const [isShowCancel, setShowCancel] = useState<boolean>(false);
    const [ableToEdit, setAbleToEdit] = useState<boolean>(false);
    const [ableCancelPM] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<ISearchResult[] | []>([])
    const [idRsvn, setIdRsvn] = useState('')
    const [lstSelectedData, setLstSelectedData] = useState<any>();
    const [transactRoomId, setTransactRoomId] = useState<string>('');

    const refHeader = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("translation");
    const size = useWindowSize();

    useLayoutEffect(() => {
        if (refHeader.current && refHeader.current.clientHeight) {
            setHeightHeader(refHeader.current.clientHeight)
        }
    }, [refHeader?.current?.clientHeight])

    const handleOnChange = (e: { select: ISearchResult[] }) => {
        setSelectedRows(e.select);
        const select = e.select;
        const lstSelectedData: any[] = [];
        select.forEach((item: any) => {
            // setListGuestId()
            // setListGuestId(listGuestId.concat(item.guestId))
            const tmp = listGuestProfiles.find(x => x?.guid === item.guestId);
            const transactionRooms = queryParam.find(x => x.guid === item.guid);
            if (tmp) lstSelectedData.push({
                ...tmp,
                transactRoomGuid: transactionRooms?.guid,
                transactParentGuid: transactionRooms?.parentGuid,
                roomType: transactionRooms?.roomType
            });
        });
        if (lstSelectedData.length === 1) {
            setIdRsvn(lstSelectedData[0].transactParentGuid)
        }
        setLstSelectedData(lstSelectedData);
        if (lstSelectedData.length === 1) {
            select.forEach((item: ISearchResult) => {
                const selectQueryParm = queryParam.find(x => x.guid === item.guid);

                selectQueryParm && setTransactRoomId(selectQueryParm?.guid);
                // roomTypePm[0]?.guid === item.roomType.id ? setAbleCancelPM(true) : setAbleCancelPM(false);
                // selectQueryParm?.parentMeGuid === null && roomTypePm[0]?.guid !== item.room.id ? setAbleToCombine(true) : setAbleToCombine(false);
                selectQueryParm?.parentMeGuid === null ? setAbleToEdit(true) : setAbleToEdit(false);
                // selectQueryParm?.parentMeGuid !== null &&
                // (selectQueryParm?.status === 1 || selectQueryParm?.status === 0) ? setAbleBreakShared(true) : setAbleBreakShared(false);
                // setAbleToConfirm(true);
            })
        } else {

            // setAbleToEdit(false)
            // setAbleCancelPM(false);
        }
    }

    const renderSelect = (data: any[]) => {
        return data?.map((item: any) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }

    const clickCancelRsvn = (IsIncludeChild: boolean) => {
        if (!ableCancelPM) {

            const isCheckin = (!IsIncludeChild && formSearch.status === ReservationStatus.CheckIn) ? true : false;
            const data = setStatusRSVN.dataCancelRsvn(selectedRows, numberOfRooms, true);
            dispatch(setStatusGroupRSVN({ data, IsIncludeChild, isCheckin: isCheckin }))

        } else {
            dispatch(cancelPmRequest({
                roomTypeId: roomTypePm[0].guid,
                rSVNId: idRsvn
            }))
        }
    }

    const onSubmit = handleSubmit((formSearch: IFormSearch) => {
        handleSearch(formSearch, false);
    });

    const onSearch = (val: any) => {
        const value = val.length > 0 ? val : val = "g"
        if (typingTimeoutRef.current) {
            window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: value
            }))
        }, 300)
    }

    const handleClickFolio = () => {
        const fullName = selectedRows[0].fullName.name;
        history.push(`/main/cashier/folio/${selectedRows[0].guid}`,
            {
                fullName, tsRomGuid: selectedRows[0].guid,
                roomNumber: selectedRows[0].room.name ?? "",
                guestGuid: selectedRows[0].guestId, status: selectedRows[0].status.id,
                parentMeGuid: selectedRows[0].parentMeGuid
            }
        )
    }
    const clickEditRsvn = () => {
        //await search.editGroupRsvn(idRsvn);
        const rsvnNo = idRsvn
        const status = selectedRows[0]?.status.name ?? "";
        history.push(`/main/booking/edit-rsvn/${transactRoomId}?isMain=${ableToEdit}`, { rsvnNo, status, isTableSearch: true });
    }

    const handleCheckOutGroup = async () => {
        if(Auth.hasRole(Role.FO)){
            const groupInfo = dataSearchResults.find((item) => item.parentGuid === lstSelectedData[0].transactParentGuid)
            const departureDate = new Date(groupInfo?.departure.id ?? "")
            Modal.confirm({
                title: departureDate > businessDate ? "Do you want to check out early ?" : "Do you want check out this group ? ",
                className: "custom-modal-confirm-pkm",
                async onOk() {
                    const respCheckOut = await FolioService.checkBalanceCheckOut("", idRsvn, "", false);
                    if (respCheckOut.length > 0) {
                        notification["error"]({
                            message: "Check out failed !",
                            description: (
                                <div>
                                    {respCheckOut.map((item) => {
                                        return (
                                            <p key={item.tsRoomId}>
                                                Guest {item.fullName}, <b style={{ color: "red" }}>{`folio ${item.positionGroups.join(", ")} invalid !`}</b>
                                            </p>
                                        )
                                    })}
                                    <i>Note ( All group folio balance must be zero )</i>
                                </div>
                            ),
                            style: { borderRadius: 6, top: "8vh" }
                        })
                    }
                    else {
                        await ReservationService.checkOutToGroup(idRsvn, businessDate);
                        const data = {
                            hotelGuid: hotelId,
                            status: 1,
                            listRoomType: numberOfRooms
                        }
                        dispatch(searchWithQueryParam({ ...data, profileIds: [] }));
                    }
                }
            });
        }
    }

    const renderMenuItem = <>
        <Button className={`${classeForm.funcBtn} ml-1`} disabled={selectedRows.length !== 1 ? true : false}
            onClick={handleCheckOutGroup}>
            {t("BOOKING.SEARCHVALUE.groupCO")}
        </Button>
    </>
    return (
        <>
            <form className="grid grid-cols-12 gap-2 mb-2" onSubmit={onSubmit}>
                <div className="col-span-12 grid grid-cols-12 gap-2 ">
                    <div className=" col-span-2 2xl:col-span-1">
                        <label className={classeForm.labelInput}>{t("BOOKING.rsvnNo")}:</label>
                        <Controller as={<Input {...register("rsvnNo", {
                            required: false,
                            maxLength: 20,
                            // pattern: /^[A-Za-z]+$/i,
                        })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />}
                        name="rsvnNo" control={control} defaultValue={""} />
                    </div>
                    <div className={` ${((size === "lg" && !visible) || (size === "md" && visible)) ? "col-span-2 2xl:col-span-3" : "col-span-1 2xl:col-span-1"} `}>
                        <label className={classeForm.labelInput}>{t("BOOKING.roomNo")}:</label>
                        <Controller as={<Input {...register("room", {
                            required: false,
                            maxLength: 20,
                            // pattern: /^[A-Za-z]+$/i,
                        })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />} name="room" control={control} defaultValue="" />
                    </div>
                    <div className={`${((size === "lg" && !visible) || (size === "md" && visible)) ? "col-span-2 2xl:col-span-3" : "col-span-1 2xl:col-span-1"}`}>
                        <label className={classeForm.labelInput}>{t("BOOKING.firstname")}:</label>
                        <Controller
                            as={<Input {...register("firstName", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classeForm.input} w-full `}
                            type="text" />} name="firstName" defaultValue="" control={control} />
                    </div>
                    <div className={`${size === "md" ? "col-span-2" : " col-span-2 2xl:col-span-1"}`}>
                        <label className={classeForm.labelInput}>{t("BOOKING.lastname")}:</label>
                        <Controller as={<Input {...register("guestName", {
                            required: false,
                            maxLength: 20,
                            // pattern: /^[A-Za-z]+$/i,
                        })} autoComplete='off' className={`${classeForm.input} w-full`} type="text" />} name="guestName" control={control} defaultValue={""} />
                    </div>
                    {size === "2xl" && // render when screen is 2xl
                        <>
                            <div className={` "col-span-3" 2xl:col-span-2`}>
                                <label className={classeForm.labelInput}>{t("BOOKING.groupOrBookingCode")}:</label>
                                <Controller
                                    as={<Input {...register("groupCode", {
                                        required: false,
                                        maxLength: 20,
                                        // pattern: /^[A-Za-z]+$/i,
                                    })} autoComplete='off' className={`${classeForm.input} w-full `}
                                    type="text" />} name="groupCode" defaultValue="" control={control} />
                            </div>
                            <div className={`" col-span-1 " 2xl:col-span-1`}>
                                <label className={classeForm.labelInput}>{t("BOOKING.company")}:</label>
                                <Controller
                                    render={({ onChange, value }) =>
                                        <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                            showSearch
                                            onSearch={onSearch}
                                            onChange={(e) => {
                                                onChange(e)
                                            }}
                                            filterOption={false}
                                        >
                                            <Option value=""> </Option>
                                            {filteredCompanyProfile ? renderSelect(filteredCompanyProfile) : ""}
                                        </Select>
                                    }
                                    control={control} defaultValue="" name={"companyAgentGuid"}
                                />
                            </div>
                            <div className={`col-span-5 grid grid-cols-12 gap-2 mt-2 flex`}>
                                <div className={`col-span-3`}>
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        className={`${classeForm.submitBtn}`}
                                    >
                                        {t("BOOKING.SEARCHVALUE.search")}
                                    </Button>
                                </div>
                                {selectedRows.length > 0 &&
                                    <div className={`col-span-9 grid grid-cols-12 gap-1`}>
                                        {/* <div className={`col-span-4`} > </div> */}
                                        <div className={`col-span-3`} >
                                            <Button
                                                onClick={() => setShowCancel(true)}
                                                className={`${classeForm.funcBtn} ${classes.btnDanger} `}
                                            >
                                                {t("BOOKING.SEARCHVALUE.cancel")}
                                            </Button>
                                        </div>
                                        <div className={`col-span-3`} >
                                            <Button
                                                className={`${classeForm.funcBtn} ml-1 `}
                                                onClick={clickEditRsvn}
                                            >
                                                {t("BOOKING.SEARCHVALUE.edit")}
                                            </Button>
                                        </div>
                                        <div className={`col-span-3`} >
                                            <Button
                                                disabled={selectedRows.length !== 1} onClick={handleClickFolio}
                                                className={`${classeForm.funcBtn} ml-1 `}
                                            >
                                                {t("BOOKING.SEARCHVALUE.folio")}
                                            </Button>
                                        </div>
                                        {/* <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomLeft">
                                        <Button className={`${classeForm.funcBtn} ml-1`}>...</Button>
                                    </Dropdown> */}
                                        <div className={`col-span-3`} >
                                            <Button className={`${classeForm.funcBtn} ml-1 `} disabled={selectedRows.length !== 1 ? true : false}
                                                onClick={handleCheckOutGroup}>
                                                {t("BOOKING.SEARCHVALUE.groupCO")}
                                            </Button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </>
                    }
                    {/* render when screen is xl and lg if colappse search criteria close  */}
                    {(size === "xl" || (size === "lg" && visible)) &&   
                        selectedRows.length > 0 &&
                        <div className={`col-span-6 grid grid-cols-12 gap-2 mt-2`}>
                            <div className={`col-span-3`} >
                                <Button
                                    onClick={() => setShowCancel(true)}
                                    className={`${classeForm.funcBtn} ${classes.btnDanger} `}
                                >
                                    {t("BOOKING.SEARCHVALUE.cancel")}
                                </Button>
                            </div>
                            <div className={`col-span-3`} >
                                <Button
                                    className={`${classeForm.funcBtn} ml-1 `}
                                    onClick={clickEditRsvn}
                                >
                                    {t("BOOKING.SEARCHVALUE.edit")}
                                </Button>
                            </div>
                            <div className={`col-span-3`} >
                                <Button
                                    disabled={selectedRows.length !== 1} onClick={handleClickFolio}
                                    className={`${classeForm.funcBtn} ml-1`}
                                >
                                    {t("BOOKING.SEARCHVALUE.folio")}
                                </Button>
                            </div>
                            {/* <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomLeft">
                                <Button className={`${classeForm.funcBtn} ml-1`}>...</Button>
                            </Dropdown> */}
                            <div className={`col-span-3`} >
                                <Button className={`${classeForm.funcBtn} ml-1 col-span-2`} disabled={selectedRows.length !== 1 ? true : false}
                                    onClick={handleCheckOutGroup}>
                                    {t("BOOKING.SEARCHVALUE.groupCO")}
                                </Button>
                            </div>
                        </div>
                    }
                </div>
                {/* render when screen is not 2xl */}
                {size !== "2xl" && <div className="col-span-12 2xl:col-span-6 grid grid-cols-12 gap-2"> 
                    <div className={`col-span-3`}>
                        <label className={classeForm.labelInput}>{t("BOOKING.groupOrBookingCode")}:</label>
                        <Controller
                            as={<Input {...register("groupCode", {
                                required: false,
                                maxLength: 20,
                                // pattern: /^[A-Za-z]+$/i,
                            })} autoComplete='off' className={`${classeForm.input} w-full `}
                            type="text" />} name="groupCode" defaultValue="" control={control} />
                    </div>
                    <div className={`col-span-2`}>
                        <label className={classeForm.labelInput}>{t("BOOKING.company")}:</label>
                        <Controller
                            render={({ onChange, value }) =>
                                <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                    showSearch
                                    onSearch={onSearch}
                                    onChange={(e) => {
                                        onChange(e)
                                    }}
                                    filterOption={false}
                                >
                                    <Option value=""> </Option>
                                    {filteredCompanyProfile ? renderSelect(filteredCompanyProfile) : ""}
                                </Select>
                            }
                            control={control} defaultValue="" name={"companyAgentGuid"}
                        />
                    </div>
                    <div className={`${selectedRows.length > 0 ? (size === "xl") ||(size === "lg" && visible) ? "col-span-3" : "col-span-7" : "col-span-3"} flex`} style={{ marginTop: "0.62rem" }}>
                        <div >
                            <Button
                                htmlType="submit"
                                type="primary"
                                className={`${classeForm.submitBtn}`}
                            >
                                {t("BOOKING.SEARCHVALUE.search")}
                            </Button>
                        </div>
                        {selectedRows.length > 0 && ((size === "lg" && !visible) || (size === "md" && visible)) &&
                            <div className={`col-span-6 grid grid-cols-12 gap-1 ml-2`}>
                                {/* <div className={`col-span-4`} > </div> */}
                                <div className={`col-span-3`} >
                                    <Button
                                        onClick={() => setShowCancel(true)}
                                        className={`${classeForm.funcBtn} ${classes.btnDanger} `}
                                    >
                                        {t("BOOKING.SEARCHVALUE.cancel")}
                                    </Button>
                                </div>
                                <div className={`col-span-3`} >
                                    <Button
                                        className={`${classeForm.funcBtn}`}
                                        onClick={clickEditRsvn}
                                    >
                                        {t("BOOKING.SEARCHVALUE.edit")}
                                    </Button>
                                </div>
                                <div className={`col-span-3`} >
                                    <Button
                                        disabled={selectedRows.length !== 1} onClick={handleClickFolio}
                                        className={`${classeForm.funcBtn}`}
                                    >
                                        {t("BOOKING.SEARCHVALUE.folio")}
                                    </Button>
                                </div>
                                {/* <Dropdown overlay={renderMenuItem} trigger={['click']} placement="bottomLeft">
                                <Button className={`${classeForm.funcBtn} ml-1`}>...</Button>
                            </Dropdown> */}
                                <div className={`col-span-3`} >
                                    <Button className={`${classeForm.funcBtn}`} disabled={selectedRows.length !== 1 ? true : false}
                                        onClick={handleCheckOutGroup}>
                                        {t("BOOKING.SEARCHVALUE.groupCO")}
                                    </Button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                }
            </form>


            <TableSearchResults
                visible={loadingSearch}
                dataSearchResults={dataSearchResults}
                titleDataSearchResults={titleDataSearchResults}
                propsOnChange={handleOnChange}
                heightHeader={`${heightHeader + 85}px`}
                handleClickContextMenu={""}
                heightTable={`calc(${fullScreen} - (${40} + ${paddingYPage} + ${navbar} + ${heightHeader}px) + 30px)`}
            />
            <CModelConfirm
                title={t(setStatusRSVN.mapTitleTranslation(ableCancelPM ? ExpandStatus.PM : formSearch.status))}
                visible={isShowCancel}
                onCancel={() => setShowCancel(false)}
                myForm="form-apply-group"
                width={400}
                content={
                    <CConfirm
                        title={t("COMMON.apply_for_shared_guest")}
                        idForm="form-apply-group"
                        defaultValue={true}
                        status={formSearch.status}
                        propsGetData={(data: DataFormConfirm) => {
                            clickCancelRsvn(data.isChild)
                            setShowCancel(false)
                        }}
                    />
                }
            />
        </>
    )
}
export default React.memo(SearchCashier);