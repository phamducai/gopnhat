import { DepartmentRepository } from "../repository/DepartmentRepository";
import { Department } from "../models/department";
import IDepartment from "../interface/IDepartment";
import { SubDepartmentRepository } from "../repository/SubDepartmentRepository";

class DepartmentService implements IDepartment {
	private readonly _DepartmentRepository: DepartmentRepository;
	private readonly _SubDepartmentRepository = new SubDepartmentRepository();

	constructor() {
		this._DepartmentRepository = new DepartmentRepository();
	}

	insertDepartment = async (data: Department) => {
		return await this._DepartmentRepository.create(data);
	};

	getById = async (guid: string) => {
		return await this._DepartmentRepository.findOne(guid);
	};

	findDepartmentByParentId = async (companyId: string) => {
		return await this._DepartmentRepository.findByCondition({
			CompanyGuid: companyId,
		});
	};

	findDepartmentByCode = async (code: string) => {
		return await this._DepartmentRepository.findByCondition({
			Code: code,
		});
	};

	updateDepartmentByGuid = async (
		guid: string,
		data: Department
	): Promise<any> => {
		return await this._DepartmentRepository.update(guid, data);
	};

	deleteDepartmentById = async (guid: string): Promise<boolean> => {
		return (
			(await this._DepartmentRepository.update(guid, { Status: 0 })) &&
			(await this._SubDepartmentRepository.updateByCondition(
				{ DepartmentGuid: guid },
				{ Status: 0 }
			))
		);
	};
}

export const DepartmentServices = new DepartmentService();
