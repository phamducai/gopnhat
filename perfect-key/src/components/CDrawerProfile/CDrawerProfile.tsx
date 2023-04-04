/* eslint-disable */
import React from 'react'
import { Drawer, Button } from "antd";
import { createStyles, useStyleTheme } from 'theme';
import CIconSvg from '../CIconSvg';
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
        "& .ant-drawer-body": {
            backgroundColor: '#fbfcfd'
        },
        "& .ant-drawer-header": {
            padding: 0
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
            color: "#F74352",
            fontSize: 14,
        }
    }

}))

export default function CDrawerProfile({ ...props }: any): JSX.Element {
    const onSubmit = () => {
        propsOnSubmit()
        propsOnChange()
    }
    const classes = useStyleTheme(styleDrawer);
    const HeaderDrawer = (title: string) => {
        return (
            <div className={classes.header}>
                <div></div>
                <div className="title">{title}</div>
                <div className={`flex close-button`} onClick={onClose} style={{ cursor: "pointer" }}>
                    <span className={`mr-2 font-semibold`}>Close</span>
                    <CIconSvg hexColor="#F74352" name="close-drawer" svgSize="small" />
                </div>
            </div>
        )
    }
    const FooterDrawer = (isCompanyProfile: boolean) => {
        return (
            <div className="flex justify-between m-auto" style={{ width: 951 }}>
                <div className={"footer-left"}>
                    <Button className={`${classes.buttonFooterLeft}`}>Print</Button>
                    <Button className={`${classes.buttonFooterLeft}`}>To ISS</Button>
                    <Button className={`${classes.buttonFooterLeft}`}>Member</Button>
                </div>
                <div className={"footer-right gap-1"}>
                    <Button className={`${classes.buttonFooterRight} !rounded-md`} onClick={onClose} style={{ color: "#F74352", border: "1px solid #F74352" }}>Cancel</Button>
                    <Button className={`${classes.buttonFooterRight} !rounded-md`} onClick={onSubmit} style={{ background: "#1A87D7", color: "white" }} >Ok</Button>
                </div>
            </div>
        )
    }

    const { visible, title, children, propsOnSubmit, propsOnChange, isCompanyProfile, customFooter, zIndex } = props;
    const onClose = () => {
        propsOnChange()
    }

    return (
        <Drawer
            // className={`${classes.header}`}
            title={HeaderDrawer(title)}
            placement="right"
            visible={visible}
            width={"100%"}
            closable={false}
            className={classes.drawer}
            footer={customFooter ? customFooter : FooterDrawer(isCompanyProfile)}
            style={{ zIndex: zIndex }}
            destroyOnClose={true}
        >
            {children}
        </Drawer >
    )
}
