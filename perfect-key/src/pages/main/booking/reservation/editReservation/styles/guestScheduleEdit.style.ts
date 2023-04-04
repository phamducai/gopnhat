import { createStyles } from 'theme';
export const styleInput = createStyles((theme) => ({
    title : {
        color : '#00293B'
    },
    inputReservation: {
        background: "#E7E7E7",
    },
    input: {
        background: "#F5F6F7",
        borderRadius: 6,
        border: "1px solid #E7E7E7",
    },
    selectBackground: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            height: "40px !important",
            alignItems: "center !important",
            borderRadius: "6px !important",
            '& span': {
                '& .ant-select-selection-search-input': {
                    height: "38px !important"
                }
            }
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        },
    },
    btnStyle: {
        height: "40px !important",
        padding: "4px 15px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        },
        marginTop: "1.36rem"
    },
    textArea: {
        "& textarea.ant-input":
        {
            height: "100%",
            borderRadius: 6,
            backgroundColor: "#F5F6F7",
        }
    },
    selectBackgroundTest: {
        "& .ant-select-selector": {
            backgroundColor: "#F5F6F7 !important",
            borderRadius: "4px !important",
            minHeight: "40px !important",
            display: "flex",
            alignItems: "center",
        },
        '& .ant-select-arrow': {
            color: "#1A87D7"
        }
    },
    buttonStyle: {
        height: "40px !important",
        padding: "2px 8px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    },
    datePicker: {
        borderRadius: "6px !important",
        height: "40px !important",
        "& .ant-picker-suffix": {
            color: "#1A87D7",
        }
    },
    titleCheckbox: {
        color: "#00293B"
    },
    styleCheckbox : {
        '& .ant-checkbox-wrapper' : {
            '& span' : {
                paddingRight : '2px !important'
            }
        }
    },
    charge: {
        "& .ant-input-wrapper": {
            height: 40,
            "& .ant-input-group-addon": {
                borderBottomLeftRadius: 6,
                borderTopLeftRadius: 6,
                background: "linear-gradient(180deg, #E8E8E8 0%, #CECECE 100%)",
                color: "#00293B",
                fontWeight: 600,
                textAlign: "left",
                opacity: 1,
                width: 50,
            },
            "& .ant-input": {
                background: "#F5F6F7",
                borderBottomRightRadius: 6,
                borderTopRightRadius: 6,
                height: 40
            }
        },
        "& .ant-input-group-addon": {
            cursor: "pointer"
        }
    },
    stypeFixCharge : {
        height : "150px",
        width : "100%",
        background: "rgba(26, 135, 215, 0.05)",
        //backgroundImage: 'radial-gradient(circle at 0px 10px, red 6px, rgba(26, 135, 215, 0.05) 6px)',
        borderRadius: 6,
        border: "1px dashed #1A87D7",
    },
    styleCircleLeft : {
        position : 'absolute',
        height : "14px",
        width : "14px",
        border : "1px dashed #1A87D7",
        borderLeft : 0,
        borderTop : 0,
        borderBottom : 0,
        borderTopRightRadius : "100%",
        borderBottomRightRadius : "100%",
        background : "#FFFFFF",
        top : "59%",
        left : "-0.3rem"
    },
    styleCircleRight : {
        position : 'absolute',
        height : "14px",
        width : "14px",
        border : "1px dashed #1A87D7",
        borderRight : 0,
        borderTop : 0,
        borderBottom : 0,
        borderTopLeftRadius : "100%",
        borderBottomLeftRadius : "100%",
        background : "#FFFFFF",
        top : "59%",
        right : "-0.3rem"
    },
    stypeFixChargeInfo : {
        height : "110px",
        width : "100%",
    },
    stypeFixChargeTotal : {
        height : "40px",
        width : "100%",
        borderTop: "1px dashed #1A87D7",
    },
    backGround: {
        background: "#1A87D7"
    }
}))