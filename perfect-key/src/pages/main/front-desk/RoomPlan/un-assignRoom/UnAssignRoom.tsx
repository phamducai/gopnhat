/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empty, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ResGuestProfiles, SelectedGuestProfile } from "common/define-api-booking";
import { styleUnassignTable } from "components/CStyleTable";
import React, { useEffect } from "react";
import { fetchRoom } from "redux/controller";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import { useStyleTheme } from "theme";

const columns: ColumnsType<any> = [
    {
        title: 'Full Name',
        dataIndex: 'fullName',
        width: "140px"
    },
    {
        title: 'Room Type',
        dataIndex: 'roomName',
        width: "140px"
    },
    {
        title: 'Arr.-Dep.',
        dataIndex: 'date',
        width: "140px"
    },
    {
        title: 'Group Code',
        dataIndex: 'code',
        width: "140px"
    },
];

interface IPropsUnAssignRoom {selectedDate: Date, getData(): void, dataTable: ResGuestProfiles[] | [], 
    filter: {pageNumber: number, pageSize: number },
    setFilter: React.Dispatch<React.SetStateAction<{
        pageNumber: number;
        pageSize: number;
    }>>,
    totalItem: number;
    // dragStartRow(item: ResGuestProfiles): void,
    setListSelected(data: SelectedGuestProfile[]): void,
}

const UnAssignRoom = ({ selectedDate, getData, dataTable,filter, setFilter, totalItem, setListSelected }: IPropsUnAssignRoom) => {
    const classesTable = useStyleTheme(styleUnassignTable);
    const { hotelId } = useSelectorRoot(state => state.app);
    const dispatch = useDispatchRoot();
    const { room } = useSelectorRoot(state => state.booking)

    useEffect(() => {
        dispatch(fetchRoom(hotelId));
    }, [dispatch, hotelId])

    useEffect(() => { getData() }, [hotelId, selectedDate, room, filter])

    const onPagination = (page: number) => {
        setFilter({
            ...filter,
            pageNumber: page
        })
    }

    const dragStart = (e: React.DragEvent<HTMLTableRowElement>, tasks: any, props: any) => {
        const item = tasks.find((x: any) => x.id === props['data-row-key'])
        if(item){
            e.dataTransfer.setData("transactionCardRoom", JSON.stringify(item));
            
            const node = document.createElement('div');
            node.classList.add(`${classesTable.dragGhost}`);
            node.classList.add(`ghost`);
            node.innerHTML = `<div id="node" class="${classesTable.title} font-bold ">${item.fullName} - ${item.roomName} </div>`
            // Append it to `body`
            document.body.appendChild(node);
            
            e.dataTransfer.setDragImage(node, 0, 0);
        }
    }
    
    const dragOverRoom = (e: React.DragEvent<HTMLDivElement>) => { 
        e.preventDefault()
        const el = document.querySelector('.ghost');
        el && el.remove(); // Removes the div with the 'div-02' id
    }

    // Droppable table body
    const DroppableTableBody = ({ tasks, ...props }: any) => {
        return <tbody id="UnAssign" {...props} ></tbody>
    };

    // Draggable table row
    const DraggableTableRow = ({tasks, ...props }: any) => {
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
        <>
            <div style={{height: '55vh'}} className={`w-full`}>
                <Table
                    columns={columns}
                    tableLayout="fixed"
                    dataSource={dataTable}
                    className={`${classesTable.table} mt-1`}
                    pagination={{hideOnSinglePage: true, total: totalItem, current: filter.pageNumber, 
                        pageSize: filter.pageSize, onChange: (page, pageSize) => onPagination(page) }}
                    size="small"
                    bordered={false}
                    rowKey={'id'}
                    scroll={{ x: 'calc(350px + 60%)' }}
                    components={{
                        body: {
                        // Custom tbody
                            wrapper: (val: any) =>
                                DroppableTableBody({
                                    tasks: dataTable,
                                    ...val,
                                }),
                            // Custom td
                            row: (val: any) =>
                                DraggableTableRow({
                                    tasks: dataTable,
                                    ...val,
                                }),
                        },
                    }}
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys: React.Key[], selectedRows: ResGuestProfiles[]) => {
                            const _data: SelectedGuestProfile[] = [];
                            selectedRows.forEach(row => {                            
                                _data.push({
                                    guid: row.mainGuest,
                                    roomName: row.roomName,
                                    roomType: row.roomType,
                                    arrivalDate: row.arrivalDate,
                                    departureDate: row.departureDate
                                })
                            })
                            setListSelected(_data);
                        }
                    }}
                />
            </div>
            <p className={"-mt-8 ml-6"}>Total: {totalItem}</p>
        </>
    )
}
export default React.memo(UnAssignRoom)