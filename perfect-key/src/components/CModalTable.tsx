/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button } from 'antd';
import CIconSvg from 'components/CIconSvg';
import React from 'react';
import { createStyles, useStyleTheme } from 'theme'
import { useTranslation } from "react-i18next"
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
        "& .ant-modal-body": {
            padding: "16px",
        }, 
        "& .ant-modal-content": {
            overflow: "auto",
            borderRadius: "6px",
        },
        "& .ant-modal-close-x": {
            display: "flex",
            justifyContent: "center",
        },
    },
}));
interface PropsModal {
    title: string | React.ReactNode,
    visible: boolean,
    onCancel(): void,
    onOk?: any,
    content: React.ReactNode | React.ReactNodeArray;
    width?: string | number | undefined;
    style?: React.CSSProperties;
    zIndex?: number,
    isFooter?: boolean,
    myForm?: string,
    isLoading?: boolean
}

const CModelTable = ({ title, visible, onCancel, onOk, content, width, style, zIndex, myForm, isLoading = false, isFooter = true }: PropsModal): JSX.Element => {
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
            footer={ isFooter ?
                <>
                    <div className="">
                        <Button
                            style={{ color: "#F74352", border: "1px solid #F74352" }}
                            className={`!rounded-md ${classes.buttonStyle}`}
                            onClick={() => onCancel()}
                        >
                            {t("BOOKING.RESERVATION.EDITRESERVATION.close")}
                        </Button >
                        <Button
                            form={myForm}
                            type="primary" htmlType="submit"
                            className={`!rounded-md ${classes.buttonStyle}`}
                            loading={isLoading}
                            onClick={() => onOk()}
                        >
                            Ok
                        </Button>
                    </div >
 
                </>
                : null
            }
        >
            {content}
        </Modal >
    );
};

export default CModelTable;
