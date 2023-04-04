import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { ListApplcant, TimeOffHistory, TimeOffItem } from "../models/timeOffItem";

export class TimeOffItemRepository extends KnexRepository<TimeOffItem> {
    constructor() {
        super(db, "TimeOffItem");
    }
    public async getAllApplicant(employeeGuid: string[]): Promise<ListApplcant[]> {
        return await this.qb.select("TimeOffItem.GUID as TimeOffItemGuid", "TimeOffItem.Date", "TimeOffItem.Hours", "TimeOffItem.TimeOffTypeGuid", "TimeOffItem.Status", "Applicant.GUID as ApplicantGuid", "Applicant.EmployeeGuid")
            .leftJoin("Applicant", { "Applicant.GUID": "TimeOffItem.ApplicantGuid" })
            .whereIn("Applicant.EmployeeGuid", employeeGuid);
    }
    public async findAllByEmployee(employeeGuid: string): Promise<TimeOffHistory[]> {
        return await this.qb.select("TimeOffItem.GUID",
            "TimeOffItem.Date",
            "TimeOffItem.Hours",
            "TimeOffItem.ApplicantGuid",
            "TimeOffItem.Status",
            "Applicant.Reason",
            "Applicant.Images",
            "Applicant.DateFrom",
            "Applicant.DateTo",
            "Applicant.FirstReview",
            "Applicant.SecondReview",
            "Applicant.TimeOffTypeGuid",
            "TimeOffItem.RejectReason",
            "TimeOffItem.RejectDate",
            "TimeOffItem.created_at"
        )
            .leftJoin("Applicant", { "Applicant.GUID": "TimeOffItem.ApplicantGuid" })
            .leftJoin("Employee", { "Employee.GUID": "Applicant.EmployeeGuid" }).where("Applicant.EmployeeGuid", employeeGuid).orderBy("TimeOffItem.created_at", "desc");
    }
}
