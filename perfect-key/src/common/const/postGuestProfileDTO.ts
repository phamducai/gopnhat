import GLobalPkm from 'common/global';
import { MainGuestInfo, PostGuestProfileDTO } from "common/model-profile";

export const MAIN_GUEST_INFO : MainGuestInfo = {
    guestName: null,
    firstName: null,
    titlesGuid: '712b760e-214b-4a3a-9848-8c575654f9d1',
    adress: null,
    city: null,
    profession: null,
    noOfGuest: 0,
    email: null,
    phone: null,
    languages: null,
    nationalityGuid: null,
    agentGuid: null,
    companyGuid: null,
    source: null,
    groupsGuest: 0,
    prefLast: null,
    comments: null,
    passport: null,
    visaNumber: null,
    visaExpDate: null,
    entryPort: null,
    entryDate: null,
    adnumber: null,
    ccno: null,
    ccexpDate: null,
    ccmadeBy: 0,
    deposit: 0,
    taxCode: null,
    guestType: null,
    birthDay: null,
    accountCode: null,
    passportDate: null,
}

const POST_GUEST_PROFILE_DTO : PostGuestProfileDTO = {
    parent: 0,
    guestName: null,
    firstName: null,
    titlesGuid: null,
    adress: null,
    zip: null,
    city: null,
    profession: null,
    noOfGuest: 0,
    email: null,
    phone: null,
    languages: null,
    country: 0,
    nationalityGuid: null,
    agentGuid: null,
    companyGuid: null,
    source: null,
    groupsGuest: 0,
    prefLast: null,
    comments: null,
    passport: null,
    visaNumber: null,
    visaExpDate: null,
    entryPort: null,
    entryDate: null,
    adnumber: null,
    ccno: null,
    ccexpDate: null,
    ccmadeBy: 0,
    deposit: 0,
    taxCode: null,
    flagType: 0,
    nguoiDung: 0,
    capDo: 0,
    tgtn: null,
    guestType: null,
    birthDay: null,
    balance: 0,
    idfix: 0,
    parentGuid: null,
    accountCode: null,
    passportDate: null,
    khachNn: null,
    gioiTinh: null,
    loaiGiayTo: null,
    ngheNghiep: null,
    danToc: null,
    tonGiao: null,
    mucDichLuuTru: null,
    quocGiaNew: null,
    tinh: null,
    huyen: null,
    xa: null,
    soNhaDuong: null,
    hanTamTru: null,
    ghiChu: null,
    vietKieu: null,
    loaiThiThuc: null,
    noiCapThiThiThuc: null,
    lyDoHetHanTamTru: null,
    noiDungLyDoHetHan: null,
    visaDate: null,
    hotelGuid: null
}
export const POST_NEW_GUEST_PROFILE_DTO: PostGuestProfileDTO = {
    parent: 0,
    guestName: "",
    firstName: "",
    titlesGuid: `${GLobalPkm.defaultBytes32}`,
    adress: "",
    zip: "",
    city: "",
    profession: "",
    noOfGuest: 0,
    email: "",
    phone: "",
    languages: `${GLobalPkm.defaultBytes32}`,
    country: 0,
    nationalityGuid: `${GLobalPkm.defaultBytes32}`,
    agentGuid: `${GLobalPkm.defaultBytes32}`,
    companyGuid: `${GLobalPkm.defaultBytes32}`,
    source: "",
    groupsGuest: 0,
    prefLast: "",
    comments: "",
    passport: "",
    visaNumber: "",
    visaExpDate: "2021-08-01T13:14:29.278Z",
    entryPort: "",
    entryDate: "2021-08-01T13:14:29.278Z",
    adnumber: "",
    ccno: "",
    ccexpDate: "2021-08-01T13:14:29.278Z",
    ccmadeBy: 0,
    deposit: 0,
    taxCode: "",
    flagType: 0,
    nguoiDung: 0,
    capDo: 0,
    tgtn: "2021-08-01T13:14:29.278Z",
    guestType: `${GLobalPkm.defaultBytes32}`,
    birthDay: "2021-08-01T13:14:29.278Z",
    balance: 0,
    idfix: 0,
    parentGuid: `${GLobalPkm.defaultBytes32}`,
    accountCode: "",
    passportDate: "2021-08-01T13:14:29.278Z",
    khachNn: "",
    gioiTinh: "",
    loaiGiayTo: "",
    ngheNghiep: "",
    danToc: "",
    tonGiao: "",
    mucDichLuuTru: "",
    quocGiaNew: "",
    tinh: "",
    huyen: "",
    xa: "",
    soNhaDuong: "",
    hanTamTru: "2021-08-01T13:14:29.278Z",
    ghiChu: "",
    vietKieu: "",
    loaiThiThuc: "",
    noiCapThiThiThuc: "",
    lyDoHetHanTamTru: "",
    noiDungLyDoHetHan: "",
    visaDate: "2021-08-01T13:14:29.278Z",
    hotelGuid: ""
}
export default POST_GUEST_PROFILE_DTO;