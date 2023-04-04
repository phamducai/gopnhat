import { Space, Tag } from 'antd';
import React from 'react'
import { useSelectorRoot } from 'redux/store';

const ShortInfo = () => {
    const { listStatisticGuest } = useSelectorRoot(state => state.frontdesk);
    const { resHeaderINV } = useSelectorRoot(state => state.roomPlan);
    return (
        <Space>
            <Tag className='h-7' color='red'>Stay: {listStatisticGuest.inHouse.room}</Tag>
            <Tag className='h-7' color='red'>Act.Arr: 0</Tag>
            <Tag className='h-7' color="red">LSTG: 0</Tag>
            <Tag className='h-7' color="blue">EA: 0</Tag>
            <Tag className='h-7' color="orange">ED: 0</Tag>
            <Tag className='h-7' color="orange">ED/EA: 0</Tag>
            <Tag className='h-7' color="green">VD: {resHeaderINV.vacantDirty}</Tag>
            <Tag className='h-7' color="blue">VC: {resHeaderINV.vacantClean}</Tag>
            <Tag className='h-7' color="blue">INS: {resHeaderINV.inspected}</Tag>
            <Tag className='h-7' color="blue">UnINS: {resHeaderINV.unInspected}</Tag>
            <Tag className='h-7' color="purple">COM: {listStatisticGuest.complimentary.room}</Tag>
            <Tag className='h-7' color="purple">HSU: {listStatisticGuest.houseUse.room}</Tag>
            <Tag className='h-7' color="purple">OOO: {resHeaderINV.outOfOrder}</Tag>
            <Tag className='h-7' color="purple">OOS: {resHeaderINV.orderService}</Tag>
        </Space>
    )
}

export default React.memo(ShortInfo);