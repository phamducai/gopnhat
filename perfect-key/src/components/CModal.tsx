/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Button, Upload } from 'antd';
import CIconSvg from 'components/CIconSvg';
import React from 'react';
import * as XLSX from 'xlsx';
import { createStyles, useStyleTheme } from 'theme'
import { useTranslation } from "react-i18next"
import openNotification from './CNotification';
import { NotificationStatus } from 'common/enum/shared.enum';
import { useDispatchRoot } from 'redux/store';
import { readExcelRequest } from 'redux/controller';
import clsx from 'clsx';
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
    antModalBody: {
        "& .ant-modal-content": {
            overflow: "auto",
            borderRadius: "6px",
            "& .ant-modal-body": {
                padding: 0
            }
        },
        "& .ant-modal-close-x": {
            display: "flex",
            justifyContent: "center",
        },
    }
}));
interface PropsModal {
    title: string | React.ReactNode,
    visible: boolean,
    onCancel(): void,
    onOk(e:any): void,
    content: React.ReactNode | React.ReactNodeArray;
    width?: string | number | undefined;
    style?: React.CSSProperties;
    zIndex?: number,
    showFromExcel?: boolean,
    myForm?: string,
    isLoading?: boolean,
    isShowFooter?: boolean,
    className?: any,
    disableBtn?: boolean
}

const CModel = (props: PropsModal): JSX.Element => {
    const { title, visible, onCancel, onOk, content, width, style, zIndex, myForm, isLoading = false, showFromExcel = false, isShowFooter = true, className = "", disableBtn = false } = props
    const classes = useStyleTheme(styleReservation);
    const { t } = useTranslation("translation");
    const dispatch = useDispatchRoot();
    //eslint-disable-next-line
    const dummyRequest = ({ onSuccess }: any): void => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <Modal
            title={<span className={`${classes.titleStyle}`}>{title}</span>}
            visible={visible}
            destroyOnClose={true}
            className={clsx(classes.antModalStyle, className)}
            closeIcon={<CIconSvg name="close-drawer" hexColor="#F74352" svgSize="default" onClick={() => onCancel()} />}
            width={width}
            style={style}
            zIndex={zIndex}
            footer={isShowFooter &&
                <>
                    <div className="">
                        {showFromExcel &&
                            <Upload
                                name='file'
                                customRequest={dummyRequest}
                                showUploadList={false}
                                onChange={(info) => {
                                    if (info.file.status === 'done') {
                                        try {
                                            const reader = new FileReader();
                                            reader.onload = (evt) => { // evt = on_file_select event
                                                /* Parse data */
                                                const bstr = evt.target?.result;
                                                const wb = XLSX.read(bstr, { type: 'binary', cellDates: true, dateNF: 'mm/dd/yyyy;@' });
                                                /* Get first worksheet */
                                                const wsname = wb.SheetNames[0];
                                                const ws = wb.Sheets[wsname];
                                                /* Convert array of arrays */
                                                const data = XLSX.utils.sheet_to_json(ws,
                                                    { header: 1, raw: false });
                                                /* Update state */
                                                dispatch(readExcelRequest({ data: data.filter((dt: any) => dt.length > 0) }));
                                            };
                                            openNotification(NotificationStatus.Success, "Success", "Read File Success");
                                            if (info.file.originFileObj)
                                                reader.readAsBinaryString(info.file.originFileObj)

                                        } catch (error) {
                                            console.log(error);
                                        }
                                    } else if (info.file.status === 'error') {
                                        openNotification(NotificationStatus.Error, "Failed", "Failed to Read File");
                                    }
                                }}
                                className="float-left">
                                <Button
                                    style={{ color: "#F74352", border: "1px solid #F74352" }}
                                    className={`!rounded-md ${classes.buttonStyle}`}
                                >
                                    From Excel
                                </Button >
                            </Upload>
                        }
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
                            disabled={disableBtn}
                            onClick={onOk}
                        >
                            Ok
                        </Button>
                    </div >
                </>
            }
        >
            {content}
        </Modal >
    );
};

export default CModel;
