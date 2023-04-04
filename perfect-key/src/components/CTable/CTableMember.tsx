/* eslint-disable */
import React, { useState, RefObject, useRef } from "react";
import { Select, Table, Input } from "antd";
import { createStyles, ThemeDefine, useStyleTheme } from "theme";
import { styleReinstateTable } from "components/CStyleTable";
import CLoading from "components/CLoading";
import "./style.css";
import Utils from "common/utils";
import {
    ICTableMember,
    DataType,
} from "../../common/define-table-member";
import { useDispatchRoot, useSelectorRoot } from "redux/store";
import {
    getGuestDetailsOptionsRequest,
    getGuestMoreDetailsRequest,
} from "redux/controller/reservation.slice";
import { useTranslation } from "react-i18next";
import { ColumnProps } from "antd/lib/table";
import DatePicker from "components/CDatePicker";

const CTableMember = ({
    visible,
    dataMembers,
    propsOnChange,
    heightTable,
    heightHeader,
    setDataResult,
    ...props
}: ICTableMember): JSX.Element => {
    const styleCTableMember = createStyles((theme: ThemeDefine) => ({
        table: {
            height: `calc(${theme.height.fullScreen} - (${heightHeader} + ${theme.height.navbar} + ${theme.height.paddingYPage}))`,
            "& .text-center": {
                textAlign: "center"
            }
        },
        trColorGuest: {
            color: "#00293B",
        },
        trColorGuestMain: {
            color: "#1A87D7",
        },
        fontWeight: {
            fontWeight: "600",
            color: '#1A87D7'
        },
        selectBackground: {
            "& .ant-select-selector": {
                backgroundColor: "#F5F6F7 !important",
                height: "40px !important",
                alignItems: "center !important",
                borderRadius: "6px !important",
            },
            "& .ant-select-arrow": {
                color: "#1A87D7",
            },
        },
        input: {
            background: "#F5F6F7",
            border: "1px solid #E7E7E7",
            borderRadius: "6px",
            height: "40px",
            padding: "0 10px",
            "& .ant-input": {
                background: "#F5F6F7",
            },
        },
        tableEdit: {
            "& :hover div input": {
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '5px 35px 5px 0px',
            }
        },
        inputEdit: {
            cursor: "pointer",
            "& * :hover ": {
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                padding: '5px 35px 5px 0px',
            }
        },
        fullWfullH: {
            height: "100%",
            width: "100%",
            display: "flex !important",
            alignItems: "center !important",
            justifyContent: "center !important"
        }
    }));

    const classes = useStyleTheme(styleReinstateTable);
    const classesTable = useStyleTheme(styleCTableMember);
    const [isEditingRow, setisEditingRow] = useState();
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef: RefObject<any> = useRef<any>()
    const [flag, setFlag] = React.useState(true);
    const { t } = useTranslation("translation")
    const dispatch = useDispatchRoot();
    const { hotelId } = useSelectorRoot((state) => state.app);
    const { guestDetailOptions } = useSelectorRoot(
        (state) => state?.rsvn
    );


    const renderSelect = (data: any) => {
        return data?.map((item: any) => {
            return (
                <Select.Option value={item.guid} key={item.guid}>
                    {item.ten}
                </Select.Option>
            );
        });
    };
    const columns: ColumnProps<DataType>[] = [
        {
            title: "Status",
            dataIndex: "status",
            className: "text-center",
        },
        {
            title: "Group Code",
            dataIndex: "groupCode",
            className: "text-center",
        },
        {
            title: "Room Type",
            dataIndex: "roomType",
            className: "text-center",
        },
        {
            title: "Room",
            dataIndex: "room",
            className: "text-center",
        },
        {
            title: "Agent/Company",
            dataIndex: "agent",
            className: "text-center",
            width: "150px"
        },
        {
            title: "Arrival",
            dataIndex: "arrival",
            className: "text-center",
        },
        {
            title: "Departure",
            dataIndex: "departure",
            className: "text-center",
        },
        {
            title: "First Name",
            dataIndex: "firstName",
            className: "text-center",
            render: (text, record, index) => (
                isEditingRow == index ?
                    <Input
                        onPressEnter={() => handleEditRow(-1, record)}
                        onChange={(e: any) => handleInputChange(e, index, "firstName")}
                        name="firstName" type="text"
                    /> :
                    <div className={`${classes.inputEdit} ${classesTable.fullWfullH}`}
                        style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}

                    >
                        {text}
                    </div>
            ),
        },
        {
            title: "Last Name",
            dataIndex: "guestName",
            className: "text-center",
            render: (text, record, index) => (
                isEditingRow == index ?
                    <Input
                        onPressEnter={() => handleEditRow(-1, record)}
                        onChange={(e: any) => handleInputChange(e, index, "guestName")}
                        name="guestName" type="text"
                    />
                    :
                    <div className={`${classes.inputEdit} ${classesTable.fullWfullH}`} style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}>
                        {text}
                    </div>
            ),
        },
        {
            title: "Title",
            dataIndex: "titlesGuid",
            className: "text-center",
            render: (text, record, index) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    defaultValue={text}
                    className={`${classesTable.fullWfullH}`}
                    onSelect={(e) => handleInputChange(e, index, "titlesGuid")}
                >
                    {renderSelect(guestDetailOptions?.guestTitle)}
                </Select>
            ),
        },
        {
            title: "Passport",
            dataIndex: "passport",
            className: "text-center",
            render: (text, record, index) => (
                isEditingRow == index ?
                    <Input
                        onPressEnter={() => handleEditRow(-1, record)}
                        onChange={(e: any) => handleInputChange(e, index, "passport")}
                        name="passport" type="text" />
                    :
                    <div className={`${classes.inputEdit} ${classesTable.fullWfullH}`} style={{ paddingRight: 24 }}
                        onClick={() => { handleEditRow(index, record) }}>
                        {text}
                    </div>
            ),
        },
        {
            title: "Birthday",
            dataIndex: "birthDay",
            className: "text-center",
            width: "200px",
            render: (text, record, index) => (
                < DatePicker
                    value={new Date(text)}
                    className={`flex align-middle justify-center`}
                    onChange={e => handleInputChange(e, index, "birthDay")}
                    name="birthDay"
                />
            ),
        },
        {
            title: "Nationality",
            dataIndex: "nationalityGuid",
            className: "text-center",
            width: "150px",
            render: (text, record, index) => (
                <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    className={`${classesTable.fullWfullH}`}
                    onSelect={(e) => handleInputChange(e, index, "nationalityGuid")}
                    defaultValue={text}
                >
                    {renderSelect(guestDetailOptions?.nationality)}
                </Select>
            ),
        },
    ];

    const handleEditRow = (index: any, record: any) => {
        setisEditingRow(index);
        setFlag(!flag);
    }

    const handleInputChange = (e: any, index: number, name: string, value?: any) => {
        if (name === "firstName") {
            dataMembers[index][name] = e.target.value;
        }
        if (name === "guestName") {
            dataMembers[index][name] = e.target.value;
        }
        if (name === "passport") {
            dataMembers[index][name] = e.target.value;
        }
        if (name === "nationalityGuid") {
            dataMembers[index][name] = e;
        }
        if (name === "titlesGuid") {
            dataMembers[index][name] = e;
        }
        if (name === "birthDay") {
            console.log(e);
            dataMembers[index][name] = Utils.formatDate(e)

        }
        setFlag(!flag);
    }

    React.useEffect(() => {
        if (isEditingRow)
            inputRef?.current?.focus();
    }, [isEditingRow])
    React.useEffect(() => {
        setDataResult(dataMembers)
    }, [dataMembers])
    React.useEffect(() => {
        try {
            setLoading(true);
            dispatch(getGuestDetailsOptionsRequest(hotelId));
            dispatch(getGuestMoreDetailsRequest(hotelId));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        //eslint-disable-next-line
    }, []);

    return (
        <CLoading visible={loading} className={props.className}>
            <Table
                dataSource={dataMembers}
                columns={columns}
                className={` ${classes.table} ${classesTable.table}`}
                pagination={false}
                scroll={{ y: 400, x: 1600 }}
                rowClassName={(record, index: number) => {
                    return record.guid ? (record.parentMeGuid ? classesTable.trColorGuest : classesTable.trColorGuestMain) : classesTable.fontWeight
                }}
            />
        </CLoading>
    );
};
export default React.memo(CTableMember);
