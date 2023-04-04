import { Table } from 'antd';
import { ColumnProps } from "antd/lib/table";
import clsx from "clsx";
import { IDataSearchMessage, IMessageTable } from 'common/model-rsvn';
import CLoading from "components/CLoading";
import React, { useEffect, useState } from "react";
import { useSelectorRoot } from "redux/store";
import MiscellaneousService from 'services/miscellaneous/miscellaneous.service';
import { useStyleTheme } from "theme";
import { tableStyle } from './style/tableStyle';

interface Props {
    height: number,
    guestGuid: string,
    handleSelected(record: IMessageTable): void,
    showInfo(record: IMessageTable): void,
    setPageNumber: React.Dispatch<React.SetStateAction<number>>,
    dataTableMessage: IDataSearchMessage[]
}
const CTableControlMessage = ({ height, setPageNumber, handleSelected, showInfo, dataTableMessage }: Props): JSX.Element => {
    const classesTable = useStyleTheme(tableStyle);
    const {inforPage, loadingSearch } = useSelectorRoot(state => state.booking);

    const [dataTable , setDataTable] = useState<IMessageTable[]>([]);

    const columnTable: ColumnProps<IMessageTable>[] = [
        {
            title: 'Date',
            dataIndex: 'ngayThang',
            key: 'id',
            align: "left",
            width: "14%"
        },
        {
            title: 'Time',
            dataIndex: `time`,
            key: 'time',
            className: "text-left",
            width: "11%"
        },
        {
            title: 'Room',
            dataIndex: 'roomName',
            key: 'dateFrom',
            className: "text-left",
            width: "11%"
        },
        {
            title: 'GuestName',
            dataIndex: 'guestName',
            key: 'guest',
            className: "text-left",
            width: "20%"
        },
        {
            title: 'From',
            dataIndex: 'nguoiNhan',
            key: 'nguoiNhan',
            className: "text-left"
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            className: "text-left",
            width: "25%"
        }
    ];
    
    useEffect(() => {
        const getConvertData = async () => {
            const convertData: IMessageTable[] = await MiscellaneousService.ConvertDataTableMessage(dataTableMessage)
            setDataTable(convertData)
        }
        getConvertData()
    }, [dataTableMessage])

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
                    onChange: (selectedRowKeys: React.Key[], selectedRows: IMessageTable[]) => {
                        handleSelected(selectedRows[0])
                    },
                    type: "radio"
                }}
                scroll={{x:`calc(100vh - 500px)`, y: 500 }}
            />
        </CLoading>
    )
}
export default React.memo(CTableControlMessage);