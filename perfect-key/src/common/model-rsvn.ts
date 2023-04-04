/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataForeservation } from "common/define-api-booking";
import { TransactRoomsGroup } from "./define-booking";

export interface SelectedBookingRoomType {
    key: string | null;
    Roomtype: string | null;
    Available: number | null;
    Rooms: number;
    Guest: number;
    Rate: number;
    Edit: string | null;
    TotalRooms: number;
    roomTypeGuid: string | null
}
export interface DataFoTransactRoomDTO {
  id: number;
  guestId: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  rate: number;
  rateCode: string | null;
  roomType: string | null;
  fixedRate: boolean;
  comments: string | null;
  flightNo: string | null;
  printRate: boolean;
  status: number;
  flagType: number;
  nights: number;
  cutOfDate: Date | null;
  arrivalPickUp: boolean;
  departurePickUp: boolean;
  confirmed: boolean;
  resSource: string | null;
  resMarket: string | null;
  packageCodes: string | null;
  specialsCodes: string | null;
  isNet: boolean;
  guid: string | null;
  parentGuid: string | null;
  hotelId: number;
  hotelGuid: string | null;
  isNoBkf: boolean;
  resChanel: string | null;
  origin: string | null;
  resType: string | null;
  paymentMethod: string | null;
  carPickUp: string | null;
  carPickUpTime: string | null;
  companyAgentGuid: string | null;
  room?: string | null;
  roomTypeUgr?: string | null;
  rateRef?: number | null;
  deposit?: number | null;
  adults?: number | null;
  childs?: number | null;
  noPost?: boolean | null;
  houseUse?: boolean | null;
  comp?: boolean | null;
  arrival?: Date | null;
  departure?: Date | null;
  nguoiDung2: string;
  nguoiDung?: string
}

export interface DataFoTransactRoomEditGroupDTO {
  id?: number;
  guestId?: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  rate: number;
  rateCode: string | null;
  roomType?: string | null;
  fixedRate: boolean;
  comments?: string | null;
  flightNo?: string | null;
  printRate: boolean;
  status?: number;
  flagType: number;
  nights: number;
  cutOfDate: Date | null;
  arrivalPickUp: boolean;
  departurePickUp: boolean;
  confirmed: boolean;
  resSource: string | null;
  resMarket: string | null;
  packageCodes: string | null;
  specialsCodes: string | null;
  isNet: boolean;
  guid?: string | null;
  parentGuid: string | null;
  hotelId: number;
  hotelGuid: string | null;
  isNoBkf: boolean;
  resChanel: string | null;
  origin: string | null;
  resType: string | null;
  paymentMethod: string | null;
  carPickUp: string | null;
  carPickUpTime: string | null;
  companyAgentGuid: string | null;
  room?: string | null;
  roomTypeUgr?: string | null;
  rateRef?: number | null;
  deposit?: number | null;
  adults?: number | null;
  childs?: number | null;
  noPost?: boolean | null;
  houseUse?: boolean | null;
  comp?: boolean | null;
  arrival?: Date | null;
  departure?: Date | null;
}

export interface RoomTypeIdnCounts {
    roomType: string | null;
    count: number;
    guestGuid: string[];
    maxPerson: number;
    totalRooms: number;
    rate: number;
    mappingRooms: RoomShortInfo[];
}

export interface DataForeservationDTO {
    reservationDate: string | null;
    bookedBy: string | null;
    ccno: string | null;
    ccexpDate: string | null;
    ccmadeBy: number;
    comments: string | null;
    status: number;
    flagType: number;
    bookByPhone: string | null;
    bookByFax: string | null;
    bookByEmail: string | null;
    guid: string | null;
    hotelId: number;
    hotelGuid: string | null;
    confirmNum: number;
    groupName: string | null;
    groupCode: string | null;
}

export interface FlyInfor {
    flyArrival: string | null;
    arrival: string | null;
    flyDeparture: string | null;
    departure: string | null;
    remark: string | null;
    hotelGuid: string | null;
}

export interface Pickup {
    longtitude: number;
    latitude: number;
    maDiemDon: string | null;
    tenDiemDon: string | null;
    dienThoai: string | null;
    ghiChu: string | null;
    pickUpVehicle: string | null;
    pickUpTime: string | null;
    nguoiDung: number;
    tgtn: string | null;
    nguoiDung2: number;
    tgtn2: string | null;
    isDeleted: boolean;
    status: number;
    diemTraKhach: string | null;
    pickUpVehicleDeparture: string | null;
    hotelGuid: string | null;
}

