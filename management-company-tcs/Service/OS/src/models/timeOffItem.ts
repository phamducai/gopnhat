//STATUS = 0 = PENDING; 
//STATUS = 1 = APPROVED; 
//STATUS = 2 = REJECTED; 
//STATUS = 3 = CANCELLED; 
export interface TimeOffItem {
	GUID?: string;
	Date: Date;
	Hours: number;
	MorningNoon?: number;
	ApplicantGuid?: string;
	TimeOffTypeGuid: string;
	Status: number;
	ReviewedBy?: string | null;
}
export interface TimeOffHistory {
	GUID?: string;
	Date: Date;
	Hours: number;
	ApplicantGuid: string;
	ReviewedBy?: string | null;
	Status: number;
	Reason: string;
	TimeOffTypeGuid: string;
	Images: string;
}
export interface ListApplcant {
	DateFrom: Date,
	DateTo: Date,
	Hours?: number,
	TimeOffTypeGuid: string,
	Status: number,
	ApplicantGuid: string
    EmployeeGuid: string
}