import { ApplicantRepository } from "../repository/ApplicantRepository";
import { Applicant } from "../models/applicant";
import IApplicant, { AppicantInsertReqProps } from "../interface/IApplicant";
import { createGuid } from "../utils/helper";

class ApplicantService implements IApplicant {
    private readonly _ApplicantRepository: ApplicantRepository;
    constructor() {
        this._ApplicantRepository = new ApplicantRepository();
    }

    insert = async (data: AppicantInsertReqProps): Promise<Applicant> => {
        data.applicant.GUID = createGuid();
        return await this._ApplicantRepository.insert(data);
    };

    findAll = async () => {
        return await this._ApplicantRepository.findAll();
    };
    findOneByGuid = async (guid: string) => {
        return await this._ApplicantRepository.findOne(guid);
    };
    updateByGuid = async (guid: string, data: Applicant): Promise<boolean> => {
        return await this._ApplicantRepository.updateByCondition({ GUID: guid, Status: 0 }, data);
    };

    findAllByEmployee = async (employeeGuid: string): Promise<any> => {
        return await this._ApplicantRepository.findAllByEmployee(employeeGuid);
    }

    deleteById = async (guid: string): Promise<boolean> => {
        return await this._ApplicantRepository.update(guid, { Status: 0 });
    };
    findExisted = async (employeeGuid: string, dateFrom: Date, dateTo: Date) => {
        return await this._ApplicantRepository.findExisted(employeeGuid, dateFrom, dateTo);
    }
}

export const ApplicantServices = new ApplicantService();
