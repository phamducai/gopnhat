/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import CModel from 'components/CModal';
import { Controller, useForm } from 'react-hook-form';
import { useStyleTheme } from 'theme';
import { editProfilesStyle } from './styles/editProfiles'
import { Select, Table, Checkbox, Divider, DatePicker } from 'antd';
import { columnsTable, columnsFooterTable } from './CModalMerge/TableColumns';
import CButtonFooter from './CModalMerge/CButtonFooter'
import CButtonRight from './CModalMerge/CButtonRight'
import { useSelectorRoot, useDispatchRoot } from 'redux/store';
import { companyProfilesFilterByInputRequest } from "redux/controller/reservation.slice"
import { useTranslation } from 'react-i18next';
import GuestProfileService from 'services/booking/guestprofile.service'
import Utils from 'common/utils'
import CLoading from 'components/CLoading'
import { CompanyHistoryYear } from "common/model-rsvn"
import useWindowSize from 'hooks/useWindowSize';
import CompanyService from 'services/booking/company.service';
import openNotification from 'components/CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { CompanyProfile } from 'common/model-profile';

interface CModalMergeProps {
    title: string
    visibleMergeCompany: boolean;
    setVisibleMergeCompany: React.Dispatch<React.SetStateAction<boolean>>
    companyGuid(guid: string): void
    setVisibleNewCompanyProfile: React.Dispatch<React.SetStateAction<boolean>>
    setIsDisableEdit: React.Dispatch<React.SetStateAction<boolean>>
}

