import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { accountRoleLink } from "../models/accountRoleLink";
export class AccountRoleLinkRepository extends KnexRepository<accountRoleLink>{
    constructor() {
        super(db, "AccountRoleLinks");
    }
}