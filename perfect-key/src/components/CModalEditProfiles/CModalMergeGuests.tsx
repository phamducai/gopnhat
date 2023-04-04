/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import CModel from 'components/CModal'
import { Controller, useForm } from 'react-hook-form'
import { useStyleTheme } from 'theme'
import { editProfilesStyle } from './styles/editProfiles'
import { Input, Select, Table, Checkbox, Button } from 'antd'
import { columnsTable, columnsFooterTable } from './CModalMerge/TableColumns'
import CButtonFooter from './CModalMerge/CButtonFooter'
import CButtonRight from './CModalMerge/CButtonRight'
import { useTranslation } from 'react-i18next'
import GuestProfileService from 'services/booking/guestprofile.service'
import { useDispatchRoot, useSelectorRoot } from 'redux/store'
import Utils from 'common/utils'
import CLoading from 'components/CLoading'
import { GuestHistoryYear } from "common/model-rsvn"
import DrawerProfile from "components/CDrawerProfile/CDrawerProfile";
import CFormSearch from './CSearchGuestProfile/CFormSearch'
import CTableGuestProfile from './CSearchGuestProfile/CTableGuestProfile'
import useWindowSize from 'hooks/useWindowSize'
import { setRoomTypeLoadPage } from 'redux/controller'
import { NotificationStatus } from 'common/enum/shared.enum'
import openNotification from 'components/CNotification'

interface CModalMergeProps {
    title: string
    visibleMergeGuest: boolean
    setVisibleMergeGuest: any
    guestGuid: any
    setVisibleNewGuestProfile: any
    setIsDisableEdit: any
}

