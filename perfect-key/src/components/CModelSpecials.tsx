import CModel from 'components/CModal';
import React from 'react';
import { Table } from 'antd';
import { useStyleTheme } from 'theme';
import { styleCTable } from 'components/CStyleTable';
import clsx from 'clsx';
//import { styleCTableFixCharge } from './styles/index.style';
import { DataType } from 'common/search/TableSearchResults';
const columnTable = [
    {
        title: 'Special Code',
        dataIndex: 'specialCode',
        key: 'specialCode',
        width: '20%'
    },
    {
        title: 'Special Name',
        dataIndex: 'specialName',
        key: 'specialName',
        width: '80%'
    }
];
const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sidney No. 1 Lake Park',
    },
];
interface PropsSpecials {
    visible: boolean,
    setVisibleMSpecials: React.Dispatch<React.SetStateAction<boolean>>,
}
const ModelSpecials = ({visible,setVisibleMSpecials}: PropsSpecials) => {
    const classesTable = useStyleTheme(styleCTable);

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`);
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    return (
        <CModel 
            title="Specials"
            visible={visible}
            onOk={() => console.log("true")}
            onCancel={() => setVisibleMSpecials(false)}
            width={"50%"}
            content={
                <Table className={clsx(classesTable.table, "col-span-12")} style={{ height : "50vh" }} 
                    locale={{ emptyText: 
                    <div 
                        className="flex items-center justify-center"
                        style={{height: "50vh"}}>No data</div> }}
                    rowSelection={rowSelection}
                    pagination={false} 
                    columns={columnTable} 
                    dataSource={data}
                />
            }
        />
    );
};

export default React.memo(ModelSpecials);