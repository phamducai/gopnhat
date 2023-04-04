/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useStyleTheme } from "theme";
import { InputNumber, Table } from 'antd';
import clsx from "clsx";
import { styleCashier } from "pages/main/cashier/styles/styleCashier";
import { ITableMinibarAndLaundry } from "common/cashier/model-cashier";
import { setGoodsLaundry } from "redux/controller/cashier/folio/folio.slice";
import { useDispatch } from "react-redux";
import { IDataLaundryMaping } from "common/cashier/model-folio";
import { ColumnProps } from "antd/lib/table";
import { FlagTypeLaundry } from "common/enum/cashier.enum";
import Utils from "common/utils";

interface Props{
    dataTableLaundry: IDataLaundryMaping[],
    height: number
}
const Laundry = ({dataTableLaundry, height}: Props): JSX.Element => {
    const classesTable = useStyleTheme(styleCashier);
    const dispatch = useDispatch()
    const dataTable = dataTableLaundry;

    const [flag, setFlag] = React.useState(true);
    const [indexRow, setIndexRow] = useState<number>(-1);

    const columnTable: ColumnProps<IDataLaundryMaping> [] = [
        {
            title: 'Goods Name',
            dataIndex: 'ten',
            key: 'ten',
            width: '40%',
            align: "left"
        },
        {
            title: 'Quantity',
            dataIndex: 'soLuong',
            key: 'soLuong',
            width: '20%',
            align: "center",
            render: (text: number, record: { soLuong: number; }, index: number) => (
                indexRow === index ? <InputNumber  min={0} style={{ width: "100%" }}
                    // onBlur={() => handleEditRow(-1, record)}
                    onPressEnter={() => handleEditRow(-1, record)}
                    defaultValue={0}
                    value={record.soLuong}
                    disabled={dataTable[index].disableIn1}
                    onChange={(e: any) => handleInputNumberChange(e, index, "soLuong")}
                    name="soLuong"
                /> :
                    <div className={`${classesTable.inputEdit}`}
                        onClick={() => { handleEditRow(index, record) }}>
                        {text ? Utils.formatNumber(text) : 0}
                    </div>
            ),
        },
        {
            title: 'Price L',
            dataIndex: 'laundryUSD',
            key: 'laundryUSD',
            width: '20%',
            align: "center",
            render: (text: number) => (
                <>
                    {text ? Utils.formatNumber(text) : 0}
                </>
            ),
        },
        {
            title: 'Total L',
            dataIndex: 'thanhTien',
            key: 'thanhTien',
            width: '20%',
            align: "center",
            render: (text: number) => (
                <>
                    {text ? Utils.formatNumber(text) : 0}
                </>
            ),
        },
        {
            title: 'Quantity D',
            dataIndex: 'soLuong1',
            key: 'soLuong1',
            width: '20%',
            align: "center",
            render: (text: number, record: { soLuong: number; }, index: number) => (
                indexRow === index ? <InputNumber  min={0} style={{ width: "100%" }}
                    // onBlur={() => handleEditRow(-1, record)}
                    onPressEnter={() => handleEditRow(-1, record)}
                    defaultValue={0}
                    value={text ?? 0}
                    disabled={dataTable[index].disableIn2}
                    onChange={(e: any) => handleInputNumberChange(e, index, "soLuong1")}
                    name="soLuong1"
                /> :
                    <div className={`${classesTable.inputEdit}`}
                        onClick={() => { handleEditRow(index, record) }}>
                        {text ? Utils.formatNumber(text) : 0}
                    </div>
            ),
        },
        {
            title: 'Price D',
            dataIndex: 'dryCleaningUSD',
            key: 'dryCleaningUSD',
            width: '20%',
            align: "center",
            render: (text: number) => (
                <>
                    {text ? Utils.formatNumber(text) : 0}
                </>
            ),
        },
        {
            title: 'Total D',
            dataIndex: 'thanhTien1',
            key: 'thanhTien1',
            width: '20%',
            align: "center",
            render: (text: number) => (
                <>
                    {text ? Utils.formatNumber(text) : 0}
                </>
            ),
        },
        {
            title: 'Quantity P',
            dataIndex: 'soLuong2',
            key: 'soLuong2',
            width: '20%',
            align: "center",
            render: (text: number, record: { soLuong: number; }, index: number) => (
                indexRow === index ? <InputNumber  min={0} style={{ width: "100%" }}
                    // onBlur={() => handleEditRow(-1, record)}
                    onPressEnter={() => handleEditRow(-1, record)}
                    defaultValue={0}
                    value={text ?? 0}
                    disabled={dataTable[index].disableIn3}
                    onChange={(e: any) => handleInputNumberChange(e, index, "soLuong2")}
                    name="soLuong2"
                /> :
                    <div className={`${classesTable.inputEdit}`}
                        onClick={() => { handleEditRow(index, record) }}>
                        {text ? Utils.formatNumber(text) : 0}
                    </div>
            ),
        },
        {
            title: 'Price P',
            dataIndex: 'pressingOnlyUSD',
            key: 'pressingOnlyUSD',
            width: '20%',
            align: "center",
            render: (text: number) => (
                <>
                    {text ? Utils.formatNumber(text) : 0}
                </>
            ),
        },
        {
            title: 'Total P',
            dataIndex: 'thanhTien2',
            key: 'thanhTien2',
            width: '20%',
            align: "center",
            render: (text: number) => (
                <>
                    {text ? Utils.formatNumber(text) : 0}
                </>
            ),
        },
    ];

    const handleEditRow = (index: number, record: any) => {
        if(dataTable[index].soLuong > 0){
            dataTable[index].disableIn1 = false;
            dataTable[index].disableIn2 = true;
            dataTable[index].disableIn3 = true;
        }
        else if(dataTable[index].soLuong1 > 0){
            dataTable[index].disableIn1 = true;
            dataTable[index].disableIn2 = false;
            dataTable[index].disableIn3 = true;
        }
        else if(dataTable[index].soLuong2 > 0){
            dataTable[index].disableIn1 = true;
            dataTable[index].disableIn2 = true;
            dataTable[index].disableIn3 = false;
        }
        else{
            dataTable[index].disableIn1 = false;
            dataTable[index].disableIn2 = false;
            dataTable[index].disableIn3 = false;
        }
        setIndexRow(index)
    }
    const handleInputNumberChange = (e: number, index: number, name: string) => {
        if (name === "soLuong") {
            dataTable[index].soLuong = e;
            dataTable[index].thanhTien = dataTable[index].laundryUSD * e

            dataTable[index].disableIn1 = false;
            dataTable[index].disableIn2 = true;
            dataTable[index].disableIn3 = true;
        }
        if(name === "soLuong1"){
            dataTable[index].soLuong1 = e;
            dataTable[index].thanhTien1 = dataTable[index].dryCleaningUSD * e

            dataTable[index].disableIn1 = true;
            dataTable[index].disableIn2 = false;
            dataTable[index].disableIn3 = true;
        }
        if(name === "soLuong2"){
            dataTable[index].soLuong2 = e;
            dataTable[index].thanhTien2 = dataTable[index].pressingOnlyUSD * e

            dataTable[index].disableIn1 = true;
            dataTable[index].disableIn2 = true;
            dataTable[index].disableIn3 = false;
        }
        if(e === 0){
            dataTable[index].disableIn1 = false;
            dataTable[index].disableIn2 = false;
            dataTable[index].disableIn3 = false;

        }
        setFlag(!flag);
    }
    const mapFlagType = (soLuong: number, soLuong1: number, soLuong2: number) => { // map flag type data laundry flow flag type
        if(soLuong > 0){
            return FlagTypeLaundry.Laundry;
        }else if(soLuong1 > 0){
            return FlagTypeLaundry.Dry;
        }else{
            return FlagTypeLaundry.PreesingOnly;
        }
    }
    const handleSaveRow = (record: IDataLaundryMaping, indexTable: number) => {
        const data: ITableMinibarAndLaundry[] = [];
        dataTable.forEach((item: IDataLaundryMaping) => {
            if (item.soLuong > 0 || item.soLuong1 > 0 || item.soLuong2 > 0) {
                const donGia = item.laundryUSD + item.dryCleaningUSD + item.pressingOnlyUSD;
                const soLuong = item.soLuong + item.soLuong1 + item.soLuong2;
                const thanhTien = item.laundryUSD * item.soLuong + item.dryCleaningUSD * item.soLuong1 + item.pressingOnlyUSD * item.soLuong2;
                data.push({
                    hangHoa: item.hangHoa,
                    hangHoaGuid: item.hangHoaGuid,
                    donGia: donGia,
                    soLuong: soLuong,
                    donGiaUsd: 0,
                    thanhTien: thanhTien,
                    status: 0,
                    dienGiai: `${soLuong} ${item.ten}; `,
                    fullName: "",
                    hotelGuid: item.hotelGuid,
                    ten: item.ten,
                    flagType: mapFlagType(item.soLuong, item.soLuong1, item.soLuong2)
                });
            }
        })
        dispatch(setGoodsLaundry(data));
        setIndexRow(-1);
    }
    return(
        <Table className={clsx(classesTable.table)} style={{ height : `calc(100vh - ${height}px)` }}
            rowKey={"hangHoa"}
            locale={{
                emptyText:
                    <div
                        className="flex items-center justify-center"
                        style={{ height: "calc(100vh - 330px)" }}>No data</div>
            }}
            onRow={(record, rowIndex) => {
                return {
                    onMouseLeave: event => {
                        handleSaveRow(record, rowIndex ?? -1)
                    }, // mouse leave row
                };
            }}
            pagination={false}
            columns={columnTable}
            dataSource={dataTable}
            scroll={{ x: 1200, y: 500 }} 
        />
    )
}
export default React.memo(Laundry);