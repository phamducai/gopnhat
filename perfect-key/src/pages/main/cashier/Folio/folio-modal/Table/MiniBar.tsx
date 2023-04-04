/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useStyleTheme } from "theme";
import { InputNumber, Table } from 'antd';
import clsx from "clsx";
import { styleCashier } from "pages/main/cashier/styles/styleCashier";
import { ColumnProps } from "antd/lib/table";
import { ITableMinibarAndLaundry } from "common/cashier/model-cashier";
import { setGoodsMinibar } from "redux/controller/cashier/folio/folio.slice";
import { useDispatch } from "react-redux";
import Utils from "common/utils";

interface Props {
    dataTable: ITableMinibarAndLaundry[],
    height: number
}
const MiniBar = ({ dataTable, height }: Props): JSX.Element => {
    const classesTable = useStyleTheme(styleCashier);
    const inputRef: RefObject<HTMLInputElement> = useRef<any>()
    const dispatch = useDispatch();

    const [isEditingRow, setIsEditingRow] = useState();

    useEffect(() => {
        if (isEditingRow)
            inputRef?.current?.focus();
    }, [isEditingRow])

    const columnTable: ColumnProps<any>[] = [
        {
            title: 'Goods Name',
            dataIndex: 'ten',
            key: 'ten',
            width: '30%',
            align: "left"
        },
        {
            title: 'Quantity',
            dataIndex: 'soLuong',
            render: (text, record, index) => (
                isEditingRow === index ? <InputNumber min={0} ref={inputRef} style={{ width: "100%" }}
                    // onBlur={() => handleEditRow(-1, record)}
                    onPressEnter={() => handleEditRow(-1, record)}
                    defaultValue={record.soLuong}
                    formatter={record => `${record}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={(e: any) => handleInputNumberChange(e, index, "soLuong")}
                    name="soLuong"
                /> :
                    <div className={`${classesTable.inputEdit}`} style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}>
                        {Utils.formatNumber(text)}
                    </div>
            ),
            key: 'donViTinh',
            width: '20%',
            className: "text-center"
        },
        {
            title: 'Price',
            dataIndex: 'donGia',
            key: 'donGia',
            width: '20%',
            className: "text-center",
            render: (text: number) => (
                <>
                    {text ? Utils.formatNumber(text) : 0}
                </>
            ),

        },
        {
            title: 'Amount',
            dataIndex: 'thanhTien',
            render: (text, record, index) => (
                <div className={`${classesTable.inputEdit}`} >
                    {record.thanhTien === null ? "" : Utils.formatNumber(record.thanhTien)}
                </div>
            ),
            key: 'thanhTien',
            width: '20%',
            className: "text-center"
        },
        {
            title: 'Notes',
            dataIndex: 'dienGiai',
            render: (text, record, index) => (
                <div className={`${classesTable.inputEdit}`} style={{ paddingRight: 24 }}>
                    {record.dienGiai}
                </div>
            ),
            key: 'dienGiai',
            width: '20%'
        }
    ];

    const handleEditRow = (index: any, record: any) => {
        setIsEditingRow(index)
    }
    const handleInputNumberChange = (e: number, index: any, name: string) => {
        if (name === "soLuong") {
            dataTable[index].soLuong = e;
            dataTable[index].thanhTien = dataTable[index].donGia * e
            dataTable[index].dienGiai = e + " " + dataTable[index].ten + "; "
        }
    }

    const handleSaveRow = (record: any, indexTable: number) => {
        const data: ITableMinibarAndLaundry[] = [];
        dataTable.forEach((item: ITableMinibarAndLaundry) => {
            if (item.thanhTien) {
                const itemMap = Object.assign({}, item);
                data.push(itemMap);
            }
        })
        dispatch(setGoodsMinibar(data));
        handleEditRow(-1, record);
    }
    return (
        <Table className={clsx(classesTable.table)} style={{ height: `calc(100vh - ${height}px)` }}
            rowKey={"hangHoaGuid"}
            locale={{
                emptyText:
                    <div
                        className="flex items-center justify-center"
                        style={{ height: "calc(100vh - 600px)" }}>No data</div>
            }}
            onRow={(record, rowIndex) => {
                return {
                    onMouseLeave: event => {
                        handleSaveRow(record, rowIndex ?? 0)
                    }, // mouse leave row
                };
            }}
            pagination={false}
            columns={columnTable}
            dataSource={dataTable}
            scroll={{ x: 500, y: 500 }}
        />
    )
}
export default React.memo(MiniBar);