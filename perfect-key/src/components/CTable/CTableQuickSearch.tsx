/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd';
import { ColumnProps } from "antd/lib/table";
import clsx from "clsx";
import { ITableMoveFolio } from "common/cashier/model-folio";
import Utils from 'common/utils';
import CLoading from "components/CLoading";
import { styleCashier } from "pages/main/cashier/styles/styleCashier";
import React, { useEffect, useState } from "react";
import { useSelectorRoot } from "redux/store";
import { useStyleTheme } from "theme";

interface Props {
    height: number,
    guestGuid: string,
    handleSelectGuest(record: ITableMoveFolio[]): void,
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
    setPageSize: React.Dispatch<React.SetStateAction<number>>
}
const CTableQuickSearch = ({ height, guestGuid, setPageNumber, handleSelectGuest, setPageSize }: Props): JSX.Element => {
    const classesTable = useStyleTheme(styleCashier);
    const {dataSearchResults, inforPage, loadingSearch } = useSelectorRoot(state => state.booking);

    const [dataTable , setDataTable] = useState<ITableMoveFolio[]>([]);

    const columnTable: ColumnProps<ITableMoveFolio>[] = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'guid',
            align: "left"
        },
        {
            title: 'Arrival',
            dataIndex: 'arrivalDate',
            key: 'arrivalDate',
            className: "text-center"
        },
        {
            title: 'Departure',
            dataIndex: `departureDate`,
            key: 'departureDate',
            className: "text-center"
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            className: "text-center",
            render:(text, record, index) => Utils.formatNumber(text)
        }
    ];

    useEffect(() => {
        try {
            const convertData: ITableMoveFolio[] = []
            dataSearchResults.forEach((element: any, key: number) => {
                if(guestGuid !== element.guestId){
                    const data: ITableMoveFolio = {
                        fullName: element.fullName.name,
                        arrivalDate: element.arrival.name,
                        departureDate: element.departure.name,
                        rate: element.rate.name,
                        guid: element.guid,
                        guestId: element.guestId,
                        roomName: element.room.name,
                        parentMeGuid: element.parentMeGuid,
                    }
                    convertData.push(data)
                }
            })
            setDataTable(convertData)
        } catch (error) {
            console.log(error);
        }
    }, [dataSearchResults, guestGuid])
    
    const changePagingation = (page: number, pageSize: number | undefined) => {
        setPageNumber(page)
        pageSize && setPageSize(pageSize)
    }
    return (
        <CLoading visible={loadingSearch}>
            <Table className={clsx(classesTable.table)} style={{ height: `calc(100vh - ${height}px)` }}
                rowKey={"guid"}
                locale={{
                    emptyText:
                    <div
                        className="flex items-center justify-center"
                        style={{ height: "calc(100vh - 600px)" }}>No data</div>
                }}
                pagination={{hideOnSinglePage: true, total: inforPage.TotalCount, current: inforPage.CurrentPage, pageSize: inforPage.PageSize, onChange: (page, pageSize) => changePagingation(page, pageSize) }}
                columns={columnTable}
                dataSource={dataTable}
                rowSelection={{
                    onChange: (selectedRowKeys: React.Key[], selectedRows: ITableMoveFolio[]) => {
                        handleSelectGuest(selectedRows)
                    },
                    type: "radio"
                }}
                scroll={{ y: 500 }}
                rowClassName={(record, index: number) => {
                    return record.parentMeGuid ? classesTable.trColorGuest : classesTable.trColorGuestMain;
                }}
            />
        </CLoading>
    )
}
export default React.memo(CTableQuickSearch);