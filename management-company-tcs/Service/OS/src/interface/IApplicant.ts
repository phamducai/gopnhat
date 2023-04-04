import { TimeOffItem } from "../models/timeOffItem";
import { Applicant } from "../models/applicant";
export interface AppicantInsertReqProps {
	applicant: Applicant;
	items: TimeOffItem[];
}
export default interface IApplicant {
	insert(data: AppicantInsertReqProps): Promise<Applicant>;
	findAll(): Promise<Applicant[]>;
	updateByGuid(guid: string, data: Applicant): Promise<boolean>;
	deleteById(guid: string): Promise<boolean>;
}