export interface DataFoextraCharge{
  id?: number,
  guid?: string,
  parent: number,
  inHouse: number,
  taiKhoan: number,
  maTk: string | number | null,
  tenTk: string | null,
  soLuong: number,
  donGia: number,
  thanhTien: number,
  flagType: number,
  nguoiDung: number,
  nguoiDung2: number,
  ghiChu: string | null,
  ngayThang?: string | null,
  kieuNgay: number,
  tuNgay: number,
  denNgay: number,
  autoPost: boolean | string,
  hotelGuid: string | null,
  inHouseGuid?: string,
  dataFoextraChargeDetails?: DataFoextraChargeDetails[] | null
}
export interface DataFoextraChargeDetails{
  id?: number,
  guid?: string | null,
  parent: number,
  parentGuid: string | null,
  inHouse: number,
  inHouseGuid: string | null,
  ngayThang: string| null,
  maTk: string,
  tenTk: string,
  soLuong: number,
  donGia: number,
  thanhTien: number,
  status: number,
  nguoiDung: number,
  tgtn: string | null,
  nguoiDung2: number,
  tgtn2: string | null,
  ghiChu: string,
  ngayThu: number,
  autoPost: boolean | string,
  tuNgay: number,
  denNgay: number,
  hotelGuid: string | null
}
export interface RemainRSVN {
    isRemain: boolean;
    rsvnId: string | null;
    confirmed: boolean;
    groupCode: string | null;
}
export interface NewReservationData {
    remainRSVN: RemainRSVN | null,
    dataFotransactRoomDTO: DataFoTransactRoomDTO,
    masterGuestGuid: string | null,
    roomTypeidnCounts: RoomTypeIdnCounts[]
    dataForeservationDTO: DataForeservationDTO,
    flyInfor: FlyInfor,
    pickup: Pickup,
    dataFoextraCharges: DataFoextraCharge[]
}
export interface ICombineGuest {
    id: number;
    guid: string;
    fullName: string;
    dataForeservation: DataForeservation;
    ten: string;
}
export interface IExtraGuest{
  guid: string,
  fullName: string
}
export interface ReservationData {
    id: number;
    reservationDate: string | null;
    bookedBy: string | null;
    reservCode: string | null;
    ccno: string | null;
    ccexpDate: string | null;
    ccmadeBy: number;
    comments: string | null;
    status: number;
    flagType: number;
    bookByPhone: string | null;
    bookByFax: string | null;
    bookByEmail: string | null;
    guid: string | null;
    hotelGuid: string | null;
    confirmNum: number;
    groupCode: string | null;
    groupName: string | null;
    dataFotransactRoomDTO: DataFoTransactRoomDTO[];
    dataForeservationDTO: DataForeservationDTO;
}

export interface RoomShortInfo {
    roomGuid: string;
    roomName: string;
}
export interface ICombineGuest {
    id: number;
    guid: string;
    fullName: string;
    dataForeservation: DataForeservation;
    ten: string;
    roomName: string | null;
}
export interface InforGroupMaster {
    id: number;
    roomName: string | number | null;
    status: boolean;
}

export interface TransactionRoomInfo {
    id: number;
    guestId: string | null;
    arrivalDate: string | null;
    departureDate: string | null;
    rateCode: string | null;
    roomType: string | null;
    fixedRate: boolean | null;
    rate: number;
    comments: string | null;
    flightNo: string | null;
    printRate: true;
    status: number;
    flagType: number;
    nights: number;
    cutOfDate: string | null;
    arrivalPickUp: boolean;
    departurePickUp: boolean;
    confirmed: boolean;
    resSource: string | null;
    resMarket: string | null;
    packageCodes: string | null;
    specialsCodes: string | null;
    isNet: boolean;
    guid: string;
    hotelId: number;
    hotelGuid: string;
    isNoBkf: boolean;
    resChanel: string | null;
    origin: string | null;
    resType: string | null;
    paymentMethod: string | null;
    carPickUp: string | null;
    carPickUpTime: string | null;
    companyAgentGuid: string | null;
}
export interface DataCEditRsvn{
  dataForeservationDTO: DataForeservationDTO,
  dataFotransactRoomDTO: DataFoTransactRoomDTO,
  flyInfor: FlyInfor,
  pickup: Pickup,
  dataFoextraCharges: DataFoextraCharge[],
  dataRoomGroup: IEditRoomGroup,
  adults?: number,
  childs?: number
}
export interface IEditRoomGroup{
  roomNameGuid: string,
  roomName: string,
  roomTypeGuid: string,
  roomTypeName: string
}
export interface ResDataCEditRsvn{
  dataTrRoom: DataCEditRsvn,
  dataHistory: TrRoomHistory,
  paymentExpences: string,
  dataTrsGroup: TransactRoomsGroup
}
interface RoomWalkIns{
  roomTypeGuid: string,
  maxPerson: number,
  rate: number,
  guestGuid: string[],
  roomGuid: string,
  roomName: string
}

export interface CountOfRSVN{
  count: number
}

export interface NewWalkInData{
  dataFotransactRoomDTO: DataFoTransactRoomDTO,
  masterGuestGuid: string | null,
  roomWalkIns: RoomWalkIns[]
  dataForeservationDTO: DataForeservationDTO,
  flyInfor: FlyInfor,
  pickup: Pickup,
  dataFoextraCharges: DataFoextraCharge[]
}

