/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ICTableSearchResults extends Props {
    propsOnChange?: any,
    heightTable?: string,
    heightHeader?:string,
    dataSearchResults?: any[] | undefined
    visible?: boolean,
    titleDataSearchResults: any,
    handleClickContextMenu: any
}
export interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

export interface SearchResultsTreeTables {
    arrival: any,
    code: any,
    comments: any,
    departure: any,
    fullName: any,
    groupCode: any,
    guestId: any,
    guid: any,
    key: any,
    parentGuid: any,
    parentMeGuid: any,
    rate: any,
    room: any,
    roomType: any,
    rsvnNo: any,
    status: any,
    children?: SearchResultsTreeTables[] | null,
}

export const SEARCH_RESULTS_DEFAULT: SearchResultsTreeTables = {
    arrival: '',
    code: '',
    comments: '',
    departure: '',
    fullName: '',
    groupCode: '',
    guestId: '',
    guid: '',
    key: '1',
    parentGuid: '',
    parentMeGuid: '',
    rate: '',
    room: '',
    roomType: '',
    rsvnNo: '',
    status: '',
    children: [],
}

export interface PropsModal extends Props {
    visibleModal: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    arrivalDate: Date,
    setArrivalDate: React.Dispatch<React.SetStateAction<Date>>
    departureDate: Date
    setDepartureDate: React.Dispatch<React.SetStateAction<Date>>,
    children: string,
    name: string,
    isOnlyMainGuest: boolean
    setIsOnlyMainGuest: React.Dispatch<React.SetStateAction<boolean>>,
    setIsCancel: React.Dispatch<React.SetStateAction<boolean>>

}

export const columnsTableGuestProfile: any = [
    {
        title: 'Room',
        dataIndex: 'room',
        width: "100px"
    },
    {
        title: 'Full Name',
        dataIndex: 'fullName',
        width: "180px"
    },
    {
        title: 'Rate',
        dataIndex: 'rate',
        width: "140px"

    },
    {
        title: 'Passport',
        dataIndex: 'passport',
        width: "120px"
    },
    {
        title: 'Mobile',
        dataIndex: 'mobile',
        width: "140px"
    },
    {
        title: 'Birth of Day',
        dataIndex: 'birthday',
        width: "140px"
    },
    {
        title: 'Room Type',
        dataIndex: 'roomType',
        width: "140px"
    },
    {
        title: 'Arrival',
        dataIndex: 'arrival',
        width: "140px"
    },
    {
        title: 'Departure',
        dataIndex: 'departure',
        width: "140px"
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: "100px"
    },
    {
        title: 'Age',
        dataIndex: 'age',
        width: "100px"
    },
    {
        title: 'Note',
        dataIndex: 'comments',
        width: "180px"
    },
    {
        title: 'Mobile Phone',
        dataIndex: 'mobile',
        width: "140px"
    },
];