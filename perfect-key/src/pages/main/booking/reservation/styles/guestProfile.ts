import { createStyles } from 'theme'
export const styleInput = createStyles((theme) => ({
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
    buttonStyle: {
        height: "36px !important",
        padding: "4px 17px !important",
        "& span": {
            fontWeight: "600 !important",
            fontSize: 14,
        }
    },
    customAutoComplete : {
        "& .ant-select-selector": {
            "&:hover" : {
                border: "none"
            }
        }
    }
}))