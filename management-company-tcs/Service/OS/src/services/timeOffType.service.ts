import { TimeOffTypeRepository } from "../repository/TimeOffTypeRepository";
import { TimeOffType } from "../models/timeOffType";
import ITimeOffType from "../interface/ITimeOffType";
import { createGuid } from "../utils/helper";

class TimeOffTypeService implements ITimeOffType {
	private readonly _TimeOffTypeRepository: TimeOffTypeRepository;
	constructor() {
		this._TimeOffTypeRepository = new TimeOffTypeRepository();
	}

	insert = async (data: TimeOffType) => {
		data.GUID = createGuid();
		return await this._TimeOffTypeRepository.create(data);
	};

	findAll = async () => {
		return await this._TimeOffTypeRepository.findByCondition({ Status: 1 });
	};

	updateByGuid = async (guid: string, data: TimeOffType): Promise<any> => {
		return await this._TimeOffTypeRepository.update(guid, data);
	};

	deleteById = async (guid: string): Promise<boolean> => {
		return await this._TimeOffTypeRepository.update(guid, { Status: 0 });
	};
}

export const TimeOffTypeServices = new TimeOffTypeService();
