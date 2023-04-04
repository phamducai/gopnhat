import { SubDepartmentRepository } from "../repository/SubDepartmentRepository";
import { SubDepartment } from "../models/subDepartment";
import ISubDepartment from "../interface/ISubDepartment";
import { EmployeeRepository } from "../repository/EmployeeRepository";

class SubDepartmentService implements ISubDepartment {
    private readonly _SubDepartmentRepository: SubDepartmentRepository;
    private readonly _EmployeeRepository: EmployeeRepository;
    constructor() {
        this._SubDepartmentRepository = new SubDepartmentRepository();
        this._EmployeeRepository = new EmployeeRepository();
    }

    insertSubDepartment = async (data: SubDepartment) => {
        return await this._SubDepartmentRepository.create(data);
    };

    findByParentId = async (departmentGuid: string) => {
        return await this._SubDepartmentRepository.findByCondition({
            DepartmentGuid: departmentGuid,
        });
    };
    getInforDepartment = async (departmentGuid: string) => {
        const listEmployeeWithDepartment = await this._EmployeeRepository.getListEmployeeByDepartmentGuid(departmentGuid);
        const listEmployeeWithSubDepartment = await this._SubDepartmentRepository.getInfoDepartment(departmentGuid);        
        return listEmployeeWithDepartment.concat(listEmployeeWithSubDepartment);
    };
    findAllSubDepartment = async () => {
        return await this._SubDepartmentRepository.findAll();
    };

    updateSubDepartmentByGuid = async (
        guid: string,
        data: SubDepartment
    ): Promise<boolean> => {
        return await this._SubDepartmentRepository.update(guid, data);
    };

    deleteSubDepartmentByGuId = async (guid: string): Promise<boolean> => {
        return await this._SubDepartmentRepository.update(guid, { Status: 0 });
    };

    getSubDepartmentByGuidDeparment = async (DepartmentGuid: string): Promise<SubDepartment[]> => {
        return await this._SubDepartmentRepository.findByCondition({ DepartmentGuid });
    };

}

export const SubDepartmentServices = new SubDepartmentService();
