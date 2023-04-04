import { Department } from "../models/department";

export default interface ICompany {
	insertDepartment(data: Department): Promise<Department>;
	findDepartmentByParentId(companyId: string): Promise<Department[]>;
	updateDepartmentByGuid(guid: string, data: Department): Promise<boolean>;
	deleteDepartmentById(guid: string): Promise<boolean>;
}