export interface WalkInFormData{
  houseUse?: boolean,
  Upsell?: boolean,
  adultChild?: any,
  adults: number,
  arrivalDate: Date
  childs: number
  arrival?: Date,
  departure?: Date
  cod?: number
  comment?: string
  companyAgentGuid?: string
  confirmed?: undefined
  departureDate: Date
  deposit: number
  firstName: string
  fixedRate: boolean
  guestName: string
  isNet: boolean
  isNoBkf: boolean
  nights: number
  noPost: boolean
  packageCodes?: string | null,  
  paymentMethod?: string
  printRate?: boolean
  rate: number
  rateCode?: string | null
  rateRef: string | null,
  resChanel?: string
  resMarket?: string
  resOrigin?: string
  resSource?: string
  resType?: string
  roomGuid: string
  roomType: string
  specialsCodes?: string | null,
  title: string
  roomTypeUgr: string,
  comp?: boolean,
}
export interface TrRoomHistory{
  stay: number,
  lastRoom: string,
  roomRate: number,
  roomRevenue: number,
  totalRevenue: number
}
export interface AssignRoom{
  trsGuid: string,
  roomGuid: string,
  roomType: string, 
  roomName: string
}
export interface IDataFuncEditGroup{
  guidTsRoom?: string,
  rate?: number,
  groupCode?: string,
  arrivalDate?: string,
  departureDate?: string,
  comments: string,
  roomType?: string,
  cutOfDate?: string,
  confirmed?: boolean,
  companyAgentGuid?: string
}

export interface GuestHistoryYear {
  hotelGuid: string,
  listProfiles: string[],
  pageNumber: number,
  pageSize: number
}

export interface CompanyHistoryYear {
  hotelGuid: string,
  listCompanyOrAgent: string[],
  pageNumber: number,
  pageSize: number
}
export interface ITracerMessage {
  parent: number,
  parentMe: number,
  ngayThang: string,
  idfrom: number,
  idto: number,
  inHouse: number,
  inHouseGuid: string,
  guest: string,
  reservation: number,
  messageSubject: string,
  message: string,
  comment: string,
  status: number,
  flagType: number,
  dateFrom: string,
  dateTo: string,
  department: string,
  nguoiGui: string,
  ngayNhan: string,
  nguoiNhan: string,
  nguoiNhanThay: string,
  autoReminder: true,
  capDo: number,
  nguoiDung: number,
  nguoiDung2: number,
  resolveBy: string,
  resolveNote: string,
  status2: number,
  flagType2: number,
  doNotShowAgain: true,
  hotelGuid: string,
  id: string,
  userName: string
}
export interface PostingTracerCommon {
    type: number,
    dateFrom: string | null,
    dateTo: string | null
}
export interface ITracerMessageByOption {
  postingTracerCommon: PostingTracerCommon,
  dataFotracerMessageCreateDTO: ITracerMessage
}
export interface DataGetTracerMessage {
  flagType: number,
  tsRoomId: string ,
  hotelGuid: string
}
export interface SearchQueryTracerMessage {
  arrivalDate: string,
  departureDate: string,
  department: string,
  hotelGuid: string,
  pageNumber: number,
  pageSize: number
}
export interface ITracerMessageTable {
  ngayThang: string,
  messageSubject: string,
  message: string,
  comment: string,
  status: string,
  flagType: number,
  dateFrom: string,
  dateTo: string,
  department: string,
  id: string,
  check: number,
  userName: string,
  inHouseGuid: string,
  guest: string
}
export interface IMessage {
  parrent: number,
  parrentGuid: string,
  ngayThang: string,
  inHouse: number,
  inHouseGuid: string,
  messageFrom: string,
  messageSubject: string,
  message: string,
  comment: string,
  status: number,
  flagType: number,
  nguoiGui: string,
  ngayNhan: string,
  nguoiNhan: string,
  hotelGuid: string,
  id?: string,
  guid?: string
}
export interface IMessageByOption {
postingMessageCommon: PostingTracerCommon,
dataFomessageCreateDTO: IMessage
}
export interface SearchQueryMessage {
  arrivalDate: string | Date,
  departureDate: string | Date,
  hotelGuid: string,
  pageNumber: number,
  pageSize: number
}
export interface IMessageTable {
  ngayThang: string,
  time: string,
  messageSubject: string,
  message: string,
  comment: string,
  status: string,
  flagType: number,
  id: string,
  check: number,
  inHouseGuid: string,
  hotelId: string,
  nguoiNhan: string,
  nguoiGui: string,
  guid: string,
  roomName: string,
  guestName: string
}
export interface IDataSearchMessage {
  dataFomessage: IMessage,
  guestId: string,
  roomName: string
}