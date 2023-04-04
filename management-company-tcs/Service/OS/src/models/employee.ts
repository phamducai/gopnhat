import { IPagination } from "..//utils/helper";
import { InforDepartment } from "./expandResponse/inforDepartment";
import { ListApplcant } from "./timeOffItem";

export interface Employee {
    GUID?: string;
    Code: string;
    FirstName: string;
    LastName: string;
    Status: number;
    Phone: string;
    DepartmentGuid: string;
    AccountGuid: string;
    SubDepartmentGuid?: string;
    Roles: string;
    DateJoin: Date;
    DateLeave?: Date;
    CodeCD?: string;
    TimeOffLimit: number
}
export interface ListApplicantByEmployee {
    listDataEmployee: InforDepartment[],
    listApplicantByEmployee: ListApplcant[],
    pagination: IPagination
}

export interface TimeOffInfo {
    timeOffLimit: number,
    approvedDays: number,
    availableDays: number,
}
export interface ListApplicant {
    DateFrom: Date,
    DateTo: Date,
    Hours: number,
    TimeOffTypeGuid: string,
    Status: 1,
    ApplicantGuid: string,
    EmployeeGuid: string,
    Name: string,
    LastName: string,
    FirstName: string,
    ParentGuid: string
}