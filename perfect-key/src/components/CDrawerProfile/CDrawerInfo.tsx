/* eslint-disable */
import React from 'react'
import { Drawer } from "antd";
import { createStyles, useStyleTheme } from 'theme';
import CIconSvg from '../CIconSvg';
import { useDispatchRoot } from 'redux/store';
import { setShowStat } from 'redux/controller';
import { BookingStat } from 'common/model-statistic';
const styleDrawer = createStyles((theme) => ({
    buttonFooterRight: {
        padding: "10px 17px",
        marginLeft: 10,
        "& span": {
            fontWeight: "600 !important",
        }
    },
    buttonFooterLeft: {
        padding: "10px auto",
        width: 100,
        marginRight: 10,
        boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24) !important",
        borderRadius: "4px !important",
        "& span": {
            color: "#00293B",
            fontWeight: "600 !important",
            fontSize: 16,
        }
    },
    drawer: {
        /*         "& .ant-drawer-body": {
                    backgroundColor: '#fbfcfd'
                }, */
        "& .ant-drawer-header": {
            paddingTop: "75px",
        }
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        color: "#00293B",
        alignItems: "center",
        padding: "22px 36px",
        "& .title": {
            fontWeight: 700,
            fontSize: 20
        },
        "& .close-button": {
            color: "#000",
            fontSize: 24,
        }
    },
    blueText: {
        color: "#1A87D7",
        fontWeight: "600"
    }
}))

export default function CDrawerInfo({ ...props }: any): JSX.Element {
    const classes = useStyleTheme(styleDrawer);
    const dispatch = useDispatchRoot()
    const { visible, title, children, propsOnChange, customFooter, zIndex, group, bookingStat } = props;
    const HeaderDrawer = (title: string, bookingStat: BookingStat) => {
        return (
            <>
                <div className={classes.header}>
                    <div className="title">{title}</div>
                    <div className={`flex close-button`} onClick={onClose} style={{ cursor: "pointer" }}>
                        <CIconSvg hexColor="#000" name="close-drawer" svgSize="medium" />
                    </div>
                </div>
                <div className="text-sm flex align-middle items-center pl-7">
                    <div>Group: {" "}
                        <span className={classes.blueText}>
                            <u>{bookingStat?.reservCode}</u>
                        </span>
                    </div>
                </div>
                <div className={`text-sm flex justify-between px-7`}>
                    <div>Room: {" "}
                        <span className={classes.blueText}>
                            <u>{bookingStat?.totalRoom}</u>
                        </span>
                    </div>
                    <div>Guest: {" "}
                        <span className={classes.blueText}>
                            <u>{bookingStat?.totalGuest}</u>
                        </span>
                    </div>
                    <div>Master ID: {" "}
                        <span className={classes.blueText}>
                            <u>{bookingStat?.masterGuest}</u>
                        </span>
                    </div>
                </div>
            </>
        )
    }

    const onClose = () => {
        propsOnChange()
    }

    return (
        <Drawer
            title={HeaderDrawer(title, bookingStat)}
            placement="right"
            visible={visible}
            width={'30%'}
            closable={false}
            getContainer={false}
            destroyOnClose={true}
            onClose={() => dispatch(setShowStat(false))}
            className={classes.drawer}
            footer={customFooter ? customFooter : <></>}
            style={{ zIndex: zIndex }}
        >
            {children}
        </Drawer >
    )
}
