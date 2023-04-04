/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import CLoading from 'components/CLoading'
import { useStyleTheme } from 'theme'
import { Empty, Table } from "antd";
import { DataAmountRoomChat, ITableFolio } from 'common/cashier/model-cashier';
import { styleCTable } from 'components/CStyleTable';
import { useTranslation } from 'react-i18next';
import { ColumnProps } from "antd/lib/table";
import CashierService from 'services/cashier/cashier.service';
import { AmountRoomChat } from 'common/cashier/model-folio';
import { DefaultAmountRoomChat } from 'common/cashier/define-cashier';
import FolioService from 'services/cashier/folio.service';
import { useSelectorRoot } from 'redux/store';
import GLobalPkm from 'common/global';

interface TableCashierProps {
    setIsApplyGroup: React.Dispatch<React.SetStateAction<boolean>>,
    loadingTable: boolean,
    dataFolio: ITableFolio[],
    selectedRowsFolio: ITableFolio[],
    setSelectedRowsFolio: React.Dispatch<React.SetStateAction<ITableFolio[]>>,
    setAmountAndRoomChat: React.Dispatch<React.SetStateAction<DataAmountRoomChat>>,
}
const TableFolio = ({ dataFolio, setIsApplyGroup, loadingTable, selectedRowsFolio, setSelectedRowsFolio,setAmountAndRoomChat }: TableCashierProps): JSX.Element => {
    const classes = useStyleTheme(styleCTable);
    const { hotelId, language } = useSelectorRoot(state => state.app);
    const { t } = useTranslation('translation');
    const columns: ColumnProps<ITableFolio>[] = [
        {
            title: "Date",
            dataIndex: "ngayThang",
            className: "text-center",
            width: "12%"
        },
        {
            title: "No",
            dataIndex: "ma",
            className: "text-center",
            width: "9%"
        },
        {
            title: "Description",
            dataIndex: "dienGiai",
            width: "40%"
        },
        {
            title: "Debit",
            dataIndex: "thanhTien",
            className: "text-center",
            width: "12%"
        },
        {
            title: "Credit",
            dataIndex: "thanhTien1",
            className: "text-center",
            width: "12%"
        },
        {
            title: "Username",
            dataIndex: "nguoiDung2",
            className: "text-center",
            width: "15%"
        },
    ]

    const dragStart = (e: React.DragEvent<HTMLTableRowElement>, tasks: ITableFolio[], props: any) => {
        if(selectedRowsFolio.length > 0){
            e.dataTransfer.setData("selectedDragRows", JSON.stringify(selectedRowsFolio));
            const node1 = document.createElement('div');
            node1.classList.add(`${classes.dragGhost}`);
            node1.classList.add("shadow");
            node1.innerHTML = `<div class="${classes.title} font-bold ">${selectedRowsFolio[0].dienGiai} </div>`
            e.dataTransfer.setDragImage(node1, 0, 0);
            // Append it to `body`
            document.body.appendChild(node1);
        } else if(tasks) {
            const row = tasks.find((item) => item.id === props['data-row-key'] )
            if(row){
                e.dataTransfer.setData("selectedDragRows", JSON.stringify([row]));
                const node1 = document.createElement('div');
                node1.classList.add(`${classes.dragGhost}`);
                node1.classList.add("shadow");
                node1.innerHTML = `<div class="${classes.title} font-bold ">${row.dienGiai} </div>`
                e.dataTransfer.setDragImage(node1, 0, 0);
                // Append it to `body`
                document.body.appendChild(node1);
            }
        }
    }

    const dragOverRoom = (e: React.DragEvent<HTMLDivElement>) => { 
        e.preventDefault()
        const el = document.querySelector('.shadow');
        el && el.remove(); // Removes the div with the 'div-02' id
    }
    
    // Droppable table body
    const DroppableTableBody = ({ tasks, ...props }: any) => {
        return <tbody id="UnAssign" {...props} ></tbody>
    };

    // Draggable table row
    const DraggableTableRow = ({ tasks, ...props }: any) => {
        if (!tasks.length) {
            return (
                <tr className="ant-table-placeholder row-item" {...props}>
                    <td
                        colSpan={columns.length}
                        className="ant-table-cell"
                    >
                        <div className="ant-empty ant-empty-normal">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                    </td>
                </tr>
            );
        }
        return (
            <tr
                key={props['data-row-key']}
                id={props['data-row-key']}
                // index={index}
                draggable
                onDragStart={(e) => dragStart(e, tasks, props)}
                onDragOver={(e) => dragOverRoom(e)}
                {...props}
            ></tr>
        );
    };

    return (
        <div
            style={{ height: "calc(100vh - 410px)" }}
        >
            <CLoading visible={loadingTable}>
                <Table
                    columns={columns}
                    locale={{
                        emptyText: <div
                            className="flex items-center justify-center"
                            style={{ height: "calc(100vh - 470px)" }}>{t("BOOKING.SEARCHVALUE.noData")}</div>
                    }}
                    className={`${classes.table} mt-3`}
                    pagination={{
                        size: "default",
                        hideOnSinglePage: true,
                        /* current: paginationFooter.CurrentPage,
                        pageSize: paginationFooter.PageSize,
                        total: paginationFooter.TotalCount,
                        showSizeChanger: false,
                        onChange: (page, pageSize) => onPaginationFooter(page, pageSize) */
                    }}
                    scroll={{ y: 500 }}
                    dataSource={dataFolio}
                    rowKey={"id"}
                    components={{
                        body: {
                        // Custom tbody
                            wrapper: (val: any) =>
                                DroppableTableBody({
                                    tasks: dataFolio,
                                    ...val,
                                }),
                            // Custom td
                            row: (val: any) =>
                                DraggableTableRow({
                                    tasks: dataFolio,
                                    ...val,
                                }),
                        },
                    }}
                    rowSelection={{
                        onChange: async (selectedRowKeys: React.Key[], selectedRows: ITableFolio[]) => {
                            if (selectedRows.length === 0 || selectedRows.length > 1) {
                                setIsApplyGroup(false);
                            }
                            setSelectedRowsFolio(selectedRows)                        
                            if (selectedRows.length === 1) {
                                const data: AmountRoomChat = {
                                    groupFolioId: selectedRows[0].parentGuid,
                                    maTk: selectedRows[0].maTk
                                }
                                const tkName = await FolioService.filterDataFixChargeByMa(hotelId, selectedRows[0].maTk)

                                if (tkName) {
                                    const amountData = await CashierService.getAmountAndRoomChatData(data);
                                    amountData && setAmountAndRoomChat({ ...amountData, maTk: language === "en" ? tkName.ten : tkName.ten });
                                }
                            }
                            else setAmountAndRoomChat(DefaultAmountRoomChat)
                        },
                    }}
                    rowClassName={(record: ITableFolio, index: number) => {
                        return record.dockGuid !== GLobalPkm.defaultBytes32 ? classes.trRowIttalic : ""
                    }}
                />
            </CLoading>
        </div>
    )
}
export default React.memo(TableFolio);