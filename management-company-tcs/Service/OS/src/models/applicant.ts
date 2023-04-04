export interface Applicant {
    GUID?: string;
    FirstReview?: string | null;
    SecondReview?: string | null;
    CreatedBy: string;
    Conditions?: string;
    Reason: string;
    Status: number;
    EmployeeGuid: string;
    Images: string;
    DateFrom: Date;
    DateTo: Date;
    RejectReason: string;
    RejectDate: Date;
    TimeOffTypeGuid: string
}
