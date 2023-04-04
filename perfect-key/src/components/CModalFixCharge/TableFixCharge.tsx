/* eslint-disable */
import React, { useState } from 'react';
import { Table, InputNumber, Input } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { useStyleTheme } from 'theme';
import clsx from 'clsx';
import { ITableFixCharge } from 'common/model-booking';
import Utils from 'common/utils';
import { useEffect } from 'react';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { setAccountNameFixCharge, setDataFoextraChargeDetail } from 'redux/controller/reservation.slice';
import { styleReinstateTable } from 'components/CStyleTable';

interface PropTableFixCharge {
    dataTableFixCharge: ITableFixCharge[],
    night: number,
    getValues: any,
    setValue: any,
    extraBedAvailable: number,
    maxExtraBed: number
}

const TableFixCharge = ({ dataTableFixCharge, night, setValue, getValues, extraBedAvailable, maxExtraBed}: PropTableFixCharge) => {
    const classesTable = useStyleTheme(styleReinstateTable);
    const dispatch = useDispatchRoot();

    const { dataExtraChargeDetail } = useSelectorRoot(state => state.rsvn);
    const [indexRow, setIndexRow] = useState<number>(-1);
    const [flag, setFlag] = React.useState(true);

    const dataTable = dataTableFixCharge;

    const columnTable: ColumnProps<ITableFixCharge>[] = [
        {
            title: 'No',
            dataIndex: 'id',
            key: 'id',
            width: '7%'
        },
        {
            title: 'Auto...',
            dataIndex: 'autoPost',
            key: 'autoPost',
            width: '10%'
        },
        {
            title: 'Acc...Code',
            dataIndex: 'ma',
            key: 'ma',
            width: '14%'
        },
        {
            title: 'Account Name',
            dataIndex: 'ten',
            key: 'ten',
            width: '18%'
        },
        {
            title: 'Quantity',
            dataIndex: 'soLuong',
            key: 'soLuong',
            render: (value, record: ITableFixCharge, index: number) => (
                indexRow === index ?
                    <InputNumber defaultValue={value} min={0}
                        onPressEnter={() => handleEditRow(-1, record)}
                        style={{ width: "90%" }}
                        max={dataTable[index].ma === "304" ? maxExtraBed : 1000}
                        onChange={(e) => handleInputNumberChange(e, index, "quantity")}
                        name="quantity" type="number" />
                    :
                    <div className={`${classesTable.inputEdit}`} style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}>
                        {value}
                    </div>
            ),
            width: '12%'
        },
        {
            title: 'Price',
            dataIndex: 'donGia',
            key: 'donGia',
            render: (value, record: ITableFixCharge, index: number) => {
                
                return (
                    indexRow === index ?
                        <Input min={0} style={{ width: "80%" }}
                            onPressEnter={() => handleEditRow(-1, record)}
                            onChange={(e) => handleInputNumberChange(e.target.value, index, value, record)}
                            defaultValue={value}
                            name="price" type="text" />
                        :
                        <div className={`${classesTable.inputEdit}`} style={{ paddingRight: 24 }}
                            onClick={() => { handleEditRow(index, record) }}>
                            { !value ? 0 : Utils.formatNumber(value)}
                        </div>
                );
            },
            width: '18%'
        },
        {
            title: 'Amount',
            dataIndex: 'thanhTien',
            key: 'thanhTien',
            
            width: '16%'
        },
        {
            title: 'Notes',
            dataIndex: 'ghiChu',
            key: 'ghiChu',
            width: '12%',
            render: (value, record: ITableFixCharge, index: number) => {
                return (
                    indexRow === index ?
                        <Input min={0} style={{ width: "100%" }}
                            onPressEnter={() => handleEditRow(-1, record)}
                            onChange={(e) => handleInputNumberChange(e.target.value, index, "ghiChu", record)}
                            defaultValue={value}
                            name="price" type="text" />
                        :
                        <div className={`${classesTable.inputEdit}`} style={{ paddingRight: 24 }}
                            onClick={() => { handleEditRow(index, record) }}>
                            {value}
                        </div>
                );
            },
        },
    ];
    const handleEditRow = (index: number, record: any) => {
        if (index !== -1) {
            setValue("typeDate", dataTable[index].kieuNgay);
            dispatch(setDataFoextraChargeDetail({
                index,
                kieuNgay: dataTable[index].kieuNgay,
                tuNgay: 0,
                denNgay: 0,
                soNgay: dataTable[index].soNgay === 0 ? night : dataTable[index].soNgay
            }))
        }
        setIndexRow(index);
        //setFlag(!flag);
    }
    const handleInputNumberChange = (e: any, index: number, name: string, value?: any) => {
        if (name === "quantity") {
            dataTable[index].soLuong = e;
            //dataTable[index].thanhTien = Utils.formatNumber(dataTable[index].donGia * e * night); 
        } else if (name !== "ghiChu") {
            dataTable[index].donGia = e;
            //dataTable[index].thanhTien =  Utils.formatNumber(dataTable[index].soLuong * e);
        }
        if (name === "ghiChu") {
            dataTable[index].ghiChu = e;
        }
        dataTable[index].kieuNgay = getValues("typeDate");
        setFlag(!flag);
    }
    useEffect(() => {
        const handleDispatchFixCharge = () => {
            let accountName = dataTable[indexRow] ? dataTable[indexRow].ten : "ACCOUNT NAME";
            let dataSelectedFixcharge: ITableFixCharge[] = []
            dataTable.forEach((item) => {
                if (Utils.parseLocaleNumber(item.thanhTien.toString()) !== 0) { //get row is amount !== 0
                    dataSelectedFixcharge = [...dataSelectedFixcharge, Object.assign({}, item)]
                }
            })
            if (accountName !== "") {
                dispatch(setAccountNameFixCharge({ accountName: accountName, dataSelectedFixcharge: dataSelectedFixcharge }));
                //save record user selected
            } else {
                //amount = 0 refresh state redux store
                dispatch(setAccountNameFixCharge({ accountName: "ACCOUNT NAME", dataSelectedFixcharge: [] }));
            }
        }
        if (indexRow !== -1) {
            let thanhTien = dataTable[indexRow].donGia * dataTable[indexRow].soLuong;
            dataTable[indexRow].soNgay = dataExtraChargeDetail.soNgay;
            dataTable[indexRow].thanhTien = Utils.formatNumber(thanhTien);
            dataTable[indexRow].kieuNgay = dataExtraChargeDetail.kieuNgay;
        }
        handleDispatchFixCharge();
    }, [flag, indexRow, dataExtraChargeDetail])

    return (
        <div className="col-span-12" style={{ height: "calc(100vh - 434px)"}}>
            <Table className={clsx(classesTable.table)}
                locale={{
                    emptyText:
                        <div
                            className="flex items-center justify-center"
                            style={{ height: "calc(100vh - 600px)" }}>No data</div>
                }}
                pagination={false}
                columns={columnTable}
                rowKey={"guid"}
                rowClassName={`${classesTable.editRowTable}`}
                dataSource={dataTable}
                scroll={{ x: `calc(40px + 40px + 60px + 60px + (${columnTable?.length - 4} * 150px))`, y: 500 }}
                summary={(data) => {
                    let soLuong = 0;
                    let thanhTien = 0;
                    data.forEach((item: ITableFixCharge) => {
                        soLuong += item.soLuong;
                        thanhTien += Utils.parseLocaleNumber((item.thanhTien).toString());
                    })
                    console.log(Utils.parseLocaleNumber((thanhTien).toString()));
                    //thanhTien = thanhTien * dataExtraChargeDetail.soNgay;
                    return (
                        <Table.Summary.Row style={{ background: "#FFF" }} className={`${classesTable.tableSummary} ant-table-footer`} key={"flfx01"}>
                            <Table.Summary.Cell index={1} colSpan={3} key={"nonefx01"} />
                            <Table.Summary.Cell index={2} colSpan={1} key={"totalfx02"} >
                                <span className="font-bold">Total</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3} colSpan={2} key={"quantityfx03"} >
                                <span className="font-bold">{soLuong}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4} colSpan={2} key={"amounfx04"} >
                                <span className="font-bold">{Utils.formatNumber(thanhTien)}</span>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )
                }}
            />
        </div>
    );
};

export default React.memo(TableFixCharge);