const CModalMergeCompanies = (props: CModalMergeProps): JSX.Element => {
    const { title, visibleMergeCompany, setVisibleMergeCompany, companyGuid, setVisibleNewCompanyProfile, setIsDisableEdit } = props
    const classes = useStyleTheme(editProfilesStyle);
    const Option = Select.Option
    const { t } = useTranslation("translation")
    const { hotelId } = useSelectorRoot(state => state.app)
    const { filteredCompanyProfile } = useSelectorRoot(state => state.rsvn);
    const { handleSubmit, control, getValues } = useForm();
    const dispatch = useDispatchRoot();
    const typingTimeoutRef = useRef(0);
    const size = useWindowSize();
    
    const [pageSize, setPageSize] = useState<number>(Utils.getPageSizeAssign(size));
    const [isMerge, setIsMerge] = useState<boolean>(false)
    const [company, setCompany] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [mergeToCompany, setMergeToCompany] = useState<string>("")
    const [fromDate, setFromDate] = useState<Date>()
    const [toDate, setToDate] = useState<Date>()
    const [dataSearch, setDataSearch] = useState<any[]>([])
    const [pagination, setPagination] = useState({ CurrentPage: 1, PageSize: pageSize, TotalCount: 5 })
    const [paginationFooter, setPaginationFooter] = useState({ CurrentPage: 1, PageSize: pageSize, TotalCount: 5 })
    const [dataTableHistory, setDataTableHistory] = useState<any>([])
    const [dataTableHistoryYear, setDataTableHistoryYear] = useState<any>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)
    const [isLoadingHistoryYear, setIsLoadingHistoryYear] = useState<boolean>(false)
    const [checkGuest] = useState<boolean>(false)
    const [selectedRows, setSelectedRows] = useState<any[]>([])
    
    useEffect(() => {
        const newPageSize = Utils.getPageSize(size);
        setPageSize(newPageSize);
        //eslint-disable-next-line
    }, [size])
    
    useEffect(() => {
        if(filteredCompanyProfile){
            filteredCompanyProfile[0]?.guid && setCompany(filteredCompanyProfile[0]?.guid)
            filteredCompanyProfile[0]?.ten && setCompanyName(filteredCompanyProfile[0]?.ten)    
        } 
    }, [filteredCompanyProfile])

    useEffect(() => {
        company !== "" && handleHistory()
    },[company])
    
    const onSearch = (val: string | any[]) => {
        val = val.length > 0 ? val : "g"
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

    const renderSelect = (data:  CompanyProfile[]) => {
        return data?.map((item) => {
            return (
                <Option value={item.guid} key={item.id}>{item.ten}</Option>
            )
        })
    }

    const handleOk = async () => {
        setVisibleMergeCompany(false);
    };

    const onSubmit = () => { console.log() }

    const handleHistory = async () => {
        setIsLoadingHistory(true)
        let data = {
            hotelGuid: hotelId,
            companyAgentGuid: company,
            arrivalDates: [fromDate, toDate],
            pageNumber: pagination.CurrentPage,
            pageSize: pagination.PageSize,
            profileIds: [],
        }
        if(fromDate && toDate) {
            data = {...data, arrivalDates: [fromDate, toDate]}
        }else{
            data = {...data, arrivalDates: []}
        }
        const res = await GuestProfileService.getHistoryGuest(data)
        const dataTable = await convertResToDataHistory(res.dataSearch)
        setDataSearch(res.dataSearch)
        setPagination(res.resPage)
        setDataTableHistory(dataTable)
        setIsLoadingHistory(false)
    }

    // const handleSearch = async () => {
    // }

    const convertResToDataHistory = async (res: any) => {
        const dataTable = await Promise.all(res.map(async (data: any, idx: number) => {
            const arrDate = Utils.formatDateString(data.arrivalDate)
            const room = data.transactRoomsGroup.roomName
            const fullName = await getGuestFullName(data.guestId)
            const depDate = Utils.formatDateString(data.departureDate)
            const rate = data.rate
            const d = {
                key: data.guestId,
                arrival: <div className="text-center font-base">{arrDate}</div>,
                room: <div className="text-center font-base">{room}</div>,
                fullName: <div className="text-center font-base">{fullName}</div>,
                rate: <div className="text-center font-base">{rate}</div>,
                departure: <div className="text-center font-base">{depDate}</div>
            }
            return d
        }))
        return dataTable
    }

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            const lstSelectedData: any[] = []
            selectedRows.forEach((row: any) => {
                const tmp = dataSearch.find(d => d.guestId === row.key)
                tmp && lstSelectedData.push(tmp)
                console.log(tmp)
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
            companyAgentGuid: company,
            arrivalDates: [fromDate, toDate],
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
        const data: CompanyHistoryYear = {
            hotelGuid: hotelId,
            listCompanyOrAgent: [company],
            pageNumber: paginationFooter.CurrentPage,
            pageSize: paginationFooter.PageSize
        }
        const res = await GuestProfileService.getHistoryYearCompany(data)
        const dataTable = await convertResToDataHistoryYear(res.dataSearch)
        setPaginationFooter(res.resPage)
        setDataTableHistoryYear(dataTable)
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
        const data = {
            hotelGuid: hotelId,
            listCompanyOrAgent: [company],
            pageNumber: pageNumber,
            pageSize: pageSize ? parseInt(pageSize) : 2
        }
        const res = await GuestProfileService.getHistoryYearCompany(data)
        const dataTable = await convertResToDataHistoryYear(res.dataSearch)
        setPaginationFooter(res.resPage)
        setDataTableHistoryYear(dataTable)
        setIsLoadingHistory(false)
    }

    const handleOpenProfile = () => {
        companyGuid(company)
        setVisibleMergeCompany(false)
        setIsDisableEdit(true)
        setVisibleNewCompanyProfile(true)
    }
    const handleMerge = async () => { 
        if(mergeToCompany && isMerge)
            await CompanyService.mergeCompanyProfile(company, mergeToCompany)
        else
            openNotification(NotificationStatus.Warning, "Invalid", "Choose company merge");
    }

    useEffect(() => {
        if (filteredCompanyProfile.length === 0) {
            dispatch(companyProfilesFilterByInputRequest({
                hotelGuid: hotelId,
                input: 'g'
            }))
        }
    })

    return (
        <CModel
            visible={visibleMergeCompany}
            title={title}
            width="913px"
            className={classes.modal}
            isShowFooter={false}
            onOk={handleOk}
            onCancel={() => setVisibleMergeCompany(false)}
            content={
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 !pb-4 gap-4 text-xs font-bold leading-7">
                        <div className=" col-span-9">
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.companyOrAgent")}:</p>
                            <Controller
                                name="Company"
                                control={control}
                                requied
                                render={({ onChange, value, ref }) =>
                                    <Select className={`${classes.selectBackground} w-full !rounded-md`}
                                        value={getValues("Company") || undefined}
                                        showSearch
                                        onSearch={onSearch}
                                        filterOption={false}
                                        defaultValue={companyName === "" ? filteredCompanyProfile[0]?.ten : companyName}
                                        defaultActiveFirstOption={true}
                                        onChange={(e) => {
                                            onChange(e)
                                            setCompany(e)
                                        }}
                                    >
                                        {filteredCompanyProfile.length ? renderSelect(filteredCompanyProfile) : ""}
                                    </Select>
                                }
                            />
                        </div>
                        <div className="col-span-3 pl-2">
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.dateFrom")}:</p>
                            <Controller
                                name="dateArrival"
                                defaultValue={fromDate}
                                control={control} render={({ onChange, value }) => (
                                    <DatePicker
                                        onClick={() => onChange({ ...value, isOpen: false })}
                                        placeholder="DD/MM/YYYY"
                                        className={classes.datePicker}
                                        onChange={(date: any) => {
                                            setFromDate(date._d)
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-12 !pb-4 gap-4 text-xs font-bold leading-7">
                        <div className=" col-span-9">
                            <p className="m-0">
                                <Controller
                                    render={({ onChange, onBlur, value, name, ref }) => (
                                        <Checkbox
                                            style={{ display: "flex" }}
                                            checked={isMerge}
                                            className={`flex-row items-center font-semibold`}
                                            defaultChecked={false}
                                            onChange={(e) => {
                                                onChange(e.target.checked)
                                                setIsMerge(e.target.checked)
                                            }}
                                        >
                                            <span className="text-xs">{t("BOOKING.RESERVATION.EDITRESERVATION.mergeToCompanyAgent")}:</span>
                                        </Checkbox>
                                    )}
                                    name="IsMerge"
                                    defaultValue={isMerge}
                                    control={control}
                                />
                            </p>
                            <Controller
                                name="MergeToCompany"
                                control={control}
                                defaultValue=""
                                value={mergeToCompany}
                                render={({ onChange, value, ref }) =>
                                    <Select
                                        className={`${classes.selectBackground} w-full !rounded-md`}
                                        style={isMerge ? { opacity: 1, transition: "0.5s" } : { opacity: 0.5, transition: "0.5s" }}
                                        value={getValues("MergeToCompany") || undefined}
                                        showSearch
                                        onSearch={onSearch}
                                        filterOption={false}
                                        defaultValue={mergeToCompany}
                                        disabled={!isMerge}
                                        onChange={(e) => {
                                            onChange(e)
                                            setMergeToCompany(e)
                                        }}
                                    >
                                        {filteredCompanyProfile.length ? renderSelect(filteredCompanyProfile) : ""}
                                    </Select>
                                }
                            />
                        </div>
                        <div className="col-span-3 pl-2">
                            <p className="m-0 font-base font-bold">{t("BOOKING.RESERVATION.EDITRESERVATION.dateTo")}:</p>
                            <Controller
                                name="dateArrival"
                                control={control} render={({ onChange, value }) => (
                                    <DatePicker
                                        onClick={() => onChange({ ...value, isOpen: false })}
                                        placeholder="DD/MM/YYYY"
                                        // defaultValue={toDate ? new Date(toDate) : addDays(new Date(), 1)}
                                        className={classes.datePicker}
                                        onChange={(date: any) => {
                                            setToDate(date._d)
                                        }}
                                    />
                                )}
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
                            <div className="mx-2"><Divider /></div>
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
                    <CButtonFooter setVisible={setVisibleMergeCompany} />
                </form>
            }
        />
    );
}

export default CModalMergeCompanies;