import { Table } from 'antd';
import { ColumnProps } from "antd/lib/table";
import clsx from "clsx";
import { ITracerMessageTable } from 'common/model-rsvn';
import CLoading from "components/CLoading";
import React, { useEffect, useState } from "react";
import { useSelectorRoot } from "redux/store";
import MiscellaneousService from 'services/miscellaneous/miscellaneous.service';
import { useStyleTheme } from "theme";
import { tableStyle } from './style/tableStyle';

interface Props {
    height: number,
    guestGuid: string,
    handleSelected(record: ITracerMessageTable[]): void,
    showInfo(record: ITracerMessageTable): void,
    setPageNumber: React.Dispatch<React.SetStateAction<number>>,
}
const CTableControl = ({ height, setPageNumber, handleSelected, showInfo }: Props): JSX.Element => {
    const classesTable = useStyleTheme(tableStyle);
    
    const {inforPage, loadingSearch, dataSearchTracerMessage } = useSelectorRoot(state => state.booking);

    const [dataTable , setDataTable] = useState<ITracerMessageTable[]>([]);

    const columnTable: ColumnProps<ITracerMessageTable>[] = [
        {
            title: 'Date',
            dataIndex: 'ngayThang',
            key: 'id',
            align: "left"
        },
        {
            title: 'Department',
            dataIndex: `department`,
            key: 'department',
            className: "text-left"
        },
        {
            title: 'Util',
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            className: "text-left"
        },
        {
            title: 'From',
            dataIndex: 'dateTo',
            key: 'dateTo',
            className: "text-left"
        },
        {
            title: 'Contents',
            dataIndex: 'messageSubject',
            key: 'content',
            className: "text-left"
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            className: "text-left"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const convertData = await MiscellaneousService.ConvertDataTableTracer(dataSearchTracerMessage)
            setDataTable(convertData)
        }
        fetchData()
    }, [dataSearchTracerMessage])

    return (
        <CLoading visible={loadingSearch}>
            <Table className={clsx(classesTable.table)} style={{ height: `calc(100vh - ${height}px)` }}
                rowKey={"id"}
                locale={{
                    emptyText:
                    <div
                        className="flex items-center justify-center"
                        style={{ height: "calc(100vh - 600px)" }}>No data</div>
                }}
                pagination={{hideOnSinglePage: true, total: dataTable.length, current: inforPage.CurrentPage, pageSize: inforPage.PageSize, onChange: (page, pageSize) => setPageNumber(page) }}
                columns={columnTable}
                dataSource={dataTable}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: event => { showInfo(record)}, // click row
                    };
                }}
                rowSelection={{
                    onChange: (selectedRowKeys: React.Key[], selectedRows: ITracerMessageTable[]) => {
                        handleSelected(selectedRows)
                    },
                    type: "radio"
                }}
                scroll={{x:`calc(100vh - 500px)`, y: 500 }}
            />
        </CLoading>
    )
}
export default React.memo(CTableControl);