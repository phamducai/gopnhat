import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { Account } from "../models/account";
import { updatePassword } from "../models/updatePassword";
import * as crypto from "crypto";
export class AccountRepository extends KnexRepository<Account>{
    constructor() {
        super(db, "Account");
    }
}