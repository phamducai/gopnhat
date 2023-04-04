export interface TimeOffType {
	GUID?: string;
	Code: string;
	Title: string;
	HourLimit: number;
	Conditions?: JSON;
	Status: number;
}
