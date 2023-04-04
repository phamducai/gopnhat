/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from "antd/lib/table"
import { columnsTableGuestProfile } from "common/search/TableSearchResults"
import React from "react"
import { useStyleTheme } from "theme"
import { editProfilesStyle } from "../styles/editProfiles"

const CTableGuestProfile = (props: any): JSX.Element => {
    const classes = useStyleTheme(editProfilesStyle)
    const {dataTable, totalItem, filter, setFilter, handleMerge, setSelectedRowsMerge } = props
    // const { t } = useTranslation("translation")

    const onPagination = (page: number, pageSize: any) => {
        setFilter({
            ...filter,
            pageNumber: page,
            pageSize: pageSize && pageSize
        })
        handleMerge()
    }

    return (
        <Table
            columns={columnsTableGuestProfile}
            tableLayout="fixed"
            dataSource={dataTable}
            className={`${classes.table} mt-1`}
            pagination={{ total: totalItem, current: filter.pageNumber, pageSize: filter.pageSize, onChange: (page, pageSize) => onPagination(page, pageSize) }}
            size="small"
            bordered={false}
            scroll={{ x: 'calc(350px + 60%)', y: 'calc(100vh - 290px)' }}
            rowSelection={{
                onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                    const lstSelectedData: any[] = []
                    selectedRows.forEach((row: any) => lstSelectedData.push(row))
                    setSelectedRowsMerge(lstSelectedData)
                }, checkStrictly: false
            }}
        />
    )
}
export default React.memo(CTableGuestProfile)