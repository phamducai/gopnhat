/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Dropdown, Menu } from 'antd';
import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next"

interface ICViewStyle extends Props {
    selectedViewStyle: any
}

const CViewStyle = ({ selectedViewStyle, ...props }: ICViewStyle): JSX.Element => {
    const [valueSelected, setValueSelected] = useState("Room availability")
    const { t } = useTranslation("translation")
    const handleDropdown = ({ key }: any) => {
        setValueSelected(key)
        selectedViewStyle(key)
    }
    React.useEffect(() => {
        selectedViewStyle(valueSelected)
        //eslint-disable-next-line
    }, [])
    const menu = (
        <Menu onClick={handleDropdown}>
            <Menu.Item disabled={valueSelected === "Room availability"} key="Room availability">
                Room availability
            </Menu.Item>
            {/* <Menu.Item 
                disabled={valueSelected === "Reserved rooms"} 
                key="Reserved rooms">
                Reserved Rooms
            </Menu.Item> */}
        </Menu>
    );
    return (
        <div className={props.className}>
            {t("BOOKING.viewStyle")}:
            <Dropdown overlay={menu} trigger={['click']}>
                <a href="!#" className="ant-dropdown-link selectedRoomSpan"
                    onClick={e => e.preventDefault()}> {valueSelected} <DownOutlined style={{ fontSize: "8px", color: "#1A87D7" }} /></a>
            </Dropdown>
        </div>
    )
}
export default React.memo(CViewStyle)