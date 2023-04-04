/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataFoTransactRoomDTO } from "common/model-rsvn";
export interface ICFormSearch extends Props {
  isLoading?: boolean;
  propsOnChange?: any;
  selectCompanyAgent?: any;
  loadingSearchProfile?: boolean;
  companyAgent: any;
}
export interface ICTableBooking extends Props {
  selectedViewStyle?: string;
  reservatedRooms?: any;
  room: any;
  onClickValue?: any;
  hiddenCollapse: boolean;
  heightHeader?: number;
  handleAddBooking?: any;
}
export interface ICHeaderBooking extends Props {
  //eslint-disable-next-line
  setSelectedDate?: any;
  visible?: boolean;
}

export interface IFormSearch {
  pageNumber: number,
  pageSize:  number,
  isOnlyMainGuest: boolean;
  searchBy: string;
  rsvn: string;
  room: string;
  id: string;
  groupCode: string;
  phone: string;
  passport: string;
  firstName: string;
  guestName: string;
  dateArrival: any;
  companyAgent: string;
  dateDeparture: any;
  roomType?: string;
  availableDate?: any;
}

export interface dataFOReservation {
  reservationDate: string;
  bookedBy: string;
  ccno: string;
  ccexpDate: string;
  ccmadeBy: number;
  comments: string;
  status: number;
  flagType: number;
  bookByPhone: string;
  bookByFax: string;
  bookByEmail: string;
  guid: string;
  hotelId: number;
  hotelGuid: string;
  confirmNum: number;
  groupName: string;
}

export interface FormQueryParam {
  hotelGuid: string;
  rsvnCode: string;
  status: number;
  profileIds: any[];
  companyAgentGuid: string;
  roomType: string;
  arrivalDates: any[];
  departureDates: any[];
  availableDate?: any;
}

export interface IQueryParam {
  id: number;
  guestId: string;
  arrivalDate: string;
  departureDate: string;
  rate: number;
  rateCode: string;
  roomType: string;
  fixedRate: boolean;
  comments: string;
  flightNo: string;
  printRate: boolean;
  status: number;
  flagType: number;
  groupMaster: string;
  cutOfDate: string;
  arrivalPickUp: boolean;
  departurePickUp: boolean;
  confirmed: boolean;
  resSource: string;
  resMarket: string;
  packageCodes: string;
  specialsCodes: string;
  isNet: boolean;
  guid: string;
  parentGuid: string;
  parentMeGuid: string;
  hotelId: number;
  hotelGuid: string;
  isNoBkf: boolean;
  resChanel: string;
  carPickUp: string;
  carPickUpTime: string;
  companyAgentGuid: string;
  dataForeservation: DataForeservation;
  transactRoomsGroup: TransactRoomsGroup;
}
export interface TransactRoomsGroup {
  arrivalDate: string | null;
  departureDate: string | null;
  mainGuest: string | null;
  mappingRoomId: string | null;
  roomName: string | null;
  roomType: string | null;
  status: number;
}
interface DataForeservation {
  id: number;
  reservationDate: string;
  bookedBy: string;
  ccno: string;
  ccexpDate: string;
  ccmadeBy: number;
  comments: string;
  status: number;
  flagType: number;
  bookByPhone: string;
  bookByFax: string;
  bookByEmail: string;
  guid: string;
  hotelGuid: string;
  confirmNum: number;
  groupName: string;
  reservCode?: string,
  groupCode?: string
}

export interface ISearchRequest {
  hotelGuid: string;
  arrivalDates?: any[];
  departureDates?: any[];
  companyAgentGuid?: string;
  status?: unknown;
  rsvnCode?: any;
  profiles: {
    phone: string;
    passport: string;
    firstName: string;
    guestName: string;
  };
  roomType?: string;
  listRoomType: any;
}

export interface IAddSharedReservation {
  mainTrsRoom: string | null;
  shareGuests: DataFoTransactRoomDTO[];
}
export interface IFormSearchReq {
  firstName?: string,
  guestName?: string,
  pageNumber?: number,
  pageSize?: number,
  isOnlyMainGuest: boolean,
  hotelGuid: string,
  rsvnId?: string | number,
  rsvnNo?: string | number,
  rsvnCode: string,
  room?: string,
  status: number,
  profileIds: any[],
  companyAgentGuid: string,
  roomType: string,
  arrivalDates: any,
  departureDates: any,
  groupCode: string, 
  phone?: string
  passport?: string
}