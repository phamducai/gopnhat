import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { Department } from "../models/department";
import { createGuid } from "../utils/helper";

export class DepartmentRepository extends KnexRepository<Department>{
    constructor() {
        super(db, "Department");
    }
}