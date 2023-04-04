import { TimeOffLimitRepository } from "../repository/TimeOffLimitRepository";
import { TimeOffLimit } from "../models/timeOffLimit";
import ITimeOffLimit from "../interface/ITimeOffLimit";
import { createGuid } from "../utils/helper";

class TimeOffLimitService implements ITimeOffLimit {
    private readonly _TimeOffTimeOffLimitService: TimeOffLimitRepository;
    constructor() {
        this._TimeOffTimeOffLimitService = new TimeOffLimitRepository();
    }

    insert = async (data: TimeOffLimit) => {
        data.GUID = createGuid();
        return await this._TimeOffTimeOffLimitService.create(data);
    };

    findAll = async () => {
        return await this._TimeOffTimeOffLimitService.findByCondition({ Status: 1 });
    };

    updateByGuid = async (guid: string, data: TimeOffLimit): Promise<boolean> => {
        return await this._TimeOffTimeOffLimitService.update(guid, data);
    };

    deleteById = async (guid: string): Promise<boolean> => {
        return await this._TimeOffTimeOffLimitService.update(guid, { Status: 0 });
    };

    updateLimit = (guid: string, data: TimeOffLimit): Promise<boolean> => {
        const getEmployee = this._TimeOffTimeOffLimitService.findOne(guid);
        if (getEmployee) {
            return this._TimeOffTimeOffLimitService.updateByCondition({EmployeeGuid : guid}, data);
        }else{
            return;   
        }
    };
}

export const TimeOffLimitServices = new TimeOffLimitService();
