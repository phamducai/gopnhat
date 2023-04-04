import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { Role } from "../models/roles";
export class RoleRepository extends KnexRepository<Role>{
    constructor() {
        super(db, "Roles");
    }
}