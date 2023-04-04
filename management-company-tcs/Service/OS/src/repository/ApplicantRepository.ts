import { KnexRepository } from "../utils/baseReponsitory";
import db from "../config/db";
import { Applicant } from "../models/applicant";
import { ListApplcant, TimeOffItem } from "../models/timeOffItem";

interface AppicantInsertReqProps {
    applicant: Applicant;
    items: TimeOffItem[];
}
export class ApplicantRepository extends KnexRepository<Applicant> {
    constructor() {
        super(db, "Applicant");
    }
    async insert({
        applicant,
        items,
    }: AppicantInsertReqProps): Promise<Applicant> {
        try {
            await this.knex.transaction(async (trx) => {
                await this.qb.insert(applicant, ["GUID"]).transacting(trx);
                const inserted = await this.qb
                    .select("GUID")
                    .orderBy("created_at", "desc")
                    .first()
                    .transacting(trx);

                items.forEach((item: TimeOffItem) => {
                    item.ApplicantGuid = inserted.GUID;
                });
                return await this.knex("TimeOffItem")
                    .insert(items)
                    .transacting(trx);
            });
            return null;
        } catch (error) {
            throw Error(error);
        }
    }
    async findAllByEmployee(employeeGuid: string): Promise<Applicant[]> {
        return await this.qb.select("Applicant.GUID",
            "Applicant.Status",
            "Applicant.Reason",
            "Applicant.Images",
            "Applicant.DateFrom",
            "Applicant.DateTo",
            "Applicant.FirstReview",
            "Applicant.SecondReview",
            "Applicant.RejectReason",
            "Applicant.TimeOffTypeGuid",
            "Applicant.created_at"
        ).sum("TimeOffItem.Hours as TotalHours")
            .leftJoin("TimeOffItem", { "Applicant.GUID": "TimeOffItem.ApplicantGuid" })
            .leftJoin("Employee", { "Employee.GUID": "Applicant.EmployeeGuid" }).where("Applicant.EmployeeGuid", employeeGuid).groupBy("Applicant.GUID").orderBy("Applicant.created_at", "desc");
    }
    async findExisted(employeeGuid: string, dateFrom: Date, dateTo: Date): Promise<Applicant[]> {
        try {
            const res = await this.qb.whereIn("Status", [0, 1]).andWhere({ "EmployeeGuid": employeeGuid }).andWhere("DateFrom", ">=", dateFrom).andWhere("DateTo", "<=", dateTo);
            if (res) {
                return res;
            }
            return null;
        } catch (error) {
            throw Error(error);
        }
    }
    public async getAllApplicant(employeeGuid: string[], dateFrom: Date, dateTo: Date): Promise<ListApplcant[]> {
        const query = this.qb
        .select("GUID as ApplicantGuid", "DateFrom", "DateTo", "TimeOffTypeGuid", "Status", "EmployeeGUID as EmployeeGuid")
        .whereIn("Applicant.EmployeeGuid", employeeGuid);
        if(dateFrom || dateTo){
            query.andWhereBetween("DateFrom", [dateFrom, dateTo]);
        }else{
            query.andWhereBetween("DateFrom", [new Date(), new Date(new Date().getDate() + 30)]);
        }
        return await query;
    }
}
