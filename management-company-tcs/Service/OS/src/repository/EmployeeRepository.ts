/* eslint-disable @typescript-eslint/no-explicit-any */
import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { Employee } from "../models/employee";
import { InforDepartment } from "../models/expandResponse/inforDepartment";
import { IPaginate, QuerySearch } from "../utils/helper";

export class EmployeeRepository extends KnexRepository<Employee> {
    constructor() {
        super(db, "Employee");
    }
    public async getListEmployeeByDepartmentGuid(
        departmentGuid: string
    ): Promise<InforDepartment[]> {
        return this.qb
            .select(
                this.knex.raw(
                    "Employee.GUID, Employee.LastName as Name, Employee.LastName, Employee.FirstName, NULL AS ParentGuid, Employee.AccountGuid"
                )
            )
            .where("Employee.DepartmentGuid", departmentGuid).andWhere("Employee.Status", 1);
    }
    public async getAllEmployee(departmentGuid: string, pagination: IPaginate, search: QuerySearch
    ): Promise<InforDepartment[]> {
        const query = this.qb.select(
            "Employee.GUID",
            "Employee.LastName",
            "Employee.FirstName",
            "Employee.AccountGuid",
        )
            .leftJoin("SubDepartment", {
                "SubDepartment.GUID": "Employee.SubDepartmentGuid",
            })
            .where(function () {
                this.where("SubDepartment.DepartmentGuid", departmentGuid)
                    .orWhere("Employee.DepartmentGuid", departmentGuid);
            })
            .andWhere("Employee.Status", 1)
            .limit(pagination.pageNumber)
            .offset(pagination.pageSize);

        if (search.firstName) {
            query.andWhereILike("Employee.FirstName", `%${search.firstName}%`);
        }
        if (search.lastName) {
            query.andWhereILike("Employee.LastName", `%${search.lastName}%`);
        }
        return await query;
    }

    public async totalCountEmployee(departmentGuid: string
    ): Promise<{ total: number }> {
        return await this.qb.count("*", { as: "total" })
            .leftJoin("SubDepartment", { "SubDepartment.GUID": "Employee.SubDepartmentGuid" })
            .where(function () {
                this.where("SubDepartment.DepartmentGuid", departmentGuid)
                    .orWhere("Employee.DepartmentGuid", departmentGuid);
            })
            .andWhere("Employee.Status", 1)
            .first();
    }

    public async getProfileByAccountGuid(
        accountGuid: string
    ): Promise<Employee> {
        return await this.qb
            .select(
                "Employee.GUID",
                "Employee.Code",
                "Employee.Phone",
                "Employee.CodeCD",
                "Employee.Roles",
                "Employee.DateJoin",
                "Employee.DateLeave",
                "Employee.DepartmentGuid",
                "Employee.SubDepartmentGuid",
                "Employee.LastName",
                "Employee.FirstName",
                "Employee.AccountGuid",
                "TimeOffLimit.TimeOffLimit"
            )
            .leftJoin("SubDepartment", {
                "SubDepartment.GUID": "Employee.SubDepartmentGuid",
            })
            .leftJoin("TimeOffLimit", {
                "Employee.GUID": "TimeOffLimit.EmployeeGuid",
            })
            .where("Employee.AccountGuid", accountGuid)
            .andWhere("Employee.Status", 1)
            .andWhereRaw(`YEAR(TimeOffLimit.Date)=${new Date().getFullYear()}`);
    }
    async getOneByGuid(guid: string): Promise<Employee> {
        return await this.qb
            .select()
            .leftJoin("SubDepartment", {
                "SubDepartment.GUID": "Employee.SubDepartmentGuid",
            })
            .leftJoin("TimeOffLimit", {
                "Employee.GUID": "TimeOffLimit.EmployeeGuid",
            })
            .where("Employee.GUID", guid)
            .andWhere("Employee.Status", 1)
            .andWhereRaw(`YEAR(TimeOffLimit.Date)=${new Date().getFullYear()}`);
    }
    async getTimeOffLimit(employeeGuid: string): Promise<any> {
        return await this.qb
            .select("TimeOffLimit.TimeOffLimit")
            .leftJoin("TimeOffLimit", {
                "Employee.GUID": "TimeOffLimit.EmployeeGuid",
            })
            .where("Employee.GUID", employeeGuid)
            .andWhere("Employee.Status", 1)
            .andWhereRaw(`YEAR(TimeOffLimit.Date)=${new Date().getFullYear()}`);
    }
    async getApprovedTimeOffDays(employeeGuid: string): Promise<any> {
        return await this.qb
            .select(this.knex.raw("SUM(TimeOffItem.Hours)/8 as ApprovedDays"))
            .leftJoin("Applicant", {
                "Employee.GUID": "Applicant.EmployeeGuid",
            }).
            leftJoin
            ("TimeOffItem", { "Applicant.GUID": "TimeOffItem.ApplicantGuid" })
            .where("Applicant.Status", 1)
            .andWhere("Applicant.EmployeeGuid", employeeGuid)
            .groupBy("Applicant.GUID");
    }
}
