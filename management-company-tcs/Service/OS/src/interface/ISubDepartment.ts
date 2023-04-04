import { SubDepartment } from "../models/subDepartment";

export default interface ISubDepartment {
	insertSubDepartment(data: SubDepartment): Promise<SubDepartment>;
	findAllSubDepartment(): Promise<SubDepartment[]>;
	updateSubDepartmentByGuid(guid: string, data: SubDepartment): Promise<boolean>;
	deleteSubDepartmentByGuId(guid: string): Promise<boolean>;
	getSubDepartmentByGuidDeparment(guid: string): Promise<SubDepartment[]>;
}
