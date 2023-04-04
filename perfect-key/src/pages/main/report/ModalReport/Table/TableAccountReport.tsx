/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd';
import { ColumnProps } from "antd/lib/table";
import clsx from "clsx";
import { ITableFixCharge } from 'common/model-booking';
import CLoading from "components/CLoading";
import { styleCashier } from "pages/main/cashier/styles/styleCashier";
import React from "react";
import { useSelectorRoot } from "redux/store";
import { useStyleTheme } from "theme";

interface Props {
    height: number,
    setPageNumber?: React.Dispatch<React.SetStateAction<number>>
    setPageSize?: React.Dispatch<React.SetStateAction<number>>,
    dataTable: ITableFixCharge[],
    handleSelect(record: ITableFixCharge[],keys:React.Key[]): void,
    selectedRowsArray:React.Key[],
}
const TableAccountReport = ({ height, setPageNumber, setPageSize, dataTable, handleSelect, selectedRowsArray }: Props): JSX.Element => {
    const classesTable = useStyleTheme(styleCashier);
    const {loadingSearch } = useSelectorRoot(state => state.booking);

    const columnTable: ColumnProps<ITableFixCharge>[] = [
        {
            title: 'Code',
            dataIndex: 'ma',
            key: 'guid',
            align: "left",
            width: "20%"
        },
        {
            title: 'Account name',
            dataIndex: 'ten',
            key: 'accountName',
            className: "text-center",
            align: "left"
        }
    ];

    // const changePagingation = (page: number, pageSize: number | undefined) => {
    //     setPageNumber(page)
    //     pageSize && setPageSize(pageSize)
    // }
    return (
        <CLoading visible={loadingSearch}>
            <Table className={clsx(classesTable.table)}
                rowKey={"guid"}
                locale={{
                    emptyText:
                    <div
                        className="flex items-center justify-center"
                        style={{height: `calc(100vh - ${500}px)`}}>No data</div>
                }}
                // pagination={{hideOnSinglePage: true, total: inforPage.TotalCount, current: inforPage.CurrentPage, pageSize: inforPage.PageSize, onChange: (page, pageSize) => changePagingation(page, pageSize) }}
                pagination={false}
                columns={columnTable}
                dataSource={dataTable}
                rowSelection={{
                    selectedRowKeys: selectedRowsArray,  
                    hideSelectAll: true,
                    onChange: (selectedRowKeys: React.Key[], selectedRows: ITableFixCharge[]) => {
                        handleSelect(selectedRows, selectedRowKeys)
                    }
                }}
                scroll={{ y:  `calc(100vh - ${height}px)` }}
            />
        </CLoading>
    )
}
export default React.memo(TableAccountReport);