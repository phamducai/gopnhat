/* eslint-disable */
import React, { useRef, useState } from 'react'
import { Table, Tag, Tooltip } from 'antd';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';
import { styleCTable } from 'components/CStyleTable';
import CLoading from 'components/CLoading';
import clsx from 'clsx';
import { ICTableSearchResults, SearchResultsTreeTables } from 'common/search/TableSearchResults';
import { useEffect } from 'react';
import { useDispatchRoot, useSelectorRoot } from 'redux/store';
import { updateInitDragListener, updateResetCheckBoxSearchResultTalble } from 'redux/controller/booking.slice';
import { useTranslation } from 'react-i18next';
import Popup from "./PopUp";
// @ts-ignore
import ReactDragListView from 'react-drag-listview/lib/index';
import { cloneDeep } from 'lodash';
import Utils from 'common/utils';
import CIconSvg from 'components/CIconSvg';
import GroupByViewer from 'services/search/groupbyviewer.services';
import { setShowStat } from 'redux/controller';
import DrawerInfo from "../reservation/drawerInfo";

export interface GroupTag {
    index: number,
    value: string
}

const TableSearchResults = ({ visible, titleDataSearchResults, dataSearchResults, propsOnChange, heightTable, heightHeader, handleClickContextMenu, ...props }: ICTableSearchResults): JSX.Element => {
    const styleCTableSearchResults = createStyles((theme: ThemeDefine) => ({
        table: {
            height: `calc(${theme.height.fullScreen} - (${heightHeader} + ${theme.height.navbar} + ${theme.height.paddingYPage} + 35px))`
        },
        trColorGuest: {
            color: "#00293B"
        },
        trColorGuestMain: {
            color: '#1A87D7'
        },
        fontWeight: {
            fontWeight: "600",
            color: '#1A87D7'
        }
    }));
    const dispatch = useDispatchRoot();
    const outerRef = useRef<HTMLDivElement>(null);
    const classes = useStyleTheme(styleCTableSearchResults)
    const { isShowStat, loading } = useSelectorRoot(state => state.booking);
    const classesTable = useStyleTheme(styleCTable)
    const [columnTable, setColumnTable] = useState<any>([])
    const [dataTable, setDataTable] = useState<any>([])
    const [popUp, setPopUp] = useState({ visibleConText: false, x: 0, y: 0, selected: 0, sub: 0, selectedRowKey: 0 });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [groupedHeaderTable, updateGroupedHeaderTable] = useState<GroupTag[]>([]);
    const [dataRow, setDataRow] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<any>();
    const { resetCheckBoxSearchResultTalble, initDragListener } = useSelectorRoot(state => state.booking);
    const { t } = useTranslation("translation")
    const titleOfCols = [
        t("BOOKING.SEARCHVALUE.fullname"),
        t("BOOKING.SEARCHVALUE.room"),
        t("BOOKING.SEARCHVALUE.rate"),
        t("BOOKING.SEARCHVALUE.roomType"),
        t("BOOKING.SEARCHVALUE.code"),
        t("BOOKING.SEARCHVALUE.arrival"),
        t("BOOKING.SEARCHVALUE.departure"),
        t("BOOKING.SEARCHVALUE.groupCode"),
        t("BOOKING.SEARCHVALUE.rsvnNo"),
        t("BOOKING.SEARCHVALUE.status"),
        t("BOOKING.SEARCHVALUE.comments")
    ]

    useEffect(() => {
        if (columnTable.length > 0) {
            document.getElementById('table-search-result')?.addEventListener('dragstart', (e: any) => {
                const indx = e.target.cellIndex
                indx && e.dataTransfer?.setData('dragHeader', JSON.stringify({ ...columnTable[indx - 1], index: indx - 1 }))
            })
            dispatch(updateInitDragListener(true));
        }
    }, [columnTable])

    const dragProps = {
        onDragEnd(fromIndex: any, toIndex: any) {
            //console.log(fromIndex, toIndex)
        },
        nodeSelector: "th",
        lineClassName: 'namdd'
    };

    // this for reset checkbox in SearchResultTable when resetSearchResultTable = true
    useEffect(() => {
        if (resetCheckBoxSearchResultTalble) {
            propsOnChange({ select: [] })
            setSelectedRowKeys([]);
            dispatch(updateResetCheckBoxSearchResultTalble(false));
        }
    }, [resetCheckBoxSearchResultTalble])

    React.useEffect(() => {
        try {
            const column: any = []
            const convertData: SearchResultsTreeTables[] = []
            if (dataSearchResults) {
                Object.entries(titleDataSearchResults).forEach((items: any, idx: number) => {
                    if (items[1] === "Full name") {
                        column.push({
                            title: <div className="flex justify-start">{titleOfCols[idx]}</div>,
                            dataIndex: items[0],
                            width: '200px'
                        })
                    } else if (items[1] === "Room") {
                        column.push({
                            title: <div className="flex justify-center">{titleOfCols[idx]}</div>,
                            dataIndex: items[0],
                            width: '80px',
                            sorter: (a: any, b: any) => 1
                        })
                    } else if (items[1] === "Rate") {
                        column.push({
                            title: <div className="flex justify-center">{titleOfCols[idx]}</div>,
                            dataIndex: items[0],
                            width: '80px',
                            render: (text: any, record: { soLuong: number; }, index: number) => (
                                <div className="flex justify-center">
                                    {text ? Utils.formatNumber(text.props.children) : 0}
                                </div>
                            ),
                        })
                    } else {
                        column.push({
                            title: <div className="flex justify-center">{titleOfCols[idx]}</div>,
                            dataIndex: items[0],
                            width: "auto",
                        })
                    }
                })
                dataSearchResults.forEach((element: any, key: number) => {
                    const newElement = Object.entries(element)
                    const newDataSource: any = {}
                    newDataSource.key = key;
                    newElement.forEach((data: any) => {
                        if (data) {
                            if (data[0] === 'fullName') {
                                newDataSource[data[0]] = <div className="text-left pl-4">{data[1].name}</div> || " "
                            } else if (data[0] === "comments") {
                                newDataSource[data[0]] = <Tooltip
                                    destroyTooltipOnHide color="#FFF" overlayInnerStyle={{ color: "#000" }} title={data[1].name}><div className={` ${classesTable.eclipse} text-center`}>{data[1].name}</div></Tooltip> || " "
                            }
                            else {
                                newDataSource[data[0]] = <div className={` ${classesTable.eclipse} text-center`}>{data[1].name}</div> || " "
                            }
                        }
                    });
                    newDataSource.guid = element.guid;
                    newDataSource.parentMeGuid = element.parentMeGuid
                    convertData.push(newDataSource)
                });
            }
            setColumnTable(column)
            let result = null;
            if (groupedHeaderTable.length > 0) {
                result = GroupByViewer.convertToGroupedData(convertData, column, groupedHeaderTable);
                setDataTable(result)
            }
            else {
                setDataTable(convertData)
            }
        } catch (error) {
            console.log(error);
        }
        //eslint-disable-next-line
    }, [dataSearchResults, groupedHeaderTable, t("BOOKING.SEARCHVALUE.fullname")])

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: SearchResultsTreeTables[]) => {
            let lstSelectedData: any[] = [];
            setSelectedRowKeys(selectedRowKeys);
            selectedRows.forEach((items: any) => {
                let tmp = dataSearchResults?.find(x => x.guid === items.guid)
                tmp && lstSelectedData.push(tmp);
            })
            propsOnChange({ select: lstSelectedData })
        },
        getCheckboxProps: (record: SearchResultsTreeTables) => ({
            //disabled: record.name === 'Disabled User', // Column configuration not to be checked
            //name: record.name,
        }),
    };
    const handleConTextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, indexRow: any) => {
        let dataSelectedRow = []
        let selected = 0
        let sub = 0
        let clickX = 0
        let clickY = 0
        if (dataSearchResults) {
            dataSelectedRow = dataSearchResults[indexRow]
            rowSelection.onChange([indexRow], [dataSelectedRow])
        }
        const getElement = document.getElementById("table-search-result")?.getBoundingClientRect();
        let popX = 0;
        let popY = 0;
        if ((window.innerWidth - event.clientX) > (getElement?.x ?? 0)) {
            popX = event.pageX - (getElement?.x ?? 0) + 5;
        } else {
            popX = event.pageX - (getElement?.x ?? 0) - 200;
        }
        if ((window.innerHeight - event.pageY - 100) > (getElement?.y ?? 0)) {
            popY = event.pageY - (getElement?.y ?? 0)
        } else {
            popY = event.pageY - (getElement?.y ?? 0) - 350;
        }
        const dataRow = dataSelectedRow
        setDataRow(dataRow)
        selectedRowKeys.length !== 0 ? selected = selectedRowKeys.length : selected = indexRow
        dataRow.parentMeGuid === 0 ? sub = 1 : sub = 0
        event.preventDefault();
        if (!popUp.visibleConText) {
            document.addEventListener(`click`, function onClickOutside(e) {
                clickX = e.pageX - (getElement?.x ?? 0);
                clickY = e.pageY - (getElement?.y ?? 0);
                if ((clickX - popX) < 0 || (clickX - popX) > 200 || (clickY - popY) < 0 || (clickY - popY) > 300) {
                    setPopUp({ ...popUp, visibleConText: false })
                    document.removeEventListener(`click`, onClickOutside)
                }
            })
        }
        const up = { ...popUp, visibleConText: true, x: popX, y: popY, dataRow, selected, sub }
        setPopUp(up)
    }

    const handleClick = (e: string) => {
        handleClickContextMenu(e, dataRow)
    }
    const handleShowStat = (e: any, record: SearchResultsTreeTables) => {
        let tmp = dataSearchResults?.find(x => x.guid === record.guid)
        tmp && setSelectedRow(tmp);
        dispatch(setShowStat(true))
    }

    const handleOncloseTag = (tag: string) => {
        let clone = groupedHeaderTable;
        clone = clone.filter(item => item.value !== tag)
        updateGroupedHeaderTable(clone)
    }

    const forMap = (tag: GroupTag, index: number) => {
        const tagItem = (
            <Tag className={`${classesTable.tag} rounded-xl`} style={{ padding: "5px 15px", borderRadius: '15px', color: 'black' }} color='#e4e5e6'
                closable
                onClose={(e: any) => {
                    e.preventDefault();
                    handleOncloseTag(tag.value)
                }}>
                {tag.value}
            </Tag>
        )
        const nextIcon = (index < groupedHeaderTable.length - 1) ? (
            <CIconSvg name={'next-page'} svgSize="small" hexColor="#666666" style={{ marginRight: "8px", marginTop: "12px", width: '6px', height: '10px' }} />
        ) : null
        return (
            <span key={tag.value} className={'flex'} style={{ marginTop: '5px' }}>
                {tagItem}
                {nextIcon ?? nextIcon}
            </span>
        )
    }

    const renderGroupTags = () => {
        return groupedHeaderTable.map((item, index) => forMap(item, index))
    }

    const onDropHeader = (e: any) => {
        let data = JSON.parse(e.dataTransfer.getData("dragHeader"));
        const clone = cloneDeep(groupedHeaderTable);
        let value = data?.title?.props?.children;
        if (Utils.isNullOrEmpty(value)) return;
        const indx = clone.findIndex(item => item.value === value);
        if (indx !== -1) clone.splice(indx, 1);
        clone.push({ index: data?.index, value: value });
        updateGroupedHeaderTable(clone);

    }

    return (
        <CLoading visible={visible} className={props.className}>
            <div style={{ marginBottom: 6, backgroundColor: '#F0F6FB', borderRadius: 6 }} className={`flex flex-wrap rounded-sm item-center p-3 `}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    onDropHeader(e);
                }}
            >
                <CIconSvg name={'group_grid'} svgSize="small" hexColor="#666666" style={{ marginRight: '21px' }} />
                {groupedHeaderTable.length > 0 ? renderGroupTags() : <span style={{ color: '#666666', }}>Drag here to set row groups</span>}
            </div>
            <ReactDragListView.DragColumn {...dragProps}>
                <Table className={clsx(classesTable.table, classes.table)}
                    id="table-search-result"
                    locale={{
                        emptyText: <div
                            className="flex items-center justify-center"
                            style={{ height: "calc(100vh - 260px)" }}>{t("BOOKING.SEARCHVALUE.noData")}</div>
                    }}
                    rowSelection={{ ...rowSelection, checkStrictly: false }}
                    pagination={false}
                    columns={columnTable}
                    dataSource={dataTable}
                    onRow={(record, rowIndex) => {
                        return {
                            onContextMenu: event => { handleConTextMenu(event, rowIndex) }, // right button click row
                            onClick: e => handleShowStat(e, record),
                        };
                    }}
                    rowClassName={(record, index: number) => {
                        // const newDataSearchResults: any[] = dataSearchResults ? dataSearchResults : [];
                        // if (newDataSearchResults.length === 0 || newDataSearchResults[index]?.parentMeGuid === undefined) {
                        //     return '';
                        // }
                        return record.guid ? (record.parentMeGuid ? classes.trColorGuest : classes.trColorGuestMain) : classes.fontWeight
                    }}
                    scroll={{
                        x: `calc(30px + 120px + 60px + 90px + (${columnTable?.length - 4} * 140px))`,
                        y: heightTable
                    }}
                />
            </ReactDragListView.DragColumn>
            {
                isShowStat &&
                <DrawerInfo
                    loading={loading}
                    visible={isShowStat}
                    transactStat={selectedRow}
                />
            }
            <Popup {...popUp} handleClick={handleClick} selectedRowKey={selectedRowKeys.length} />
        </CLoading>
    )
}
export default React.memo(TableSearchResults)