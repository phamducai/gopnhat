/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { useStyleTheme } from 'theme'
import { Button, Pagination, Table } from "antd";
import { styleCTable } from 'components/CStyleTable';
import { useTranslation } from 'react-i18next';
import { ColumnProps } from "antd/lib/table";
import CLoading from 'components/CLoading';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { ITableRunNight } from 'common/end-of-day/model-runNight';
import RunNightService from 'services/report/RunNightService';
import { styleCashier } from '../styles/styleCashier';
import { IQueryParamRunNight } from 'common/model-booking';
import { setSearchRunNightSuccess } from 'redux/controller/cashier/folio/folio.slice';
import { setShowStat } from 'redux/controller';
import DrawerInfo from "pages/main/booking/reservation/drawerInfo";

interface Props{
    queryDataRunNight: IQueryParamRunNight,
    setQueryDataRunNight: any,
    isLoadingTable: any,
    setLoadingTableRunNight: any,
    setIsLoadingTable: any
}
const TableRunNight = ({ queryDataRunNight, setQueryDataRunNight, isLoadingTable, setLoadingTableRunNight, setIsLoadingTable }: Props): JSX.Element => {
    const classes = useStyleTheme(styleCTable);
    const classesTable = useStyleTheme(styleCashier);
    const { t } = useTranslation('translation');

    const dispatch = useDispatchRoot();
    const { hotelId, numberOfRooms } = useSelectorRoot(state => state.app);
    const { dataSearchResults, queryParam, inforPage} = useSelectorRoot(state => state.folio);
    const { isShowStat, loading } = useSelectorRoot(state => state.booking);
    const [dataTable, setDataTable] = useState<ITableRunNight[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>();
    const columns: ColumnProps<ITableRunNight>[] = [
        {
            title: "Full name",
            dataIndex: "fullName",
            className: "text-center",
        },
        {
            title: "Room",
            dataIndex: "room",
            className: "text-center"
        },
        {
            title: "Rate",
            dataIndex: "rate"
        },
        {
            title: "Room type",
            dataIndex: "roomType",
            className: "text-center"
        },
        {
            title: "Code",
            dataIndex: "code",
            className: "text-center",
            // eslint-disable-next-line react/display-name
            render: (text) => <div className='whitespace-nowrap'>{text}</div>
        },
        {
            title: "Arrival",
            dataIndex: "arrival",
            className: "text-center"
        },
        {
            title: "Departure",
            dataIndex: "departure",
            className: "text-center"
        },
        {
            title: "Group code",
            dataIndex: "groupCode",
            className: "text-center"
        },
        {
            title: "RSVN No.",
            dataIndex: "rsvnNo",
            className: "text-center"
        },
        {
            title: "Status",
            dataIndex: "status",
            className: "text-center"
        },
        {
            title: "Comments",
            dataIndex: "comments",
            className: "text-center text-overflow",
            // eslint-disable-next-line react/display-name
            render: (text) => <div className='whitespace-nowrap truncate'>{text}</div>
            
        },
        {
            title: "Market",
            dataIndex: "market",
            className: "text-center"
        },
        {
            title: "Source",
            dataIndex: "sources",
            className: "text-center"
        },
        {
            title: "Chanel",
            dataIndex: "chanels",
            className: "text-center"
        },
        {
            title: "Special",
            dataIndex: "specials",
            className: "text-center"
        },
        {
            title: "Package",
            dataIndex: "chanels",
            className: "text-center"
        }
    ]
    React.useEffect(() => {
        const fetchService = async () => {
            const resp = await RunNightService.mapDataTableSearch(hotelId,dataSearchResults, queryParam);
            setDataTable(resp);
        }
        
        isLoadingTable && fetchService();
    },[dataSearchResults, hotelId, isLoadingTable, queryParam])
    const onPagination = async (pageNumber: number, pageSize: any) => {
        setLoadingTableRunNight(true);
        setIsLoadingTable(true);
        const queryParamsDTO: IQueryParamRunNight = {
            ...queryDataRunNight,
            pageNumber: pageNumber,
            pageSize: pageSize
        }
        const resp = await RunNightService.getInfoNightByQueryParam(queryParamsDTO, numberOfRooms);
        if(resp.queryParamsReq || resp.inforPage){
            setQueryDataRunNight(resp.queryParamsReq);
            dispatch(setSearchRunNightSuccess({ 
                queryParam : resp.queryParam, 
                dataSearchResults: resp.dataSearchResults,
                inforPage: resp.inforPage
            }));
        }
        setIsLoadingTable(false);
        setLoadingTableRunNight(false);
    }
    const handleShowStat = (e: any, record: any) => {
        const tmp = dataSearchResults?.find(x => x.guid === record.guid)
        tmp && setSelectedRow(tmp)
        dispatch(setShowStat(true))
    }
    return (
        <React.Fragment>
            <CLoading visible={isLoadingTable}>
                <Table
                    columns={columns}
                    style={{ height: "calc(100vh - 230px)" }}
                    locale={{
                        emptyText: <div
                            className="flex items-center justify-center"
                            style={{ height: "calc(100vh - 200px)" }}>{t("BOOKING.SEARCHVALUE.noData")}</div>
                    }}
                    className={`${classes.table} m-4`}
                    pagination={false}
                    scroll={{ x: 2000, y: 700 }}
                    dataSource={dataTable}
                    rowKey={"guid"}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: e => handleShowStat(e, record),
                        };
                    }}
                    rowClassName={(record, index: number) => {
                        return record.parentMeGuid !== 0 ? classesTable.trColorGuest : classesTable.trColorGuestMain;
                    }}
                />
                
            </CLoading>
            <div className={`col-span-12 flex justify-end pr-1 m-4`}>
                <Pagination
                    size="default"
                    showQuickJumper={{ goButton: <Button>{t("BOOKING.SEARCHVALUE.ok")}</Button> }}
                    showSizeChanger
                    current={inforPage.CurrentPage}
                    pageSize={inforPage.PageSize}
                    total={inforPage.TotalCount}
                    pageSizeOptions={["10", "20", "50"]}
                    onChange={(page, pageSize) => onPagination(page, pageSize)}
                    showTotal={total => `Total ${total} item`}
                />

            </div>
            {
                isShowStat &&
                <DrawerInfo
                    loading={loading}
                    visible={isShowStat}
                    transactStat={selectedRow}
                />
            }
        </React.Fragment>
    )
}
export default React.memo(TableRunNight);