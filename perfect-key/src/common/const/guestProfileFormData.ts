/* eslint-disable @typescript-eslint/no-explicit-any */
import { MainGuestInfo } from "common/model-profile";
import { MAIN_GUEST_INFO } from "./postGuestProfileDTO";

export interface GuestProfileFormData{
    main: MainGuestInfo,
    memberInfo: any,
    more: any,
    passport: any
}

const GUEST_PROFILE_FORM_DATA : GuestProfileFormData = {
    main: {...MAIN_GUEST_INFO},
    memberInfo: {},
    more: {},
    passport: {}
}

export default GUEST_PROFILE_FORM_DATA;