import { GuestProfile } from "./model-profile";

interface Item {
    key: string;
    firstName: string;
    lastName: string;
    title: string;
    passport: string;
    birthday: Date;
    nationality: string;
    room: string;
    roomType: string;
    agent: string;
    arrival: string;
    departure: string;
    groupCode: string;
}
export interface ICTableMember extends Props {
    propsOnChange?: any;
    heightTable?: string;
    heightHeader?: string;
    dataMembers?: any;
    visible?: boolean;
    titleDataMembers?: Item;
    setDataResult: React.Dispatch<React.SetStateAction<GuestProfile[]>>;
}
export interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof Item;
    record: Item;
    handleSave: (record: Item) => void;
}
export interface DataType {
    key: string;
    firstName: string | null;
    lastName: string | null;
    title: string | null;
    passport: string | null;
    birthday: string | null;
    nationality: string | null;
    status: string | null;
    room: string | null;
    roomType: string | null;
    agent: string | null;
    arrival: string | null;
    departure: string | null;
    groupCode: string | null;
    parentMeGuid: string,
    guid: string
}
export interface EditableTableState {
    dataSource: DataType[];
    count: number;
}
