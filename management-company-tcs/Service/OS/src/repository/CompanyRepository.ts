import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { Company } from "../models/company";

export class CompanyRepository extends KnexRepository<Company>{
    constructor() {
        super(db, "Company");
    }
}