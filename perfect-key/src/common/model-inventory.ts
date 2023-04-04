import { GuestProfile } from 'common/model-profile';
import { ListTsRoomPlan } from './model-booking';
export interface NumberOfRooms{
  id: string,
  name: string,
  count: number
}

export interface RoomInfo{
  guid: string,
  parentGuid: string | null,
  so: string,
  loai: string ,
  tinhTrang: number,
  trangThai: number | string,
  donGia: number | null,
  dienTich: number | null,
  dacDiem: string | null,
  ghiChu: string | null,
  nhom: string | null,
  miniBar: string | null,
  nguoiDung: number | null,
  capDo: number | null,
  tgtn: Date | null,
  backView: boolean | null,
  sizeView: boolean | null,
  frontView: boolean | null,
  donViTienTe: number | null,
  floor: number | null,
  block: string | null,
  sections: string | null,
  connectingSuite: string | null,
  inspected: number | null,
  cleanDirty: number,
  vacantOcc: number | null,
  seq: number | null,
  hotelGuid: string | null,
  statusRec: number | null,
  maxPerson: number | null,
  roomName: string | number,
  date: string | null,
  fullName: string
}

export interface RoomInfoUpdateStatus{
  cleanDirty: number,
}
export interface RoomsInARoomType{
  roomType: string;
  rooms: RoomInfo[]
}
export interface FloorInv{
  key: number,
  name: string, 
}

export interface RoomType{
  guid: string,
  parentGuid?: string,
  ma?: string,
  ten: string,
  ghiChu?: string,
  donGia?: number,
  hotelGuid?: string,
  statusRec?: number,
  maxPerson?: number
}
export interface ListCardRoomPlan{
  guid: string,
  roomGuid: string,
  guestGuid: string,
  parentGuid: string,
  roomNumber: number | string,
  guestNumber: number | string,
  roomName: string,
  roomType: string,
  fullNameGuestMain: string,
  amountGuest: number,
  groupCode: number | string,
  dateToAndForm: string,
  rate: number | string,
  iconName: string,
  colorIcon: string,
  colorInfor: string,
  nameCompanyOrAgent: string,
  hotelGuid: string,
  statusRoom: boolean,
  statusInfor: boolean,
  conunt?: number,
  floor: number,
  cleanDirty: number,
  status: number,
  arrivalDate: Date | string ,
  departureDate: Date | string,
  tinhTrang: number,
  isChecked?: boolean
}
export interface PaginationRoom{
  hotelGuid: string,
  floor: number,
  pageNumber: number,
  pageSize: number,
  roomName?: string | null,
  roomType?: string | null
}

export interface PaginationUnAssign{
  pageNumber: number,
  pageSize: number,
}

export interface ResPagination{
  TotalCount: number,
  TotalPages: number,
}
export interface ResHeaderINV extends ResPagination{
  inspected: number
  orderService: number
  outOfOrder: number
  unInspected: number
  vacantClean: number
  vacantDirty: number
}
export interface ResListRoom{
  listCardRoomPlan: ListCardRoomPlan[],
  resPagination: ResPagination
  listRoomGuid: string[],
  resHeaderInv: ResHeaderINV
}
export interface ResRoomPlan{
  listCardRoomPlan: ListCardRoomPlan[],
  resPagination: ResPagination
  dataTransactRoom: ListTsRoomPlan[],
  listGuestProfile: GuestProfile[],
  resHeaderInv: ResHeaderINV
}
export interface RoomMapRoomType{
  hotelGuid: string,
  roomGuid: string,
  roomName: string,
  roomType: string,
  roomTypeName: string
}
export interface PostBreakShared extends RoomMapRoomType{
  breakShareStartDate: Date,
  breakShareEndDate: Date,
  rate: number
}
export interface IUpdateStatusRoom{
  hotelGuid: string,
  floor: number,
  flagType: number,
  status: number,
  roomId: string
}
export interface IHeplerChangeSatusRoom{
  flagType: number,
  status: number
}