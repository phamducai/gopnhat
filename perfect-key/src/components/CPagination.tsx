/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from 'antd';
import CIconSvg from 'components/CIconSvg';
import React from 'react';
import { createStyles, useStyleTheme } from 'theme'
export const stylePanigation = createStyles((theme) => ({
    customPagination: {
        '& .ant-pagination-item': {
            border: 'none',
            '& a': {
                color: "#00293B"
            }
        },
        '& .ant-pagination-item-active': {
            border: '1px',
            borderRadius: "6px",
            boxShadow: "0px 2px 8px rgba(8, 35, 48, 0.16), 0px 1px 2px rgba(8, 35, 48, 0.24)",
            '& a': {
                color: "#00293B"
            }
        },
        '& .ant-pagination-next': {
            border: 'none',
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        '& .ant-pagination-prev': {
            border: 'none',
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        '& .ant-select-selector':{
            background: "#F0F2F5",
            border: '1px',
            borderRadius: "20px",
            '& span': {
                color: "#00293B"
            }
        }
    }
}))
interface PropCPagination{
    current?: number,
    pageSize: number,
    total: number,
    onChange(page: number, pageSize: number): void,
    pageSizeOptions?: string[],
    showQuickJumper?: boolean | React.ReactNode,
    showSizeChanger?: boolean
}
const CPagination = ({ total, onChange,pageSize, current, pageSizeOptions, showQuickJumper, showSizeChanger }: PropCPagination):  JSX.Element => {
    const classes = useStyleTheme(stylePanigation);
    function itemRender(current: any, type: any, originalElement: any) {
        if (type === 'prev') {
            return <CIconSvg name={'pre-page'} svgSize="small" hexColor="#666666" />;
        }
        if (type === 'next') {
            return <CIconSvg name={'next-page'} svgSize="small" hexColor="#666666" />;
        }
        if (type === "jump-prev"){
            return <CIconSvg name={'jump-pre-page'} svgSize="small" hexColor="#666666" />;
        }
        if (type === "jump-next"){
            return <CIconSvg name={'jumb-next-page'} svgSize="small" hexColor="#666666" />;
        }
        return originalElement;
    }
    return (
        <Pagination 
            className={`${classes.customPagination} flex`} 
            total={total} 
            current={current}
            pageSize={pageSize}
            showSizeChanger={showSizeChanger ?? false}
            hideOnSinglePage={true}
            itemRender={itemRender}
            pageSizeOptions={pageSizeOptions ?? []}
            showQuickJumper={showQuickJumper ?? false}
            onChange={(page,pageSize) => onChange(page,pageSize ?? 10)}
        />
    );
};

export default CPagination;