const CModalMergeGuests = (props: CModalMergeProps): JSX.Element => {
    const { title, visibleMergeGuest, setVisibleMergeGuest, guestGuid, setVisibleNewGuestProfile, setIsDisableEdit } = props
    const classes = useStyleTheme(editProfilesStyle)
    const Option = Select.Option
    const { t } = useTranslation("translation")
    const { hotelId } = useSelectorRoot(state => state.app)
    const {roomType} = useSelectorRoot(state => state.booking)
    const { control } = useForm()
    const size = useWindowSize();
    const dispatch = useDispatchRoot();

    const [pageSize, setPageSize] = useState<number>(Utils.getPageSizeAssign(size));
    const [filter, setFilter] = useState({ pageNumber: 1, pageSize: 10})
    const [totalItem, setTotalItem] = useState<number>(1);
    
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [guestTitle, setGuestTitle] = useState<string>("")
    const [passport, setPassport] = useState<string>("")
    const [mobilePhone, setMobilePhone] = useState<string>("")
    const [firstNameMerge, setFirstNameMerge] = useState<string>("")
    const [lastNameMerge, setLastNameMerge] = useState<string>("")
    const [passportMerge, setPassportMerge] = useState<string>("")
    const [mobilePhoneMerge, setMobilePhoneMerge] = useState<string>("")
    const [isLikeGuestName, setIsLikeGuestName] = useState<boolean>(true)
    const [dataSearch, setDataSearch] = useState<any[]>([])
    const [dataSearchMerge, setDataSearchMerge] = useState<any[]>([])
    const [pagination, setPagination] = useState({ CurrentPage: 1, PageSize: pageSize, TotalCount: 5 })
    const [paginationFooter, setPaginationFooter] = useState({ CurrentPage: 1, PageSize: pageSize, TotalCount: 5 })
    const [dataTableHistory, setDataTableHistory] = useState<any>([])
    const [dataTableHistoryYear, setDataTableHistoryYear] = useState<any>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)
    const [isLoadingMerge, setIsLoadingMerge] = useState<boolean>(false)
    const [isLoadingHistoryYear, setIsLoadingHistoryYear] = useState<boolean>(false)
    const [visibleSearchGuest, setVisibleSearchGuest] = useState<boolean>(false)
    const [checkSearchMerge, setcheckSearchMerge] = useState<boolean>(false)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    const [selectedRowsMerge, setSelectedRowsMerge] = useState<any[]>([])
    const [checkGuest] = useState<boolean>(true)

    useEffect(() => {
        const newPageSize = Utils.getPageSize(size);
        setPageSize(newPageSize);
        //eslint-disable-next-line
    }, [size])

    useEffect(() => {
        dispatch(setRoomTypeLoadPage({hotelGuid: hotelId}))
    },[])

    useEffect(() => {
        handleHistory()
    }, [checkSearchMerge])
    
    const handleHistory = async () => {
        setIsLoadingHistory(true)
        const data = {
            hotelGuid: hotelId,
            profiles: {
                phone: mobilePhone,
                passport: passport,
                firstName: firstName,
                guestName: lastName
            },
            isExactly: isLikeGuestName,
            pageNumber: pagination.CurrentPage,
            pageSize: pagination.PageSize
        }
        let dataTable: any[] = [], res: any = {}
        if (!firstName && !lastName && !passport && !mobilePhone) {
            res = await GuestProfileService.getHistoryGuest({ ...data, profileIds: [], getAll: false })
            dataTable = await convertResToDataHistory(res.dataSearch)
        } else {
            res = await GuestProfileService.getHistoryGuestPRF(data, false)
            dataTable = await convertResToDataHistory(res.dataSearch)
        }
        setDataSearch(res.dataSearch)
        setPagination(res.resPage)
        setDataTableHistory(dataTable)
        setIsLoadingHistory(false)
    }

    const convertResToDataHistory = async (res: any) => {
        const dataTable = await Promise.all(
            res.map(async (data: any, idx: number) => {
                const arrDate = Utils.formatDateString(data.arrivalDate)
                const room = data?.transactRoomsGroup?.roomName
                const fullName = await getGuestFullName(data.guestId)
                const depDate = Utils.formatDateString(data.departureDate)
                const status = data.transactRoomsGroup.status
                const roomTypeName: any = roomType.find((item) => item.guid === data.roomType)
                const rate = data.rate
                const d = {
                    key: data.id,
                    guestId: data.guestId,
                    arrival: <div className="text-center font-base">{arrDate}</div>,
                    room: <div className="text-center font-base">{room}</div>,
                    fullName: <div className="text-center font-base">{fullName}</div>,
                    rate: <div className="text-center font-base">{rate}</div>,
                    departure: <div className="text-center font-base">{depDate}</div>,
                    status: <div className="text-center font-base">{status}</div>,
                    roomType: <div className="text-center font-base">{roomTypeName?.ten}</div>,
                }
                return d
            }))
        return dataTable
    }

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            const lstSelectedData: any[] = []
            selectedRows.forEach((row: any) => {
                const tmp = dataSearch.find(d => d.guestId === row.guestId)
                tmp && lstSelectedData.push(tmp)
            })
            setSelectedRows(lstSelectedData)
        }
    }

    const getGuestFullName = async (id: string) => {
        const res = await GuestProfileService.getGuestProfileByGuid(id)
        return `${res?.firstName} ${res?.guestName}`
    }

    const onPagination = async (pageNumber: number, pageSize: any) => {
        const data = {
            hotelGuid: hotelId,
            pageNumber: pageNumber,
            pageSize: pageSize ? parseInt(pageSize) : 2
        }
        const res = await GuestProfileService.getHistoryGuest(data)
        const dataTable = await convertResToDataHistory(res.dataSearch)
        setDataSearch(res.dataSearch)
        setPagination(res.resPage)
        setDataTableHistory(dataTable)
        setIsLoadingHistory(false)
    }

    const handleHistoryYear = async () => {
        setIsLoadingHistoryYear(true)
        const listProfiles = selectedRows.map((row: any) => row.guestId)
        if (selectedRows.length > 0) {
            const data: GuestHistoryYear = {
                hotelGuid: hotelId,
                listProfiles: listProfiles,
                pageNumber: paginationFooter.CurrentPage,
                pageSize: paginationFooter.PageSize
            }
            const res = await GuestProfileService.getHistoryYearGuest(data)
            const dataTable = await convertResToDataHistoryYear(res.dataSearch)
            setPaginationFooter(res.resPage)
            setDataTableHistoryYear(dataTable)
        }
        setIsLoadingHistoryYear(false)
    }

    const convertResToDataHistoryYear = async (res: any) => {
        const dataTable = await Promise.all(res.map(async (data: any, idx: number) => {
            const d = {
                key: idx + 1,
                year: <div className="text-center font-base">{data.year}</div>,
                nights: <div className="text-center font-base">{data.nights}</div>,
                revenue: <div className="text-center font-base">{data.revenue}</div>,
                room: <div className="text-center font-base">{data.room}</div>,
                fbRevenue: <div className="text-center font-base">{data.fbRevenue}</div>,
                otherRoom: <div className="text-center font-base">{data.otherRoom}</div>
            }
            return d
        }))
        return dataTable
    }

    const onPaginationFooter = async (pageNumber: number, pageSize: any) => {
        setIsLoadingHistoryYear(true)
        if (selectedRows.length > 0) {
            const data = {
                hotelGuid: hotelId,
                listProfiles: [selectedRows[0].guestId],
                pageNumber: pageNumber,
                pageSize: pageSize ? parseInt(pageSize) : 2
            }
            const res = await GuestProfileService.getHistoryYearGuest(data)
            const dataTable = await convertResToDataHistoryYear(res.dataSearch)
            setPaginationFooter(res.resPage)
            setDataTableHistoryYear(dataTable)
        }
        setIsLoadingHistory(false)
    }

    const handleOpenProfile = () => {
        (selectedRows.length > 0) && guestGuid(selectedRows[0].guestId)
        setVisibleMergeGuest(false)
        setIsDisableEdit(true)
        setVisibleNewGuestProfile(true)
    }

    const handleMerge = async () => { 
        setVisibleSearchGuest(true)
        setIsLoadingMerge(true)
        const data = {
            hotelGuid: hotelId,
            profiles: {
                phone: mobilePhoneMerge,
                passport: passportMerge,
                firstName: firstNameMerge,
                guestName: lastNameMerge
            },
            pageNumber: filter.pageNumber,
            pageSize: filter.pageSize
        }
        let dataTable: any[] = [], res: any = {}
        if (!firstNameMerge && !lastNameMerge && !passportMerge && !mobilePhoneMerge) {
            res = await GuestProfileService.getHistoryGuest({ ...data, profileIds: [], getAll: true })
            dataTable = await convertResToDataHistory(res.dataSearch)
        } else {
            res = await GuestProfileService.getHistoryGuestPRF(data, true)
            dataTable = await convertResToDataHistory(res.dataSearch)
        }
        setIsLoadingMerge(false)
        setDataSearchMerge(dataTable)
        setTotalItem(res.resPage.TotalCount)
    }

    const handleOk = async () => {
        setVisibleMergeGuest(false)
    }

    const onCloseSearchGuest = () => {
        setcheckSearchMerge(!checkSearchMerge)
        setVisibleSearchGuest(false);
        // if (companyGuidBeUpdated !== "") {
        //     setCompanyGuidBeUpdated("")
        // }
        // if (companyInfoByGuid !== null) {
        //     setCompanyInfoByGuid(null)
        // }
    }
    const handleSubmitSearchGuest = async () => {
        if(selectedRowsMerge.length === 1){
            const res = await GuestProfileService.editGuestProfile(selectedRows[0].guestId, selectedRowsMerge[0].guestId)
            if(res){
                openNotification(NotificationStatus.Success, "Success", "Merge Profile Success");
                setVisibleSearchGuest(false);
            }else 
                openNotification(NotificationStatus.Error, "Failure", "Merge Profile Fail");
        }else{
            openNotification(NotificationStatus.Warning, "Invalid", "Select only one guest");
        }
    }

    return (
        <>
            <CModel
                visible={visibleMergeGuest}
                title={title}
                width="913px"
                className={classes.modal}
                isShowFooter={false}
                isLoading={true}
                onOk={handleOk}
                zIndex={30}
                onCancel={() => setVisibleMergeGuest(false)}
                content={
                    <>
                        <div className="grid grid-cols-12 gap-4 text-xs font-bold leading-7">
                            <div className="col-span-6">
                                <div className="grid grid-cols-12 !pb-4 gap-2 text-xs font-bold leading-7">
                                    <div className=" col-span-9">
                                        <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.firstname")}:</p>
                                        <Controller
                                            render={({ onChange, value }) =>
                                                <Input
                                                    className={`${classes.input} w-full`}
                                                    style={{ background: "#F5F6F7" }}
                                                    onChange={(e: any) => {
                                                        onChange(e)
                                                        setFirstName(e.target.value)
                                                    }}
                                                    defaultValue={firstName}
                                                    value={value}
                                                    name="firstName"
                                                    required
                                                />
                                            }
                                            defaultValue=""
                                            value={firstName}
                                            name="FirstName"
                                            control={control}
                                        />
                                    </div>
                                    <div className=" col-span-3">
                                        <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.title")}:</p>
                                        <Controller
                                            render={({ onChange, value }) =>
                                                <Select
                                                    className={`${classes.selectBackground} w-full !rounded-md`}
                                                    onChange={(e) => setGuestTitle(e)}
                                                    defaultValue={guestTitle}
                                                >
                                                    <Option value="Mr.">{t("BOOKING.RESERVATION.EDITRESERVATION.mr")}</Option>
                                                    <Option value="Mrs">{t("BOOKING.RESERVATION.EDITRESERVATION.mrs")}</Option>
                                                    <Option value="Ms">{t("BOOKING.RESERVATION.EDITRESERVATION.ms")}</Option>
                                                </Select>
                                            }
                                            defaultValue=""
                                            value={guestTitle}
                                            name="GuestTitle"
                                            control={control}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className=" col-span-6">
                                <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.FORMGUESTPROFILE.passport")}:</p>
                                <Controller
                                    render={({ onChange, value }) =>
                                        <Input
                                            className={`${classes.input} w-full`}
                                            style={{ background: "#F5F6F7" }}
                                            onChange={(e: any) => {
                                                onChange(e)
                                                setPassport(e.target.value)
                                            }}
                                            defaultValue={passport}
                                            value={value}
                                            name="passport"
                                            required
                                        />
                                    }
                                    defaultValue=""
                                    value={passport}
                                    name="Passport"
                                    control={control}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 !pb-4 gap-4 text-xs font-bold leading-7">
                            <div className=" col-span-6">
                                <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.lastname")}:</p>
                                <Controller
                                    render={({ onChange, value }) =>
                                        <Input
                                            className={`${classes.input} w-full`}
                                            style={{ background: "#F5F6F7" }}
                                            onChange={(e: any) => {
                                                onChange(e)
                                                setLastName(e.target.value)
                                            }}
                                            defaultValue={lastName}
                                            value={value}
                                            name="lastName"
                                            required
                                        />
                                    }
                                    defaultValue=""
                                    value={lastName}
                                    name="LastName"
                                    control={control}
                                />
                            </div>
                            <div className=" col-span-6">
                                <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.mobilePhone")}:</p>
                                <Controller
                                    render={({ onChange, value }) =>
                                        <Input
                                            className={`${classes.input} w-full`}
                                            style={{ background: "#F5F6F7" }}
                                            onChange={(e: any) => {
                                                onChange(e)
                                                setMobilePhone(e.target.value)
                                            }}
                                            defaultValue={mobilePhone}
                                            value={value}
                                            name="mobilePhone"
                                            required
                                        />
                                    }
                                    defaultValue=""
                                    value={mobilePhone}
                                    name="MobilePhone"
                                    control={control}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 !pb-4 gap-4 text-xs font-bold leading-7 mt-2">
                            <div className=" col-span-9">
                                <CLoading visible={isLoadingHistory}>
                                    <Table
                                        dataSource={dataTableHistory}
                                        columns={columnsTable}
                                        className={classes.table}
                                        rowSelection={{ ...rowSelection, checkStrictly: false }}
                                        pagination={{
                                            size: "default",
                                            current: pagination.CurrentPage,
                                            pageSize: pagination.PageSize,
                                            total: pagination.TotalCount,
                                            showSizeChanger: false,
                                            onChange: (page, pageSize) => onPagination(page, pageSize)
                                        }}
                                    />
                                </CLoading>
                            </div>
                            <CButtonRight
                                handleHistory={handleHistory}
                                handleHistoryYear={handleHistoryYear}
                                handleOpenProfile={handleOpenProfile}
                                handleMerge={handleMerge}
                                selectedRow={selectedRows}
                                checkGuest={checkGuest}
                            >
                                <Controller
                                    render={({ onChange, onBlur, value, name, ref }) => (
                                        <Checkbox
                                            style={{ display: "flex", margin: "10px 8px" }}
                                            checked={isLikeGuestName}
                                            className={`flex-row items-center font-semibold`}
                                            defaultChecked={true}
                                            onChange={(e) => {
                                                onChange(e.target.checked)
                                                setIsLikeGuestName(e.target.checked)
                                            }}
                                        >
                                            {t("BOOKING.RESERVATION.EDITRESERVATION.likeGuestName")}
                                        </Checkbox>
                                    )}
                                    name="IsLikeGuestName"
                                    defaultValue={isLikeGuestName}
                                    control={control}
                                />
                            </CButtonRight>
                        </div>
                        <div className="grid grid-cols-12 !pb-4 gap-4 text-xs font-bold leading-7 mt-2">
                            <div className=" col-span-12">
                                <CLoading visible={isLoadingHistoryYear}>
                                    <Table
                                        dataSource={dataTableHistoryYear}
                                        columns={columnsFooterTable}
                                        className={classes.table}
                                        pagination={{
                                            size: "default",
                                            current: paginationFooter.CurrentPage,
                                            pageSize: paginationFooter.PageSize,
                                            total: paginationFooter.TotalCount,
                                            showSizeChanger: false,
                                            onChange: (page, pageSize) => onPaginationFooter(page, pageSize)
                                        }}
                                    />
                                </CLoading>
                            </div>
                        </div>
                        <CButtonFooter setVisible={setVisibleMergeGuest} />
                    </>
                }
            />
            <DrawerProfile
                visible={visibleSearchGuest}
                title="Search Guest Profile"
                propsOnChange={onCloseSearchGuest}
                zIndex={100}
                customFooter={
                    <div className="flex justify-between m-auto" style={{ width: 951 }}>
                        <div className={"footer-left"} />
                        <div className={"footer-right gap-1"}>
                            <Button className={`${classes.buttonFooterRight} !rounded-md`}
                                onClick={onCloseSearchGuest}
                                style={{ color: "#F74352", border: "1px solid #F74352" }}>{t("BOOKING.RESERVATION.cancel")}</Button>
                            <Button  className={`${classes.buttonFooterRight} !rounded-md`} type="primary" ghost>
                                Show Detail</Button>
                            <Button form={"hook-form-company"} htmlType='submit'
                                // loading={btnLoadingGP}
                                className={`${classes.buttonFooterRight} !rounded-md`}
                                style={{ background: "#1A87D7", color: "white" }}
                                onClick={handleSubmitSearchGuest}
                            >Select</Button>
                        </div>
                    </div>
                }
            >
                <div className="grid mx-auto grid-cols-12 gap-4 mb-2">
                    <div className="col-span-3 order-1 "> 
                        <CFormSearch firstName={firstNameMerge} setFirstName={setFirstNameMerge}
                            passport={passportMerge} setPassport={setPassportMerge}
                            lastName={lastNameMerge} setLastName={setLastNameMerge}
                            mobilePhone={mobilePhoneMerge} setMobilePhone={setMobilePhoneMerge}
                            handleMerge={handleMerge} countTable={totalItem}
                        />
                    </div>
                    <div className={`col-span-9 order-3 `}> 
                        <CLoading isLoadingHistory={isLoadingMerge}>
                            <CTableGuestProfile dataTable={dataSearchMerge} totalItem={totalItem}
                                filter={filter} setFilter={setFilter} handleMerge={handleMerge}
                                selectedRow={selectedRows} setSelectedRowsMerge={setSelectedRowsMerge}
                            />
                        </CLoading>
                    </div>
                </div>
            </DrawerProfile>
        </>
    )
}

export default CModalMergeGuests