/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu, Popover } from "antd"
import React from "react"
import './styles/stylePopUp.css'
import { useTranslation } from "react-i18next";
import { arrSubMenu } from "common/define-sub-menu";
//import CIconSvg from "components/CIconSvg";
import {setTypeSubMenu} from "redux/controller/reservation.slice";
import { useDispatchRoot } from "redux/store";

interface PropsPopUp {
    visibleConText: any,
    x :number
    y: number,
    handleClick: any
    selected: number
    sub: number,
    selectedRowKey: number
}
const Popup = ({visibleConText, x, y, handleClick, selected, sub, selectedRowKey}: PropsPopUp):JSX.Element => {
    const {t} = useTranslation("translation")
    const dispatch = useDispatchRoot();
    const handleClickSubMenu = (type: string) => {
        dispatch(setTypeSubMenu(type));
        handleClick('showModalFuncEditGroup')
    }
    const handleClickMenu = (type: string) => {
        handleClick(type);
    }
    
    return (
        visibleConText && selectedRowKey > 0 && (
            // <ClassBox className="custom-scrollbar-pkm">
            <Menu className="popup custom-scrollbar-pkm" style={{left: `${x}px`, top: `${y}px`, width: 300 , height : 450, borderRadius: 8}}>
                <Popover overlayClassName="customer-popup-click-right" placement="rightTop" content={
                    arrSubMenu.map((item,index) =>
                        <div key={`sub-menu-${index}`}>
                            <Menu.Item  style={{margin: 0}} disabled={sub===0 }>
                                <div className="w-full h-full" onClick={() => handleClickSubMenu(item.type)}>{item.name}</div>
                            </Menu.Item>
                            {item.hr ? <hr style={{marginTop: 5, marginBottom: 5}}  key={`hr1-sub-${index}`}/> : ""}
                        </div>
                    )
                } trigger="hover">
                    <Menu.Item key="m1-sub" style={{margin: 0}}>
                        <div className="w-full h-full">Edit Group</div>
                        {/* <CIconSvg name="back" colorSvg="origin" svgSize="small" /> */}
                    </Menu.Item>
                </Popover>
                <Menu.Item key="m1" className="button-primary" style={{margin: 0}} disabled>
                    <div className="w-full h-full" onClick={() => handleClickMenu('clickEditGroupRsvn')}>{t("BOOKING.SEARCHVALUE.editGroupRsvn")}</div>
                </Menu.Item>
                <Menu.Item key="m2" className="button-primary" style={{margin: 0, borderBottom: "1px solid #EEEEEE"}} >
                    <div className="w-full h-full" onClick={() => handleClickMenu('clickEditRsvn')}>{t("BOOKING.SEARCHVALUE.editRsvn")}</div>
                </Menu.Item>
                <Menu.Item key="m3" className="button-primary" style={{margin: 0}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('clickActiveRsvn')}>{t("BOOKING.SEARCHVALUE.active")}</div>
                </Menu.Item>
                <Menu.Item key="m4" className="button-danger" style={{margin: 0, color: "red"}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('clickCancelRsvn')}>{t("BOOKING.SEARCHVALUE.cancel")}</div>
                </Menu.Item>
                <Menu.Item key="m5" className="button-danger" style={{margin: 0, color: "red"}} disabled={sub===0 }>
                    <div className="w-full h-full" onClick={() => handleClickMenu('clickUnsetGroupMaster')}>{t("BOOKING.SEARCHVALUE.unsetGroupMaster")}</div>
                </Menu.Item>
                <Menu.Item key="m6" className="button-primary" style={{margin: 0, borderBottom: "1px solid #EEEEEE"}} disabled={sub===0 }>
                    <div className="w-full h-full" onClick={() => handleClickMenu('setGroupMaster')}>{t("BOOKING.SEARCHVALUE.setGroupMaster")}</div>
                </Menu.Item>
                <Menu.Item key="m7" className="button-primary" style={{margin: 0}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('reinstateReservation')}>{t("BOOKING.SEARCHVALUE.reinstate")}</div>
                </Menu.Item>
                <Menu.Item key="m7s" className="button-primary" style={{margin: 0}} disabled={sub===1 }>
                    <div className="w-full h-full" onClick={() => handleClickMenu('break')}>{t("BOOKING.SEARCHVALUE.break")}</div>
                </Menu.Item>
                <Menu.Item key="m8" className="button-primary" style={{margin: 0}} disabled={sub===0 }>
                    <div className="w-full h-full" onClick={() => handleClickMenu('clickCombineGuest')}>{t("BOOKING.SEARCHVALUE.combine")}</div>
                </Menu.Item>
                <Menu.Item key="m9" className="button-primary" style={{margin: 0, borderBottom: "1px solid #EEEEEE"}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('handleConfirmRsvn')}>{t("BOOKING.SEARCHVALUE.confirm")}</div>
                </Menu.Item>
                <Menu.Item key="m10" className="button-primary" style={{margin: 0}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('addToRsvnProfile')}>{t("BOOKING.SEARCHVALUE.addRsvn")}</div>
                </Menu.Item>
                <Menu.Item key="m11" className="button-primary" style={{margin: 0}} disabled={sub===0 }>
                    <div className="w-full h-full" onClick={() => handleClickMenu('addPm')}>{t("BOOKING.SEARCHVALUE.addPm")}</div>
                </Menu.Item>
                <Menu.Item key="m12" className="button-primary" style={{margin: 0}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('showModalAddReservation')}>{t("BOOKING.SEARCHVALUE.addOnRsvn")}</div>
                </Menu.Item>
                <Menu.Item key="m14" className="button-primary" style={{margin: 0}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('showModalAddOnGroupReservation')}>{t("BOOKING.SEARCHVALUE.addOnGroupRsvn")}</div>
                </Menu.Item>
                <Menu.Item key="m15" className="button-primary" style={{margin: 0}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('showConfirmAddSeri')}>{t("BOOKING.SEARCHVALUE.addSeriRsvn")}</div>
                </Menu.Item>
                <Menu.Item key="m16" className="button-primary" style={{margin: 0}} disabled={sub===0 }>
                    <div className="w-full h-full" onClick={() => handleClickMenu('clickAddSharedGuest')}>{t("BOOKING.SEARCHVALUE.addShared")}</div>
                </Menu.Item>
                <Menu.Item key="m17" className="button-primary" style={{margin: 0}}>
                    <div className="w-full h-full" onClick={() => handleClickMenu('showModalAddRsvnToGroup')}>{t("BOOKING.SEARCHVALUE.addRsvnToGroup")}</div>
                </Menu.Item> 
            </Menu>
            // </ClassBox>
        )
    )
}
export default Popup