
const Role = {
    FO_FOM_GM: ["Admin", "FO", "GM", "FOM"],  //inhouse, booking, rsvn
    FO_FOM_GM_HSKP: ["Admin", "FO", "GM", "FOM", "HSKP"], // cashier 
    FB_FO: ["Admin", "FB", "FO"],
    FOM_HSKP: ["Admin", "FOM", "HSKP"],
    GM: ["Admin", "GM"],
    FO: ["Admin", "FO"],    //checkin, checkout
    HSKP: ["Admin", "HSKP"],
    FOM: ["Admin", "FOM"],
    FO_FB: ["Admin", "FO", "FB"],
    FO_FB_HSKP_GM: ["Admin", "FO", "GM", "FB", "HSKP"],
    FO_GM: ["Admin", "FO", "GM"],
    NIGHT_AUDITOR: ["Admin", "NightAuditor"],
    FO_HSKP: ["Admin", "FO", "HSKP"]
}
export default Role;
// ClaimType = "orgRoles";
// Admin = "Admin";
// FO = "FO";
// FC = "FC";
// FB = "FB";
// FOM = "FOM";
// GM = "GM";
// NightAuditor = "NightAuditor";
// HSKP = "HSKP";
// Member = "Member";