import { TimeOffItemRepository } from "../repository/TimeOffItemRepository";
import { TimeOffItem } from "../models/timeOffItem";
import ITimeOffItem from "../interface/ITimeOffItem";
import { createGuid } from "../utils/helper";

class TimeOffItemService implements ITimeOffItem {
    private readonly _TimeOffItemRepository: TimeOffItemRepository;
    constructor() {
        this._TimeOffItemRepository = new TimeOffItemRepository();
    }

    insert = async (data: TimeOffItem) => {
        data.GUID = createGuid();
        return await this._TimeOffItemRepository.create(data);
    };

    findAll = async () => {
        return await this._TimeOffItemRepository.findByCondition({ Status: 1 });
    };

    findOne = async (guid: string) => {
        return await this._TimeOffItemRepository.findOne(guid);
    };

    findOneByGuid = async (guid: string) => {
        return await this._TimeOffItemRepository.findByCondition({
            ApplicantGuid: guid
        });
    };

    findAllByEmployee = async (employeeGuid: string): Promise<any> => {
        return await this._TimeOffItemRepository.findAllByEmployee(employeeGuid);
    }
    updateByGuid = async (guid: string, data: TimeOffItem): Promise<any> => {
        return await this._TimeOffItemRepository.updateByCondition({ GUID: guid, Status: 0 }, data);
    };
    updateStatusByApplicant = async (applicantGuid: string, status: number): Promise<any> => {
        return await this._TimeOffItemRepository.updateByCondition({ ApplicantGuid: applicantGuid }, { Status: status });
    };

    deleteById = async (guid: string): Promise<boolean> => {
        return await this._TimeOffItemRepository.update(guid, { Status: 0 });
    };
}

export const TimeOffItemServices = new TimeOffItemService();
