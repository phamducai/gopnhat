import { MasterAndMemberProfiles } from "common/model-profile";
import GUEST_PROFILE_DEFAULT_VALUE from "./guestProfileDefaultValue";

const MASTER_AND_MEMBER_PROFILES : MasterAndMemberProfiles = {
    masterProfile: {...GUEST_PROFILE_DEFAULT_VALUE},
    memberProfiles: []
}

export default MASTER_AND_MEMBER_PROFILES;