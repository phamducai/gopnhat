import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { SubDepartment } from "../models/subDepartment";
import { InforDepartment } from "../models/expandResponse/inforDepartment";

export class SubDepartmentRepository extends KnexRepository<SubDepartment>{
    constructor() {
        super(db, "SubDepartment");
    }
    public async getInfoDepartment(departmentGuid: string): Promise<InforDepartment[]> {
        return await this.qb.select(
            "Employee.GUID",
            "SubDepartment.Name",
            "Employee.LastName",
            "Employee.FirstName",
            "Employee.SubDepartmentGuid as ParentGuid",
            "Employee.AccountGuid",
        )
            .join("Employee", { "SubDepartment.GUID": "Employee.SubDepartmentGuid" })
            .union(qb => qb.select(this.knex.raw("SubDepartment.GUID, SubDepartment.Name, NULL as FirstName, NULL as LastName, SubDepartment.ParentGuid, NULL as AccountGuid")).from("SubDepartment")
                .where("SubDepartment.DepartmentGuid", departmentGuid))
            .where("SubDepartment.DepartmentGuid", departmentGuid).andWhere("Employee.Status", 1);
    }
}