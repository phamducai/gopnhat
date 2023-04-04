/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button } from 'antd';
import CIconSvg from 'components/CIconSvg';
import React from 'react';
import { createStyles, useStyleTheme } from 'theme';
import { useTranslation } from "react-i18next";
export const styleReservation = createStyles((theme) => ({
    buttonStyle: {
        height: "36px !important",
        padding: "4px 17px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    },
    titleStyle: {
        color: "#00293B",
        fontWeight: 600,
        fontSize: "16px",
    },
    antModalStyle: {
        "& .ant-modal-content": {
            overflow: "auto",
            borderRadius: "6px",
        },
        "& .ant-modal-close-x": {
            display: "flex",
            justifyContent: "center",
        },
    },
    buttonFooterLeft: {
        padding: "10px auto",
        width: 100,
        height: "36px !important",
        marginRight: 10,
        // boxShadow: "0px 2px 6px rgba(8, 35, 48, 0.2), 0px 1px 2px rgba(8, 35, 48, 0.24) !important",
        borderRadius: "4px !important",
        "& span": {
            color: "#00293B",
            fontWeight: "700 !important",
            fontSize: 16,
        }
    },
    buttonFooterLeftDisable: {
        backgroundColor: '#F5F6F7 !important',
        color: '#acb9bf !important',
        boxShadow: 'none !important',
        "&.ant-btn[disabled], .ant-btn[disabled]:hover, .ant-btn[disabled]:focus, .ant-btn[disabled]:active": {
            border: "none !important"
        },
        "& .btn": {
            color: '#00293B',
            opacity: '0.3',
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '20px'
        }
    },
}));
interface PropsModal {
    title: string | React.ReactNode,
    visible: boolean,
    onCancel: any,
    onRes?: any,
    onDone?: any,
    content: React.ReactNode | React.ReactNodeArray;
    width?: string | number | undefined;
    style?: React.CSSProperties;
    zIndex?: number,
    showFromExcel?: boolean,
    myForm?: string,
    isLoading?: boolean,
    disableBtn?: boolean,
    disableEdit?: boolean,
    disableClose?: boolean,
    visibleRes?: boolean
}

const CModelControl = ({ title, visible, onCancel, onRes, content, width, style, zIndex, myForm, 
    isLoading = false, disableBtn = true, visibleRes = false, disableEdit = true, disableClose}: PropsModal): JSX.Element => {
    const classes = useStyleTheme(styleReservation);
    const { t } = useTranslation("translation");
    return (
        <Modal
            title={<span className={`${classes.titleStyle}`}>{title}</span>}
            visible={visible}
            destroyOnClose={true}
            className={classes.antModalStyle}
            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => onCancel()} />}
            width={width}
            style={style}
            zIndex={zIndex}
            footer={
                <div className="flex justify-around m-auto w-full">
                    <div >
                        <Button disabled={disableEdit} className={`${classes.buttonFooterLeft} flex items-center`}>
                            <div className="btn flex justify-center font-bold">
                                Edit
                            </div>
                        </Button>
                        {visibleRes ?
                            <Button className={`${classes.buttonFooterLeft} flex items-center`}
                                type='primary' onClick={() => onRes()}>
                                <div className="btn flex justify-center font-bold">
                                    Mark as Res.
                                </div>
                            </Button>
                            :
                            <Button disabled={disableBtn} className={`${classes.buttonFooterLeft} flex items-center`}>
                                <div className="btn flex justify-center font-bold">
                                    Resolved
                                </div>
                            </Button>
                        }
                    </div>
                    <div className="footer-right">
                        <Button
                            style={{ color: "#F74352", border: "1px solid #F74352", marginRight: "-100%" }}
                            className={`!rounded-md ${classes.buttonStyle}`}
                            disabled={disableClose}
                            onClick={() => onCancel()}
                        >
                            {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                        </Button >
                    </div>
                </div >
            }
        >
            {content}
        </Modal >
    );
};

export default CModelControl;
